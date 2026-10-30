import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { authenticateAdmin, verifyAdminToken, revokeToken } from './server/adminAuth.js';
import { 
  getQueue, 
  syncGoogleDrive, 
  approveQueueItem, 
  rejectQueueItem, 
  reprocessQueueItem, 
  editQueueItem,
  initQueueIfEmpty
} from './server/driveSync.js';
import { 
  getApprovedPyqsForSubject, 
  analyzePyqPapers 
} from './server/pyqAnalyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.DEFAULT_APP_PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// Initialize staged seed queue
initQueueIfEmpty();

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

// Helper to send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Helper to parse JSON body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 10 * 1024 * 1024) { // 10MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// Extract Bearer token
function getBearerToken(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  // ==========================================
  // API ROUTES
  // ==========================================

  // --- ADMIN AUTH ROUTES ---
  if (pathname === '/api/admin/login' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const result = authenticateAdmin(body.username, body.password);
      if (result.success) {
        return sendJson(res, 200, result);
      } else {
        return sendJson(res, 401, result);
      }
    } catch (e) {
      return sendJson(res, 400, { error: 'Invalid JSON request' });
    }
  }

  if (pathname === '/api/admin/check-session' && req.method === 'GET') {
    const token = getBearerToken(req);
    if (verifyAdminToken(token)) {
      return sendJson(res, 200, { authenticated: true, role: 'administrator' });
    }
    return sendJson(res, 401, { authenticated: false, error: 'Unauthorized or expired session' });
  }

  if (pathname === '/api/admin/logout' && req.method === 'POST') {
    const token = getBearerToken(req);
    revokeToken(token);
    return sendJson(res, 200, { success: true, message: 'Logged out successfully' });
  }

  // --- ADMIN DASHBOARD QUEUE & DRIVE SYNC ROUTES (AUTH PROTECTED) ---
  if (pathname.startsWith('/api/admin/')) {
    const token = getBearerToken(req);
    if (!verifyAdminToken(token)) {
      return sendJson(res, 401, { error: 'Authentication required for administrative actions' });
    }

    if (pathname === '/api/admin/queue' && req.method === 'GET') {
      const queue = getQueue();
      return sendJson(res, 200, { queue, count: queue.length });
    }

    if (pathname === '/api/admin/sync-drive' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const syncResult = syncGoogleDrive(body.folderId || '');
        return sendJson(res, 200, syncResult);
      } catch (e) {
        return sendJson(res, 500, { error: 'Failed to sync Google Drive folder', details: e.message });
      }
    }

    if (pathname === '/api/admin/approve' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const result = approveQueueItem(body.id);
        if (result.success) {
          return sendJson(res, 200, result);
        }
        return sendJson(res, 400, result);
      } catch (e) {
        return sendJson(res, 500, { error: e.message });
      }
    }

    if (pathname === '/api/admin/reject' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const result = rejectQueueItem(body.id, body.reason);
        if (result.success) {
          return sendJson(res, 200, result);
        }
        return sendJson(res, 400, result);
      } catch (e) {
        return sendJson(res, 500, { error: e.message });
      }
    }

    if (pathname === '/api/admin/reprocess' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const result = reprocessQueueItem(body.id);
        if (result.success) {
          return sendJson(res, 200, result);
        }
        return sendJson(res, 400, result);
      } catch (e) {
        return sendJson(res, 500, { error: e.message });
      }
    }

    if (pathname === '/api/admin/edit-metadata' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const result = editQueueItem(body.id, body.updates || body);
        if (result.success) {
          return sendJson(res, 200, result);
        }
        return sendJson(res, 400, result);
      } catch (e) {
        return sendJson(res, 500, { error: e.message });
      }
    }

    return sendJson(res, 404, { error: 'Unknown admin endpoint' });
  }

  // --- STUDENT PYQ ANALYZER PUBLIC ROUTES (FREE, NO LOGIN REQUIRED) ---
  if (pathname === '/api/pyq/papers' && req.method === 'GET') {
    const sem = searchParams.get('semester');
    const subject = searchParams.get('subject');
    const papers = getApprovedPyqsForSubject(sem, subject);
    return sendJson(res, 200, { papers, count: papers.length });
  }

  if (pathname === '/api/pyq/analyze' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const sem = body.semester || 4;
      const subject = body.subject || 'Machine Learning';
      const subjectSlug = body.subjectSlug || '';
      
      const analysis = analyzePyqPapers(sem, subject, subjectSlug);
      return sendJson(res, 200, analysis);
    } catch (e) {
      console.error('Analysis error:', e);
      return sendJson(res, 500, { error: 'Failed to run PYQ analysis', details: e.message });
    }
  }

  // ==========================================
  // STATIC ASSETS & SPA ROUTING
  // ==========================================
  const cleanUrl = pathname;
  let filePath = path.join(DIST_DIR, cleanUrl === '/' ? 'index.html' : cleanUrl);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=3600' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      // Fallback to index.html for SPA
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('KaMati Gang of Study is starting up... Please build the frontend.');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
          res.end(content);
        }
      });
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`KaMati Gang of Study running on http://0.0.0.0:${PORT}`);
});
