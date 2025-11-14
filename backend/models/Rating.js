const mongoose = require('mongoose');
const { Schema } = mongoose;

const RatingSchema = new Schema({
  noteId: { type: Schema.Types.ObjectId, ref: 'Note', required: true },
  userId: { type: String, default: null },
  stars: { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });

// Prevent duplicate ratings for same userId & noteId when userId is provided
RatingSchema.index({ noteId: 1, userId: 1 }, { unique: true, partialFilterExpression: { userId: { $type: 'string' } } });

module.exports = mongoose.model('Rating', RatingSchema);
