const express = require('express');
const JournalEntry = require('../models/JournalEntry'); // Model for journal entries
const Affirmation = require('../models/Affirmation'); // Model for affirmations
const router = express.Router();

// Save journal entry
router.post('/journal', async (req, res) => {
  const { entry, userId } = req.body; // Include userId for authentication

  if (!entry || !userId) { // Validate both entry and userId
    return res.status(400).json({ message: 'Entry and User ID are required' });
  }

  try {
    const newEntry = new JournalEntry({ entry, userId }); // Save userId with entry
    await newEntry.save();
    res.status(201).json({ message: 'Journal entry saved successfully' });
  } catch (error) {
    console.error('Error saving journal entry:', error);
    res.status(500).json({ message: 'Failed to save journal entry' });
  }
});

// Save affirmation
router.post('/affirmations', async (req, res) => {
  const { affirmation, userId } = req.body; // Include userId for authentication

  if (!affirmation || !userId) { // Validate both affirmation and userId
    return res.status(400).json({ message: 'Affirmation and User ID are required' });
  }

  try {
    const newAffirmation = new Affirmation({ affirmation, userId }); // Save userId with affirmation
    await newAffirmation.save();
    res.status(201).json({ message: 'Affirmation saved successfully' });
  } catch (error) {
    console.error('Error saving affirmation:', error);
    res.status(500).json({ message: 'Failed to save affirmation' });
  }
});

// Fetch journal entries
router.get('/journal/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const entries = await JournalEntry.find({ userId });
      res.status(200).json(entries);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      res.status(500).json({ message: 'Failed to fetch journal entries' });
    }
  });

  // src/routes/journal.js (or the file where you define your routes)
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const entries = await JournalEntry.find({ userId }); // Find entries for the user
      res.status(200).json(entries); // Return entries as an array
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      res.status(500).json({ message: 'Failed to fetch journal entries' });
    }
  });
  
  

module.exports = router;
