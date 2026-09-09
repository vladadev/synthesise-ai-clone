import { NextResponse } from "next/server";
import { deleteOffer, getOffer, updateOffer } from "@/lib/store";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const offer = await getOffer(id);
  if (!offer)
    return NextResponse.json({ error: "Offer not found." }, { status: 404 });
  return NextResponse.json({ offer });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const ok = await deleteOffer(id);
  if (!ok)
    return NextResponse.json({ error: "Offer not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: Ctx) {
  const { id } = await params;
  let body: { starred?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body.starred !== "boolean") {
    return NextResponse.json(
      { error: "Nothing to update." },
      { status: 400 },
    );
  }

  const offer = await updateOffer(id, (o) => ({ ...o, starred: body.starred as boolean }));
  if (!offer)
    return NextResponse.json({ error: "Offer not found." }, { status: 404 });
  return NextResponse.json({ offer });
}
