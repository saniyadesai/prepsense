import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';

import authRoutes      from './routes/auth.js';
import dsaRoutes       from './routes/dsa.js';
import todoRoutes      from './routes/todos.js';
import jobRoutes       from './routes/jobs.js';
import interviewRoutes from './routes/interviews.js';

// Load .env variables first
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Allow requests from your React app
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Prevent spam
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, slow down!'
}));

// Register all routes
app.use('/api/auth',       authRoutes);
app.use('/api/dsa',        dsaRoutes);
app.use('/api/todos',      todoRoutes);
app.use('/api/jobs',       jobRoutes);
app.use('/api/interviews', interviewRoutes);

// Global error handler — catches any uncaught errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ PrepSense API running on http://localhost:${PORT}`);
});