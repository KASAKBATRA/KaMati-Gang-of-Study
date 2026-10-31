import React, { useState, useEffect } from 'react';
import { 
  Search, BookOpen, FileText, Zap, Sigma, ArrowRight, 
  Sparkles, Clock, CheckCircle2, MessageCircle, ExternalLink, GraduationCap, Flame
} from 'lucide-react';
import { SEMESTERS, RESOURCE_CATEGORIES } from '../data/curriculum';
import { getSemesterStats, getRecentlyAdded } from '../data/resourceManager';
import { fetchAllRatings, subscribeToRatings } from '../lib/ratingService';
import ResourceCard from '../components/ResourceCard';

export default function HomePage({ navigate, onPreview, onCopy, copiedId }) {
  const [searchInput, setSearchInput] = useState('');
  const [ratingsMap, setRatingsMap] = useState({});
  const recentResources = getRecentlyAdded(6);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div>
      {/* 1. Hero Section (Modern Hybrid Design — Dark Navy) */}
      <section className="hero-section">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="container">
          <div className="hero-content">
            {/* Pill */}
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>GGSIPU AI & DATA SCIENCE STUDY PORTAL</span>
            </div>

            {/* Main Heading */}
            <h1 className="hero-title">
              Your Exams. Your Notes.<br />
              <span className="hero-title-gradient">One Place.</span>
            </h1>

            {/* Supporting Text */}
            <p className="hero-subtitle">
              Everything you need for GGSIPU AI & Data Science semester preparation — unit-wise notes, previous year question papers (PYQs), quick revision sheets and formulas.
            </p>

            {/* Prominent Search Bar */}
            <form onSubmit={handleSearchSubmit} className="hero-search-wrapper" role="search">
              <Search size={22} color="#08B6D4" style={{ marginLeft: '8px' }} />
              <input
                type="text"
                className="hero-search-input"
                placeholder="Search subject, semester, topic, or paper (e.g. Data Science, DAA, Unit 2)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                aria-label="Search study materials"
              />
              <button type="submit" className="hero-search-btn">
                <span>Find Notes</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* CTA Buttons */}
            <div className="hero-cta-row">
              <button 
                type="button" 
                className="btn-secondary-hero"
                onClick={() => navigate('/semesters')}
              >
                <BookOpen size={18} color="#08B6D4" />
                <span>Browse All 8 Semesters</span>
              </button>

              <button 
                type="button" 
                className="btn-secondary-hero"
                onClick={() => navigate('/pyq-analyzer')}
                style={{ borderColor: 'rgba(8, 182, 212, 0.4)' }}
              >
                <Sparkles size={18} color="#08B6D4" />
                <span>⚡ OCR PYQ Analyzer</span>
              </button>

              <button 
                type="button" 
                className="btn-secondary-hero"
                onClick={() => navigate('/checklist')}
              >
                <CheckCircle2 size={18} color="#10B981" />
                <span>Revision Tracker</span>
              </button>
            </div>

            {/* Stats Bar */}
            <div className="stats-bar">
              <div className="stat-item">
                <span className="stat-num">1,030+</span>
                <span className="stat-label">Study Materials</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">8</span>
                <span className="stat-label">Full Semesters</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">44</span>
                <span className="stat-label">Core AI & DS Subjects</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">100%</span>
                <span className="stat-label">Open & Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Access Shortcuts (Light Content Section) */}
      <section className="section" style={{ padding: '40px 0 20px' }}>
        <div className="container">
          <div className="quick-access-grid">
            <div className="quick-card" onClick={() => navigate('/search?category=revision')}>
              <div className="quick-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                <Zap size={22} />
              </div>
              <div className="quick-info">
                <h4>Last-Minute Revision</h4>
                <p>High-yield handouts & summary notes</p>
              </div>
            </div>

            <div className="quick-card" onClick={() => navigate('/search?category=pyq')}>
              <div className="quick-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
                <FileText size={22} />
              </div>
              <div className="quick-info">
                <h4>End-Term PYQs & Solutions</h4>
                <p>2022, 2023, 2024 university papers</p>
              </div>
            </div>

            <div className="quick-card" onClick={() => navigate('/search?category=formula')}>
              <div className="quick-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
                <Sigma size={22} />
              </div>
              <div className="quick-info">
                <h4>Formula Cheat Sheets</h4>
                <p>Important math, ML & logic formulas</p>
              </div>
            </div>

            <div className="quick-card" onClick={() => navigate('/checklist')}>
              <div className="quick-icon" style={{ background: 'rgba(8, 182, 212, 0.15)', color: '#08B6D4' }}>
                <CheckCircle2 size={22} />
              </div>
              <div className="quick-info">
                <h4>Syllabus Checklists</h4>
                <p>Track your unit prep progress</p>
              </div>
            </div>

            <div className="quick-card" onClick={() => navigate('/pyq-analyzer')} style={{ borderLeft: '3px solid #08B6D4' }}>
              <div className="quick-icon" style={{ background: 'rgba(8, 182, 212, 0.15)', color: '#08B6D4' }}>
                <Sparkles size={22} />
              </div>
              <div className="quick-info">
                <h4>⚡ OCR PYQ Analyzer</h4>
                <p>Repeats, topics & unit weightages</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Semester Section (All 8 Semesters) */}
      <section className="section" id="semesters-section">
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">Direct Academic Access</span>
            <h2 className="section-title">Select Your Semester</h2>
            <p className="section-desc">
              Structured GGSIPU AI & Data Science curriculum from 1st Year foundations to 4th Year advanced specializations.
            </p>
          </div>

          <div className="semesters-grid">
            {SEMESTERS.map(sem => {
              const stats = getSemesterStats(sem.number);
              return (
                <div 
                  key={sem.number} 
                  className="semester-card"
                  onClick={() => navigate(`/semester/${sem.number}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/semester/${sem.number}`); }}
                >
                  <div>
                    <div className="sem-top-row">
                      <div className="sem-number-badge">{sem.number}</div>
                      <span className="sem-year-tag">{sem.year}</span>
                    </div>

                    <h3 className="sem-card-title">{sem.title}</h3>
                    <p className="sem-card-desc">{sem.shortDesc}</p>
                  </div>

                  <div className="sem-stats-row">
                    <span>{sem.subjects.length} Subjects • {stats.totalResources > 0 ? `${stats.totalResources} Files` : 'Syllabus Ready'}</span>
                    <span className="sem-action-arrow">
                      <span>View</span>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Resource Categories Section */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">Exam Preparation Categories</span>
            <h2 className="section-title">Everything Categorized for Speed</h2>
            <p className="section-desc">
              No scrolling through unorganized drives. Every file is labeled with its category, semester, and unit.
            </p>
          </div>

          <div className="categories-grid">
            {RESOURCE_CATEGORIES.map(cat => {
              let IconC = BookOpen;
              if (cat.id === 'pyq') IconC = FileText;
              if (cat.id === 'revision') IconC = Zap;
              if (cat.id === 'formula') IconC = Sigma;

              return (
                <div 
                  key={cat.id} 
                  className="category-card"
                  onClick={() => navigate(`/search?category=${cat.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="cat-icon-wrap" style={{ background: `${cat.color}18`, color: cat.color }}>
                    <IconC size={26} />
                  </div>
                  <span className="cat-badge">{cat.badge}</span>
                  <h3 className="cat-title">{cat.name}</h3>
                  <p className="cat-desc">{cat.description}</p>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: cat.color, fontWeight: '700', fontSize: '0.9rem' }}>
                    <span>Browse {cat.shortName}</span>
                    <ArrowRight size={15} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Recently Added / High-Yield Materials */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="section-tag">Updated Resources</span>
              <h2 className="section-title" style={{ marginBottom: '4px' }}>Recently Added & High-Yield</h2>
              <p className="section-desc">Hand-picked and verified semester notes, question paper solutions and formulas.</p>
            </div>
            <button 
              type="button" 
              className="btn-preview-doc"
              onClick={() => navigate('/search')}
              style={{ fontWeight: '700' }}
            >
              <span>Explore All 1,000+ Files</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="resources-grid">
            {recentResources.map(res => (
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
        </div>
      </section>

      {/* 6. Community & Direct Support Banner */}
      <section className="section section-alt" style={{ padding: '50px 0' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #0A0E17 0%, #0F172A 100%)',
            border: '1px solid rgba(8, 182, 212, 0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: '40px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '4px 10px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '12px' }}>
                <Flame size={14} />
                <span>OFFICIAL STUDENT COMMUNITY</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>
                Join KaMati Gang on WhatsApp
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Get instant notices when new end-term question papers, practical files, and viva voce handouts are uploaded. Over 1,000+ GGSIPU students connected.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href="https://whatsapp.com/channel/0029Vb6RPBA1NCrTsBR2FD1U"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#10B981',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-md)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
              >
                <MessageCircle size={18} />
                <span>Join WhatsApp Channel</span>
                <ExternalLink size={14} />
              </a>

              <a
                href="https://www.instagram.com/kamati_gang?igsh=MXg3cXh1aHNvOXM1bA=="
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-md)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>@kamati_gang</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
