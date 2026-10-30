import React from 'react';
import { FileText, Eye, ExternalLink, Copy, Check, Calendar, BookOpen, Zap, Sigma } from 'lucide-react';

export default function ResourceCard({ resource, onPreview, onCopy, copiedId }) {
  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'pyq':
        return { label: 'PYQ / Question Paper', color: '#3B82F6', icon: FileText };
      case 'revision':
        return { label: 'Quick Revision', color: '#10B981', icon: Zap };
      case 'formula':
        return { label: 'Formula Sheet', color: '#F59E0B', icon: Sigma };
      default:
        return { label: 'Study Notes', color: '#08B6D4', icon: BookOpen };
    }
  };

  const badge = getCategoryBadge(resource.category);
  const IconComponent = badge.icon;
  const isCopied = copiedId === resource.id;

  return (
    <div className="resource-card">
      <div>
        {/* Top Badges */}
        <div className="resource-top-meta">
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span className="meta-pill pill-sem">Sem {resource.semester}</span>
            <span className="meta-pill pill-unit">{resource.unit || 'All Units'}</span>
          </div>

          <span 
            style={{ 
              fontSize: '0.72rem', 
              fontWeight: '700', 
              color: badge.color, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              textTransform: 'uppercase'
            }}
          >
            <IconComponent size={12} />
            {badge.label}
          </span>
        </div>

        {/* Title */}
        <h4 className="resource-title" title={resource.title}>
          {resource.title}
        </h4>

        {/* Subject */}
        <div className="resource-subject">
          <span>{resource.subject}</span>
          {resource.year && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: 'var(--text-muted)' }}>
              • <Calendar size={12} /> {resource.year}
            </span>
          )}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="resource-footer">
        <span className="resource-size">
          PDF • {resource.size || 'Verified'}
        </span>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className="btn-preview-doc"
            onClick={() => onPreview(resource)}
            title="Preview PDF document inline"
          >
            <Eye size={14} />
            <span>Preview</span>
          </button>

          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-open-doc"
            title="Open in Google Drive"
          >
            <span>Drive</span>
            <ExternalLink size={13} />
          </a>

          <button
            type="button"
            className="btn-preview-doc"
            style={{ padding: '7px 9px' }}
            onClick={() => onCopy(resource.fileUrl, resource.id)}
            title="Copy Direct Link"
          >
            {isCopied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
