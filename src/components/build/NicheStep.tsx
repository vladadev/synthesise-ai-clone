import { Target } from "lucide-react";
import { CandidateCard } from "./CandidateCard";
import { WinnerCard } from "./WinnerCard";
import { CandidateSkeleton } from "@/components/ui/Skeleton";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import type { Candidate } from "@/lib/types";

/** Step 1: the field being weighed, then the one it committed to. */
export function NicheStep({
  candidates,
  total,
  winnerId,
  topic,
  nextLabel,
}: {
  candidates: Candidate[];
  total: number;
  winnerId: string | null;
  topic: string;
  nextLabel: string;
}) {
  const scored = candidates.filter((c) => c.state === "scored").length;
  const winner = candidates.find((c) => c.id === winnerId) ?? null;
  const pending = Math.max(0, total - candidates.length);

  if (winner) {
    const alsoConsidered = candidates
      .filter((c) => c.id !== winner.id && c.state === "scored")
      .sort((a, b) => b.score - a.score);

    return (
      <section className="card p-5 lg:p-6">
        <Header title="Niche locked in" right={nextLabel} />

        <div className="mt-6 grid gap-5 lg:grid-cols-[248px_minmax(0,1fr)]">
          <div className="min-w-0">
            <p className="eyebrow">Also considered</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {alsoConsidered.map((c) => (
                <li key={c.id} className="card p-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="truncate text-[10px] font-semibold tracking-[0.1em] text-faint uppercase">
                      {c.industry}
                    </span>
                    <ScoreBadge score={c.score} />
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-snug text-ink-soft">
                    {c.headline}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <WinnerCard candidate={winner} topic={topic} />
        </div>
      </section>
    );
  }

  return (
    <section className="card p-5 lg:p-6">
      <Header
        title="Weighing candidates"
        right={`${scored} / ${total}`}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {candidates.map((c, i) => (
          <CandidateCard key={`${c.id}-${i}`} candidate={c} />
        ))}
        {Array.from({ length: pending }, (_, i) => (
          <CandidateSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    </section>
  );
}

function Header({ title, right }: { title: string; right: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
          <Target size={15} strokeWidth={1.9} />
        </span>
        <h2 className="eyebrow">{title}</h2>
      </div>
      <span className="shrink-0 text-[12.5px] tabular-nums text-muted">{right}</span>
    </div>
  );
}
