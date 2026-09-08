import type { NicheSeed } from "./corpus";
import type { Script } from "@/lib/types";

/**
 * Generation has exactly two moving parts: propose a field of niches, and write
 * the lead magnet for the one that wins. Everything else — ordering, timing,
 * scoring, the cover — is the pipeline's job and is identical for every engine.
 */
export interface Engine {
  name: "offline" | "claude";
  /** Propose `count` scored niches for a topic. */
  field(topic: string, count: number): Promise<NicheSeed[]>;
  /** Write the full lead magnet for the winning niche. */
  script(seed: NicheSeed, language: string): Promise<Script>;
}
