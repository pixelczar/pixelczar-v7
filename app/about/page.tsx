"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { itemVariants, smoothEase } from "@/lib/animations";

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

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground theme-transition relative overflow-hidden">
      <motion.main 
        className="px-6 py-12 theme-transition relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Content - Centered and Constrained */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-20">
          <motion.h1
            variants={itemVariants}
            className="text-6xl font-serif heading-display italic font-normal text-foreground mt-12 md:mt-8 mb-24 md:mb-16 theme-transition text-center"
          >
            <span className="lust-aalt">H</span>el<span className="lust-swsh">l</span>o, <span className="lust-aalt">I</span>'<span className="lust-swsh">m</span> <span className="lust-aalt">W</span>il<span className="lust-ss03">l</span>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-accent/40 mx-auto mb-16 theme-transition"
          />
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <motion.div variants={itemVariants} className="mb-12 theme-transition">
            <p className="text-2xl text-accent leading-relaxed theme-transition font-light">
              You've got to be creative when your name is Will Smith... the easy
              domains are taken.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-16 theme-transition">
            <p className="text-lg text-body-main leading-relaxed theme-transition">
              The way we produce and consume software is being transformed forever. It's an exciting time to think about how AI will shape interactions, how information is displayed, and how people connect with technology.
              <br /><br />
              I love design; the typography, the colors, and the creative problem solving that comes with complex systems. I enjoy collaborating across teams to build something greater than any one person or department.
              <br /><br />
              I think in systems. I look for patterns as products evolve and care deeply about the details that make an experience feel effortless. I love learning and finding inspiration in unexpected corners of the internet then using it to create something new.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="w-full h-px bg-accent/40 max-w-4xl mx-auto mt-16 theme-transition"
        />

        {/* Principles / Ethos */}
        <motion.div variants={itemVariants} className="mb-16 theme-transition max-w-4xl mx-auto">
          <h2 className="text-2xl font-normal my-8 font-sans text-foreground">Product development & design ethos</h2>
          <p className="text-lg text-body-main leading-relaxed theme-transition">
            These anecdones and principles have stuck with me over the years, guiding my approach to designing and building.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 theme-transition">
            <div className="text-base text-body-main leading-relaxed theme-transition">
              <h3 className="text-4xl text-foreground tracking-tight font-medium mb-8">Everything is a product.</h3>
              <p className="text-lg">The words you're reading right now are a product. This site is a product. It has a job to be done. It has <span className="line-through">users</span> humans, stakeholders, and other products interacting with it. Its usage elicts a response.</p>
            </div>
            <div className="text-lg text-body-main leading-relaxed theme-transition">
              <h3 className="text-4xl text-foreground tracking-tight font-medium mb-8">If you can design one thing, you can design everything.</h3>
              <p className="text-lg">Design skills are transferable. It's a way of thinking about a multidemensional problem and coming up with a solution. Sometimes the operating space is simple and sometimes it's complex.</p>
            </div>
            <div className="text-lg text-body-main leading-relaxed theme-transition">
              <h3 className="text-4xl text-foreground tracking-tight font-medium mb-8">AI is changing the game.</h3>
              <p className="text-lg">The way we produce and consume software is being transformed forever. It's an exciting time to think about how AI will shape interactions, how information is displayed, and how people connect with technology.</p>
            </div>
            <div className="text-lg text-body-main leading-relaxed theme-transition">
              <h3 className="text-4xl text-foreground tracking-tight font-medium mb-8">The medium is the message.</h3>
              <p className="text-lg">One of the first things they teach in Design School. Today it means making sure how you convery your message amplifies it.</p>
            </div>
            <div className="text-lg text-body-main leading-relaxed theme-transition">
              <h3 className="text-4xl text-foreground tracking-tight font-medium mb-8">The job is not done until the tools are put away.</h3>
              <p className="text-lg">It’s extremely rare your work exists in a silo.  Consider what truly needs to be complete to be done.</p>
            </div>
            <div className="text-lg text-body-main leading-relaxed theme-transition">
              <h3 className="text-4xl text-foreground tracking-tight font-medium mb-8">The journey is the destination.</h3>
              <p className="text-lg">Doing the work is the work. Learning, building, and iterating matter just as much as the final outcome. The process shapes the product and the person making it.</p>
            </div>
          </div>
        </motion.div>

        {/* Photo */}
        <div className="max-w-4xl mx-auto mt-16">
          <motion.div variants={itemVariants} className="max-w-lg mx-auto">
            <div className="relative overflow-hidden rounded-lg theme-transition">
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
      </motion.main>
    </div>
  );
}
