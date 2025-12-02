"use client";

import Profile from "@/components/profile";
import { motion } from "framer-motion";
import { itemVariants } from "@/lib/animations";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export default function HomePage() {
  return (
    <div className="bg-background text-foreground theme-transition flex flex-col relative overflow-hidden">
      <motion.main 
        className="flex flex-col items-center justify-center px-6 text-center theme-transition relative mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          variants={itemVariants}
          className="heading-display py-12 max-w-2xl"
        >
          <span className="lust-aalt">D</span>esi<span className="lust-swsh">g</span><span className="lust-swsh">n</span><span className="lust-salt">e</span><span className="lust-swsh">r</span> <span className="lust-swsh">&</span> <span className="lust-ss02">b</span><span className="lust-swsh">u</span><span className="lust-swsh">i</span><span className="lust-swsh">l</span><span className="lust-salt">d</span><span className="lust-swsh">e</span><span className="lust-ss03">r</span>
        </motion.h1>
        <motion.h2 
          variants={itemVariants}
          className="font-light text-xl max-w-xl mx-auto text-muted-foreground my-10"
        >
          Product design, vision, strategy, leadership, visual design, systems thinking, brand, prototyping, and craft.
        </motion.h2>
        <motion.div variants={itemVariants}>
          <Profile />
        </motion.div>
      </motion.main>
    </div>
  );
}
