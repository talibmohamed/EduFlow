import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const roles = ['child', 'parent', 'teacher'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

function validateRegister({ name, email, password, role }) {
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 120) {
    return 'name invalid';
  }

  if (typeof email !== 'string' || !emailPattern.test(email.trim())) {
    return 'email invalid';
  }

  if (typeof password !== 'string' || password.length < 8) {
    return 'password invalid';
  }

  if (!roles.includes(role)) {
    return 'role invalid';
  }

  return null;
}

function publicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
  };
}

router.post('/register', async (req, res) => {
  const validationError = validateRegister(req.body);

  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  const name = req.body.name.trim();
  const email = req.body.email.trim().toLowerCase();
  const { password, role } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, passwordHash, role],
    );
    const user = publicUser(result.rows[0]);
    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account created',
      data: { token, user },
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  try {
    const result = await pool.query(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = $1',
      [email],
    );
    const userRow = result.rows[0];

    if (!userRow) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const passwordMatches = await bcrypt.compare(password, userRow.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = publicUser(userRow);
    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in',
      data: { token, user },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [
      req.user.id,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    return res.status(200).json({ success: true, data: { user: publicUser(user) } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
