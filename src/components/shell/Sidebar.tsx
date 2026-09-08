"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Heart,
  Home,
  Headphones,
  LayoutPanelTop,
  Monitor,
  Plus,
  Settings,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const PRIMARY = [
  { href: "/offers?new=1", icon: Plus, label: "New offer", match: null },
  { href: "/", icon: Home, label: "Home", match: "/" },
  { href: "/offers", icon: Sparkles, label: "Offers", match: "/offers" },
  { href: "/offers?view=funnels", icon: Monitor, label: "Funnels", match: null },
  { href: "/offers?view=pages", icon: LayoutPanelTop, label: "Pages", match: null },
  { href: "/offers?view=saved", icon: Heart, label: "Saved", match: null },
] as const;

const SECONDARY = [
  { href: "/offers?view=analytics", icon: BarChart3, label: "Analytics" },
  { href: "/offers?view=trash", icon: Trash2, label: "Trash" },
  { href: "/offers?view=support", icon: Headphones, label: "Support" },
  { href: "/offers?view=settings", icon: Settings, label: "Settings" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="flex h-full w-[68px] shrink-0 flex-col items-center border-r border-line bg-rail py-4"
    >
      <Link href="/offers" aria-label="Synthesise" className="mb-6 block">
        <Logo />
      </Link>

      <ul className="flex flex-col items-center gap-1.5">
        {PRIMARY.map(({ href, icon: Icon, label, match }) => {
          const active =
            match === "/offers"
              ? pathname.startsWith("/offers")
              : match === pathname;
          return (
            <li key={label}>
              <Link
                href={href}
                title={label}
                aria-label={label}
                data-active={active}
                className="rail-icon"
              >
                <Icon size={17} strokeWidth={1.8} />
              </Link>
            </li>
          );
        })}
      </ul>

      <ul className="mt-auto flex flex-col items-center gap-1.5">
        {SECONDARY.map(({ href, icon: Icon, label }) => (
          <li key={label}>
            <Link href={href} title={label} aria-label={label} className="rail-icon">
              <Icon size={17} strokeWidth={1.8} />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
