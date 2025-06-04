const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const stationRoutes = require('./routes/chargingStations');

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware for production
if (process.env.NODE_ENV === 'production') {
  // Helmet for security headers
  app.use(helmet());
  
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  });
  app.use(limiter);
  
  // Production CORS
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['https://charging-station-app-kle6.onrender.com' , 'http://localhost:5173'];
  
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS policy`), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
} else {
  // Development CORS - allow all
  app.use(cors());
}

// Parse JSON bodies
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date() 
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send(`⚡ Charging Station API - Running in ${process.env.NODE_ENV || 'development'} mode`);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error', 
    message: 'Endpoint not found' 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(status).json({
    status: 'error',
    message
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});