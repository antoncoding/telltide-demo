'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BellRing, Shield, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ReownConnectButton } from "@/components/landing/reown-connect-button";

const features = [
  {
    title: "Meta-event detection",
    description:
      "Watch ERC20 transfers and ERC4626 vault flows roll into high-signal triggers instead of raw tx noise.",
    icon: Shield
  },
  {
    title: "Programmable webhooks",
    description:
      "Point alerts at any HTTPS endpoint and get retries plus a built-in demo callback route.",
    icon: BellRing
  },
  {
    title: "One-click start",
    description:
      "Connect a wallet, shape a condition, and ship your first subscription without touching backend code.",
    icon: Zap
  }
];

const metaEventExamples = [
  {
    label: "Vault bleed",
    detail: "Sum of ERC4626 withdrawals crosses 1M assets inside 120 minutes",
    window: "2h"
  },
  {
    label: "Base deposit burst",
    detail: "Rolling count of Base vault deposits exceeds 5 events over 300 blocks",
    window: "lookback"
  },
  {
    label: "Shrinking deposits",
    detail: "Average deposit size falls below 10k assets in 60 minutes",
    window: "1h"
  }
];

export function LandingPage() {
  return (
    <div className="space-y-20 pb-20">
      <Hero />
      <WhyMetaEvents />
      <FeatureGrid />
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
          Stay early. Stay safe in the dark forest.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/70">
          We already know that single events are noise. Tell Tide encodes rolling conditions—counts,
          averages, sums—so you can react to state changes, not isolated transfers.
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
        <h2 className="mt-2 text-2xl font-semibold text-white">Raw tx feeds miss the story.</h2>
        <p className="mt-3 text-sm text-white/70">
          Tell Tide watches Ethereum and Base, aggregates vault deposits, withdrawals, and token
          transfers, then ships a webhook only when your predicate is true. You choose the chain,
          timeframe, aggregation, and cooldown so your team only sees actionable signals.
        </p>
      </div>
      <div className="space-y-3 text-sm text-white/75">
        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
          <p className="font-medium">Stateful triggers</p>
          <p className="mt-1 text-white/60">Define rolling windows or block lookbacks per chain.</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
          <p className="font-medium">Webhook ready</p>
          <p className="mt-1 text-white/60">Cooldowns and retries are handled for you.</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
          <p className="font-medium">Demo friendly</p>
          <p className="mt-1 text-white/60">Use the built-in callback stream to prove the alert on stage.</p>
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {features.map(({ title, description, icon: Icon }) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <Card className="h-full border border-white/10 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-300">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-white/65">{description}</p>
          </Card>
        </motion.div>
      ))}
    </section>
  );
}

function ExampleMetaEvents() {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm uppercase tracking-wide text-sky-300">Reference patterns</p>
        <h2 className="text-xl font-semibold text-white">What a Tell Tide meta-event looks like</h2>
        <p className="text-sm text-white/65">Drag these into the builder or adapt them to your contracts.</p>
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
