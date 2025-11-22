'use client';

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { AppWindow } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SubscriptionForm } from "@/components/subscriptions/subscription-form";
import { SubscriptionList } from "@/components/subscriptions/subscription-list";
import { DemoCallbackCard } from "@/components/callback/demo-callback-card";
import { ReownConnectButton } from "@/components/landing/reown-connect-button";

export function SetupScreen() {
  const queryClient = useQueryClient();

  return (
    <div className="space-y-10">
      <header className="rounded-[32px] border border-white/10 bg-white/5 p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">
              Setup studio
            </p>
            <h1 className="text-4xl font-semibold">
              Connect via Reown, then orchestrate Tell Tide subscriptions.
            </h1>
            <p className="text-sm text-white/70">
              Use this guided flow to prototype alerts for hackathon judges. Everything is wired to
              the Tell Tide REST API and the built-in callback endpoint.
            </p>
            <div className="flex flex-wrap gap-3">
              <ReownConnectButton />
              <Button variant="outline" asChild>
                <Link href="/demo-callback" className="inline-flex items-center gap-2">
                  <AppWindow className="h-4 w-4" /> Live callback feed
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <SubscriptionForm onCreated={() => queryClient.invalidateQueries({ queryKey: ["subscriptions"] })} />
        <SubscriptionList />
      </div>

      <DemoCallbackCard />
    </div>
  );
}
