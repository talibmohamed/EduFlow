import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

let hasLoggedConnection = false;

function logConnectionOnce() {
  if (!hasLoggedConnection) {
    console.log('Postgres connected');
    hasLoggedConnection = true;
  }
}

pool.on('connect', () => {
  logConnectionOnce();
});

export async function query(text, params) {
  const result = await pool.query(text, params);
  logConnectionOnce();

  return result;
}

export default pool;
