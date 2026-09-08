"use client";

import { ArrowLeft, TriangleAlert } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { Stepper } from "./Stepper";
import { NicheStep } from "./NicheStep";
import { ScriptView } from "./ScriptView";
import { CoverRender } from "./CoverRender";
import { useOfferStream } from "@/hooks/useOfferStream";
import { STATUS_LABEL } from "@/lib/format";
import type { Offer } from "@/lib/types";

/** The whole three-step build, driven off the event stream. */
export function BuildView({ offer }: { offer: Offer }) {
  const state = useOfferStream(offer);

  const scored = state.candidates.filter((c) => c.state === "scored").length;
  const progress = computeProgress(state.step, {
    scored,
    total: state.total,
    sections: state.sections.length,
    locked: Boolean(state.winnerId),
    done: state.status === "ready",
  });

  const showScript = state.scriptMeta !== null;
  const showCover = state.step === "render";

  return (
    <div className="scroll-slim flex-1 overflow-y-auto bg-canvas-tint">
      <div className="mx-auto max-w-[1560px] px-9 py-7">
        {/* Heading */}
        <div className="flex items-start gap-3">
          <Link
            href="/offers"
            aria-label="Back to offers"
            className="mt-1 rounded-md p-1 text-faint transition-colors hover:bg-line-soft hover:text-ink"
          >
            <ArrowLeft size={18} strokeWidth={1.9} />
          </Link>
          <div className="min-w-0">
            <h1 className="text-[22px] leading-tight font-semibold tracking-[-0.015em] text-ink">
              Building your AI Digital Product
            </h1>
            <p className="mt-1 text-[13.5px] text-muted">
              Three steps: lock in the niche, write the script, then render the
              final cover.
            </p>
          </div>
        </div>

        {/* Topic + live status chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-line bg-white px-3 py-1.5 text-[12.5px] text-ink-soft">
            Topic: {offer.topic}
          </span>
          <span
            className={clsx(
              "rounded-full px-3 py-1.5 text-[12.5px] font-medium",
              state.status === "failed"
                ? "bg-rose-600 text-white"
                : "bg-ink text-white",
            )}
          >
            {STATUS_LABEL[state.status]}
          </span>
        </div>

        <div className="mt-5">
          <Stepper step={state.step} progress={progress} />
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

        {/* Step 1 */}
        {state.candidates.length > 0 && (
          <div className="mt-5">
            <NicheStep
              candidates={state.candidates}
              total={state.total}
              winnerId={state.winnerId}
              topic={offer.topic}
              nextLabel={
                state.step === "niche"
                  ? "Writing the script next"
                  : state.status === "ready"
                    ? "Done"
                    : "Rendering next"
              }
            />
          </div>
        )}

        {/* Step 3 sits above the reader once the cover exists, as in the product. */}
        {showCover && (
          <div className="mt-5">
            <CoverRender
              cover={state.cover}
              wordCount={state.wordCount}
              sources={state.sources}
            />
          </div>
        )}

        {/* Step 2 */}
        {showScript && (
          <div id="script" className="mt-5 card px-6 py-9 lg:px-12 lg:py-12">
            <ScriptView
              meta={state.scriptMeta}
              sections={state.sections}
              streaming={state.live && state.step === "script"}
            />
          </div>
        )}

        {state.candidates.length === 0 && !state.error && (
          <p className="mt-8 text-[13.5px] text-muted caret">
            Scanning the market for profitable pockets
          </p>
        )}
      </div>
    </div>
  );
}

/** Progress across the whole build, weighted so each step owns a third. */
function computeProgress(
  step: Offer["status"] | "niche" | "script" | "render",
  parts: {
    scored: number;
    total: number;
    sections: number;
    locked: boolean;
    done: boolean;
  },
): number {
  if (parts.done) return 1;
  if (step === "niche") {
    const share = parts.total > 0 ? parts.scored / parts.total : 0;
    return (parts.locked ? 1 : share * 0.9) / 3;
  }
  if (step === "script") {
    // Eight sections is the standard shape: opening, five moves, signals, close.
    return 1 / 3 + Math.min(1, parts.sections / 8) / 3;
  }
  return 2 / 3 + 0.25 / 3;
}
