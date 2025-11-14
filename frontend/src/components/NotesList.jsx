import React, { useEffect, useState } from 'react';
import { fetchNotes } from '../lib/api';
import StarRating from './StarRating';
import DriveViewer from './DriveViewer';

export default function NotesList({ userId = null }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch notes', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      {loading && <div className="text-center text-gray-400">Loading...</div>}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map(note => (
            <div key={note._id} className="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-white mb-3">{note.title}</h3>

              <div className="mb-4">
                <StarRating
                  noteId={note._id}
                  initialAvg={note.avgRating || 0}
                  initialTotal={note.totalRatings || 0}
                  userId={userId}
                  onRated={() => load()}
                />
              </div>

              <div className="flex gap-3">
                <button
                  className="px-3 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500"
                  onClick={(e) => {
                    e.preventDefault();
                    setViewerUrl(note.driveUrl);
                    setViewerOpen(true);
                  }}
                >
                  Open Note
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DriveViewer url={viewerUrl} open={viewerOpen} onClose={() => setViewerOpen(false)} />
    </div>
  );
}

