"use client";

import TimelineItem from "@/components/timeline-item";
import { experienceData } from "@/lib/data";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function WorkPage() {
  return (
    <div className="bg-background text-foreground theme-transition relative overflow-hidden">
      <main className="px-6 py-12 relative">
        {/* Header Content - Narrower */}
        <div className="max-w-4xl mx-auto mb-20">
          <motion.h1 variants={itemVariants} className="heading-display mb-8 text-center">
            <span className="lust-aalt">P</span>i<span className="lust-swsh">x</span>e<span className="lust-aalt">l</span><span className="lust-ss02">s</span> <span className="lust-ss02">P</span><span className="lust-swsh">u</span><span className="lust-aalt">s</span><span className="lust-ss02">h</span>e<span className="lust-ss03">d</span>
          </motion.h1>
          {/* Separator Line */}
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"
          />
          <motion.h2 variants={itemVariants} className="font-normal text-2xl mb-12">
            Apps & Companies
          </motion.h2>
          <motion.div variants={itemVariants} className="mb-16">
            <p className="text-body-main">
              I have been the principal Product Designer at high-growth
              venture-backed startups for the past 15 years or so. My experience
              encompasses shaping the visual design, UI, and data visualization
              of a B2B SaaS app. I'm a sucker for the well-executed basics of a
              clean layout, vibrant color palette, and ample white space around
              the typography.
            </p>
          </motion.div>
        </div>

        {/* Timeline - Full Width */}
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="relative">
            {experienceData.map((job, index) => (
              <TimelineItem
                key={job.company}
                job={job}
                index={index}
                isLast={index === experienceData.length - 1}
              />
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
