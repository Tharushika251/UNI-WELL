const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  UserId: {
    type: String,
    require: true,
  },
  onDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  cardioTime: {
    type: Number,
    required: true,
  },
  strengthTime: {
    type: Number,
    required: true,
  },
  flexibilityTime: {
    type: Number,
    required: true,
  },
});

const quiz = mongoose.model('quiz', QuizSchema);

module.exports = quiz;
