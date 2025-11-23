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
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const connectionId = crypto.randomUUID().slice(0, 8);
    console.log(`🔌 [${connectionId}] Setting up EventSource connection`);
    const eventSource = new EventSource("/api/demo-callback/stream");

    const handleSeed = (event: MessageEvent<string>) => {
      console.log(`🌱 [${connectionId}] Seed event received`);
      try {
        const parsed = JSON.parse(event.data) as {
          notifications?: NotificationRecord[];
        };
        console.log(`📥 [${connectionId}] Seed contains`, parsed.notifications?.length ?? 0, "notifications (ignoring old notifications)");
        // Don't load old notifications, only show new ones
        setNotifications([]);
        setStatus("Listening for notifications...");
      } catch (error) {
        console.error(`❌ [${connectionId}] Unable to parse seed payload`, event.data, error);
      }
    };

    const handleNotification = (event: MessageEvent<string>) => {
      console.log(`🔔 [${connectionId}] Notification event received:`, event.data);
      try {
        const record = JSON.parse(event.data) as NotificationRecord;
        console.log(`✅ [${connectionId}] Parsed notification with ID:`, record.id);
        setNotifications(prev => {
          // Check if we already have this notification ID (shouldn't happen but let's verify)
          const exists = prev.some(n => n.id === record.id);
          if (exists) {
            console.warn(`⚠️ [${connectionId}] Duplicate notification ID detected:`, record.id);
            return prev; // Don't add duplicates
          }
          const updated = [record, ...prev].slice(0, 50);
          console.log(`📊 [${connectionId}] Total notifications after update:`, updated.length);
          return updated;
        });
        setStatus("New webhook received");
      } catch (error) {
        console.error(`❌ [${connectionId}] Unable to parse notification payload`, event.data, error);
      }
    };

    const handlePing = (event: MessageEvent<string>) => {
      console.log(`💓 [${connectionId}] Heartbeat ping received`);
    };

    eventSource.addEventListener("seed", handleSeed);
    eventSource.addEventListener("notification", handleNotification);
    eventSource.addEventListener("ping", handlePing);
    eventSource.onopen = () => {
      console.log(`✅ [${connectionId}] EventSource connection opened, readyState:`, eventSource.readyState);
      setStatus("Listening for notifications...");
    };
    eventSource.onerror = (error) => {
      console.error(`❌ [${connectionId}] EventSource error, readyState:`, eventSource.readyState, error);
      setStatus("Connection lost · retrying...");
    };

    return () => {
      console.log(`🔌 [${connectionId}] Cleaning up EventSource connection`);
      eventSource.removeEventListener("seed", handleSeed);
      eventSource.removeEventListener("notification", handleNotification);
      eventSource.removeEventListener("ping", handlePing);
      eventSource.close();
      console.log(`🔌 [${connectionId}] EventSource closed`);
    };
  }, []);

  // Log notifications count when it changes
  useEffect(() => {
    console.log("🎨 Rendering", notifications.length, "notifications");
    console.log("📋 Notification IDs:", notifications.map(n => n.id));
  }, [notifications]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-white/60">{status}</p>
      <div className="space-y-3">
        {notifications.map((notification, index) => {
          const colorScheme = getEventColorScheme(notification.payload);
          const isExpanded = expandedIds.has(notification.id);
          const payloadStr = notification.payload ? JSON.stringify(notification.payload, null, 2) : "null";

          return (
            <motion.div
              key={notification.id}
              layoutId={notification.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              className={`rounded-2xl border ${colorScheme.border} ${colorScheme.bg} p-4 shadow-lg`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-white/80">{colorScheme.label}</span>
                <div className="flex items-center gap-2">
                  <time dateTime={notification.receivedAt} className="text-white/60">
                    {new Date(notification.receivedAt).toLocaleTimeString()}
                  </time>
                  <button
                    onClick={() => toggleExpanded(notification.id)}
                    className="text-white/60 hover:text-white/90 transition-colors px-2 py-1 rounded hover:bg-white/5"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? "▼" : "▶"}
                  </button>
                </div>
              </div>
              <pre
                className={`overflow-auto text-sm ${colorScheme.text} transition-all duration-200 ${
                  isExpanded ? "max-h-[600px]" : "max-h-[120px]"
                }`}
                style={{
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap"
                }}
              >
                {payloadStr}
              </pre>
              {!isExpanded && payloadStr.split('\n').length > 6 && (
                <div className={`text-xs ${colorScheme.text} opacity-50 mt-1`}>
                  Click ▶ to expand full payload
                </div>
              )}
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
