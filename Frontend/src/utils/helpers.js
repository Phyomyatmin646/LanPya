import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Format date strings */
export function formatDate(dateStr, opts = {}) {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    ...opts,
  }).format(new Date(dateStr));
}

/** Format relative time (e.g. "2 days ago") */
export function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)     return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60)     return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)     return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30)     return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12)    return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

/** Build user initials avatar text */
export function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');
}

/** Extract error message from Axios error */
export function getErrorMessage(err) {
  return err?.response?.data?.message
    || err?.message
    || 'Something went wrong. Please try again.';
}

/** Truncate long text */
export function truncate(str, n = 80) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '…' : str;
}

/** Capitalise first letter */
export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
