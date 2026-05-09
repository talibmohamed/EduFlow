import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';

dotenv.config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be set and at least 32 characters long.');
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'EduFlow API is running' });
});

app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`EduFlow API listening on port ${port}`);
});
