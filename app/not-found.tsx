"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MagneticLink from "@/components/magnetic-link";
import { gentleEase } from "@/lib/animations";

const headingVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: gentleEase,
      delay: 0.1,
    },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: gentleEase,
      delay: 0.5,
    },
  },
};

const dividerVariants = {
  hidden: { opacity: 0, scaleX: 0.8 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: {
      duration: 0.9,
      ease: gentleEase,
      delay: 1.0,
    },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.1,
      ease: gentleEase,
      delay: 1.2,
    },
  },
};

export default function NotFound() {
  return (
    <div className="bg-background text-foreground theme-transition flex flex-col relative overflow-hidden">
      <main className="flex flex-col items-center justify-center px-6 text-center theme-transition relative mx-auto min-h-[80vh]">
        <motion.div
          className="flex flex-col items-center"
          initial="hidden"
          animate="visible"
        >
          {/* Giant 404 */}
          <motion.h1
            className="heading-display text-center leading-[0.85] mb-6 !text-[clamp(7rem,18vw,12rem)]"
            variants={headingVariants}
          >
            <span className="lust-swsh">4</span>
            <span className="lust-salt">0</span>
            <span className="lust-swsh">4</span>
          </motion.h1>

          {/* Secondary text */}
          <motion.p
            className="font-light text-xl max-w-xl mx-auto text-muted-foreground tracking-normal text-center"
            variants={subtitleVariants}
          >
            Not every pixel lands where you expect.
          </motion.p>

          {/* Divider */}
          <motion.div
            className="h-px bg-accent/40 w-32 my-10"
            variants={dividerVariants}
          />

          {/* Link home */}
          <motion.div variants={linkVariants}>
            <MagneticLink
              href="/pixels"
              className="flex items-center gap-3 rounded-full px-4 py-2 group -mr-4"
              strength={0.4}
            >
              <span className="text-base md:text-lg text-foreground font-sans transition-colors duration-300 group-hover:text-accent">
                Surprise me
              </span>
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-accent transition-colors duration-300 group-hover:text-accent" />
            </MagneticLink>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
