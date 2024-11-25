const express = require('express');
const router = express.Router();
const BMI = require('../models/BMI');

router.post('/addBMI', async (req, res) => {
  const {
    userId,
    weight,
    height,
    bmi,
    addDate,
  } = req.body;

  try {
    const newBMI = new BMI({
      userId,
      weight,
      height,
      bmi,
      addDate,
    });

    await newBMI.save();
    res.status(201).json({ message: 'BMI saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving BMI', error: err });
  }
});

router.get('/getBMI/:id', async (req, res) => {
  const userId = req.params.id; 
  try {
    // Fetch BMI records for the given userId and sort them by addDate in descending order
    const bmi = await BMI.find({ userId: userId }).sort({ addDate: 1 }); // -1 for descending order
    res.json(bmi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching BMI', error: err });
  }
});

router.get('/getLatestBMI/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    // Fetch the latest BMI record for the given userId by sorting addDate in descending order and limiting to 1
    const latestBMI = await BMI.findOne({ userId: userId }).sort({ addDate: -1 });;

    if (latestBMI) {
      res.json(latestBMI);
    } else {
      res.status(404).json({ message: 'No BMI record found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching BMI', error: err });
  }
});


module.exports = router;