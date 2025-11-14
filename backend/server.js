require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const notesRouter = require('./routes/notes');

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kamati';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

app.use('/api', notesRouter);

app.get('/', (req, res) => res.json({ message: 'KaMaTi backend running' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
