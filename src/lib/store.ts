import { promises as fs } from "node:fs";
import path from "node:path";
import type { Offer, OfferSummary } from "./types";

/**
 * A small file-backed store. One JSON document per offer under `.data/offers`.
 *
 * Deliberately dependency-free: the app has to run straight after `npm install`
 * with no database to provision. Writes go through a per-process promise chain
 * so two concurrent stream handlers can't interleave a read-modify-write.
 */

const DATA_DIR =
  process.env.SYNTHESISE_DATA_DIR || path.join(process.cwd(), ".data");
const OFFERS_DIR = path.join(DATA_DIR, "offers");

let queue: Promise<unknown> = Promise.resolve();

function serialize<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  // Keep the chain alive even if one link rejects.
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function ensureDir() {
  await fs.mkdir(OFFERS_DIR, { recursive: true });
}

function fileFor(id: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(id)) throw new Error("invalid offer id");
  return path.join(OFFERS_DIR, `${id}.json`);
}

export async function saveOffer(offer: Offer): Promise<Offer> {
  return serialize(async () => {
    await ensureDir();
    const next = { ...offer, updatedAt: new Date().toISOString() };
    const target = fileFor(next.id);
    // Write-then-rename so a reader never sees a half-written document.
    const tmp = `${target}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
    await fs.rename(tmp, target);
    return next;
  });
}

export async function getOffer(id: string): Promise<Offer | null> {
  try {
    const raw = await fs.readFile(fileFor(id), "utf8");
    return JSON.parse(raw) as Offer;
  } catch {
    return null;
  }
}

export async function updateOffer(
  id: string,
  patch: (offer: Offer) => Offer,
): Promise<Offer | null> {
  const current = await getOffer(id);
  if (!current) return null;
  return saveOffer(patch(current));
}

export async function deleteOffer(id: string): Promise<boolean> {
  try {
    await fs.unlink(fileFor(id));
    return true;
  } catch {
    return false;
  }
}

export async function listOffers(): Promise<Offer[]> {
  try {
    await ensureDir();
    const names = await fs.readdir(OFFERS_DIR);
    const offers = await Promise.all(
      names
        .filter((n) => n.endsWith(".json"))
        .map(async (n) => {
          try {
            return JSON.parse(
              await fs.readFile(path.join(OFFERS_DIR, n), "utf8"),
            ) as Offer;
          } catch {
            return null;
          }
        }),
    );
    return offers.filter((o): o is Offer => o !== null);
  } catch {
    return [];
  }
}

export function toSummary(offer: Offer): OfferSummary {
  const winner =
    offer.candidates.find((c) => c.id === offer.winnerId) ?? null;
  return {
    id: offer.id,
    topic: offer.topic,
    mode: offer.mode,
    language: offer.language,
    status: offer.status,
    createdAt: offer.createdAt,
    updatedAt: offer.updatedAt,
    headline: winner?.headline ?? null,
    industry: winner?.industry ?? null,
    niche: winner?.niche ?? null,
    score: winner?.score ?? null,
    wordCount: offer.script?.wordCount ?? null,
    palette: offer.cover?.palette ?? null,
  };
}
