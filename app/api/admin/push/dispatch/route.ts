import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { dispatchLeadPushNotifications } from "@/lib/push/dispatch";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const expected = process.env.LEAD_PUSH_CRON_SECRET?.trim();
  const received = request.headers.get("x-cron-secret")?.trim();
  if (!expected || !received || !safeEqual(expected, received)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const result = await dispatchLeadPushNotifications();
    if (!result.configured) {
      return NextResponse.json({ error: "push_not_configured" }, { status: 503 });
    }
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("lead push dispatch:", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "dispatch_failed" }, { status: 500 });
  }
}

function safeEqual(expected: string, received: string): boolean {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  return expectedBuffer.length === receivedBuffer.length
    && timingSafeEqual(expectedBuffer, receivedBuffer);
}
