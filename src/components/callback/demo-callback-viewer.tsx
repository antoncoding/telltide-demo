'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import type { NotificationRecord } from "@/lib/demo-callback-store";

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
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4"
          >
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Notification</span>
              <time dateTime={notification.receivedAt}>
                {new Date(notification.receivedAt).toLocaleTimeString()}
              </time>
            </div>
            <pre className="mt-2 overflow-auto text-sm text-emerald-100">
              {JSON.stringify(notification.payload, null, 2)}
            </pre>
          </motion.div>
        ))}
        {notifications.length === 0 && (
          <p className="text-sm text-white/60">
            Waiting for Tell Tide to send the first webhook. Trigger one from the setup page.
          </p>
        )}
      </div>
    </div>
  );
}
