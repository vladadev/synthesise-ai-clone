"use client";

import Link from "next/link";
import { Loader2, Trash2 } from "lucide-react";
import clsx from "clsx";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { STATUS_LABEL, relativeTime } from "@/lib/format";
import { languageLabel, type OfferSummary } from "@/lib/types";

const RUNNING = new Set(["queued", "niche", "script", "render"]);

export function OfferCard({
  offer,
  onDelete,
}: {
  offer: OfferSummary;
  onDelete: (id: string) => void;
}) {
  const running = RUNNING.has(offer.status);
  const palette = offer.palette ?? ["#e8e8ee", "#f4f2ff"];

  return (
    <div className="group relative">
      <Link
        href={`/offers/${offer.id}`}
        className="card block overflow-hidden transition hover:border-brand-200 hover:shadow-[0_8px_28px_-14px_rgba(16,19,34,0.25)]"
      >
        {/* Cover strip — the rendered palette, or a placeholder while building. */}
        <div
          className="h-[86px] w-full"
          style={{
            background: `linear-gradient(118deg, ${palette[0]}, ${palette[1]})`,
          }}
        />

        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[10.5px] font-semibold uppercase tracking-[0.11em] text-faint">
              {offer.industry ?? "Scanning"}
              {offer.niche && (
                <span className="ml-2 font-normal tracking-normal normal-case text-muted">
                  {offer.niche}
                </span>
              )}
            </span>
            <ScoreBadge score={offer.score} />
          </div>

          <h3 className="mt-2.5 line-clamp-2 text-[14.5px] leading-snug font-semibold text-ink">
            {offer.headline ?? offer.topic}
          </h3>

          <div className="mt-4 flex items-center gap-2 text-[11.5px] text-muted">
            <span
              className={clsx(
                "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium",
                running && "bg-brand-50 text-brand-600",
                offer.status === "ready" && "bg-emerald-50 text-emerald-700",
                offer.status === "failed" && "bg-rose-50 text-rose-600",
              )}
            >
              {running && <Loader2 size={11} className="animate-spin" />}
              {STATUS_LABEL[offer.status]}
            </span>
            <span aria-hidden="true">·</span>
            <span>{relativeTime(offer.updatedAt)}</span>
            {offer.wordCount != null && (
              <>
                <span aria-hidden="true">·</span>
                <span>{offer.wordCount.toLocaleString()} words</span>
              </>
            )}
            <span className="ml-auto" title={languageLabel(offer.language).label}>
              {languageLabel(offer.language).flag}
            </span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => onDelete(offer.id)}
        aria-label={`Delete ${offer.topic}`}
        className="absolute top-3 right-3 rounded-md bg-white/85 p-1.5 text-muted opacity-0 backdrop-blur-sm transition group-hover:opacity-100 hover:text-rose-600 focus-visible:opacity-100"
      >
        <Trash2 size={14} strokeWidth={1.8} />
      </button>
    </div>
  );
}
