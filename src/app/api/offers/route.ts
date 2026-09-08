import { NextResponse } from "next/server";
import { listOffers, saveOffer, toSummary } from "@/lib/store";
import { newId } from "@/lib/ids";
import type { Mode, Offer } from "@/lib/types";
import { LANGUAGES } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const offers = await listOffers();
  offers.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ offers: offers.map(toSummary) });
}

export async function POST(request: Request) {
  let body: { topic?: unknown; mode?: unknown; language?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const topic =
    typeof body.topic === "string" ? body.topic.trim().slice(0, 400) : "";
  const mode: Mode = body.mode === "guided" ? "guided" : "fast";
  const language =
    typeof body.language === "string" &&
    LANGUAGES.some((l) => l.code === body.language)
      ? body.language
      : "en";

  if (!topic) {
    return NextResponse.json(
      { error: "Give the builder a topic, or ask it to pick one for you." },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const offer: Offer = {
    id: newId(),
    topic,
    mode,
    language,
    status: "queued",
    createdAt: now,
    updatedAt: now,
    candidates: [],
    // Guided mode weighs a wider field before committing.
    candidateTarget: mode === "guided" ? 9 : 6,
    winnerId: null,
    script: null,
    cover: null,
    error: null,
  };

  await saveOffer(offer);
  return NextResponse.json({ offer }, { status: 201 });
}
