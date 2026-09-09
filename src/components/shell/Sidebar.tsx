"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Gift,
  Home,
  Info,
  Plus,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

/**
 * Every entry routes somewhere real — there are no decorative icons in this
 * rail. `match` decides when an entry reads as the current section.
 */
const PRIMARY = [
  { href: "/", icon: Plus, label: "New exploration", match: null },
  { href: "/", icon: Home, label: "Home", match: "exact:/" },
  { href: "/offers", icon: Sparkles, label: "Offers", match: "/offers" },
  { href: "/explorations", icon: Shield, label: "Explorations", match: "/explorations" },
  { href: "/activity", icon: Bell, label: "Activity", match: "/activity" },
  { href: "/trending", icon: Gift, label: "Trending", match: "/trending" },
  { href: "/saved", icon: Star, label: "Saved", match: "/saved" },
] as const;

const PRIMARY_TAIL = [
  { href: "/help", icon: Info, label: "How it works", match: "/help" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (match: string | null) => {
    if (!match) return false;
    if (match.startsWith("exact:")) return pathname === match.slice(6);
    return pathname.startsWith(match);
  };

  return (
    <nav
      aria-label="Primary"
      className="flex h-full w-[58px] shrink-0 flex-col items-center border-r border-line bg-rail py-4"
    >
      <Link href="/" aria-label="Synthesise" className="mb-5 block">
        <Logo size={22} />
      </Link>

      <ul className="flex flex-col items-center gap-1">
        {[...PRIMARY, ...PRIMARY_TAIL].map(({ href, icon: Icon, label, match }) => (
          <li key={label}>
            <Link
              href={href}
              title={label}
              aria-label={label}
              data-active={isActive(match)}
              className="rail-icon"
            >
              <Icon size={16} strokeWidth={1.8} />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <button
          type="button"
          title="Account"
          aria-label="Account"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-brand-200 to-brand-400 text-[11px] font-semibold text-white transition hover:brightness-105"
        >
          S
        </button>
      </div>
    </nav>
  );
}
