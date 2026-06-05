import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import pool from '../db.js';

dotenv.config();

const password = 'Password123!';

// V2.1: parents and teachers use email + password; children use username + 4-digit PIN.
// PINs are stored in password_hash via bcrypt (same column reused).
const users = [
  { key: 'teacher', email: 'pierre@eduflow.test', username: null, name: 'Pierre Dubois', role: 'teacher', secret: password },
  { key: 'parent', email: 'sophie@eduflow.test', username: null, name: 'Sophie Martin', role: 'parent', secret: password },
  { key: 'lucas', email: null, username: 'lucas', name: 'Lucas Martin', role: 'child', secret: '2026' },
  { key: 'emma', email: null, username: 'emma', name: 'Emma Durand', role: 'child', secret: '1234' },
];

const homeworkItems = [
  {
    childKey: 'lucas',
    title: 'Exercices de mathématiques',
    description: null,
    subject: 'Mathématiques',
    daysUntilDue: 5,
    estimatedMinutes: 40,
    difficulty: 'medium',
    priority: 3,
    tasks: ['Lire les consignes', 'Faire la première partie', 'Terminer le devoir'],
  },
  {
    childKey: 'lucas',
    title: 'Lecture: chapitre 3',
    description: null,
    subject: 'Français',
    daysUntilDue: 2,
    estimatedMinutes: 10,
    difficulty: 'easy',
    priority: 2,
    tasks: ['Lire le chapitre 3'],
  },
  {
    childKey: 'emma',
    title: 'Carte des animaux',
    description: null,
    subject: 'Sciences',
    daysUntilDue: 4,
    estimatedMinutes: 25,
    difficulty: 'medium',
    priority: 2,
    tasks: ['Lire la consigne', 'Compléter la carte'],
  },
];

function dueDateFromToday(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM task_progress');
    await client.query('DELETE FROM tasks');
    await client.query('DELETE FROM homework');
    await client.query('DELETE FROM daily_states');
    await client.query('DELETE FROM teacher_children');
    await client.query('DELETE FROM children_profiles');
    await client.query('DELETE FROM users');

    const insertedUsers = {};

    for (const user of users) {
      const secretHash = await bcrypt.hash(user.secret, 10);
      const result = await client.query(
        `INSERT INTO users (name, email, username, password_hash, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [user.name, user.email, user.username, secretHash, user.role],
      );
      insertedUsers[user.key] = result.rows[0].id;
    }

    await client.query(
      `INSERT INTO children_profiles (user_id, age, class_level, parent_id)
       VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)`,
      [
        insertedUsers.lucas,
        11,
        '6ème',
        insertedUsers.parent,
        insertedUsers.emma,
        9,
        'CE2',
        null,
      ],
    );

    await client.query(
      `INSERT INTO teacher_children (teacher_id, child_id)
       VALUES ($1, $2), ($1, $3)`,
      [insertedUsers.teacher, insertedUsers.lucas, insertedUsers.emma],
    );

    for (const item of homeworkItems) {
      const homeworkResult = await client.query(
        `INSERT INTO homework (
          child_id,
          teacher_id,
          title,
          description,
          subject,
          due_date,
          estimated_minutes,
          difficulty,
          priority
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id`,
        [
          insertedUsers[item.childKey],
          insertedUsers.teacher,
          item.title,
          item.description,
          item.subject,
          dueDateFromToday(item.daysUntilDue),
          item.estimatedMinutes,
          item.difficulty,
          item.priority,
        ],
      );

      const homeworkId = homeworkResult.rows[0].id;

      for (const [index, taskTitle] of item.tasks.entries()) {
        await client.query(
          `INSERT INTO tasks (homework_id, title, task_order)
           VALUES ($1, $2, $3)`,
          [homeworkId, taskTitle, index + 1],
        );
      }
    }

    await client.query('COMMIT');

    console.log('Seed completed successfully');
    console.log('');
    console.log('Demo credentials:');
    console.log('  Email + password (parents and teachers):');
    for (const user of users) {
      if (user.email) {
        console.log(`    ${user.role}: ${user.email} / ${user.secret}`);
      }
    }
    console.log('  Username + PIN (children):');
    for (const user of users) {
      if (user.username) {
        console.log(`    ${user.role}: ${user.username} / ${user.secret}`);
      }
    }
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

seed()
  .then(() => {
    pool.end();
  })
  .catch((error) => {
    console.error('Seed failed');
    console.error(error);
    pool.end().finally(() => process.exit(1));
  });
