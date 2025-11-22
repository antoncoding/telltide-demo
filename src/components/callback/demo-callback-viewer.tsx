'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import type { NotificationRecord } from "@/lib/demo-callback-store";

type EventColorScheme = {
  border: string;
  bg: string;
  text: string;
};

function getEventColorScheme(payload: unknown): EventColorScheme {
  // Default color scheme
  const defaultScheme: EventColorScheme = {
    border: "border-slate-500/30",
    bg: "bg-slate-500/10",
    text: "text-slate-100"
  };

  if (!payload || typeof payload !== "object") return defaultScheme;

  const payloadObj = payload as Record<string, unknown>;

  // Debug: log the payload structure
  console.log("Webhook payload structure:", payloadObj);
  console.log("Payload keys:", Object.keys(payloadObj));

  const metaEventConfig = payloadObj.meta_event_config as Record<string, unknown> | undefined;

  if (!metaEventConfig) {
    console.log("No meta_event_config found in payload");
    return defaultScheme;
  }

  const eventType = metaEventConfig.event_type as string | undefined;
  const metaType = metaEventConfig.type as string | undefined;

  console.log("Event type:", eventType, "Meta type:", metaType);

  // Meta-event type colors (primary classification)
  if (metaType === "rolling_aggregate") {
    return {
      border: "border-purple-500/30",
      bg: "bg-purple-500/10",
      text: "text-purple-100"
    };
  }

  if (metaType === "event_count") {
    return {
      border: "border-blue-500/30",
      bg: "bg-blue-500/10",
      text: "text-blue-100"
    };
  }

  if (metaType === "net_aggregate") {
    return {
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      text: "text-amber-100"
    };
  }

  // Fallback to event type if no meta type
  if (!eventType) return defaultScheme;

  // ERC20 events - Blue/Cyan theme
  if (eventType === "erc20_transfer") {
    return {
      border: "border-cyan-500/30",
      bg: "bg-cyan-500/10",
      text: "text-cyan-100"
    };
  }

  // ERC4626 events - Purple/Violet theme
  if (eventType === "erc4626_deposit" || eventType === "erc4626_withdraw") {
    return {
      border: "border-violet-500/30",
      bg: "bg-violet-500/10",
      text: "text-violet-100"
    };
  }

  // Morpho supply/borrow events - Green/Emerald theme (inflows)
  if (eventType === "morpho_supply" || eventType === "morpho_borrow") {
    return {
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      text: "text-emerald-100"
    };
  }

  // Morpho withdraw/repay events - Orange/Rose theme (outflows)
  if (eventType === "morpho_withdraw" || eventType === "morpho_repay") {
    return {
      border: "border-rose-500/30",
      bg: "bg-rose-500/10",
      text: "text-rose-100"
    };
  }

  return defaultScheme;
}

function getEventLabel(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "Notification";

  const payloadObj = payload as Record<string, unknown>;
  const metaEventConfig = payloadObj.meta_event_config as Record<string, unknown> | undefined;

  if (!metaEventConfig) return "Notification";

  const metaType = metaEventConfig.type as string | undefined;

  if (metaType === "rolling_aggregate") return "Rolling Aggregate";
  if (metaType === "event_count") return "Event Count";
  if (metaType === "net_aggregate") return "Net Aggregate";

  return "Notification";
}

export function DemoCallbackViewer() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [status, setStatus] = useState<string>("Connecting to webhook stream...");

  useEffect(() => {
    const eventSource = new EventSource("/api/demo-callback/stream");

    const handleSeed = (event: MessageEvent<string>) => {
      try {
        const parsed = JSON.parse(event.data) as {
          notifications?: NotificationRecord[];
        };
        if (parsed.notifications) {
          setNotifications(parsed.notifications);
        }
        setStatus("Listening for notifications...");
      } catch (error) {
        console.error("Unable to parse seed payload", error);
      }
    };

    const handleNotification = (event: MessageEvent<string>) => {
      try {
        const record = JSON.parse(event.data) as NotificationRecord;
        setNotifications(prev => [record, ...prev].slice(0, 50));
        setStatus("New webhook received");
      } catch (error) {
        console.error("Unable to parse notification payload", error);
      }
    };

    eventSource.addEventListener("seed", handleSeed);
    eventSource.addEventListener("notification", handleNotification);
    eventSource.onopen = () => setStatus("Listening for notifications...");
    eventSource.onerror = () => setStatus("Connection lost · retrying...");

    return () => {
      eventSource.removeEventListener("seed", handleSeed);
      eventSource.removeEventListener("notification", handleNotification);
      eventSource.close();
    };
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/60">{status}</p>
      <div className="space-y-3">
        {notifications.map(notification => {
          const colorScheme = getEventColorScheme(notification.payload);
          const eventLabel = getEventLabel(notification.payload);

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border ${colorScheme.border} ${colorScheme.bg} p-4`}
            >
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>{eventLabel}</span>
                <time dateTime={notification.receivedAt}>
                  {new Date(notification.receivedAt).toLocaleTimeString()}
                </time>
              </div>
              <pre className={`mt-2 overflow-auto text-sm ${colorScheme.text}`}>
                {JSON.stringify(notification.payload, null, 2)}
              </pre>
            </motion.div>
          );
        })}
        {notifications.length === 0 && (
          <p className="text-sm text-white/60">
            Waiting for Tell Tide to send the first webhook. Trigger one from the setup page.
          </p>
        )}
      </div>
    </div>
  );
}
