'use client';

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface NotificationRecord {
  id: string;
  receivedAt: string;
  payload: unknown;
}

async function fetchNotifications(): Promise<NotificationRecord[]> {
  const response = await fetch("/api/demo-callback");
  if (!response.ok) {
    throw new Error("Unable to load demo callbacks");
  }
  const data = await response.json();
  return data.notifications ?? [];
}

export function DemoCallbackViewer() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["demo-callback"],
    queryFn: fetchNotifications,
    refetchInterval: 4000
  });

  return (
    <div className="space-y-4">
      {isLoading && <p className="text-sm text-white/60">Listening for notifications...</p>}
      {error && (
        <p className="text-sm text-red-400">
          {(error as Error).message}. Ensure the Next.js API route is running.
        </p>
      )}
      <div className="space-y-3">
        {data?.map(notification => (
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
        {!isLoading && !error && (data?.length ?? 0) === 0 && (
          <p className="text-sm text-white/60">
            Waiting for Tell Tide to send the first webhook. Trigger one from the setup page.
          </p>
        )}
      </div>
    </div>
  );
}
