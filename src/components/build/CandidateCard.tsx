import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { MetricBar } from "@/components/ui/MetricBar";
import type { Candidate } from "@/lib/types";

/** One card in the weighing grid. Drafting cards show the label and nothing else. */
export function CandidateCard({ candidate }: { candidate: Candidate }) {
  const drafting = candidate.state === "drafting";

  return (
    <article className="card flex flex-col p-4 animate-rise">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span className="rounded-md bg-line-soft px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.09em] text-ink-soft">
            {candidate.industry}
          </span>
          <span className="truncate text-[12.5px] text-muted">
            {candidate.niche}
          </span>
        </div>
        <ScoreBadge score={drafting ? null : candidate.score} />
      </div>

      {drafting ? (
        <p className="mt-3.5 text-[15px] leading-snug font-semibold text-faint caret">
          Drafting
        </p>
      ) : (
        <>
          <h3 className="mt-3 text-[15px] leading-snug font-semibold text-ink">
            {candidate.headline}
          </h3>
          <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-ink-soft">
            {candidate.rationale}
          </p>
        </>
      )}

      <div className="mt-auto grid grid-cols-3 gap-3 pt-5">
        <MetricBar label="Pain" value={candidate.metrics.pain} />
        <MetricBar label="Demand" value={candidate.metrics.demand} />
        <MetricBar label="Speed" value={candidate.metrics.speed} />
      </div>
    </article>
  );
}
