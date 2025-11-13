"use client";

import Profile from "@/components/profile";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground theme-transition flex flex-col relative overflow-hidden">
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center theme-transition relative mx-auto">
        <motion.div variants={itemVariants} className="mb-32">
          <h1 className="heading-display text-4xl mb-16 max-w-7xl">
            <span className="lust-aalt">P</span>roduct design, <span className="lust-swsh">l</span>eadership, visua<span className="lust-ss02">l</span>s, syste<span className="lust-aalt">m</span>s <span className="lust-swsh">t</span>hi<span className="lust-swsh">n</span>kin<span className="lust-swsh">g</span>, <span className="lust-ss02">b</span>ra<span className="lust-swsh">n</span>d, prototypes.
          </h1>
        </motion.div>
        <Profile />
      </main>
    </div>
  );
}
