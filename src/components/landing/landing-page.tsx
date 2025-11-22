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
      "Layer powerful aggregations on top of ERC20 and ERC4626 activity so you can act on real market structure instead of chasing tx spam.",
    icon: Shield
  },
  {
    title: "Programmable webhooks",
    description:
      "Ship production-grade alerts with built-in retries, signatures, and a dedicated demo callback URL for hackathon judges.",
    icon: BellRing
  },
  {
    title: "Framer-motion UI",
    description:
      "Every surface is animated for a premium feel on stage. The gradients and glass panels highlight your brand.",
    icon: Zap
  }
];

const metaEventExamples = [
  {
    label: "Whale rush",
    detail: "Alert when > 50 USDC transfers happen in 15m",
    window: "15m"
  },
  {
    label: "Vault bleed",
    detail: "Notify if withdrawals across 3 vaults exceed 1M in 2h",
    window: "2h"
  },
  {
    label: "Anxious deposits",
    detail: "Trigger if avg deposit size < 10k in 1h",
    window: "1h"
  }
];

const stats = [
  { label: "Chains watched", value: "5 networks" },
  { label: "Events indexed", value: "3 event types" },
  { label: "Alert latency", value: "< 30s" }
];

export function LandingPage() {
  return (
    <div className="space-y-24 pb-24">
      <Hero />
      <FeatureGrid />
      <MetaEvents />
      <Stats />
      <CallToAction />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-950/80 p-10 lg:p-16">
      <div className="absolute inset-0 bg-grid-overlay bg-[size:40px_40px] opacity-5" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <Badge className="mb-6">Tell Tide Hackathon Build</Badge>
        <h1 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
          Detect aggregated blockchain waves before they crash on you.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/70">
          Tell Tide watches ERC20 transfers and ERC4626 vault flows, evaluates rolling
          windows, and pings your webhook the moment a custom meta-event fires.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="group">
            <Link href="/setup">
              Get started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <ReownConnectButton />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-48 w-2/3 rounded-full bg-sky-500/20 blur-3xl"
      />
    </section>
  );
}

function FeatureGrid() {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {features.map(({ title, description, icon: Icon }) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <Card className="h-full p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-white/70">{description}</p>
          </Card>
        </motion.div>
      ))}
    </section>
  );
}

function MetaEvents() {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/5 p-8">
      <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">
            Meta-event blueprints
          </p>
          <h2 className="text-3xl font-semibold">Build subscriptions that matter</h2>
        </div>
        <Button variant="outline" asChild>
          <Link href="/setup">Launch builder</Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {metaEventExamples.map(event => (
          <motion.div
            key={event.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-5">
              <p className="text-xs uppercase tracking-wide text-white/50">{event.window} window</p>
              <h3 className="mt-2 text-lg font-semibold">{event.label}</h3>
              <p className="mt-2 text-sm text-white/70">{event.detail}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="grid gap-4 rounded-[32px] border border-white/10 bg-slate-900/50 p-8 md:grid-cols-3">
      {stats.map(stat => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm uppercase tracking-wide text-white/50">{stat.label}</p>
          <p className="text-2xl font-semibold text-white">{stat.value}</p>
        </motion.div>
      ))}
    </section>
  );
}

function CallToAction() {
  return (
    <section className="rounded-[32px] border border-sky-500/30 bg-slate-900/70 p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-sky-300">
        Demo-ready in minutes
      </p>
      <h2 className="mt-2 text-3xl font-semibold">Wire subscriptions + webhooks without backend work.</h2>
      <p className="mt-4 text-white/70">
        Use the setup page to connect your Reown wallet, program subscriptions, and
        validate callbacks with the built-in URL endpoint.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/setup">Open setup studio</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/demo-callback">View callback stream</Link>
        </Button>
      </div>
    </section>
  );
}
