'use client'

import { motion } from 'framer-motion'
import TimelineItem from '@/components/timeline-item'
import CaseStudyCard from '@/components/case-study-card'
import type { CaseStudyListItem } from '@/types/sanity'
import type { Experience } from '@/lib/data'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface WorkPageClientProps {
  caseStudies: CaseStudyListItem[]
  experienceData: Experience[]
}

export default function WorkPageClient({ caseStudies, experienceData }: WorkPageClientProps) {
  return (
    <div className="bg-background text-foreground theme-transition relative overflow-hidden">
      <main className="px-6 py-12 relative">
        {/* Header Content */}
        <div className="max-w-4xl mx-auto mb-20">
          <motion.h1 variants={itemVariants} className="heading-display mb-8 text-center">
            <span className="lust-aalt">W</span>or<span className="lust-swsh">k</span>
          </motion.h1>

          {/* Separator Line */}
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"
          />
          <motion.h2 variants={itemVariants} className="text-2xl font-normal mb-8 font-sans text-foreground">
            Case Studies
          </motion.h2>
          <motion.div variants={itemVariants} className="mb-16">
            <p className="text-body-main">
              Deep dives into professional projects where I led design strategy, built products, 
              and shaped user experiences at high-growth startups.
            </p>
          </motion.div>
        </div>

        {/* Case Studies Section */}
        {caseStudies.length > 0 && (
          <div className="max-w-7xl mx-auto mb-24">
            <div className="space-y-16">
              {caseStudies.map((caseStudy, index) => (
                <CaseStudyCard key={caseStudy._id} caseStudy={caseStudy} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Apps & Companies Timeline */}
        <div className="max-w-4xl mx-auto mb-12">
          {/* Separator Line */}
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"
          />
          <motion.h2 variants={itemVariants} className="font-normal text-2xl mb-8 text-muted-foreground">
            Apps & Companies
          </motion.h2>
          <motion.div variants={itemVariants} className="mb-16">
            <p className="text-body-main">
              I have been the principal Product Designer at high-growth venture-backed
              startups for the past 15 years or so. My experience encompasses shaping the
              visual design, UI, and data visualization of a B2B SaaS app. I'm a sucker
              for the well-executed basics of a clean layout, vibrant color palette, and
              ample white space around the typography.
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
      </main>
    </div>
  )
}
