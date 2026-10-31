import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Check, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  submitStarRating, 
  submitHelpfulFeedback, 
  getUserVoteForResource, 
  subscribeToRatings 
} from '../lib/ratingService';

export default function NotesRatingWidget({ resourceId, initialStats, compact = false }) {
  const [stats, setStats] = useState(initialStats || {
    averageRating: 0,
    totalRatings: 0,
    helpfulCount: 0,
    notHelpfulCount: 0,
    helpfulPercent: null
  });

  const [userVote, setUserVote] = useState({ rating: null, helpful: null });
  const [hoverRating, setHoverRating] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Load existing user vote on mount
  useEffect(() => {
    if (resourceId) {
      setUserVote(getUserVoteForResource(resourceId));
    }
  }, [resourceId]);

  // Synchronize stats if initialStats changes
  useEffect(() => {
    if (initialStats) {
      setStats(initialStats);
    }
  }, [initialStats]);

  // Subscribe to real-time updates for this resource
  useEffect(() => {
    if (!resourceId) return;
    const unsubscribe = subscribeToRatings((detail) => {
      if (detail && detail.resourceId === resourceId && detail.stats) {
        setStats(detail.stats);
      }
    });
    return unsubscribe;
  }, [resourceId]);

  const handleStarClick = async (starValue) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFeedbackMessage('');

    try {
      const res = await submitStarRating(resourceId, starValue);
      if (res.success) {
        setUserVote(prev => ({ ...prev, rating: res.userRating }));
        setStats(res.stats);
        setFeedbackMessage(res.isUpdate ? 'Rating updated!' : 'Thanks for rating!');
        setTimeout(() => setFeedbackMessage(''), 3000);
      } else {
        setFeedbackMessage(res.error || 'Failed to submit rating.');
      }
    } catch (e) {
      setFeedbackMessage('Network error. Rating saved locally.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpfulClick = async (isHelpful) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFeedbackMessage('');

    try {
      const res = await submitHelpfulFeedback(resourceId, isHelpful);
      if (res.success) {
        setUserVote(prev => ({ ...prev, helpful: res.userHelpful }));
        setStats(res.stats);
        setFeedbackMessage(isHelpful ? 'Marked as helpful!' : 'Feedback noted. Thank you!');
        setTimeout(() => setFeedbackMessage(''), 3000);
      } else {
        setFeedbackMessage(res.error || 'Failed to submit feedback.');
      }
    } catch (e) {
      setFeedbackMessage('Network error. Feedback saved locally.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasRatings = stats && stats.totalRatings > 0;
  const hasHelpfulFeedback = stats && (stats.helpfulCount > 0 || stats.notHelpfulCount > 0);

  return (
    <div className="notes-rating-container" style={{ marginTop: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
      {/* Summary Bar */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '8px' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Star rating display badge */}
          <span 
            className="rating-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem',
              fontWeight: '700',
              padding: '3px 8px',
              borderRadius: '6px',
              background: hasRatings ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-primary)',
              color: hasRatings ? '#D97706' : 'var(--text-muted)',
              border: '1px solid',
              borderColor: hasRatings ? 'rgba(245, 158, 11, 0.25)' : 'var(--border-color)'
            }}
          >
            <Star size={13} fill={hasRatings ? '#F59E0B' : 'none'} color={hasRatings ? '#F59E0B' : 'var(--text-muted)'} />
            {hasRatings ? (
              <span>
                <strong>{stats.averageRating.toFixed(1)}/5</strong> ({stats.totalRatings} {stats.totalRatings === 1 ? 'rating' : 'ratings'})
              </span>
            ) : (
              <span>Not rated yet</span>
            )}
          </span>

          {/* Helpful summary badge */}
          {hasHelpfulFeedback ? (
            <span 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                background: 'rgba(16, 185, 129, 0.08)',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}
              title={`${stats.helpfulCount} found helpful, ${stats.notHelpfulCount} not helpful`}
            >
              <ThumbsUp size={11} color="#10B981" />
              <span>
                {stats.helpfulPercent !== null ? `${stats.helpfulPercent}% helpful` : `${stats.helpfulCount} helpful`}
              </span>
            </span>
          ) : null}

          {userVote.rating && (
            <span 
              style={{ 
                fontSize: '0.72rem', 
                color: 'var(--cyan-dark)', 
                fontWeight: '600' 
              }}
            >
              (You rated: {userVote.rating}★)
            </span>
          )}
        </div>

        {/* Rate / Toggle button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: isOpen ? 'var(--cyan-light)' : 'transparent',
            border: '1px solid',
            borderColor: isOpen ? 'var(--cyan-primary)' : 'var(--border-color)',
            borderRadius: '6px',
            padding: '3px 9px',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: isOpen ? 'var(--cyan-dark)' : 'var(--text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          aria-expanded={isOpen}
          title="Rate these notes or share feedback"
        >
          <span>{userVote.rating ? 'Edit Rating' : 'Rate & Feedback'}</span>
          {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Expanded Interactive Voting Panel */}
      {isOpen && (
        <div 
          style={{
            marginTop: '10px',
            padding: '12px 14px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          {/* Star selector */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Rate Note Quality (1–5 Stars):
              </span>
              {userVote.rating && (
                <span style={{ fontSize: '0.72rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Check size={11} /> Saved
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isFilled = (hoverRating || userVote.rating || 0) >= starVal;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => handleStarClick(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    disabled={isSubmitting}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      transform: hoverRating === starVal ? 'scale(1.25)' : 'scale(1)',
                      transition: 'transform 0.1s ease',
                      outline: 'none'
                    }}
                    title={`Rate ${starVal} Star${starVal > 1 ? 's' : ''}`}
                    aria-label={`${starVal} star`}
                  >
                    <Star 
                      size={20} 
                      color={isFilled ? '#F59E0B' : 'var(--text-muted)'} 
                      fill={isFilled ? '#F59E0B' : 'none'} 
                    />
                  </button>
                );
              })}

              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                {hoverRating === 1 ? '1 - Poor' :
                 hoverRating === 2 ? '2 - Fair' :
                 hoverRating === 3 ? '3 - Good' :
                 hoverRating === 4 ? '4 - Very Good' :
                 hoverRating === 5 ? '5 - Excellent!' :
                 userVote.rating ? `${userVote.rating} of 5 selected` : 'Click to rate'}
              </span>
            </div>
          </div>

          {/* Helpfulness Question */}
          <div style={{ paddingTop: '8px', borderTop: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              Was this material helpful?
            </span>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleHelpfulClick(true)}
                disabled={isSubmitting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: userVote.helpful === true ? '#10B981' : 'var(--border-color)',
                  background: userVote.helpful === true ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface)',
                  color: userVote.helpful === true ? '#047857' : 'var(--text-primary)',
                  transition: 'all 0.15s ease'
                }}
              >
                <ThumbsUp size={12} color={userVote.helpful === true ? '#10B981' : 'currentColor'} />
                <span>Helpful ({stats.helpfulCount || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => handleHelpfulClick(false)}
                disabled={isSubmitting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: userVote.helpful === false ? '#EF4444' : 'var(--border-color)',
                  background: userVote.helpful === false ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-surface)',
                  color: userVote.helpful === false ? '#B91C1C' : 'var(--text-primary)',
                  transition: 'all 0.15s ease'
                }}
              >
                <ThumbsDown size={12} color={userVote.helpful === false ? '#EF4444' : 'currentColor'} />
                <span>Not Helpful ({stats.notHelpfulCount || 0})</span>
              </button>
            </div>
          </div>

          {/* Feedback message confirmation toast */}
          {feedbackMessage && (
            <div 
              style={{ 
                marginTop: '8px', 
                padding: '6px 10px', 
                borderRadius: '6px', 
                background: 'rgba(8, 182, 212, 0.1)', 
                color: 'var(--cyan-dark)', 
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Check size={12} color="var(--cyan-primary)" />
              <span>{feedbackMessage}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
