const mongoose = require('mongoose');

const weeklySummarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  routinesCompleted: { type: Number, default: 0 },
  moodPatterns: [{ type: String }],  // Store moods (e.g., Happy, Stressed, etc.)
  updatedAt: { type: Date, default: Date.now }, // Add this for tracking updates
});

const WeeklySummary = mongoose.model('WeeklySummary', weeklySummarySchema);
module.exports = WeeklySummary;
