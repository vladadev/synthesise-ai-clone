import clsx from "clsx";
import { metricTone } from "@/lib/format";

const TONE = {
  strong: "bg-emerald-500",
  fair: "bg-amber-500",
  weak: "bg-rose-500",
} as const;

/** One PAIN / DEMAND / SPEED reading: label, track, value. */
export function MetricBar({
  label,
  value,
  variant = "compact",
}: {
  label: string;
  value: number;
  variant?: "compact" | "wide";
}) {
  const pending = value <= 0;
  const tone = TONE[metricTone(value)];

  return (
    <div
      className={clsx(
        "min-w-0",
        variant === "wide" && "flex items-center gap-3",
      )}
    >
      <div
        className={clsx(
          "flex items-baseline justify-between gap-2",
          variant === "wide" && "w-[92px] shrink-0 justify-start",
        )}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-faint">
          {label}
        </span>
        {variant === "compact" && (
          <span className="text-[11.5px] font-semibold tabular-nums text-ink-soft">
            {value.toFixed(1)}
          </span>
        )}
      </div>

      <div
        className={clsx(
          "h-[3px] overflow-hidden rounded-full bg-line-soft",
          variant === "compact" ? "mt-1.5" : "min-w-0 flex-1",
        )}
      >
        <div
          className={clsx(
            "h-full rounded-full transition-[width] duration-500 ease-out",
            variant === "wide" ? "bg-brand-600" : tone,
          )}
          style={{ width: pending ? "0%" : `${Math.min(100, value * 10)}%` }}
        />
      </div>

      {variant === "wide" && (
        <span className="w-9 shrink-0 text-right text-[12.5px] font-semibold tabular-nums text-ink-soft">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
