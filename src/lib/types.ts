/**
 * Domain model for the offer pipeline.
 *
 * An "offer" is one run of the product builder: a topic goes in, a niche is
 * chosen from a scored candidate field, a lead-magnet script is written, and a
 * cover is rendered. Every stage is persisted so a run can be reopened later
 * and replayed from wherever it got to.
 */

export type Mode = "guided" | "fast";

export type StepId = "niche" | "script" | "render";

export type OfferStatus =
  | "queued"
  | "niche"
  | "script"
  | "render"
  | "ready"
  | "failed";

export type MetricKey = "pain" | "demand" | "speed" | "worsening";

export interface Metrics {
  pain: number;
  demand: number;
  speed: number;
  worsening: number;
}

/** One niche candidate weighed during step 1. */
export interface Candidate {
  id: string;
  /** Broad industry bucket, shown as the grey pill: "PERSONAL FINANCE". */
  industry: string;
  /** The narrow slice inside it: "freelance cash flow". */
  niche: string;
  /** The one-line promise: "Helping X do Y without Z". */
  headline: string;
  /** Two or three sentences on who hurts and what changes. */
  rationale: string;
  /** What the creator has to actually know to make this credible. */
  specificKnowledge: string;
  /** The pain in the buyer's own terms. */
  problemSolved: string;
  metrics: Metrics;
  /** Weighted 0-10 opportunity score. */
  score: number;
  /** Cards stream in one at a time; `drafting` is the placeholder state. */
  state: "drafting" | "scored";
}

export interface ScriptSection {
  id: string;
  /** Rendered as the small uppercase section rule. */
  heading: string;
  blocks: ScriptBlock[];
}

export type ScriptBlock =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "callout"; text: string };

export interface Script {
  title: string;
  subtitle: string;
  /** The named rule, e.g. "The Three-Guardrail Rule". */
  framework: string;
  /** The one-line rule the whole piece hangs on. */
  premise: string;
  sections: ScriptSection[];
  wordCount: number;
  sources: number;
}

export interface Cover {
  /** Cover headline, usually shorter than the script title. */
  title: string;
  kicker: string;
  /** Two hex colours for the cover gradient. */
  palette: [string, string];
  /** Simple deterministic pattern seed for the cover artwork. */
  seed: number;
}

export interface Offer {
  id: string;
  /** What the user typed, verbatim — also the breadcrumb label. */
  topic: string;
  mode: Mode;
  language: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;

  /** Step 1 output. */
  candidates: Candidate[];
  /** How many candidates this run intends to weigh (the "5 / 9" counter). */
  candidateTarget: number;
  winnerId: string | null;

  /** Step 2 output. */
  script: Script | null;

  /** Step 3 output. */
  cover: Cover | null;

  error: string | null;
}

/** Compact shape used by the offers list. */
export interface OfferSummary {
  id: string;
  topic: string;
  mode: Mode;
  language: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
  headline: string | null;
  industry: string | null;
  niche: string | null;
  score: number | null;
  wordCount: number | null;
  palette: [string, string] | null;
}

/* ------------------------------------------------------------------ *
 * Streaming protocol
 * ------------------------------------------------------------------ */

export type StreamEvent =
  | { type: "status"; status: OfferStatus; step: StepId }
  | { type: "candidate.start"; candidate: Candidate; index: number; total: number }
  | { type: "candidate.done"; candidate: Candidate; index: number; total: number }
  | { type: "niche.locked"; winnerId: string }
  | {
      type: "script.meta";
      title: string;
      subtitle: string;
      framework: string;
      premise: string;
    }
  | { type: "script.section"; section: ScriptSection }
  | { type: "script.done"; wordCount: number; sources: number }
  | { type: "cover"; cover: Cover }
  | { type: "done" }
  | { type: "error"; message: string };

export const STEPS: { id: StepId; label: string }[] = [
  { id: "niche", label: "Niche" },
  { id: "script", label: "Script" },
  { id: "render", label: "Render" },
];

export const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "pt", label: "Portuguese", flag: "🇵🇹" },
  { code: "it", label: "Italian", flag: "🇮🇹" },
  { code: "nl", label: "Dutch", flag: "🇳🇱" },
  { code: "pl", label: "Polish", flag: "🇵🇱" },
  { code: "sr", label: "Serbian", flag: "🇷🇸" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
] as const;

export function languageLabel(code: string) {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}
