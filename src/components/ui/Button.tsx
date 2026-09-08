"use client";

import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "gradient" | "ghost" | "quiet";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 rounded-lg text-[13px] font-medium transition",
        "disabled:cursor-not-allowed disabled:opacity-55",
        variant === "primary" &&
          "bg-brand-600 px-3.5 py-2 text-white shadow-sm hover:bg-brand-700",
        variant === "gradient" &&
          "w-full bg-linear-to-r from-brand-300 to-brand-500 px-4 py-3 text-[14px] font-semibold text-white shadow-sm hover:from-brand-400 hover:to-brand-600",
        variant === "ghost" &&
          "border border-line px-3 py-2 text-ink-soft hover:bg-brand-50",
        variant === "quiet" && "px-2 py-1.5 text-muted hover:text-ink",
        className,
      )}
    />
  );
}
