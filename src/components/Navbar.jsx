import React, { useState } from 'react';
import { BookOpen, Moon, Sun, Menu, X, CheckSquare, Search, GraduationCap } from 'lucide-react';

export default function Navbar({ currentRoute, navigate, isDark, toggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (route) => {
    navigate(route);
    setMobileOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand */}
        <div className="navbar-brand" onClick={() => handleNav('/')} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="KaMati Gang of Study Logo" className="navbar-logo" width="40" height="40" />
          <div className="brand-text">
            <span className="brand-title">KaMati <span>Gang of Study</span></span>
            <span className="brand-badge">GGSIPU • AI & Data Science</span>
          </div>
        </div>

        {/* Desktop Links */}
        <nav className="navbar-links" aria-label="Main Navigation">
          <button 
            type="button" 
            className={`nav-link ${currentRoute === '/' ? 'active' : ''}`}
            onClick={() => handleNav('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Home
          </button>
          <button 
            type="button" 
            className={`nav-link ${currentRoute.startsWith('/semesters') || currentRoute.startsWith('/semester') ? 'active' : ''}`}
            onClick={() => handleNav('/semesters')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Semesters (1-8)
          </button>
          <button 
            type="button" 
            className={`nav-link ${currentRoute === '/pyq-analyzer' ? 'active' : ''}`}
            onClick={() => handleNav('/pyq-analyzer')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <span>PYQ Analyzer</span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: '800',
              padding: '1px 5px',
              borderRadius: '999px',
              background: 'rgba(8, 182, 212, 0.18)',
              color: 'var(--cyan-dark)'
            }}>
              OCR
            </span>
          </button>
          <button 
            type="button" 
            className={`nav-link ${currentRoute.startsWith('/search') ? 'active' : ''}`}
            onClick={() => handleNav('/search')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Search size={15} />
            Search
          </button>
          <button 
            type="button" 
            className={`nav-link ${currentRoute === '/checklist' ? 'active' : ''}`}
            onClick={() => handleNav('/checklist')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <CheckSquare size={15} />
            Revision Tracker
          </button>
          <button 
            type="button" 
            className={`nav-link ${currentRoute === '/about' ? 'active' : ''}`}
            onClick={() => handleNav('/about')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            About
          </button>
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          <button 
            type="button" 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            type="button" 
            className="mobile-menu-btn" 
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Mobile Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        <button 
          type="button" 
          className="nav-link" 
          onClick={() => handleNav('/')}
          style={{ background: 'none', border: 'none', textAlign: 'left' }}
        >
          Home
        </button>
        <button 
          type="button" 
          className="nav-link" 
          onClick={() => handleNav('/semesters')}
          style={{ background: 'none', border: 'none', textAlign: 'left' }}
        >
          Semesters (1 - 8)
        </button>
        <button 
          type="button" 
          className="nav-link" 
          onClick={() => handleNav('/pyq-analyzer')}
          style={{ background: 'none', border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <span>⚡ OCR PYQ Analyzer</span>
          <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: 'var(--cyan-light)', color: 'var(--cyan-dark)', fontWeight: '800' }}>NEW</span>
        </button>
        <button 
          type="button" 
          className="nav-link" 
          onClick={() => handleNav('/search')}
          style={{ background: 'none', border: 'none', textAlign: 'left' }}
        >
          Search Notes & PYQs
        </button>
        <button 
          type="button" 
          className="nav-link" 
          onClick={() => handleNav('/checklist')}
          style={{ background: 'none', border: 'none', textAlign: 'left' }}
        >
          Revision Tracker
        </button>
        <button 
          type="button" 
          className="nav-link" 
          onClick={() => handleNav('/about')}
          style={{ background: 'none', border: 'none', textAlign: 'left' }}
        >
          About & Community
        </button>
        <button 
          type="button" 
          className="nav-link" 
          onClick={() => handleNav('/admin')}
          style={{ background: 'none', border: 'none', textAlign: 'left', opacity: 0.7, fontSize: '0.85rem' }}
        >
          🔒 Admin Portal
        </button>
      </div>
    </header>
  );
}
