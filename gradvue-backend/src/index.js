import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import tuitionRoutes from './routes/tuition.js';
import schoolRoutes from './routes/schoolRoutes.js';
import classRoutes from './routes/classRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tuition', tuitionRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/classes', classRoutes);

// Placeholder route
// TODO: Only for tests, remove before prod release
app.get('/', (req, res) => res.send('Welcome to Gradvue API!'));

// Connect DB and start server
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log('MongoDB Connected'))
//   .catch((err) => console.log(err));

// Example route

// GET MODE
const MONGO_URI =
  process.env.MODE === 'development'
    ? process.env.MONGO_URI_LOCAL
    : process.env.MONGO_URI;

// TODO: Export db from db.js
mongoose
  // .connect(process.env.MONGO_URI, {
  .connect(MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// Listen on Port

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
