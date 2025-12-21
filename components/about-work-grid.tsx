'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import MagneticLink from '@/components/magnetic-link'
import type { CaseStudyListItem } from '@/types/sanity'

interface AboutWorkGridProps {
  caseStudies: CaseStudyListItem[]
}

export default function AboutWorkGrid({ caseStudies }: AboutWorkGridProps) {
  // Get first 2 case studies with media, excluding encore
  const gridItems = caseStudies
    .filter((cs) => {
      const hasMedia = cs.mainImage || cs.mainVideo
      const title = cs.title?.toLowerCase() || ''
      const alt = cs.mainImage?.alt?.toLowerCase() || ''
      const isEncore = title.includes('encore') || alt.includes('encore')
      return hasMedia && !isEncore
    })
    .slice(0, 2)

  if (gridItems.length === 0) return null

  return (
    <div className="max-w-6xl mx-auto mt-24 md:mt-32">
      {/* Grid Items - 2 on mobile, 4 on desktop */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="grid grid-cols-2 gap-4 md:gap-6 mb-6"
      >
        {gridItems.map((item, index) => (
          <Link 
            key={item._id} 
            href="/work"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted/20 cursor-pointer"
            >
              {item.mainMediaType === 'video' ? (
                item.mainVideo?.url ? (
                  <video
                    src={item.mainVideo.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : null
              ) : item.mainImage?.url ? (
                <Image
                  src={item.mainImage.url}
                  alt={item.mainImage.alt || item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  quality={90}
                />
              ) : null}
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Colored Divider */}
      <div className="max-w-3xl mx-auto">
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
            href="/work"
            className="flex items-center gap-3 rounded-full px-4 py-2 group -mr-4"
            strength={0.4}
          >
            <span className="text-base md:text-lg text-foreground font-sans transition-colors duration-300 group-hover:text-accent">
              Show me the work
            </span>
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-accent transition-colors duration-300 group-hover:text-accent" />
          </MagneticLink>
        </motion.div>
      </div>
    </div>
  )
}

