"use client";

import { useState } from "react";
import { OfferCard } from "./OfferCard";
import type { OfferSummary } from "@/lib/types";

export function SavedList({ initial }: { initial: OfferSummary[] }) {
  const [offers, setOffers] = useState(initial);

  async function remove(id: string) {
    setOffers((current) => current.filter((o) => o.id !== id));
    await fetch(`/api/offers/${id}`, { method: "DELETE" });
  }

  async function toggleStar(id: string, starred: boolean) {
    // Unstarring on this page removes the card, since this list *is* the stars.
    setOffers((current) =>
      starred ? current : current.filter((o) => o.id !== id),
    );
    await fetch(`/api/offers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ starred }),
    });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          onDelete={remove}
          onToggleStar={toggleStar}
        />
      ))}
    </div>
  );
}
