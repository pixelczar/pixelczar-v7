"use client";

import Profile from "@/components/profile";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="bg-background text-foreground theme-transition flex flex-col relative overflow-hidden">
      <main className="flex flex-col items-center justify-center px-6 text-center theme-transition relative mx-auto">
        <motion.div variants={itemVariants} className="mb-10 max-w-2xl space-y-8">
          <h1 className="heading-display">
            <span className="lust-aalt">D</span>esi<span className="lust-swsh">g</span><span className="lust-swsh">n</span><span className="lust-salt">e</span><span className="lust-swsh">r</span> <span className="lust-swsh">&</span> bui<span className="lust-swsh">l</span><span className="lust-salt">d</span><span className="lust-swsh">e</span><span className="lust-ss03">r</span>
          </h1>
          <h2 className="font-light text-2xl max-w-xl mx-auto text-muted-foreground mt-10">Product design, vision, strategy, leadership, visual design, systems thinking, brand, prototyping, and craft.</h2>
        </motion.div>
        <Profile />
      </main>
    </div>
  );
}
