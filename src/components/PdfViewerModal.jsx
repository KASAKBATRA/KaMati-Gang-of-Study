import React, { useEffect } from 'react';
import { X, ExternalLink, Copy, Check, FileText } from 'lucide-react';

export default function PdfViewerModal({ resource, onClose, onCopyLink, copied }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!resource) return null;

  // Transform Google Drive URL to preview iframe embed format
  let embedUrl = resource.fileUrl;
  if (resource.driveId) {
    embedUrl = `https://drive.google.com/file/d/${resource.driveId}/preview`;
  } else if (embedUrl.includes('/view')) {
    embedUrl = embedUrl.replace('/view', '/preview');
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '70%' }}>
            <FileText size={20} color="#08B6D4" />
            <h3 id="modal-title" className="modal-title" title={resource.title}>
              {resource.title}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn-preview-doc"
              onClick={() => onCopyLink(resource.fileUrl)}
              title="Copy Resource Link"
            >
              {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span style={{ fontSize: '12px' }}>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-open-doc"
              style={{ fontSize: '12px', padding: '7px 12px' }}
            >
              <span>Drive Open</span>
              <ExternalLink size={13} />
            </a>

            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
              aria-label="Close Preview"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Modal Iframe Content */}
        <div className="modal-iframe-wrap">
          <iframe
            src={embedUrl}
            title={resource.title}
            className="modal-iframe"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
