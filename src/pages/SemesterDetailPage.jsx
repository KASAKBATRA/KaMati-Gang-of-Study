import React, { useState } from 'react';
import { ArrowRight, BookOpen, Search, ArrowLeft, Layers, FileText, Zap, Sigma } from 'lucide-react';
import { SEMESTERS } from '../data/curriculum';
import { getSubjectStats, getResourcesForSemester } from '../data/resourceManager';

export default function SemesterDetailPage({ semNumber, navigate }) {
  const [filterQuery, setFilterQuery] = useState('');
  const semInt = parseInt(semNumber, 10);
  const semester = SEMESTERS.find(s => s.number === semInt) || SEMESTERS[0];

  const filteredSubjects = semester.subjects.filter(subj => 
    !filterQuery || 
    subj.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    subj.code.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '40px 0 60px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumbs">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          <span className="breadcrumb-separator">/</span>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/semesters'); }}>Semesters</a>
          <span className="breadcrumb-separator">/</span>
          <span>Semester {semester.number}</span>
        </div>

        {/* Semester Header Card */}
        <div className="category-card" style={{ padding: '32px', marginBottom: '36px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="sem-number-badge" style={{ width: '56px', height: '56px', fontSize: '1.5rem' }}>
                {semester.number}
              </div>
              <div>
                <span className="sem-year-tag">{semester.year}</span>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {semester.title} — AI & Data Science
                </h1>
              </div>
            </div>

            <button 
              type="button" 
              className="btn-preview-doc"
              onClick={() => navigate('/semesters')}
            >
              <ArrowLeft size={14} />
              <span>All Semesters</span>
            </button>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', maxWidth: '720px', lineHeight: '1.6' }}>
            {semester.shortDesc} Select a subject below to browse unit-wise handwritten notes, previous-year question papers (PYQs), quick revision sheets and formulas.
          </p>

          {/* Search/filter within semester subjects */}
          <div style={{ marginTop: '24px', maxWidth: '440px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px'
            }}>
              <Search size={18} color="var(--cyan-dark)" />
              <input
                type="text"
                placeholder={`Search among Semester ${semester.number} subjects...`}
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                  width: '100%'
                }}
              />
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              Core Subjects ({filteredSubjects.length})
            </h2>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Click any subject to open material
            </span>
          </div>

          <div className="semesters-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {filteredSubjects.map(subj => {
              const stats = getSubjectStats(subj.name);
              return (
                <div
                  key={subj.slug}
                  className="semester-card"
                  onClick={() => navigate(`/semester/${semester.number}/subject/${subj.slug}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '700', 
                        padding: '3px 8px', 
                        background: 'rgba(8, 182, 212, 0.12)', 
                        color: 'var(--cyan-dark)', 
                        borderRadius: '6px' 
                      }}>
                        {subj.code}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {stats.total > 0 ? `${stats.total} Files` : 'Syllabus Ready'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
                      {subj.name}
                    </h3>

                    {/* Units preview */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Syllabus Units:
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {subj.units.slice(0, 3).map((u, i) => (
                          <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--cyan-primary)' }}></span>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Resource pill breakdown */}
                  <div className="sem-stats-row">
                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
                      <span title="Notes">📚 {stats.notes}</span>
                      <span title="PYQs">📝 {stats.pyqs}</span>
                      <span title="Revision">⚡ {stats.revision}</span>
                      <span title="Formulas">📐 {stats.formulas}</span>
                    </div>

                    <span className="sem-action-arrow">
                      <span>Open</span>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
