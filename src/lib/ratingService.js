/**
 * Client-Side Service for Student Notes Rating & Helpfulness System
 * Handles anonymous token management, real API calls, local caching,
 * and reactive events for live updates across components.
 */

const TOKEN_KEY = 'kamati_rating_token';
const CACHE_KEY = 'kamati_cached_ratings';
const USER_VOTES_KEY = 'kamati_user_votes';
const RATINGS_UPDATE_EVENT = 'kamati-ratings-updated';

// Get or initialize persistent privacy-preserving client token
export function getClientToken() {
  try {
    let token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      token = 'st_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
      localStorage.setItem(TOKEN_KEY, token);
    }
    return token;
  } catch (e) {
    return 'st_transient_' + Math.random().toString(36).substring(2, 10);
  }
}

// Get cached user votes from localStorage
export function getUserVotes() {
  try {
    const raw = localStorage.getItem(USER_VOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

// Save user vote locally
function saveUserVote(resourceId, { rating, helpful }) {
  try {
    const votes = getUserVotes();
    votes[resourceId] = {
      ...(votes[resourceId] || {}),
      ...(rating !== undefined ? { rating } : {}),
      ...(helpful !== undefined ? { helpful } : {})
    };
    localStorage.setItem(USER_VOTES_KEY, JSON.stringify(votes));
  } catch (e) {}
}

// Get user's existing vote for a specific resource
export function getUserVoteForResource(resourceId) {
  const votes = getUserVotes();
  return votes[resourceId] || { rating: null, helpful: null };
}

// Get cached stats
export function getCachedRatings() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

// Save cached stats
function saveCachedRatings(statsMap) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(statsMap));
  } catch (e) {}
}

// Notify all mounted components that rating data changed
function dispatchUpdateEvent(resourceId, updatedStats) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(RATINGS_UPDATE_EVENT, {
      detail: { resourceId, stats: updatedStats }
    });
    window.dispatchEvent(event);
  }
}

// Subscribe to rating changes
export function subscribeToRatings(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = (e) => callback(e.detail);
  window.addEventListener(RATINGS_UPDATE_EVENT, handler);
  return () => window.removeEventListener(RATINGS_UPDATE_EVENT, handler);
}

// Fetch all rating stats from the server
export async function fetchAllRatings() {
  try {
    const res = await fetch('/api/ratings');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.ratings) {
        saveCachedRatings(data.ratings);
        return data.ratings;
      }
    }
  } catch (err) {
    console.warn('Network error fetching ratings, using local cache:', err);
  }
  return getCachedRatings();
}

// Submit a 1-5 star rating
export async function submitStarRating(resourceId, rating) {
  const token = getClientToken();
  const numRating = parseInt(rating, 10);

  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return { success: false, error: 'Rating must be between 1 and 5 stars.' };
  }

  try {
    const res = await fetch('/api/ratings/rate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId, rating: numRating, token })
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const result = await res.json();
      if (res.ok && result.success) {
        saveUserVote(resourceId, { rating: numRating });
        
        // Update local cache with latest server stats
        const cache = getCachedRatings();
        cache[resourceId] = result.stats;
        saveCachedRatings(cache);
        dispatchUpdateEvent(resourceId, result.stats);

        return {
          success: true,
          message: result.message || 'Rating recorded successfully!',
          stats: result.stats,
          userRating: numRating,
          isUpdate: result.isUpdate
        };
      }
      return { success: false, error: result.error || 'Failed to submit rating.' };
    }
  } catch (err) {
    console.error('Error submitting star rating:', err);
  }

  // Graceful client-side fallback (e.g. offline/static mode)
  saveUserVote(resourceId, { rating: numRating });
  const cache = getCachedRatings();
  const current = cache[resourceId] || {
    averageRating: 0,
    totalRatings: 0,
    helpfulCount: 0,
    notHelpfulCount: 0,
    helpfulPercent: null
  };

  const oldVote = getUserVoteForResource(resourceId)?.rating;
  let newTotal = current.totalRatings;
  let newAvg = current.averageRating;

  if (oldVote) {
    const currentSum = current.averageRating * current.totalRatings;
    const newSum = currentSum - oldVote + numRating;
    newAvg = parseFloat((newSum / (newTotal || 1)).toFixed(1));
  } else {
    const currentSum = current.averageRating * current.totalRatings;
    newTotal += 1;
    newAvg = parseFloat(((currentSum + numRating) / newTotal).toFixed(1));
  }

  const updatedStats = {
    ...current,
    totalRatings: newTotal,
    averageRating: newAvg
  };

  cache[resourceId] = updatedStats;
  saveCachedRatings(cache);
  dispatchUpdateEvent(resourceId, updatedStats);

  return {
    success: true,
    message: oldVote ? 'Your rating has been updated.' : 'Thank you! Your rating has been recorded.',
    stats: updatedStats,
    userRating: numRating,
    isUpdate: !!oldVote
  };
}

// Submit Helpful (true) or Not Helpful (false) feedback
export async function submitHelpfulFeedback(resourceId, isHelpful) {
  const token = getClientToken();

  try {
    const res = await fetch('/api/ratings/helpful', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId, helpful: isHelpful, token })
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const result = await res.json();
      if (res.ok && result.success) {
        saveUserVote(resourceId, { helpful: isHelpful });

        const cache = getCachedRatings();
        cache[resourceId] = result.stats;
        saveCachedRatings(cache);
        dispatchUpdateEvent(resourceId, result.stats);

        return {
          success: true,
          message: result.message || 'Feedback recorded!',
          stats: result.stats,
          userHelpful: isHelpful,
          isUpdate: result.isUpdate
        };
      }
      return { success: false, error: result.error || 'Failed to submit feedback.' };
    }
  } catch (err) {
    console.error('Error submitting helpful feedback:', err);
  }

  // Graceful client fallback
  saveUserVote(resourceId, { helpful: isHelpful });
  const cache = getCachedRatings();
  const current = cache[resourceId] || {
    averageRating: 0,
    totalRatings: 0,
    helpfulCount: 0,
    notHelpfulCount: 0,
    helpfulPercent: null
  };

  const oldHelpful = getUserVoteForResource(resourceId)?.helpful;
  let hCount = current.helpfulCount;
  let nhCount = current.notHelpfulCount;

  if (oldHelpful === true && !isHelpful) {
    hCount = Math.max(0, hCount - 1);
    nhCount += 1;
  } else if (oldHelpful === false && isHelpful) {
    nhCount = Math.max(0, nhCount - 1);
    hCount += 1;
  } else if (oldHelpful === undefined || oldHelpful === null) {
    if (isHelpful) hCount += 1;
    else nhCount += 1;
  }

  const totalVotes = hCount + nhCount;
  const hPercent = totalVotes > 0 ? Math.round((hCount / totalVotes) * 100) : null;

  const updatedStats = {
    ...current,
    helpfulCount: hCount,
    notHelpfulCount: nhCount,
    helpfulPercent: hPercent
  };

  cache[resourceId] = updatedStats;
  saveCachedRatings(cache);
  dispatchUpdateEvent(resourceId, updatedStats);

  return {
    success: true,
    message: oldHelpful !== null ? 'Your feedback has been updated.' : 'Thank you for your feedback!',
    stats: updatedStats,
    userHelpful: isHelpful,
    isUpdate: oldHelpful !== null
  };
}

// Reusable sorting helper honoring actual rating & feedback data
export function sortResourcesWithRatings(resources = [], sortBy = 'recent', ratingsMap = {}) {
  if (!Array.isArray(resources) || resources.length <= 1) {
    return resources;
  }

  const list = [...resources];

  switch (sortBy) {
    case 'highest_rated': {
      // Separate rated vs unrated notes
      const rated = [];
      const unrated = [];

      list.forEach(item => {
        const stats = ratingsMap[item.id];
        if (stats && stats.totalRatings > 0 && stats.averageRating > 0) {
          rated.push(item);
        } else {
          unrated.push(item);
        }
      });

      // Sort rated descending by averageRating, tie-break by totalRatings
      rated.sort((a, b) => {
        const statsA = ratingsMap[a.id] || { averageRating: 0, totalRatings: 0 };
        const statsB = ratingsMap[b.id] || { averageRating: 0, totalRatings: 0 };
        if (statsB.averageRating !== statsA.averageRating) {
          return statsB.averageRating - statsA.averageRating;
        }
        return statsB.totalRatings - statsA.totalRatings;
      });

      return [...rated, ...unrated];
    }

    case 'most_helpful': {
      // Separate items with helpful feedback vs none
      const withHelpful = [];
      const withoutHelpful = [];

      list.forEach(item => {
        const stats = ratingsMap[item.id];
        if (stats && stats.helpfulCount > 0) {
          withHelpful.push(item);
        } else {
          withoutHelpful.push(item);
        }
      });

      withHelpful.sort((a, b) => {
        const statsA = ratingsMap[a.id] || { helpfulCount: 0, helpfulPercent: 0 };
        const statsB = ratingsMap[b.id] || { helpfulCount: 0, helpfulPercent: 0 };
        if (statsB.helpfulCount !== statsA.helpfulCount) {
          return statsB.helpfulCount - statsA.helpfulCount;
        }
        return (statsB.helpfulPercent || 0) - (statsA.helpfulPercent || 0);
      });

      return [...withHelpful, ...withoutHelpful];
    }

    case 'most_rated': {
      const rated = [];
      const unrated = [];

      list.forEach(item => {
        const stats = ratingsMap[item.id];
        if (stats && stats.totalRatings > 0) {
          rated.push(item);
        } else {
          unrated.push(item);
        }
      });

      rated.sort((a, b) => {
        const statsA = ratingsMap[a.id] || { totalRatings: 0, averageRating: 0 };
        const statsB = ratingsMap[b.id] || { totalRatings: 0, averageRating: 0 };
        if (statsB.totalRatings !== statsA.totalRatings) {
          return statsB.totalRatings - statsA.totalRatings;
        }
        return statsB.averageRating - statsA.averageRating;
      });

      return [...rated, ...unrated];
    }

    case 'recent':
    default: {
      return list.sort((a, b) => (b.uploadedAt || '').localeCompare(a.uploadedAt || ''));
    }
  }
}

