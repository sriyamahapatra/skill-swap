require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const app = express();
const userRouter = require('./routes/userRouter');
const homeRouter = require('./routes/homeRouter');
const adminRouter = require('./routes/adminRouter');
const swipeRouter = require('./routes/swipeRouter');
const utilRouter = require('./routes/utilRouter');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000; // Added fallback port
const cors = require('cors');

// Connect to database
connectDB();

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// Enhanced CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is allowed
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173' // Fallback for development
    ].filter(Boolean); // Remove any undefined values
    
    if (allowedOrigins.some(allowedOrigin => origin.startsWith(allowedOrigin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['set-cookie', 'authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Routes
app.use('/user', userRouter);
app.use('/home', homeRouter);
app.use('/swipe', swipeRouter);
app.use('/admin', adminRouter);
app.use('/', utilRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS policy violation' });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});