import { Download, ImageIcon } from "lucide-react";
import type { Cover } from "@/lib/types";
import { rng } from "@/lib/ids";

/** Step 3: the rendered cover, drawn from the winning niche's palette. */
export function CoverRender({
  cover,
  wordCount,
  sources,
}: {
  cover: Cover | null;
  wordCount: number | null;
  sources: number | null;
}) {
  return (
    <section className="card p-5 lg:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
            <ImageIcon size={15} strokeWidth={1.9} />
          </span>
          <h2 className="eyebrow">{cover ? "Cover rendered" : "Rendering the cover"}</h2>
        </div>
        {wordCount != null && (
          <span className="text-[12.5px] text-muted tabular-nums">
            {wordCount.toLocaleString()} words
            {sources != null && ` · ${sources} sources`}
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        {cover ? (
          <CoverArt cover={cover} />
        ) : (
          <div className="aspect-[3/4] w-full animate-shimmer rounded-xl bg-linear-to-r from-line-soft via-[#e9e9f2] to-line-soft" />
        )}

        {cover && (
          <div className="min-w-0 animate-rise">
            <p className="eyebrow">Ready to publish</p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              The niche is locked, the lead magnet is written, and the cover is
              rendered. Everything below is yours to edit before it goes out —
              the draft is a starting point, not a finished product.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="#script"
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-brand-700"
              >
                <Download size={14} strokeWidth={2} />
                Read the draft
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CoverArt({ cover }: { cover: Cover }) {
  const rand = rng(cover.seed);
  // A handful of deterministic blobs so every cover is distinct but stable.
  const blobs = Array.from({ length: 5 }, () => ({
    cx: 10 + rand() * 80,
    cy: 10 + rand() * 80,
    r: 12 + rand() * 26,
    o: 0.08 + rand() * 0.16,
  }));

  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden rounded-xl shadow-[0_16px_40px_-16px_rgba(16,19,34,0.5)] animate-rise"
      style={{
        background: `linear-gradient(150deg, ${cover.palette[0]}, ${cover.palette[1]})`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {blobs.map((b, i) => (
          <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill="#fff" opacity={b.o} />
        ))}
      </svg>

      <div className="relative flex h-full flex-col justify-between p-6">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-white/75 uppercase">
          {cover.kicker}
        </p>
        <h3 className="text-[24px] leading-[1.15] font-semibold tracking-[-0.015em] text-white">
          {cover.title}
        </h3>
      </div>
    </div>
  );
}
