const express = require('express');
const Routine = require('../models/Routine');
const WeeklySummary = require('../models/WeeklySummary');
const router = express.Router();

// Log a completed routine
router.post('/complete', async (req, res) => {
  const { userId, routineName, duration } = req.body;

  if (!userId || !routineName || !duration) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Create and save new routine
    const newRoutine = new Routine({ userId, routineName, duration });
    await newRoutine.save();

    // Update the weekly summary
    let summary = await WeeklySummary.findOne({ userId });
    if (!summary) {
      summary = new WeeklySummary({ userId });
    }
    summary.routinesCompleted += 1;
    await summary.save();

    res.status(201).json({ message: 'Routine logged successfully', summary });
  } catch (error) {
    console.error('Error logging routine:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
