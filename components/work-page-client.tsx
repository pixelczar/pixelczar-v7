'use client'

import { motion } from 'framer-motion'
import TimelineItem from '@/components/timeline-item'
// import CaseStudyCard from '@/components/case-study-card' // Hidden for launch
import type { CaseStudyListItem } from '@/types/sanity'
import type { Experience } from '@/lib/data'
import { itemVariants } from '@/lib/animations'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

interface WorkPageClientProps {
  caseStudies: CaseStudyListItem[]
  experienceData: Experience[]
}

export default function WorkPageClient({ caseStudies, experienceData }: WorkPageClientProps) {
  return (
    <div className="bg-background text-foreground theme-transition relative overflow-hidden">
      <motion.main 
        className="px-4 md:px-6 py-8 md:py-12 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Content */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-20">
          <motion.h1 variants={itemVariants} className="heading-display mb-6 md:mb-8 text-center">
            <span className="lust-aalt tracking-tightest -mr-4">W</span><span className="tracking-tighter">o</span>r<span className="lust-swsh tracking-tighter">k</span>
          </motion.h1>
        </div>

        {/* TODO: Re-enable Case Studies section when content is ready */}
        {/* Case Studies Section - Hidden for launch */}

        {/* Apps & Companies Timeline */}
        <div className="max-w-4xl mx-auto mb-12">
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"
          />
          <motion.h2 variants={itemVariants} className="font-normal text-xl md:text-2xl mb-6 md:mb-8 text-foreground">
            Apps & Companies
          </motion.h2>
          <motion.div variants={itemVariants} className="mb-12 md:mb-16">
            <p className="text-body-main text-sm md:text-base leading-relaxed">
              I'm a serial founding Designer with deep early-stage experience helping startups
              establish their product, brand, and design foundations. I've spent my career building
              across the full stack of design, from product vision and UX architecture to hands-on
              visual design and front-end implementation.
            </p>
          </motion.div>
        </div>

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
      </motion.main>
    </div>
  )
}
