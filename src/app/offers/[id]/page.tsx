import { notFound } from "next/navigation";
import { TopBar } from "@/components/shell/TopBar";
import { BuildView } from "@/components/build/BuildView";
import { getOffer } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function OfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await getOffer(id);
  if (!offer) notFound();

  return (
    <>
      <TopBar
        crumbs={[{ label: "Offers", href: "/offers" }, { label: offer.topic }]}
      />
      <BuildView offer={offer} />
    </>
  );
}
