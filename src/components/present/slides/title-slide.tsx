'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function TitleSlide() {
  return (
    <div className="flex h-full items-center justify-center px-8 py-12">
      <div className="flex w-full max-w-3xl flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-4"
        >
          <Image
            src="/imgs/logo.png"
            alt="Tell Tide Logo"
            width={100}
            height={100}
            className="rounded-2xl"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold text-white">Tell Tide</h1>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-balance text-3xl font-bold leading-tight text-sky-400 sm:text-4xl"
        >
          Stay early, stay safe
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-lg text-white/70"
        >
          Flexible meta-event notifications for users and agents
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-10 text-sm text-white/50"
        >
          Built by Anton
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-6 text-xs text-white/30"
        >
          Press Enter or → to continue
        </motion.div>
      </div>
    </div>
  );
}
