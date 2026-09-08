import { CircleCheck } from "lucide-react";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { MetricBar } from "@/components/ui/MetricBar";
import type { Candidate } from "@/lib/types";

/** The locked-in niche: the full card the run committed to. */
export function WinnerCard({
  candidate,
  topic,
}: {
  candidate: Candidate;
  topic: string;
}) {
  return (
    <article className="card p-6 animate-rise lg:p-7">
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-2 py-1 text-[11px] font-semibold tracking-[0.06em] text-brand-600 uppercase">
          <CircleCheck size={13} strokeWidth={2.1} />
          Winner
        </span>
        <ScoreBadge score={candidate.score} tone="brand" size="lg" />
      </div>

      <p className="mt-5 text-[11px] font-semibold tracking-[0.12em] text-faint uppercase">
        {topic}
      </p>
      <h2 className="mt-2 text-[24px] leading-[1.22] font-semibold tracking-[-0.015em] text-ink lg:text-[27px]">
        {candidate.headline}
      </h2>

      <div className="mt-4 flex flex-wrap gap-2">
        <Tag label="Industry" value={titleize(candidate.industry)} />
        <Tag label="Niche" value={candidate.niche} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Specific knowledge" body={candidate.specificKnowledge} />
        <Panel title="Problem solved" body={candidate.problemSolved} />
      </div>

      <div className="mt-7 grid gap-x-10 gap-y-3 sm:grid-cols-2">
        <MetricBar label="Pain" value={candidate.metrics.pain} variant="wide" />
        <MetricBar label="Worsening" value={candidate.metrics.worsening} variant="wide" />
        <MetricBar label="Demand" value={candidate.metrics.demand} variant="wide" />
        <MetricBar label="Speed" value={candidate.metrics.speed} variant="wide" />
      </div>
    </article>
  );
}

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-[12.5px]">
      <span className="text-[10px] font-semibold tracking-[0.09em] text-faint uppercase">
        {label}
      </span>
      <span className="font-medium text-ink">{value}</span>
    </span>
  );
}

function Panel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="border-l-2 border-brand-400 pl-2.5 text-[10.5px] font-semibold tracking-[0.1em] text-faint uppercase">
        {title}
      </p>
      <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}

function titleize(value: string): string {
  return value
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
