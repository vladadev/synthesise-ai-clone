import { NextResponse } from "next/server";
import { parseTopic, isOpenTopic } from "@/lib/ai/derive";

export const dynamic = "force-dynamic";

/**
 * "Improve Writing" behind the topic box. Tightens a vague topic into the shape
 * the scanner works best with: a specific audience and a specific problem.
 *
 * With a key present this goes to the model; without one it applies the same
 * rewrite rules locally, so the button is never dead.
 */
export async function POST(request: Request) {
  let topic = "";
  try {
    const body = await request.json();
    topic = typeof body.topic === "string" ? body.topic.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!topic) {
    return NextResponse.json({ error: "Nothing to improve." }, { status: 400 });
  }
  if (isOpenTopic(topic)) {
    return NextResponse.json({ topic });
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const { default: Anthropic } = await import("@anthropic-ai/sdk");
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const res = await client.messages.create({
        model: process.env.SYNTHESISE_MODEL || "claude-sonnet-5",
        max_tokens: 200,
        system:
          "Rewrite the user's product topic as one specific line: a named audience and the painful problem they have. Under 20 words. No preamble, no quotes, no explanation — return the rewritten line only.",
        messages: [{ role: "user", content: topic }],
      });
      const text = res.content
        .map((b) => (b.type === "text" ? b.text : ""))
        .join("")
        .trim()
        .replace(/^["']|["']$/g, "");
      if (text) return NextResponse.json({ topic: text.slice(0, 300) });
    } catch {
      /* fall through to the local rewrite */
    }
  }

  const { subject, audience } = parseTopic(topic);
  const improved = `${subject} for ${audience}, focused on the one problem they would pay to remove`;
  return NextResponse.json({ topic: improved.slice(0, 300) });
}
