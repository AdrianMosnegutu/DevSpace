import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates the time elapsed between a given date and the current time,
 * returning a human-readable string describing the duration (e.g., "2 years ago").
 *
 * @param date - The past date to compare with the current time.
 * @returns A string describing how long ago the date was.
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

export function regularToast(message: string, description?: string) {
  toast(message, {
    description: description,
    descriptionClassName: "!text-neutral-500",
  });
}

export function errorToast(message: string, error: unknown) {
  let description: string;

  if (typeof error === "string") {
    description = error;
  } else if (error instanceof AxiosError && error.response) {
    description = error.response.data as string;
  } else {
    description = "An unkown error occured";
  }

  toast(message, { description, descriptionClassName: "!text-red-600" });
}
