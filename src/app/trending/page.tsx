import { TopBar } from "@/components/shell/TopBar";
import { PageHeader } from "@/components/shell/PageHeader";
import { allOpportunities, statementOf } from "@/lib/discovery/directions";
import { scoreOf } from "@/lib/ai/corpus";
import { MetricBar } from "@/components/ui/MetricBar";

export const dynamic = "force-dynamic";

/**
 * The whole opportunity corpus, ranked. This is the same field the explorer
 * draws from, shown in full so nothing about the ranking is hidden.
 */
export default function TrendingPage() {
  const rows = allOpportunities()
    .map(({ direction, opportunity }) => ({
      id: opportunity.id,
      industry: direction.industry,
      niche: opportunity.niche,
      statement: statementOf(opportunity),
      metrics: opportunity.metrics,
      score: scoreOf(opportunity.metrics),
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <>
      <TopBar crumbs={[{ label: "Trending" }]} />
      <div className="scroll-slim flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1560px] px-8 py-6">
          <PageHeader
            title="Trending offers"
            blurb={`Every opportunity in the current market model, ranked by the same score the explorer uses. ${rows.length} tracked across ${new Set(rows.map((r) => r.industry)).size} industries.`}
          />

          <ul className="mt-6 grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
            {rows.map((r, i) => (
              <li key={r.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="truncate text-[10.5px] font-semibold tracking-[0.1em] text-faint uppercase">
                    #{i + 1} · {r.industry}
                  </span>
                  <span className="shrink-0 text-[13px] font-semibold tabular-nums text-ink">
                    {r.score.toFixed(1)}
                  </span>
                </div>
                <p className="mt-2 text-[13.5px] leading-snug text-ink">
                  {r.statement}
                </p>
                <p className="mt-1 truncate text-[12px] text-muted">{r.niche}</p>
                <div className="mt-4 grid grid-cols-4 gap-3">
                  <MetricBar label="Pain" value={r.metrics.pain} />
                  <MetricBar label="Demand" value={r.metrics.demand} />
                  <MetricBar label="Worse" value={r.metrics.worsening} />
                  <MetricBar label="Speed" value={r.metrics.speed} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
