"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import MagneticLink from "@/components/magnetic-link";
import { motion } from "framer-motion";
import { itemVariants, smoothEase } from "@/lib/animations";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: smoothEase,
    },
  },
};

const skillsVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: smoothEase,
    },
  },
};

const photoVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: smoothEase,
    },
  },
};

const nameVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: smoothEase,
    },
  },
};

const dividerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
};

const linkVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: smoothEase,
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
      {/* Designer & Builder Title */}
      <motion.h1 
        className="heading-display py-12 max-w-2xl text-center"
        variants={titleVariants}
      >
        <span className="lust-aalt">D</span>esi<span className="lust-swsh">g</span><span className="lust-swsh">n</span><span className="lust-salt">e</span><span className="lust-swsh">r</span> <span className="lust-swsh">&</span> <span className="lust-ss02">b</span><span className="lust-swsh">u</span><span className="lust-swsh">i</span><span className="lust-swsh">l</span><span className="lust-salt">d</span><span className="lust-swsh">e</span><span className="lust-ss03">r</span>
      </motion.h1>

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
          <p className="text-sm font-sans font-normal" style={{ color: 'var(--muted-foreground)' }}>
            Beverly, Massachusetts
          </p>
        </motion.div>
      </motion.div>

      {/* Divider Line */}
      <motion.div 
        className="h-px bg-accent w-32 mb-4"
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
