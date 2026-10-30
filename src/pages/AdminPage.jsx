import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, RefreshCw, CheckCircle, XCircle, Edit3, Eye, 
  ExternalLink, LogOut, Lock, Search, Filter, AlertTriangle, 
  FileText, Check, Database, FolderSync, Clock, Sparkles, BookOpen, Zap, Sigma, GraduationCap
} from 'lucide-react';
import { SEMESTERS, RESOURCE_CATEGORIES } from '../data/curriculum';

export default function AdminPage({ navigate }) {
  const [token, setToken] = useState(localStorage.getItem('kamati_admin_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard state
  const [queue, setQueue] = useState([]);
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [driveFolderInput, setDriveFolderInput] = useState('1gA_GGSIPU_AIDS_MasterDriveFolder');
  const [syncingDrive, setSyncingDrive] = useState(false);
  const [syncSummary, setSyncSummary] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Filters
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSemester, setFilterSemester] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [previewItem, setPreviewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Check existing session
  useEffect(() => {
    if (!token) {
      setCheckingSession(false);
      setIsAuthenticated(false);
      return;
    }

    fetch('/api/admin/check-session', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setIsAuthenticated(true);
          loadQueue(token);
        } else {
          setIsAuthenticated(false);
          setToken('');
          localStorage.removeItem('kamati_admin_token');
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setCheckingSession(false);
      });
  }, [token]);

  // Load Queue
  const loadQueue = (authToken) => {
    setLoadingQueue(true);
    fetch('/api/admin/queue', {
      headers: { 'Authorization': `Bearer ${authToken || token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.queue) {
          setQueue(data.queue);
        }
      })
      .catch(err => console.error('Error fetching queue:', err))
      .finally(() => setLoadingQueue(false));
  };

  // Login Handler
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.token) {
          setToken(data.token);
          localStorage.setItem('kamati_admin_token', data.token);
          setIsAuthenticated(true);
          loadQueue(data.token);
        } else {
          setLoginError(data.error || 'Invalid credentials');
        }
      })
      .catch(err => {
        setLoginError('Failed to connect to authentication server');
      })
      .finally(() => setLoginLoading(false));
  };

  // Logout Handler
  const handleLogout = () => {
    fetch('/api/admin/logout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    }).finally(() => {
      setToken('');
      localStorage.removeItem('kamati_admin_token');
      setIsAuthenticated(false);
    });
  };

  // Manual Google Drive Sync
  const handleSyncDrive = () => {
    setSyncingDrive(true);
    fetch('/api/admin/sync-drive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ folderId: driveFolderInput })
    })
      .then(res => res.json())
      .then(data => {
        setSyncSummary(data);
        if (data.queue) {
          setQueue(data.queue);
        } else {
          loadQueue(token);
        }
      })
      .catch(err => {
        alert('Google Drive sync failed: ' + err.message);
      })
      .finally(() => setSyncingDrive(false));
  };

  // Approve Item
  const handleApprove = (id) => {
    fetch('/api/admin/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showActionMsg('Item approved and published to live public catalog!');
          setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'approved' } : item));
        } else {
          alert('Approval error: ' + (data.error || 'Failed'));
        }
      });
  };

  // Reject Item
  const handleReject = (id) => {
    const reason = prompt('Please enter rejection reason (e.g. duplicate, corrupted, incorrect syllabus):', 'Not suitable for current GGSIPU AI & DS scheme');
    if (!reason) return;

    fetch('/api/admin/reject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id, reason })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showActionMsg('Item marked as rejected.');
          setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'rejected' } : item));
        }
      });
  };

  // Reprocess Item
  const handleReprocess = (id) => {
    fetch('/api/admin/reprocess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.updatedItem) {
          showActionMsg('Metadata re-extracted and OCR confidence updated.');
          setQueue(prev => prev.map(item => item.id === id ? data.updatedItem : item));
        }
      });
  };

  // Save Edited Metadata
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    fetch('/api/admin/edit-metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id: editingItem.id,
        updates: editingItem
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.updatedItem) {
          showActionMsg('Metadata updated successfully.');
          setQueue(prev => prev.map(item => item.id === editingItem.id ? data.updatedItem : item));
          setEditingItem(null);
        }
      });
  };

  const showActionMsg = (msg) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 3500);
  };

  // Filtered Queue
  const filteredQueue = queue.filter(item => {
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesSem = filterSemester === 'all' || String(item.semester) === filterSemester;
    const matchesCat = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = !searchQuery || 
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.subject && item.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.originalFilename && item.originalFilename.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesSem && matchesCat && matchesSearch;
  });

  const pendingCount = queue.filter(q => q.status === 'pending').length;
  const approvedCount = queue.filter(q => q.status === 'approved').length;
  const rejectedCount = queue.filter(q => q.status === 'rejected').length;

  // Flattened list of all subjects across semesters for editing dropdown
  const allSubjects = Array.from(new Set(
    SEMESTERS.flatMap(s => s.subjects.map(sub => sub.name))
  )).sort();

  if (checkingSession) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <RefreshCw size={32} className="spin" style={{ color: 'var(--cyan-primary)', margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--text-muted)' }}>Verifying administrative security session...</p>
      </div>
    );
  }

  // ==========================================
  // UN-AUTHENTICATED: LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div style={{ padding: '60px 0 80px', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '440px' }}>
          <div className="category-card" style={{ padding: '36px', background: 'var(--bg-surface)' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(8, 182, 212, 0.12)',
                color: 'var(--cyan-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px'
              }}>
                <Lock size={28} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Admin Portal Login
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Private Google Drive Automation & Resource Approval Pipeline
              </p>
            </div>

            {loginError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--accent-red)',
                color: 'var(--accent-red)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertTriangle size={16} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Admin Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Security Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Default environment pass: <code style={{ color: 'var(--cyan-dark)' }}>admin@kamati2026</code>
                </span>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                {loginLoading ? <RefreshCw size={16} className="spin" /> : <ShieldCheck size={18} />}
                <span>{loginLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED: ADMIN DASHBOARD
  // ==========================================
  return (
    <div style={{ padding: '36px 0 80px' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="section-tag" style={{ background: 'rgba(8, 182, 212, 0.15)', color: 'var(--cyan-dark)' }}>
                Restricted Admin Panel
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }}></span>
                Authenticated
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
              Resource Automation & Drive Ingestion
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Manage Google Drive scans, OCR page extraction, metadata suggestions, and live public approvals.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn-preview-doc"
              onClick={() => navigate('/')}
            >
              <ExternalLink size={14} />
              <span>View Live Website</span>
            </button>
            <button
              type="button"
              className="btn-preview-doc"
              style={{ color: 'var(--accent-red)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              onClick={handleLogout}
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Action Success Toast Banner */}
        {actionSuccessMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid var(--accent-green)',
            color: 'var(--accent-green)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle size={18} />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Metric Cards Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div className="category-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Pending Review</span>
              <Clock size={18} color="var(--accent-gold)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--accent-gold)', marginTop: '8px' }}>
              {pendingCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Awaiting approval in queue</span>
          </div>

          <div className="category-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Approved (In Queue)</span>
              <CheckCircle size={18} color="var(--accent-green)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--accent-green)', marginTop: '8px' }}>
              {approvedCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified & published to catalog</span>
          </div>

          <div className="category-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Rejected</span>
              <XCircle size={18} color="var(--accent-red)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--accent-red)', marginTop: '8px' }}>
              {rejectedCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Excluded from live site</span>
          </div>

          <div className="category-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>Live Catalog Total</span>
              <Database size={18} color="var(--cyan-primary)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--cyan-dark)', marginTop: '8px' }}>
              1,032+
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GGSIPU AI & DS verified resources</span>
          </div>
        </div>

        {/* Sync Google Drive Control Bar */}
        <div className="category-card" style={{
          padding: '24px',
          marginBottom: '32px',
          background: 'var(--bg-surface)',
          borderLeft: '4px solid var(--cyan-primary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <FolderSync size={20} color="var(--cyan-primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              Manual Google Drive Folder Synchronization
            </h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Enter your Google Drive Folder ID or URL. Clicking sync will scan eligible PDF files, run duplicate checks against existing catalog Drive IDs, and stage eligible materials with auto-suggested metadata.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={driveFolderInput}
              onChange={e => setDriveFolderInput(e.target.value)}
              placeholder="Google Drive Folder ID (e.g. 1gA_GGSIPU_AIDS_MasterDriveFolder)..."
              style={{
                flex: 1,
                minWidth: '280px',
                padding: '11px 16px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button
              type="button"
              onClick={handleSyncDrive}
              disabled={syncingDrive}
              className="btn-primary"
              style={{ padding: '11px 22px' }}
            >
              {syncingDrive ? <RefreshCw size={16} className="spin" /> : <RefreshCw size={16} />}
              <span>{syncingDrive ? 'Scanning Drive...' : 'Sync Google Drive'}</span>
            </button>
          </div>
        </div>

        {/* Sync Summary Modal / Box */}
        {syncSummary && (
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--cyan-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '20px 24px',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', color: 'var(--text-primary)' }}>
                <Sparkles size={18} color="var(--cyan-primary)" />
                <span>Google Drive Synchronization Summary</span>
              </div>
              <button
                type="button"
                onClick={() => setSyncSummary(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Dismiss
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Scanned</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{syncSummary.totalScanned}</strong>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>New Found</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--accent-green)' }}>{syncSummary.newFiles}</strong>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Duplicates</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>{syncSummary.duplicateFiles}</strong>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Unsupported</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--accent-red)' }}>{syncSummary.unsupportedFiles}</strong>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Pending Queue</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--accent-gold)' }}>{syncSummary.pendingCount}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Approval Queue Management Section */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                Ingestion & Approval Queue ({filteredQueue.length})
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Review AI-suggested metadata, preview Drive PDFs inline, and publish or reject.
              </span>
            </div>

            <button
              type="button"
              className="btn-preview-doc"
              onClick={() => loadQueue(token)}
            >
              <RefreshCw size={14} className={loadingQueue ? 'spin' : ''} />
              <span>Refresh Queue</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            alignItems: 'center',
            marginBottom: '20px',
            background: 'var(--bg-surface)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: '180px' }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search queue by title, filename, or subject..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  width: '100%'
                }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Status ({queue.length})</option>
              <option value="pending">Pending ({pendingCount})</option>
              <option value="approved">Approved ({approvedCount})</option>
              <option value="rejected">Rejected ({rejectedCount})</option>
            </select>

            {/* Semester Filter */}
            <select
              value={filterSemester}
              onChange={e => setFilterSemester(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={String(s)}>Semester {s}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Categories</option>
              <option value="notes">Notes</option>
              <option value="pyq">PYQ</option>
              <option value="revision">Quick Revision</option>
              <option value="syllabus">Syllabus</option>
              <option value="formula">Formula Sheets</option>
            </select>
          </div>

          {/* Queue Items Table / Cards */}
          {filteredQueue.length === 0 ? (
            <div className="coming-soon-card" style={{ maxWidth: '600px' }}>
              <div className="coming-soon-icon">📋</div>
              <h3 className="coming-soon-title">Queue is empty</h3>
              <p className="coming-soon-desc">
                No items match your active filters. Click "Sync Google Drive" above to scan and ingest new PDFs from Drive.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredQueue.map(item => {
                const isPending = item.status === 'pending';
                const isApproved = item.status === 'approved';
                const isRejected = item.status === 'rejected';

                return (
                  <div
                    key={item.id}
                    className="category-card"
                    style={{
                      padding: '20px',
                      background: 'var(--bg-surface)',
                      borderLeft: `4px solid ${
                        isApproved ? 'var(--accent-green)' :
                        isRejected ? 'var(--accent-red)' : 'var(--accent-gold)'
                      }`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ flex: 1, minWidth: '260px' }}>
                        {/* Badges */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: '800',
                              textTransform: 'uppercase',
                              background: isApproved ? 'rgba(16, 185, 129, 0.15)' :
                                          isRejected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: isApproved ? 'var(--accent-green)' :
                                     isRejected ? 'var(--accent-red)' : 'var(--accent-gold)'
                            }}
                          >
                            {item.status}
                          </span>

                          <span className="meta-pill pill-sem">Sem {item.semester}</span>
                          <span className="meta-pill pill-unit">{item.unit || 'General'}</span>

                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            background: item.category === 'syllabus' ? 'rgba(139, 92, 246, 0.15)' :
                                        item.category === 'pyq' ? 'rgba(59, 130, 246, 0.15)' :
                                        item.category === 'revision' ? 'rgba(16, 185, 129, 0.15)' :
                                        item.category === 'formula' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(8, 182, 212, 0.15)',
                            color: item.category === 'syllabus' ? '#8B5CF6' :
                                   item.category === 'pyq' ? '#3B82F6' :
                                   item.category === 'revision' ? '#10B981' :
                                   item.category === 'formula' ? '#F59E0B' : '#08B6D4'
                          }}>
                            {item.category.toUpperCase()}
                          </span>

                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            OCR: {item.ocrType || 'text_pdf'} ({item.ocrConfidence ? Math.round(item.ocrConfidence * 100) + '%' : '96%'})
                          </span>
                        </div>

                        {/* Title & Subject */}
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
                          {item.title}
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          <strong>{item.subject}</strong>
                          {item.examYear && <span> • Exam Year: {item.examYear}</span>}
                          {item.academicYear && <span> • Batch: {item.academicYear}</span>}
                        </div>

                        {/* File Details */}
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <span>File: <code>{item.originalFilename}</code></span>
                          <span>Drive ID: <code>{item.driveId}</code></span>
                          <span>Size: {item.size || 'PDF'}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn-preview-doc"
                          onClick={() => setPreviewItem(item)}
                          title="Preview PDF document inline"
                        >
                          <Eye size={14} />
                          <span>Preview</span>
                        </button>

                        <button
                          type="button"
                          className="btn-preview-doc"
                          onClick={() => setEditingItem({ ...item })}
                          title="Edit suggested metadata"
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </button>

                        {isPending && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(item.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                background: 'var(--accent-green)',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                padding: '8px 14px',
                                fontSize: '0.82rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                              title="Approve and push to live catalog"
                            >
                              <Check size={14} />
                              <span>Approve</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReject(item.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: 'var(--accent-red)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '8px 12px',
                                fontSize: '0.82rem',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                              title="Reject item"
                            >
                              <XCircle size={14} />
                              <span>Reject</span>
                            </button>

                            <button
                              type="button"
                              className="btn-preview-doc"
                              onClick={() => handleReprocess(item.id)}
                              title="Re-run AI & OCR metadata extraction"
                            >
                              <RefreshCw size={13} />
                              <span>Reprocess</span>
                            </button>
                          </>
                        )}

                        {isApproved && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={14} /> Published
                          </span>
                        )}

                        {isRejected && (
                          <button
                            type="button"
                            className="btn-preview-doc"
                            onClick={() => handleApprove(item.id)}
                          >
                            <span>Re-approve</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* METADATA EDIT MODAL */}
        {editingItem && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  Edit Resource Metadata
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Resource Title
                  </label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Semester (1 - 8)
                    </label>
                    <select
                      value={editingItem.semester}
                      onChange={e => setEditingItem({ ...editingItem, semester: parseInt(e.target.value, 10) })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.88rem'
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Category (5 Categories)
                    </label>
                    <select
                      value={editingItem.category}
                      onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.88rem'
                      }}
                    >
                      <option value="notes">Notes</option>
                      <option value="pyq">Previous Year Papers (PYQ)</option>
                      <option value="revision">Quick Revision</option>
                      <option value="syllabus">Syllabus / Official Scheme</option>
                      <option value="formula">Formula Sheet</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Subject
                  </label>
                  <select
                    value={editingItem.subject}
                    onChange={e => setEditingItem({ ...editingItem, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.88rem'
                    }}
                  >
                    {allSubjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                    <option value="Syllabus">Syllabus</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Unit / Module
                    </label>
                    <input
                      type="text"
                      value={editingItem.unit || ''}
                      onChange={e => setEditingItem({ ...editingItem, unit: e.target.value })}
                      placeholder="e.g. Unit 2 or General / Full Syllabus"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Exam Year
                    </label>
                    <input
                      type="text"
                      value={editingItem.examYear || ''}
                      onChange={e => setEditingItem({ ...editingItem, examYear: e.target.value })}
                      placeholder="e.g. 2024"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="btn-preview-doc"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '9px 18px' }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PDF PREVIEW MODAL */}
        {previewItem && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '960px',
              width: '100%',
              height: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-color)',
                background: 'var(--bg-surface)'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                    {previewItem.title}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {previewItem.subject} • Sem {previewItem.semester} • {previewItem.originalFilename}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <a
                    href={previewItem.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-preview-doc"
                  >
                    <span>Open in Drive</span>
                    <ExternalLink size={14} />
                  </a>
                  <button
                    type="button"
                    onClick={() => setPreviewItem(null)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.25rem', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Iframe */}
              <div style={{ flex: 1, background: '#000000' }}>
                <iframe
                  src={previewItem.previewUrl || `https://drive.google.com/file/d/${previewItem.driveId}/preview`}
                  title={previewItem.title}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  allow="autoplay"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
