import type { Metrics } from "@/lib/types";

/**
 * The niche library.
 *
 * Every seed carries two things: the scoring card shown during step 1, and the
 * `voice` + `moves` slots the writer needs to turn that card into a full
 * lead magnet in step 2. Keeping them together means a niche can never win the
 * scan and then have nothing to say.
 */

/** One numbered chapter of the lead magnet. */
export interface MoveKit {
  /** Section title, rendered uppercase: "Separate the message from the mood". */
  title: string;
  /** The failure mode the reader will recognise in themselves. */
  symptom: string;
  /** Why that failure mode happens — the mechanism, not the scolding. */
  cause: string;
  /** The correction, stated as an instruction. */
  fix: string;
  /** Short yes/no checks the reader can run before acting. */
  checks: string[];
  /** One more turn of the screw after the checklist. */
  nuance: string;
  /** A named, one-paragraph example. */
  caseName: string;
  caseStory: string;
  /** The line the example earns, set as a pull quote. */
  quote: string;
  /** The rule, set in the dark bar at the end of the section. */
  callout: string;
}

export interface Voice {
  /** "newly divorced parents" */
  audience: string;
  /** "parents" — used mid-sentence where the full phrase is clumsy. */
  audienceShort: string;
  /** "co-parenting" — the activity the product is about. */
  arena: string;
  /** "a divorce" — the event that created the pain. */
  bigEvent: string;
  /** "the paperwork" — what outsiders assume is the hard part. */
  obviousPart: string;
  /** "the daily contact" — what is actually hard. */
  dailyPart: string;
  /** Three small recurring frictions, used in the opening triplet. */
  frictions: [string, string, string];
  /** The atomic unit the reader produces: "message", "invoice", "set". */
  unit: string;
  /** Where the unit lives: "the shared calendar", "the bank account". */
  channel: string;
  /** What is actually at risk: "the child", "next month's rent". */
  stakes: string;
  /** What a good week looks like. */
  winCondition: string;
  /** The predictable relapse. */
  setback: string;
}

export interface NicheSeed {
  id: string;
  industry: string;
  niche: string;
  headline: string;
  rationale: string;
  specificKnowledge: string;
  problemSolved: string;
  metrics: Metrics;
  frameworkName: string;
  premise: string;
  pillars: [string, string, string];
  /** Why the pillar order matters — one clause each, read as a sentence. */
  pillarWhy: [string, string, string];
  voice: Voice;
  moves: MoveKit[];
  close: { paras: [string, string]; steps: [string, string, string] };
  /** Cover gradient. */
  palette: [string, string];
  /** Words that route a typed topic to this seed. */
  tags: string[];
}

/**
 * Opportunity score. Pain carries the most weight because a product nobody
 * hurts for does not sell; speed carries the least because a slow-to-deliver
 * result is a scheduling problem, not a demand problem.
 */
export function scoreOf(m: Metrics): number {
  const raw = (3 * m.pain + 2 * m.demand + 2 * m.worsening + m.speed) / 8;
  return Math.round(raw * 10) / 10;
}

export const NICHE_LIBRARY: NicheSeed[] = [
  {
    id: "post-divorce-co-parenting",
    industry: "Relationships",
    niche: "post-divorce co-parenting",
    headline:
      "Helping newly divorced parents co-parent peacefully without constant conflict",
    rationale:
      "Separated parents are locked into weekly contact with the one person they least want to negotiate with. Every handover is a chance for an old argument to restart, and the cost lands on the child.",
    specificKnowledge:
      "The creator should understand co-parenting communication, boundary setting, conflict de-escalation, and family transition dynamics.",
    problemSolved:
      "After divorce, every pickup, schedule change, or message can reopen tension and drain emotional energy. This helps parents reduce friction, protect children from conflict, and regain a sense of stability.",
    metrics: { pain: 10, demand: 8, worsening: 9, speed: 5 },
    frameworkName: "The Three-Guardrail Rule",
    premise: "Protect the child, protect the schedule, protect the tone, in that order.",
    pillars: ["Protect the child.", "Protect the schedule.", "Protect the tone."],
    pillarWhy: [
      "If the child is pulled into adult disputes, the damage reaches far beyond one exchange",
      "if the schedule becomes negotiable every week, resentment grows",
      "if the tone collapses, the child feels it",
    ],
    voice: {
      audience: "newly divorced parents",
      audienceShort: "parents",
      arena: "co-parenting",
      bigEvent: "a divorce",
      obviousPart: "the paperwork",
      dailyPart: "the daily contact",
      frictions: ["one late reply", "one sharp pickup", "one changed weekend"],
      unit: "message",
      channel: "the shared calendar",
      stakes: "the child",
      winCondition: "a week that runs without a single argument",
      setback: "a blown handover",
    },
    palette: ["#6746e4", "#b06ff0"],
    tags: ["divorce", "co-parent", "custody", "separation", "family", "ex"],
    moves: [
      {
        title: "Separate the message from the mood",
        symptom:
          "A common friction point is treating every message as a personal statement. A text about school pickup starts to feel like a comment on character, respect, or loyalty.",
        cause:
          "That happens because divorce leaves both people alert for disrespect, and even ordinary messages arrive already loaded.",
        fix: "The fix is to write for the job, not for the hurt. If the message is about logistics, keep it there. If the message contains blame, trim it before sending. The point is not to sound cold. The point is to keep a practical channel usable.",
        checks: [
          "Does this message ask for one concrete action?",
          "Does it avoid words that invite a reply to the past?",
          "Would a school secretary understand it on first read?",
          "If I am angry, can it wait 20 minutes?",
          "Is there a clear date, time, and next step?",
        ],
        nuance:
          "Resist the urge to add explanation to prove fairness. Long explanations usually create more room for argument, not less. Short messages lower the temperature because they leave less to contest.",
        caseName: "Dana",
        caseStory:
          "Dana, a nurse with two kids, used to add a full explanation every time she changed a Friday handoff. Her ex replied with three more paragraphs, and the whole exchange would unravel before breakfast. She cut her messages to two lines: the change and the new time. The arguments did not stop overnight, but they stopped starting in the calendar.",
        quote:
          "Short is not cold. Short is what keeps a schedule change from becoming a court case.",
        callout:
          "Every message needs three things: Action, Place, Tone. If any one is missing, rewrite.",
      },
      {
        title: "Build a handover that cannot be misread",
        symptom:
          "Most conflict does not happen in the argument. It happens in the ten minutes around the doorstep, where two adults are tired and the child is watching.",
        cause:
          "An unstructured handover forces both parents to improvise in the exact moment they have the least patience available.",
        fix: "Give the handover a fixed shape and stop negotiating it. Same place, same window, same short script, same bag. When the routine is decided in advance, nobody has to win it in the moment.",
        checks: [
          "Is the location fixed for the next three months?",
          "Is there a 10-minute window rather than an exact minute?",
          "Does the child know what happens next?",
          "Is the bag packed before the car moves?",
          "Is there a single sentence you both say at the door?",
        ],
        nuance:
          "The routine matters more than its details. A slightly inconvenient handover that never changes beats a perfect one that gets renegotiated every fortnight.",
        caseName: "Marcus",
        caseStory:
          "Marcus and his ex-wife moved handovers from her driveway to the library car park and fixed the window at 5:30 to 5:40 on Fridays. The change removed the doorstep entirely. Nine months later he described the difference in one line: nothing to argue about because nothing was undecided.",
        quote:
          "You are not trying to agree on everything. You are trying to remove the moments where agreement is required.",
        callout:
          "Decide the handover once, in writing, when you are both calm. Then stop reopening it.",
      },
      {
        title: "Decide once, not every week",
        symptom:
          "Recurring decisions are where goodwill goes to die. Holidays, birthdays, sick days, and late finishes each get relitigated as if they had never come up before.",
        cause:
          "Without a standing rule, every calendar event becomes a fresh negotiation, and every negotiation is an opening for the old fight.",
        fix: "Write a one-page standing agreement covering the ten situations that repeat. Not a legal document — a shared reference you can point at instead of arguing.",
        checks: [
          "Who has the child on their own birthday?",
          "What happens when a child is too sick for school?",
          "What is the notice period for a schedule change?",
          "Who pays for something the other did not agree to?",
          "What is the default if neither of you replies in 48 hours?",
        ],
        nuance:
          "Include a default for silence. Most escalation starts when one parent reads a non-reply as contempt rather than as a busy Tuesday.",
        caseName: "Priya",
        caseStory:
          "Priya's standing page was eleven lines long and covered the arguments she had already had twice. The first month it felt bureaucratic. By the third month, she was replying to disputes with a screenshot of line four and nothing else, and the disputes ended there.",
        quote:
          "A rule you both agreed to in a calm week is worth more than a perfect argument in a bad one.",
        callout:
          "If a disagreement has happened twice, it is not an event. It is a missing rule.",
      },
      {
        title: "Keep the child out of the middle",
        symptom:
          "Children become messengers, negotiators, and sources of information without either parent deciding that should happen.",
        cause:
          "It is efficient in the short term. Asking a seven-year-old what happened at the other house is faster than asking the other adult, and far more expensive later.",
        fix: "Route every adult matter through the adult channel, even when it is slower. The child reports on their own life, never on the other household.",
        checks: [
          "Am I asking this because I need it, or because I want to know?",
          "Could this question be sent to the other parent instead?",
          "Would I be comfortable if my child repeated it back?",
          "Am I asking the child to carry a message?",
          "Does my reaction teach them that honesty is unsafe?",
        ],
        nuance:
          "Children read tone long before they understand content. A neutral question asked with a tight jaw is not a neutral question.",
        caseName: "Tom",
        caseStory:
          "Tom noticed his daughter had started pre-editing her weekends, describing them as boring no matter what happened, because she had learnt that enthusiasm about her mother's house changed the mood in his car. He stopped asking entirely and started saying one line instead: I am glad you had a good time. Within a month she was volunteering the stories again.",
        quote:
          "A child who has to manage your feelings about the other parent is doing a job no child should have.",
        callout:
          "The child reports on their day. Never on the other household.",
      },
      {
        title: "Recover from a bad week without restarting",
        symptom:
          "One blown handover convinces both parents that the whole arrangement has failed, and the temporary structure gets abandoned.",
        cause:
          "Progress in a high-conflict relationship is not linear, but it feels linear from the inside, so a single relapse reads as proof that nothing has changed.",
        fix: "Treat a bad week as data, not verdict. Note what broke, repair the one condition that caused it, and keep everything else exactly as it was.",
        checks: [
          "What was the specific trigger, in one sentence?",
          "Was it a rule that was missing, or a rule that was broken?",
          "Did the child see it?",
          "What single condition would have prevented it?",
          "Is anything else worth changing this week? (Usually no.)",
        ],
        nuance:
          "Change one condition at a time. Rewriting the whole arrangement after a bad Friday guarantees another bad Friday, because now nothing is settled again.",
        caseName: "Elena",
        caseStory:
          "After a shouting match in a supermarket car park, Elena wanted to renegotiate the entire schedule. Instead she changed one thing: handovers moved from public places to the school gate at the end of the day, where a third party was always present. That was the only edit she made all year.",
        quote:
          "The goal is not a relationship without conflict. It is a structure that survives it.",
        callout:
          "One bad week changes one condition. Never the whole arrangement.",
      },
    ],
    close: {
      paras: [
        "Peaceful co-parenting is not a feeling that arrives once the anger fades. It is a set of boundaries that keep ordinary life from turning into a new battlefield, built while the anger is still there.",
        "You will not get agreement on the past, and you do not need it. What you need is a week that runs on rules you both already accepted, so the child experiences two homes instead of one long negotiation.",
      ],
      steps: [
        "Write your standing page this week — ten lines, the ten arguments you have already had.",
        "Fix the handover: one place, one window, one sentence at the door.",
        "Cut your next five messages to two lines each and send them anyway.",
      ],
    },
  },
  {
    id: "freelance-cash-flow",
    industry: "Personal Finance",
    niche: "freelance cash flow",
    headline:
      "Helping freelancers smooth irregular income without cutting essential expenses",
    rationale:
      "Freelancers often earn enough across a year but still feel broke in low-income months. This helps them stabilize bills, reduce panic, and make income swings feel manageable.",
    specificKnowledge:
      "The creator should understand variable-income budgeting, invoicing and collections behaviour, tax set-asides, and the psychology of a bad month.",
    problemSolved:
      "A good year made of terrifying months. Money arrives in bursts while rent arrives monthly, so freelancers live in a state of low-grade financial panic that no amount of extra work fixes.",
    metrics: { pain: 8, demand: 6, worsening: 9.2, speed: 8 },
    frameworkName: "The Two-Account Floor",
    premise: "Pay yourself a flat monthly wage, and let the buffer absorb the swings.",
    pillars: [
      "Separate the money that arrives from the money you spend.",
      "Fix your monthly wage below your worst quarter.",
      "Refill the buffer before you upgrade anything.",
    ],
    pillarWhy: [
      "if income and spending share one account, every good week feels like permission",
      "if the wage is set from a good month, every bad month becomes an emergency",
      "if the buffer never refills, the next quiet month restarts the panic",
    ],
    voice: {
      audience: "freelancers and contractors",
      audienceShort: "freelancers",
      arena: "cash flow",
      bigEvent: "going self-employed",
      obviousPart: "finding the work",
      dailyPart: "the gap between invoice and payment",
      frictions: ["one late payer", "one quiet fortnight", "one surprise tax bill"],
      unit: "invoice",
      channel: "the business account",
      stakes: "next month's rent",
      winCondition: "a quiet month that feels ordinary",
      setback: "a client who pays 60 days late",
    },
    palette: ["#0f766e", "#22c58a"],
    tags: ["freelance", "money", "income", "invoice", "budget", "cash", "self-employed"],
    moves: [
      {
        title: "Separate the money that arrives from the money you spend",
        symptom:
          "One account holds client payments, tax owed, and grocery money at the same time, so the balance never means anything.",
        cause:
          "A single number cannot answer two different questions. Looking at £9,000 tells you nothing about whether you can afford a £900 repair.",
        fix: "Split into a receiving account and a spending account. Everything lands in the first. A fixed transfer moves your wage into the second on the same date each month. You only ever spend from the second.",
        checks: [
          "Does every client payment land in one account you do not spend from?",
          "Is your wage a fixed number and a fixed date?",
          "Is tax moved out the day money arrives, not in January?",
          "Can you say your monthly wage from memory?",
          "Is the spending account the only card in your wallet?",
        ],
        nuance:
          "The transfer date matters more than the amount. A wage that arrives on the 1st turns a variable income into a salary you can plan against.",
        caseName: "Sam",
        caseStory:
          "Sam, a motion designer, billed between £2,000 and £14,000 a month and felt broke in both cases. He set a wage of £3,200 on the 1st and left everything else in the receiving account. The first big month, he watched £11,000 sit untouched. It was the first time in four years he had known what he could actually spend.",
        quote:
          "You do not have an income problem. You have a single-account problem.",
        callout:
          "One account receives. One account spends. Tax leaves on arrival, not at year end.",
      },
      {
        title: "Set the wage below your worst quarter",
        symptom:
          "The monthly wage gets set from a good month, so three quiet months in a row turn into an emergency that was entirely predictable.",
        cause:
          "Good months feel like the new normal. They are not — they are the top of a range, and a range has a bottom.",
        fix: "Take your worst three consecutive months from the last two years, divide by three, and set your wage at or below that number. Live on it for one full quarter before raising it.",
        checks: [
          "Do you know your worst three-month total from memory?",
          "Is your wage below that monthly average?",
          "Have you held it for a full quarter without a raise?",
          "Does the wage cover fixed costs plus food with room to spare?",
          "Is there a written rule for when the wage goes up?",
        ],
        nuance:
          "A low wage is not austerity. The surplus is still yours — it is sitting in the receiving account doing the job it should have been doing all along.",
        caseName: "Nadia",
        caseStory:
          "Nadia's worst quarter had been £6,900 across three months. She set her wage at £2,200 against an average month of £5,400 and felt ridiculous doing it. Fourteen months later she had eight months of buffer and had turned down two projects she would previously have taken out of fear.",
        quote:
          "The point of a low wage is not to spend less. It is to make a bad month boring.",
        callout:
          "Set the wage from your worst quarter, not your best month. Review it once a year.",
      },
      {
        title: "Decide the buffer once, not every quiet week",
        symptom:
          "Without a target, the buffer is whatever is left, which means it is spent the moment something feels urgent.",
        cause:
          "An unnamed pile of money has no defence. A pile with a job and a number does.",
        fix: "Name three buffers with fixed targets: tax, float, and runway. Fill them in that order and do not skip. Nothing gets upgraded until all three are full.",
        checks: [
          "Is your tax percentage set and automatic?",
          "Does the float cover one month of fixed costs?",
          "Does runway cover six months of your wage?",
          "Is there a written rule for what may be taken from each?",
          "Does a good month refill before it rewards?",
        ],
        nuance:
          "Runway is not savings. It is the thing that lets you say no to bad clients, which is where most of the income improvement actually comes from.",
        caseName: "Joel",
        caseStory:
          "Joel filled his tax buffer first, then a one-month float, and stopped there for eight months because every good quarter got spent on gear. The year he finished the runway buffer, he dropped his two worst-paying clients in the same week and his income went up.",
        quote:
          "Runway does not just protect you from bad months. It protects you from bad clients.",
        callout:
          "Tax, then float, then runway. Refill before you upgrade — every time.",
      },
      {
        title: "Make getting paid a system, not a favour",
        symptom:
          "Invoices go out late, chase emails feel rude, and a 60-day payer quietly funds their business with your rent.",
        cause:
          "Freelancers treat collections as a relationship risk. It is not — it is an administrative step the client's finance team is already expecting.",
        fix: "Invoice on the same day every week. Send the same three chase messages on a fixed timetable. Remove the decision, and you remove the discomfort.",
        checks: [
          "Do invoices go out on a fixed day, not when you remember?",
          "Do your terms say 14 days rather than 30?",
          "Is chase one scheduled for day 15, before it is a problem?",
          "Do you know the name and email of the person who actually pays?",
          "Does your contract carry a late-payment clause you would use?",
        ],
        nuance:
          "Get the finance contact at kick-off, not at day 45. Most late payments are not refusals — they are an invoice sitting in the wrong inbox.",
        caseName: "Ruth",
        caseStory:
          "Ruth moved invoicing to every Friday at 4pm and set three automatic reminders at days 15, 22, and 30. She changed nothing about her clients or her rates. Her average days-to-payment dropped from 41 to 19, which was worth more than the rate rise she had been too nervous to ask for.",
        quote:
          "Nobody has ever fired a freelancer for sending a polite reminder on a schedule.",
        callout:
          "Fixed invoice day. Fixed chase days. Never a decision made in the moment.",
      },
      {
        title: "Survive a bad quarter without dismantling the system",
        symptom:
          "Three quiet months arrive and the whole structure gets abandoned: the wage goes up to cover a gap, the tax account gets raided, and the buffer disappears.",
        cause:
          "The system is judged on the quarter it was built to survive, which is exactly backwards.",
        fix: "A bad quarter uses the buffer. That is what it is for. Do not raise the wage, do not touch tax, and do not add a new rule until income has recovered for two consecutive months.",
        checks: [
          "Is the buffer being used as designed, or raided in panic?",
          "Has the wage stayed flat?",
          "Is the tax account untouched?",
          "Is the response to the shortfall work, or spending changes?",
          "What is the one thing you will change after it recovers?",
        ],
        nuance:
          "A bad quarter with a full buffer is an inconvenience. The same quarter with no buffer is a career change. The difference was decided a year earlier.",
        caseName: "Ana",
        caseStory:
          "Ana lost her two largest clients in the same month. She kept her wage at £2,800, spent four months of runway, and did not take the first badly-priced project that appeared. By month five she had replaced both clients at higher rates, which she could not have done from a position of needing the money that week.",
        quote:
          "The buffer is not there to make you feel rich. It is there to stop you signing something bad.",
        callout:
          "A bad quarter spends the buffer. It never rewrites the rules.",
      },
    ],
    close: {
      paras: [
        "Irregular income is not the problem. Irregular spending against irregular income is the problem, and it is fixable in an afternoon with two accounts and one number.",
        "The result is not more money. It is the same money arriving in a shape you can plan against, which is what people actually mean when they say they want financial stability.",
      ],
      steps: [
        "Open the second account today and move everything that arrives into it.",
        "Calculate your worst three-month total and set your wage below its average.",
        "Put invoice day and three chase dates in your calendar as recurring events.",
      ],
    },
  },
  {
    id: "desk-worker-back-pain",
    industry: "Health",
    niche: "desk worker back pain",
    headline:
      "Helping desk workers reduce daily back pain without expensive clinic visits",
    rationale:
      "Office workers live with constant stiffness that drains focus and energy, yet many delay action because treatment feels costly or confusing. This offers relief habits they can apply quickly and feel within a week.",
    specificKnowledge:
      "The creator should understand postural load, movement frequency, desk setup, and how to give safe general guidance without diagnosing.",
    problemSolved:
      "Eight hours of stillness a day produces an ache that no single stretch fixes, and the advice available is either a £70 appointment or a stretch video that helps for an hour.",
    metrics: { pain: 7, demand: 5, worsening: 7.2, speed: 9 },
    frameworkName: "The Movement Debt Rule",
    premise: "Frequency beats intensity: small movement, often, beats a long session, later.",
    pillars: [
      "Break the stillness before it accumulates.",
      "Fix the setup once so the default posture costs less.",
      "Load the muscles that hold you up, twice a week.",
    ],
    pillarWhy: [
      "if stillness accumulates all day, no evening stretch clears it",
      "if the setup is wrong, you are fighting your desk every hour",
      "if nothing gets stronger, the ache always comes back",
    ],
    voice: {
      audience: "desk workers",
      audienceShort: "office workers",
      arena: "daily back pain",
      bigEvent: "a decade at a desk",
      obviousPart: "the chair",
      dailyPart: "the six hours you do not move",
      frictions: ["one long meeting", "one skipped walk", "one late deadline"],
      unit: "break",
      channel: "your calendar",
      stakes: "your afternoon focus",
      winCondition: "a Thursday afternoon that does not ache",
      setback: "a week of back-to-back meetings",
    },
    palette: ["#0369a1", "#38bdf8"],
    tags: ["back pain", "posture", "desk", "office", "stretching", "health", "sitting"],
    moves: [
      {
        title: "Break the stillness before it accumulates",
        symptom:
          "The ache is blamed on posture, but posture is rarely the problem. Duration is. Any position held for three hours hurts.",
        cause:
          "Tissue tolerates load far better than it tolerates stillness. Six hours of not moving builds a debt that one evening stretch cannot repay.",
        fix: "Move for sixty seconds every thirty minutes. Not a routine, not a mat — stand, walk to the window, roll the shoulders, sit back down. Frequency is the whole intervention.",
        checks: [
          "Have you moved in the last thirty minutes?",
          "Is the reminder external, not a plan to remember?",
          "Does one break require zero equipment?",
          "Can it be done in view of colleagues without embarrassment?",
          "Does a long meeting have a standing option?",
        ],
        nuance:
          "The best movement is the one that survives a busy day. A perfect ten-minute routine that gets skipped on deadline weeks is worth less than sixty seconds that never gets skipped.",
        caseName: "Chris",
        caseStory:
          "Chris had a twenty-minute mobility routine he did roughly twice a month. He replaced it with a recurring calendar chime and sixty seconds of standing. Within nine days the 3pm ache he had assumed was permanent was gone on most days, and he never did the twenty-minute routine again.",
        quote:
          "Your back is not weak. It has been holding one shape since nine o'clock.",
        callout:
          "Sixty seconds every thirty minutes. Set the reminder outside your own memory.",
      },
      {
        title: "Fix the setup once so the default costs less",
        symptom:
          "Screen too low, chair too far back, mouse too far right — every hour spent fighting the desk is an hour of avoidable load.",
        cause:
          "The setup was arranged once, on the first day, by someone who was not thinking about it, and never revisited.",
        fix: "Spend twenty minutes on four adjustments: screen top at eye level, elbows at ninety, feet flat, mouse within the same arc as the keyboard. Then stop optimising.",
        checks: [
          "Is the top of the screen level with your eyes?",
          "Are your forearms roughly parallel to the floor?",
          "Are both feet flat, or is one leg tucked under you?",
          "Is the mouse close enough that your shoulder stays down?",
          "Is the laptop raised, with a separate keyboard?",
        ],
        nuance:
          "You do not need an expensive chair. You need a chair at the right height and a screen that stops you craning. Most of the benefit is in the first twenty pounds you spend.",
        caseName: "Meera",
        caseStory:
          "Meera worked from a laptop on a kitchen table for two years and had been researching £900 chairs. She bought a £22 laptop stand and a £30 keyboard instead. The neck ache she had been budgeting a chair for stopped inside a fortnight.",
        quote:
          "You are not buying comfort. You are lowering the cost of the position you hold all day.",
        callout:
          "Eyes level. Elbows ninety. Feet flat. Mouse close. Then stop shopping.",
      },
      {
        title: "Decide the two sessions once, not every week",
        symptom:
          "Strength work gets planned every week and done every third week, because it depends on how the week goes.",
        cause:
          "Anything that requires a fresh decision on a busy Wednesday loses to the busy Wednesday.",
        fix: "Pick two fixed slots a week and five movements you will not change for eight weeks. Hinge, squat, push, pull, carry. Twenty minutes. Same days.",
        checks: [
          "Are both sessions in the calendar as recurring events?",
          "Are they short enough to do tired?",
          "Do they cover a hinge and a carry?",
          "Is the plan the same for all eight weeks?",
          "Is there a lower-effort version for a bad day?",
        ],
        nuance:
          "A back that aches at rest usually needs more capacity, not more stretching. Stretching manages the symptom; loading changes what the symptom responds to.",
        caseName: "Adeel",
        caseStory:
          "Adeel had stretched every morning for three years and still ached by lunch. He added two twenty-minute sessions on Tuesdays and Saturdays — five movements, no variation. He kept the stretching, but by week six it had stopped being the thing that made a difference.",
        quote:
          "Stretching buys you an hour. Strength changes what your afternoon costs.",
        callout:
          "Two fixed sessions. Five movements. Eight weeks without changing the plan.",
      },
      {
        title: "Protect the meeting hours",
        symptom:
          "The good habits survive a normal day and collapse entirely in a week of back-to-back calls, which is exactly the week the ache is worst.",
        cause:
          "Meeting blocks remove every natural break, so the one day you most need movement is the day it is hardest to take.",
        fix: "Make movement part of the meeting rather than a competitor to it. Audio-only calls are walked. Every meeting ends five minutes early by default. The first minute of the next one is standing.",
        checks: [
          "Do your meetings default to 25 and 50 minutes?",
          "Is at least one recurring call walkable?",
          "Do you stand for the first minute of every call?",
          "Is there a hard break after two consecutive hours?",
          "Does your calendar block a real lunch?",
        ],
        nuance:
          "You will not win this by willpower on the day. Change the default length of the meeting once, and every future week inherits the fix.",
        caseName: "Sofia",
        caseStory:
          "Sofia switched her calendar default to 25 and 50 minutes and took her Monday one-to-ones as walking calls. She reclaimed roughly forty minutes of movement a week without adding a single item to her to-do list, and her worst pain day moved from Thursday to nowhere in particular.",
        quote:
          "The fix is not more discipline on a bad week. It is a default that already assumed the bad week.",
        callout:
          "Change the meeting default once. Every future week inherits the break.",
      },
      {
        title: "Handle a flare-up without abandoning everything",
        symptom:
          "One bad flare and the habits stop entirely: no movement, no sessions, and a week on the sofa waiting for it to pass.",
        cause:
          "A flare feels like proof that movement caused harm, so the instinct is total rest — which reliably makes the next week worse.",
        fix: "Reduce, do not stop. Halve the load, keep the frequency, and keep walking. Only see a clinician if you have red flags or if it is not improving after two weeks.",
        checks: [
          "Any numbness, weakness, or bladder change? (See someone today.)",
          "Can you keep walking, even shorter distances?",
          "Have you halved the load rather than stopped?",
          "Is the frequency of small breaks unchanged?",
          "Is it trending better across a week, not an hour?",
        ],
        nuance:
          "This is general guidance, not diagnosis. Sudden severe pain after an injury, numbness down a leg, or unexplained weight loss are reasons to see a professional, not a reason to try harder.",
        caseName: "Dan",
        caseStory:
          "Dan's flare-ups used to cost him three weeks each: one on the sofa, two rebuilding. He started halving his sessions instead of cancelling them and kept the sixty-second breaks throughout. His last flare cost him four days and he never fully stopped moving.",
        quote:
          "Rest is a dose, not a destination. Two days helps. Two weeks costs you a month.",
        callout:
          "Reduce the load, keep the frequency. Red flags go to a clinician, not a checklist.",
      },
    ],
    close: {
      paras: [
        "Almost nobody with desk-related back pain needs a new chair, a diagnosis, or a specialist. They need to stop holding one shape for six hours and to be slightly stronger than the job requires.",
        "None of this is dramatic, which is exactly why it works. The interventions are small enough to survive a bad week, and a bad week is where every previous attempt died.",
      ],
      steps: [
        "Set a recurring reminder for sixty seconds of movement every thirty minutes.",
        "Spend twenty minutes today on screen height, elbow angle, feet, and mouse position.",
        "Book two twenty-minute sessions a week into the calendar for the next eight weeks.",
      ],
    },
  },
  {
    id: "job-interview-confidence",
    industry: "Career",
    niche: "job interview confidence",
    headline:
      "Helping mid-career professionals interview with confidence without sounding rehearsed",
    rationale:
      "Capable professionals lose opportunities because they ramble, undersell themselves, or freeze under pressure. This helps them present clearly, improve responses, and perform better in upcoming interviews.",
    specificKnowledge:
      "The creator should understand hiring-panel behaviour, structured answers, evidence selection, and how competence gets misread as arrogance or timidity.",
    problemSolved:
      "The gap between being good at the job and being good at describing the job. Strong candidates lose to weaker ones who tell a cleaner story.",
    metrics: { pain: 8, demand: 7, worsening: 6.2, speed: 8 },
    frameworkName: "The Evidence-First Answer",
    premise: "Lead with the decision you made, not the context you were in.",
    pillars: [
      "Answer the question in the first sentence.",
      "Support it with one specific piece of evidence.",
      "Stop talking before you talk yourself out of it.",
    ],
    pillarWhy: [
      "if the answer arrives in sentence nine, the panel has stopped listening",
      "if the evidence is generic, it proves nothing about you",
      "if you keep going, you will undo the point you already made",
    ],
    voice: {
      audience: "mid-career professionals",
      audienceShort: "candidates",
      arena: "interviewing",
      bigEvent: "a job search after eight years in one place",
      obviousPart: "the CV",
      dailyPart: "the forty minutes in the room",
      frictions: ["one rambling answer", "one underclaimed result", "one blank moment"],
      unit: "answer",
      channel: "the panel's notes",
      stakes: "an offer you actually wanted",
      winCondition: "walking out knowing exactly what you said",
      setback: "a question you did not see coming",
    },
    palette: ["#b45309", "#f59e0b"],
    tags: ["interview", "career", "job", "hiring", "resume", "cv", "promotion"],
    moves: [
      {
        title: "Answer the question in the first sentence",
        symptom:
          "The answer starts with three minutes of setup — the team, the reorg, the previous manager — and the actual point arrives after the panel has stopped writing.",
        cause:
          "Context feels like fairness. It is how you would explain it to a colleague. A panel is not a colleague; they are scoring against a rubric with a stopwatch running.",
        fix: "Say what you did in sentence one. Then the situation, then the result. If they want more context, they will ask for it — and the question they ask tells you what they actually care about.",
        checks: [
          "Does sentence one contain a verb you performed?",
          "Could someone score the answer from the first fifteen seconds?",
          "Is the context under two sentences?",
          "Is there exactly one result, with a number?",
          "Are you finished inside ninety seconds?",
        ],
        nuance:
          "Leading with the answer feels abrupt from the inside and reads as clarity from the outside. Nobody has ever left an interview thinking that candidate was too easy to follow.",
        caseName: "Priyanka",
        caseStory:
          "Priyanka, a programme manager with eleven years of experience, had lost three final rounds. Watching a recording of a mock interview she found her average answer ran four minutes and put the decision she had made in the last twenty seconds. She reversed the order and nothing else. She took the next offer she interviewed for.",
        quote:
          "The panel is not deciding whether you did the work. They are deciding whether they can repeat your story to someone else.",
        callout:
          "Decision first. Context second. Result third. Ninety seconds total.",
      },
      {
        title: "Build a story bank that cannot be misremembered",
        symptom:
          "Under pressure the same two stories get used for every question, and neither of them quite fits.",
        cause:
          "Recall collapses under stress. Without prepared material you default to the most recent thing, not the most relevant.",
        fix: "Write eight stories, each in five lines: situation, your decision, what you did, the number, and what you would change. Eight covers almost any behavioural question asked in any industry.",
        checks: [
          "Do you have a failure story you can tell without defending yourself?",
          "Do you have a conflict story where you were partly wrong?",
          "Does each story carry one number?",
          "Can you tell any of them in under ninety seconds?",
          "Is at least one from the last twelve months?",
        ],
        nuance:
          "Prepare stories, not answers. Memorised answers sound memorised; a well-known story told fresh sounds like a person who has done the work.",
        caseName: "Ben",
        caseStory:
          "Ben wrote eight stories on one page and read them once before each interview. He never used more than five in a single round, but the panel could not tell which ones were prepared, because he was recalling events rather than reciting sentences.",
        quote:
          "You are not memorising answers. You are making sure the right memory is within reach when your pulse is at 110.",
        callout:
          "Eight stories. Five lines each. One number per story.",
      },
      {
        title: "Decide your number once, not in the room",
        symptom:
          "The salary question arrives, and a figure gets invented on the spot — usually lower than intended, usually with an apology attached.",
        cause:
          "Negotiation under surprise favours the party who prepared, and that is never the candidate who has been thinking about competency questions all week.",
        fix: "Set three numbers before the first call: your walk-away, your target, and your ask. Say the ask, say nothing else, and let the silence do its work.",
        checks: [
          "Do you have all three numbers written down?",
          "Is your ask above your target?",
          "Can you say it in one sentence without hedging?",
          "Do you know your walk-away and why?",
          "Have you rehearsed staying quiet after saying it?",
        ],
        nuance:
          "The most common salary mistake is not asking too little. It is explaining the number after saying it, which invites negotiation against yourself.",
        caseName: "Laura",
        caseStory:
          "Laura had a target of £78,000 and an ask of £86,000. She said the ask in five words and then said nothing for eleven seconds, which felt like a minute. The recruiter came back at £82,000. She had never previously left a silence unfilled.",
        quote:
          "Say the number. Then stop. The next person to speak is negotiating against themselves.",
        callout:
          "Walk-away, target, ask — written down before the first call, never invented in the room.",
      },
      {
        title: "Handle the question you did not prepare for",
        symptom:
          "One unexpected question, one blank moment, and the rest of the interview is spent recovering rather than performing.",
        cause:
          "The panic is not about the question. It is about the silence, which feels ten times longer to you than to them.",
        fix: "Buy time out loud and structure it. Repeat the question, name your approach, then answer. Three seconds of visible thinking reads as considered; three seconds of frozen silence reads as caught out.",
        checks: [
          "Can you repeat the question back in your own words?",
          "Do you have a stock phrase for buying five seconds?",
          "Are you allowed to say you do not know, then say what you would do?",
          "Do you move on rather than re-answer a weak response?",
          "Have you practised recovering mid-answer?",
        ],
        nuance:
          "I do not know, but here is how I would find out is a strong answer at mid-career level. Bluffing is the only version of this that loses offers.",
        caseName: "Marek",
        caseStory:
          "Marek was asked a technical question two levels outside his domain. He said he had not worked on it, named the two people he would ask and what he would want to know from them, and moved on in forty seconds. The hiring manager cited that answer as the reason he was offered the role.",
        quote:
          "Panels are not testing whether you know everything. They are testing what you do when you do not.",
        callout:
          "Repeat the question. Name your approach. Answer. Never bluff.",
      },
      {
        title: "Debrief a rejection without rewriting your whole approach",
        symptom:
          "One rejection and the CV gets rebuilt, the stories get scrapped, and the next interview is prepared from scratch.",
        cause:
          "Rejection carries almost no signal on its own. There were four candidates and one job, and you will never hear the real reason.",
        fix: "Write three lines within an hour of finishing: what went well, the one answer you would change, and what you will do differently next time. One change per interview, not a rebuild.",
        checks: [
          "Did you write the debrief within the hour, while it is accurate?",
          "Is exactly one thing changing before the next round?",
          "Are you distinguishing a bad answer from a bad fit?",
          "Did you ask for feedback in writing?",
          "Are the eight stories still intact?",
        ],
        nuance:
          "Three rejections in a row at final stage is signal. One is noise, and treating noise as signal is how good candidates talk themselves into a worse story.",
        caseName: "Yusuf",
        caseStory:
          "Yusuf's rule was one change per interview. After his fourth rejection he had changed four things — none of them his CV, which he had been about to rewrite entirely after the first. The fifth interview was an offer, and the thing that fixed it was answer length.",
        quote:
          "One rejection is noise. Three at final stage is a pattern. Do not rebuild for noise.",
        callout:
          "One debrief. One change. Never a rebuild after a single no.",
      },
    ],
    close: {
      paras: [
        "Interviewing badly is not a character flaw and it is not a confidence problem in the way people usually mean. It is a structure problem: the right material, in the wrong order, at the wrong length.",
        "Fix the order and the length and the confidence follows, because confidence in an interview is mostly the experience of hearing yourself say something clear.",
      ],
      steps: [
        "Write your eight stories on one page, five lines each, this week.",
        "Record yourself answering three questions and time them. Cut everything over ninety seconds.",
        "Write your walk-away, target, and ask before your next first call.",
      ],
    },
  },
  {
    id: "local-business-instagram",
    industry: "Marketing",
    niche: "local business Instagram",
    headline:
      "Helping local businesses attract nearby customers without posting every day",
    rationale:
      "Owners create endless content but still see no bookings. This helps them focus on the higher-leverage posts that convert to inquiries, and stop the ones that do nothing.",
    specificKnowledge:
      "The creator should understand local discovery behaviour, proof-led content, and the short path from a post to a booking.",
    problemSolved:
      "Daily posting that produces likes from other cities and no customers from the same street.",
    metrics: { pain: 6, demand: 8, worsening: 5.1, speed: 7 },
    frameworkName: "The Nearby Proof Loop",
    premise: "Post proof of work done nearby, and make the next step one tap away.",
    pillars: [
      "Show finished work, not the process.",
      "Name the place in every post.",
      "Give one obvious next step.",
    ],
    pillarWhy: [
      "if you only show process, people admire you instead of booking you",
      "if the location is never named, the algorithm cannot help the people ten minutes away",
      "if the next step is unclear, interest evaporates before it reaches your inbox",
    ],
    voice: {
      audience: "local business owners",
      audienceShort: "owners",
      arena: "local marketing",
      bigEvent: "opening a second location",
      obviousPart: "the follower count",
      dailyPart: "the twenty minutes a day you spend posting",
      frictions: ["one viral post with no bookings", "one quiet week", "one competitor down the road"],
      unit: "post",
      channel: "your DMs",
      stakes: "next month's bookings",
      winCondition: "a week where three enquiries name a post",
      setback: "a month of good engagement and no calls",
    },
    palette: ["#be185d", "#fb7185"],
    tags: ["instagram", "local", "marketing", "social media", "small business", "content"],
    moves: [
      {
        title: "Show finished work, not the process",
        symptom:
          "The feed is full of behind-the-scenes clips that get watched by other people in the trade and nobody who might book.",
        cause:
          "Process content is easier to make and more fun to make. It also asks the viewer to imagine the result, which most viewers will not do.",
        fix: "Lead with the outcome. Post the finished room, the finished plate, the finished cut — then the process underneath if you want it. Proof first, story second.",
        checks: [
          "Does the first frame show a finished result?",
          "Would a stranger understand what you sell in two seconds?",
          "Is there a real customer or a real location in it?",
          "Is the caption under forty words?",
          "Is it obvious what it costs, or how to find out?",
        ],
        nuance:
          "The best-performing local post is almost always a before and after with a place name attached. It is not sophisticated and it does not stop working.",
        caseName: "Kemi",
        caseStory:
          "Kemi's salon posted styling tips five days a week for a year. She swapped to three before-and-afters a week, each captioned with the neighbourhood, and stopped posting tips entirely. Enquiries went from roughly two a week to nine, on fewer posts and less time.",
        quote:
          "Nobody within walking distance books you because your process is interesting. They book because they saw the result and recognised the street.",
        callout:
          "Result in frame one. Place in the caption. Everything else is optional.",
      },
      {
        title: "Build a week that cannot be misread",
        symptom:
          "Posting depends on how the week goes, so quiet weeks — the ones that need customers most — produce nothing.",
        cause:
          "Content decided daily competes with running the business, and the business wins every time.",
        fix: "Three posts a week, fixed days, three fixed formats: a result, a customer, an offer. Shoot them all in one session. Never decide on the day.",
        checks: [
          "Are the three days fixed in the calendar?",
          "Is each slot assigned a format in advance?",
          "Can you shoot a fortnight in one hour?",
          "Is there a fallback post for a bad week?",
          "Are you posting fewer than five times a week?",
        ],
        nuance:
          "Three consistent posts beat seven inconsistent ones, because the person who books you usually sees three or four posts before they act, and they need those posts to exist.",
        caseName: "Dev",
        caseStory:
          "Dev's garage shot every post for a fortnight on the first Monday of each month — about fifty minutes with a phone. He went from posting nothing for three weeks then five times in a day, to three a week without exception. The month after he started, half his new customers mentioned seeing him online.",
        quote:
          "Consistency is not a virtue here. It is the mechanism — people book on the fourth impression, not the first.",
        callout:
          "Three posts. Fixed days. Fixed formats. Shot in one session.",
      },
      {
        title: "Decide the next step once, not per post",
        symptom:
          "Every post ends differently — sometimes a link, sometimes a DM, sometimes nothing — so interest leaks out at the last inch.",
        cause:
          "A call to action invented per post is a call to action that will sometimes be forgotten, and the forgotten ones are pure loss.",
        fix: "Pick one next step and put it on every post, in the same words, forever. DM the word BOOK. Tap the link. Call this number. One route, no thinking.",
        checks: [
          "Is the next step identical on every post?",
          "Does it take one tap, not three?",
          "Is your address and opening time on the profile?",
          "Does a DM get answered within an hour during opening hours?",
          "Is there a saved reply for the most common question?",
        ],
        nuance:
          "Reply speed converts better than any content change. An enquiry answered in ten minutes books far more often than the same enquiry answered the next morning.",
        caseName: "Sian",
        caseStory:
          "Sian's cafe added the same eight-word line to every post and a saved reply for the two questions she always got. She changed nothing about the photos. Her booking rate from DMs roughly doubled in six weeks, which she initially assumed was seasonal.",
        quote:
          "The gap between interest and a booking is usually about four seconds long. Do not put a decision in it.",
        callout:
          "One next step. Same words. Every post. Answered within the hour.",
      },
      {
        title: "Name the place, every time",
        symptom:
          "The account grows with followers from everywhere and customers from nowhere.",
        cause:
          "Nothing in the content tells a platform, or a person, that this business is ten minutes from them.",
        fix: "Put the neighbourhood in the caption, the location tag on the post, and the area in the profile. Not the city — the neighbourhood. Specificity is what makes it findable.",
        checks: [
          "Is the neighbourhood named in the caption text, not just the tag?",
          "Is the location tag set on every post?",
          "Does your bio name the area, not just the city?",
          "Do you appear in the local map listing with photos?",
          "Are you tagging the businesses next door?",
        ],
        nuance:
          "Tagging neighbouring businesses is the cheapest reach available to a local account, and almost nobody does it consistently.",
        caseName: "Andreas",
        caseStory:
          "Andreas ran a bike shop and had 4,000 followers, most of them cyclists in other countries. He added the neighbourhood name to every caption and started tagging the two cafes either side of him. His follower growth slowed noticeably. His walk-ins went up every month for five months.",
        quote:
          "A follower two hundred miles away is a cost, not an asset. Optimise for the people who could walk in.",
        callout:
          "Neighbourhood in the caption. Location tag on the post. Neighbours tagged.",
      },
      {
        title: "Read a quiet month without panicking",
        symptom:
          "One flat month and everything changes — new format, new schedule, new tone — which destroys the only signal you had.",
        cause:
          "Local demand is seasonal and lumpy. A month is too short a window to conclude anything, but it is long enough to feel like failure.",
        fix: "Change one variable per month and measure enquiries, not likes. If enquiries hold and reach falls, you are fine. If enquiries fall, look at the next step before you look at the content.",
        checks: [
          "Are you counting enquiries, not impressions?",
          "Has exactly one thing changed this month?",
          "Are you comparing to the same month last year?",
          "Did anything change about reply speed?",
          "Is the quiet month quiet everywhere, or just online?",
        ],
        nuance:
          "Ask every new customer how they found you and write it down. Two months of that data is worth more than any dashboard the platform will show you.",
        caseName: "Rosa",
        caseStory:
          "Rosa was ready to abandon the whole approach after a flat January. She had asked every customer how they found her, and the notes showed half of them had come from posts — January was simply January. February, unchanged, was her best month of the year.",
        quote:
          "Likes are weather. Enquiries are climate. Only one of them should change your plan.",
        callout:
          "One variable a month. Count enquiries. Ask every customer how they found you.",
      },
    ],
    close: {
      paras: [
        "Local businesses do not lose online because they post too little. They lose because the posts do not show a result, do not name a place, and do not offer an obvious next step.",
        "Fix those three things and three posts a week will outperform the daily schedule you have been failing to keep, on a fraction of the time.",
      ],
      steps: [
        "Shoot a fortnight of before-and-afters in one session this week.",
        "Write your one next step and paste it into every post from now on.",
        "Add the neighbourhood to your bio and every caption.",
      ],
    },
  },
  {
    id: "toddler-bedtime",
    industry: "Parenting",
    niche: "toddler bedtime struggles",
    headline:
      "Helping exhausted parents get toddlers to settle at night without hour-long standoffs",
    rationale:
      "Bedtime is a nightly negotiation that ends with everyone upset, and the exhaustion compounds across weeks. Parents want a routine that holds without shouting.",
    specificKnowledge:
      "The creator should understand toddler sleep pressure, routine design, limit-setting, and how parental exhaustion changes what advice is actually followable.",
    problemSolved:
      "Ninety-minute bedtimes, six re-entries a night, and two adults with no evening left.",
    metrics: { pain: 9, demand: 7, worsening: 6, speed: 8 },
    frameworkName: "The Same-Every-Night Rule",
    premise: "Predictability does the work that willpower cannot.",
    pillars: [
      "Fix the order of the steps.",
      "Decide the limits before you are tired.",
      "Respond the same way to the sixth request as the first.",
    ],
    pillarWhy: [
      "if the order changes nightly, the routine carries no signal",
      "if the limits are set at 8pm on a hard day, they will not hold",
      "if the sixth request gets a different answer, you have taught them to reach six",
    ],
    voice: {
      audience: "exhausted parents of toddlers",
      audienceShort: "parents",
      arena: "bedtime",
      bigEvent: "the move to a big bed",
      obviousPart: "how tired the child is",
      dailyPart: "the forty minutes after lights out",
      frictions: ["one more story", "one more drink", "one more trip downstairs"],
      unit: "bedtime",
      channel: "the evening",
      stakes: "your own sleep",
      winCondition: "a night where lights out means asleep",
      setback: "a holiday that resets everything",
    },
    palette: ["#4338ca", "#818cf8"],
    tags: ["toddler", "bedtime", "sleep", "parenting", "child", "routine", "kids"],
    moves: [
      {
        title: "Fix the order before you fix the timing",
        symptom:
          "Bedtime happens in a different order every night depending on who is home, so nothing about it signals that sleep is coming.",
        cause:
          "A toddler cannot read a clock, but they can read a sequence. Without a stable sequence there is no warning, so every ending is a surprise, and surprises get resisted.",
        fix: "Choose five steps and never reorder them. Bath, pyjamas, teeth, two books, lights. The steps matter less than the fact that they never change.",
        checks: [
          "Are there five steps or fewer?",
          "Is the order identical every night, with both parents?",
          "Does the sequence take under thirty minutes?",
          "Is the last step always the same?",
          "Could a grandparent follow it from a note on the fridge?",
        ],
        nuance:
          "Write it down and put it on the fridge. Not for the child — for the second adult, and for the version of you that is doing this at the end of a bad day.",
        caseName: "Hana",
        caseStory:
          "Hana and her partner ran bedtime differently: he did baths first, she did stories first. Their two-year-old fought whoever went second. They wrote five steps on an index card and both followed it for a fortnight. Bedtime went from roughly seventy minutes to twenty-five, and the card never came off the fridge.",
        quote:
          "You are not teaching them to sleep. You are teaching them what comes next.",
        callout:
          "Five steps. Same order. Same order for both adults. Written on the fridge.",
      },
      {
        title: "Decide the limits before you are tired",
        symptom:
          "The number of stories, drinks, and cuddles is negotiated live, at the exact hour when your judgement is worst.",
        cause:
          "Limits set in the moment are set by whoever has more energy left, and at 7:40pm on a Wednesday that is not you.",
        fix: "Decide the numbers on a Sunday afternoon. Two books. One drink, already in the room. One cuddle after lights out. Write them down and hold them for two weeks before changing anything.",
        checks: [
          "Is the number of books fixed and known in advance?",
          "Is the water already in the room before lights out?",
          "Is the toilet trip built into the sequence?",
          "Do both adults hold the same numbers?",
          "Are you holding them for two weeks before reviewing?",
        ],
        nuance:
          "An inconsistent limit is worse than a generous one. Three books every night works. Two books that sometimes become four teaches that asking four times is how you get four.",
        caseName: "Owen",
        caseStory:
          "Owen's rule had been two books, which regularly became five because it was easier at the time. He moved to three books, non-negotiable, and put the water bottle in the room before lights out. The asking stopped inside a week, not because the limit was tighter but because it stopped moving.",
        quote:
          "Children do not test limits to find out where they are. They test them to find out whether they are real.",
        callout:
          "Set the numbers on a calm afternoon. Hold them for two weeks before reviewing.",
      },
      {
        title: "Give the sixth request the same answer as the first",
        symptom:
          "The first three re-entries get calm responses, the fourth gets a sharper one, and the sixth gets shouting — which becomes the memorable part of the night.",
        cause:
          "Escalating responses are a variable reward schedule, which is the most powerful learning pattern there is. Persistence gets trained without anyone intending it.",
        fix: "Pick one short sentence and repeat it, unchanged, however many times it takes. It is sleep time, I will see you in the morning. Same words, same tone, less each time, and walk out.",
        checks: [
          "Do you have one sentence you can say flat when exhausted?",
          "Does the response get shorter rather than louder?",
          "Are you avoiding new information after lights out?",
          "Is the walk-out immediate?",
          "Do both adults use the same sentence?",
        ],
        nuance:
          "The first three nights usually get worse before better. That is not the plan failing — it is the previously reliable strategy being tested harder before it is abandoned.",
        caseName: "Zara",
        caseStory:
          "Zara counted eleven re-entries on the second night of holding one sentence, and nearly gave up. Night four was three. Night seven was one. She has since described those first three nights as the price of the following two years.",
        quote:
          "Escalating from calm to shouting over six requests teaches exactly one lesson: keep going until six.",
        callout:
          "One sentence. Same words. Shorter each time. Never louder.",
      },
      {
        title: "Protect the hour before bed",
        symptom:
          "The routine is solid and bedtime is still a fight, because the hour before it is loud, bright, and full of screens.",
        cause:
          "You cannot decelerate a toddler in ten minutes. The state they arrive at the bathroom in was decided forty minutes earlier.",
        fix: "Make the hour before bed dim, quiet, and screen-free by default. Not as a punishment — as the on-ramp. Lower the lights, lower your own voice, and end active play on a timer rather than an argument.",
        checks: [
          "Are screens off at least an hour before lights out?",
          "Are the lights actually dimmer, not just later?",
          "Does active play end on a warning, not a stop?",
          "Is your own voice quieter in that hour?",
          "Is dinner early enough that they are not hungry at bedtime?",
        ],
        nuance:
          "Give a warning with a concrete end, not a time. Two more goes, then shoes off works at three years old. Five more minutes does not.",
        caseName: "Callum",
        caseStory:
          "Callum's family had a good routine and terrible bedtimes. Nothing about the routine changed — they moved dinner thirty minutes earlier and turned the television off at six. Bedtime halved within a fortnight, and the routine got the credit it had not previously deserved.",
        quote:
          "The fight at eight o'clock was usually decided at seven.",
        callout:
          "Dim, quiet, screen-free for the hour before. Warnings end with an action, not a time.",
      },
      {
        title: "Get back on track after a holiday or an illness",
        symptom:
          "One week away, one bad cold, and the whole routine is gone — along with the belief that it ever worked.",
        cause:
          "Disruption is inevitable and recovery is fast, but the first bad night after a good stretch feels like starting from zero, so people restart from zero.",
        fix: "Return to the exact routine on the first night home. Do not soften it, do not rebuild it gradually, and do not change anything for a fortnight.",
        checks: [
          "Is the routine identical to before, not a gentler version?",
          "Are you starting on the first night back rather than easing in?",
          "Is illness handled as an exception with a stated end?",
          "Have you told the child what happens tonight?",
          "Are you holding for two weeks before judging?",
        ],
        nuance:
          "Say the exception out loud during it. You are poorly, so tonight I am staying. Tomorrow we are back to normal. Toddlers handle named exceptions far better than silent ones.",
        caseName: "Ines",
        caseStory:
          "Ines came back from ten days at her mother's to three catastrophic nights and assumed the six months of progress were gone. She ran the identical routine anyway. The fourth night was normal, and she has never rebuilt gradually since.",
        quote:
          "Recovery is usually three nights. Rebuilding from scratch takes three weeks. Choose the three nights.",
        callout:
          "Return to the exact routine on night one. Name the exception. Never rebuild gradually.",
      },
    ],
    close: {
      paras: [
        "Bedtime does not improve because a child decides to cooperate. It improves because the evening becomes predictable enough that cooperation is the path of least resistance.",
        "Every part of this is designed to be done by someone who is exhausted, because that is who will be doing it. If a step requires patience you do not have at 7:40pm, it is the wrong step.",
      ],
      steps: [
        "Write your five steps on an index card and put it on the fridge tonight.",
        "Set the numbers — books, drinks, cuddles — on a calm afternoon, with both adults.",
        "Choose your one sentence and use it, unchanged, for the next seven nights.",
      ],
    },
  },
];
