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
    return 'name invalid';
  }
  if (typeof username !== 'string') {
    return 'username invalid';
  }
  const trimmedUsername = username.trim().toLowerCase();
  if (trimmedUsername.length < 3 || trimmedUsername.length > 60 || !usernamePattern.test(trimmedUsername)) {
    return 'username invalid';
  }
  if (typeof pin !== 'string' || !pinPattern.test(pin)) {
    return 'PIN must be 4 digits';
  }
  if (age !== undefined && age !== null && age !== '') {
    const ageNum = Number(age);
    if (!Number.isInteger(ageNum) || ageNum < 4 || ageNum > 18) {
      return 'age invalid (must be 4-18)';
    }
  }
  if (classLevel !== undefined && classLevel !== null && classLevel !== '') {
    if (typeof classLevel !== 'string' || classLevel.trim().length > 40) {
      return 'class_level invalid';
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
    return res.status(500).json({ success: false, message: 'Internal server error' });
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
      message: 'Child created',
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
      return res.status(409).json({ success: false, message: 'Username already taken' });
    }
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    client.release();
  }
});

export default router;
