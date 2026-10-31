import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, BookOpen, FileText, Zap, Sigma, Filter, 
  ExternalLink, CheckSquare, MessageCircle, ArrowRight, ShieldCheck,
  ArrowUpDown, Star, ThumbsUp, Clock
} from 'lucide-react';
import { SEMESTERS, RESOURCE_CATEGORIES } from '../data/curriculum';
import { getResourcesForSubject } from '../data/resourceManager';
import { fetchAllRatings, subscribeToRatings, sortResourcesWithRatings } from '../lib/ratingService';
import ResourceCard from '../components/ResourceCard';

export default function SubjectDetailPage({ semNumber, subjectSlug, navigate, onPreview, onCopy, copiedId }) {
  const [activeCategory, setActiveCategory] = useState('notes');
  const [selectedUnit, setSelectedUnit] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [ratingsMap, setRatingsMap] = useState({});
  const [checklist, setChecklist] = useState({});

  const semInt = parseInt(semNumber, 10);
  const semester = SEMESTERS.find(s => s.number === semInt) || SEMESTERS[0];
  const subject = semester.subjects.find(s => s.slug === subjectSlug) || semester.subjects[0];

  // Load checklist progress from localStorage
  useEffect(() => {
    const key = `kamati_check_${semester.number}_${subject.slug}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) setChecklist(JSON.parse(saved));
    } catch (e) {}
  }, [semester.number, subject.slug]);

  const toggleChecklist = (unitIndex) => {
    const key = `kamati_check_${semester.number}_${subject.slug}`;
    const next = { ...checklist, [unitIndex]: !checklist[unitIndex] };
    setChecklist(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch (e) {}
  };

  // Load real rating & helpfulness stats
  useEffect(() => {
    let mounted = true;
    fetchAllRatings().then(map => {
      if (mounted && map) setRatingsMap(map);
    });
    const unsubscribe = subscribeToRatings((detail) => {
      if (mounted && detail && detail.resourceId && detail.stats) {
        setRatingsMap(prev => ({ ...prev, [detail.resourceId]: detail.stats }));
      }
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Fetch all resources for this subject
  const allSubjectResources = getResourcesForSubject(subject.name);
  const categoryResources = allSubjectResources.filter(r => r.category === activeCategory);

  // Filter by unit if selected
  const filteredResources = categoryResources.filter(r => {
    if (selectedUnit === 'all') return true;
    return r.unit === selectedUnit;
  });

  // Sort resources honoring genuine rating and helpfulness data
  const sortedResources = sortResourcesWithRatings(filteredResources, sortBy, ratingsMap);

  // Unique units present in this category
  const unitsPresent = Array.from(new Set(categoryResources.map(r => r.unit))).filter(Boolean);

  const completedUnitsCount = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((completedUnitsCount / subject.units.length) * 100);

  return (
    <div style={{ padding: '40px 0 60px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumbs">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          <span className="breadcrumb-separator">/</span>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/semesters'); }}>Semesters</a>
          <span className="breadcrumb-separator">/</span>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/semester/${semester.number}`); }}>Semester {semester.number}</a>
          <span className="breadcrumb-separator">/</span>
          <span>{subject.name}</span>
        </div>

        {/* Subject Header Banner */}
        <div className="category-card" style={{ padding: '32px', marginBottom: '32px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <span className="meta-pill pill-sem">Semester {semester.number}</span>
                <span className="meta-pill pill-unit">{subject.code}</span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {subject.name}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
                GGSIPU B.Tech Artificial Intelligence & Data Science • Complete Examination Preparation Kit
              </p>
            </div>

            <button 
              type="button" 
              className="btn-preview-doc"
              onClick={() => navigate(`/semester/${semester.number}`)}
            >
              <ArrowLeft size={14} />
              <span>Back to Semester {semester.number}</span>
            </button>
          </div>

          {/* Revision Progress Tracker */}
          <div style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginTop: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                <CheckSquare size={16} color="var(--cyan-primary)" />
                <span>Unit Revision Progress Tracker</span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--cyan-dark)' }}>
                {completedUnitsCount} of {subject.units.length} Units Revised ({progressPercent}%)
              </span>
            </div>

            {/* Progress bar */}
            <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden', marginBottom: '14px' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #08B6D4, #10B981)', transition: 'width 0.3s ease' }}></div>
            </div>

            {/* Units Checkbox Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              {subject.units.map((u, idx) => {
                const checked = !!checklist[idx];
                return (
                  <label 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      color: checked ? 'var(--text-muted)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      textDecoration: checked ? 'line-through' : 'none'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleChecklist(idx)}
                      style={{ accentColor: 'var(--cyan-primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span>Unit {idx + 1}: {u}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4 Core Category Tabs */}
        <div className="tabs-header">
          {RESOURCE_CATEGORIES.map(cat => {
            const count = allSubjectResources.filter(r => r.category === cat.id).length;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                className={`tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedUnit('all');
                }}
              >
                <span>{cat.name}</span>
                <span className="tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Filter and Sorting Toolbar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '12px', 
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-light)'
        }}>
          {/* Unit Filters */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {unitsPresent.length > 0 && (
              <>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Filter size={14} /> Filter Unit:
                </span>
                <button
                  type="button"
                  className={`chip ${selectedUnit === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedUnit('all')}
                >
                  All Units ({categoryResources.length})
                </button>
                {unitsPresent.map(u => (
                  <button
                    key={u}
                    type="button"
                    className={`chip ${selectedUnit === u ? 'active' : ''}`}
                    onClick={() => setSelectedUnit(u)}
                  >
                    {u} ({categoryResources.filter(r => r.unit === u).length})
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Sorting Options */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpDown size={14} /> Sort notes:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer'
              }}
              aria-label="Sort notes"
            >
              <option value="recent">Recently Added (Default)</option>
              <option value="highest_rated">⭐ Highest Rated</option>
              <option value="most_helpful">👍 Most Helpful</option>
              <option value="most_rated">📊 Most Rated</option>
            </select>
          </div>
        </div>

        {/* Resources Cards Grid or Coming Soon State */}
        {sortedResources.length === 0 ? (
          <div className="coming-soon-card">
            <div className="coming-soon-icon">📚</div>
            <h3 className="coming-soon-title">
              {RESOURCE_CATEGORIES.find(c => c.id === activeCategory)?.name} Coming Soon
            </h3>
            <p className="coming-soon-desc">
              We are actively verifying and digitizing {subject.name} {activeCategory} notes for GGSIPU. Have handwritten notes or question papers for this subject?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <a
                href="https://whatsapp.com/channel/0029Vb6RPBA1NCrTsBR2FD1U"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-open-doc"
                style={{ padding: '10px 18px', background: '#10B981', color: '#FFFFFF' }}
              >
                <MessageCircle size={16} />
                <span>Submit / Request on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="resources-grid">
            {sortedResources.map(res => (
              <ResourceCard
                key={res.id}
                resource={res}
                onPreview={onPreview}
                onCopy={onCopy}
                copiedId={copiedId}
                ratingStats={ratingsMap[res.id]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
