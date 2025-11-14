import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export async function fetchNotes() {
  const res = await api.get('/notes');
  return res.data.notes;
}

export async function rateNote({ noteId, userId, stars }) {
  const res = await api.post('/rate-note', { noteId, userId, stars });
  return res.data;
}

export default api;
