'use client';

import { motion } from 'framer-motion';
import { Radio, Bot, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function Problem2Slide() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-5xl space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm uppercase tracking-wide text-amber-400">Problem #2</p>
          <h2 className="mt-2 text-4xl font-bold text-white">
            Too much noise, not enough signal
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-white/70"
        >
          Agents need opinionated data, not just raw events.
        </motion.p>

        <div className="grid gap-3 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex"
          >
            <Card className="flex h-full w-full border border-white/10 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  <Radio className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Event overload</p>
                  <p className="mt-1 text-sm text-white/60">
                    Millions of events, hard to interpret
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex"
          >
            <Card className="flex h-full w-full border border-white/10 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Custom indexing</p>
                  <p className="mt-1 text-sm text-white/60">
                    Building indexers is complex and slow
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex"
          >
            <Card className="flex h-full w-full border border-white/10 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Need context</p>
                  <p className="mt-1 text-sm text-white/60">
                    Quality data shaped from events
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="space-y-2 rounded-xl border border-white/10 bg-slate-900/60 p-4"
        >
          <p className="font-semibold text-white">The gap:</p>
          <p className="text-white/70">
            Raw events tell you what happened.{' '}
            <span className="font-semibold text-sky-400">Meta-events tell you what it means.</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
