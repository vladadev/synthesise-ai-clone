import { NextResponse } from "next/server";
import { getDiscovery } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const discovery = await getDiscovery(id);
  if (!discovery)
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ discovery });
}
