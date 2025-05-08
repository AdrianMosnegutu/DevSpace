import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates the time difference between a given date and the current time.
 *
 * @param date The date to calculate the time difference from.
 * @returns A string representing the time difference in a human-readable format,
 *          such as "1 year ago", "2 months ago", or "3 days ago".
 * @throws {Error} If the input `date` is not a valid Date object.
 *
 * @example
 * // Returns "1 day ago"
 * const pastDate = new Date(2023, 11, 20, 10, 0, 0);
 * timeSince(pastDate);
 *
 * @example
 * // Returns "1 week ago"
 * const anotherPastDate = new Date(2023, 11, 18, 10, 0, 0);
 * timeSince(anotherPastDate);
 */
export function timeSince(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000; // Years
  if (interval > 1) {
    const years = Math.floor(interval);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }

  interval = seconds / 2592000; // Months
  if (interval > 1) {
    const months = Math.floor(interval);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  interval = seconds / 86400; // Days
  if (interval > 1) {
    const days = Math.floor(interval);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  interval = seconds / 3600; // Hours
  if (interval > 1) {
    const hours = Math.floor(interval);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  interval = seconds / 60; // Minutes
  if (interval > 1) {
    const minutes = Math.floor(interval);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  return Math.floor(seconds) + " seconds ago";
}

/**
 * Formats a number into a human-readable string with appropriate units (k for thousands, M for millions).
 *
 * @param num - The number to format.
 * @returns A formatted string representing the number with the appropriate unit (e.g., "12k", "1.5M").
 */
export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }

  if (num < 1_000_000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    const remainderStr =
      remainder !== 0 ? `.${Math.floor(remainder / 100)}` : "";
    return `${thousands}${remainderStr}k`;
  }

  const millions = Math.floor(num / 1_000_000);
  const remainder = num % 1_000_000;
  const remainderStr =
    remainder !== 0 ? `.${Math.floor(remainder / 100_000)}` : "";

  return `${millions}${remainderStr}M`;
}
