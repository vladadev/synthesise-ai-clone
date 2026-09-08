import type { OfferStatus } from "./types";

export function relativeTime(iso: string, now = Date.now()): string {
  const then = new Date(iso).getTime();
  const secs = Math.max(0, Math.round((now - then) / 1000));
  if (secs < 45) return "just now";
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export const STATUS_LABEL: Record<OfferStatus, string> = {
  queued: "Queued",
  niche: "Choosing the angle",
  script: "Writing the script",
  render: "Rendering the cover",
  ready: "Ready",
  failed: "Failed",
};

/**
 * Metric bars are coloured by value, not by which metric they are — the same
 * rule the product uses so a weak number reads as weak at a glance.
 */
export function metricTone(value: number): "strong" | "fair" | "weak" {
  if (value >= 8.5) return "strong";
  if (value >= 6) return "fair";
  return "weak";
}

export function scoreTone(value: number): "high" | "mid" {
  return value >= 8.5 ? "high" : "mid";
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}
