import clsx from "clsx";
import { Check } from "lucide-react";
import { DISCOVERY_STAGES, type DiscoveryStage } from "@/lib/types";

const ORDER: DiscoveryStage[] = ["directions", "brainstorm", "score"];

/**
 * Directions ── Brainstorm ── Score.
 *
 * Each stage owns a track that fills while it runs and ticks when it is done,
 * so the row reads as progress rather than as three separate labels.
 */
export function StageBar({
  stage,
  progress,
}: {
  stage: DiscoveryStage;
  /** 0–1 within the *current* stage. */
  progress: number;
}) {
  const activeIndex = stage === "ready" ? ORDER.length : ORDER.indexOf(stage);

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {DISCOVERY_STAGES.map(({ id, label }, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        const fill = done ? 1 : active ? progress : 0;

        return (
          <div key={id} className="flex min-w-0 flex-1 items-center gap-2.5">
            <span
              className={clsx(
                "flex shrink-0 items-center gap-1.5 text-[13px] font-medium",
                done && "text-ink-soft",
                active && "text-ink",
                !done && !active && "text-faint",
              )}
            >
              {done ? (
                <Check size={13} strokeWidth={2.4} className="text-ink-soft" />
              ) : (
                <span
                  className={clsx(
                    "h-[7px] w-[7px] rounded-full",
                    active ? "bg-brand-600" : "border border-line bg-white",
                  )}
                />
              )}
              {label}
            </span>

            <div className="h-[3px] min-w-0 flex-1 overflow-hidden rounded-full bg-line-soft">
              <div
                className="h-full rounded-full bg-linear-to-r from-brand-600 to-brand-400 transition-[width] duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, fill * 100))}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
