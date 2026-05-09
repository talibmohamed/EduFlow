import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import pool from '../db.js';

dotenv.config();

const password = 'Password123!';

const users = [
  { key: 'teacher', email: 'pierre@eduflow.test', name: 'Pierre Dubois', role: 'teacher' },
  { key: 'parent', email: 'sophie@eduflow.test', name: 'Sophie Martin', role: 'parent' },
  { key: 'lucas', email: 'lucas@eduflow.test', name: 'Lucas Martin', role: 'child' },
  { key: 'emma', email: 'emma@eduflow.test', name: 'Emma Durand', role: 'child' },
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

    const passwordHash = await bcrypt.hash(password, 10);
    const insertedUsers = {};

    for (const user of users) {
      const result = await client.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [user.name, user.email, passwordHash, user.role],
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
    for (const user of users) {
      console.log(`${user.role}: ${user.email} / ${password}`);
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
