import { EventEmitter } from "events";

export interface NotificationRecord {
  id: string;
  receivedAt: string;
  payload: unknown;
}

const notifications: NotificationRecord[] = [];
const emitter = new EventEmitter();

// Increase max listeners to prevent warnings with multiple SSE connections
emitter.setMaxListeners(50);

console.log("📡 Demo callback store initialized");

export function addNotification(payload: unknown) {
  const record: NotificationRecord = {
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    payload
  };
  notifications.unshift(record);
  if (notifications.length > 50) {
    notifications.length = 50;
  }

  const listenerCount = emitter.listenerCount("notification");
  console.log(`📢 [SERVER] Emitting notification ${record.id} to ${listenerCount} listeners`);
  console.log(`📊 [SERVER] Total notifications in store: ${notifications.length}`);

  emitter.emit("notification", record);
  return record;
}

export function getNotifications() {
  return notifications;
}

export function subscribeToNotifications(
  listener: (record: NotificationRecord) => void
) {
  emitter.on("notification", listener);
  const newCount = emitter.listenerCount("notification");
  console.log(`➕ [SERVER] New SSE listener added. Total active listeners: ${newCount}`);

  return () => {
    emitter.off("notification", listener);
    const remainingCount = emitter.listenerCount("notification");
    console.log(`➖ [SERVER] SSE listener removed. Remaining listeners: ${remainingCount}`);
  };
}
