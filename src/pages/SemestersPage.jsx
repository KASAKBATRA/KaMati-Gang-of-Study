import React from 'react';
import { ArrowRight, BookOpen, Layers, CheckCircle } from 'lucide-react';
import { SEMESTERS } from '../data/curriculum';
import { getSemesterStats } from '../data/resourceManager';

export default function SemestersPage({ navigate }) {
  return (
    <div style={{ padding: '40px 0 60px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumbs">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          <span className="breadcrumb-separator">/</span>
          <span>Semesters</span>
        </div>

        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: '36px' }}>
          <span className="section-tag">Complete Curriculum</span>
          <h1 className="section-title">GGSIPU AI & Data Science Semesters</h1>
          <p className="section-desc">
            Access curated study notes, syllabus schemes, previous-year question papers, and quick formula sheets for all 8 semesters.
          </p>
        </div>

        {/* Semesters Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {SEMESTERS.map(sem => {
            const stats = getSemesterStats(sem.number);
            return (
              <div 
                key={sem.number} 
                className="category-card"
                style={{ padding: '28px', cursor: 'pointer' }}
                onClick={() => navigate(`/semester/${sem.number}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="sem-number-badge" style={{ width: '52px', height: '52px', fontSize: '1.4rem' }}>
                      {sem.number}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                          {sem.title}
                        </h2>
                        <span className="sem-year-tag">{sem.year}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>
                        {sem.shortDesc}
                      </p>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    className="btn-open-doc"
                    style={{ fontSize: '0.88rem', padding: '10px 18px' }}
                  >
                    <span>Open Semester {sem.number}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>

                {/* Subjects Badges */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    Core Subjects ({sem.subjects.length}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {sem.subjects.map(subj => (
                      <span 
                        key={subj.slug}
                        style={{
                          fontSize: '0.82rem',
                          background: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          padding: '5px 12px',
                          borderRadius: '8px',
                          color: 'var(--text-secondary)',
                          fontWeight: '600'
                        }}
                      >
                        {subj.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom stats row */}
                <div className="sem-stats-row">
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span><strong>{stats.notesCount}</strong> Notes</span>
                    <span><strong>{stats.pyqCount}</strong> PYQs</span>
                    <span><strong>{stats.revisionCount}</strong> Revision Files</span>
                    <span><strong>{stats.formulaCount}</strong> Formulas</span>
                  </div>
                  <span style={{ color: 'var(--cyan-dark)', fontWeight: '700' }}>
                    Total: {stats.totalResources > 0 ? `${stats.totalResources} Materials` : 'Syllabus Ready'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
