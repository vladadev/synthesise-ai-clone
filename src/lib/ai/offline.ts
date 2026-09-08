import type { Engine } from "./engine";
import { buildField } from "./derive";
import { composeScript } from "./writer";

/**
 * The default engine. No network, no key, fully deterministic for a given
 * topic — the same input always produces the same field and the same winner,
 * which makes the whole flow demoable and testable.
 */
export const offlineEngine: Engine = {
  name: "offline",
  async field(topic, count) {
    return buildField(topic, count);
  },
  async script(seed) {
    return composeScript(seed);
  },
};
