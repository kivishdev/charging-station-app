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
app.use(cors({
  origin: 'https://charging-front-uejq.onrender.com',
  credentials: true,
}));
app.use(express.json()); // This is crucial for parsing JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Charging Station API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));