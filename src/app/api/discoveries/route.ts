import { NextResponse } from "next/server";
import { listDiscoveries, saveDiscovery, toDiscoverySummary } from "@/lib/store";
import { newId } from "@/lib/ids";
import { LANGUAGES, type Discovery, type Mode } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await listDiscoveries();
  rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ discoveries: rows.map(toDiscoverySummary) });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const seed = typeof body.seed === "string" ? body.seed.trim().slice(0, 600) : "";
  const mode: Mode = body.mode === "fast" ? "fast" : "guided";
  const language =
    typeof body.language === "string" &&
    LANGUAGES.some((l) => l.code === body.language)
      ? body.language
      : "en";
  const onBehalfOf =
    typeof body.onBehalfOf === "string" && body.onBehalfOf.trim()
      ? body.onBehalfOf.trim().slice(0, 200)
      : null;

  const now = new Date().toISOString();
  const discovery: Discovery = {
    id: newId(),
    seed,
    mode,
    language,
    onBehalfOf,
    stage: "directions",
    directions: [],
    opportunities: [],
    // Fast mode sweeps narrower; guided explores the full field.
    directionTarget: mode === "fast" ? 12 : 20,
    opportunityTarget: mode === "fast" ? 18 : 30,
    shortlistTarget: mode === "fast" ? 12 : 20,
    createdAt: now,
    updatedAt: now,
    error: null,
  };

  await saveDiscovery(discovery);
  return NextResponse.json({ discovery }, { status: 201 });
}
