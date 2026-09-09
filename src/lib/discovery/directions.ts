/**
 * The direction corpus.
 *
 * A "direction" is an industry plus a specific area inside it that is worth
 * exploring. Directions are what stage one produces; stage two expands each
 * into one or two concrete opportunities.
 *
 * Every opportunity carries both forms the product shows: the Title Case topic
 * line used while brainstorming, and the first-person offer statement
 * ("I help <audience> <outcome> without <constraint>") used from scoring on.
 */

export interface OpportunitySeed {
  id: string;
  /** Title Case topic line — what the brainstorm stage lists. */
  title: string;
  /** The narrow area inside the industry, shown as "Industry · Niche". */
  niche: string;
  /** Who it is for, in their own terms. */
  audience: string;
  /** What changes for them. */
  outcome: string;
  /** The thing they are afraid the solution will cost them. */
  constraint: string;
  metrics: { pain: number; demand: number; worsening: number; speed: number };
}

export interface DirectionSeed {
  id: string;
  /** Industry label, shown right-aligned in the brainstorm list. */
  industry: string;
  /** One line on why this industry is worth a look at all. */
  thesis: string;
  opportunities: OpportunitySeed[];
}

/** "I help X do Y without Z" — the form every opportunity is stated in. */
export function statementOf(o: OpportunitySeed): string {
  return `I help ${o.audience} ${o.outcome} without ${o.constraint}`;
}

export const DIRECTIONS: DirectionSeed[] = [
  {
    id: "personal-finance",
    industry: "Personal Finance",
    thesis:
      "Money problems are felt weekly, searched constantly, and people will pay to stop a recurring dread.",
    opportunities: [
      {
        id: "payday-budget",
        title: "Stopping the Household Budget From Running Out Before Payday",
        niche: "Paycheck-to-Paycheck Household Budgeting",
        audience: "single-income households",
        outcome: "stop running out of money before payday",
        constraint: "cutting every small pleasure from the budget",
        metrics: { pain: 9.4, demand: 8.8, worsening: 8.9, speed: 7.4 },
      },
      {
        id: "irregular-income",
        title: "Smoothing Irregular Income Into a Predictable Monthly Wage",
        niche: "Variable Income Planning",
        audience: "freelancers with unpredictable months",
        outcome: "pay themselves a steady monthly wage",
        constraint: "turning down work out of fear",
        metrics: { pain: 8.2, demand: 7.4, worsening: 8.4, speed: 7.6 },
      },
    ],
  },
  {
    id: "ai-automation",
    industry: "AI & Automation",
    thesis:
      "Everyday people now expect AI to help with admin but have no idea where to start.",
    opportunities: [
      {
        id: "household-admin-ai",
        title: "Using AI to Organize Household Admin and Repeating Daily Tasks",
        niche: "Family Administration",
        audience: "parents drowning in school forms and appointments",
        outcome: "keep school forms, appointments, and family reminders organized",
        constraint: "learning to code or paying for a virtual assistant",
        metrics: { pain: 8.0, demand: 8.0, worsening: 7.9, speed: 8.0 },
      },
      {
        id: "chore-lists",
        title: "Turning Recurring Household Chores Into Clear Task Lists",
        niche: "Recurring Household Tasks",
        audience: "households where one person tracks everything",
        outcome: "turn recurring household chores into clear task lists",
        constraint: "building complicated productivity software",
        metrics: { pain: 7.8, demand: 8.2, worsening: 8.0, speed: 8.6 },
      },
    ],
  },
  {
    id: "gaming-esports",
    industry: "Gaming & Esports",
    thesis:
      "A large, young, highly engaged audience that already spends money on improvement.",
    opportunities: [
      {
        id: "fps-practice",
        title: "Building a Consistent Practice Routine for Competitive Video Games",
        niche: "Competitive FPS Practice",
        audience: "adult players stuck in mid-rank competitive shooters",
        outcome: "win more close matches",
        constraint: "grinding aim drills for hours every night",
        metrics: { pain: 7.9, demand: 8.4, worsening: 7.6, speed: 8.0 },
      },
      {
        id: "fighting-games",
        title: "Reaching a Dependable Online Rank in Fighting Games",
        niche: "Competitive Fighting Games",
        audience: "fighting game beginners",
        outcome: "reach their first dependable online rank",
        constraint: "memorizing hundreds of combos or rage-queuing after losses",
        metrics: { pain: 8.1, demand: 8.0, worsening: 7.6, speed: 8.2 },
      },
    ],
  },
  {
    id: "health-wellness",
    industry: "Health & Wellness",
    thesis:
      "Sleep and heat are worsening problems with a fast, felt result when solved.",
    opportunities: [
      {
        id: "heat-sleep",
        title: "Cooling Routines for Better Sleep During Nighttime Heat Episodes",
        niche: "Sleep During Heat Waves",
        audience: "people in homes without air conditioning",
        outcome: "sleep through hot nights",
        constraint: "buying expensive equipment or moving rooms",
        metrics: { pain: 8.3, demand: 7.2, worsening: 9.2, speed: 8.0 },
      },
      {
        id: "shift-sleep",
        title: "Sleeping Well on a Rotating Shift Pattern",
        niche: "Sleep on Rotating Shifts",
        audience: "shift workers whose sleep never settles",
        outcome: "hold a sleep pattern across a rotating roster",
        constraint: "quitting the job or living on caffeine",
        metrics: { pain: 8.4, demand: 7.0, worsening: 7.4, speed: 7.0 },
      },
    ],
  },
  {
    id: "pet-care",
    industry: "Pet Care",
    thesis:
      "Post-pandemic dog ownership left a large group of first-time owners with no training frame.",
    opportunities: [
      {
        id: "dog-alone",
        title: "Helping Dogs Stay Calm When Left Home Alone",
        niche: "Separation-related Distress in Dogs",
        audience: "first-time dog owners",
        outcome: "keep their dogs calm during short periods home alone",
        constraint: "relying on punishment or constant monitoring",
        metrics: { pain: 8.8, demand: 8.4, worsening: 8.2, speed: 6.6 },
      },
      {
        id: "puppy-basics",
        title: "Getting a New Puppy Through the First Sixty Days",
        niche: "New Puppy Foundations",
        audience: "new puppy owners in their first two months",
        outcome: "get through house training and biting",
        constraint: "conflicting advice from six different trainers",
        metrics: { pain: 8.2, demand: 8.0, worsening: 7.0, speed: 8.0 },
      },
    ],
  },
  {
    id: "relationships-dating",
    industry: "Relationships & Dating",
    thesis:
      "Recurring conflict is the highest-pain, most-repeated problem people never solve alone.",
    opportunities: [
      {
        id: "recurring-conflicts",
        title: "Having Calm, Productive Conversations During Recurring Couple Conflicts",
        niche: "Recurring Couple Conflicts",
        audience: "long-term couples",
        outcome: "resolve the same arguments about chores and responsibilities",
        constraint: "yelling, shutting down, or reopening every past grievance",
        metrics: { pain: 9.0, demand: 8.2, worsening: 8.4, speed: 6.4 },
      },
      {
        id: "money-conversations",
        title: "Reaching Clear Decisions in Difficult Couple Conversations",
        niche: "Difficult Couple Conversations",
        audience: "couples who avoid money and future-planning conversations",
        outcome: "reach clear decisions",
        constraint: "pressure, defensiveness, or one partner doing all the talking",
        metrics: { pain: 8.4, demand: 7.8, worsening: 8.2, speed: 6.6 },
      },
    ],
  },
  {
    id: "spirituality-growth",
    industry: "Spirituality & Personal Growth",
    thesis:
      "High willingness to pay, but almost all of it is vague — specificity wins immediately.",
    opportunities: [
      {
        id: "self-sabotage",
        title: "Breaking Repeating Self-Sabotage Patterns Through Guided Self-Reflection",
        niche: "Self-Sabotage Patterns",
        audience: "people who repeat the same self-defeating decision",
        outcome: "interrupt the pattern before it plays out",
        constraint: "years of therapy or vague journaling prompts",
        metrics: { pain: 8.6, demand: 7.4, worsening: 7.6, speed: 6.4 },
      },
    ],
  },
  {
    id: "personal-organization",
    industry: "Personal Organization Systems",
    thesis:
      "The mental load of remembering everything is now widely named and badly served.",
    opportunities: [
      {
        id: "bills-deadlines",
        title: "Getting Household Bills, Appointments, and Important Deadlines Under Control",
        niche: "Household Bills and Deadlines",
        audience: "households juggling bills and appointments",
        outcome: "keep every recurring obligation visible",
        constraint: "relying on one person to remember everything",
        metrics: { pain: 8.4, demand: 7.8, worsening: 8.4, speed: 7.2 },
      },
      {
        id: "mental-load",
        title: "Splitting the Household Mental Load So One Person Is Not Holding It",
        niche: "Shared Mental Load",
        audience: "couples where one partner remembers everything",
        outcome: "share the invisible planning work fairly",
        constraint: "a spreadsheet nobody else will open",
        metrics: { pain: 8.6, demand: 7.6, worsening: 8.0, speed: 6.8 },
      },
    ],
  },
  {
    id: "tech-everyday",
    industry: "Tech for Everyday Users",
    thesis:
      "Scams and password reuse are getting worse fast, and the existing advice terrifies people.",
    opportunities: [
      {
        id: "family-passwords",
        title: "Replacing Password Reuse and Spotting Common Online Scams",
        niche: "Family Password Security",
        audience: "families with multiple shared online accounts",
        outcome: "replace password reuse with secure access habits",
        constraint: "confusing relatives or locking themselves out",
        metrics: { pain: 7.8, demand: 8.0, worsening: 9.0, speed: 7.6 },
      },
      {
        id: "scam-prevention",
        title: "Spotting Text, Email, and Phone Scams Before Responding",
        niche: "Scam Prevention",
        audience: "older adults and the relatives who support them",
        outcome: "spot common text, email, and phone scams before responding",
        constraint: "becoming afraid of every online message",
        metrics: { pain: 8.0, demand: 7.8, worsening: 9.0, speed: 7.6 },
      },
    ],
  },
  {
    id: "fitness-recovery",
    industry: "Fitness & Recovery",
    thesis:
      "The time-poor beginner is the largest under-served segment in a crowded market.",
    opportunities: [
      {
        id: "after-dinner",
        title: "Building a Habit of Short After-Dinner Workouts",
        niche: "Short Evening Workouts",
        audience: "people who are too tired to train in the morning",
        outcome: "build a short evening training habit that survives a bad day",
        constraint: "a gym membership or an hour they do not have",
        metrics: { pain: 7.6, demand: 8.2, worsening: 7.0, speed: 8.4 },
      },
      {
        id: "return-to-training",
        title: "Coming Back to Training After Months Away",
        niche: "Returning After a Long Break",
        audience: "people restarting training after six months off",
        outcome: "rebuild a routine without the first-week injury",
        constraint: "starting at the intensity they finished at",
        metrics: { pain: 7.4, demand: 7.8, worsening: 6.4, speed: 8.0 },
      },
    ],
  },
  {
    id: "etiquette",
    industry: "Etiquette & Courtesy",
    thesis:
      "Small, teachable, high-embarrassment problems with almost no credible material.",
    opportunities: [
      {
        id: "social-poise",
        title: "Handling Introductions and Small Talk With Ease and Confidence",
        niche: "Social Poise in Group Settings",
        audience: "people who freeze in group introductions",
        outcome: "handle introductions and small talk with ease",
        constraint: "scripts that make them sound rehearsed",
        metrics: { pain: 7.4, demand: 7.2, worsening: 6.6, speed: 8.0 },
      },
    ],
  },
  {
    id: "mindfulness",
    industry: "Mindfulness & Reflection",
    thesis:
      "Daily stress at named moments beats generic meditation advice every time.",
    opportunities: [
      {
        id: "daily-stress",
        title: "Staying Steady in Daily Stress Without Becoming Overwhelmed",
        niche: "Managing Daily Stress",
        audience: "parents in rushed mornings and evening transitions",
        outcome: "stay steady during the hardest hour of the day",
        constraint: "snapping at family members or mentally checking out",
        metrics: { pain: 8.4, demand: 7.8, worsening: 8.0, speed: 7.8 },
      },
      {
        id: "sunday-dread",
        title: "Ending the Sunday Dread Before the Week Starts",
        niche: "Anticipatory Work Anxiety",
        audience: "people who lose every Sunday evening to dread",
        outcome: "get their Sunday back",
        constraint: "changing job or pretending the week is fine",
        metrics: { pain: 8.0, demand: 7.4, worsening: 7.8, speed: 7.6 },
      },
    ],
  },
  {
    id: "music-performing",
    industry: "Music & Performing Arts",
    thesis:
      "Vocal damage is a real, expensive fear with a small amount of good free advice.",
    opportunities: [
      {
        id: "vocal-health",
        title: "Singing and Performing Regularly Without Losing Your Voice",
        niche: "Vocal Health for Gigging Singers",
        audience: "singers performing several nights a week",
        outcome: "get through a run of shows with their voice intact",
        constraint: "cancelling gigs or paying for weekly lessons",
        metrics: { pain: 8.0, demand: 6.8, worsening: 7.0, speed: 7.4 },
      },
    ],
  },
  {
    id: "parenting",
    industry: "Parenting",
    thesis:
      "Homework and bedtime are nightly, universally painful, and highly specific.",
    opportunities: [
      {
        id: "homework-independence",
        title: "Building Homework Independence Without Repeated Arguments",
        niche: "Homework Independence for Middle School Students",
        audience: "parents of middle school students",
        outcome: "build independent homework completion",
        constraint: "hovering over every assignment or discovering missing work at bedtime",
        metrics: { pain: 8.8, demand: 8.4, worsening: 8.0, speed: 6.8 },
      },
      {
        id: "homework-arguing",
        title: "Getting Homework Finished With Less Arguing",
        niche: "Homework Conflict With Younger Children",
        audience: "parents of elementary school children",
        outcome: "get homework finished with less arguing",
        constraint: "doing the work for them or using threats",
        metrics: { pain: 8.4, demand: 8.0, worsening: 7.6, speed: 7.8 },
      },
    ],
  },
  {
    id: "home-garden",
    industry: "Home & Garden",
    thesis:
      "Houseplants convert a hobby purchase into repeated anxiety about killing something.",
    opportunities: [
      {
        id: "indoor-plants",
        title: "Keeping Indoor Plants Alive as a Busy Beginner",
        niche: "First Indoor Plants",
        audience: "new plant owners",
        outcome: "keep their first ten indoor plants healthy through changing seasons",
        constraint: "guessing when to water or buying unnecessary supplies",
        metrics: { pain: 7.2, demand: 8.0, worsening: 6.8, speed: 8.6 },
      },
      {
        id: "small-balcony",
        title: "Growing Food on a Balcony That Gets Four Hours of Sun",
        niche: "Low-Light Balcony Growing",
        audience: "renters with a small shaded balcony",
        outcome: "grow something edible in a difficult spot",
        constraint: "a garden, a greenhouse, or full sun",
        metrics: { pain: 6.4, demand: 7.2, worsening: 6.0, speed: 7.0 },
      },
    ],
  },
  {
    id: "preparedness",
    industry: "Preparedness & Outdoors",
    thesis:
      "Outages are getting more frequent, and most preparedness content is aimed at extremists.",
    opportunities: [
      {
        id: "outages",
        title: "Being Ready for Short Power and Water Outages",
        niche: "Household Outage Readiness",
        audience: "ordinary households in areas with unreliable power",
        outcome: "get through a two-day outage calmly",
        constraint: "a basement full of survival gear",
        metrics: { pain: 7.8, demand: 7.4, worsening: 8.8, speed: 8.4 },
      },
    ],
  },
  {
    id: "photography-video",
    industry: "Photography & Video",
    thesis:
      "Phone cameras are universal; the gap is judgement in bad light, not equipment.",
    opportunities: [
      {
        id: "phone-lighting",
        title: "Taking Better Photos on a Phone in Everyday Lighting",
        niche: "Phone Photography in Poor Light",
        audience: "people whose indoor photos always look flat",
        outcome: "take sharp, well-lit photos in ordinary rooms",
        constraint: "buying a camera or learning manual settings",
        metrics: { pain: 6.8, demand: 7.8, worsening: 6.2, speed: 8.8 },
      },
    ],
  },
  {
    id: "travel-lifestyle",
    industry: "Travel & Lifestyle",
    thesis:
      "Trip planning is a repeated, high-stakes research task people genuinely dread.",
    opportunities: [
      {
        id: "trip-system",
        title: "Planning Multi-City Trips With a Reusable Travel System",
        niche: "Multi-City Trip Planning",
        audience: "people planning their first multi-city trip",
        outcome: "complete trips with booked transportation, lodging, and daily priorities",
        constraint: "spending weeks buried in conflicting advice",
        metrics: { pain: 7.6, demand: 7.8, worsening: 6.8, speed: 7.6 },
      },
    ],
  },
  {
    id: "education-study",
    industry: "Education & Study Skills",
    thesis:
      "Adults returning to study have no method and lose months to re-reading.",
    opportunities: [
      {
        id: "retention",
        title: "Remembering What You Read in Textbooks and Online Courses",
        niche: "Retention for Adult Learners",
        audience: "adults studying alongside a full-time job",
        outcome: "remember what they read the first time",
        constraint: "re-reading the same chapter four times",
        metrics: { pain: 8.0, demand: 7.6, worsening: 7.0, speed: 7.4 },
      },
      {
        id: "exam-adults",
        title: "Passing a Professional Exam Alongside a Full-Time Job",
        niche: "Professional Exams for Working Adults",
        audience: "adults sitting a professional exam while working",
        outcome: "cover the syllabus on ninety minutes a day",
        constraint: "taking unpaid leave to cram",
        metrics: { pain: 8.4, demand: 7.4, worsening: 6.8, speed: 6.6 },
      },
    ],
  },
  {
    id: "career",
    industry: "Career & Interviewing",
    thesis:
      "A hiring market where capable people lose to better storytellers.",
    opportunities: [
      {
        id: "interview-answers",
        title: "Answering Interview Questions Clearly Under Pressure",
        niche: "Mid-Career Interview Performance",
        audience: "mid-career professionals who ramble under pressure",
        outcome: "answer clearly and stop underselling their own work",
        constraint: "sounding rehearsed or arrogant",
        metrics: { pain: 8.2, demand: 7.8, worsening: 7.0, speed: 8.0 },
      },
      {
        id: "salary-negotiation",
        title: "Negotiating an Offer Without Talking Yourself Down",
        niche: "Offer Negotiation",
        audience: "candidates who accept the first number offered",
        outcome: "negotiate the offer they actually wanted",
        constraint: "risking the offer or sounding greedy",
        metrics: { pain: 7.8, demand: 7.6, worsening: 6.6, speed: 8.4 },
      },
    ],
  },
  {
    id: "small-business",
    industry: "Small Business & Clients",
    thesis:
      "New consultants have the skill and no pipeline, and buy solutions immediately.",
    opportunities: [
      {
        id: "first-clients",
        title: "Landing the First Ten Clients Without Cold Outreach",
        niche: "Early Consulting Pipeline",
        audience: "newly independent consultants",
        outcome: "land their first ten clients from people who already know them",
        constraint: "cold email or building an audience first",
        metrics: { pain: 8.4, demand: 7.6, worsening: 7.2, speed: 7.4 },
      },
    ],
  },
  {
    id: "home-office",
    industry: "Desk Health & Ergonomics",
    thesis:
      "Remote work made a slow, universal ache that people delay treating for years.",
    opportunities: [
      {
        id: "desk-back",
        title: "Reducing Daily Back Pain From Long Hours at a Desk",
        niche: "Desk-Related Back Pain",
        audience: "desk workers with constant low-grade stiffness",
        outcome: "get through an afternoon without the ache",
        constraint: "expensive clinic visits or a new chair",
        metrics: { pain: 7.8, demand: 7.4, worsening: 7.8, speed: 8.8 },
      },
    ],
  },
  {
    id: "decluttering",
    industry: "Decluttering & Small Spaces",
    thesis:
      "Renters in small homes buy storage instead of making decisions, forever.",
    opportunities: [
      {
        id: "small-space",
        title: "Clearing a Small Flat Without Buying More Storage",
        niche: "Small-Space Decluttering",
        audience: "renters whose flat refills within a month",
        outcome: "clear the space and keep it clear",
        constraint: "buying another set of boxes",
        metrics: { pain: 6.8, demand: 7.4, worsening: 6.6, speed: 8.8 },
      },
      {
        id: "paper-clutter",
        title: "Clearing the Paper Pile That Rebuilds Itself Every Week",
        niche: "Household Paper Management",
        audience: "households with a surface that collects all the post",
        outcome: "clear the paper pile and stop it returning",
        constraint: "scanning years of documents first",
        metrics: { pain: 6.8, demand: 7.0, worsening: 6.4, speed: 8.8 },
      },
    ],
  },
  {
    id: "neurodivergent",
    industry: "Focus & Executive Function",
    thesis:
      "Late-diagnosed adults are underserved by productivity advice that assumes a working reward system.",
    opportunities: [
      {
        id: "finishing",
        title: "Finishing What You Start Without Relying on Motivation",
        niche: "Task Follow-Through With ADHD",
        audience: "adults with ADHD sitting on half-finished projects",
        outcome: "get the last ten percent of a project actually finished",
        constraint: "another productivity system they will abandon in nine days",
        metrics: { pain: 8.8, demand: 8.0, worsening: 7.4, speed: 7.0 },
      },
    ],
  },
];

/** Every opportunity in the corpus, flattened, with its direction attached. */
export function allOpportunities(): {
  direction: DirectionSeed;
  opportunity: OpportunitySeed;
}[] {
  return DIRECTIONS.flatMap((direction) =>
    direction.opportunities.map((opportunity) => ({ direction, opportunity })),
  );
}
