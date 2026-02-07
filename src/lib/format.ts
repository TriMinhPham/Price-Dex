/**
 * Formatting Utilities
 * Tools for formatting prices, dates, numbers, and text for display
 */

/**
 * Format cents as a dollar string
 * @param cents - Amount in cents (e.g., 1500 = $15.00)
 * @returns Formatted price string (e.g., "$15.00")
 */
export function formatPrice(cents: number | null): string {
  if (cents === null || cents === undefined) {
    return 'N/A';
  }
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dollars);
}

/**
 * Format a price change with prefix and optional color class
 * @param change - Price change amount
 * @returns Formatted change string with +/- prefix
 */
export function formatPriceChange(change: number): string {
  if (change === null || change === undefined) {
    return 'N/A';
  }

  const sign = change > 0 ? '+' : '';
  return `${sign}${formatPrice(change)}`;
}

/**
 * Get CSS class for price change direction
 * @param change - Price change amount
 * @returns CSS class name for styling
 */
export function getPriceChangeClass(change: number): string {
  if (change > 0) {
    return 'text-green-600';
  }
  if (change < 0) {
    return 'text-red-600';
  }
  return 'text-gray-600';
}

/**
 * Format a percentage value
 * @param value - Decimal value (e.g., 0.05 = 5%)
 * @param decimals - Number of decimal places to show
 * @returns Formatted percentage string with sign (e.g., "+5.00%")
 */
export function formatPercent(value: number, decimals: number = 2): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }

  const sign = value > 0 ? '+' : '';
  const percent = (value * 100).toFixed(decimals);
  return `${sign}${percent}%`;
}

/**
 * Format a date string to a human-readable format
 * @param dateString - ISO date string
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date string (e.g., "Feb 6, 2026")
 */
export function formatDate(
  dateString: string,
  locale: string = 'en-US'
): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format a date string with time
 * @param dateString - ISO date string
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date and time string
 */
export function formatDateTime(
  dateString: string,
  locale: string = 'en-US'
): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format a number with thousands separators
 * @param n - Number to format
 * @param decimals - Number of decimal places
 * @returns Formatted number string (e.g., "1,234.56")
 */
export function formatNumber(n: number, decimals: number = 0): string {
  if (n === null || n === undefined) {
    return 'N/A';
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/**
 * Get a relative time string (e.g., "2 hours ago")
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export function getTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
      return 'just now';
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }

    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    }

    const years = Math.floor(days / 365);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  } catch {
    return dateString;
  }
}

/**
 * Convert text to a URL-safe slug
 * @param text - Text to slugify
 * @returns URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Truncate text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length (including ellipsis)
 * @returns Truncated text
 */
export function truncate(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength - 3)}...`;
}

/**
 * Format a large number in a compact way (e.g., 1.2K, 5.4M)
 * @param num - Number to format
 * @param decimals - Number of decimal places
 * @returns Compact formatted number
 */
export function formatCompact(num: number, decimals: number = 1): string {
  if (num === null || num === undefined) {
    return 'N/A';
  }

  const absNum = Math.abs(num);

  if (absNum >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (absNum >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(decimals)}M`;
  }
  if (absNum >= 1_000) {
    return `${(num / 1_000).toFixed(decimals)}K`;
  }

  return formatNumber(num, decimals);
}
