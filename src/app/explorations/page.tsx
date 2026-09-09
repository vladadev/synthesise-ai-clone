import Link from "next/link";
import { TopBar } from "@/components/shell/TopBar";
import { EmptyRow, PageHeader } from "@/components/shell/PageHeader";
import { listDiscoveries, toDiscoverySummary } from "@/lib/store";
import { relativeTime } from "@/lib/format";

export const dynamic = "force-dynamic";

const STAGE_LABEL: Record<string, string> = {
  directions: "Exploring directions",
  brainstorm: "Brainstorming opportunities",
  score: "Ranking opportunities",
  ready: "Ready to review",
};

export default async function ExplorationsPage() {
  const rows = (await listDiscoveries())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toDiscoverySummary);

  return (
    <>
      <TopBar crumbs={[{ label: "Explorations" }]} />
      <div className="scroll-slim flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1560px] px-8 py-6">
          <PageHeader
            title="Explorations"
            blurb="Every market sweep you have run, with the leading opportunity each one landed on."
          />

          <div className="mt-6">
            {rows.length === 0 ? (
              <EmptyRow>
                No explorations yet.{" "}
                <Link href="/" className="font-medium text-brand-600 hover:underline">
                  Start one from the composer
                </Link>
                .
              </EmptyRow>
            ) : (
              <ul className="overflow-hidden rounded-xl border border-line bg-white">
                {rows.map((d) => (
                  <li key={d.id} className="border-b border-line-soft last:border-0">
                    <Link
                      href={`/discover/${d.id}`}
                      className="flex items-start gap-4 px-5 py-3.5 transition hover:bg-brand-50/40"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-medium text-ink">
                          {d.seed || "Untitled exploration"}
                        </span>
                        <span className="mt-0.5 block truncate text-[12.5px] text-muted">
                          {d.leader ?? STAGE_LABEL[d.stage] ?? d.stage}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-[12.5px] tabular-nums text-muted">
                          {relativeTime(d.updatedAt)}
                        </span>
                        <span className="mt-0.5 block text-[12px] text-faint">
                          {d.evaluated > 0
                            ? `${d.evaluated} evaluated · ${d.shortlisted} shortlisted`
                            : STAGE_LABEL[d.stage]}
                        </span>
                      </span>
                      {d.leaderScore !== null && (
                        <span className="w-9 shrink-0 text-right text-[13px] font-semibold tabular-nums text-ink">
                          {d.leaderScore.toFixed(1)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
