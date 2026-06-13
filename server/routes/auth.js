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
    return 'Le nom est invalide';
  }

  if (typeof email !== 'string' || !emailPattern.test(email.trim())) {
    return "L'adresse email est invalide";
  }

  if (typeof password !== 'string' || password.length < 8) {
    return 'Le mot de passe doit comporter au moins 8 caractères';
  }

  if (!roles.includes(role)) {
    return 'Le rôle est invalide';
  }

  return null;
}

function publicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    username: row.username,
    role: row.role,
  };
}

const pinPattern = /^\d{4}$/;

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
       RETURNING id, name, email, username, role`,
      [name, email, passwordHash, role],
    );
    const user = publicUser(result.rows[0]);
    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: 'Compte créé',
      data: { token, user },
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Cette adresse email est déjà utilisée' });
    }

    console.error(error);
    return res.status(500).json({ success: false, message: 'Erreur serveur, réessaie dans un instant' });
  }
});

router.post('/login', async (req, res) => {
  // V2.1: accept EITHER {email,password} (parents/teachers) OR {username,pin} (children).
  const emailRaw = typeof req.body.email === 'string' ? req.body.email.trim() : '';
  const passwordRaw = typeof req.body.password === 'string' ? req.body.password : '';
  const usernameRaw = typeof req.body.username === 'string' ? req.body.username.trim() : '';
  const pinRaw = typeof req.body.pin === 'string' ? req.body.pin : '';

  const usingEmail = emailRaw.length > 0 && passwordRaw.length > 0;
  const usingUsername = usernameRaw.length > 0 && pinRaw.length > 0;

  if (!usingEmail && !usingUsername) {
    return res.status(400).json({
      success: false,
      message: 'Fournis soit email + mot de passe, soit identifiant + code PIN',
    });
  }
  if (usingEmail && usingUsername) {
    return res.status(400).json({
      success: false,
      message: "Fournis un seul type d'identifiants",
    });
  }
  if (usingUsername && !pinPattern.test(pinRaw)) {
    return res.status(400).json({
      success: false,
      message: 'Le code PIN doit comporter 4 chiffres',
    });
  }

  try {
    const lookup = usingEmail
      ? { sql: 'SELECT id, name, email, username, password_hash, role FROM users WHERE email = $1', value: emailRaw.toLowerCase() }
      : { sql: 'SELECT id, name, email, username, password_hash, role FROM users WHERE username = $1', value: usernameRaw.toLowerCase() };

    const result = await pool.query(lookup.sql, [lookup.value]);
    const userRow = result.rows[0];

    if (!userRow) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    }

    const secret = usingEmail ? passwordRaw : pinRaw;
    const secretMatches = await bcrypt.compare(secret, userRow.password_hash);

    if (!secretMatches) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    }

    const user = publicUser(userRow);
    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: 'Connecté',
      data: { token, user },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Erreur serveur, réessaie dans un instant' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, username, role FROM users WHERE id = $1',
      [req.user.id],
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentification requise' });
    }

    return res.status(200).json({ success: true, data: { user: publicUser(user) } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Erreur serveur, réessaie dans un instant' });
  }
});

export default router;
