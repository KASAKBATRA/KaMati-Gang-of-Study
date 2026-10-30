import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SemestersPage from './pages/SemestersPage';
import SemesterDetailPage from './pages/SemesterDetailPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import SearchPage from './pages/SearchPage';
import ChecklistPage from './pages/ChecklistPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import PyqAnalyzerPage from './pages/PyqAnalyzerPage';
import PdfViewerModal from './components/PdfViewerModal';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash.slice(1) || '/');
  const [isDark, setIsDark] = useState(false);
  const [previewResource, setPreviewResource] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Sync theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('kamati_theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDark(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    try {
      localStorage.setItem('kamati_theme', next ? 'dark' : 'light');
    } catch (e) {}
  };

  // Hash-based routing listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || '/';
      setCurrentRoute(hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
    setCurrentRoute(path);
    window.scrollTo(0, 0);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2500);
  };

  const handleCopyLink = (url, id) => {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      showToast('Link copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      showToast('Direct link: ' + url);
    });
  };

  const handlePreview = (res) => {
    setPreviewResource(res);
    // Track recently viewed in localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('kamati_recently_viewed') || '[]');
      const filtered = saved.filter(item => item.id !== res.id);
      filtered.unshift({ id: res.id, title: res.title, subject: res.subject, semester: res.semester, fileUrl: res.fileUrl });
      localStorage.setItem('kamati_recently_viewed', JSON.stringify(filtered.slice(0, 10)));
    } catch (e) {}
  };

  // Route Parser
  const renderCurrentView = () => {
    const cleanRoute = currentRoute.split('?')[0];
    const queryString = currentRoute.includes('?') ? currentRoute.split('?')[1] : '';
    const searchParams = new URLSearchParams(queryString);

    // /
    if (cleanRoute === '/' || cleanRoute === '') {
      return (
        <HomePage 
          navigate={navigate} 
          onPreview={handlePreview} 
          onCopy={handleCopyLink} 
          copiedId={copiedId} 
        />
      );
    }

    // /semesters
    if (cleanRoute === '/semesters') {
      return <SemestersPage navigate={navigate} />;
    }

    // /semester/:id/subject/:slug
    const semSubjectMatch = cleanRoute.match(/^\/semester\/([1-8])\/subject\/([a-zA-Z0-9_-]+)$/);
    if (semSubjectMatch) {
      return (
        <SubjectDetailPage
          semNumber={semSubjectMatch[1]}
          subjectSlug={semSubjectMatch[2]}
          navigate={navigate}
          onPreview={handlePreview}
          onCopy={handleCopyLink}
          copiedId={copiedId}
        />
      );
    }

    // /semester/:id
    const semMatch = cleanRoute.match(/^\/semester\/([1-8])$/);
    if (semMatch) {
      return <SemesterDetailPage semNumber={semMatch[1]} navigate={navigate} />;
    }

    // /search
    if (cleanRoute.startsWith('/search')) {
      return (
        <SearchPage
          initialQuery={searchParams.get('q') || ''}
          initialCategory={searchParams.get('category') || 'all'}
          navigate={navigate}
          onPreview={handlePreview}
          onCopy={handleCopyLink}
          copiedId={copiedId}
        />
      );
    }

    // /checklist
    if (cleanRoute === '/checklist') {
      return <ChecklistPage navigate={navigate} />;
    }

    // /pyq-analyzer
    if (cleanRoute === '/pyq-analyzer') {
      return (
        <PyqAnalyzerPage
          navigate={navigate}
          onPreview={handlePreview}
          onCopy={handleCopyLink}
          copiedId={copiedId}
        />
      );
    }

    // /admin
    if (cleanRoute === '/admin') {
      return <AdminPage navigate={navigate} />;
    }

    // /about
    if (cleanRoute === '/about') {
      return <AboutPage navigate={navigate} />;
    }

    // Default fallback to HomePage
    return (
      <HomePage 
        navigate={navigate} 
        onPreview={handlePreview} 
        onCopy={handleCopyLink} 
        copiedId={copiedId} 
      />
    );
  };

  return (
    <div className="app-wrapper">
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      <main className="main-content">
        {renderCurrentView()}
      </main>

      <Footer navigate={navigate} />

      {/* PDF Viewer Modal */}
      {previewResource && (
        <PdfViewerModal
          resource={previewResource}
          onClose={() => setPreviewResource(null)}
          onCopyLink={handleCopyLink}
          copied={copiedId === previewResource.id}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-msg">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
