import type {
  Candidate,
  Cover,
  Offer,
  StreamEvent,
} from "@/lib/types";
import type { NicheSeed } from "./corpus";
import { scoreOf } from "./corpus";
import { selectEngine } from ".";
import { updateOffer } from "@/lib/store";
import { hash } from "@/lib/ids";

/**
 * The three steps, as a stream of events.
 *
 * The pipeline owns pacing and persistence; the engines only supply content.
 * Every meaningful transition is written to the store as it happens, so a
 * reload part-way through a run reopens on whatever had already been decided
 * rather than starting again.
 */

const PACE = {
  /** Gap between a card appearing as "Drafting…" and being scored. */
  candidateDraft: 620,
  /** Gap before the next card starts drafting. */
  candidateGap: 340,
  /** Beat before the winner is revealed, so the field can be read. */
  lockIn: 900,
  /** Gap between script sections landing. */
  section: 520,
  /** Beat before the cover appears. */
  render: 1100,
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function toCandidate(seed: NicheSeed, state: Candidate["state"]): Candidate {
  return {
    id: seed.id,
    industry: seed.industry.toUpperCase(),
    niche: seed.niche,
    headline: seed.headline,
    rationale: seed.rationale,
    specificKnowledge: seed.specificKnowledge,
    problemSolved: seed.problemSolved,
    metrics: seed.metrics,
    score: scoreOf(seed.metrics),
    state,
  };
}

function draftingCandidate(seed: NicheSeed): Candidate {
  const c = toCandidate(seed, "drafting");
  return {
    ...c,
    headline: "",
    rationale: "",
    specificKnowledge: "",
    problemSolved: "",
    metrics: { pain: 0, demand: 0, speed: 0, worsening: 0 },
    score: 0,
  };
}

function coverFor(seed: NicheSeed, title: string): Cover {
  return {
    title,
    kicker: seed.industry.toUpperCase(),
    palette: seed.palette,
    seed: hash(seed.id),
  };
}

export async function* runPipeline(offer: Offer): AsyncGenerator<StreamEvent> {
  const engine = selectEngine();
  const total = offer.candidateTarget;

  try {
    /* --- Step 1: niche ---------------------------------------------- */
    yield { type: "status", status: "niche", step: "niche" };
    await updateOffer(offer.id, (o) => ({ ...o, status: "niche" }));

    const seeds = await engine.field(offer.topic, total);
    const candidates: Candidate[] = [];

    for (let i = 0; i < seeds.length; i++) {
      const drafting = draftingCandidate(seeds[i]);
      candidates.push(drafting);
      yield {
        type: "candidate.start",
        candidate: drafting,
        index: i,
        total: seeds.length,
      };
      await sleep(PACE.candidateDraft);

      const scored = toCandidate(seeds[i], "scored");
      candidates[i] = scored;
      await updateOffer(offer.id, (o) => ({
        ...o,
        candidates: [...candidates],
      }));
      yield {
        type: "candidate.done",
        candidate: scored,
        index: i,
        total: seeds.length,
      };
      if (i < seeds.length - 1) await sleep(PACE.candidateGap);
    }

    await sleep(PACE.lockIn);

    const winner = candidates.reduce((best, c) =>
      c.score > best.score ? c : best,
    );
    const winnerSeed = seeds.find((s) => s.id === winner.id) ?? seeds[0];

    await updateOffer(offer.id, (o) => ({ ...o, winnerId: winner.id }));
    yield { type: "niche.locked", winnerId: winner.id };

    /* --- Step 2: script ---------------------------------------------- */
    yield { type: "status", status: "script", step: "script" };
    await updateOffer(offer.id, (o) => ({ ...o, status: "script" }));

    const script = await engine.script(winnerSeed, offer.language);
    yield {
      type: "script.meta",
      title: script.title,
      subtitle: script.subtitle,
      framework: script.framework,
      premise: script.premise,
    };

    for (const section of script.sections) {
      await sleep(PACE.section);
      yield { type: "script.section", section };
    }

    await updateOffer(offer.id, (o) => ({ ...o, script }));
    yield {
      type: "script.done",
      wordCount: script.wordCount,
      sources: script.sources,
    };

    /* --- Step 3: render ---------------------------------------------- */
    yield { type: "status", status: "render", step: "render" };
    await updateOffer(offer.id, (o) => ({ ...o, status: "render" }));
    await sleep(PACE.render);

    const cover = coverFor(winnerSeed, script.title);
    await updateOffer(offer.id, (o) => ({ ...o, cover, status: "ready" }));
    yield { type: "cover", cover };
    yield { type: "status", status: "ready", step: "render" };
    yield { type: "done" };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Generation failed unexpectedly.";
    await updateOffer(offer.id, (o) => ({
      ...o,
      status: "failed",
      error: message,
    }));
    yield { type: "error", message };
  }
}
