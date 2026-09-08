import clsx from "clsx";
import { Image as ImageIcon, PenLine, Target } from "lucide-react";
import type { StepId } from "@/lib/types";

const ICONS = { niche: Target, script: PenLine, render: ImageIcon } as const;
const ORDER: StepId[] = ["niche", "script", "render"];
const LABEL: Record<StepId, string> = {
  niche: "Niche",
  script: "Script",
  render: "Render",
};

export function Stepper({
  step,
  progress,
}: {
  step: StepId;
  /** 0–1 within the whole build, driving the bar under the row. */
  progress: number;
}) {
  const activeIndex = ORDER.indexOf(step);

  return (
    <div className="card relative overflow-hidden px-5 pt-4 pb-5">
      <ol className="flex items-center">
        {ORDER.map((id, i) => {
          const Icon = ICONS[id];
          const state =
            i < activeIndex ? "done" : i === activeIndex ? "active" : "todo";
          return (
            <li
              key={id}
              className={clsx("flex items-center", i > 0 && "flex-1")}
            >
              {i > 0 && (
                <div
                  className={clsx(
                    "mx-5 h-px flex-1",
                    state === "todo" ? "bg-line" : "bg-brand-200",
                  )}
                />
              )}
              <div className="flex items-center gap-3">
                <span
                  className={clsx(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                    state === "todo"
                      ? "bg-line-soft text-faint"
                      : "bg-brand-100 text-brand-600",
                  )}
                >
                  <Icon size={15} strokeWidth={1.9} />
                </span>
                <span>
                  <span
                    className={clsx(
                      "block text-[10px] font-semibold uppercase tracking-[0.13em]",
                      state === "todo" ? "text-faint" : "text-brand-500",
                    )}
                  >
                    Step {i + 1}
                  </span>
                  <span
                    className={clsx(
                      "block text-[14px] font-semibold",
                      state === "todo" ? "text-faint" : "text-ink",
                    )}
                  >
                    {LABEL[id]}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-line-soft">
        <div
          className="h-full rounded-r-full bg-brand-600 transition-[width] duration-700 ease-out"
          style={{ width: `${Math.min(100, Math.max(2, progress * 100))}%` }}
        />
      </div>
    </div>
  );
}
