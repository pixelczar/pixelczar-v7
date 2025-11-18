'use client'

import { motion } from 'framer-motion'
import TimelineItem from '@/components/timeline-item'
import RecentProjectCard from '@/components/recent-project-card'
import type { ProjectListItem } from '@/types/sanity'
import type { Experience } from '@/lib/data'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface WorkPageClientProps {
  projects: ProjectListItem[]
  experienceData: Experience[]
}

export default function WorkPageClient({ projects, experienceData }: WorkPageClientProps) {
  return (
    <div className="bg-background text-foreground theme-transition relative overflow-hidden">
      <main className="px-6 py-12 relative">
        {/* Header Content */}
        <div className="max-w-4xl mx-auto mb-20">
          <motion.h1 variants={itemVariants} className="heading-display mb-8 text-center">
            <span className="lust-aalt">B</span>ui<span className="lust-swsh">l</span>din
            <span className="lust-swsh">g</span> <span className="lust-aalt">I</span>dea
            <span className="lust-swsh">s</span>
          </motion.h1>

          {/* Separator Line */}
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"
          />
          <motion.h2 variants={itemVariants} className="text-2xl font-normal mb-8 font-sans text-foreground">
                Recent Projects
          </motion.h2>
          <motion.div variants={itemVariants} className="mb-16">
            <p className="text-body-main">
              This past year i've been working on a bunch of fun projects. Some to play with a new visual language, some to learn new tech, and some to experiment with new ideas.
            </p>
          </motion.div>
        </div>
        {/* Recent Projects Section */}
        {projects.length > 0 && (
          <div className="max-w-6xl mx-auto mb-24">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-16">
              {projects.slice(0, 6).map((project, index) => (
                <RecentProjectCard key={project._id} project={project} index={index} />
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

