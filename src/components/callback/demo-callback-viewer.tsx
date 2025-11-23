'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import type { NotificationRecord } from "@/lib/demo-callback-store";

type EventColorScheme = {
  border: string;
  bg: string;
  text: string;
  label: string;
};

// Simple hash function to generate a consistent number from a string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Color palette for subscriptions
const colorPalette = [
  { border: "border-emerald-500/30", bg: "bg-emerald-500/10", text: "text-emerald-100" },
  { border: "border-blue-500/30", bg: "bg-blue-500/10", text: "text-blue-100" },
  { border: "border-purple-500/30", bg: "bg-purple-500/10", text: "text-purple-100" },
  { border: "border-rose-500/30", bg: "bg-rose-500/10", text: "text-rose-100" },
  { border: "border-amber-500/30", bg: "bg-amber-500/10", text: "text-amber-100" },
  { border: "border-cyan-500/30", bg: "bg-cyan-500/10", text: "text-cyan-100" },
  { border: "border-violet-500/30", bg: "bg-violet-500/10", text: "text-violet-100" },
  { border: "border-pink-500/30", bg: "bg-pink-500/10", text: "text-pink-100" },
  { border: "border-orange-500/30", bg: "bg-orange-500/10", text: "text-orange-100" },
  { border: "border-teal-500/30", bg: "bg-teal-500/10", text: "text-teal-100" },
];

function getEventColorScheme(payload: unknown): EventColorScheme {
  // Default color scheme
  const defaultScheme: EventColorScheme = {
    border: "border-slate-500/30",
    bg: "bg-slate-500/10",
    text: "text-slate-100",
    label: "Unknown"
  };

  // Log the full payload for debugging
  console.log("📦 Webhook payload:", payload);

  if (!payload) {
    console.log("⚠️ Payload is null or undefined");
    return { ...defaultScheme, label: "Empty Payload" };
  }

  if (typeof payload !== "object") {
    console.log("⚠️ Payload is not an object:", typeof payload);
    return defaultScheme;
  }

  const payloadObj = payload as Record<string, unknown>;
  const subscriptionName = payloadObj.subscription_name as string | undefined;

  console.log("🏷️ Subscription name:", subscriptionName);

  // Use subscription_name to determine color
  if (subscriptionName) {
    const hash = hashString(subscriptionName);
    const colorIndex = hash % colorPalette.length;
    const colors = colorPalette[colorIndex];

    return {
      ...colors,
      label: subscriptionName
    };
  }

  return { ...defaultScheme, label: "No Subscription Name" };
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

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className={`rounded-2xl border ${colorScheme.border} ${colorScheme.bg} p-4 shadow-lg`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white/80">{colorScheme.label}</span>
                <time dateTime={notification.receivedAt} className="text-white/60">
                  {new Date(notification.receivedAt).toLocaleTimeString()}
                </time>
              </div>
              <pre className={`mt-2 overflow-auto text-sm ${colorScheme.text}`}>
                {notification.payload ? JSON.stringify(notification.payload, null, 2) : "null"}
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
