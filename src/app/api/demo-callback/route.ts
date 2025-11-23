import { NextResponse, type NextRequest } from "next/server";

import {
  addNotification,
  getNotifications
} from "@/lib/demo-callback-store";

export async function POST(request: NextRequest) {
  console.log("🔔 [SERVER] Webhook POST received");

  const body = await request.json().catch((error) => {
    console.error("❌ [SERVER] Failed to parse webhook body:", error);
    return null;
  });

  console.log("📦 [SERVER] Webhook payload:", JSON.stringify(body).slice(0, 200));

  const record = addNotification(body);

  console.log("✅ [SERVER] Webhook processed, notification ID:", record.id);

  return NextResponse.json({ ok: true });
}

export function GET() {
  return NextResponse.json({ notifications: getNotifications() });
}
