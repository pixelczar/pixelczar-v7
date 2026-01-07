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

const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
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
        <div className="max-w-3xl mx-auto mb-12 md:mb-20">
          <motion.h1 variants={itemVariants} className="heading-display mb-6 md:mb-8 text-center">
            {/* <span className="lust-aalt tracking-tightest -mr-4">W</span><span className="tracking-tighter">o</span>r<span className="lust-swsh tracking-tighter">k</span> */}
            <span className="lust-swsh">S</span><span className="swsh">h</span>i<span className="lust-swsh tracking-tight">p</span><span className="lust-swsh">p</span><span className="lust-swsh">e</span><span className="lust-ss01">d</span>
          </motion.h1>
        </div>

        {/* Case Studies Section */}
        <div className="max-w-3xl mx-auto mb-12 md:mb-20">
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"
          />
          <motion.h2 variants={itemVariants} className="font-normal text-xl md:text-2xl mb-6 md:mb-8 text-foreground">
            Recent Professional Work
          </motion.h2>
          <motion.div variants={itemVariants} className="mb-12 md:mb-16">
            <p className="text-body-main leading-relaxed text-body-main">
              These recent projects from my extensive time at Reprise showcase my product design, experience, and end-to-end bringing ideas from 0 to 1.
            </p>
          </motion.div>
        </div>
        <motion.div 
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16"
        >
            {caseStudies.map((caseStudy, index) => (
              <CaseStudyCard key={caseStudy._id} caseStudy={caseStudy} index={index} />
            ))}
          </motion.div>
        {/* Apps & Companies Timeline */}
        <div className="max-w-3xl mx-auto mb-12">
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

        <div className="max-w-3xl mx-auto">
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
          // Find the prism video from gallery items
          const prismVideo = galleryItems.find(
            (item) =>
              item.type === 'video' &&
              (item.alt?.toLowerCase().includes('prism'))
          ) || galleryItems.find((item) => item.type === 'video')

          if (!prismVideo) return null

          // Get other gallery items (excluding prism)
          const otherItems = galleryItems
            .filter((item) => item._id !== prismVideo._id)

          // Get first item (for left position)
          const firstItem = otherItems[0] || galleryItems[0]
          
          // Check if first item is "Encore" related
          const isFirstItemEncore = firstItem?.alt?.toLowerCase().includes('encore') || 
                                    firstItem?.alt?.toLowerCase().includes('editor')
          
          // Get third item (for desktop only, right position) - make sure it's different from first
          // If first is Encore, find something that's NOT Encore/Editor related
          const thirdItem = isFirstItemEncore
            ? otherItems.find((item) => 
                item._id !== firstItem?._id && 
                !item.alt?.toLowerCase().includes('encore') &&
                !item.alt?.toLowerCase().includes('editor')
              ) || otherItems.find((item) => item._id !== firstItem?._id) || otherItems[1] || otherItems[0]
            : otherItems.find((item) => item._id !== firstItem?._id) || otherItems[1] || otherItems[0] || galleryItems[0]

          // Create array: [first image, prism video, third image for desktop]
          const gridItems: GalleryItemClient[] = [
            firstItem,
            prismVideo,
            thirdItem,
          ].filter((item): item is GalleryItemClient => item !== null && item !== undefined)

          if (gridItems.length < 2) return null

          return (
            <div className="max-w-7xl mx-auto mt-24 md:mt-32">
              {/* Grid Items - 2 on mobile, 3 on desktop */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6"
              >
                {/* First item - always visible */}
                {gridItems[0] && (
                  <motion.div
                    key={gridItems[0]._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{
                      duration: 0.6,
                      delay: 0 * 0.1,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-muted/20"
                  >
                    {gridItems[0].type === 'video' ? (
                      gridItems[0].videoUrl ? (
                        <a
                          href={gridItems[0].videoUrl}
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
                      ) : gridItems[0].src ? (
                        <video
                          src={gridItems[0].src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : null
                    ) : gridItems[0].src ? (
                      <Image
                        src={gridItems[0].src}
                        alt={gridItems[0].alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        quality={90}
                      />
                    ) : null}
                  </motion.div>
                )}
                
                {/* Prism video - always visible */}
                {prismVideo && (
                  <motion.div
                    key={prismVideo._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{
                      duration: 0.6,
                      delay: 1 * 0.1,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-muted/20"
                  >
                    {prismVideo.type === 'video' ? (
                      prismVideo.videoUrl ? (
                        <a
                          href={prismVideo.videoUrl}
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
                      ) : prismVideo.src ? (
                        <video
                          src={prismVideo.src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : null
                    ) : prismVideo.src ? (
                      <Image
                        src={prismVideo.src}
                        alt={prismVideo.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        quality={90}
                      />
                    ) : null}
                  </motion.div>
                )}
                
                {/* Third item - only visible on desktop, different from first */}
                {gridItems[2] && (
                  <motion.div
                    key={gridItems[2]._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{
                      duration: 0.6,
                      delay: 2 * 0.1,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-muted/20 hidden md:block"
                  >
                    {gridItems[2].type === 'video' ? (
                      gridItems[2].videoUrl ? (
                        <a
                          href={gridItems[2].videoUrl}
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
                      ) : gridItems[2].src ? (
                        <video
                          src={gridItems[2].src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : null
                    ) : gridItems[2].src ? (
                      <Image
                        src={gridItems[2].src}
                        alt={gridItems[2].alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        quality={90}
                      />
                    ) : null}
                  </motion.div>
                )}
              </motion.div>

              {/* Colored Divider */}
              <div className="max-w-3xl mx-auto mt-2">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="w-full h-px bg-accent/40 mx-auto mb-6 theme-transition"
                />
              </div>

              {/* Text with Magnetic Arrow */}
              <div className="max-w-3xl mx-auto">
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
                    className="flex items-center gap-3 rounded-full px-4 py-2 group -mr-4"
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
