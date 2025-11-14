const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Rating = require('../models/Rating');

// POST /api/rate-note
router.post('/rate-note', async (req, res) => {
  try {
    const { noteId, userId, stars } = req.body;
    if (!noteId || !stars) return res.status(400).json({ error: 'noteId and stars are required' });
    const s = Number(stars);
    if (isNaN(s) || s < 1 || s > 5) return res.status(400).json({ error: 'stars must be 1-5' });

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    let existingRating = null;
    if (userId) {
      existingRating = await Rating.findOne({ noteId: note._id, userId: String(userId) });
    }

    if (existingRating) {
      const oldStars = existingRating.stars;
      existingRating.stars = s;
      await existingRating.save();

      const total = note.totalRatings || 0;
      const oldAvg = note.avgRating || 0;
      const newAvg = total > 0 ? ((oldAvg * total) - oldStars + s) / total : s;

      note.avgRating = Number(newAvg.toFixed(2));
      await note.save();

      return res.json({ message: 'Rating updated', note });
    } else {
      await Rating.create({ noteId: note._id, userId: userId ? String(userId) : null, stars: s });

      const oldAvg = note.avgRating || 0;
      const oldTotal = note.totalRatings || 0;
      const newTotal = oldTotal + 1;
      const newAvg = ((oldAvg * oldTotal) + s) / newTotal;

      note.avgRating = Number(newAvg.toFixed(2));
      note.totalRatings = newTotal;
      await note.save();

      return res.json({ message: 'Rating saved', note });
    }
  } catch (err) {
    console.error(err);
    if (err && err.code === 11000) return res.status(409).json({ error: 'You have already rated this note' });
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/notes
router.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find({}).sort({ avgRating: -1, totalRatings: -1, createdAt: -1 }).lean();
    res.json({ notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
