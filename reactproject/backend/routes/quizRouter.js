const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

router.post('/addQuiz', async (req, res) => {
  const { UserId, cardioTime, strengthTime, flexibilityTime } = req.body;

  try {
      const newQuiz = new Quiz({
      UserId,
      cardioTime,
      strengthTime,
      flexibilityTime,
    });

    await newQuiz.save();
    res.status(201).json({ message: 'BMI saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving BMI', error: err });
  }
});

router.get('/getQuiz/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    // Find and sort the quiz data by the `onDate` field in ascending order (oldest to newest)
    const quiz = await Quiz.find({ UserId: userId }).sort({ onDate: 1 }); // Use -1 for descending order

    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching Quiz', error: err });
  }
});


module.exports = router;
