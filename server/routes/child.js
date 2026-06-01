import express from 'express';
import pool from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { todayUtc } from '../services/date.js';
import { adaptWorkload } from '../services/adapt.js';

const router = express.Router();

router.use(requireAuth, requireRole('child'));

function mapHomeworkRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    subject: row.subject,
    dueDate: row.due_date,
    estimatedMinutes: row.estimated_minutes,
    difficulty: row.difficulty,
    priority: row.priority,
  };
}

router.get('/adapted-homework', async (req, res) => {
  const today = todayUtc();
  try {
    const stateResult = await pool.query(
      `SELECT energy_level, focus_level FROM daily_states WHERE child_id = $1 AND date = $2`,
      [req.user.id, today],
    );
    const dailyState = stateResult.rows[0];
    if (!dailyState) {
      return res.status(409).json({ success: false, message: 'Daily state required for today' });
    }

    const homeworkResult = await pool.query(
      `SELECT id, title, description, subject,
              to_char(due_date, 'YYYY-MM-DD') AS due_date,
              estimated_minutes, difficulty, priority
       FROM homework
       WHERE child_id = $1 AND due_date >= $2
       ORDER BY id`,
      [req.user.id, today],
    );

    let homework = [];
    if (homeworkResult.rows.length > 0) {
      const homeworkIds = homeworkResult.rows.map((row) => row.id);
      const tasksResult = await pool.query(
        `SELECT id, homework_id, title, status, task_order
         FROM tasks
         WHERE homework_id = ANY($1)
         ORDER BY homework_id, task_order`,
        [homeworkIds],
      );

      const tasksByHomework = new Map();
      for (const task of tasksResult.rows) {
        if (!tasksByHomework.has(task.homework_id)) {
          tasksByHomework.set(task.homework_id, []);
        }
        tasksByHomework.get(task.homework_id).push({
          id: task.id,
          title: task.title,
          status: task.status,
          taskOrder: task.task_order,
        });
      }

      const available = homeworkResult.rows
        .map((row) => ({ ...mapHomeworkRow(row), tasks: tasksByHomework.get(row.id) ?? [] }))
        .filter((item) => item.tasks.some((task) => task.status !== 'completed'));

      homework = adaptWorkload(available, {
        energyLevel: dailyState.energy_level,
        focusLevel: dailyState.focus_level,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        dailyState: { energyLevel: dailyState.energy_level, focusLevel: dailyState.focus_level },
        homework,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/homework/:id', async (req, res) => {
  const homeworkId = Number(req.params.id);
  if (!Number.isInteger(homeworkId)) {
    return res.status(400).json({ success: false, message: 'invalid homework id' });
  }

  try {
    const homeworkResult = await pool.query(
      `SELECT id, title, description, subject,
              to_char(due_date, 'YYYY-MM-DD') AS due_date,
              estimated_minutes, difficulty, priority
       FROM homework
       WHERE id = $1 AND child_id = $2`,
      [homeworkId, req.user.id],
    );
    const homework = homeworkResult.rows[0];
    if (!homework) {
      return res.status(404).json({ success: false, message: 'Homework not found' });
    }

    const tasksResult = await pool.query(
      `SELECT id, title, status, task_order
       FROM tasks WHERE homework_id = $1 ORDER BY task_order`,
      [homeworkId],
    );
    const tasks = tasksResult.rows.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      taskOrder: task.task_order,
    }));

    return res.status(200).json({
      success: true,
      data: { homework: { ...mapHomeworkRow(homework), tasks } },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;

