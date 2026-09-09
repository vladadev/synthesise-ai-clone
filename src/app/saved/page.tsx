import Link from "next/link";
import { TopBar } from "@/components/shell/TopBar";
import { EmptyRow, PageHeader } from "@/components/shell/PageHeader";
import { listOffers, toSummary } from "@/lib/store";
import { SavedList } from "@/components/offers/SavedList";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const offers = (await listOffers())
    .filter((o) => o.starred)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(toSummary);

  return (
    <>
      <TopBar crumbs={[{ label: "Saved" }]} />
      <div className="scroll-slim flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1560px] px-8 py-6">
          <PageHeader
            title="Saved"
            blurb="Offers you starred. Star one from its card on the Offers page."
          />
          <div className="mt-6">
            {offers.length === 0 ? (
              <EmptyRow>
                Nothing starred yet.{" "}
                <Link
                  href="/offers"
                  className="font-medium text-brand-600 hover:underline"
                >
                  Browse your offers
                </Link>
                .
              </EmptyRow>
            ) : (
              <SavedList initial={offers} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
