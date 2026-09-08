import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-[19px] font-semibold text-ink">Offer not found</h1>
      <p className="max-w-sm text-[13.5px] text-muted">
        It may have been deleted, or the build data was cleared.
      </p>
      <Link
        href="/offers"
        className="mt-2 rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white transition hover:bg-brand-700"
      >
        Back to offers
      </Link>
    </div>
  );
}
