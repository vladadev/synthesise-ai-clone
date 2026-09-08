import Link from "next/link";
import { ChevronRight, PanelLeft } from "lucide-react";
import { truncate } from "@/lib/format";

export interface Crumb {
  label: string;
  href?: string;
}

export function TopBar({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <header className="flex h-[62px] shrink-0 items-center gap-2 border-b border-line px-5">
      <button
        type="button"
        aria-label="Toggle sidebar"
        className="rail-icon -ml-1.5"
      >
        <PanelLeft size={17} strokeWidth={1.8} />
      </button>

      <ol className="flex min-w-0 items-center gap-1 text-[13.5px]">
        {crumbs.map((crumb, i) => (
          <li key={`${crumb.label}-${i}`} className="flex min-w-0 items-center gap-1">
            {i > 0 && (
              <ChevronRight size={15} className="shrink-0 text-faint" strokeWidth={1.8} />
            )}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="truncate text-ink-soft transition-colors hover:text-ink"
              >
                {truncate(crumb.label, 34)}
              </Link>
            ) : (
              <span className="truncate text-ink-soft">
                {truncate(crumb.label, 34)}
              </span>
            )}
          </li>
        ))}
        {crumbs.length > 1 && (
          <li aria-hidden="true">
            <ChevronRight size={15} className="text-faint" strokeWidth={1.8} />
          </li>
        )}
      </ol>
    </header>
  );
}
