import { TopBar } from "@/components/shell/TopBar";
import { PageHeader } from "@/components/shell/PageHeader";
import { DIRECTIONS, allOpportunities } from "@/lib/discovery/directions";

export const dynamic = "force-dynamic";

const STAGES = [
  {
    name: "Directions",
    body: "Sweeps the market model for the industries worth exploring at all. Anything you typed in the composer re-orders this list, because your own knowledge is evidence about demand rather than just a filter.",
  },
  {
    name: "Brainstorm",
    body: "Turns each direction into concrete opportunities — a specific audience with a specific painful problem, never a category. One direction usually yields one or two.",
  },
  {
    name: "Score",
    body: "Scores every opportunity on four axes, ranks them, and cuts a shortlist. The leader and the average are both shown, because a leader that is barely above average is a weak field, not a strong pick.",
  },
  {
    name: "Build",
    body: "Takes one shortlisted opportunity and writes the lead magnet: a named framework, five numbered moves that each end on a rule, a way to tell it is working, and a close. Then it renders the cover.",
  },
];

export default function HelpPage() {
  const opportunities = allOpportunities().length;

  return (
    <>
      <TopBar crumbs={[{ label: "How it works" }]} />
      <div className="scroll-slim flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[820px] px-8 py-6 pb-16">
          <PageHeader
            title="How it works"
            blurb="What each stage actually does, and what the numbers mean."
          />

          <ol className="mt-7 flex flex-col gap-5">
            {STAGES.map((s, i) => (
              <li key={s.name} className="flex gap-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-100 text-[12px] font-semibold text-brand-700">
                  {i + 1}
                </span>
                <span>
                  <span className="block text-[14.5px] font-semibold text-ink">
                    {s.name}
                  </span>
                  <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-soft">
                    {s.body}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <h2 className="mt-10 text-[15px] font-semibold text-ink">The score</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
            Every opportunity is scored on four axes from 0 to 10, then combined:
          </p>
          <p className="mt-3 rounded-lg bg-ink px-5 py-3.5 text-[13.5px] font-medium text-white">
            score = (3 × pain + 2 × demand + 2 × worsening + speed) ÷ 8
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-[13.5px] leading-relaxed text-ink-soft">
            <li>
              <strong className="font-semibold text-ink">Pain</strong> — how much
              this hurts right now. Weighted heaviest, because a product nobody
              hurts for does not sell.
            </li>
            <li>
              <strong className="font-semibold text-ink">Demand</strong> — how
              many people are actively looking for a solution today.
            </li>
            <li>
              <strong className="font-semibold text-ink">Worsening</strong> —
              whether the problem is getting worse. A painful problem that is
              fading is a bad place to start.
            </li>
            <li>
              <strong className="font-semibold text-ink">Speed</strong> — how
              quickly a buyer feels a result. Weighted lightest: slow-to-deliver
              is a scheduling problem, not a demand problem.
            </li>
          </ul>

          <h2 className="mt-10 text-[15px] font-semibold text-ink">
            Where the numbers come from
          </h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
            This workspace runs on a market model of {opportunities} opportunities
            across {DIRECTIONS.length} industry directions. Without an API key the
            scores are hand-assigned and the runs are deterministic — the same
            input always produces the same field, which makes the pipeline
            testable. With <code className="rounded bg-line-soft px-1 py-0.5 text-[12.5px]">ANTHROPIC_API_KEY</code>{" "}
            set, the model proposes and scores the field instead.
          </p>
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
            Either way the scores are an opinion, not a measurement. Nothing here
            queries a live marketplace, and no number on these pages should be
            read as verified demand.
          </p>
        </div>
      </div>
    </>
  );
}
