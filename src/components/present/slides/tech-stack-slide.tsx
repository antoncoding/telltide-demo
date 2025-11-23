'use client';

import { motion } from 'framer-motion';
import { Database, Zap, Globe, Webhook, DollarSign, ArrowRight } from 'lucide-react';

export function TechStackSlide() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="w-full max-w-6xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <p className="text-sm uppercase tracking-wide text-purple-400">Tech Stack</p>
          <h2 className="mt-2 text-4xl font-bold text-white">How it works</h2>
        </motion.div>

        {/* Horizontal Architecture Diagram */}
        <div className="flex items-center justify-center gap-3">
          {/* Networks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-2"
          >
            <div className="rounded-lg border border-blue-500/30 bg-blue-950/30 px-3 py-2 text-center">
              <Globe className="mx-auto mb-1 h-4 w-4 text-blue-400" />
              <p className="text-xs text-white">Ethereum</p>
            </div>
            <div className="rounded-lg border border-blue-500/30 bg-blue-950/30 px-3 py-2 text-center">
              <Globe className="mx-auto mb-1 h-4 w-4 text-blue-400" />
              <p className="text-xs text-white">Base</p>
            </div>
          </motion.div>

          {/* Arrow */}
          <ArrowRight className="h-5 w-5 text-blue-400/50" />

          {/* SQD Portal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="rounded-lg border border-purple-500/40 bg-purple-950/40 px-5 py-3">
              <Database className="mx-auto mb-1 h-5 w-5 text-purple-400" />
              <p className="text-center text-sm font-semibold text-white">SQD Portal</p>
              <p className="mt-1 text-center text-xs text-white/60">Event ingestion</p>
            </div>
          </motion.div>

          {/* Arrow */}
          <ArrowRight className="h-5 w-5 text-purple-400/50" />

          {/* Indexer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="rounded-lg border border-green-500/40 bg-green-950/40 px-5 py-3">
              <Zap className="mx-auto mb-1 h-5 w-5 text-green-400" />
              <p className="text-center text-sm font-semibold text-white">Indexer</p>
              <p className="mt-1 text-center text-xs text-white/60">SQD SDK</p>
            </div>
          </motion.div>

          {/* Arrow */}
          <ArrowRight className="h-5 w-5 text-green-400/50" />

          {/* Worker & API */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col gap-2"
          >
            <div className="rounded-lg border border-amber-500/40 bg-amber-950/40 px-5 py-2 text-center">
              <Webhook className="mx-auto mb-1 h-4 w-4 text-amber-400" />
              <p className="text-xs font-semibold text-white">Worker</p>
            </div>

            <div className="relative rounded-lg border border-sky-500/40 bg-sky-950/40 px-5 py-2 text-center">
              {/* <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 }}
                className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full border border-pink-500/40 bg-pink-950/60 px-2 py-0.5"
              >
                <DollarSign className="inline h-2.5 w-2.5 text-pink-400" />
                <span className="ml-0.5 text-[10px] font-semibold text-pink-400">x402</span>
              </motion.div> */}
              <Zap className="mx-auto mb-1 h-4 w-4 text-sky-400" />
              <p className="text-xs font-semibold text-white">API</p>
            </div>
          </motion.div>

          {/* Arrow */}
          <ArrowRight className="h-5 w-5 text-sky-400/50" />

          {/* Users */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="rounded-lg border border-white/20 bg-slate-900/60 px-5 py-4 text-center">
              <p className="text-sm text-white">Developers</p>
              <p className="text-sm text-white">& Agents</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center text-xs text-white/50"
        >
          Dynamic agent payments via x402 coming soon
        </motion.div>
      </div>
    </div>
  );
}
