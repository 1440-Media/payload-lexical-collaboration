/**
 * Utility functions for time formatting
 */

// Create a RelativeTimeFormat instance for formatting relative times
const rtf = new Intl.RelativeTimeFormat('en', {
  localeMatcher: 'best fit',
  numeric: 'auto',
  style: 'short',
})

/**
 * Format a timestamp as a relative time string with appropriate time units
 * (e.g., "Just now", "5 min ago", "2 hr ago", "3 days ago", "2 mo ago", "1 yr ago")
 */
export const formatTimeAgo = (timestamp: number): string => {
  const now = performance.timeOrigin + performance.now();
  const diffInMs = now - timestamp;
  
  // Convert to seconds (negative because the timestamp is in the past)
  const seconds = Math.round(diffInMs / 1000);
  
  // Just now for very recent comments
  if (seconds < 10) return 'Just now';
  
  // Less than a minute
  if (seconds < 60) return rtf.format(-seconds, 'second');
  
  // Less than an hour
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return rtf.format(-minutes, 'minute');
  
  // Less than a day
  const hours = Math.round(minutes / 60);
  if (hours < 24) return rtf.format(-hours, 'hour');
  
  // Less than a month (approx)
  const days = Math.round(hours / 24);
  if (days < 30) return rtf.format(-days, 'day');
  
  // Less than a year
  const months = Math.round(days / 30);
  if (months < 12) return rtf.format(-months, 'month');
  
  // Years
  const years = Math.round(months / 12);
  return rtf.format(-years, 'year');
}

/**
 * Custom hook for periodically updating time displays
 * This could be implemented if we want to use React hooks
 * instead of the current counter approach
 */
