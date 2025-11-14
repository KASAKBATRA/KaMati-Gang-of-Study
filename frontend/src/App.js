
import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import SplashScreen from './SplashScreen';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Home, BookOpen, Mail, MessageCircle, Star, Eye, Info, Phone, Sun, Moon, Search, Trash2, Reply, Send, Handshake, ChevronDown } from 'lucide-react';
import notesData from './notes/notesData';
// Semester to subjects mapping
const semesterSubjects = {
  3: [
    "Syllabus",
    "Data Science",
    "Data Structures",
    "Principles of Artificial Intelligence",
    "Probability, Statistics and Linear Algebra",
    "Digital Logic Design",
    "Universal Human Values",
    "Critical Reasoning, System Thinking"
  ],
  4: [
    "Machine Learning",
    "Object-Oriented Programming",
    "Computational Mathematics",
    "Computer Networks and Internet Protocols",
    "Software Engineering",
    "Database Management System"
  ],
  5: [
    "Syllabus",
    "Computer Architecture and Organization",
    "Design and Analysis of Algorithms",
    "Data Mining",
    "Internet of Things",
    "Operating System",
    "Principles of Entrepreneurship Mindset"
  ],
  6: [
    "Digital Image Processing",
    "Fundamentals of Deep Learning",
    "Big Data Analytics",
    "Cognitive Computing",
    "Blockchain Technology",
    "Cloud Computing"
  ]
};

// Exam datesheet (semester mapped)
const examDates = {
  3: [
    { name: 'UHV', date: '15-12-25' },
    { name: 'DS', date: '17-12-25' },
    { name: 'FODS', date: '19-12-25' },
    { name: 'DLD', date: '22-12-25' },
    { name: 'PAI', date: '24-12-25' },
    { name: 'PSLA', date: '27-12-25' },
    { name: 'CRST', date: '30-12-25' }
  ],
  5: [
    { name: 'PME', date: '16/12/2025' },
    { name: 'DAA', date: '18/12/25' },
    { name: 'FODL', date: '20/12/25' },
    { name: 'COA', date: '23/12/25' },
    { name: 'IOT', date: '26/12/25' },
    { name: 'OS', date: '31/12/25' }
  ],
  7: [
    { name: 'PEM', date: '15/12/25' },
    { name: 'BIA', date: '17/12/25' },
    { name: 'ADS', date: '19/12/25' },
    { name: 'WI', date: '22/12/25' },
    { name: 'CV', date: '24/12/25' },
    { name: 'ASP', date: '02/01/26' }
  ]
};

// Helper: parse date strings like '16/12/2025', '18/12/25', '15-12-25' etc.
function parseExamDate(str) {
  if (!str) return null;
  const s = String(str).trim();
  const sep = s.includes('/') ? '/' : s.includes('-') ? '-' : null;
  if (!sep) return new Date(s);
  const parts = s.split(sep).map(p => p.trim());
  if (parts.length < 3) return new Date(s);
  let [d, m, y] = parts;
  if (y.length === 2) y = '20' + y;
  // Use local time at 09:00 to avoid timezone surprises
  return new Date(Number(y), Number(m) - 1, Number(d), 9, 0, 0);
}

// Today's rotating study targets (subject + chapter suggestions)
const todaysTargets = [
  'PME - Revision: Module 1',
  'DAA - Greedy Algorithms',
  'FODL - Design Patterns',
  'COA - Pipelining',
  'IOT - MQTT Basics',
  'OS - Process Scheduling',
  'UHV - Ethics Case Study',
  'DS - Graph Algorithms',
  'FODS - Database Normalization',
  'DLD - Sequential Circuits',
  'PAI - Search Heuristics',
  'PSLA - Probability Problems',
  'CRST - Critical Reasoning',
  'BIA - Business Intelligence Overview',
  'ADS - Advanced Data Structures',
  'WI - Web Integration',
  'CV - Computer Vision Pipeline',
  'ASP - Advanced System Programming'
];

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Exam countdown component
function ExamCountdown({ semester }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const exams = (examDates[Number(semester)] || []).map(e => ({
    name: e.name,
    date: parseExamDate(e.date)
  }));

  // find earliest upcoming exam
  const upcoming = exams
    .filter(e => e.date && e.date.getTime() > now.getTime())
    .sort((a, b) => a.date - b.date);

  const first = upcoming.length ? upcoming[0] : null;
  const daysUntilFirst = first ? Math.floor((first.date - now) / (1000 * 60 * 60 * 24)) : null;

  // pick today's target by rotating daily (deterministic)
  const dayIndex = Math.floor(now.getTime() / (24 * 60 * 60 * 1000)) % todaysTargets.length;
  const todaysTarget = todaysTargets[dayIndex];

  function timeLeft(date) {
    if (!date) return null;
    const diff = date.getTime() - now.getTime();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  }

  return (
    <div className="exam-side">
      <div className="exam-header">
        <h3>Exam Countdown (Sem {semester})</h3>
        <p className="todays-target">Today\'s Target: {todaysTarget}</p>
      </div>

      {first && daysUntilFirst > 5 && (
        <div className="exam-banner">Exams start in <strong>{daysUntilFirst}</strong> days for this semester</div>
      )}

      {(first && daysUntilFirst <= 5) || (!first && exams.length > 0) ? (
        <div className="exam-cards">
          {exams.map((e) => {
            const tl = timeLeft(e.date);
            return (
              <div key={e.name} className="exam-card">
                <div className="exam-title">{e.name}</div>
                <div className="exam-date">{e.date ? e.date.toDateString() : 'TBA'}</div>
                <div className={`exam-time ${!tl ? 'completed' : ''}`}>
                  {tl ? (
                    <>
                      <span className="d">{tl.days}d</span>
                      <span className="h">{String(tl.hours).padStart(2,'0')}h</span>
                      <span className="m">{String(tl.minutes).padStart(2,'0')}m</span>
                      <span className="s">{String(tl.seconds).padStart(2,'0')}s</span>
                    </>
                  ) : (
                    <span>Exam Completed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

// Semester card that shows a summary and expands to show full datesheet timers
function SemesterExamCard({ semester }) {
  const [now, setNow] = useState(new Date());
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const exams = (examDates[Number(semester)] || []).map(e => ({
    name: e.name,
    date: parseExamDate(e.date)
  }));

  // find earliest upcoming exam
  const upcoming = exams
    .filter(e => e.date && e.date.getTime() > now.getTime())
    .sort((a, b) => a.date - b.date);

  const first = upcoming.length ? upcoming[0] : null;
  const daysUntilFirst = first ? Math.floor((first.date - now) / (1000 * 60 * 60 * 24)) : null;

  function timeLeftObj(date) {
    if (!date) return null;
    const diff = date.getTime() - now.getTime();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  }

  return (
    <div className={`semester-card ${expanded ? 'expanded' : ''}`} onClick={() => setExpanded(!expanded)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setExpanded(!expanded); }}>
      <div className="semester-summary-row">
        <div className="semester-summary-left">
          <div className="sem-title">Semester {semester}</div>
          <div className="sem-sub">{first ? `Next: ${first.name}` : (exams.length ? 'Upcoming exams' : 'No exams') }</div>
        </div>

        <div className="semester-summary-right">
          <div className="sem-badge" title={first ? `${daysUntilFirst} days` : '—'}>
            {first ? `${daysUntilFirst}` : '—'}
          </div>
          <ChevronDown className={`sem-chevron ${expanded ? 'rotated' : ''}`} size={18} />
        </div>
      </div>

      <div className={`semester-details-wrapper ${expanded ? 'open' : ''}`}>
        <div className="semester-details">
          {exams.length === 0 && <div className="no-exams">No datesheet available</div>}
          {exams.map((e) => {
            const tl = timeLeftObj(e.date);
            return (
              <div key={e.name} className="semester-exam-row">
                <div className="exam-left">
                  <div className="exam-name">{e.name}</div>
                  <div className="exam-on">{e.date ? e.date.toDateString() : 'TBA'}</div>
                </div>
                <div className={`exam-countdown ${!tl ? 'completed' : ''}`}>
                  {tl ? (
                    <span>{tl.days}d {String(tl.hours).padStart(2,'0')}h {String(tl.minutes).padStart(2,'0')}m</span>
                  ) : (
                    <span>Exam Completed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const KaMaTi = () => {
  const [activeSection, setActiveSection] = useState('home');
  // Flatten notesData into a single array for easier filtering
  const allNotes = Object.entries(notesData).flatMap(([subject, notes]) =>
    notes.map((note, idx) => ({
      id: `${subject}-${idx}`,
      title: note.title,
      semester: note.semester,
      subject,
      size: note.size || '2 MB',
      file_url: note.url,
      uploaded_at: note.uploaded_at || '',
    }))
  );
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3500); // Show splash for 3.5s
    return () => clearTimeout(timer);
  }, []);

  const [notes, setNotes] = useState(allNotes);
  const [discussions, setDiscussions] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [driveViewerOpen, setDriveViewerOpen] = useState(false);
  const [driveViewerUrl, setDriveViewerUrl] = useState('');
  const [driveViewerInteractive, setDriveViewerInteractive] = useState(false);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '', name: '' });
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  // Default: show all subjects and semester 3
  const [filters, setFilters] = useState({ year: '', subject: 'all', semester: '3' });
  const [theme, setTheme] = useState('dark'); // 'light' or 'dark'
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [newReply, setNewReply] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Sample notes data - will be replaced with real database data
  const sampleNotes = [
    {
      id: '1',
      title: 'Linear Regression Notes',
      semester: '3',
      subject: 'Data Science',
      size: '2.1 MB',
      file_url: '#',
      uploaded_at: '2024-12-01'
    },
    {
      id: '2',
      title: 'FODS Assignment Solutions',
      semester: '3',
      subject: 'Data Science',
      size: '1.8 MB',
      file_url: '#',
      uploaded_at: '2024-11-28'
    },
    {
      id: '3',
      title: 'Machine Learning Basics',
      semester: '3',
      subject: 'Data Science',
      size: '3.2 MB',
      file_url: '#',
      uploaded_at: '2024-11-25'
    },
    {
      id: '4',
      title: 'Python Programming Guide',
      semester: '3',
      subject: 'Computer Science',
      size: '2.5 MB',
      file_url: '#',
      uploaded_at: '2024-11-20'
    },
    {
      id: '5',
      title: 'Database Management System',
      semester: '4',
      subject: 'Computer Science',
      size: '4.1 MB',
      file_url: '#',
      uploaded_at: '2024-11-15'
    },
    {
      id: '6',
      title: 'Web Development Fundamentals',
      semester: '4',
      subject: 'Computer Science',
      size: '3.8 MB',
      file_url: '#',
      uploaded_at: '2024-11-10'
    }
  ];


  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    // Show feedback popup after 5 minutes, only if not already filled
    if (!localStorage.getItem('feedbackSubmitted')) {
      const timer = setTimeout(() => {
        setShowFeedback(true);
      }, 300000); // 5 minutes
      return () => clearTimeout(timer);
    }
    // Load discussions only (notes are static from notesData)
    loadDiscussions();
    setNotes(allNotes);
  }, [theme]);

  const loadDiscussions = async () => {
    try {
      const response = await axios.get(`${API}/discussions`);
      setDiscussions(response.data);
    } catch (error) {
      console.error('Error loading discussions:', error);
    }
  };

  // Drive viewer helpers
  function getDrivePreviewUrl(url) {
    try {
      if (!url) return '';
      const u = String(url);
      // match file id patterns like /d/FILE_ID/
      const m = u.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (m && m[1]) return `https://drive.google.com/file/d/${m[1]}/preview`;
      // if it's already a drive preview or docs link, return as-is
      if (u.includes('drive.google.com') || u.includes('docs.google.com')) return u;
      return u;
    } catch (e) { return url; }
  }

  function openDriveViewer(url) {
    const preview = getDrivePreviewUrl(url);
    setDriveViewerUrl(preview);
    setDriveViewerInteractive(false); // default: non-interactive to discourage download
    setDriveViewerOpen(true);
  }

  function closeDriveViewer() {
    setDriveViewerOpen(false);
    setDriveViewerUrl('');
    setDriveViewerInteractive(false);
  }

  // Remove loadNotes, not needed anymore

  const submitFeedback = async () => {
    try {
      await axios.post(`${API}/feedback`, feedback);
      setShowFeedback(false);
      localStorage.setItem('feedbackSubmitted', 'true');
      // Open WhatsApp channel
      window.open('https://whatsapp.com/channel/0029Vb6RPBA1NCrTsBR2FD1U', '_blank');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const createDiscussion = async () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) return;

    try {
      await axios.post(`${API}/discussions`, newDiscussion);
      setNewDiscussion({ title: '', content: '' });
      loadDiscussions();
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  const createReply = async (discussionId) => {
    if (!newReply.trim()) return;

    try {
      await axios.post(`${API}/discussions/${discussionId}/replies`, {
        content: newReply,
        author: 'Anonymous'
      });
      setNewReply('');
      setReplyingTo(null);
      loadDiscussions();
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  const deleteDiscussion = async (discussionId) => {
    try {
      await axios.delete(`${API}/discussions/${discussionId}`);
      loadDiscussions();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting discussion:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const NavigationItem = ({ icon: Icon, label, section, onClick }) => (
    <div
      className={`nav-item ${activeSection === section ? 'active' : ''}`}
      onClick={onClick || (() => setActiveSection(section))}
      title={label}
    >
      <Icon size={24} />
      {/* Only icon, no text */}
    </div>
  );

  // Fix filtering logic for new notesData structure
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSemester = filters.semester === 'all' || note.semester === filters.semester;
    const matchesSubject = filters.subject === 'all' || note.subject === filters.subject;
    return matchesSearch && matchesSemester && matchesSubject;
  });

  return (
    <div className={`kamati-container ${theme}`}>
      {/* Background layers: faint watermark + subtle drifting smoke */}
      <div className="site-bg" aria-hidden="true">
        <div className="bg-watermark">KaMaTi</div>
        <div className="bg-smoke smoke-1"></div>
        <div className="bg-smoke smoke-2"></div>
      </div>
      {/* Top Header with Logo and Theme Toggle */}
      <div className="top-header">
        <div className="logo-header">
          <img
            src="https://customer-assets.emergentagent.com/job_kamati-hub/artifacts/h1njd072_KaMaTi%20Gang%20of%20Study%20%282%29.png"
            alt="KaMaTi Gang"
            className="header-logo"
          />
          <span className="header-logo-text">KaMaTi Gang</span>
        </div>
        <Button
          onClick={toggleTheme}
          className="theme-toggle"
          size="sm"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </Button>
      </div>

      {/* Fixed Sidebar */}
      <div className="fixed-sidebar">
        <div className="nav-items">
          <NavigationItem icon={Home} label="Home" section="home" />
          <NavigationItem
            icon={BookOpen}
            label="Notes"
            section="notes"
            onClick={() => setShowNotesModal(true)}
          />
          
          <NavigationItem icon={Info} label="About" section="about" />
          <NavigationItem icon={Mail} label="Contact" section="contact" />
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeSection === 'home' && (
          <>
            <div className="hero-section">
              <div className="hero-background-text">KaMaTi</div>
              {/* Welcome Content - Center Aligned */}
              <div className="welcome-content">
                <h1 className="hero-title">Welcome to KaMaTi Gang</h1>
                <p className="hero-subtitle">IPU Notes Hub • Simplified Resources • Vibrant Community</p>
                <div className="hero-buttons">
                  <Button
                    className="cta-button primary"
                    onClick={() => setShowNotesModal(true)}
                  >
                    <BookOpen size={20} />
                    Explore Notes
                  </Button>
                 
                  <Button
                    className="cta-button primary"
                    onClick={() => setActiveSection('team')}
                  >
                    <Handshake size={20} />
                    Meet Our Team
                  </Button>
                </div>
              </div>
              {/* Exam Countdown side: show three semester cards (3,5,7) */}
              <div className="hero-right">
                <div className="semester-cards">
                  <SemesterExamCard semester={3} />
                  <SemesterExamCard semester={5} />
                  <SemesterExamCard semester={7} />
                </div>
              </div>
            </div>
          </>
        )}
        {/* Glassmorphism Footer - Always at Bottom */}
        <footer className="glass-footer">
            <div className="footer-content">
              <div className="footer-left">
                <div className="footer-contact">
                  <Mail size={16} style={{ marginRight: '8px' }} />
                  <a href="mailto:kamatigangofstudy@gmail.com">kamatigangofstudy@gmail.com</a>
                </div>
              </div>

              <div className="footer-center">
                <a className="whatsapp-link" href="https://whatsapp.com/channel/0029Vb6RPBA1NCrTsBR2FD1U" target="_blank" rel="noopener noreferrer">WhatsApp Channel</a>
              </div>

              <div className="footer-right">
                <div className="footer-social">
                  <a href="https://www.instagram.com/kamati_gang?igsh=MXg3cXh1aHNvOXM1bA==" target="_blank" rel="noopener noreferrer" className="insta-link" aria-label="KaMaTi Gang Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign:'middle'}}>
                      <rect x="3" y="3" width="18" height="18" rx="5" stroke="#08B6D4" strokeWidth="1.2" />
                      <circle cx="12" cy="12" r="3.2" stroke="#08B6D4" strokeWidth="1.2" />
                      <circle cx="17.5" cy="6.5" r="0.6" fill="#08B6D4" />
                    </svg>
                    <span className="insta-text">@kamati_gang</span>
                  </a>
                </div>
                <div className="footer-copy">© 2025 KaMaTi Gang</div>
              </div>
            </div>
        </footer>

        

        {activeSection === 'team' && (
          <div className="team-section mb-32 ">

            <div className="section-header">
              <h2>Meet the KaMaTi Team</h2>
              <p>The KaMaTi Gang developers working behind the scenes on notes, backend, UI/UX, content, and improvements.</p>
            </div>

            <div className="team-grid">
              <Card className="team-member-card reveal" style={{ animationDelay: '80ms' }}>
                <CardHeader>
                  <div className="avatar">
                    <img
                      src="/images/akshat-dev.svg"
                      alt="Akshat Pal — Developer"
                      className="profile-img"
                    />
                  </div>
                  <div>
                    <div className="member-name">Akshat Pal</div>
                    <div className="member-role">DEVELOPER</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="member-desc">Building the front-end interface and managing the backend services.</p>
                  <Button size="sm" className="linkedin-cta" asChild>
                    <a href="https://www.linkedin.com/in/akshatpal2007/" target="_blank" rel="noopener noreferrer" aria-label="Akshat on LinkedIn">🔗 LinkedIn</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="team-member-card reveal" style={{ animationDelay: '160ms' }}>
                <CardHeader>
                  <div className="avatar">
                    <img
                      src="/images/himanshi-dev.svg"
                      alt="Himanshi Sharma — Developer"
                      className="profile-img"
                    />
                  </div>
                  <div>
                    <div className="member-name">Himanshi Sharma</div>
                    <div className="member-role">DEVELOPER</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="member-desc">Maintaining code quality and fixing critical bugs.</p>
                  <Button size="sm" className="linkedin-cta" asChild>
                    <a href="https://www.linkedin.com/in/himanshi-sharma-908341255/" target="_blank" rel="noopener noreferrer" aria-label="Himanshi on LinkedIn">🔗 LinkedIn</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="team-member-card reveal" style={{ animationDelay: '240ms' }}>
                <CardHeader>
                  <div className="avatar">
                    <img
                      src="/images/reachal-sm.svg"
                      alt="Reachal Jain — Social Media Manager"
                      className="profile-img"
                    />
                  </div>
                  <div>
                    <div className="member-name">Reachal Jain</div>
                    <div className="member-role">SOCIAL MEDIA MANAGER</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="member-desc">Handling Social Media Accounts and community engagement.</p>
                  <Button size="sm" className="linkedin-cta" asChild>
                    <a href="https://www.linkedin.com/in/reachal-jain-0946a536b/" target="_blank" rel="noopener noreferrer" aria-label="Reachal on LinkedIn">🔗 LinkedIn</a>
                  </Button>
                </CardContent>
              </Card>

            </div>

            <div className="team-footer-note">
              <small>Want to join? Reach out via our WhatsApp channel or Instagram we're always looking for contributors.</small>
            </div>

          </div>
        )}

        {activeSection === 'about' && (
          <div className="about-section">
            <div className="section-header">
              <h2>About KaMaTi Gang</h2>
            </div>

            <div className="about-content">
              <div className="about-description">
                <p>
                  KaMaTi Gang is a dedicated study hub for IPU students, providing comprehensive notes,
                  resources, and a vibrant community platform. We believe in making education accessible and
                  fostering collaborative learning among students.
                </p>
                <p>
                  Join thousands of students who are already part of our community and accelerate your academic
                  journey with our carefully curated resources and peer support.
                </p>
              </div>

              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">📚</div>
                  <h4>Quality Notes</h4>
                  <p>Curated study materials</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🛡️</div>
                  <h4>Community</h4>
                  <p>Connect with peers</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🚀</div>
                  <h4>Growth</h4>
                  <p>Accelerate learning</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'contact' && (
          <div className="contact-section">
            <div className="section-header">
              <h2>Reach Us</h2>
            </div>

            <div className="contact-content">
              <Card className="contact-card">
                <CardContent>
                  <div className="contact-item">
                    <Mail size={24} />
                    <div>
                      <p>kamatigangofstudy@gmail.com</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <MessageCircle size={24} />
                    <div>
                      <a
                        href="https://whatsapp.com/channel/0029Vb6RPBA1NCrTsBR2FD1U"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-link"
                      >
                        WhatsApp Channel
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>


      {/* Notes Modal - move above footer */}
      <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
        <DialogContent className="notes-modal">
          <DialogHeader>
            <DialogTitle>Study Materials</DialogTitle>
          </DialogHeader>
          {/* Search and Filters */}
          <div className="notes-controls">
            <div className="search-container">
              <Search size={18} />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="notes-filters">
              <Select value={filters.semester} onValueChange={(value) => setFilters({ ...filters, semester: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                  <SelectItem value="3">Semester 3</SelectItem>
                  <SelectItem value="4">Semester 4</SelectItem>
                  <SelectItem value="5">Semester 5</SelectItem>
                  <SelectItem value="6">Semester 6</SelectItem>
                  <SelectItem value="7">Semester 7</SelectItem>
                  <SelectItem value="8">Semester 8</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.subject} onValueChange={(value) => setFilters({ ...filters, subject: value })}>

                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {(semesterSubjects[filters.semester] || []).map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="note-card">
                <CardContent>
                  <h4>{note.title}</h4>
                  <div className="note-details">
                    <p><strong>Subject:</strong> {note.subject}</p>
                    <p><strong>Semester:</strong> {note.semester}</p>
                    <p><strong>Size:</strong> {note.size}</p>
                    <p><strong>Uploaded:</strong> {note.uploaded_at}</p>
                  </div>
                  <div className="note-actions">
                    <Button size="sm" className="view-button" onClick={() => openDriveViewer(note.file_url)}>
                      <Eye size={16} />
                      View Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm !== null} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent className="delete-modal">
          <DialogHeader>
            <DialogTitle>Delete Discussion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this discussion? This action cannot be undone.</p>
          <div className="delete-actions">
            <Button
              onClick={() => deleteDiscussion(showDeleteConfirm)}
              className="delete-confirm-btn"
            >
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(null)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Drive Viewer Dialog - opens drive links inside an iframe */}
      <Dialog open={driveViewerOpen} onOpenChange={(open) => { if (!open) closeDriveViewer(); }}>
        <DialogContent className="drive-viewer-modal">
          <DialogHeader>
            <DialogTitle>Document Viewer</DialogTitle>
          </DialogHeader>
          <div className="drive-viewer-wrapper">
            <div className={`drive-iframe-wrap ${driveViewerInteractive ? 'interactive' : ''}`}>
              {driveViewerUrl ? (
                <iframe
                  title="Drive Document"
                  src={driveViewerUrl}
                  frameBorder="0"
                  sandbox="allow-forms allow-same-origin allow-scripts"
                  allowFullScreen
                />
              ) : (
                <div className="drive-empty">No preview available</div>
              )}
              {!driveViewerInteractive && (
                <div className="drive-blocker" role="button" aria-hidden="true">
                  <div className="drive-blocker-inner">
                    <p>Preview mode: downloads and navigation are disabled by default for security.</p>
                    <button className="enable-interact" onClick={() => setDriveViewerInteractive(true)}>Enable interaction</button>
                    <button className="close-viewer" onClick={() => closeDriveViewer()}>Close</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Popup */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="feedback-modal">
          <DialogHeader>
            <DialogTitle>How much do you like our service?</DialogTitle>
          </DialogHeader>

          <div className="feedback-content">
            <div className="rating-section">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  className={`star ${feedback.rating >= star ? 'filled' : ''}`}
                  onClick={() => setFeedback({ ...feedback, rating: star })}
                />
              ))}
            </div>

            <Input
              placeholder="Your name (optional)"
              value={feedback.name}
              onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
              className="feedback-name"
            />

            <Textarea
              placeholder="Any additional comments? (optional)"
              value={feedback.comment}
              onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
              className="feedback-textarea"
            />

            <div className="feedback-actions">
              <Button onClick={submitFeedback} className="submit-feedback-button">
                Submit & Join WhatsApp
              </Button>
              <Button variant="outline" onClick={() => setShowFeedback(false)}>
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<KaMaTi />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;