import { NextResponse } from "next/server";
import { deleteOffer, getOffer } from "@/lib/store";

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
