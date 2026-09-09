export function PageHeader({
  title,
  blurb,
}: {
  title: string;
  blurb: string;
}) {
  return (
    <div>
      <h1 className="text-[24px] leading-tight font-semibold tracking-[-0.02em] text-ink">
        {title}
      </h1>
      <p className="mt-1.5 max-w-2xl text-[13.5px] text-muted">{blurb}</p>
    </div>
  );
}

export function EmptyRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line px-5 py-12 text-center text-[13.5px] text-muted">
      {children}
    </div>
  );
}
