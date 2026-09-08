import clsx from "clsx";

/**
 * The score pill on a candidate card. Amber while it is one of many, indigo
 * once it has won — the same number reads differently in the two contexts.
 */
export function ScoreBadge({
  score,
  tone = "amber",
  size = "sm",
}: {
  score: number | null;
  tone?: "amber" | "brand";
  size?: "sm" | "lg";
}) {
  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center justify-center rounded-md font-semibold tabular-nums",
        size === "sm" ? "min-w-[34px] px-1.5 py-0.5 text-[12px]" : "min-w-[44px] px-2 py-1 text-[13.5px]",
        score === null && "bg-line-soft text-faint",
        score !== null && tone === "amber" && "bg-score-amber-bg text-score-amber-fg",
        score !== null && tone === "brand" && "bg-brand-600 text-white",
      )}
    >
      {score === null ? "—" : score.toFixed(1)}
    </span>
  );
}
