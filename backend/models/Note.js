const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  driveUrl: { type: String, required: true },
  avgRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);
