"use client";

import { useEffect, useState } from "react";
import type {
  Candidate,
  Cover,
  Offer,
  ScriptSection,
  StepId,
  StreamEvent,
} from "@/lib/types";

export interface BuildState {
  step: StepId;
  status: Offer["status"];
  candidates: Candidate[];
  /** How many the run intends to weigh, for the "5 / 9" counter. */
  total: number;
  winnerId: string | null;
  scriptMeta: {
    title: string;
    subtitle: string;
    framework: string;
    premise: string;
  } | null;
  sections: ScriptSection[];
  wordCount: number | null;
  sources: number | null;
  cover: Cover | null;
  error: string | null;
  live: boolean;
}

function seedFromOffer(offer: Offer): BuildState {
  const step: StepId =
    offer.status === "script"
      ? "script"
      : offer.status === "render" || offer.status === "ready"
        ? "render"
        : "niche";

  return {
    step,
    status: offer.status,
    candidates: offer.candidates,
    total: offer.candidateTarget,
    winnerId: offer.winnerId,
    scriptMeta: offer.script
      ? {
          title: offer.script.title,
          subtitle: offer.script.subtitle,
          framework: offer.script.framework,
          premise: offer.script.premise,
        }
      : null,
    sections: offer.script?.sections ?? [],
    wordCount: offer.script?.wordCount ?? null,
    sources: offer.script?.sources ?? null,
    cover: offer.cover,
    error: offer.error,
    live: false,
  };
}

/**
 * Subscribes to the build stream for an offer and folds the events into the
 * state the page renders. Offers that already finished are replayed from the
 * stored document instead of rebuilt.
 */
export function useOfferStream(offer: Offer): BuildState {
  const [state, setState] = useState<BuildState>(() => seedFromOffer(offer));

  useEffect(() => {
    if (offer.status === "ready" || offer.status === "failed") return;

    // One controller per mount. React may mount, unmount and remount this in
    // development; the cleanup aborts the first stream and the remount opens a
    // fresh one, so there is never more than one live stream for an offer.
    const controller = new AbortController();
    setState((s) => ({ ...s, live: true }));

    (async () => {
      try {
        const res = await fetch(`/api/offers/${offer.id}/stream`, {
          signal: controller.signal,
        });
        if (!res.body) throw new Error("The build stream did not open.");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // SSE frames are separated by a blank line.
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";
          for (const frame of frames) {
            const line = frame.trim();
            if (!line.startsWith("data:")) continue;
            try {
              apply(setState, JSON.parse(line.slice(5).trim()) as StreamEvent);
            } catch {
              /* ignore a malformed frame rather than killing the stream */
            }
          }
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        setState((s) => ({
          ...s,
          live: false,
          error:
            err instanceof Error ? err.message : "The build stopped unexpectedly.",
        }));
      } finally {
        if (!controller.signal.aborted) {
          setState((s) => ({ ...s, live: false }));
        }
      }
    })();

    return () => controller.abort();
  }, [offer.id, offer.status]);

  return state;
}

function apply(
  setState: React.Dispatch<React.SetStateAction<BuildState>>,
  event: StreamEvent,
) {
  setState((s) => {
    switch (event.type) {
      case "status":
        return { ...s, status: event.status, step: event.step };

      case "candidate.start": {
        const candidates = [...s.candidates];
        candidates[event.index] = event.candidate;
        return { ...s, candidates, total: event.total };
      }

      case "candidate.done": {
        const candidates = [...s.candidates];
        candidates[event.index] = event.candidate;
        return { ...s, candidates, total: event.total };
      }

      case "niche.locked":
        return { ...s, winnerId: event.winnerId };

      case "script.meta":
        return {
          ...s,
          scriptMeta: {
            title: event.title,
            subtitle: event.subtitle,
            framework: event.framework,
            premise: event.premise,
          },
          sections: [],
        };

      case "script.section":
        return { ...s, sections: [...s.sections, event.section] };

      case "script.done":
        return { ...s, wordCount: event.wordCount, sources: event.sources };

      case "cover":
        return { ...s, cover: event.cover };

      case "error":
        return { ...s, error: event.message, status: "failed", live: false };

      case "done":
        return { ...s, live: false };

      default:
        return s;
    }
  });
}
