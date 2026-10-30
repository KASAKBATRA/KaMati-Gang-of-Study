import React from 'react';
import { 
  Heart, Users, ShieldCheck, Mail, MessageCircle, 
  ExternalLink, GraduationCap, CheckCircle2, Sparkles, BookOpen 
} from 'lucide-react';
import { TEAM_MEMBERS } from '../data/curriculum';

export default function AboutPage({ navigate }) {
  return (
    <div style={{ padding: '40px 0 60px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumbs">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          <span className="breadcrumb-separator">/</span>
          <span>About</span>
        </div>

        {/* Header */}
        <div className="section-header" style={{ marginBottom: '36px' }}>
          <span className="section-tag">Student-Driven Project</span>
          <h1 className="section-title">About KaMati Gang of Study</h1>
          <p className="section-desc">
            Empowering Guru Gobind Singh Indraprastha University (GGSIPU) Artificial Intelligence & Data Science engineering students.
          </p>
        </div>

        {/* Mission Card */}
        <div className="category-card" style={{ padding: '36px', marginBottom: '40px', background: 'var(--bg-surface)' }}>
          <div style={{ maxWidth: '820px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
              Built by Students, for Students
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '16px' }}>
              <strong>KaMati Gang of Study</strong> was created to solve a universal struggle faced by IPU engineering students: scrambling across scattered Telegram groups, chaotic Google Drive links, and messy folders right before examinations.
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px' }}>
              We organized all 8 semesters of the <strong>B.Tech Artificial Intelligence & Data Science</strong> curriculum into a simple, direct-access portal: <strong>Open Website → Select Semester → Select Subject → Access Required Material.</strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>No Accounts / No Login</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Direct access to notes without friction.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Unit-Wise Organization</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Strictly aligned with the GGSIPU scheme.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Real Google Drive Files</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Over 1,000+ verified PDFs & papers.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div style={{ marginBottom: '48px' }}>
          <div className="section-header">
            <span className="section-tag">Core Contributors</span>
            <h2 className="section-title">Meet the KaMati Team</h2>
            <p className="section-desc">The student developers and coordinators behind the portal.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {TEAM_MEMBERS.map(member => (
              <div key={member.name} className="resource-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {member.name}
                    </h3>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--cyan-dark)', textTransform: 'uppercase' }}>
                      {member.role}
                    </span>
                  </div>
                  <span className="meta-pill pill-sem">{member.tag}</span>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '18px' }}>
                  {member.bio}
                </p>

                <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-preview-doc"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <span>Connect on LinkedIn</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official Channels & Contribution Card */}
        <div className="category-card" style={{ padding: '32px', background: 'var(--bg-surface)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px' }}>
            Want to Share Notes or Contribute Papers?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px', maxWidth: '720px' }}>
            KaMati Gang grows through student collaboration. If you have clean handwritten notes, mid-term/end-term question papers, practical lab files, or formula sheets, share them with us via WhatsApp or Email!
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a
              href="https://whatsapp.com/channel/0029Vb6RPBA1NCrTsBR2FD1U"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-open-doc"
              style={{ background: '#10B981', color: '#FFFFFF', padding: '12px 20px', fontSize: '0.92rem' }}
            >
              <MessageCircle size={18} />
              <span>Join WhatsApp Community</span>
            </a>

            <a
              href="mailto:kamatigangofstudy@gmail.com"
              className="btn-preview-doc"
              style={{ padding: '12px 20px', fontSize: '0.92rem' }}
            >
              <Mail size={18} />
              <span>Email: kamatigangofstudy@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
