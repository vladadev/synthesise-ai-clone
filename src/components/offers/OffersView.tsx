"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, MoreHorizontal, Plus, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CreateOfferModal } from "./CreateOfferModal";
import { OfferCard } from "./OfferCard";
import type { OfferSummary } from "@/lib/types";

type SortKey = "newest" | "oldest" | "score" | "az";
type FilterKey = "all" | "ready" | "building" | "failed";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "score", label: "Highest score" },
  { key: "az", label: "A–Z" },
];

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All offers" },
  { key: "ready", label: "Ready" },
  { key: "building", label: "Building" },
  { key: "failed", label: "Failed" },
];

const BUILDING = new Set(["queued", "niche", "script", "render"]);

export function OffersView({ initial }: { initial: OfferSummary[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const [offers, setOffers] = useState(initial);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [modalOpen, setModalOpen] = useState(params.get("new") === "1");

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/offers", { cache: "no-store" });
      if (res.ok) setOffers((await res.json()).offers);
    } catch {
      /* keep whatever we have */
    }
  }, []);

  // Anything mid-build finishes on the server, so poll while one is running.
  const anyBuilding = offers.some((o) => BUILDING.has(o.status));
  useEffect(() => {
    if (!anyBuilding) return;
    const timer = setInterval(refresh, 4000);
    return () => clearInterval(timer);
  }, [anyBuilding, refresh]);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    if (params.get("new") === "1") router.replace("/offers");
  }, [params, router]);

  async function remove(id: string) {
    setOffers((current) => current.filter((o) => o.id !== id));
    await fetch(`/api/offers/${id}`, { method: "DELETE" });
  }

  async function toggleStar(id: string, starred: boolean) {
    setOffers((current) =>
      current.map((o) => (o.id === id ? { ...o, starred } : o)),
    );
    await fetch(`/api/offers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ starred }),
    });
  }

  const dirty = query !== "" || sort !== "newest" || filter !== "all";

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = offers.filter((o) => {
      if (filter === "ready" && o.status !== "ready") return false;
      if (filter === "failed" && o.status !== "failed") return false;
      if (filter === "building" && !BUILDING.has(o.status)) return false;
      if (!q) return true;
      return [o.topic, o.headline, o.industry, o.niche]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q));
    });

    return matched.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return a.createdAt.localeCompare(b.createdAt);
        case "score":
          return (b.score ?? -1) - (a.score ?? -1);
        case "az":
          return (a.headline ?? a.topic).localeCompare(b.headline ?? b.topic);
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });
  }, [offers, query, sort, filter]);

  return (
    <div className="scroll-slim flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[1560px] px-9 py-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-[27px] leading-none font-semibold tracking-[-0.02em] text-ink">
              Offers
            </h1>
            <button
              type="button"
              aria-label="Offer options"
              className="rounded-md p-1 text-faint transition-colors hover:bg-line-soft hover:text-ink"
            >
              <MoreHorizontal size={18} strokeWidth={1.8} />
            </button>
          </div>

          <Button onClick={openModal}>
            <Plus size={15} strokeWidth={2.2} />
            Create Offer
          </Button>
        </div>

        {/* Toolbar */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1 sm:max-w-[380px]">
            <Search
              size={16}
              strokeWidth={1.9}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-faint"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="products"
              aria-label="Search offers"
              className="field py-2.5 pl-10"
            />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Dropdown
              value={FILTERS.find((f) => f.key === filter)!.label}
              label="Filters"
              options={FILTERS.map((f) => ({ key: f.key, label: f.label }))}
              onSelect={(k) => setFilter(k as FilterKey)}
              showLabelOnly={filter === "all"}
            />
            <Dropdown
              value={SORTS.find((s) => s.key === sort)!.label}
              options={SORTS.map((s) => ({ key: s.key, label: s.label }))}
              onSelect={(k) => setSort(k as SortKey)}
            />
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSort("newest");
                setFilter("all");
              }}
              disabled={!dirty}
              className="rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-brand-600 transition hover:bg-brand-50 disabled:text-faint disabled:hover:bg-transparent"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <EmptyState
            hasOffers={offers.length > 0}
            onCreate={openModal}
            onReset={() => {
              setQuery("");
              setFilter("all");
            }}
          />
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {visible.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onDelete={remove}
                onToggleStar={toggleStar}
              />
            ))}
          </div>
        )}
      </div>

      {modalOpen && <CreateOfferModal onClose={closeModal} />}
    </div>
  );
}

function EmptyState({
  hasOffers,
  onCreate,
  onReset,
}: {
  hasOffers: boolean;
  onCreate: () => void;
  onReset: () => void;
}) {
  return (
    <div className="mt-6 flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-500">
        <Sparkles size={22} strokeWidth={1.7} />
      </div>
      {hasOffers ? (
        <>
          <p className="mt-4 text-[15px] font-semibold text-ink">
            Nothing matches those filters
          </p>
          <p className="mt-1 max-w-sm text-[13px] text-muted">
            Try a different search, or clear the filters to see everything again.
          </p>
          <Button variant="ghost" className="mt-5" onClick={onReset}>
            Clear filters
          </Button>
        </>
      ) : (
        <>
          <p className="mt-4 text-[15px] font-semibold text-ink">
            No offers yet
          </p>
          <p className="mt-1 max-w-sm text-[13px] text-muted">
            Give it a topic — or let it choose one for you — and it will find the
            niche, write the lead magnet, and render the cover.
          </p>
          <Button className="mt-5" onClick={onCreate}>
            <Plus size={15} strokeWidth={2.2} />
            Create Offer
          </Button>
        </>
      )}
    </div>
  );
}

function Dropdown({
  value,
  label,
  options,
  onSelect,
  showLabelOnly,
}: {
  value: string;
  label?: string;
  options: { key: string; label: string }[];
  onSelect: (key: string) => void;
  showLabelOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-[13.5px] font-medium text-ink-soft transition hover:bg-line-soft"
      >
        {showLabelOnly && label ? label : value}
        <ChevronDown size={15} strokeWidth={1.9} className="text-faint" />
      </button>

      {open && (
        <ul
          className="absolute right-0 z-20 mt-1 min-w-[168px] overflow-hidden rounded-xl border border-line bg-white py-1 shadow-[0_12px_36px_-10px_rgba(16,19,34,0.28)] animate-pop"
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((o) => (
            <li key={o.key}>
              <button
                type="button"
                onClick={() => {
                  onSelect(o.key);
                  setOpen(false);
                }}
                className="block w-full px-3.5 py-2 text-left text-[13px] text-ink-soft transition hover:bg-brand-50 hover:text-brand-700"
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
