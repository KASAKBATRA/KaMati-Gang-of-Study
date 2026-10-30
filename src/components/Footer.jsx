import React from 'react';
import { Mail, MessageCircle, ExternalLink, Heart, ShieldCheck } from 'lucide-react';

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Footer({ navigate }) {
  return (
    <footer>
      <div className="container">
        {/* Disclaimer box */}
        <div className="disclaimer-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#94A3B8', fontWeight: '700' }}>
            <ShieldCheck size={16} color="#08B6D4" />
            <span>Academic Resource & Fair Use Disclaimer</span>
          </div>
          KaMati Gang of Study is an independent student-run repository created strictly for peer educational assistance and exam preparation for GGSIPU Artificial Intelligence & Data Science students. All question papers, notes, and study materials belong to their respective faculty, authors, and Guru Gobind Singh Indraprastha University.
        </div>

        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <h3>KaMati <span>Gang of Study</span></h3>
            <p className="footer-desc">
              Your Exams. Your Notes. One Place. Curated unit-wise notes, previous year question papers, and high-yield revision resources for all 8 semesters of GGSIPU AI & Data Science.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a 
                href="https://whatsapp.com/channel/0029Vb6RPBA1NCrTsBR2FD1U" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '700' }}
              >
                <MessageCircle size={18} />
                WhatsApp Channel
              </a>
              <a 
                href="https://www.instagram.com/kamati_gang?igsh=MXg3cXh1aHNvOXM1bA==" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: '700' }}
              >
                <InstagramIcon size={18} />
                @kamati_gang
              </a>
            </div>
          </div>

          {/* Semesters Quick Links */}
          <div>
            <h4 className="footer-title">Semesters</h4>
            <ul className="footer-links">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <li key={s}>
                  <button 
                    type="button" 
                    onClick={() => navigate(`/semester/${s}`)}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  >
                    Semester {s} Resources
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resource Categories */}
          <div>
            <h4 className="footer-title">Categories</h4>
            <ul className="footer-links">
              <li>
                <button type="button" onClick={() => navigate('/search?category=notes')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Unit-Wise Notes
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/search?category=pyq')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Previous Year Papers (PYQ)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/search?category=revision')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Quick Revision Sheets
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/search?category=formula')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Formula Cheat Sheets
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/search?category=syllabus')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Official Syllabus Schemes
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/pyq-analyzer')} style={{ background: 'none', border: 'none', color: 'var(--cyan-primary)', cursor: 'pointer', textAlign: 'left', padding: 0, fontWeight: '700' }}>
                  ⚡ OCR PYQ Analyzer
                </button>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/checklist')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Exam Revision Checklist
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="footer-title">Contact & Help</h4>
            <ul className="footer-links">
              <li>
                <a href="mailto:kamatigangofstudy@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={15} />
                  kamatigangofstudy@gmail.com
                </a>
              </li>
              <li>
                <button type="button" onClick={() => navigate('/about')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Meet the Developer Team
                </button>
              </li>
              <li>
                <a href="https://whatsapp.com/channel/0029Vb6RPBA1NCrTsBR2FD1U" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Contribute Notes / Papers
                  <ExternalLink size={13} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © 2025–2026 KaMati Gang of Study. Built for GGSIPU AI & Data Science students.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748B' }}>
            <span>Knowledge is not just learned, it is received with humility.</span>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: '0.75rem',
                cursor: 'pointer',
                opacity: 0.6
              }}
              title="Admin Automation Dashboard"
            >
              🔒 Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
