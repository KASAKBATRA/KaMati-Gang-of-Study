import React, { useState, useEffect } from 'react';
import { rateNote } from '../lib/api';

export default function StarRating({ noteId, initialAvg = 0, initialTotal = 0, userId = null, onRated }) {
  const [hover, setHover] = useState(0);
  const [selected, setSelected] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [avg, setAvg] = useState(initialAvg);
  const [total, setTotal] = useState(initialTotal);

  useEffect(() => {
    setAvg(initialAvg);
    setTotal(initialTotal);
  }, [initialAvg, initialTotal]);

  const stars = [1,2,3,4,5];

  async function submitRating(starsValue) {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = { noteId, stars: starsValue };
      if (userId) payload.userId = userId;
      const res = await rateNote(payload);
      const updatedNote = res.note;
      if (updatedNote) {
        setAvg(Number(updatedNote.avgRating));
        setTotal(Number(updatedNote.totalRatings || 0));
      }
      setSelected(starsValue);
      if (typeof onRated === 'function') onRated(updatedNote || null);
    } catch (err) {
      console.error('Rating failed', err.response?.data || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center">
        {stars.map((s) => {
          const fill = hover >= s || (!hover && selected >= s);
          return (
            <button
              key={s}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              onClick={() => submitRating(s)}
              disabled={submitting}
              className={`w-8 h-8 flex items-center justify-center transition transform ${fill ? 'scale-110' : 'scale-100'}`}
              aria-label={`Rate ${s} star${s>1?'s':''}`}
            >
              <svg className={`${fill ? 'text-yellow-400' : 'text-gray-400'} w-6 h-6`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.96a1 1 0 00-.364-1.118L2.063 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" />
              </svg>
            </button>
          );
        })}
      </div>

      <div className="text-sm text-gray-200">
        <div className="font-semibold text-white">⭐ {avg.toFixed(1)}</div>
        <div className="text-xs text-gray-400">({total} reviews)</div>
      </div>
    </div>
  );
}
