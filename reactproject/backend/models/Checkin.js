const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  anxiety: { type: Number, required: true },
  stress: { type: Number, required: true },
  mood: { type: String, required: true }, // Add mood to the schema
  checkinAt: { type: Date, default: Date.now },
});

const Checkin = mongoose.model('Checkin', checkinSchema);
module.exports = Checkin;
