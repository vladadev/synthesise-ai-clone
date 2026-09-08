import { getOffer } from "@/lib/store";
import { runPipeline } from "@/lib/ai/pipeline";

export const dynamic = "force-dynamic";
// The stream runs for well over a minute on a full guided build.
export const maxDuration = 300;

type Ctx = { params: Promise<{ id: string }> };

/**
 * Server-sent events for one build. Each line is `data: <StreamEvent JSON>`.
 * The client renders straight off these, so the page is never waiting on a
 * whole step to finish before it can show anything.
 */
export async function GET(request: Request, { params }: Ctx) {
  const { id } = await params;
  const offer = await getOffer(id);

  if (!offer) {
    return new Response("Offer not found.", { status: 404 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const abort = () => {
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };
      request.signal.addEventListener("abort", abort);

      try {
        // A finished run replays from the stored document instead of rebuilding.
        if (offer.status === "ready" || offer.status === "failed") {
          send({ type: "done" });
          return;
        }
        for await (const event of runPipeline(offer)) {
          if (request.signal.aborted) return;
          send(event);
        }
      } catch (err) {
        send({
          type: "error",
          message:
            err instanceof Error ? err.message : "The build stopped unexpectedly.",
        });
      } finally {
        request.signal.removeEventListener("abort", abort);
        abort();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
