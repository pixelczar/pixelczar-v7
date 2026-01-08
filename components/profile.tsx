"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import MagneticLink from "@/components/magnetic-link";
import { motion } from "framer-motion";
import { gentleEase, smoothEase } from "@/lib/animations";

const designerVariants = {
  hidden: { opacity: 0, y: -4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: gentleEase,
      delay: .1,
    },
  },
};

const xVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: gentleEase,
      delay: 0.3,
    },
  },
};

const builderVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: gentleEase,
      delay: 0.26,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
    },
  },
};

// Order: 1. Designer → 2. × → 3. Builder → 4. Skills → 5. Profile → 6. Link → 7. Divider

const skillsVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: gentleEase,
      // Starts after Builder finishes: Builder delay (1.0) + Builder duration (0.6) = 1.6
      delay: 0.9,
    },
  },
};

const photoVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.1,
      ease: gentleEase,
      // Starts after skills finishes: skills delay (1.6) + skills duration (0.9)
      delay: 0.8,
    },
  },
};

const nameVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: gentleEase,
      // Starts slightly after photo (within same container)
      delay: 0.1,
    },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: 6},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.1,
      ease: gentleEase,
      // Starts after profile finishes: photo delay (2.5) + photo duration (0.9) + name delay (0.1) + name duration (0.8)
      delay: 2.7,
    },
  },
};

const dividerVariants = {
  hidden: { opacity: 0, y: 4, scaleX: .8 },
  visible: {
    opacity: 1,
    y: 0,
    scaleX: 1,
    transition: {
      duration: 0.9,
      ease: gentleEase,
      // Starts after link finishes: link delay (3.4) + link duration (1.1)
      delay: 2.6,
    },
  },
};

export default function Profile() {
  return (
    <motion.div 
      className="flex flex-col items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Designer × Builder Title */}
      <div className="py-12 flex flex-col items-center w-full">
        <h1 className="heading-display text-center leading-[0.85]">
          <motion.span 
            className="block"
            variants={designerVariants}
            initial="hidden"
            animate="visible"
            style={{ willChange: 'transform, opacity' }}
          >
            <span className="lust-salt">D</span>esi<span className="lust-swsh">g</span><span className="lust-swsh">n</span><span className="lust-salt">e</span><span className="lust-swsh">r</span>
          </motion.span>
          <motion.span 
            className="block text-accent not-italic font-thin subpixel-antialiased mt-1 -mb-2 text-7xl"
            variants={xVariants}
            initial="hidden"
            animate="visible"
            style={{ willChange: 'transform, opacity' }}
          >
            ×
          </motion.span>
          <motion.span 
            className="block"
            variants={builderVariants}
            initial="hidden"
            animate="visible"
            style={{ willChange: 'transform, opacity' }}
          >
            <span className="lust-ss02">B</span><span className="lust-swsh">u</span><span className="lust-swsh">i</span><span className="lust-swsh">l</span><span className="lust-salt">d</span><span className="lust-swsh">e</span><span className="lust-ss03">r</span>
          </motion.span>
        </h1>
      </div>

      {/* Skills Text */}
      <motion.h2 
        className="font-light text-xl max-w-xl mx-auto text-muted-foreground tracking-normal text-center mb-12"
        variants={skillsVariants}
      >
        Product design, vision, strategy, leadership, visual design, systems thinking, brand, prototyping, and craft.
      </motion.h2>

      {/* Space */}
      <div className="mb-12"></div>
      
      {/* Photo */}
      <motion.div 
        className="items-center flex flex-col space-y-2 mb-6"
        variants={photoVariants}
      >
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <Image
            src="/images/will.png"
            alt="Will Smith"
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Name / Location */}
        <motion.div 
          className="text-center"
          variants={nameVariants}
        >
          <h2 className="text-lg font-sans font-medium text-foreground">
            Will Smith
          </h2>
          <p className="text-sm font-sans font-normal text-muted-foreground">
            Beverly, Massachusetts
          </p>
        </motion.div>
      </motion.div>

      {/* Divider Line */}
      <motion.div 
        className="h-px bg-accent/40 w-32 mb-4"
        variants={dividerVariants}
      />

      {/* Link */}
      <motion.div variants={linkVariants}>
        <MagneticLink
          href="/about"
          className="flex items-center gap-3 rounded-full px-4 py-2 group -mr-4"
          strength={0.4}
        >
          <span className="text-base md:text-lg text-foreground font-sans transition-colors duration-300 group-hover:text-accent">
            More about me over here
          </span>
          <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-accent transition-colors duration-300 group-hover:text-accent" />
        </MagneticLink>
      </motion.div>
    </motion.div>
  );
}
