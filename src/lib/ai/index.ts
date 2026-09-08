import type { Engine } from "./engine";
import { offlineEngine } from "./offline";
import { claudeEngine } from "./claude";

export function selectEngine(): Engine {
  return process.env.ANTHROPIC_API_KEY ? claudeEngine : offlineEngine;
}

export type { Engine };
