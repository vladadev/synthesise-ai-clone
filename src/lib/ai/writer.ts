import type { NicheSeed } from "./corpus";
import type { Script, ScriptBlock, ScriptSection } from "@/lib/types";
import { countWords } from "@/lib/format";
import { hash, rng } from "@/lib/ids";

/**
 * Turns a chosen niche into the finished lead magnet.
 *
 * The shape is fixed on purpose: a named framework, an opening that says what
 * the reader already suspects, five numbered moves that each end on a rule, and
 * a short closing with three things to do this week. Every seed fills the same
 * skeleton, which is what makes the output feel like one product rather than
 * five different writers.
 */

const SMALL_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "from", "in", "into",
  "nor", "of", "on", "onto", "or", "over", "the", "to", "up", "with", "without",
]);

export function titleCase(input: string): string {
  const words = input.trim().split(/\s+/);
  return words
    .map((w, i) => {
      const lower = w.toLowerCase();
      if (i > 0 && i < words.length - 1 && SMALL_WORDS.has(lower)) return lower;
      return lower
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("-");
    })
    .join(" ");
}

function sentenceCase(input: string): string {
  const t = input.trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** "Helping newly divorced parents co-parent peacefully…" → the promise half. */
export function promiseTitle(seed: NicheSeed): string {
  let s = seed.headline.trim();
  s = s.replace(/^Helping\s+/i, "");
  const audience = seed.voice.audience.toLowerCase();
  if (s.toLowerCase().startsWith(audience)) s = s.slice(audience.length).trim();
  const full = titleCase(s);
  if (full.length >= 8 && full.length <= 58) return full;

  // Too long to sit on a cover — drop the constraint clause and try again.
  const trimmed = titleCase(s.replace(/\s+without\s+.*$/i, "").trim());
  if (trimmed.length >= 8 && trimmed.length <= 58) return trimmed;

  return seed.frameworkName;
}

function p(text: string): ScriptBlock {
  return { kind: "p", text };
}

/**
 * A short beat after each move's fix. One per position so the reader never
 * meets the same sentence twice, and all five hold for any subject.
 */
function reinforcement(index: number, v: NicheSeed["voice"]): string {
  switch (index) {
    case 0:
      return `Notice what this does not ask for. Not more effort, not a better week, not a change of character — one decision made in advance that holds on the days when nothing else does.`;
    case 1:
      return `Structure gets a bad name because it sounds rigid. In practice it is the opposite: a fixed shape removes the need to negotiate, and removing the negotiation is what gives you ${v.channel} back.`;
    case 2:
      return `You are not trying to anticipate every situation. You are covering the handful that have already come up more than once, which is a far shorter list than it feels like from the inside.`;
    case 3:
      return `This will not work the first time it is tested. It works the fourth time, once everyone involved — you included — has learnt that the rule does not move under pressure.`;
    default:
      return `Consistency matters more than intensity here. A version of this you keep doing imperfectly for six months beats a perfect version you keep for nine days, and it is not close.`;
  }
}

export function composeScript(seed: NicheSeed): Script {
  const v = seed.voice;
  const sections: ScriptSection[] = [];

  /* --- Opening ------------------------------------------------------- */
  const [f1, f2, f3] = v.frictions;
  const opening: ScriptBlock[] = [
    p(
      `The hardest part of ${v.bigEvent} is rarely ${v.obviousPart}. It is ${v.dailyPart} that follows it. ${sentenceCase(f1)}, ${f2}, ${f3} — and the old patterns light straight back up.`,
    ),
    p(
      `The mistake underneath it is usually simple. ${sentenceCase(v.audience)} try to win the moment instead of managing the conditions around it. The argument gets all the attention, and ${v.stakes} becomes the thing everyone claims to be protecting while nobody protects ${v.arena} itself.`,
    ),
    p(
      `${seed.frameworkName} is built for exactly that moment. It gives you one order to follow when energy is low and the week is unforgiving:`,
    ),
    { kind: "ul", items: [...seed.pillars] },
    p(
      `That order matters. ${sentenceCase(seed.pillarWhy[2])}. ${sentenceCase(seed.pillarWhy[1])}. ${sentenceCase(seed.pillarWhy[0])}. What you are building is not a better mood — it is a set of conditions that keep an ordinary week from turning into the same fight again.`,
    ),
    p(
      `Nothing that follows requires more discipline than you currently have. Every move is designed to be run by someone tired, because that is who will be running it.`,
    ),
    p(
      `This is written for ${v.audience} specifically. If ${v.dailyPart} is the part that costs you most, it will apply directly. If your situation is more serious than that — where safety, money you cannot afford to lose, or a professional's involvement is already in question — treat this as background and get proper advice first.`,
    ),
    p(
      `Read it once end to end, then run one section at a time, in order, for a fortnight each. Attempting all five in a weekend is the most common way this fails, and it fails quietly: everything gets tried, nothing gets established.`,
    ),
  ];

  sections.push({
    id: "opening",
    heading: `The hard part of ${v.bigEvent} is not ${v.obviousPart}`,
    blocks: opening,
  });

  /* --- The five moves ------------------------------------------------ */
  seed.moves.forEach((move, i) => {
    const blocks: ScriptBlock[] = [
      p(move.symptom),
      p(move.cause),
      p(move.fix),
      p(reinforcement(i, v)),
      p(`Run these checks before your next ${v.unit}:`),
      { kind: "ul", items: [...move.checks] },
      p(move.nuance),
      p(move.caseStory),
      { kind: "quote", text: move.quote },
      { kind: "callout", text: move.callout },
    ];
    sections.push({
      id: `move-${i + 1}`,
      heading: `${i + 1}. ${move.title}`,
      blocks,
    });
  });

  /* --- How to tell it is working -------------------------------------- */
  sections.push({
    id: "signals",
    heading: "How to tell it is working",
    blocks: [
      p(
        `Progress in ${v.arena} is easy to miss, because most of the wins are absences: the argument that did not start, the week that simply ran. If you are watching for a dramatic change, you will conclude that nothing is working long before that is true.`,
      ),
      p(
        `Measure conditions rather than feelings. Conditions are observable, they move inside a fortnight, and they are the thing you actually changed — how you felt about ${v.arena} this week is downstream of them and lags behind by a month.`,
      ),
      p(`Four weeks in, look for these:`),
      {
        kind: "ul",
        items: [
          `${sentenceCase(v.winCondition)} has happened at least once.`,
          `You made fewer decisions about ${v.arena} than you did a month ago.`,
          `${sentenceCase(v.setback)} cost you days rather than weeks.`,
          `Someone else could run your ${v.unit} correctly from what you have written down.`,
        ],
      },
      p(
        `If none of those are true after a month, the cause is almost always the same: a rule that is still being decided in the moment rather than in advance. Go back to the section that matches the friction you hit most often, fix that single condition, and leave the rest alone for another fortnight.`,
      ),
      {
        kind: "callout",
        text: `Judge this on conditions you can observe, never on how the week felt.`,
      },
    ],
  });

  /* --- Close --------------------------------------------------------- */
  sections.push({
    id: "close",
    heading: "What to do before this time next week",
    blocks: [
      p(seed.close.paras[0]),
      p(seed.close.paras[1]),
      p(
        `You are aiming for one thing in the next seven days: ${v.winCondition}. Not a transformation — one week that runs on rules you already agreed to.`,
      ),
      { kind: "ul", items: [...seed.close.steps] },
      {
        kind: "callout",
        text: `${seed.premise}`,
      },
    ],
  });

  const wordCount = sections.reduce((total, section) => {
    return (
      total +
      countWords(section.heading) +
      section.blocks.reduce((sum, block) => {
        if (block.kind === "ul")
          return sum + block.items.reduce((n, i) => n + countWords(i), 0);
        return sum + countWords(block.text);
      }, 0)
    );
  }, 0);

  const rand = rng(hash(seed.id));
  const sources = 120 + Math.floor(rand() * 80);

  return {
    title: promiseTitle(seed),
    subtitle: `A short, practical guide for ${v.audience}.`,
    framework: seed.frameworkName,
    premise: seed.premise,
    sections,
    wordCount,
    sources,
  };
}
