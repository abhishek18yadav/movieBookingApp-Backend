import './jobs/seatLockExpiry.js';

import cors from 'cors';
import express from 'express';
import StatusCode from 'http-status-codes';

import { connectDB } from './config/mongoConfig.js';
import apiRouter from './Routes/apiRouter.js';

const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

app.get('/ping', (_req, res) => {
  return res.status(StatusCode.OK).json({ message: "pong" });
});

app.use('/api', apiRouter);

app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  try {
    await connectDB();
  } catch (error) {
    console.log('Error connecting to DB', error);
  }
});
