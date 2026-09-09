import type { Direction, Metrics, Opportunity } from "@/lib/types";
import { DIRECTIONS, allOpportunities, statementOf } from "./directions";
import { hash, rng } from "@/lib/ids";
import { scoreOf } from "@/lib/ai/corpus";

/**
 * The discovery engine: which directions to explore for a seed, what
 * opportunities they expand into, and what each one scores.
 *
 * A typed seed re-orders the field so matching industries are explored first
 * and score a little higher — the user's own knowledge is evidence about
 * demand, not just a filter. An empty seed explores everything.
 */

/**
 * Generic verbs and filler are excluded deliberately: matching on words like
 * "stop" or "better" pulls in every direction in the corpus and makes the
 * affinity signal meaningless.
 */
const STOPWORDS = new Set([
  "a", "an", "the", "for", "to", "of", "in", "on", "and", "with", "how",
  "about", "my", "your", "i", "want", "need", "help", "helping", "people",
  "know", "care", "solved", "problem", "skill", "method", "group", "someone",
  "stop", "start", "same", "having", "have", "get", "getting", "make",
  "making", "better", "best", "good", "more", "less", "without", "them",
  "their", "that", "this", "when", "what", "who", "from", "into", "out",
  "over", "than", "then", "some", "any", "all", "one", "two", "not",
]);

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/** How well a direction answers what the user typed. 0 when nothing matches. */
function affinity(seedTokens: string[], directionId: string): number {
  if (seedTokens.length === 0) return 0;
  const haystack = [
    DIRECTIONS.find((d) => d.id === directionId)?.industry ?? "",
    DIRECTIONS.find((d) => d.id === directionId)?.thesis ?? "",
    ...(DIRECTIONS.find((d) => d.id === directionId)?.opportunities ?? []).flatMap(
      (o) => [o.title, o.niche, o.audience, o.outcome, o.constraint],
    ),
  ]
    .join(" ")
    .toLowerCase();

  // Whole-word matching only — "art" must not match "apart", and "dog" must
  // not match "dogged".
  let hits = 0;
  for (const t of seedTokens) {
    const word = new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}s?\\b`);
    if (word.test(haystack)) hits += 1;
  }
  return hits;
}

export interface Field {
  directions: Direction[];
  opportunities: Opportunity[];
}

/**
 * Build the whole field for one run, up front. The pipeline then reveals it
 * stage by stage — the scoring is decided here so the ranking is consistent
 * with what was shown while brainstorming.
 */
export function buildField(
  seed: string,
  directionTarget: number,
  opportunityTarget: number,
): Field {
  const seedTokens = tokens(seed);
  const rand = rng(hash(seed.trim().toLowerCase() || "open"));

  // Order directions by relevance to the seed, then deterministically shuffle
  // the rest so two runs on the same seed agree but different seeds do not.
  const ranked = DIRECTIONS.map((d) => ({
    d,
    affinity: affinity(seedTokens, d.id),
    jitter: rand(),
  })).sort((a, b) =>
    b.affinity - a.affinity || a.jitter - b.jitter,
  );

  const chosen = ranked.slice(0, Math.min(directionTarget, ranked.length));
  const directions: Direction[] = chosen.map(({ d }) => ({
    id: d.id,
    industry: d.industry,
    thesis: d.thesis,
  }));

  const pool = allOpportunities().filter(({ direction }) =>
    chosen.some((c) => c.d.id === direction.id),
  );

  // Keep the pool in direction order so the brainstorm list reads as though it
  // is working through the directions it just found.
  const order = new Map(chosen.map(({ d }, i) => [d.id, i]));
  pool.sort(
    (a, b) =>
      (order.get(a.direction.id) ?? 0) - (order.get(b.direction.id) ?? 0),
  );

  const opportunities: Opportunity[] = pool
    .slice(0, opportunityTarget)
    .map(({ direction, opportunity }) => {
      // What the user already knows is evidence, not just a filter: a niche
      // they can speak to credibly has genuinely higher demand *for them*.
      // Capped so a weak match cannot outrank a much stronger market.
      const hits = affinity(seedTokens, direction.id);
      const boost = Math.min(0.9, 0.45 * hits);
      const metrics: Metrics = {
        pain: clamp(opportunity.metrics.pain + boost),
        demand: clamp(opportunity.metrics.demand + boost),
        worsening: clamp(opportunity.metrics.worsening),
        speed: clamp(opportunity.metrics.speed),
      };
      return {
        matchesSeed: hits > 0,
        id: opportunity.id,
        directionId: direction.id,
        industry: direction.industry,
        niche: opportunity.niche,
        title: opportunity.title,
        statement: statementOf(opportunity),
        audience: opportunity.audience,
        outcome: opportunity.outcome,
        constraint: opportunity.constraint,
        metrics,
        score: null,
      };
    });

  return { directions, opportunities };
}

function clamp(value: number): number {
  return Math.round(Math.min(10, Math.max(0, value)) * 10) / 10;
}

/** Scoring is shared with the offer builder so one number means one thing. */
export function scoreOpportunity(o: Opportunity): number {
  return scoreOf(o.metrics);
}
