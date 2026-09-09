import { NextResponse } from "next/server";
import { listOffers, saveOffer, toSummary } from "@/lib/store";
import { newId } from "@/lib/ids";
import type { Mode, Offer, Opportunity } from "@/lib/types";
import { LANGUAGES } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const offers = await listOffers();
  offers.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ offers: offers.map(toSummary) });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const opportunity = coerceOpportunity(body.opportunity);
  const topic = opportunity
    ? opportunity.statement
    : typeof body.topic === "string"
      ? body.topic.trim().slice(0, 400)
      : "";
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
    // A seeded opportunity has already won its field, so there is nothing
    // left to weigh; otherwise guided mode weighs a wider field.
    candidateTarget: opportunity ? 1 : mode === "guided" ? 9 : 6,
    winnerId: null,
    script: null,
    cover: null,
    opportunity,
    starred: false,
    error: null,
  };

  await saveOffer(offer);
  return NextResponse.json({ offer }, { status: 201 });
}

/** Accept only a fully-formed opportunity; anything partial is ignored. */
function coerceOpportunity(raw: unknown): Opportunity | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const m = (o.metrics ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  const num = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v)
      ? Math.min(10, Math.max(0, v))
      : null;

  const id = str(o.id);
  const audience = str(o.audience);
  const outcome = str(o.outcome);
  const constraint = str(o.constraint);
  const industry = str(o.industry);
  const niche = str(o.niche);
  if (!id || !audience || !outcome || !constraint || !industry || !niche) {
    return null;
  }

  const pain = num(m.pain);
  const demand = num(m.demand);
  const worsening = num(m.worsening);
  const speed = num(m.speed);
  if (pain === null || demand === null || worsening === null || speed === null) {
    return null;
  }

  return {
    id,
    directionId: str(o.directionId) ?? id,
    industry,
    niche,
    title: str(o.title) ?? niche,
    statement: str(o.statement) ?? `I help ${audience} ${outcome} without ${constraint}`,
    audience,
    outcome,
    constraint,
    metrics: { pain, demand, worsening, speed },
    score: num(o.score),
  };
}
