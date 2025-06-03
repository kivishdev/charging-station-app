const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const stationRoutes = require('./routes/chargingStations');

dotenv.config({ path: './.env' });
console.log('MONGO_URI:', process.env.MONGO_URI);
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// Define allowed origins
const allowedOrigins = [
  'https://charging-front-uejq.onrender.com',
  'http://localhost:5000' // Add other development origins as needed
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      callback(new Error(msg), false);
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); // For parsing JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Charging Station API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));