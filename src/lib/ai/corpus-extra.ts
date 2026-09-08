import type { NicheSeed } from "./corpus";

/**
 * Second half of the niche library. Split across two files purely to keep each
 * one readable — `NICHE_LIBRARY` in `corpus.ts` is concatenated with this.
 */
export const NICHE_LIBRARY_EXTRA: NicheSeed[] = [
  {
    id: "first-ten-clients",
    industry: "Business",
    niche: "first ten clients",
    headline:
      "Helping new consultants land their first ten clients without cold outreach at scale",
    rationale:
      "Newly independent consultants have the skill and no pipeline. They burn months on content and cold email when their first ten clients are already one introduction away.",
    specificKnowledge:
      "The creator should understand warm-network mapping, positioning for a specific buyer, and how small consulting engagements actually get bought.",
    problemSolved:
      "Six months of posting, networking, and cold email that produces two calls and no contracts, while the person's existing network stays untouched.",
    metrics: { pain: 8, demand: 7, worsening: 6, speed: 7 },
    frameworkName: "The Warm Hundred",
    premise: "Your first ten clients come from people who already know you can do the work.",
    pillars: [
      "List the hundred people who already know you.",
      "Say one specific thing you do, to one specific buyer.",
      "Ask for a conversation, never for work.",
    ],
    pillarWhy: [
      "if you start with strangers, you are paying to prove something your network already believes",
      "if your offer is broad, nobody can refer you",
      "if you ask for work, people say no politely and stop thinking about you",
    ],
    voice: {
      audience: "new consultants and freelancers",
      audienceShort: "consultants",
      arena: "getting clients",
      bigEvent: "leaving a salaried job",
      obviousPart: "the skill",
      dailyPart: "the empty pipeline",
      frictions: ["one unanswered cold email", "one quiet week", "one referral that never lands"],
      unit: "conversation",
      channel: "your inbox",
      stakes: "your runway",
      winCondition: "two calls a week that go somewhere",
      setback: "a signed client who churns after one project",
    },
    palette: ["#1d4ed8", "#60a5fa"],
    tags: ["consulting", "clients", "freelance", "agency", "sales", "business", "outreach"],
    moves: [
      {
        title: "List the hundred people who already know you",
        symptom:
          "The pipeline starts with strangers, because contacting people you know feels like admitting you need something.",
        cause:
          "Cold outreach is emotionally easier — a stranger's silence costs nothing. That comfort is why most new consultants spend their first quarter on the hardest possible channel.",
        fix: "Write out a hundred names: old colleagues, old clients, people from the industry, people who ran teams next to yours. Not a target list — a memory exercise. Then contact them in order of who you would most enjoy speaking to.",
        checks: [
          "Have you written a hundred names, not thirty?",
          "Does the list include people from more than one job?",
          "Is anyone excluded because it feels awkward? (Include them.)",
          "Are you contacting them in order of ease, not of value?",
          "Is the first message about them, not about you?",
        ],
        nuance:
          "The people who hire you are rarely the people you contact. They are one step past them, which is why the list needs to be a hundred rather than the ten obvious ones.",
        caseName: "Iris",
        caseStory:
          "Iris spent eleven weeks on LinkedIn content and got one enquiry. She then wrote ninety-four names on a Sunday and messaged twelve of them. Three replied within a day, one introduced her to a head of operations, and that introduction became her first contract — from someone she had shared an office with six years earlier.",
        quote:
          "Cold outreach is not braver. It is just less exposed, which is why it feels safer and works worse.",
        callout:
          "A hundred names, written from memory. Contact them in order of ease.",
      },
      {
        title: "Say one specific thing to one specific buyer",
        symptom:
          "The description of what you do covers strategy, operations, and anything else that might be useful — so nobody can pass it on.",
        cause:
          "Broad positioning feels safer because it excludes fewer opportunities. It also makes you unreferrable, because a referral requires someone to recall you at the exact moment a matching problem appears.",
        fix: "Pick one buyer and one problem. I help operations leads at 50-to-200-person software companies fix their onboarding handover. Narrow enough that someone hearing it thinks of a specific person.",
        checks: [
          "Does your sentence name a role, not an industry?",
          "Does it name a problem, not a service?",
          "Could someone repeat it accurately after hearing it once?",
          "Would it exclude work you have done? (It should.)",
          "Has anyone referred you unprompted since you started using it?",
        ],
        nuance:
          "Narrow positioning does not narrow your work. It narrows how you are introduced, and you can take whatever you want once the conversation exists.",
        caseName: "Theo",
        caseStory:
          "Theo described himself as a growth consultant for eight months and got no referrals. He changed it to helping B2B companies fix their trial-to-paid handover, which was one of maybe nine things he could do. He got four referrals in the following six weeks, and two of the resulting projects were nothing to do with trials.",
        quote:
          "You are not choosing what to do. You are choosing what people can remember about you.",
        callout:
          "One role. One problem. One sentence someone can repeat correctly.",
      },
      {
        title: "Ask for a conversation, never for work",
        symptom:
          "The message ends with an ask for work, and people who would happily have helped respond with a polite no and never think about it again.",
        cause:
          "An ask for work forces a yes or no decision on someone with no current need. A no closes the topic permanently. A conversation stays open.",
        fix: "Ask for twenty minutes about what they are seeing in their world. No pitch. At the end, say what you are doing now in one sentence and ask who else you should speak to.",
        checks: [
          "Does the message ask for time, not for business?",
          "Is it under six lines?",
          "Do you have one question you actually want answered?",
          "Do you end by asking for one introduction?",
          "Are you following up once, then leaving it?",
        ],
        nuance:
          "Ask for one introduction, not for referrals in general. Who else is dealing with this gets a name. Let me know if you think of anyone gets nothing.",
        caseName: "Femi",
        caseStory:
          "Femi's first thirty messages asked whether the recipient needed help. He got four replies. His next thirty asked for twenty minutes to hear what they were dealing with. He got nineteen calls, and six of them ended with an introduction he had asked for by name.",
        quote:
          "A no to work is final. A conversation is a door you can walk back through in four months.",
        callout:
          "Ask for twenty minutes. Ask for one name at the end. Never pitch in the first message.",
      },
      {
        title: "Price the first ones on scope, not on doubt",
        symptom:
          "Early projects get priced from fear, then expand without limit, and the first three clients set a rate you spend two years escaping.",
        cause:
          "Without a scoped offer, price is a negotiation about your worth. With one, it is a question about a defined piece of work.",
        fix: "Build one fixed-scope engagement with a fixed price, a fixed length, and a written list of what it does not include. Sell that until you have ten clients.",
        checks: [
          "Is there a written scope with an explicit exclusion list?",
          "Is the price fixed rather than hourly?",
          "Is the engagement under six weeks?",
          "Is there a named deliverable, not just advice?",
          "Do you have a stated process for extra work?",
        ],
        nuance:
          "Charge less if you must, but never leave the scope open. Cheap and defined survives; expensive and vague produces a client you resent by week three.",
        caseName: "Bea",
        caseStory:
          "Bea's first two clients were hourly and open-ended, and both consumed roughly triple the time she had assumed. Her third was a four-week fixed engagement at a lower headline rate with a one-page exclusion list. She earned more per hour on the cheaper project and it ended on the day it said it would.",
        quote:
          "Undercharging is survivable. Unbounded scope is what makes people quit consulting.",
        callout:
          "Fixed scope. Fixed price. A written list of what is not included.",
      },
      {
        title: "Keep the pipeline running while you are busy",
        symptom:
          "The first real project arrives, all outreach stops, and six weeks later the pipeline is empty again — the feast-and-famine cycle in its purest form.",
        cause:
          "Delivery is urgent and pipeline is not, so pipeline loses every week it is allowed to compete.",
        fix: "Two hours a week, same slot, whatever is happening. Five conversations booked at all times. It is not a marketing plan, it is a floor.",
        checks: [
          "Is there a fixed weekly slot for pipeline in your calendar?",
          "Do you have five conversations booked right now?",
          "Does a busy week reduce the slot rather than cancel it?",
          "Are you contacting past clients every quarter?",
          "Does the end of a project trigger anything automatically?",
        ],
        nuance:
          "Past clients are the highest-yield outreach available and the most neglected. A message four months after a project ends converts better than any hundred cold emails.",
        caseName: "Rune",
        caseStory:
          "Rune's first year was three months on, two months off, repeatedly. He blocked Tuesday mornings for pipeline and refused to move it even during a launch. The famine months disappeared in the second year, and roughly half his work that year came from clients he had already worked with.",
        quote:
          "The pipeline you build while busy is the one that catches you when the project ends.",
        callout:
          "Two hours a week, same slot. Five conversations booked at all times.",
      },
    ],
    close: {
      paras: [
        "The first ten clients are a network problem dressed up as a marketing problem. Almost everyone solves it by building an audience, which is a slower version of asking the people who already know them.",
        "Do the unglamorous version first. Content, ads, and cold outreach all work better later, once you can say exactly who you help and point at four people you have helped already.",
      ],
      steps: [
        "Write a hundred names this weekend, from memory, before you research anyone.",
        "Write your one sentence: one role, one problem. Test whether someone can repeat it.",
        "Book your weekly pipeline slot as a recurring event and send twelve messages this week.",
      ],
    },
  },
  {
    id: "adhd-follow-through",
    industry: "Productivity",
    niche: "ADHD task follow-through",
    headline:
      "Helping adults with ADHD finish what they start without relying on motivation",
    rationale:
      "Starting is easy and finishing is not, so unfinished work accumulates into shame that makes the next start harder. Standard productivity advice assumes a working reward system and makes it worse.",
    specificKnowledge:
      "The creator should understand executive function, task initiation, externalised structure, and why conventional planning advice fails this audience specifically.",
    problemSolved:
      "Fourteen projects at eighty percent, a system that was perfect for nine days, and the belief that the problem is character.",
    metrics: { pain: 9, demand: 7, worsening: 5.5, speed: 7 },
    frameworkName: "The Last Mile Rule",
    premise: "Design for the finish, because the start was never the problem.",
    pillars: [
      "Make the next action physically obvious.",
      "Shrink the finish, not the start.",
      "Put the structure outside your head.",
    ],
    pillarWhy: [
      "if the next action is unclear, the task becomes a decision and decisions are what stall",
      "if finishing is vague, it never arrives and the work sits at ninety percent forever",
      "if the system lives in your memory, it is competing with the thing it was supposed to fix",
    ],
    voice: {
      audience: "adults with ADHD",
      audienceShort: "people",
      arena: "finishing things",
      bigEvent: "a late diagnosis",
      obviousPart: "focus",
      dailyPart: "the gap between ninety percent and done",
      frictions: ["one unnamed next step", "one perfect new system", "one week of avoidance"],
      unit: "task",
      channel: "your list",
      stakes: "the work you actually care about",
      winCondition: "a week where three things reached done",
      setback: "a crash after four excellent days",
    },
    palette: ["#7c3aed", "#c084fc"],
    tags: ["adhd", "productivity", "focus", "procrastination", "executive function", "neurodivergent"],
    moves: [
      {
        title: "Make the next action physically obvious",
        symptom:
          "A task sits on the list for weeks. It is not hard and it is not unimportant — it is unclear, and unclear tasks are invisible to a brain that runs on salience.",
        cause:
          "Write report is not a task, it is a category. Every time you look at it you have to do the planning again, and planning is the expensive part.",
        fix: "Every item on the list must name a physical first action you could start in ten seconds. Open the doc and write three bullet headings. If you cannot name it in those terms, that is the task.",
        checks: [
          "Does the item start with a physical verb?",
          "Could you begin in the next ten seconds?",
          "Is any decision-making already done?",
          "Is the required tool already open or to hand?",
          "Would a tired version of you understand it?",
        ],
        nuance:
          "This is why standard to-do lists fail here. They store intentions, and intentions require you to re-plan on retrieval, which is the exact function that is expensive.",
        caseName: "Mo",
        caseStory:
          "Mo had sort out the insurance on his list for five months. Rewritten as find the policy number in the email from March, it took four minutes on the day he rewrote it. The task had never been difficult; it had been unnamed.",
        quote:
          "You have not been procrastinating. You have been re-planning the same task forty times.",
        callout:
          "Every item names a ten-second physical action. If it does not, that is the task.",
      },
      {
        title: "Shrink the finish, not the start",
        symptom:
          "Projects reach ninety percent and stall there, because the remaining ten percent is admin, ambiguity, and the risk of it being judged.",
        cause:
          "Starting is rewarded by novelty. Finishing offers no novelty at all, only exposure — so the reward system that carried you to ninety provides nothing for the last stretch.",
        fix: "Define done in writing before you start, in terms someone else could verify. Then treat the last ten percent as its own scheduled task with its own name.",
        checks: [
          "Is done written down as an observable state?",
          "Could someone else confirm it is finished?",
          "Is the last ten percent scheduled separately?",
          "Have you removed the optional improvements from scope?",
          "Is there a deadline that involves another human?",
        ],
        nuance:
          "Add a person, not a date. A deadline you set yourself has no teeth; a colleague expecting a link on Thursday has plenty, and it costs nothing to arrange.",
        caseName: "Vera",
        caseStory:
          "Vera had four courses at eighty percent, each abandoned at the point of publishing. She wrote a one-line definition of done for the fifth and told a friend she would send the link on Friday. She finished it in nine days after eighteen months of not finishing anything.",
        quote:
          "The last ten percent is not the end of the work. It is a different task, and it deserves its own slot.",
        callout:
          "Write down what done looks like before you start. Attach a person to it.",
      },
      {
        title: "Put the structure outside your head",
        symptom:
          "The system works brilliantly for nine days, then vanishes, and its disappearance is taken as evidence of personal failure.",
        cause:
          "Any system that requires you to remember to check it is competing with the thing it was built to compensate for. It will lose, and it will lose on the day you most need it.",
        fix: "Externalise everything: alarms that fire without being set, one list in one place, the visible object on the desk. If it depends on remembering, it is not a system.",
        checks: [
          "Does the system fire at you, rather than wait for you?",
          "Is there exactly one list, in one place?",
          "Is anything important stored only in your memory?",
          "Does it survive three days of not looking at it?",
          "Is it simple enough to rebuild in five minutes?",
        ],
        nuance:
          "Choose the boring system you will still be using in six weeks over the elegant one you will abandon in nine days. Rebuilding the system is itself a very effective form of avoidance.",
        caseName: "Ellis",
        caseStory:
          "Ellis rebuilt his productivity system eleven times in two years, each one more sophisticated than the last. The one that stuck was a paper card on his keyboard with three items on it. He has used it for over a year, and it survives being ignored for a week because it is physically in the way.",
        quote:
          "Building a better system is the most productive-feeling way to avoid the work.",
        callout:
          "If it depends on you remembering to check it, it is not a system. Make it fire at you.",
      },
      {
        title: "Use the good hours for the hard thing",
        symptom:
          "The two or three genuinely sharp hours a day get spent on email and admin, and the demanding work is attempted at 4pm when there is nothing left.",
        cause:
          "Admin is easy to start and produces immediate feedback, so it wins the good hours by default unless something protects them.",
        fix: "Find your two best hours, block them, and put the single hardest task in them. Everything else moves to the low-quality hours where it belongs, because admin can be done tired.",
        checks: [
          "Do you know which two hours are actually your best?",
          "Are they blocked and defended?",
          "Is exactly one hard task assigned to them?",
          "Is email explicitly excluded from that block?",
          "Does the block survive a busy week at reduced length?",
        ],
        nuance:
          "Two protected hours beat eight unprotected ones, and this is not a metaphor. Most of the output people are proud of comes from a surprisingly small number of protected hours.",
        caseName: "Jonah",
        caseStory:
          "Jonah discovered his best window was 6:30 to 8:30am, which he had been spending on inbox triage for years. He moved email to the afternoon and put writing in the morning. His output roughly tripled without adding a single working hour.",
        quote:
          "Admin can be done tired. Almost nothing else can. Stop spending your best hours on the cheapest work.",
        callout:
          "Two protected hours. One hard task. Email lives somewhere else.",
      },
      {
        title: "Recover from a crash without burning the system",
        symptom:
          "Four excellent days are followed by a crash, and the crash gets read as proof that the system does not work, so the system goes.",
        cause:
          "The four good days were usually overreach. Crashes follow sprints, and the sprint felt like the system working rather than the system being overloaded.",
        fix: "Set a floor, not a target. Define the smallest version of the day that still counts, and run that on bad days rather than nothing. Never redesign the system while you are in the crash.",
        checks: [
          "Is there a defined minimum day?",
          "Is the minimum genuinely achievable on your worst day?",
          "Are you avoiding a redesign until you have recovered?",
          "Was the good stretch actually sustainable?",
          "Did anything change about sleep or food first?",
        ],
        nuance:
          "The urge to rebuild the whole system is at its strongest on day two of a crash and its judgement is at its worst. Wait a week. The system was probably fine.",
        caseName: "Nour",
        caseStory:
          "Nour's pattern was five brilliant days followed by nine off. She set a floor of one twenty-five-minute block a day, which she could do while feeling terrible. The peaks got lower and the troughs stopped being empty, and her monthly output went up substantially.",
        quote:
          "A floor you can hit on your worst day is worth more than a target you hit four times a month.",
        callout:
          "Define the minimum day. Never redesign the system during a crash.",
      },
    ],
    close: {
      paras: [
        "None of this is about trying harder, and the advice that assumes effort is the missing ingredient is the reason so many previous attempts failed. The missing ingredient is structure that does not depend on the function it is compensating for.",
        "Externalise the plan, name the physical next action, define what done looks like, and protect the two hours that actually work. The rest is maintenance.",
      ],
      steps: [
        "Rewrite every item on your list to start with a ten-second physical action.",
        "Pick the project closest to done, write what done looks like, and tell one person a date.",
        "Block your two best hours tomorrow and put one hard task in them.",
      ],
    },
  },
  {
    id: "small-space-decluttering",
    industry: "Home",
    niche: "small-space decluttering",
    headline:
      "Helping renters clear a small flat without buying more storage",
    rationale:
      "People in small homes buy containers instead of making decisions, so the volume never falls and the flat resets within a month. The demand is steady and the result is visible within a weekend.",
    specificKnowledge:
      "The creator should understand decision fatigue, category-based sorting, and why storage purchases reliably delay the actual problem.",
    problemSolved:
      "A flat that is tidy for four days after every attempt, and a growing collection of boxes containing things nobody has looked at in two years.",
    metrics: { pain: 6, demand: 7, worsening: 5, speed: 9 },
    frameworkName: "The One-Pass Rule",
    premise: "Sort by category, decide once, and never buy storage before the volume drops.",
    pillars: [
      "Reduce the volume before you organise anything.",
      "Sort by category, never by room.",
      "Give every remaining thing one address.",
    ],
    pillarWhy: [
      "if you organise before reducing, you have arranged the problem rather than solved it",
      "if you sort by room, duplicates hide from each other and nothing feels excessive",
      "if a thing has no address, it will live wherever it was last put down",
    ],
    voice: {
      audience: "renters in small flats",
      audienceShort: "renters",
      arena: "decluttering",
      bigEvent: "a move into a smaller place",
      obviousPart: "the tidying",
      dailyPart: "the surfaces that refill every week",
      frictions: ["one full drawer", "one impulse box", "one surface that collects everything"],
      unit: "decision",
      channel: "the hallway",
      stakes: "the only room you can relax in",
      winCondition: "a Sunday where nothing needs tidying",
      setback: "a month where it all comes back",
    },
    palette: ["#047857", "#34d399"],
    tags: ["declutter", "home", "organising", "minimalism", "tidy", "storage", "flat", "apartment"],
    moves: [
      {
        title: "Reduce the volume before you organise anything",
        symptom:
          "The response to a cluttered flat is a shopping trip: baskets, drawer dividers, under-bed boxes. A week later everything is neat and the volume is identical.",
        cause:
          "Buying storage feels like progress and requires no decisions. That is exactly why it is so appealing, and exactly why the flat resets.",
        fix: "Ban storage purchases until the volume has visibly dropped. Organise only what is left. If you still need a container afterwards, buy it then — you will need fewer than you thought.",
        checks: [
          "Has anything left the flat today?",
          "Are you organising things you have already decided to keep?",
          "Is there a bag by the door right now?",
          "Have you bought a container this month? (Why?)",
          "Would the space work if you simply had less?",
        ],
        nuance:
          "Storage is not the enemy. Storage bought before the decisions is, because it converts a decision problem into a spatial one and then hides the evidence.",
        caseName: "Lena",
        caseStory:
          "Lena had eleven storage boxes under a bed in a one-bedroom flat and was researching a twelfth. She opened all eleven instead, over a weekend, and kept the contents of three. She has not needed a container since, and the flat has stayed clear for over a year.",
        quote:
          "A container does not reduce anything. It just moves the decision somewhere you cannot see it.",
        callout:
          "No new storage until the volume has visibly dropped. Reduce first, arrange second.",
      },
      {
        title: "Sort by category, never by room",
        symptom:
          "The kitchen gets done, then the bedroom, and somehow neither feels finished — because the same category of thing is in four rooms and never seen together.",
        cause:
          "Room-by-room sorting hides duplication. You cannot feel that you own nine chargers while they are distributed across three drawers and a bag.",
        fix: "Gather every item of one category into one pile, in one place, at one time. All the cables. All the mugs. All the black t-shirts. Then decide with the whole pile in front of you.",
        checks: [
          "Is every item of this category physically in one pile?",
          "Have you checked the second bedroom, the car, and the loft?",
          "Are you deciding with the whole pile visible?",
          "Is the category small enough to finish in one sitting?",
          "Have you set a number you are keeping before you start?",
        ],
        nuance:
          "The pile is the intervention. Nobody keeps twenty-two mugs after seeing twenty-two mugs on one table, and no amount of reasoning about mugs achieves the same thing.",
        caseName: "Petra",
        caseStory:
          "Petra had tidied her flat room by room roughly four times a year for a decade. She put every cable in the flat on the kitchen table — forty-one of them, for eleven devices. She kept fourteen. The drawer she had been trying to organise for years has not needed organising since.",
        quote:
          "You do not have a tidying problem. You have never once seen all of something at the same time.",
        callout:
          "One category. One pile. One sitting. Decide with everything visible.",
      },
      {
        title: "Give every remaining thing one address",
        symptom:
          "The flat is clear for a week, then the surfaces refill, and it is blamed on discipline.",
        cause:
          "Items without a designated home end up wherever they were last put down. There is no habit that fixes this, because the decision is made forty times a day while carrying something else.",
        fix: "Every item that stays gets one specific place, and putting it away has to be faster than putting it down. Keys on the hook by the door, not in a bowl in another room.",
        checks: [
          "Does every category have one named place?",
          "Is putting it away faster than leaving it out?",
          "Are the daily items nearest the door?",
          "Is there a home for the things that currently live on the counter?",
          "Could a guest put things away correctly without asking?",
        ],
        nuance:
          "If a surface refills every week, the things landing on it are missing an address near where they land. Move the address, not the behaviour.",
        caseName: "Sam",
        caseStory:
          "Sam's hall table collected post, keys, receipts, and headphones within days of every clear-out. He put a hook and a shallow tray on the wall directly above it and gave each item a place within arm's reach of where it was already being dropped. The table has stayed empty for eight months.",
        quote:
          "Surfaces do not collect clutter. They collect things whose home is too far from where you are standing.",
        callout:
          "One address per category, placed where the item actually lands.",
      },
      {
        title: "Decide the rule once, not per object",
        symptom:
          "Every individual item gets its own agonised deliberation, so a drawer takes two hours and the wardrobe never gets started.",
        cause:
          "Deciding per object is decision fatigue by design. By item forty your judgement is gone, which is why the second half of every session gets kept.",
        fix: "Set a category rule before you start. One year unused, it goes. Duplicates beyond three, they go. Then apply it without relitigating each object.",
        checks: [
          "Is the rule written down before you begin?",
          "Does it apply to the whole category without exceptions?",
          "Is there a maybe box with a dated deadline?",
          "Are you sorting for under ninety minutes at a time?",
          "Are the easy categories done first?",
        ],
        nuance:
          "Start with the categories that carry no emotional weight — cables, toiletries, kitchen gadgets. The decisions get easier with practice, and sentimental items are the last thing to attempt, not the first.",
        caseName: "Bo",
        caseStory:
          "Bo had failed at decluttering three times, each attempt starting with a box of photographs and ending within an hour. The fourth attempt started with the bathroom cabinet, which took eleven minutes and required no feelings at all. He reached the photographs six weeks later and got through them in one afternoon.",
        quote:
          "Never start with the hard category. You are building a decision habit, and the first ones should be easy.",
        callout:
          "Rule per category, set before you start. Easy categories first. Ninety minutes maximum.",
      },
      {
        title: "Stop it coming back without becoming a minimalist",
        symptom:
          "Six months later the flat is full again, and the conclusion is that decluttering does not work.",
        cause:
          "Nothing changed about inflow. A one-off reduction against a constant inflow always loses, and the second attempt starts from a worse psychological position.",
        fix: "Fix the inflow with two rules and one habit: one in, one out for the categories that creep, a bag by the door that always exists, and a twenty-minute reset once a month.",
        checks: [
          "Is there a permanent outbound bag by the door?",
          "Does one-in-one-out apply to your two creeping categories?",
          "Is there a monthly reset in the calendar?",
          "Do you know which category creeps fastest? (Everyone has one.)",
          "Is anything arriving by subscription you did not think about?",
        ],
        nuance:
          "You do not have to own less than other people. You have to own less than the flat holds comfortably, and you have to notice when that stops being true.",
        caseName: "Yara",
        caseStory:
          "Yara's flat refilled twice before she looked at inflow rather than volume. Books and skincare were almost the entire problem. She applied one-in-one-out to those two categories only, kept a bag by the door permanently, and has not done a full declutter in two years.",
        quote:
          "A clear-out without an inflow rule is a very tiring way to buy yourself four months.",
        callout:
          "Two creeping categories, one-in-one-out. A permanent bag by the door. Twenty minutes a month.",
      },
    ],
    close: {
      paras: [
        "Small flats do not need clever storage. They need fewer objects and a fixed address for each of the ones that stay, which is a weekend of decisions rather than a shopping trip.",
        "The reason previous attempts reset is almost always inflow. Fix that with two rules and the space stays clear without any further effort or any change to who you are.",
      ],
      steps: [
        "Pick one unemotional category and put every instance of it in one pile today.",
        "Give the three things that always end up on your worst surface an address within arm's reach.",
        "Put a bag by the door and a twenty-minute monthly reset in your calendar.",
      ],
    },
  },
  {
    id: "postpartum-core-recovery",
    industry: "Fitness",
    niche: "postpartum core recovery",
    headline:
      "Helping new mothers rebuild core strength safely without returning to old routines too early",
    rationale:
      "Postnatal advice is either clinical and inaccessible or generic fitness content that is actively unsafe in the early months. The audience is highly motivated and badly served.",
    specificKnowledge:
      "The creator should understand postnatal progression, abdominal separation, pelvic floor basics, and where the boundary between guidance and clinical advice sits.",
    problemSolved:
      "A body that feels unfamiliar, contradictory advice from every direction, and a real fear of doing the wrong exercise and making something worse.",
    metrics: { pain: 8, demand: 7, worsening: 5, speed: 6 },
    frameworkName: "The Load Ladder",
    premise: "Earn each stage. Breathing before bracing, bracing before loading.",
    pillars: [
      "Restore the breathing pattern first.",
      "Add load only when the current stage is boring.",
      "Measure by symptoms, not by weeks.",
    ],
    pillarWhy: [
      "if the breath and the pelvic floor are not coordinated, everything above is built on nothing",
      "if you progress before a stage is easy, you inherit the compensation into the next one",
      "if you progress on the calendar, you are following someone else's recovery",
    ],
    voice: {
      audience: "new mothers",
      audienceShort: "mothers",
      arena: "postnatal recovery",
      bigEvent: "birth",
      obviousPart: "the six-week check",
      dailyPart: "the year that follows it",
      frictions: ["one heavy lift", "one skipped week", "one comparison on social media"],
      unit: "session",
      channel: "your week",
      stakes: "a body you can rely on",
      winCondition: "a week where nothing feels heavy or leaks",
      setback: "a flare after a good fortnight",
    },
    palette: ["#c2410c", "#fb923c"],
    tags: ["postpartum", "postnatal", "core", "pelvic floor", "fitness", "mother", "diastasis"],
    moves: [
      {
        title: "Restore the breathing pattern before anything else",
        symptom:
          "Recovery starts with crunches and planks because those are what core work looks like, and the discomfort that follows gets read as normal.",
        cause:
          "The deep system works as a coordinated unit — diaphragm, pelvic floor, deep abdominals. If that coordination has not returned, every exercise above it is loading a structure that is not connected.",
        fix: "Spend two to three weeks on breathing and gentle coordination before adding any load. Exhale on effort. Nothing that makes you hold your breath or bulge outward.",
        checks: [
          "Does your ribcage move on the inhale, not just your chest?",
          "Can you exhale and feel a gentle lift, without gripping?",
          "Is your belly staying soft rather than bulging on effort?",
          "Any leaking, heaviness, or doming? (Stop and see a professional.)",
          "Can you do this comfortably while holding the baby?",
        ],
        nuance:
          "This is general guidance and not a substitute for a pelvic health physiotherapist. If there is leaking, pain, heaviness, or a visible dome along the midline, that is a referral, not a harder programme.",
        caseName: "Amara",
        caseStory:
          "Amara went back to her old class at eight weeks and spent four months confused about why nothing felt strong. She stopped, spent three weeks on breathing and simple coordination work, and progressed faster in the following two months than in the previous four.",
        quote:
          "You are not starting from zero. You are starting from a system that needs reconnecting before it can be loaded.",
        callout:
          "Breathe before you brace. Brace before you load. Leaking or doming means a referral.",
      },
      {
        title: "Add load only when the current stage is boring",
        symptom:
          "Progression follows a programme's week numbers rather than the body's response, so week four arrives whether or not week three was comfortable.",
        cause:
          "Programmes are written for an average recovery that nobody actually has. Birth, sleep, feeding, and prior fitness all move the timeline by months in either direction.",
        fix: "Move on when the current stage feels genuinely easy for two consecutive sessions with no symptoms afterwards. Not when the calendar says so.",
        checks: [
          "Was the last session comfortable both during and the day after?",
          "Have two consecutive sessions felt easy?",
          "Can you hold a conversation throughout?",
          "Is the breathing pattern still intact under the new load?",
          "Are you adding one variable at a time?",
        ],
        nuance:
          "Sleep is a training variable here, not an excuse. A four-hour night genuinely changes what your tissue tolerates, and training as though it does not is how good weeks turn into flares.",
        caseName: "Jess",
        caseStory:
          "Jess followed a twelve-week programme to the letter and flared twice. On her third attempt she progressed on symptoms instead of weeks, which took her nineteen weeks to finish. She did not flare once and finished stronger than either previous attempt.",
        quote:
          "The programme does not know how you slept, how you gave birth, or what you did yesterday. You do.",
        callout:
          "Progress on symptoms, not on weeks. Two easy sessions, then add one thing.",
      },
      {
        title: "Decide the week once, not every day",
        symptom:
          "Training happens when there is time, which means it happens in the first fortnight and then stops.",
        cause:
          "With a newborn, anything that requires finding a moment will not find one. The default day is full before it starts.",
        fix: "Three fixed slots a week, ten to twenty minutes each, attached to something that already happens — the first nap, after the morning feed. Attach to an anchor rather than a time.",
        checks: [
          "Are the sessions attached to an existing event, not a clock time?",
          "Are they short enough to do on four hours of sleep?",
          "Can they be done in the room where you already are?",
          "Is there a five-minute version for a bad day?",
          "Do they need equipment you have to fetch?",
        ],
        nuance:
          "Ten minutes three times a week, sustained for six months, beats forty-five minutes twice, sustained for a fortnight — and the second one is what almost everyone attempts.",
        caseName: "Kirsty",
        caseStory:
          "Kirsty planned four forty-minute sessions a week and completed three in a month. She switched to twelve minutes after the first nap, three days a week, on the same mat that stayed unrolled in the corner. She has kept it going for over a year.",
        quote:
          "Attach it to something that already happens. A time of day is not an anchor when your day has no shape.",
        callout:
          "Three short sessions, attached to an anchor. Never scheduled against a clock.",
      },
      {
        title: "Load the things real life demands",
        symptom:
          "Months of floor-based core work, and picking up the car seat still feels precarious.",
        cause:
          "The demands of new motherhood are carrying, lifting from the floor, and being asymmetrically loaded for hours. Isolated core work does not transfer to any of them.",
        fix: "Once the foundation holds, train the actual patterns: a hinge, a squat, a carry, a push, a pull. Loaded carries in particular map directly onto the day.",
        checks: [
          "Does your programme include a carry?",
          "Are you lifting from the floor with intent, not avoidance?",
          "Is one side trained as much as the other?",
          "Is the load progressing, even slightly, month to month?",
          "Does anything you do resemble picking up a car seat?",
        ],
        nuance:
          "Avoiding lifting does not protect you. Untrained lifting under fatigue is the risk, and a toddler weighs more every month whether or not you have trained for it.",
        caseName: "Dee",
        caseStory:
          "Dee did four months of mat work and still braced herself every time she lifted the pram into the boot. She added farmer's carries and floor-to-shoulder lifts, twice a week. Within six weeks the pram had stopped being an event she prepared for.",
        quote:
          "Your training should look like your Tuesday. On a Tuesday you carry things, and nothing else.",
        callout:
          "Hinge, squat, carry, push, pull. If it does not resemble your day, it will not transfer to it.",
      },
      {
        title: "Handle a flare without going back to the start",
        symptom:
          "One bad week — leaking, heaviness, an aching back — and the whole programme stops, often for months.",
        cause:
          "A symptom after a good stretch feels like proof of damage. Usually it is a load spike, a bad night, or an illness, and the correct response is smaller than stopping.",
        fix: "Drop back one stage, not to zero. Hold there for a fortnight. If symptoms persist beyond that, or there is pain, that is a referral to a pelvic health physiotherapist.",
        checks: [
          "What changed in the last week — load, sleep, or illness?",
          "Have you dropped one stage rather than stopped?",
          "Are symptoms improving across a fortnight?",
          "Is there pain, as opposed to fatigue?",
          "Do you have a physiotherapist you can actually contact?",
        ],
        nuance:
          "Find a pelvic health physiotherapist before you need one. Almost everyone benefits from one assessment, and searching for a good one during a flare is the worst possible time to do it.",
        caseName: "Rania",
        caseStory:
          "Rania flared at month five after a week of poor sleep and a house move. Instead of stopping, she went back one stage for two weeks and kept the three sessions. She was back to where she had been within a month, having previously lost an entire quarter to the same situation.",
        quote:
          "A flare is information about last week's load. It is very rarely information about your body's limits.",
        callout:
          "Drop one stage, hold two weeks. Pain or persistence goes to a pelvic health physio.",
      },
    ],
    close: {
      paras: [
        "Postnatal recovery goes wrong in two directions: too much too early, and nothing at all out of fear. Both come from the same place, which is having no framework for deciding what is safe right now.",
        "A ladder solves that. Earn the stage, progress on symptoms rather than weeks, and train the patterns your actual day demands. Everything here is general guidance — a single assessment with a pelvic health physiotherapist is worth more than any programme, including this one.",
      ],
      steps: [
        "Spend this week on breathing and coordination only, before any loaded work.",
        "Attach three short sessions to an anchor that already happens in your day.",
        "Look up a pelvic health physiotherapist near you now, before you need one.",
      ],
    },
  },
];
