import express from 'express';
import pool from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth, requireRole('teacher'));

const usernamePattern = /^[a-z0-9_-]+$/;

// C3: GET /api/teacher/children
router.get('/children', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, cp.age, cp.class_level
       FROM teacher_children tc
       JOIN users u ON u.id = tc.child_id
       LEFT JOIN children_profiles cp ON cp.user_id = u.id
       WHERE tc.teacher_id = $1
       ORDER BY u.name`,
      [req.user.id],
    );
    return res.status(200).json({ success: true, data: { children: result.rows } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/teacher/children — claim an existing child by username
router.post('/children', async (req, res) => {
  if (typeof req.body.username !== 'string') {
    return res.status(400).json({ success: false, message: 'Identifiant invalide.' });
  }

  const username = req.body.username.trim().toLowerCase();
  if (username.length < 3 || username.length > 60 || !usernamePattern.test(username)) {
    return res.status(400).json({ success: false, message: 'Identifiant invalide.' });
  }

  try {
    const userResult = await pool.query(
      'SELECT id, name, role FROM users WHERE username = $1',
      [username],
    );

    if (userResult.rows.length === 0 || userResult.rows[0].role !== 'child') {
      return res.status(404).json({
        success: false,
        message: 'Aucun élève trouvé pour cet identifiant.',
      });
    }

    const childId = userResult.rows[0].id;
    await pool.query(
      'INSERT INTO teacher_children (teacher_id, child_id) VALUES ($1, $2)',
      [req.user.id, childId],
    );

    const childResult = await pool.query(
      `SELECT u.id, u.name, u.email, cp.age, cp.class_level
       FROM users u
       LEFT JOIN children_profiles cp ON cp.user_id = u.id
       WHERE u.id = $1`,
      [childId],
    );

    return res.status(201).json({
      success: true,
      data: { child: childResult.rows[0] },
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Cet élève est déjà dans ta classe.',
      });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// C2: GET /api/teacher/homework
router.get('/homework', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT h.id, h.title, h.subject,
              to_char(h.due_date, 'YYYY-MM-DD') AS due_date,
              h.estimated_minutes, h.difficulty, h.priority, h.created_at,
              u.id AS child_id, u.name AS child_name
       FROM homework h
       JOIN users u ON u.id = h.child_id
       WHERE h.teacher_id = $1
       ORDER BY h.created_at DESC`,
      [req.user.id],
    );
    const homework = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      subject: row.subject,
      dueDate: row.due_date,
      estimatedMinutes: row.estimated_minutes,
      difficulty: row.difficulty,
      priority: row.priority,
      createdAt: row.created_at,
      child: { id: row.child_id, name: row.child_name },
    }));
    return res.status(200).json({ success: true, data: { homework } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Cahier §4.4: subtask count is derived from estimated duration, not difficulty.
function subtaskCountForMinutes(minutes) {
  if (minutes <= 15) return 1;
  if (minutes <= 30) return 2;
  return 3;
}

// C1: POST /api/teacher/homework + subtask auto-generation (1/2/3 rule by duration)
router.post('/homework', async (req, res) => {
  const { childId, title, description, subject, dueDate, estimatedMinutes, difficulty, priority } = req.body;

  if (!childId || !title?.trim() || !subject?.trim() || !dueDate || !estimatedMinutes || !difficulty) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate) || isNaN(Date.parse(dueDate))) {
    return res.status(400).json({ success: false, message: 'dueDate must be a valid date (YYYY-MM-DD)' });
  }
  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ success: false, message: 'difficulty must be easy, medium, or hard' });
  }

  const parsedChildId = Number(childId);
  const parsedMinutes = Number(estimatedMinutes);
  const parsedPriority = Number(priority) || 2;

  if (!Number.isInteger(parsedChildId) || parsedChildId <= 0) {
    return res.status(400).json({ success: false, message: 'childId invalid' });
  }
  if (!Number.isInteger(parsedMinutes) || parsedMinutes <= 0) {
    return res.status(400).json({ success: false, message: 'estimatedMinutes must be a positive integer' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const access = await client.query(
      `SELECT 1 FROM teacher_children WHERE teacher_id = $1 AND child_id = $2`,
      [req.user.id, parsedChildId],
    );
    if (access.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(403).json({ success: false, message: 'Child not assigned to this teacher' });
    }

    const hwResult = await client.query(
      `INSERT INTO homework
         (child_id, teacher_id, title, description, subject, due_date, estimated_minutes, difficulty, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [parsedChildId, req.user.id, title.trim(), description?.trim() || null, subject.trim(), dueDate, parsedMinutes, difficulty, parsedPriority],
    );
    const homeworkId = hwResult.rows[0].id;

    const subtaskCount = subtaskCountForMinutes(parsedMinutes);
    const tasks = [];
    for (let i = 1; i <= subtaskCount; i++) {
      const taskResult = await client.query(
        `INSERT INTO tasks (homework_id, title, task_order)
         VALUES ($1, $2, $3)
         RETURNING id, title, status, task_order`,
        [homeworkId, `Étape ${i}`, i],
      );
      const t = taskResult.rows[0];
      tasks.push({ id: t.id, title: t.title, status: t.status, taskOrder: t.task_order });
    }

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Homework created',
      data: {
        homework: {
          id: homeworkId,
          childId: parsedChildId,
          title: title.trim(),
          description: description?.trim() || null,
          subject: subject.trim(),
          dueDate,
          estimatedMinutes: parsedMinutes,
          difficulty,
          priority: parsedPriority,
          tasks,
        },
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});

// C4: GET /api/teacher/reports/:childId (rolling 7-day count)
router.get('/reports/:childId', async (req, res) => {
  const childId = Number(req.params.childId);
  if (!Number.isInteger(childId) || childId <= 0) {
    return res.status(400).json({ success: false, message: 'invalid childId' });
  }

  try {
    const access = await pool.query(
      `SELECT u.name FROM teacher_children tc
       JOIN users u ON u.id = tc.child_id
       WHERE tc.teacher_id = $1 AND tc.child_id = $2`,
      [req.user.id, childId],
    );
    if (access.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Child not assigned to this teacher' });
    }
    const childName = access.rows[0].name;

    const totalsResult = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'completed') AS completed,
         COUNT(*) FILTER (WHERE status = 'postponed') AS postponed
       FROM task_progress
       WHERE child_id = $1
         AND date >= CURRENT_DATE - INTERVAL '6 days'`,
      [childId],
    );

    const dailyResult = await pool.query(
      `SELECT
         date::text,
         COUNT(*) FILTER (WHERE status = 'completed') AS completed,
         COUNT(*) FILTER (WHERE status = 'postponed') AS postponed
       FROM task_progress
       WHERE child_id = $1
         AND date >= CURRENT_DATE - INTERVAL '6 days'
       GROUP BY date
       ORDER BY date DESC`,
      [childId],
    );

    const homeworkResult = await pool.query(
      `SELECT h.id, h.title, h.subject,
              to_char(h.due_date, 'YYYY-MM-DD') AS due_date,
              h.estimated_minutes, h.difficulty, h.priority,
              COUNT(t.id) AS total_tasks,
              COUNT(t.id) FILTER (WHERE t.status = 'completed') AS completed_tasks
       FROM homework h
       LEFT JOIN tasks t ON t.homework_id = h.id
       WHERE h.child_id = $1 AND h.teacher_id = $2
       GROUP BY h.id
       ORDER BY h.created_at DESC
       LIMIT 10`,
      [childId, req.user.id],
    );

    const totals = totalsResult.rows[0];

    return res.status(200).json({
      success: true,
      data: {
        child: { id: childId, name: childName },
        totals: {
          completed: Number(totals.completed),
          postponed: Number(totals.postponed),
        },
        daily: dailyResult.rows.map((row) => ({
          date: row.date,
          completed: Number(row.completed),
          postponed: Number(row.postponed),
        })),
        homework: homeworkResult.rows.map((row) => ({
          id: row.id,
          title: row.title,
          subject: row.subject,
          dueDate: row.due_date,
          estimatedMinutes: row.estimated_minutes,
          difficulty: row.difficulty,
          priority: row.priority,
          totalTasks: Number(row.total_tasks),
          completedTasks: Number(row.completed_tasks),
        })),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
