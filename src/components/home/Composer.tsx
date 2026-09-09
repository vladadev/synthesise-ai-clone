"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Flame,
  Plus,
  Target,
  Zap,
} from "lucide-react";
import clsx from "clsx";
import { Logo } from "@/components/ui/Logo";
import { LANGUAGES, type Mode } from "@/lib/types";

const MODES: { id: Mode; label: string; hint: string; Icon: typeof Zap }[] = [
  { id: "guided", label: "Guided", hint: "Explore 20 directions, score 30", Icon: Target },
  { id: "fast", label: "Fast", hint: "Explore 12 directions, score 18", Icon: Zap },
];

/**
 * The home composer. One box that takes anything the user knows, cares about,
 * or wants to help with — and starts an exploration from it.
 */
export function Composer({ trending }: { trending: string[] }) {
  const router = useRouter();
  const [seed, setSeed] = useState("");
  const [mode, setMode] = useState<Mode>("guided");
  const [language, setLanguage] = useState("en");
  const [modeOpen, setModeOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [trendingOpen, setTrendingOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const boxRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const close = () => {
      setModeOpen(false);
      setLangOpen(false);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // The box grows with the text rather than scrolling inside a fixed height.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(260, Math.max(72, el.scrollHeight))}px`;
  }, [seed]);

  async function start(overrides?: { seed?: string; onBehalfOf?: string }) {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/discoveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seed: overrides?.seed ?? seed,
          mode,
          language,
          onBehalfOf: overrides?.onBehalfOf ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start exploring.");
      router.push(`/discover/${data.discovery.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start exploring.");
      setSubmitting(false);
    }
  }

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];
  const activeMode = MODES.find((m) => m.id === mode)!;

  return (
    <div className="scroll-slim flex-1 overflow-y-auto">
      {/* Language selector, centred above the fold */}
      <div className="flex justify-center pt-5">
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLangOpen((o) => !o);
            }}
            aria-expanded={langOpen}
            className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13.5px] font-medium text-ink-soft transition hover:bg-line-soft"
          >
            <span className="text-[15px]">{current.flag}</span>
            {current.code.toUpperCase()}/{current.code === "en" ? "US" : current.code.toUpperCase()}
            <ChevronDown size={15} strokeWidth={1.9} className="text-faint" />
          </button>
          {langOpen && (
            <ul
              onClick={(e) => e.stopPropagation()}
              className="absolute left-1/2 z-20 mt-1 max-h-64 w-44 -translate-x-1/2 overflow-y-auto rounded-xl border border-line bg-white py-1 shadow-[0_12px_36px_-10px_rgba(16,19,34,0.28)] animate-pop"
            >
              {LANGUAGES.map((l) => (
                <li key={l.code}>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage(l.code);
                      setLangOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-[13px] text-ink-soft transition hover:bg-brand-50"
                  >
                    <span>{l.flag}</span>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-[660px] flex-col justify-center px-6 pb-16">
        <h1 className="text-center text-[30px] leading-[1.25] font-semibold tracking-[-0.025em] text-ink sm:text-[34px]">
          What do you know, care about,
          <br />
          or want to help people with?
        </h1>

        {/* The box */}
        <div className="mt-8 rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(16,19,34,0.04),0_12px_32px_-20px_rgba(16,19,34,0.28)] transition focus-within:border-brand-300">
          <textarea
            ref={boxRef}
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) start();
            }}
            rows={2}
            placeholder="e.g. a skill or method you know, a group you understand, a problem you have solved"
            aria-label="What do you know, care about, or want to help people with?"
            className="w-full resize-none bg-transparent px-5 pt-4 text-[14px] leading-relaxed text-ink outline-none placeholder:text-faint"
          />

          <div className="flex items-center gap-1 px-3 pb-3">
            <button
              type="button"
              onClick={() => boxRef.current?.focus()}
              aria-label="Add context"
              className="rail-icon h-8 w-8"
            >
              <Plus size={16} strokeWidth={1.9} />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setModeOpen((o) => !o);
                }}
                aria-expanded={modeOpen}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-medium text-ink-soft transition hover:bg-line-soft"
              >
                <activeMode.Icon size={14} strokeWidth={1.9} className="text-brand-500" />
                {activeMode.label}
                <ChevronDown size={14} strokeWidth={1.9} className="text-faint" />
              </button>
              {modeOpen && (
                <ul
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-full left-0 z-20 mb-1 w-60 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-[0_12px_36px_-10px_rgba(16,19,34,0.28)] animate-pop"
                >
                  {MODES.map(({ id, label, hint, Icon }) => (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => {
                          setMode(id);
                          setModeOpen(false);
                        }}
                        className="flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left transition hover:bg-brand-50"
                      >
                        <Icon size={14} strokeWidth={1.9} className="mt-0.5 text-brand-500" />
                        <span>
                          <span className="block text-[13px] font-medium text-ink">
                            {label}
                          </span>
                          <span className="block text-[11.5px] text-muted">{hint}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={() => start()}
              disabled={submitting}
              aria-label="Start exploring"
              className={clsx(
                "ml-auto flex h-9 w-9 items-center justify-center rounded-full text-white transition",
                "bg-linear-to-br from-brand-300 to-brand-500 hover:from-brand-400 hover:to-brand-600",
                "disabled:cursor-not-allowed disabled:opacity-60",
              )}
            >
              <ArrowUp size={17} strokeWidth={2.3} />
            </button>
          </div>
        </div>

        {/* Trending */}
        <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-white">
          <button
            type="button"
            onClick={() => setTrendingOpen((o) => !o)}
            aria-expanded={trendingOpen}
            className="flex w-full items-center gap-2.5 px-5 py-3.5 text-left transition hover:bg-brand-50/50"
          >
            <Flame size={15} strokeWidth={1.9} className="shrink-0 text-brand-500" />
            <span className="text-[13.5px] text-ink">
              <span className="font-semibold">Trending offers</span>
              <span className="text-muted"> · Market-validated ideas, refreshed daily</span>
            </span>
            <ChevronRight
              size={16}
              strokeWidth={1.9}
              className={clsx(
                "ml-auto shrink-0 text-faint transition-transform",
                trendingOpen && "rotate-90",
              )}
            />
          </button>

          {trendingOpen && (
            <ul className="border-t border-line-soft animate-fade">
              {trending.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => setSeed(item)}
                    className="block w-full border-b border-line-soft px-5 py-2.5 text-left text-[13px] text-ink-soft transition last:border-0 hover:bg-brand-50/60 hover:text-brand-700"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Growth Operator */}
        <button
          type="button"
          onClick={() =>
            start({
              seed: seed || "a creator's existing expertise and audience",
              onBehalfOf: "creator",
            })
          }
          className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-brand-200 bg-white px-5 py-4 text-left transition hover:border-brand-300 hover:bg-brand-50/40"
        >
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-[14px] font-semibold text-ink">
                I&apos;m building for someone else
              </span>
              <span className="rounded-md bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                Growth Operator
              </span>
            </span>
            <span className="mt-1 block text-[13px] text-muted">
              Build the offer from a creator&apos;s expertise instead of your own.
            </span>
          </span>
          <ChevronRight size={17} strokeWidth={1.9} className="ml-auto shrink-0 text-faint" />
        </button>

        {error && (
          <p role="alert" className="mt-4 text-center text-[12.5px] text-rose-600">
            {error}
          </p>
        )}

        <p className="mt-10 flex items-center justify-center gap-2 text-center text-[13px] text-muted">
          <Logo size={15} />
          Not sure where to start?{" "}
          <button
            type="button"
            onClick={() => start({ seed: "" })}
            className="font-medium text-ink-soft underline-offset-2 transition hover:text-brand-600 hover:underline"
          >
            Let Synthesise find a profitable product for you.
          </button>
        </p>
      </div>
    </div>
  );
}
