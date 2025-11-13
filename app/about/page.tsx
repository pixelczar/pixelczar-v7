"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Metadata } from "next";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground theme-transition relative overflow-hidden">
      <main className="px-6 py-12 theme-transition relative">
        {/* Header Content - Centered and Constrained */}
        <div className="max-w-4xl mx-auto mb-20">
          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl font-serif heading-display italic font-normal text-foreground mb-16 theme-transition text-center"
          >
            <span className="lust-aalt">H</span>el<span className="lust-swsh">l</span>o, <span className="lust-aalt">I</span>'<span className="lust-swsh">m</span> <span className="lust-aalt">W</span>il<span className="lust-ss03">l</span>
          </motion.h1>

          {/* Separator Line */}
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-accent/40 mx-auto mb-16 theme-transition"
          />
        </div>

        {/* Content - Wider Container */}
        <div className="max-w-4xl mx-auto">
          {/* First Paragraph */}
          <motion.div variants={itemVariants} className="mb-12 theme-transition">
            <p className="text-lg text-body-main leading-relaxed theme-transition">
              I love Design. The typography, the colors, the creative problem
              solving with multiple moving parts, the work with other parts of
              the company to achieve something greater than one person or one
              department.
            </p>
          </motion.div>

          {/* Quote */}
          <motion.div variants={itemVariants} className="mb-12 theme-transition">
            <p className="text-2xl text-foreground leading-relaxed theme-transition font-light">
              You've got to be creative when your name is Will Smith... the easy
              domains are taken.
            </p>
          </motion.div>

          {/* Experience Paragraph */}
          <motion.div variants={itemVariants} className="mb-16 theme-transition">
            <p className="text-lg text-body-main leading-relaxed theme-transition">
              I have been designing at high-growth venture-backed startups for
              the past 15 years or so. My experience encompasses shaping the
              visual design, UI, and data visualization of a B2B SaaS app. I'm a
              sucker for the well-executed basics of a clean layout, vibrant
              color palette, and ample white space around the typography.
            </p>
          </motion.div>

          {/* Photo */}
          <motion.div variants={itemVariants} className="max-w-lg mx-auto">
            <div className="relative overflow-hidden rounded-lg shadow-2xl theme-transition">
              <Image
                src="/images/will-reflective-03.jpg"
                alt="Will Smith in reflective jacket"
                width={500}
                height={700}
                className="w-full h-auto object-cover theme-transition"
                priority
              />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
