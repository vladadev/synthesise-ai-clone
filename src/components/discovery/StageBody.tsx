"use client";

import clsx from "clsx";
import { ChevronDown, ChevronRight, Clock, Sparkles } from "lucide-react";
import type { Direction, Opportunity } from "@/lib/types";

/** The collapsible "Exploration Details" panel and its per-stage header. */
export function ExplorationPanel({
  open,
  onToggle,
  collapsedLabel,
  title,
  counter,
  progress,
  eta,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  /** Shown on the single row before the panel has anything to show. */
  collapsedLabel: string;
  title: string;
  counter: string | null;
  progress: number;
  eta: string | null;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-t border-line-soft">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition hover:bg-brand-50/40"
      >
        {open ? (
          <ChevronDown size={15} strokeWidth={2} className="shrink-0 text-ink-soft" />
        ) : (
          <ChevronRight size={15} strokeWidth={2} className="shrink-0 text-ink-soft" />
        )}
        <span className="text-[13.5px] font-medium text-ink">
          {open ? "Exploration Details" : collapsedLabel}
        </span>
        {!open && eta && (
          <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[12.5px] text-muted">
            <Clock size={13} strokeWidth={1.9} />
            {eta}
          </span>
        )}
      </button>

      {open && (
        <div className="animate-fade">
          <div className="flex items-center gap-2.5 px-4 pb-2">
            <Sparkles size={14} strokeWidth={1.9} className="shrink-0 text-brand-400" />
            <span className="text-[13.5px] text-ink">{title}</span>
            {counter && (
              <span className="ml-auto shrink-0 text-[12.5px] tabular-nums text-muted">
                {counter}
              </span>
            )}
          </div>
          <div className="mx-4 h-[3px] overflow-hidden rounded-full bg-brand-50">
            <div
              className="h-full rounded-full bg-linear-to-r from-brand-500 to-brand-300 transition-[width] duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(1, progress * 100))}%` }}
            />
          </div>
          {children}
        </div>
      )}
    </div>
  );
}

/** Stage 1 — the industry directions as they are found. */
export function DirectionRows({ directions }: { directions: Direction[] }) {
  return (
    <ul className="mt-2">
      {directions.map((d) => (
        <li
          key={d.id}
          className="flex items-baseline gap-4 border-b border-line-soft px-4 py-[9px] last:border-0 animate-fade"
        >
          <span className="min-w-0 flex-1 truncate text-[13.5px] text-ink">
            {d.thesis}
          </span>
          <span className="shrink-0 text-[12.5px] text-muted">{d.industry}</span>
        </li>
      ))}
    </ul>
  );
}

/** Stage 2 — opportunity titles, right-aligned by industry. */
export function OpportunityRows({
  opportunities,
}: {
  opportunities: Opportunity[];
}) {
  return (
    <ul className="mt-2">
      {opportunities.map((o) => (
        <li
          key={o.id}
          className="flex items-baseline gap-4 border-b border-line-soft px-4 py-[9px] last:border-0 animate-fade"
        >
          <span className="min-w-0 flex-1 truncate text-[13.5px] text-ink">
            {o.title}
          </span>
          <span className="shrink-0 text-[12.5px] text-muted">{o.industry}</span>
        </li>
      ))}
    </ul>
  );
}

/** Stage 3 — the offer statement, its niche, and its score as it arrives. */
export function ScoreRows({
  opportunities,
  ranked,
}: {
  opportunities: Opportunity[];
  /** Once ranked, rows carry a position number instead of a dash. */
  ranked: boolean;
}) {
  return (
    <ul className="mt-2">
      {opportunities.map((o, i) => (
        <li
          key={o.id}
          className="flex items-start gap-4 border-b border-line-soft px-4 py-3 last:border-0"
        >
          <span
            className={clsx(
              "w-5 shrink-0 pt-px text-right text-[12.5px] tabular-nums",
              ranked ? "font-medium text-ink-soft" : "text-faint",
            )}
          >
            {ranked ? i + 1 : "—"}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13.5px] leading-snug text-ink">
              {o.statement}
            </span>
            <span className="mt-0.5 block truncate text-[12px] text-muted">
              {o.industry} · {o.niche}
            </span>
          </span>
          <span
            className={clsx(
              "shrink-0 pt-px text-right text-[12.5px] tabular-nums",
              o.score === null ? "text-faint" : "font-semibold text-ink",
            )}
          >
            {o.score === null ? "Awaiting score" : o.score.toFixed(1)}
          </span>
        </li>
      ))}
    </ul>
  );
}
