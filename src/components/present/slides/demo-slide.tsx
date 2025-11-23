'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Rocket, Settings, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function DemoSlide() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-4xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-4 flex justify-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-purple-600">
              <Rocket className="h-8 w-8 text-white" />
            </div>
          </motion.div>

          <h2 className="text-4xl font-bold text-white">Ready to explore?</h2>
          <p className="mt-3 text-lg text-white/70">
            Build your first meta-event subscription
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid gap-3 md:grid-cols-2"
        >
          <Card className="border border-white/10 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-white">Query Builder</p>
                <p className="mt-1 text-sm text-white/60">
                  Configure chains, contracts, aggregations, and thresholds
                </p>
              </div>
            </div>
          </Card>

          <Card className="border border-white/10 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-white">Live Demo Stream</p>
                <p className="mt-1 text-sm text-white/60">
                  Watch callbacks arrive in real-time
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-3"
        >
          <Button asChild size="lg" className="text-base">
            <Link href="/setup">
              Open Query Builder
              <Rocket className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg">
            <Link href="/demo-callback">Watch Demo Stream</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-white/40"
        >
          Monitor Morpho markets, ERC4626 vaults, and ERC20 transfers with intelligent meta-events
        </motion.div>
      </div>
    </div>
  );
}
