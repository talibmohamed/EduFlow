import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import pool from '../db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  const sqlPath = path.join(__dirname, '..', 'db.sql');
  const sql = await fs.readFile(sqlPath, 'utf8');

  await pool.query(sql);
  console.log('Database migration completed successfully');
}

migrate()
  .then(() => {
    pool.end();
  })
  .catch((error) => {
    console.error('Database migration failed');
    console.error(error);
    pool.end().finally(() => process.exit(1));
  });
