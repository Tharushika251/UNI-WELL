const express = require('express');
const Checkin = require('../models/Checkin');
const WeeklySummary = require('../models/WeeklySummary');
const router = express.Router();

// Utility function to convert anxiety and stress levels to mood
const calculateMood = (anxiety, stress) => {
  if (anxiety <= 3 && stress <= 3) {
    return 'Happy';
  } else if (anxiety >= 7 || stress >= 7) {
    return 'Stressed';
  } else {
    return 'Neutral';
  }
};

// Submit check-in data
router.post('/submit', async (req, res) => {
  const { userId, anxiety, stress } = req.body;

  // Validate required fields
  if (!userId || anxiety === undefined || stress === undefined) {
    return res
      .status(400)
      .json({
        message:
          'Missing required fields: userId, anxiety, and stress are all required',
      });
  }

  try {
    const mood = calculateMood(anxiety, stress);

    // Save the check-in
    const newCheckin = new Checkin({ userId, anxiety, stress, mood });
    await newCheckin.save();

    // Find or create the user's weekly summary
    let summary = await WeeklySummary.findOne({ userId });
    if (!summary) {
      summary = new WeeklySummary({ userId, moodPatterns: [] });
    }

    // Update weekly mood patterns
    summary.moodPatterns.push(mood);
    summary.updatedAt = Date.now(); // Update the timestamp
    await summary.save();

    // Send success response
    res.status(201).json({ message: 'Check-in submitted successfully' });
  } catch (error) {
    console.error('Error submitting check-in:', error.message);

    // Return error response with detailed error only in development
    res.status(500).json({
      message: 'Failed to submit check-in',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }), // Show error details in development mode
    });
  }
});

module.exports = router;
