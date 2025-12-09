'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import TimelineItem from '@/components/timeline-item'
import CaseStudyCard from '@/components/case-study-card'
import MagneticLink from '@/components/magnetic-link'
import type { CaseStudyListItem, GalleryItemClient } from '@/types/sanity'
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
  galleryItems: GalleryItemClient[]
}

export default function WorkPageClient({ caseStudies, experienceData, galleryItems }: WorkPageClientProps) {
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

        {/* Case Studies Section */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-20 hidden">
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"
          />
          <motion.h2 variants={itemVariants} className="font-normal text-xl md:text-2xl mb-6 md:mb-8 text-foreground">
            Case Studies
          </motion.h2>
          <motion.div variants={itemVariants} className="mb-12 md:mb-16">
            <p className="text-body-main text-sm md:text-base leading-relaxed">
              Selected projects showcasing product design, UX strategy, and design leadership work.
            </p>
          </motion.div>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 hidden">
            {caseStudies.map((caseStudy, index) => (
              <CaseStudyCard key={caseStudy._id} caseStudy={caseStudy} index={index} />
            ))}
          </div>
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

        <div className="max-w-4xl mx-auto">
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

        {/* Play Section Preview */}
        {(() => {
          // Find the priism video from gallery items
          const priismVideo = galleryItems.find(
            (item) =>
              item.type === 'video' &&
              (item.alt?.toLowerCase().includes('priism') ||
                item.alt?.toLowerCase().includes('prism'))
          ) || galleryItems.find((item) => item.type === 'video')

          if (!priismVideo) return null

          // Get other gallery items (excluding priism)
          const otherItems = galleryItems
            .filter((item) => item._id !== priismVideo._id)
            .slice(0, 2)

          // Ensure we have at least 2 other items, or pad with first item
          const firstItem = otherItems[0] || galleryItems[0]
          const secondItem = otherItems[1] || otherItems[0] || galleryItems[0]

          // Create array: [first image, priism video, second image]
          const gridItems: GalleryItemClient[] = [
            firstItem,
            priismVideo,
            secondItem,
          ].filter((item): item is GalleryItemClient => item !== null && item !== undefined)

          if (gridItems.length < 3) return null

          return (
            <div className="max-w-7xl mx-auto mt-24 md:mt-32">
              {/* 3 Grid Items */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12"
              >
                {gridItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-muted/20"
                  >
                    {item.type === 'video' ? (
                      item.videoUrl ? (
                        <a
                          href={item.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-muted/50"
                        >
                          <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-accent/80 flex items-center justify-center mb-2 mx-auto">
                              <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                            <span className="text-xs text-muted-foreground">Play Video</span>
                          </div>
                        </a>
                      ) : item.src ? (
                        <video
                          src={item.src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : null
                    ) : item.src ? (
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        quality={90}
                      />
                    ) : null}
                  </motion.div>
                ))}
              </motion.div>

              {/* Colored Divider */}
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="w-full h-px bg-accent/40 mx-auto mb-12 theme-transition"
                />
              </div>

              {/* Text with Magnetic Arrow */}
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="flex justify-end"
                >
                  <MagneticLink
                    href="/play"
                    className="flex items-center gap-3 rounded-full px-4 py-2 group"
                    strength={0.4}
                  >
                    <span className="text-base md:text-lg text-foreground font-sans transition-colors duration-300 group-hover:text-accent">
                      More sweet pixels right this way
                    </span>
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-accent transition-colors duration-300 group-hover:text-accent" />
                  </MagneticLink>
                </motion.div>
              </div>
            </div>
          )
        })()}
      </motion.main>
    </div>
  )
}
