import express from 'express';
import pool from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { todayUtc } from '../services/date.js';

const router = express.Router();
const levels = ['low', 'medium', 'high'];

function mapDailyState(row) {
  return {
    id: row.id,
    childId: row.child_id,
    date: row.date,
    energyLevel: row.energy_level,
    focusLevel: row.focus_level,
    createdAt: row.created_at,
  };
}

router.use(requireAuth, requireRole('child'));

router.post('/', async (req, res) => {
  const energyLevel = req.body.energy_level;
  const focusLevel = req.body.focus_level;

  if (!levels.includes(energyLevel)) {
    return res.status(400).json({ success: false, message: 'energy_level invalid' });
  }
  if (!levels.includes(focusLevel)) {
    return res.status(400).json({ success: false, message: 'focus_level invalid' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO daily_states (child_id, date, energy_level, focus_level)
       VALUES ($1, $2, $3, $4)
       RETURNING id, child_id, to_char(date, 'YYYY-MM-DD') AS date, energy_level, focus_level, created_at`,
      [req.user.id, todayUtc(), energyLevel, focusLevel],
    );
    return res.status(201).json({
      success: true,
      message: 'Daily state saved',
      data: { dailyState: mapDailyState(result.rows[0]) },
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Daily state already set for today' });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, child_id, to_char(date, 'YYYY-MM-DD') AS date, energy_level, focus_level, created_at
       FROM daily_states
       WHERE child_id = $1 AND date = $2`,
      [req.user.id, todayUtc()],
    );
    const row = result.rows[0];
    return res.status(200).json({
      success: true,
      data: { dailyState: row ? mapDailyState(row) : null },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
