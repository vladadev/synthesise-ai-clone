import { getDiscovery } from "@/lib/store";
import { runDiscovery } from "@/lib/discovery/pipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** Server-sent events for one exploration. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const discovery = await getDiscovery(id);
  if (!discovery) return new Response("Not found.", { status: 404 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      const close = () => {
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };
      request.signal.addEventListener("abort", close);

      try {
        // A finished exploration replays from storage rather than re-running.
        if (discovery.stage === "ready") {
          send({ type: "done" });
          return;
        }
        for await (const event of runDiscovery(discovery)) {
          if (request.signal.aborted) return;
          send(event);
        }
      } catch (err) {
        send({
          type: "error",
          message:
            err instanceof Error
              ? err.message
              : "The exploration stopped unexpectedly.",
        });
      } finally {
        request.signal.removeEventListener("abort", close);
        close();
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
