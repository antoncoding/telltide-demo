'use client';

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { AppWindow } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SubscriptionForm } from "@/components/subscriptions/subscription-form";
import { SubscriptionList } from "@/components/subscriptions/subscription-list";
import { ReownConnectButton } from "@/components/landing/reown-connect-button";

export function SetupScreen() {
  const queryClient = useQueryClient();

  return (
    <div className="space-y-10">
      <header className="rounded-2xl border border-white/10 bg-slate-950/70 p-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-sky-300">Tell Tide builder</p>
          <h1 className="text-2xl font-semibold">Connect a wallet, describe the state change, aim it at a webhook.</h1>
          <p className="text-sm text-white/65">
            Wallet context pre-fills your subscriber id. Pick the chain, contracts, aggregation, and
            cooldown, then watch the callback stream confirm the hit.
          </p>
          <div className="flex flex-wrap gap-3">
            <ReownConnectButton />
            <Button variant="outline" asChild>
              <Link href="/demo-callback" className="inline-flex items-center gap-2 text-sm">
                <AppWindow className="h-4 w-4" /> Callback stream
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <SubscriptionForm onCreated={() => queryClient.invalidateQueries({ queryKey: ["subscriptions"] })} />
        <SubscriptionList />
      </div>
    </div>
  );
}
