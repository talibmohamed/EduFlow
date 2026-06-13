import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth, requireRole('parent'));

const usernamePattern = /^[a-z0-9_-]+$/;
const pinPattern = /^\d{4}$/;

function validateCreate(body) {
  const { name, username, pin, age, class_level: classLevel } = body;

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 120) {
    return 'Le prénom est invalide (2 à 120 caractères)';
  }
  if (typeof username !== 'string') {
    return "L'identifiant est invalide (3 à 60 caractères : lettres, chiffres, tirets)";
  }
  const trimmedUsername = username.trim().toLowerCase();
  if (trimmedUsername.length < 3 || trimmedUsername.length > 60 || !usernamePattern.test(trimmedUsername)) {
    return "L'identifiant est invalide (3 à 60 caractères : lettres, chiffres, tirets)";
  }
  if (typeof pin !== 'string' || !pinPattern.test(pin)) {
    return 'Le code PIN doit comporter 4 chiffres';
  }
  if (age !== undefined && age !== null && age !== '') {
    const ageNum = Number(age);
    if (!Number.isInteger(ageNum) || ageNum < 4 || ageNum > 18) {
      return "L'âge doit être compris entre 4 et 18 ans";
    }
  }
  if (classLevel !== undefined && classLevel !== null && classLevel !== '') {
    if (typeof classLevel !== 'string' || classLevel.trim().length > 40) {
      return 'La classe est invalide (40 caractères maximum)';
    }
  }

  return null;
}

function mapChild(row) {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    age: row.age,
    classLevel: row.class_level,
  };
}

// GET /api/parent/children — list the calling parent's children
router.get('/children', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.username, cp.age, cp.class_level
       FROM users u
       JOIN children_profiles cp ON cp.user_id = u.id
       WHERE cp.parent_id = $1 AND u.role = 'child'
       ORDER BY u.name`,
      [req.user.id],
    );
    return res.status(200).json({
      success: true,
      data: { children: result.rows.map(mapChild) },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Erreur serveur, réessaie dans un instant' });
  }
});

// POST /api/parent/children — create a child + auto-link to this parent
router.post('/children', async (req, res) => {
  const validationError = validateCreate(req.body);
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  const name = req.body.name.trim();
  const username = req.body.username.trim().toLowerCase();
  const { pin } = req.body;
  const ageRaw = req.body.age;
  const age = ageRaw !== undefined && ageRaw !== null && ageRaw !== '' ? Number(ageRaw) : null;
  const classLevelRaw = req.body.class_level;
  const classLevel = classLevelRaw !== undefined && classLevelRaw !== null && classLevelRaw !== ''
    ? classLevelRaw.trim()
    : null;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const pinHash = await bcrypt.hash(pin, 10);
    const userResult = await client.query(
      `INSERT INTO users (name, email, username, password_hash, role)
       VALUES ($1, NULL, $2, $3, 'child')
       RETURNING id, name, username`,
      [name, username, pinHash],
    );
    const childRow = userResult.rows[0];

    await client.query(
      `INSERT INTO children_profiles (user_id, age, class_level, parent_id)
       VALUES ($1, $2, $3, $4)`,
      [childRow.id, age, classLevel, req.user.id],
    );

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      message: 'Enfant ajouté',
      data: {
        child: {
          id: childRow.id,
          name: childRow.name,
          username: childRow.username,
          age,
          classLevel,
        },
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Cet identifiant est déjà utilisé' });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: 'Erreur serveur, réessaie dans un instant' });
  } finally {
    client.release();
  }
});


router.get('/children/:id/daily-states', async (req, res) => {
  const childId = Number(req.params.id);

  try {

    const check = await pool.query(
      `SELECT cp.user_id FROM children_profiles cp
       WHERE cp.user_id = $1 AND cp.parent_id = $2`,
      [childId, req.user.id],
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Enfant introuvable' });
    }

    const result = await pool.query(
      `SELECT id, date, energy_level, focus_level, created_at
       FROM daily_states
       WHERE child_id = $1
       ORDER BY date DESC
       LIMIT 30`,
      [childId],
    );
    return res.status(200).json({
      success: true,
      data: { dailyStates: result.rows },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Erreur serveur, réessaie dans un instant' });
  }
});


router.get('/children/:id/progress', async (req, res) => {
  const childId = Number(req.params.id);

  try {

    const check = await pool.query(
      `SELECT cp.user_id FROM children_profiles cp
       WHERE cp.user_id = $1 AND cp.parent_id = $2`,
      [childId, req.user.id],
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Enfant introuvable' });
    }


    const today = new Date().toISOString().slice(0, 10);
    const todayResult = await pool.query(
      `SELECT tp.status, COUNT(*) as count
       FROM task_progress tp
       WHERE tp.child_id = $1 AND tp.date = $2
       GROUP BY tp.status`,
      [childId, today],
    );
    const todayMap = { completed: 0, postponed: 0 };
    for (const row of todayResult.rows) {
      todayMap[row.status] = Number(row.count);
    }


    const weekResult = await pool.query(
      `SELECT tp.date, tp.status, COUNT(*) as count
       FROM task_progress tp
       WHERE tp.child_id = $1
         AND tp.date >= CURRENT_DATE - INTERVAL '6 days'
       GROUP BY tp.date, tp.status
       ORDER BY tp.date DESC`,
      [childId],
    );

    return res.status(200).json({
      success: true,
      data: {
        today: todayMap,
        week: weekResult.rows,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Erreur serveur, réessaie dans un instant' });
  }
});

export default router;
