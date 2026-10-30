import crypto from 'crypto';

// In-memory token store for admin sessions (24-hour TTL)
const activeTokens = new Map();
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin@kamati.edu',
  password: process.env.ADMIN_PASSWORD || 'admin@kamati2026'
};

export function authenticateAdmin(username, password) {
  if (
    (username === ADMIN_CREDENTIALS.username || username === 'admin') &&
    password === ADMIN_CREDENTIALS.password
  ) {
    const token = crypto.randomBytes(32).toString('hex');
    activeTokens.set(token, {
      username,
      createdAt: Date.now(),
      expiresAt: Date.now() + TOKEN_TTL_MS
    });
    return { success: true, token, expiresAt: Date.now() + TOKEN_TTL_MS };
  }
  return { success: false, error: 'Invalid admin username or password' };
}

export function verifyAdminToken(token) {
  if (!token) return false;
  const session = activeTokens.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    activeTokens.delete(token);
    return false;
  }
  return true;
}

export function revokeToken(token) {
  if (token) {
    activeTokens.delete(token);
  }
}
