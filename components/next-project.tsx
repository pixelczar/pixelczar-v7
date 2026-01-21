'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import MagneticLink from './magnetic-link'
import { ImageTooltip } from './image-tooltip'
import type { CaseStudyListItem } from '@/types/sanity'

interface NextProjectProps {
  nextProjects: CaseStudyListItem[]
}

export default function NextProject({ nextProjects }: NextProjectProps) {
  // Only show the first two projects
  const displayProjects = nextProjects.slice(0, 2)
  const primaryNext = displayProjects[0]

  if (!primaryNext) return null

  return (
    <div className="max-w-3xl mx-auto mt-32 md:mt-48 mb-24">
      {/* Grid Items - 2 items as requested */}
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
        {displayProjects.map((project, index) => (
          <ImageTooltip key={project._id} text={project.title} alignTopLeft>
            <Link 
              href={`/work/${project.slug}`}
              className="group block"
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
                {project.mainMediaType === 'video' ? (
                  project.mainVideo?.url ? (
                    <video
                      src={project.mainVideo.url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : null
                ) : project.mainImage?.url ? (
                  <Image
                    src={project.mainImage.url}
                    alt={project.mainImage.alt || project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 400px"
                    quality={90}
                  />
                ) : null}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </motion.div>
            </Link>
          </ImageTooltip>
        ))}
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
            href={`/work/${primaryNext.slug}`}
            className="flex items-center gap-3 rounded-full px-4 py-2 group -mr-4"
            strength={0.4}
          >
            <span className="text-base md:text-lg text-foreground font-sans transition-colors duration-300 group-hover:text-accent">
              Next showcase: {primaryNext.title}
            </span>
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-accent transition-colors duration-300 group-hover:text-accent" />
          </MagneticLink>
        </motion.div>
      </div>
    </div>
  )
}
