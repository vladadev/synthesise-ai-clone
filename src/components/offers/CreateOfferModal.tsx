"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Target, X, Zap } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { LANGUAGES, type Mode } from "@/lib/types";

const MODES: { id: Mode; label: string; hint: string; Icon: typeof Zap }[] = [
  {
    id: "guided",
    label: "Guided",
    hint: "Step-by-step workflow",
    Icon: Target,
  },
  {
    id: "fast",
    label: "Fast Mode",
    hint: "One topic, ~2,000 words",
    Icon: Zap,
  },
];

export function CreateOfferModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("fast");
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("en");
  const [improving, setImproving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function improve() {
    if (!topic.trim() || improving) return;
    setImproving(true);
    setError(null);
    try {
      const res = await fetch("/api/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (res.ok && data.topic) setTopic(data.topic);
    } catch {
      setError("Couldn't reach the writer. Your topic is unchanged.");
    } finally {
      setImproving(false);
    }
  }

  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const chosen =
      topic.trim() || "I'll let you pick any topic you want";
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: chosen, mode, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start the build.");
      router.push(`/offers/${data.offer.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start the build.");
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1c28]/45 p-4 animate-fade"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-offer-title"
        className="w-full max-w-[540px] rounded-2xl bg-white p-6 shadow-[0_24px_70px_-12px_rgba(16,19,34,0.35)] animate-pop"
      >
        <div className="flex items-start justify-between">
          <h2 id="new-offer-title" className="text-[19px] font-semibold text-ink">
            Start a new offer
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 rounded-md p-1 text-muted transition-colors hover:bg-line-soft hover:text-ink"
          >
            <X size={19} strokeWidth={1.8} />
          </button>
        </div>

        {/* Mode picker */}
        <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-[#f4f4f7] p-1">
          {MODES.map(({ id, label, hint, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              aria-pressed={mode === id}
              className={clsx(
                "rounded-lg px-3 py-2.5 text-center transition",
                mode === id
                  ? "bg-white shadow-[0_1px_3px_rgba(16,19,34,0.12)]"
                  : "hover:bg-white/50",
              )}
            >
              <span className="flex items-center justify-center gap-1.5 text-[13.5px] font-semibold text-ink">
                <Icon size={14} strokeWidth={2} />
                {label}
              </span>
              <span className="mt-0.5 block text-[11.5px] text-muted">{hint}</span>
            </button>
          ))}
        </div>

        {/* Topic */}
        <label
          htmlFor="topic"
          className="mt-5 block text-[13px] font-semibold text-ink"
        >
          What&apos;s your topic?
        </label>
        <textarea
          id="topic"
          ref={textareaRef}
          rows={4}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="dog training for new puppy owners"
          className="field mt-2 resize-y leading-relaxed"
        />

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-[12px] text-muted">
            {mode === "guided"
              ? "We'll weigh a wider field of niches before committing."
              : "We'll pick the niche and write a ~2,000-word lead magnet."}
          </p>
          <button
            type="button"
            onClick={improve}
            disabled={!topic.trim() || improving}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-1.5 py-1 text-[12.5px] text-ink-soft transition hover:bg-brand-50 disabled:opacity-45 disabled:hover:bg-transparent"
          >
            <Logo size={15} />
            {improving ? "Improving…" : "Improve Writing"}
          </button>
        </div>

        {/* Language */}
        <div className="mt-5 flex items-baseline justify-between">
          <label htmlFor="language" className="text-[13px] font-semibold text-ink">
            Output language
          </label>
          <span className="text-[12px] text-muted">
            Used for all generated content.
          </span>
        </div>
        <div className="relative mt-2">
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="field appearance-none border-brand-400 py-3 pr-10 pl-10 font-medium ring-4 ring-brand-100/60"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[15px]">
            {LANGUAGES.find((l) => l.code === language)?.flag}
          </span>
          <ChevronDown
            size={17}
            strokeWidth={1.8}
            className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted"
          />
        </div>

        {error && (
          <p role="alert" className="mt-3 text-[12.5px] text-rose-600">
            {error}
          </p>
        )}

        <Button
          variant="gradient"
          className="mt-5"
          onClick={submit}
          disabled={submitting}
        >
          {submitting ? "Starting your build…" : "Create My AI Digital Product"}
        </Button>
      </div>
    </div>
  );
}
