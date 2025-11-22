'use client';

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DEMO_CALLBACK_URL } from "@/lib/utils";

export function DemoCallbackCard() {
  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(DEMO_CALLBACK_URL).catch(() => {
        /* no-op */
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-sky-300">Demo callback URL</p>
          <h3 className="text-2xl font-semibold">{DEMO_CALLBACK_URL}</h3>
          <p className="mt-2 text-sm text-white/60">
            Use this endpoint while demoing. Trigger a meta-event and watch the payload arrive at
            /demo-callback.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/demo-callback">Open stream</Link>
          </Button>
          <Button variant="subtle" onClick={handleCopy}>
            Copy URL
          </Button>
        </div>
      </div>
    </Card>
  );
}
