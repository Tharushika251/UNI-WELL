const mongoose = require('mongoose');

const BMISchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  bmi: {
    type: Number,
    required: true,
  },
  addDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const bmi = mongoose.model('bmi', BMISchema);

module.exports = bmi;
