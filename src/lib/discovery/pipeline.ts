import type { Discovery, DiscoveryEvent, Opportunity } from "@/lib/types";
import { buildField, scoreOpportunity } from "./engine";
import { updateDiscovery } from "@/lib/store";

/**
 * "Discover Your Profitable Pocket", as a stream of events.
 *
 * Three stages. Directions finds the industries worth exploring; Brainstorm
 * turns each direction into concrete opportunities; Score ranks every one and
 * cuts a shortlist. State is written at each stage boundary so reopening a
 * finished run replays it rather than re-running it.
 */

const PACE = {
  /** Directions arrive quickly — this stage is a sweep, not a judgement. */
  direction: 130,
  /** Opportunities are written, so they land a little slower. */
  opportunity: 165,
  /** Scoring is the deliberate part. */
  score: 120,
  /** Beat before the shortlist resolves, so the ranking can be read. */
  shortlist: 700,
  /** Pause between stages. */
  stage: 450,
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function* runDiscovery(
  discovery: Discovery,
): AsyncGenerator<DiscoveryEvent> {
  try {
    const field = buildField(
      discovery.seed,
      discovery.directionTarget,
      discovery.opportunityTarget,
    );

    /* --- Stage 1: directions ------------------------------------------ */
    yield { type: "stage", stage: "directions" };
    await updateDiscovery(discovery.id, (d) => ({ ...d, stage: "directions" }));

    for (let i = 0; i < field.directions.length; i++) {
      await sleep(PACE.direction);
      yield {
        type: "direction",
        direction: field.directions[i],
        index: i,
        total: field.directions.length,
      };
    }

    await updateDiscovery(discovery.id, (d) => ({
      ...d,
      directions: field.directions,
    }));
    await sleep(PACE.stage);

    /* --- Stage 2: brainstorm ------------------------------------------ */
    yield { type: "stage", stage: "brainstorm" };
    await updateDiscovery(discovery.id, (d) => ({ ...d, stage: "brainstorm" }));

    const opportunities: Opportunity[] = [];
    for (let i = 0; i < field.opportunities.length; i++) {
      await sleep(PACE.opportunity);
      const opportunity = field.opportunities[i];
      opportunities.push(opportunity);
      yield {
        type: "opportunity",
        opportunity,
        index: i,
        total: field.opportunities.length,
        directionsExplored: field.directions.length,
      };
    }

    await updateDiscovery(discovery.id, (d) => ({ ...d, opportunities }));
    await sleep(PACE.stage);

    /* --- Stage 3: score ------------------------------------------------ */
    yield { type: "stage", stage: "score" };
    await updateDiscovery(discovery.id, (d) => ({ ...d, stage: "score" }));

    for (let i = 0; i < opportunities.length; i++) {
      await sleep(PACE.score);
      const score = scoreOpportunity(opportunities[i]);
      opportunities[i] = { ...opportunities[i], score };
      yield {
        type: "scored",
        id: opportunities[i].id,
        score,
        index: i,
        total: opportunities.length,
      };
    }

    await sleep(PACE.shortlist);

    const ranked = [...opportunities].sort(
      (a, b) => (b.score ?? 0) - (a.score ?? 0),
    );
    const average =
      Math.round(
        (opportunities.reduce((n, o) => n + (o.score ?? 0), 0) /
          Math.max(1, opportunities.length)) *
          10,
      ) / 10;
    const shortlisted = Math.min(discovery.shortlistTarget, ranked.length);

    await updateDiscovery(discovery.id, (d) => ({
      ...d,
      opportunities: ranked,
      stage: "ready",
    }));

    yield {
      type: "shortlist",
      leaderId: ranked[0].id,
      average,
      evaluated: opportunities.length,
      shortlisted,
    };
    yield { type: "stage", stage: "ready" };
    yield { type: "done" };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "The exploration stopped unexpectedly.";
    await updateDiscovery(discovery.id, (d) => ({ ...d, error: message }));
    yield { type: "error", message };
  }
}
