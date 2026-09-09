import { Composer } from "@/components/home/Composer";
import { allOpportunities } from "@/lib/discovery/directions";
import { scoreOf } from "@/lib/ai/corpus";

export const dynamic = "force-dynamic";

/**
 * Home is the composer. "Trending offers" is the top of the live corpus by
 * opportunity score — the same ranking the explorer would reach, surfaced up
 * front for anyone who wants a starting point rather than a blank box.
 */
export default function Home() {
  const trending = allOpportunities()
    .map(({ direction, opportunity }) => ({
      label: `${opportunity.title} · ${direction.industry}`,
      score: scoreOf(opportunity.metrics),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((t) => t.label);

  return <Composer trending={trending} />;
}
