'use client';

import { motion } from 'framer-motion';
import { X, Check, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function SolutionSlide() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-6xl space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <p className="text-sm uppercase tracking-wide text-sky-400">The Solution</p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            From raw events to meta-events
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Old Way */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10">
                <X className="h-4 w-4 text-red-400" />
              </div>
              <h3 className="text-base font-semibold text-white/80">Old: Raw Events</h3>
            </div>

            <Card className="flex-1 border border-red-500/20 bg-red-950/20 p-2.5">
              <p className="text-xs text-white/60">0x7a9...4f2 → 0x3c8...1a9: 2M USDC</p>
            </Card>

            <Card className="flex-1 border border-red-500/20 bg-red-950/20 p-2.5">
              <p className="text-xs text-white/60">0x5b1...6d3 withdrew 200K from Morpho Market A</p>
            </Card>

            <Card className="flex-1 border border-red-500/20 bg-red-950/20 p-2.5">
              <p className="text-xs text-white/60">0x9e4...2c7 borrowed 150K USDC</p>
            </Card>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs italic text-white/40"
            >
              Noisy, disconnected, hard to interpret
            </motion.p>
          </motion.div>

          {/* New Way */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
                <Check className="h-4 w-4 text-green-400" />
              </div>
              <h3 className="text-base font-semibold text-white">New: Meta-Events</h3>
            </div>

            <Card className="flex-1 border border-green-500/30 bg-green-950/20 p-2.5">
              <p className="text-sm font-medium text-white">Massive withdrawal flow detected</p>
              <p className="mt-0.5 text-xs text-white/60">
                Vault 0x1234: -8M USDC in 2 hours (40% of TVL)
              </p>
              <p className="mt-1 text-[10px] text-green-400/60">Aggregated 247 events</p>
            </Card>

            <Card className="flex-1 border border-green-500/30 bg-green-950/20 p-2.5">
              <p className="text-sm font-medium text-white">Protocol exodus pattern</p>
              <p className="mt-0.5 text-xs text-white/60">
                30% of tokens moved away from protocol address in 1 hour
              </p>
              <p className="mt-1 text-[10px] text-green-400/60">Aggregated 156 events</p>
            </Card>

            <Card className="flex-1 border border-green-500/30 bg-green-950/20 p-2.5">
              <p className="text-sm font-medium text-white">Net borrow surge</p>
              <p className="mt-0.5 text-xs text-white/60">
                Morpho markets: +2.5M USDC net borrows in 15 minutes
              </p>
              <p className="mt-1 text-[10px] text-green-400/60">Aggregated 89 events</p>
            </Card>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs italic text-green-400"
            >
              Aggregated, contextual, actionable
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-3 rounded-xl border border-sky-500/30 bg-sky-950/30 p-3"
        >
          <p className="text-sm text-white/80">Subscribe via API</p>
          <ArrowRight className="h-4 w-4 text-sky-400" />
          <p className="text-sm text-white/80">Get notified when conditions are met</p>
        </motion.div>
      </div>
    </div>
  );
}
