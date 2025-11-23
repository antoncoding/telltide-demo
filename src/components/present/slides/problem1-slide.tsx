'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Users, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function Problem1Slide() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-5xl space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm uppercase tracking-wide text-red-400">Problem #1</p>
          <h2 className="mt-2 text-4xl font-bold text-white">
            Ethereum is a dark forest
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-white/70"
        >
          Informed players exit first. Retail users get stuck.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl border border-sky-500/30 bg-sky-950/30 p-4"
        >
          <p className="italic text-white/80">
            "PvP szn on liquidity. The world is cruel, but if you don’t take it someone else will."
          </p>
          <p className="mt-2 text-sm text-white/50">— @Tiza4ThePeople on the recent K3 vault incident</p>
        </motion.div>

        <div className="grid gap-3 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex"
          >
            <Card className="flex h-full w-full border border-white/10 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Late signals</p>
                  <p className="mt-1 text-sm text-white/60">
                    By the time you know, it's too late
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex"
          >
            <Card className="flex h-full w-full border border-white/10 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Information asymmetry</p>
                  <p className="mt-1 text-sm text-white/60">
                    Insiders move first, retail follows
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex"
          >
            <Card className="flex h-full w-full border border-white/10 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Bank runs</p>
                  <p className="mt-1 text-sm text-white/60">
                    Mass withdrawals leave stragglers behind
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
