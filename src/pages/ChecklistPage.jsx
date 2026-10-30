import React, { useState, useEffect } from 'react';
import { CheckSquare, RotateCcw, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { SEMESTERS } from '../data/curriculum';

export default function ChecklistPage({ navigate }) {
  const [selectedSem, setSelectedSem] = useState(3);
  const [checklistData, setChecklistData] = useState({});

  const semester = SEMESTERS.find(s => s.number === selectedSem) || SEMESTERS[0];

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kamati_master_checklist');
      if (saved) setChecklistData(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const toggleUnit = (subjSlug, unitIdx) => {
    const key = `${selectedSem}_${subjSlug}_${unitIdx}`;
    const next = { ...checklistData, [key]: !checklistData[key] };
    setChecklistData(next);
    try {
      localStorage.setItem('kamati_master_checklist', JSON.stringify(next));
    } catch (e) {}
  };

  const resetSemester = () => {
    if (window.confirm(`Reset revision progress for Semester ${selectedSem}?`)) {
      const next = { ...checklistData };
      semester.subjects.forEach(subj => {
        subj.units.forEach((_, idx) => {
          delete next[`${selectedSem}_${subj.slug}_${idx}`];
        });
      });
      setChecklistData(next);
      try {
        localStorage.setItem('kamati_master_checklist', JSON.stringify(next));
      } catch (e) {}
    }
  };

  // Calculate stats for current semester
  let totalUnits = 0;
  let completedUnits = 0;
  semester.subjects.forEach(subj => {
    subj.units.forEach((_, idx) => {
      totalUnits++;
      if (checklistData[`${selectedSem}_${subj.slug}_${idx}`]) {
        completedUnits++;
      }
    });
  });

  const progress = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  return (
    <div style={{ padding: '40px 0 60px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumbs">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          <span className="breadcrumb-separator">/</span>
          <span>Exam Revision Tracker</span>
        </div>

        {/* Header */}
        <div className="section-header" style={{ marginBottom: '28px' }}>
          <span className="section-tag">Self-Paced Exam Readiness</span>
          <h1 className="section-title">Semester Revision Tracker</h1>
          <p className="section-desc">
            Check off syllabus units as you revise notes and solve PYQs. Saved automatically to your browser.
          </p>
        </div>

        {/* Semester Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
          {SEMESTERS.map(s => (
            <button
              key={s.number}
              type="button"
              className={`chip ${selectedSem === s.number ? 'active' : ''}`}
              onClick={() => setSelectedSem(s.number)}
              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
            >
              Sem {s.number}
            </button>
          ))}
        </div>

        {/* Overall Progress Banner */}
        <div className="category-card" style={{ padding: '24px', marginBottom: '32px', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
            <div>
              <span className="sem-year-tag">{semester.year}</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
                Semester {semester.number} Revision Progress: {progress}%
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-preview-doc"
                onClick={resetSemester}
                style={{ fontSize: '0.82rem' }}
              >
                <RotateCcw size={14} />
                <span>Reset Sem {semester.number}</span>
              </button>

              <button
                type="button"
                className="btn-open-doc"
                onClick={() => navigate(`/semester/${semester.number}`)}
                style={{ fontSize: '0.82rem' }}
              >
                <span>View Notes</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #08B6D4, #10B981)', transition: 'width 0.3s ease' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            <span>{completedUnits} of {totalUnits} Units Completed</span>
            <span>{totalUnits - completedUnits} Units Remaining</span>
          </div>
        </div>

        {/* Subject wise checklists */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {semester.subjects.map(subj => {
            let subjCompleted = 0;
            subj.units.forEach((_, idx) => {
              if (checklistData[`${selectedSem}_${subj.slug}_${idx}`]) subjCompleted++;
            });

            return (
              <div key={subj.slug} className="resource-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 6px', background: 'rgba(8, 182, 212, 0.12)', color: 'var(--cyan-dark)', borderRadius: '4px' }}>
                      {subj.code}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
                      {subj.name}
                    </h3>
                  </div>

                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: subjCompleted === subj.units.length ? '#10B981' : 'var(--text-muted)' }}>
                    {subjCompleted}/{subj.units.length} Units
                  </span>
                </div>

                {/* Units List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '12px 0 16px' }}>
                  {subj.units.map((u, idx) => {
                    const isChecked = !!checklistData[`${selectedSem}_${subj.slug}_${idx}`];
                    return (
                      <label
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: isChecked ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-primary)',
                          border: `1px solid ${isChecked ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-color)'}`,
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: isChecked ? 'line-through' : 'none'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleUnit(subj.slug, idx)}
                          style={{ marginTop: '3px', accentColor: 'var(--cyan-primary)', cursor: 'pointer' }}
                        />
                        <span><strong>Unit {idx + 1}:</strong> {u}</span>
                      </label>
                    );
                  })}
                </div>

                <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                  <button
                    type="button"
                    onClick={() => navigate(`/semester/${semester.number}/subject/${subj.slug}`)}
                    className="btn-preview-doc"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <BookOpen size={14} />
                    <span>Open {subj.name} Notes</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
