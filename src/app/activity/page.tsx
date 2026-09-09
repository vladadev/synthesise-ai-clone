import Link from "next/link";
import { TopBar } from "@/components/shell/TopBar";
import { EmptyRow, PageHeader } from "@/components/shell/PageHeader";
import { listDiscoveries, listOffers } from "@/lib/store";
import { STATUS_LABEL, relativeTime, truncate } from "@/lib/format";

export const dynamic = "force-dynamic";

interface Entry {
  id: string;
  href: string;
  when: string;
  title: string;
  detail: string;
}

export default async function ActivityPage() {
  const [offers, discoveries] = await Promise.all([
    listOffers(),
    listDiscoveries(),
  ]);

  const entries: Entry[] = [
    ...discoveries.map((d) => ({
      id: `d-${d.id}`,
      href: `/discover/${d.id}`,
      when: d.updatedAt,
      title:
        d.stage === "ready"
          ? "Profitable pocket generated"
          : "Exploration in progress",
      detail: d.seed ? truncate(d.seed, 90) : "Untitled exploration",
    })),
    ...offers.map((o) => ({
      id: `o-${o.id}`,
      href: `/offers/${o.id}`,
      when: o.updatedAt,
      title:
        o.status === "ready"
          ? "Offer ready"
          : `Offer · ${STATUS_LABEL[o.status]}`,
      detail: truncate(o.topic, 90),
    })),
  ].sort((a, b) => b.when.localeCompare(a.when));

  return (
    <>
      <TopBar crumbs={[{ label: "Activity" }]} />
      <div className="scroll-slim flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1560px] px-8 py-6">
          <PageHeader
            title="Activity"
            blurb="Everything this workspace has run, newest first."
          />

          <div className="mt-6">
            {entries.length === 0 ? (
              <EmptyRow>
                Nothing has run yet.{" "}
                <Link href="/" className="font-medium text-brand-600 hover:underline">
                  Start an exploration
                </Link>
                .
              </EmptyRow>
            ) : (
              <ul className="overflow-hidden rounded-xl border border-line bg-white">
                {entries.map((e) => (
                  <li key={e.id} className="border-b border-line-soft last:border-0">
                    <Link
                      href={e.href}
                      className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-brand-50/40"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-medium text-ink">
                          {e.title}
                        </span>
                        <span className="mt-0.5 block truncate text-[12.5px] text-muted">
                          {e.detail}
                        </span>
                      </span>
                      <span className="shrink-0 text-[12.5px] tabular-nums text-muted">
                        {relativeTime(e.when)}
                      </span>
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
