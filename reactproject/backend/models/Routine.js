const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  routineName: { type: String, required: true },
  duration: { type: Number, required: true }, // duration in minutes
  completedAt: { type: Date, default: Date.now },
});

const Routine = mongoose.model('Routine', routineSchema);
module.exports = Routine;
