"use client";

import { motion } from "framer-motion";
import { itemVariants } from "@/lib/animations";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export default function ColophonPage() {
  return (
    <div className="bg-background text-foreground theme-transition relative overflow-hidden min-h-screen">
      <motion.main 
        className="px-6 py-12 theme-transition relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl mx-auto mb-12 md:mb-20">
          <motion.h1 
            variants={itemVariants}
            className="heading-display mb-8 text-center"
          >
            <span className="lust-aalt">C</span>o<span className="lust-swsh">l</span>o<span className="lust-swsh">p</span><span className="lust-swsh">h</span>o<span className="lust-ss03">n</span>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"
          />
        </div>

        <div className="max-w-3xl mx-auto space-y-12 text-lg text-body-main">
          <motion.section variants={itemVariants}>
            <h2 className="text-xl font-medium text-foreground mb-4">Design & Type</h2>
            <p>
              Designed in Figma using a process of iterative refinement. The primary typeface is <span className="font-serif italic">Lust</span> for display and a clean, modern sans-serif for body text.
            </p>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2 className="text-xl font-medium text-foreground mb-4">Development</h2>
            <p>
              Built with Next.js, TypeScript, and Tailwind CSS. Framer Motion handles the animations, and Sanity CMS powers the content. The site is hosted on Vercel.
            </p>
          </motion.section>

          <motion.section variants={itemVariants}>
            <h2 className="text-xl font-medium text-foreground mb-4">The "Raised in Cursor" part</h2>
            <p>
              This version of the site was developed using Cursor, leveraging AI to speed up boilerplate and complex UI patterns while maintaining a focus on craft and detail.
            </p>
          </motion.section>
        </div>
      </motion.main>
    </div>
  );
}
