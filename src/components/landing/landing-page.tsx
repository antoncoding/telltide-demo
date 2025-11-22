'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Gauge, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ReownConnectButton } from "@/components/landing/reown-connect-button";

const metaEventExamples = [
  {
    label: "Morpho net withdrawal",
    detail: "Net supply (supply - withdraw) drops below -1M USDC in a market over 1 hour",
    window: "1h"
  },
  {
    label: "Vault volume spike",
    detail: "Total deposit volume exceeds 5M assets in 30 minutes—catch whale activity early",
    window: "30m"
  },
  {
    label: "Borrow rate surge",
    detail: "Net borrows (borrow - repay) exceed 500K USDC across Morpho markets in 15 minutes",
    window: "15m"
  }
];

export function LandingPage() {
  return (
    <div className="space-y-20 pb-20">
      <Hero />
      <WhyMetaEvents />
      <ExampleMetaEvents />
      <CallToAction />
    </div>
  );
}

function Hero() {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <Badge className="mb-4">Tell Tide</Badge>
        <h1 className="text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
          DeFi safety through intelligent monitoring
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/70">
          Watch Morpho markets, ERC4626 vaults, and ERC20 transfers roll into high-signal triggers
          instead of raw event noise. Meta-events give you indexed data—rolling averages, net flows,
          volume changes—so you react to what matters.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild className="group">
            <Link href="/setup">
              Get started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <ReownConnectButton />
        </div>
      </motion.div>
    </section>
  );
}

function WhyMetaEvents() {
  return (
    <section className="grid gap-8 rounded-2xl border border-white/10 bg-slate-950/60 p-8 md:grid-cols-2">
      <div>
        <p className="text-sm uppercase tracking-wide text-sky-300">Why meta-events</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Raw events miss the context.</h2>
        <p className="mt-3 text-sm text-white/70">
          Tell Tide watches Ethereum and Base, indexing Morpho markets, vault flows, and token transfers
          into context-aware meta-events. Track net supply changes, volume percentages, and rolling
          averages—not just isolated transactions. Your webhook fires only when conditions are met.
        </p>
      </div>
      <div className="space-y-3 text-sm text-white/75">
        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-300">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-white">Stateful triggers</p>
              <p className="mt-1 text-white/60">Define rolling windows or block lookbacks per chain with cooldown protection.</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-300">
              <Gauge className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-white">Streaming fast</p>
              <p className="mt-1 text-white/60">Real-time indexed data with webhook retries and built-in callback demo stream.</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-300">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-white">Customizable</p>
              <p className="mt-1 text-white/60">Choose chains, contracts, aggregations, thresholds, and time windows—all from one form.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExampleMetaEvents() {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm uppercase tracking-wide text-sky-300">DeFi-native monitoring</p>
        <h2 className="text-xl font-semibold text-white">Watch Morpho markets and vault flows in real-time</h2>
        <p className="text-sm text-white/65">Monitor supply, borrow, withdraw, and repay events across all Morpho markets, plus ERC4626 vaults and ERC20 transfers.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {metaEventExamples.map(card => (
          <Card key={card.label} className="border border-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-white/40">{card.window}</p>
            <p className="mt-1 text-base font-semibold text-white">{card.label}</p>
            <p className="mt-1 text-sm text-white/65">{card.detail}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/70 p-8">
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm uppercase tracking-wide text-sky-300">Show the signal</p>
        <h2 className="text-2xl font-semibold text-white">Configure a condition, aim it at your webhook, watch the meta-event land.</h2>
        <p className="text-sm text-white/65">
          The setup workspace captures wallet context, chain, contracts, cooldowns, and your callback URL.
          The demo stream lets you prove it without spinning more services.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <Button asChild>
            <Link href="/setup">Open builder</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/demo-callback">Watch callback stream</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
