// models/JournalEntry.js
const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  entry: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user
  createdAt: { type: Date, default: Date.now },
});

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);
module.exports = JournalEntry;


