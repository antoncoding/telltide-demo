import {
  getNotifications,
  subscribeToNotifications
} from "@/lib/demo-callback-store";

const encoder = new TextEncoder();

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  let heartbeat: NodeJS.Timeout | undefined;
  let unsubscribe: (() => void) | undefined;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(
        encoder.encode(
          `event: seed\ndata: ${JSON.stringify({ notifications: getNotifications() })}\n\n`
        )
      );

      unsubscribe = subscribeToNotifications(record => {
        controller.enqueue(
          encoder.encode(`event: notification\ndata: ${JSON.stringify(record)}\n\n`)
        );
      });

      heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`event: ping\ndata: ${Date.now()}\n\n`));
      }, 15000);
    },
    cancel() {
      unsubscribe?.();
      if (heartbeat) {
        clearInterval(heartbeat);
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform"
    }
  });
}
