import Anthropic from "@anthropic-ai/sdk";
import type { Engine } from "./engine";
import type { MoveKit, NicheSeed } from "./corpus";
import type { Script } from "@/lib/types";
import { buildField } from "./derive";
import { composeScript, promiseTitle } from "./writer";
import { countWords } from "@/lib/format";

/**
 * The live engine, used when ANTHROPIC_API_KEY is set.
 *
 * It fills the same `NicheSeed` shape the offline engine produces, so the UI,
 * the scoring, and the writer's skeleton are shared. Anything the model omits
 * falls back to the offline value for that field rather than rendering a hole,
 * and a failed call falls back to the offline engine entirely — a missing key
 * or a rate limit should degrade the output, never break the run.
 */

const MODEL = process.env.SYNTHESISE_MODEL || "claude-sonnet-5";

function client() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

/** Pull the first JSON value out of a response that may be wrapped in prose. */
function extractJson<T>(text: string): T | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text;
  const start = body.search(/[[{]/);
  if (start === -1) return null;
  const opener = body[start];
  const closer = opener === "[" ? "]" : "}";
  const end = body.lastIndexOf(closer);
  if (end <= start) return null;
  try {
    return JSON.parse(body.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

async function complete(
  system: string,
  user: string,
  maxTokens: number,
): Promise<string> {
  const res = await client().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
  });
  return res.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("");
}

const FIELD_SYSTEM = `You are the niche-scanning stage of a digital product builder.

Given a topic, propose distinct, commercially serious niches a solo creator could turn into a paid lead magnet. Each one must name a specific audience segment and a specific painful problem — never a broad category.

Score each on four axes, 0-10, using one decimal:
- pain: how much this hurts the person right now
- demand: how many people are actively looking for a solution
- worsening: whether the problem is getting worse over time
- speed: how quickly a buyer could feel a result

Be honest with the scores. A field where everything scores 8+ is useless.

Reply with JSON only: an array of objects with exactly these keys:
id (kebab-case), industry (Title Case, 1-2 words), niche (lowercase, 2-4 words),
headline ("Helping <audience> <outcome> without <constraint>"),
rationale (2-3 sentences), specificKnowledge (1 sentence starting "The creator should understand"),
problemSolved (2 sentences, in the buyer's terms),
metrics { pain, demand, worsening, speed },
frameworkName (a memorable named rule, e.g. "The Three-Guardrail Rule"),
premise (one sentence stating the whole method),
pillars (exactly 3 short imperative sentences),
pillarWhy (exactly 3 clauses starting "if ...", in the same order as pillars),
voice { audience, audienceShort, arena, bigEvent, obviousPart, dailyPart, frictions (3 short phrases), unit, channel, stakes, winCondition, setback },
palette (2 hex colours, dark then light).`;

const SCRIPT_SYSTEM = `You are the writing stage of a digital product builder.

Write the body of a ~2,000 word lead magnet. House style:
- Short declarative sentences. No hype, no filler, no "in today's fast-paced world".
- Second person. Concrete and specific. Numbers where you have them.
- Every chapter ends on a rule the reader could write on a card.
- Named one-paragraph examples with a first name and real detail.
- Never promise outcomes you cannot support. Where a topic touches health, money, or law, say plainly when the reader should see a professional.

Reply with JSON only: an object with a "moves" array of exactly 5 objects and a "close" object.

Each move: title (short imperative, no numbering), symptom (the failure the reader will recognise, 1-2 sentences), cause (why it happens, 1-2 sentences), fix (the correction as an instruction, 2-3 sentences), checks (5 short yes/no questions), nuance (one more turn of the screw, 2 sentences), caseName (a first name), caseStory (one paragraph, 3-4 sentences, with specifics), quote (one memorable line), callout (the rule, under 20 words).

close: { paras: [two paragraphs], steps: [three concrete actions for this week] }`;

function coerceMoves(raw: unknown, fallback: MoveKit[]): MoveKit[] {
  if (!Array.isArray(raw)) return fallback;
  const out: MoveKit[] = [];
  for (let i = 0; i < 5; i++) {
    const m = raw[i] as Partial<MoveKit> | undefined;
    const base = fallback[i % fallback.length];
    if (!m || typeof m !== "object") {
      out.push(base);
      continue;
    }
    out.push({
      title: str(m.title, base.title),
      symptom: str(m.symptom, base.symptom),
      cause: str(m.cause, base.cause),
      fix: str(m.fix, base.fix),
      checks:
        Array.isArray(m.checks) && m.checks.length
          ? m.checks.slice(0, 6).map(String)
          : base.checks,
      nuance: str(m.nuance, base.nuance),
      caseName: str(m.caseName, base.caseName),
      caseStory: str(m.caseStory, base.caseStory),
      quote: str(m.quote, base.quote),
      callout: str(m.callout, base.callout),
    });
  }
  return out;
}

function str(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function coerceSeed(raw: unknown, fallback: NicheSeed): NicheSeed {
  if (!raw || typeof raw !== "object") return fallback;
  const r = raw as Record<string, unknown>;
  const m = (r.metrics ?? {}) as Record<string, unknown>;
  const v = (r.voice ?? {}) as Record<string, unknown>;
  const num = (x: unknown, d: number) =>
    typeof x === "number" && Number.isFinite(x)
      ? Math.min(10, Math.max(0, Math.round(x * 10) / 10))
      : d;
  const trio = (x: unknown, d: [string, string, string]): [string, string, string] =>
    Array.isArray(x) && x.length >= 3
      ? [String(x[0]), String(x[1]), String(x[2])]
      : d;

  return {
    id: str(r.id, fallback.id).replace(/[^a-z0-9-]/gi, "-").toLowerCase(),
    industry: str(r.industry, fallback.industry),
    niche: str(r.niche, fallback.niche),
    headline: str(r.headline, fallback.headline),
    rationale: str(r.rationale, fallback.rationale),
    specificKnowledge: str(r.specificKnowledge, fallback.specificKnowledge),
    problemSolved: str(r.problemSolved, fallback.problemSolved),
    metrics: {
      pain: num(m.pain, fallback.metrics.pain),
      demand: num(m.demand, fallback.metrics.demand),
      worsening: num(m.worsening, fallback.metrics.worsening),
      speed: num(m.speed, fallback.metrics.speed),
    },
    frameworkName: str(r.frameworkName, fallback.frameworkName),
    premise: str(r.premise, fallback.premise),
    pillars: trio(r.pillars, fallback.pillars),
    pillarWhy: trio(r.pillarWhy, fallback.pillarWhy),
    voice: {
      audience: str(v.audience, fallback.voice.audience),
      audienceShort: str(v.audienceShort, fallback.voice.audienceShort),
      arena: str(v.arena, fallback.voice.arena),
      bigEvent: str(v.bigEvent, fallback.voice.bigEvent),
      obviousPart: str(v.obviousPart, fallback.voice.obviousPart),
      dailyPart: str(v.dailyPart, fallback.voice.dailyPart),
      frictions: trio(v.frictions, fallback.voice.frictions),
      unit: str(v.unit, fallback.voice.unit),
      channel: str(v.channel, fallback.voice.channel),
      stakes: str(v.stakes, fallback.voice.stakes),
      winCondition: str(v.winCondition, fallback.voice.winCondition),
      setback: str(v.setback, fallback.voice.setback),
    },
    palette: Array.isArray(r.palette) && r.palette.length >= 2
      ? [String(r.palette[0]), String(r.palette[1])]
      : fallback.palette,
    tags: fallback.tags,
    moves: fallback.moves,
    close: fallback.close,
  };
}

export const claudeEngine: Engine = {
  name: "claude",

  async field(topic, count) {
    const fallback = buildField(topic, count);
    try {
      const text = await complete(
        FIELD_SYSTEM,
        `Topic: ${topic || "the creator has not chosen a topic — choose for them"}\n\nPropose exactly ${count} niches.`,
        8000,
      );
      const parsed = extractJson<unknown[]>(text);
      if (!Array.isArray(parsed) || parsed.length === 0) return fallback;
      return parsed
        .slice(0, count)
        .map((raw, i) => coerceSeed(raw, fallback[i % fallback.length]));
    } catch {
      return fallback;
    }
  },

  async script(seed, language) {
    try {
      const text = await complete(
        SCRIPT_SYSTEM,
        [
          `Niche: ${seed.niche} (${seed.industry})`,
          `Promise: ${seed.headline}`,
          `Reader: ${seed.voice.audience}`,
          `Framework: ${seed.frameworkName} — ${seed.premise}`,
          `Pillars: ${seed.pillars.join(" / ")}`,
          `Problem in their words: ${seed.problemSolved}`,
          "",
          `Write the five moves and the close. Output language: ${language}.`,
        ].join("\n"),
        16000,
      );
      const parsed = extractJson<{ moves?: unknown; close?: unknown }>(text);
      if (!parsed) return composeScript(seed);

      const close = parsed.close as
        | { paras?: unknown; steps?: unknown }
        | undefined;
      const enriched: NicheSeed = {
        ...seed,
        moves: coerceMoves(parsed.moves, seed.moves),
        close: {
          paras:
            Array.isArray(close?.paras) && close.paras.length >= 2
              ? [String(close.paras[0]), String(close.paras[1])]
              : seed.close.paras,
          steps:
            Array.isArray(close?.steps) && close.steps.length >= 3
              ? [String(close.steps[0]), String(close.steps[1]), String(close.steps[2])]
              : seed.close.steps,
        },
      };

      const script = composeScript(enriched);
      return {
        ...script,
        title: promiseTitle(enriched),
        framework: enriched.frameworkName,
        wordCount: script.sections.reduce(
          (n, s) =>
            n +
            s.blocks.reduce(
              (m, b) =>
                m +
                (b.kind === "ul"
                  ? b.items.reduce((k, i) => k + countWords(i), 0)
                  : countWords(b.text)),
              0,
            ),
          0,
        ),
      } satisfies Script;
    } catch {
      return composeScript(seed);
    }
  },
};
