import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'EduFlow API is running' });
});

app.listen(port, () => {
  console.log(`EduFlow API listening on port ${port}`);
});
