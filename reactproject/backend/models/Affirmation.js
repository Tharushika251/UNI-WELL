// models/Affirmation.js
const mongoose = require('mongoose');

const affirmationSchema = new mongoose.Schema({
  affirmation: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user
  createdAt: { type: Date, default: Date.now },
});

const Affirmation = mongoose.model('Affirmation', affirmationSchema);
module.exports = Affirmation;