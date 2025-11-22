import { NextResponse, type NextRequest } from "next/server";

import {
  addNotification,
  getNotifications
} from "@/lib/demo-callback-store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const record = addNotification(body);

  console.info("Demo callback received", record);

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ notifications: getNotifications() });
}
