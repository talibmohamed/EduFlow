import express from 'express';
import pool from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { todayUtc } from '../services/date.js';

const router = express.Router();

router.use(requireAuth, requireRole('child'));

async function recordTaskAction(req, res, status) {
  const taskId = Number(req.params.id);
  if (!Number.isInteger(taskId)) {
    return res.status(400).json({ success: false, message: 'invalid task id' });
  }

  const today = todayUtc();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const ownership = await client.query(
      `SELECT t.id
       FROM tasks t
       JOIN homework h ON h.id = t.homework_id
       WHERE t.id = $1 AND h.child_id = $2`,
      [taskId, req.user.id],
    );
    if (ownership.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const updated = await client.query(
      `UPDATE tasks SET status = $2 WHERE id = $1
       RETURNING id, homework_id, title, status, task_order`,
      [taskId, status],
    );

    // One progress row per task per day: replace any existing entry.
    await client.query(
      `DELETE FROM task_progress WHERE task_id = $1 AND child_id = $2 AND date = $3`,
      [taskId, req.user.id, today],
    );
    await client.query(
      `INSERT INTO task_progress (task_id, child_id, date, status, completed_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [taskId, req.user.id, today, status, status === 'completed' ? new Date() : null],
    );

    await client.query('COMMIT');

    const task = updated.rows[0];
    return res.status(200).json({
      success: true,
      message: status === 'completed' ? 'Task completed' : 'Task postponed',
      data: {
        task: {
          id: task.id,
          homeworkId: task.homework_id,
          title: task.title,
          status: task.status,
          taskOrder: task.task_order,
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
}

router.patch('/:id/complete', (req, res) => recordTaskAction(req, res, 'completed'));
router.patch('/:id/postpone', (req, res) => recordTaskAction(req, res, 'postponed'));

export default router;
