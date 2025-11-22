import { NextResponse, type NextRequest } from "next/server";

interface NotificationRecord {
  id: string;
  receivedAt: string;
  payload: unknown;
}

const notifications: NotificationRecord[] = [];

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const record: NotificationRecord = {
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    payload: body
  };
  notifications.unshift(record);
  if (notifications.length > 25) {
    notifications.length = 25;
  }

  console.info("Demo callback received", record);

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ notifications });
}
