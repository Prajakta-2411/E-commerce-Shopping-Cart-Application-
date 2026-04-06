import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount) {
  // Format price with commas and rupee symbol
  const formatted = Math.floor(amount).toLocaleString('en-IN');
  return `₹ ${formatted}`;
}
