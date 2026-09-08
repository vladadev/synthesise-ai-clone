import { Suspense } from "react";
import { TopBar } from "@/components/shell/TopBar";
import { OffersView } from "@/components/offers/OffersView";
import { listOffers, toSummary } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  const offers = await listOffers();
  offers.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <>
      <TopBar crumbs={[{ label: "Offers" }]} />
      <Suspense fallback={<div className="flex-1" />}>
        <OffersView initial={offers.map(toSummary)} />
      </Suspense>
    </>
  );
}
