import { notFound } from "next/navigation";
import { TopBar } from "@/components/shell/TopBar";
import { DiscoveryView } from "@/components/discovery/DiscoveryView";
import { getDiscovery } from "@/lib/store";
import { truncate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DiscoverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const discovery = await getDiscovery(id);
  if (!discovery) notFound();

  return (
    <>
      <TopBar
        trailing={false}
        crumbs={[
          { label: "Offers", href: "/offers" },
          { label: discovery.seed ? truncate(discovery.seed, 28) : "Untitled" },
          { label: "Discover Your Profitable Pocket" },
        ]}
      />
      <DiscoveryView discovery={discovery} />
    </>
  );
}
