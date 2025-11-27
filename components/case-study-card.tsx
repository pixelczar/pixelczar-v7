'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { CaseStudyListItem } from '@/types/sanity'

interface CaseStudyCardProps {
  caseStudy: CaseStudyListItem
  index?: number
}

function TiltImage({ image, title, index }: { image: { url: string; alt: string }; title: string; index: number }) {
  return (
    <div
      className="relative w-full aspect-[4/3] overflow-hidden rounded-md bg-black/40 border border-border/50"
      data-cursor-ignore
    >
      <Image
        src={image.url}
        alt={image.alt || `${title} - Image ${index + 1}`}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
        quality={90}
      />
    </div>
  )
}

export default function CaseStudyCard({ caseStudy, index = 0 }: CaseStudyCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="mb-8 group"
    >
      <div 
        className={`bg-card/30 rounded-lg group-hover:bg-card/50 transition-all duration-300 p-6 ${caseStudy.projectUrl ? 'cursor-hover' : ''}`}
        data-cursor-target={caseStudy.projectUrl ? `case-study-title-${caseStudy._id}` : undefined}
      >
        {/* Top Section: Title/Description + Metadata */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Title and Description - 2/3 width */}
          <div className="flex-[2] min-w-0">
            <div className="flex items-center gap-3 mb-3">
              {caseStudy.projectUrl ? (
                <a
                  href={caseStudy.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id={`case-study-title-${caseStudy._id}`}
                  data-cursor-target={`case-study-title-${caseStudy._id}`}
                  className="inline-flex items-center gap-2 px-2 py-1 rounded-full relative -left-2 cursor-hover"
                  aria-label={`Visit ${caseStudy.title}`}
                >
                  <h3 className="text-2xl font-semibold font-sans group-hover:text-accent transition-colors duration-300">
                    {caseStudy.title}
                  </h3>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                </a>
              ) : (
                <Link href={`/work/${caseStudy.slug}`} className="inline-flex items-center gap-2 px-2 py-1 rounded-full relative -left-2">
                  <h3 className="text-2xl font-semibold font-sans group-hover:text-accent transition-colors duration-300">
                    {caseStudy.title}
                  </h3>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                </Link>
              )}
            </div>
            {caseStudy.company && (
              <p className="text-sm text-accent font-medium mb-2 font-sans">
                {caseStudy.company}
              </p>
            )}
            {caseStudy.description && (
              <p className="text-base text-muted-foreground font-sans leading-relaxed">
                {caseStudy.description}
              </p>
            )}
            {caseStudy.tags && caseStudy.tags.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {caseStudy.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded bg-muted/20 border text-muted-foreground font-sans"
                      style={{ borderColor: 'color-mix(in srgb, var(--border) 70%, transparent)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Metadata - 1/3 width */}
          <div className="flex-[1] flex flex-col gap-4 mt-6">
            {caseStudy.role && (
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 font-sans">
                  Role
                </div>
                <div className="text-sm font-sans text-foreground">
                  {caseStudy.role}
                </div>
              </div>
            )}
            {caseStudy.timeline && (
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 font-sans">
                  Timeline
                </div>
                <div className="text-sm font-sans text-foreground">
                  {caseStudy.timeline}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: 3 Images across */}
        {caseStudy.gallery && caseStudy.gallery.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 max-w-4xl mx-auto">
            {caseStudy.gallery.slice(0, 3).map((image, idx) => (
              <TiltImage key={idx} image={image} title={caseStudy.title} index={idx} />
            ))}
          </div>
        ) : caseStudy.mainImage ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 max-w-4xl mx-auto">
            <TiltImage image={caseStudy.mainImage} title={caseStudy.title} index={0} />
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
