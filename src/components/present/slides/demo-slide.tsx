'use client';

import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

export function DemoSlide() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-4xl space-y-12">
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
            className="mb-6 flex justify-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600">
              <Lightbulb className="h-10 w-10 text-white" />
            </div>
          </motion.div>

          <h2 className="text-5xl font-bold text-white">Future Works</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="rounded-lg border border-white/10 bg-white/5 p-6">
            <ul className="space-y-3 text-xl text-white/90">
              <li className="flex items-start gap-3">
                <span className="text-amber-400">•</span>
                <span>Add x402</span>
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <p className="text-3xl font-semibold text-white">
            Thank you for listening
          </p>
        </motion.div>
      </div>
    </div>
  );
}
