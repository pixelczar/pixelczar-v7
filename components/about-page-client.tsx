"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { itemVariants } from "@/lib/animations";
import type { CaseStudyListItem } from '@/types/sanity'
import AboutWorkGrid from '@/components/about-work-grid'
import GridDistortion, { type EffectParams } from '@/components/grid-distortion'
import MosaicControls from '@/components/mosaic-controls'

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

const ethosItems = [
  {
    number: "01",
    title: "Everything is a product.",
    description: (
      <>
        The words you're reading right now are a product. This site is a product. It has a job to be done. It has <span className="line-through">users</span> humans, stakeholders, and other products interacting with it.
      </>
    ),
  },
  {
    number: "02",
    title: "If you can design one thing, you can design everything.",
    description: "Design skills are transferable. It's a way of thinking about a multi-dimensional problem and coming up with a solution.",
  },
  {
    number: "03",
    title: "AI is changing the game.",
    description: "The way we produce and consume software is being transformed forever. It's an amazing time to be designing how AI shapes experiences, how information is displayed, and how people interact with technology.",
  },
  {
    number: "04",
    title: "The medium is the message.",
    description: "One of the first things they teach in Design School. Today it means making sure how you convey your message amplifies it.",
  },
  {
    number: "05",
    title: "The job is not done until the tools are put away.",
    description: "It's extremely rare your work exists in a silo. You must consider what truly needs to be complete to be done.",
  },
  {
    number: "06",
    title: "The journey is the destination.",
    description: "Doing the work is the work. Learning, building, and iterating matter just as much as the final outcome. The process shapes the product and the person making it.",
  },
];

interface AboutPageClientProps {
  caseStudies: CaseStudyListItem[]
}

export default function AboutPageClient({ caseStudies }: AboutPageClientProps) {
  const [effectParams, setEffectParams] = useState<EffectParams>({
    grid: 14,
    hoverDistance: 3.1,
    clickExplosion: 500,
    strength: 0.82,
    relaxation: 0.16,
    bounceCount: 4,
    monochrome: false,
  })
  const [clickCount, setClickCount] = useState(0)
  const [hoveredEthos, setHoveredEthos] = useState<number | null>(null)
  const controlsVisible = clickCount >= 3

  return (
    <div className="bg-background text-foreground theme-transition relative overflow-hidden">
      <motion.main 
        className="px-6 py-12 theme-transition relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Giant Header */}
        <div className="max-w-3xl mx-auto mb-12">
          <motion.h1
            variants={itemVariants}
            className="text-6xl font-serif heading-display italic font-normal text-foreground mt-12 md:mt-8 mb-24 md:mb- theme-transition text-center"
          >
            <span className="lust-aalt">H</span>e<span className="lust-swsh">y</span>a, <span className="">I</span>'<span className="lust-swsh">m</span> <span className="lust-aalt">W</span>il<span className="lust-ss03">l</span>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-accent/40 mx-auto mb-6 theme-transition"
          />
        </div>

        {/* Will Smith Quote */}
        <div className="max-w-3xl mx-auto mb-12">
          <motion.div variants={itemVariants} className="mb-6 theme-transition">
            <p className="text-2xl text-primary theme-transition font-light">
              You've got to be creative when your name is <span className="text-accent">Will Smith</span>... the easy domains are taken.
            </p>
          </motion.div>
        </div>

        {/* Photo */}
        <div className="max-w-7xl mx-auto mb-24">
          <motion.div variants={itemVariants} className="">
            <div 
              className="relative overflow-hidden rounded-xl theme-transition aspect-[3/2] w-full"
              onClick={() => setClickCount(c => c + 1)}
            >
              <GridDistortion
                imageSrc="/images/will-ocean-headshot.jpg"
                grid={effectParams.grid}
                hoverDistance={effectParams.hoverDistance}
                clickExplosion={effectParams.clickExplosion}
                strength={effectParams.strength}
                relaxation={effectParams.relaxation}
                bounceCount={effectParams.bounceCount}
                monochrome={effectParams.monochrome}
                className="w-full h-full absolute inset-0"
              />
              {/* Effect Controls - positioned on the image, appears after 3 clicks */}
              <MosaicControls params={effectParams} onParamsChange={setEffectParams} visible={controlsVisible} />
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="w-full h-px bg-accent/40 max-w-3xl mx-auto mt-16 theme-transition"
        />

        {/* Principles / Ethos */}
        <motion.div variants={itemVariants} className="mb-16 theme-transition max-w-3xl mx-auto">
          <h2 className="text-2xl font-normal mt-8 mb-32 font-sans text-foreground">Product & Design Ethos</h2>
          {/* <p className="text-lg text-body-main theme-transition">
            These anecdotes and principles have stuck with me over the years, guiding my approach to designing and building.
          </p> */}
        </motion.div>

        <motion.div variants={itemVariants} className="max-w-7xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24 theme-transition">
            {ethosItems.map((item, index) => (
              <div 
                key={item.number}
                onMouseEnter={() => setHoveredEthos(index)}
                onMouseLeave={() => setHoveredEthos(null)}
                className={`group text-lg text-body-main leading-relaxed theme-transition transition-all duration-300 ${
                  hoveredEthos !== null && hoveredEthos !== index 
                    ? 'opacity-50' 
                    : 'opacity-100'
                }`}
              >
                <p className="mb-2 opacity-50 text-base theme-transition transition-colors duration-300 group-hover:text-accent group-hover:opacity-100">{item.number}</p>
                <h3 className="text-4xl text-foreground tracking-tight font-medium mb-8">{item.title}</h3>
                <p className="text-lg">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Work Grid with Link */}
        <AboutWorkGrid caseStudies={caseStudies} />
      </motion.main>
    </div>
  );
}

