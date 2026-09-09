"use client";

import { useEffect, useState } from "react";
import type {
  Direction,
  Discovery,
  DiscoveryEvent,
  DiscoveryStage,
  Opportunity,
} from "@/lib/types";

export interface DiscoveryState {
  stage: DiscoveryStage;
  directions: Direction[];
  opportunities: Opportunity[];
  directionsExplored: number;
  scoredCount: number;
  leaderId: string | null;
  average: number | null;
  evaluated: number | null;
  shortlisted: number | null;
  error: string | null;
  live: boolean;
  /** Set the moment the run finishes, so the toast can fire once. */
  justFinished: boolean;
}

function seedFrom(discovery: Discovery): DiscoveryState {
  const scored = discovery.opportunities.filter((o) => o.score !== null);
  const leader = scored.reduce<Opportunity | null>(
    (best, o) => (!best || (o.score ?? 0) > (best.score ?? 0) ? o : best),
    null,
  );
  return {
    stage: discovery.stage,
    directions: discovery.directions,
    opportunities: discovery.opportunities,
    directionsExplored: discovery.directions.length,
    scoredCount: scored.length,
    leaderId: leader?.id ?? null,
    average:
      scored.length > 0
        ? Math.round(
            (scored.reduce((n, o) => n + (o.score ?? 0), 0) / scored.length) * 10,
          ) / 10
        : null,
    evaluated: scored.length || null,
    shortlisted: scored.length
      ? Math.min(discovery.shortlistTarget, scored.length)
      : null,
    error: discovery.error,
    live: false,
    justFinished: false,
  };
}

/** Subscribes to one exploration and folds its events into render state. */
export function useDiscoveryStream(discovery: Discovery): DiscoveryState {
  const [state, setState] = useState<DiscoveryState>(() => seedFrom(discovery));

  useEffect(() => {
    if (discovery.stage === "ready") return;

    const controller = new AbortController();
    setState((s) => ({ ...s, live: true }));

    (async () => {
      try {
        const res = await fetch(`/api/discoveries/${discovery.id}/stream`, {
          signal: controller.signal,
        });
        if (!res.body) throw new Error("The exploration stream did not open.");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";
          for (const frame of frames) {
            const line = frame.trim();
            if (!line.startsWith("data:")) continue;
            try {
              apply(setState, JSON.parse(line.slice(5).trim()) as DiscoveryEvent);
            } catch {
              /* skip a malformed frame rather than killing the stream */
            }
          }
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        setState((s) => ({
          ...s,
          live: false,
          error:
            err instanceof Error
              ? err.message
              : "The exploration stopped unexpectedly.",
        }));
      } finally {
        if (!controller.signal.aborted) {
          setState((s) => ({ ...s, live: false }));
        }
      }
    })();

    return () => controller.abort();
  }, [discovery.id, discovery.stage]);

  return state;
}

function apply(
  setState: React.Dispatch<React.SetStateAction<DiscoveryState>>,
  event: DiscoveryEvent,
) {
  setState((s) => {
    switch (event.type) {
      case "stage":
        return { ...s, stage: event.stage };

      case "direction":
        return {
          ...s,
          directions: [...s.directions, event.direction],
          directionsExplored: event.index + 1,
        };

      case "opportunity":
        return {
          ...s,
          opportunities: [...s.opportunities, event.opportunity],
          directionsExplored: event.directionsExplored,
        };

      case "scored": {
        const opportunities = s.opportunities.map((o) =>
          o.id === event.id ? { ...o, score: event.score } : o,
        );
        return { ...s, opportunities, scoredCount: event.index + 1 };
      }

      case "shortlist": {
        // Ranking only settles once every opportunity has a score.
        const ranked = [...s.opportunities].sort(
          (a, b) => (b.score ?? 0) - (a.score ?? 0),
        );
        return {
          ...s,
          opportunities: ranked,
          leaderId: event.leaderId,
          average: event.average,
          evaluated: event.evaluated,
          shortlisted: event.shortlisted,
          justFinished: true,
        };
      }

      case "error":
        return { ...s, error: event.message, live: false };

      case "done":
        return { ...s, live: false };

      default:
        return s;
    }
  });
}
