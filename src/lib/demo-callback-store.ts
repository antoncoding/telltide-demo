import { EventEmitter } from "events";

export interface NotificationRecord {
  id: string;
  receivedAt: string;
  payload: unknown;
}

const notifications: NotificationRecord[] = [];
const emitter = new EventEmitter();

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
  return () => {
    emitter.off("notification", listener);
  };
}
