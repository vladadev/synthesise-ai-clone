import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "animate-shimmer rounded bg-linear-to-r from-line-soft via-[#e9e9f2] to-line-soft",
        className,
      )}
    />
  );
}

/** The greyed-out placeholder cards sitting below the ones already weighed. */
export function CandidateSkeleton() {
  return (
    <div className="card p-4 opacity-60">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-8" />
      </div>
      <Skeleton className="mt-4 h-3.5 w-[85%]" />
      <Skeleton className="mt-2 h-3.5 w-[60%]" />
      <Skeleton className="mt-5 h-2.5 w-full" />
      <Skeleton className="mt-2 h-2.5 w-[92%]" />
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-2 w-full" />
      </div>
    </div>
  );
}
