import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const RATINGS_FILE = path.join(DATA_DIR, 'ratings.json');
const SALT = process.env.RATINGS_SALT || 'kamati_academic_privacy_salt_2026';

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory rate limiting sliding window (IP / Token -> timestamps)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_SUBMISSIONS_PER_WINDOW = 35; // Max 35 rating actions per 5 minutes

function checkRateLimit(clientId) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(clientId) || [];
  const validTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
  
  if (validTimestamps.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    rateLimitMap.set(clientId, validTimestamps);
    return false;
  }
  
  validTimestamps.push(now);
  rateLimitMap.set(clientId, validTimestamps);
  return true;
}

// Generate privacy-preserving anonymous identifier
export function generateAnonHash(clientToken = '', ip = '', userAgent = '') {
  // If no clientToken provided, combine truncated IP and user-agent with salt
  const cleanIp = (ip || '').replace(/::ffff:/, '').trim();
  const raw = `${clientToken || 'anon'}_${cleanIp}_${userAgent || ''}_${SALT}`;
  return crypto.createHash('sha256').update(raw).digest('hex').substring(0, 32);
}

// Read ratings safely
export function loadRatingsData() {
  try {
    if (!fs.existsSync(RATINGS_FILE)) {
      return { resources: {} };
    }
    const raw = fs.readFileSync(RATINGS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.resources) {
      return { resources: {} };
    }
    return parsed;
  } catch (err) {
    console.error('Error reading ratings file:', err);
    return { resources: {} };
  }
}

// Save ratings safely
export function saveRatingsData(data) {
  try {
    const tempFile = `${RATINGS_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempFile, RATINGS_FILE);
    return true;
  } catch (err) {
    console.error('Error writing ratings file:', err);
    try {
      fs.writeFileSync(RATINGS_FILE, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (e2) {
      console.error('Fallback save failed:', e2);
      return false;
    }
  }
}

// Recompute resource statistics from actual genuine submissions
function calculateStats(submissions = {}) {
  const subs = Object.values(submissions);
  
  const starRatings = subs
    .map(s => s.rating)
    .filter(r => typeof r === 'number' && r >= 1 && r <= 5);

  const totalRatings = starRatings.length;
  const ratingSum = starRatings.reduce((acc, curr) => acc + curr, 0);
  const averageRating = totalRatings > 0 ? parseFloat((ratingSum / totalRatings).toFixed(1)) : 0;

  const helpfulCount = subs.filter(s => s.helpful === true).length;
  const notHelpfulCount = subs.filter(s => s.helpful === false).length;
  const totalHelpfulFeedback = helpfulCount + notHelpfulCount;
  const helpfulPercent = totalHelpfulFeedback > 0 
    ? Math.round((helpfulCount / totalHelpfulFeedback) * 100) 
    : null;

  return {
    averageRating,
    totalRatings,
    helpfulCount,
    notHelpfulCount,
    helpfulPercent
  };
}

// Get aggregated rating stats for all resources
export function getAllRatingsStats() {
  const data = loadRatingsData();
  const summary = {};

  for (const [resId, item] of Object.entries(data.resources || {})) {
    if (item && item.stats) {
      summary[resId] = item.stats;
    }
  }

  return summary;
}

// Get rating & user vote for a specific resource
export function getResourceRating(resourceId, anonHash = '') {
  if (!resourceId) return null;
  const data = loadRatingsData();
  const resource = data.resources[resourceId];

  if (!resource) {
    return {
      resourceId,
      stats: {
        averageRating: 0,
        totalRatings: 0,
        helpfulCount: 0,
        notHelpfulCount: 0,
        helpfulPercent: null
      },
      userRating: null,
      userHelpful: null
    };
  }

  const userSub = anonHash && resource.submissions ? resource.submissions[anonHash] : null;

  return {
    resourceId,
    stats: resource.stats || calculateStats(resource.submissions),
    userRating: userSub ? (userSub.rating ?? null) : null,
    userHelpful: userSub ? (userSub.helpful ?? null) : null
  };
}

// Submit or update a 1-5 star rating
export function submitStarRating(resourceId, rating, clientToken, ip, userAgent) {
  if (!resourceId || typeof resourceId !== 'string') {
    return { success: false, error: 'Resource ID is required.' };
  }

  const numRating = parseInt(rating, 10);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return { success: false, error: 'Rating must be an integer between 1 and 5 stars.' };
  }

  const anonHash = generateAnonHash(clientToken, ip, userAgent);

  if (!checkRateLimit(anonHash)) {
    return { success: false, error: 'Rate limit exceeded. Please wait a few moments before voting again.' };
  }

  const data = loadRatingsData();
  if (!data.resources) data.resources = {};
  if (!data.resources[resourceId]) {
    data.resources[resourceId] = {
      submissions: {},
      stats: {
        averageRating: 0,
        totalRatings: 0,
        helpfulCount: 0,
        notHelpfulCount: 0,
        helpfulPercent: null
      }
    };
  }

  const resEntry = data.resources[resourceId];
  if (!resEntry.submissions) resEntry.submissions = {};

  const existing = resEntry.submissions[anonHash] || {};
  const isUpdate = typeof existing.rating === 'number';

  resEntry.submissions[anonHash] = {
    ...existing,
    rating: numRating,
    updatedAt: Date.now()
  };

  resEntry.stats = calculateStats(resEntry.submissions);
  saveRatingsData(data);

  return {
    success: true,
    isUpdate,
    message: isUpdate ? 'Your rating has been updated.' : 'Thank you! Your rating has been recorded.',
    stats: resEntry.stats,
    userRating: numRating,
    userHelpful: resEntry.submissions[anonHash].helpful ?? null
  };
}

// Submit or update Helpful (true) or Not Helpful (false) feedback
export function submitHelpfulFeedback(resourceId, isHelpful, clientToken, ip, userAgent) {
  if (!resourceId || typeof resourceId !== 'string') {
    return { success: false, error: 'Resource ID is required.' };
  }

  if (typeof isHelpful !== 'boolean') {
    return { success: false, error: 'Feedback must be true (Helpful) or false (Not Helpful).' };
  }

  const anonHash = generateAnonHash(clientToken, ip, userAgent);

  if (!checkRateLimit(anonHash)) {
    return { success: false, error: 'Rate limit exceeded. Please wait a few moments before voting again.' };
  }

  const data = loadRatingsData();
  if (!data.resources) data.resources = {};
  if (!data.resources[resourceId]) {
    data.resources[resourceId] = {
      submissions: {},
      stats: {
        averageRating: 0,
        totalRatings: 0,
        helpfulCount: 0,
        notHelpfulCount: 0,
        helpfulPercent: null
      }
    };
  }

  const resEntry = data.resources[resourceId];
  if (!resEntry.submissions) resEntry.submissions = {};

  const existing = resEntry.submissions[anonHash] || {};
  const isUpdate = typeof existing.helpful === 'boolean';

  resEntry.submissions[anonHash] = {
    ...existing,
    helpful: isHelpful,
    updatedAt: Date.now()
  };

  resEntry.stats = calculateStats(resEntry.submissions);
  saveRatingsData(data);

  return {
    success: true,
    isUpdate,
    message: isUpdate ? 'Your feedback has been updated.' : 'Thank you for your feedback!',
    stats: resEntry.stats,
    userHelpful: isHelpful,
    userRating: resEntry.submissions[anonHash].rating ?? null
  };
}
