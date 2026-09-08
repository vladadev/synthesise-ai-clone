import { NICHE_LIBRARY, scoreOf, type MoveKit, type NicheSeed } from "./corpus";
import { NICHE_LIBRARY_EXTRA } from "./corpus-extra";
import { hash, rng } from "@/lib/ids";

export const LIBRARY: NicheSeed[] = [...NICHE_LIBRARY, ...NICHE_LIBRARY_EXTRA];

/** Topics that mean "you choose" rather than naming a subject. */
const OPEN_TOPIC = [
  "any topic",
  "you pick",
  "you choose",
  "not sure",
  "no idea",
  "surprise me",
  "whatever",
  "anything",
  "dont know",
  "don't know",
  "pick for me",
  "help me choose",
];

export function isOpenTopic(topic: string): boolean {
  const t = topic.trim().toLowerCase();
  if (t.length < 3) return true;
  return OPEN_TOPIC.some((p) => t.includes(p));
}

const STOPWORDS = new Set([
  "a", "an", "the", "for", "to", "of", "in", "on", "and", "with", "how",
  "about", "my", "your", "that", "this", "is", "are", "i", "want", "need",
  "help", "helping", "people", "guide", "course", "ebook", "make", "get",
]);

function words(topic: string): string[] {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/** Route a typed topic to the closest library seed, if one is close enough. */
export function matchSeed(topic: string): NicheSeed | null {
  const w = new Set(words(topic).filter((x) => !STOPWORDS.has(x)));
  if (w.size === 0) return null;
  let best: { seed: NicheSeed; score: number } | null = null;
  for (const seed of LIBRARY) {
    let score = 0;
    for (const tag of seed.tags) {
      const parts = tag.split(" ");
      if (parts.every((p) => w.has(p))) score += parts.length;
    }
    if (!best || score > best.score) best = { seed, score };
  }
  return best && best.score >= 2 ? best.seed : null;
}

/* ------------------------------------------------------------------ *
 * Synthesising a niche from a typed topic
 * ------------------------------------------------------------------ */

interface Parsed {
  subject: string;
  audience: string;
  audienceShort: string;
}

const INDUSTRY_HINTS: [RegExp, string][] = [
  [/\b(dog|cat|puppy|pet|kitten|horse|training a)\b/, "Pets"],
  [/\b(pain|sleep|anxiety|gut|migraine|health|nutrition|diet)\b/, "Health"],
  [/\b(fitness|gym|running|strength|muscle|weight|marathon|yoga)\b/, "Fitness"],
  [/\b(money|budget|debt|invest|saving|pension|tax|income)\b/, "Personal Finance"],
  [/\b(interview|resume|cv|career|promotion|job|hiring)\b/, "Career"],
  [/\b(instagram|tiktok|seo|ads|marketing|content|audience|newsletter)\b/, "Marketing"],
  [/\b(toddler|baby|child|parent|teen|kids|newborn)\b/, "Parenting"],
  [/\b(dating|marriage|divorce|relationship|couples)\b/, "Relationships"],
  [/\b(focus|procrastinat|productiv|habits|adhd|time management)\b/, "Productivity"],
  [/\b(declutter|home|garden|diy|kitchen|cleaning|renovation)\b/, "Home"],
  [/\b(teacher|student|exam|study|revision|school|learning)\b/, "Education"],
  [/\b(code|coding|developer|software|ai|automation|data|no-code)\b/, "Technology"],
  [/\b(writing|art|music|photo|design|drawing|craft)\b/, "Creative"],
  [/\b(client|agency|consult|startup|ecommerce|shop|business|sales)\b/, "Business"],
  [/\b(travel|trip|van|camping|nomad|flight)\b/, "Travel"],
  [/\b(cook|recipe|meal|baking|food|dinner)\b/, "Food"],
];

function industryFor(topic: string): string {
  const t = topic.toLowerCase();
  for (const [re, industry] of INDUSTRY_HINTS) if (re.test(t)) return industry;
  return "Lifestyle";
}

function titleWords(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

/** Verbs common enough at the start of a topic to be worth handling. */
const GERUND_EXCEPTIONS: Record<string, string> = {
  run: "running",
  swim: "swimming",
  quit: "quitting",
  get: "getting",
  plan: "planning",
  win: "winning",
  sit: "sitting",
  cut: "cutting",
  set: "setting",
  put: "putting",
  begin: "beginning",
  travel: "travelling",
};

const LEADING_VERBS = new Set([
  "learn", "start", "build", "write", "get", "lose", "make", "run", "grow",
  "quit", "master", "play", "cook", "train", "sell", "fix", "draw", "code",
  "sing", "invest", "save", "speak", "read", "paint", "trade", "manage",
  "plan", "launch", "design", "study", "swim", "climb", "budget", "declutter",
  "negotiate", "publish", "meditate", "stretch", "sleep", "travel", "begin",
]);

function gerund(verb: string): string {
  if (GERUND_EXCEPTIONS[verb]) return GERUND_EXCEPTIONS[verb];
  if (verb.endsWith("e") && !verb.endsWith("ee")) return `${verb.slice(0, -1)}ing`;
  return `${verb}ing`;
}

/**
 * "learn spanish" reads badly mid-sentence ("fit learn spanish into a week"),
 * so a topic that opens on a bare verb becomes a gerund phrase.
 */
function readable(subject: string): string {
  const parts = subject.split(" ");
  const first = parts[0]?.toLowerCase();
  if (first && LEADING_VERBS.has(first)) {
    parts[0] = gerund(first);
    return parts.join(" ");
  }
  return subject;
}

/** Pull an audience and a subject out of whatever the user typed. */
export function parseTopic(topic: string): Parsed {
  const raw = topic.trim().replace(/\s+/g, " ");
  const lowered = raw.toLowerCase();

  // "X for Y" is the most common shape: subject for audience.
  const forMatch = lowered.match(/^(.*?)\s+for\s+(.*)$/);
  if (forMatch) {
    const subject = readable(titleWords(raw.slice(0, forMatch[1].length)));
    const audience = titleWords(
      raw.slice(raw.length - forMatch[2].length),
    ).toLowerCase();
    return {
      subject,
      audience,
      audienceShort: audience.split(" ").slice(-2).join(" "),
    };
  }

  // "how to X" / "helping X do Y"
  const howMatch = lowered.match(/^how (?:to|do i)\s+(.*)$/);
  const subject = readable(
    titleWords(howMatch ? raw.slice(raw.length - howMatch[1].length) : raw),
  );
  return {
    subject,
    // No audience was named, so the widest honest one — and a short form that
    // will not collide with the "complete beginners" angle's label.
    audience: `people serious about ${subject}`,
    audienceShort: "self-taught learners",
  };
}

/**
 * The angles the scan tries against any topic. `segment` is a pure audience —
 * the subject is woven in by `verb` — so a headline never names the topic twice.
 */
const ANGLES: {
  segment: (p: Parsed) => string;
  short: (p: Parsed) => string;
  verb: (subject: string) => string;
  constraint: string;
  slant: string;
  framework: string;
  bias: number;
}[] = [
  {
    segment: (p) => p.audience,
    short: (p) => p.audienceShort,
    verb: (s) => `get real results from ${s}`,
    constraint: "without guesswork or conflicting advice",
    slant: "the default path, done properly",
    framework: "The Single-Input Rule",
    bias: 1.4,
  },
  {
    segment: () => "complete beginners",
    short: () => "beginners",
    verb: (s) => `get started with ${s} properly`,
    constraint: "without wasting the first three months",
    slant: "the first thirty days",
    framework: "The First Thirty Days",
    bias: 0.9,
  },
  {
    segment: () => "people who have tried before and stopped",
    short: () => "returners",
    verb: (s) => `come back to ${s}`,
    constraint: "without starting from scratch again",
    slant: "the restart",
    framework: "The Restart Rule",
    bias: 1.1,
  },
  {
    segment: () => "busy professionals",
    short: () => "busy professionals",
    verb: (s) => `fit ${s} into a full week`,
    constraint: "without giving up their evenings",
    slant: "the time-poor version",
    framework: "The Small-Window Method",
    bias: 1.0,
  },
  {
    segment: () => "parents with young children",
    short: () => "parents",
    verb: (s) => `keep ${s} going`,
    constraint: "without a schedule nobody could keep",
    slant: "around a full house",
    framework: "The Interruption-Proof Plan",
    bias: 0.6,
  },
  {
    segment: () => "people on a tight budget",
    short: () => "people on a budget",
    verb: (s) => `do ${s} well`,
    constraint: "without expensive gear or paid help",
    slant: "the cheap way that still works",
    framework: "The Minimum-Kit Method",
    bias: 0.7,
  },
  {
    segment: () => "people learning entirely alone",
    short: () => "solo learners",
    verb: (s) => `make steady progress at ${s}`,
    constraint: "without a coach, a class, or a community",
    slant: "self-directed",
    framework: "The Self-Check Loop",
    bias: 0.5,
  },
  {
    segment: () => "people starting after 40",
    short: () => "later starters",
    verb: (s) => `take up ${s}`,
    constraint: "without following advice written for twenty-year-olds",
    slant: "later in life",
    framework: "The Steady-Build Rule",
    bias: 0.4,
  },
  {
    segment: () => "people working to a deadline",
    short: () => "people on a deadline",
    verb: (s) => `get a visible result from ${s} in 30 days`,
    constraint: "without burning out in week two",
    slant: "on a deadline",
    framework: "The Thirty-Day Floor",
    bias: 0.8,
  },
];

const PALETTES: [string, string][] = [
  ["#6746e4", "#b06ff0"],
  ["#0f766e", "#22c58a"],
  ["#0369a1", "#38bdf8"],
  ["#b45309", "#f59e0b"],
  ["#be185d", "#fb7185"],
  ["#4338ca", "#818cf8"],
  ["#047857", "#34d399"],
  ["#7c3aed", "#c084fc"],
  ["#c2410c", "#fb923c"],
];

/**
 * The universal chapter set. Every synthesised niche gets these five moves,
 * written to hold up for any subject — the library seeds override them with
 * bespoke copy where we have it.
 */
function genericMoves(p: Parsed, v: SynthVoice): MoveKit[] {
  const { subject, audienceShort } = p;
  return [
    {
      title: `Start with the one input that actually changes ${v.metric}`,
      symptom: `Most people approach ${subject} by doing a little of everything, because everything looks equally important from the outside.`,
      cause: `Spreading effort evenly feels responsible, but it guarantees that nothing gets enough attention to produce a result you can see — and an invisible result is one you stop believing in.`,
      fix: `Identify the single input that produces most of the outcome and do that one thing consistently before adding anything else. For ${audienceShort}, that is almost always ${v.leadingInput}.`,
      checks: [
        `Can you name the one input you are prioritising this month?`,
        `Would dropping everything else still produce progress?`,
        `Is it measurable in a week, not a year?`,
        `Are you adding new things before the first one is consistent?`,
        `Could you explain the priority to someone else in a sentence?`,
      ],
      nuance: `The temptation is to add the second thing before the first is a habit. Resist it for a month. The people who get results with ${subject} are rarely doing more — they are doing less, for longer.`,
      caseName: "Ravi",
      caseStory: `Ravi tried to change six things about his approach to ${subject} at once and kept none of them past a fortnight. He picked one, ran it for six weeks without adding anything, and got further than the previous eight months combined. The other five became easy once the first was automatic.`,
      quote: `Doing three things badly is not three times the progress of doing one thing properly. It is usually none.`,
      callout: `One input. One month. Nothing added until it is automatic.`,
    },
    {
      title: `Build a week that survives a bad week`,
      symptom: `The plan works beautifully for nine days and then meets a genuinely busy week, and nothing about it survives contact.`,
      cause: `Most plans are designed for the version of you that made them — rested, motivated, and with a clear evening. That person shows up roughly twice a month.`,
      fix: `Design the schedule around your worst realistic week, not your best one. Three short ${v.unit}s that always happen beat five long ones that happen in good weeks only.`,
      checks: [
        `Could you do this plan during your busiest week of the year?`,
        `Is each session short enough to do tired?`,
        `Are the slots attached to something that already happens?`,
        `Is there a defined minimum version for a bad day?`,
        `Have you scheduled it, or just intended it?`,
      ],
      nuance: `A minimum version is not a failure state — it is the thing that keeps the streak intact so you do not have to restart. Restarting is where almost all the lost time goes.`,
      caseName: "Marta",
      caseStory: `Marta's plan required forty minutes, five days a week. She managed two full weeks, missed three days during a work crunch, and stopped for four months. Her second attempt was twelve minutes, three days a week, attached to an existing routine. Eleven months later she has never had to restart.`,
      quote: `The plan you can keep on your worst week is the only plan that has a year in it.`,
      callout: `Design for your worst week. A minimum version always exists.`,
    },
    {
      title: `Decide once, not every time`,
      symptom: `The same decisions get made from scratch every week — what to do, when, how much — and each one costs energy that should have gone into the work.`,
      cause: `Every open decision is a small negotiation with yourself, and you lose those negotiations at exactly the moments when consistency matters most.`,
      fix: `Write down the standing rules for the five situations that repeat in ${subject}. Not a philosophy — a reference you can point at instead of deliberating.`,
      checks: [
        `Do you know what happens when you miss a session?`,
        `Is there a rule for when to progress and when to hold?`,
        `Do you know what you do on a low-energy day?`,
        `Is there a default when you genuinely cannot decide?`,
        `Have you written these down, or are they in your head?`,
      ],
      nuance: `Include a rule for the miss. Most people who quit ${subject} do not quit after a bad result — they quit after two missed sessions with no plan for what happens next.`,
      caseName: "Ola",
      caseStory: `Ola wrote seven lines covering the seven situations she had already handled badly twice. It felt excessive when she wrote it. Four months later she was resolving in ten seconds what used to cost her an afternoon of deliberation, and the deliberation had been the part she disliked.`,
      quote: `A rule set on a calm Sunday is worth more than a perfect decision made on a hard Wednesday.`,
      callout: `If a decision has come up twice, it is not a decision. It is a missing rule.`,
    },
    {
      title: `Make the first result small enough to actually finish`,
      symptom: `The goal is set at the level of the transformation — the finished thing, the changed life — and nothing observable happens for months.`,
      cause: `Big goals give no feedback. Without feedback there is nothing to confirm the effort is working, and the effort stops being credible to you long before it stops being correct.`,
      fix: `Define a first result you can reach in two weeks and that someone else could verify. In ${subject}, that usually means ${v.firstResult}.`,
      checks: [
        `Is the first result reachable in two weeks?`,
        `Could someone else confirm you reached it?`,
        `Is it a result, not an activity?`,
        `Does reaching it teach you something about the next step?`,
        `Is there a date and a person attached?`,
      ],
      nuance: `Attach a person, not just a date. A deadline you set yourself has almost no force; someone expecting to see something on Friday has a great deal.`,
      caseName: "Ines",
      caseStory: `Ines set a twelve-month goal for ${subject} and made no visible progress for two months. She replaced it with a two-week result and told a friend she would show her the outcome on the 14th. She hit it, then hit five more in a row, and the twelve-month goal arrived early as a by-product.`,
      quote: `You do not need a bigger goal. You need a result close enough to believe in.`,
      callout: `A first result in two weeks. Observable. With a person attached to the date.`,
    },
    {
      title: `Recover from a setback without starting over`,
      symptom: `One bad stretch — ${v.setback} — and the whole approach gets abandoned and later rebuilt from nothing.`,
      cause: `Progress is lumpy, but it feels linear from the inside, so a single relapse reads as evidence that the method was wrong rather than that the week was hard.`,
      fix: `Treat the setback as information about one condition, not a verdict on the approach. Identify what broke, change that single condition, and leave everything else exactly as it was.`,
      checks: [
        `What was the specific trigger, in one sentence?`,
        `Was a rule missing, or was a rule broken?`,
        `Is exactly one thing changing as a result?`,
        `Are you resuming at the minimum version rather than the full one?`,
        `Has anything actually been lost, or does it just feel that way?`,
      ],
      nuance: `The urge to redesign everything peaks two days after a setback and its judgement is at its worst there. Wait a week before changing anything structural. The approach was usually fine.`,
      caseName: "Tobias",
      caseStory: `Tobias abandoned ${subject} three times in two years, each time after a fortnight off, and each time rebuilt a completely new system. The fourth time he simply resumed the minimum version on the following Monday and changed one condition. That attempt is still running.`,
      quote: `Missing two weeks costs two weeks. Rebuilding from scratch costs three months.`,
      callout: `One setback changes one condition. Never the whole approach.`,
    },
  ];
}

interface SynthVoice {
  metric: string;
  leadingInput: string;
  unit: string;
  firstResult: string;
  setback: string;
}

function synthVoice(p: Parsed): SynthVoice {
  return {
    metric: "the outcome",
    leadingInput: `consistent, short practice at the core skill of ${p.subject}`,
    unit: "session",
    firstResult: `one finished, visible piece of work you could show someone`,
    setback: `a fortnight where nothing happened`,
  };
}

/** Build a full seed for one angle on a typed topic. */
export function synthesizeSeed(
  topic: string,
  angleIndex: number,
  seed: number,
): NicheSeed {
  const p = parseTopic(topic);
  const angle = ANGLES[angleIndex % ANGLES.length];
  const rand = rng(seed + angleIndex * 7919);
  const v = synthVoice(p);

  const segment = angle.segment(p);
  const short = angle.short(p);
  const industry = industryFor(topic);

  const pick = (lo: number, hi: number) =>
    Math.round((lo + rand() * (hi - lo)) * 10) / 10;

  const metrics = {
    pain: Math.min(10, pick(5.5, 8.5) + angle.bias * 0.35),
    demand: Math.min(10, pick(5, 8) + angle.bias * 0.4),
    worsening: Math.min(10, pick(4, 8)),
    speed: Math.min(10, pick(5, 9)),
  };
  for (const k of Object.keys(metrics) as (keyof typeof metrics)[]) {
    metrics[k] = Math.round(metrics[k] * 10) / 10;
  }

  return {
    id: `${p.subject.replace(/\s+/g, "-").slice(0, 24)}-${angleIndex}`,
    industry,
    niche: `${p.subject} for ${short}`.slice(0, 46),
    headline: `Helping ${segment} ${angle.verb(p.subject)} ${angle.constraint}`,
    rationale: `${capitalise(segment)} are motivated but badly served: the available advice is written for somebody else's circumstances. This gives them a version of ${p.subject} that fits the constraints they actually have, and a result they can see inside a fortnight.`,
    specificKnowledge: `The creator should understand ${p.subject} well enough to know which parts genuinely matter for ${short}, what to cut, and where beginners predictably stall.`,
    problemSolved: `${capitalise(short)} start ${p.subject} with enthusiasm and stall within a month, because the advice they find assumes time, money, or a starting point they do not have. This removes the guesswork and gets them to a first visible result.`,
    metrics,
    frameworkName: angle.framework,
    premise: `Do less, on a schedule that survives a bad week, until the first result is undeniable.`,
    pillars: [
      "Pick one input and make it automatic.",
      "Design the week around your worst one.",
      "Reach a visible result inside a fortnight.",
    ],
    pillarWhy: [
      "if effort is spread evenly, nothing gets far enough to be visible",
      "if the plan only works in a good week, it will not survive the month",
      "if nothing observable happens, you will stop believing it is working",
    ],
    voice: {
      audience: segment,
      audienceShort: short,
      arena: p.subject,
      bigEvent: `deciding to take ${p.subject} seriously`,
      obviousPart: "the information",
      dailyPart: "the stretch where nothing feels like it is working",
      frictions: [
        "one missed week",
        "one piece of contradictory advice",
        "one comparison with somebody further along",
      ],
      unit: v.unit,
      channel: "your week",
      stakes: "the result you actually wanted",
      winCondition: "a fortnight where the plan simply happened",
      setback: v.setback,
    },
    palette: PALETTES[angleIndex % PALETTES.length],
    tags: words(topic).filter((w) => !STOPWORDS.has(w)),
    moves: genericMoves(p, v),
    close: {
      paras: [
        `${capitalise(p.subject)} does not fail for ${short} because the information is missing. It fails because the plan assumed a week they do not have and a result they could not see soon enough to believe in.`,
        `Fix both and the rest follows. One input, a schedule built for your worst week, and a first result close enough to reach — that is the entire method, and it is deliberately unimpressive.`,
      ],
      steps: [
        `Name the single input you will prioritise for the next month, and write it down.`,
        `Schedule three short ${v.unit}s attached to things that already happen in your week.`,
        `Define a result you can reach in fourteen days and tell one person the date.`,
      ],
    },
  };
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * The field of niches for one run. An open topic draws from the library; a
 * typed topic gets synthesised angles, with a library seed folded in when the
 * topic lands squarely on one we have written properly.
 */
export function buildField(topic: string, count: number): NicheSeed[] {
  const seed = hash(topic.trim().toLowerCase());
  const rand = rng(seed);

  if (isOpenTopic(topic)) {
    const pool = [...LIBRARY];
    // Deterministic shuffle, then take `count`. The winner is whichever seed
    // scores highest, which is a property of the library rather than the order.
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, Math.min(count, pool.length));
  }

  const matched = matchSeed(topic);
  const synthesized = Array.from({ length: count }, (_, i) =>
    synthesizeSeed(topic, i, seed),
  );

  if (!matched) return synthesized;

  // A matched seed is better written than anything we can synthesise, so it
  // goes in and takes the top of the field.
  const boosted: NicheSeed = {
    ...matched,
    metrics: { ...matched.metrics },
  };
  return [boosted, ...synthesized.slice(0, count - 1)];
}

export { scoreOf };
