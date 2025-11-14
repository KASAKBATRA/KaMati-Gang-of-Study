import React, { useState, useEffect } from 'react';

export default function DriveViewer({ url, open, onClose }) {
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose && onClose();
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  function getPreview(u) {
    try {
      if (!u) return '';
      const s = String(u);
      const m = s.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (m && m[1]) return `https://drive.google.com/file/d/${m[1]}/preview`;
      return s;
    } catch (e) { return u; }
  }

  const src = getPreview(url);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div className="relative w-full h-full flex flex-col">
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900/90 border-b border-slate-700 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3 py-2 bg-slate-700/60 hover:bg-slate-700 text-slate-100 rounded-md text-sm"
            >
              ← Back to Materials
            </button>
            <div className="text-sm text-slate-100 font-semibold">Document Viewer</div>
          </div>

          <div className="flex items-center gap-3">
            {!interactive && (
              <button
                className="px-3 py-2 rounded bg-emerald-600 text-white text-sm"
                onClick={() => setInteractive(true)}
              >Enable interaction</button>
            )}
            <button className="px-3 py-2 rounded bg-transparent border border-slate-600 text-slate-200 text-sm" onClick={onClose}>Close</button>
          </div>
        </div>

        <div className={`flex-1 relative ${interactive ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <iframe
            title="drive-viewer"
            src={src}
            className="w-full h-full bg-black"
            sandbox={interactive ? 'allow-same-origin allow-scripts allow-forms' : 'allow-same-origin'}
          />

          {!interactive && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent to-black/40 text-center p-6">
              <div className="text-white max-w-2xl">
                <p className="mb-3 text-lg">Preview mode: controls are disabled to discourage downloads.</p>
                <p className="mb-4 text-sm text-slate-300">Click "Enable interaction" to allow full controls (downloads & toolbar). Press <kbd className="px-2 py-1 bg-slate-800 rounded">Esc</kbd> or the back button to return.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
