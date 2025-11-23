import {
  getNotifications,
  subscribeToNotifications
} from "@/lib/demo-callback-store";

const encoder = new TextEncoder();

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const streamId = crypto.randomUUID().slice(0, 8);
  console.log(`🌊 [SERVER] New SSE stream connection: ${streamId}`);

  let heartbeat: NodeJS.Timeout | undefined;
  let unsubscribe: (() => void) | undefined;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const currentNotifications = getNotifications();
      console.log(`📦 [SERVER] Sending seed with ${currentNotifications.length} notifications to ${streamId}`);

      controller.enqueue(
        encoder.encode(
          `event: seed\ndata: ${JSON.stringify({ notifications: currentNotifications })}\n\n`
        )
      );

      unsubscribe = subscribeToNotifications(record => {
        console.log(`📤 [SERVER] Streaming notification ${record.id} to ${streamId}`);
        try {
          controller.enqueue(
            encoder.encode(`event: notification\ndata: ${JSON.stringify(record)}\n\n`)
          );
          console.log(`✅ [SERVER] Successfully streamed to ${streamId}`);
        } catch (error) {
          console.error(`❌ [SERVER] Failed to stream to ${streamId}:`, error);
        }
      });

      heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`event: ping\ndata: ${Date.now()}\n\n`));
        } catch (error) {
          console.error(`❌ [SERVER] Heartbeat failed for ${streamId}:`, error);
        }
      }, 15000);
    },
    cancel() {
      console.log(`🔌 [SERVER] SSE stream disconnected: ${streamId}`);
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
