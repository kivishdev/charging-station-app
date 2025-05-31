const express = require('express');
const mongoose = require('mongoose'); // Add this
const router = express.Router();
const ChargingStation = require('../models/ChargingStation');
const authMiddleware = require('../middleware/auth');

// Create
router.post('/', authMiddleware, async (req, res) => {
  const { name, location, status, powerOutput, connectorType } = req.body;
  try {
    const station = new ChargingStation({
      name,
      location,
      status,
      powerOutput,
      connectorType,
      user: req.user,
    });
    await station.save();
    res.json(station);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Read (List)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const stations = await ChargingStation.find({ user: req.user });
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, location, status, powerOutput, connectorType } = req.body;
  try {
    const station = await ChargingStation.findById(req.params.id);
    if (!station) return res.status(404).json({ message: 'Station not found' });
    if (station.user.toString() !== req.user) return res.status(401).json({ message: 'Unauthorized' });

    station.name = name || station.name;
    station.location = location || station.location;
    station.status = status || station.status;
    station.powerOutput = powerOutput || station.powerOutput;
    station.connectorType = connectorType || station.connectorType;

    await station.save();
    res.json(station);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Validate ObjectID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid station ID' });
    }

    const station = await ChargingStation.findById(req.params.id);
    if (!station) return res.status(404).json({ message: 'Station not found' });
    if (station.user.toString() !== req.user) return res.status(401).json({ message: 'Unauthorized' });

    await station.deleteOne(); // Use deleteOne instead of remove
    res.json({ message: 'Station deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;