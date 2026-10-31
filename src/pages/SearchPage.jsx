import React, { useState, useEffect } from 'react';
import { Search, X, Filter, BookOpen, FileText, Zap, Sigma, ArrowRight, ArrowUpDown } from 'lucide-react';
import { searchResources } from '../data/resourceManager';
import { fetchAllRatings, subscribeToRatings, sortResourcesWithRatings } from '../lib/ratingService';
import ResourceCard from '../components/ResourceCard';

export default function SearchPage({ initialQuery = '', initialCategory = 'all', navigate, onPreview, onCopy, copiedId }) {
  const [query, setQuery] = useState(initialQuery);
  const [semester, setSemester] = useState('all');
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('recent');
  const [ratingsMap, setRatingsMap] = useState({});

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

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  const rawResults = searchResources(query, semester, category);
  const sortedResults = sortResourcesWithRatings(rawResults, sortBy, ratingsMap);

  return (
    <div style={{ padding: '40px 0 60px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumbs">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          <span className="breadcrumb-separator">/</span>
          <span>Search Resources</span>
        </div>

        {/* Search Header */}
        <div className="section-header" style={{ marginBottom: '28px' }}>
          <span className="section-tag">Instant Finder</span>
          <h1 className="section-title">Search GGSIPU Study Material</h1>
          <p className="section-desc">
            Search by subject name, semester number, document title, syllabus unit, or paper year.
          </p>
        </div>

        {/* Search Input Box */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Search size={22} color="var(--cyan-primary)" />
            <input
              type="text"
              placeholder="Search by title, subject, or keyword (e.g. Data Science, DLD, Unit 3, 2023)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '1.05rem'
              }}
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-light)',
            alignItems: 'center'
          }}>
            {/* Semester selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Semester:</span>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={String(s)}>Semester {s}</option>
                ))}
              </select>
            </div>

            {/* Category selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Category:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 10px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Categories</option>
                <option value="notes">Unit-Wise Notes</option>
                <option value="pyq">Previous Year Papers (PYQ)</option>
                <option value="revision">Quick Revision Sheets</option>
                <option value="syllabus">Official Syllabus / Scheme</option>
                <option value="formula">Formula Sheets</option>
              </select>
            </div>

            {(query || semester !== 'all' || category !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSemester('all');
                  setCategory('all');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--cyan-dark)',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginLeft: 'auto'
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Counter & Sort */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Found <strong>{sortedResults.length}</strong> matching study resources
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              aria-label="Sort search results"
            >
              <option value="recent">Recently Added (Default)</option>
              <option value="highest_rated">⭐ Highest Rated</option>
              <option value="most_helpful">👍 Most Helpful</option>
              <option value="most_rated">📊 Most Rated</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        {sortedResults.length === 0 ? (
          <div className="coming-soon-card" style={{ maxWidth: '600px' }}>
            <div className="coming-soon-icon">🔍</div>
            <h3 className="coming-soon-title">No matching study materials found</h3>
            <p className="coming-soon-desc">
              We couldn't find any resources matching your search. Try checking your spelling or selecting "All Semesters".
            </p>
            <button
              type="button"
              className="btn-preview-doc"
              onClick={() => {
                setQuery('');
                setSemester('all');
                setCategory('all');
              }}
              style={{ margin: '0 auto' }}
            >
              Show All Available Notes
            </button>
          </div>
        ) : (
          <div className="resources-grid">
            {sortedResults.slice(0, 80).map(res => (
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
