"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { StageBar } from "./StageBar";
import {
  DirectionRows,
  ExplorationPanel,
  OpportunityRows,
  ScoreRows,
} from "./StageBody";
import { useDiscoveryStream } from "@/hooks/useDiscoveryStream";
import type { Discovery } from "@/lib/types";

/** The whole exploration: three stages, then a ranked shortlist to act on. */
export function DiscoveryView({ discovery }: { discovery: Discovery }) {
  const router = useRouter();
  const state = useDiscoveryStream(discovery);
  const [open, setOpen] = useState(discovery.stage !== "directions");
  const [toast, setToast] = useState(false);
  const [building, setBuilding] = useState<string | null>(null);

  // Details open by themselves as soon as there is something worth seeing.
  useEffect(() => {
    if (state.stage !== "directions") setOpen(true);
  }, [state.stage]);

  useEffect(() => {
    if (!state.justFinished) return;
    setToast(true);
    const timer = setTimeout(() => setToast(false), 4200);
    return () => clearTimeout(timer);
  }, [state.justFinished]);

  const view = useMemo(() => {
    switch (state.stage) {
      case "directions":
        return {
          collapsed: "Exploring directions, finding the industry directions worth exploring",
          title: "Exploring directions, finding the industry directions worth exploring",
          counter: state.directionsExplored
            ? `${state.directionsExplored} of ${discovery.directionTarget} directions`
            : null,
          progress: state.directionsExplored / discovery.directionTarget,
          eta: "Typically 1-2 minutes.",
        };
      case "brainstorm":
        return {
          collapsed: "Turning directions into opportunities",
          title: "Turning directions into opportunities",
          counter: `${state.directionsExplored} directions explored`,
          progress: state.opportunities.length / discovery.opportunityTarget,
          eta: "Typically 1-2 minutes.",
        };
      case "score":
        return {
          collapsed: "Ranking opportunities",
          title: "Ranking opportunities",
          counter: `${state.scoredCount} of ${state.opportunities.length} scored`,
          progress: state.scoredCount / Math.max(1, state.opportunities.length),
          eta: "Typically under a minute.",
        };
      default:
        return {
          collapsed: "Preparing your shortlist",
          title: "Preparing your shortlist",
          counter: `${state.evaluated ?? state.opportunities.length} evaluated · ${
            state.shortlisted ?? 0
          } ready to review`,
          progress: 1,
          eta: null,
        };
    }
  }, [state, discovery]);

  const stageProgress =
    state.stage === "ready" ? 1 : Math.min(1, Math.max(0, view.progress));

  const leader =
    state.opportunities.find((o) => o.id === state.leaderId) ?? null;

  /** Take a shortlisted opportunity through to a written offer. */
  async function build(opportunityId: string) {
    if (building) return;
    setBuilding(opportunityId);
    const opportunity = state.opportunities.find((o) => o.id === opportunityId);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunity,
          topic: discovery.seed,
          mode: discovery.mode,
          language: discovery.language,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start the build.");
      router.push(`/offers/${data.offer.id}`);
    } catch {
      setBuilding(null);
    }
  }

  return (
    <div className="scroll-slim relative flex-1 overflow-y-auto">
      {toast && (
        <div
          role="status"
          className="fixed top-4 right-5 z-40 flex items-center gap-2 rounded-xl bg-[#3b3b46] px-4 py-2.5 text-[13px] font-medium text-white shadow-[0_16px_40px_-12px_rgba(16,19,34,0.5)] animate-pop"
        >
          <CircleCheck size={15} strokeWidth={2.1} />
          Profitable Pocket generated successfully!
        </div>
      )}

      <div className="mx-auto max-w-[1560px] px-8 py-6">
        <h1 className="text-[24px] leading-tight font-semibold tracking-[-0.02em] text-ink">
          Discover Your Profitable Pocket
        </h1>
        <p className="mt-1.5 text-[13.5px] text-muted">
          Your profitable pocket is being developed into structured opportunities
          you can review, refine, and use to build your offer.
        </p>

        <div className="mt-5 rounded-xl border border-line bg-white">
          <StageBar stage={state.stage} progress={stageProgress} />

          <ExplorationPanel
            open={open}
            onToggle={() => setOpen((o) => !o)}
            collapsedLabel={view.collapsed}
            title={view.title}
            counter={view.counter}
            progress={view.progress}
            eta={view.eta}
          >
            {state.stage === "directions" && (
              <DirectionRows directions={state.directions} />
            )}

            {state.stage === "brainstorm" && (
              <OpportunityRows opportunities={state.opportunities} />
            )}

            {state.stage === "score" && (
              <ScoreRows opportunities={state.opportunities} ranked={false} />
            )}

            {state.stage === "ready" && (
              <>
                {leader && (
                  <div className="mt-3 border-b border-line-soft px-4 pb-3">
                    <p className="text-[11px] font-medium text-muted">
                      Current leader
                    </p>
                    <div className="mt-0.5 flex items-start gap-4">
                      <p className="min-w-0 flex-1 text-[13.5px] leading-snug text-ink">
                        {leader.statement}
                      </p>
                      <span className="shrink-0 text-[13px] font-semibold tabular-nums text-ink">
                        {leader.score?.toFixed(1)}
                      </span>
                    </div>
                    {state.average !== null && (
                      <p className="mt-1 text-[11.5px] text-muted">
                        Average scored{" "}
                        <span className="tabular-nums">
                          {state.average.toFixed(1)}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                <ShortlistRows
                  opportunities={state.opportunities.slice(
                    0,
                    state.shortlisted ?? discovery.shortlistTarget,
                  )}
                  onBuild={build}
                  building={building}
                />
              </>
            )}
          </ExplorationPanel>
        </div>

        {state.error && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-[13.5px] text-rose-700"
          >
            <TriangleAlert size={17} strokeWidth={1.9} className="mt-px shrink-0" />
            <p>{state.error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ShortlistRows({
  opportunities,
  onBuild,
  building,
}: {
  opportunities: import("@/lib/types").Opportunity[];
  onBuild: (id: string) => void;
  building: string | null;
}) {
  return (
    <ul className="mt-2">
      {opportunities.map((o, i) => (
        <li
          key={o.id}
          className="group flex items-start gap-4 border-b border-line-soft px-4 py-3 last:border-0"
        >
          <span className="w-5 shrink-0 pt-px text-right text-[12.5px] font-medium tabular-nums text-ink-soft">
            {i + 1}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13.5px] leading-snug text-ink">
              {o.statement}
            </span>
            <span className="mt-0.5 flex flex-wrap items-center gap-2">
              <span className="truncate text-[12px] text-muted">
                {o.industry} · {o.niche}
              </span>
              {o.matchesSeed && (
                <span className="rounded bg-brand-50 px-1.5 py-px text-[10.5px] font-medium text-brand-700">
                  matches what you know
                </span>
              )}
            </span>
          </span>
          <button
            type="button"
            onClick={() => onBuild(o.id)}
            disabled={building !== null}
            className="shrink-0 rounded-lg border border-line px-2.5 py-1 text-[12px] font-medium text-ink-soft opacity-0 transition group-hover:opacity-100 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus-visible:opacity-100 disabled:opacity-40"
          >
            {building === o.id ? "Starting…" : "Build this"}
          </button>
          <span className="shrink-0 pt-px text-right text-[12.5px] font-semibold tabular-nums text-ink">
            {o.score?.toFixed(1)}
          </span>
        </li>
      ))}
    </ul>
  );
}
