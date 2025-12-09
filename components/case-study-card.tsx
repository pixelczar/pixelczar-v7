'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { CaseStudyListItem } from '@/types/sanity'
import { smoothEase } from '@/lib/animations'

interface CaseStudyCardProps {
  caseStudy: CaseStudyListItem
  index?: number
}

function MainMedia({ 
  caseStudy 
}: { 
  caseStudy: CaseStudyListItem 
}) {
  const isVideo = caseStudy.mainMediaType === 'video'
  const videoUrl = caseStudy.mainVideoUrl || caseStudy.mainVideo?.url
  const imageUrl = caseStudy.mainImage?.url

  if (isVideo && videoUrl) {
    // External video URL (YouTube, Vimeo, etc.)
    if (caseStudy.mainVideoUrl) {
      return (
        <div className="relative w-full aspect-video overflow-hidden rounded-md bg-black/40">
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-muted/50 hover:bg-muted/70 transition-colors"
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
        </div>
      )
    }
    // Uploaded video file
    return (
      <div className="relative w-full aspect-video overflow-hidden rounded-md bg-black/40">
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    )
  }

  if (imageUrl) {
    return (
      <div
        className="relative w-full aspect-video overflow-hidden rounded-md bg-black/40"
        data-cursor-ignore
      >
        <Image
          src={imageUrl}
          alt={caseStudy.mainImage?.alt || caseStudy.title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          quality={90}
        />
      </div>
    )
  }

  return null
}

export default function CaseStudyCard({ caseStudy, index = 0 }: CaseStudyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: smoothEase,
      }}
      className="h-full"
    >
      <div 
        className={`rounded-xl group-hover:bg-card/60 transition-all duration-300 h-full flex flex-col ${caseStudy.projectUrl ? 'cursor-hover' : ''}`}
        data-cursor-target={caseStudy.projectUrl ? `case-study-title-${caseStudy._id}` : undefined}
      >
        {/* Main Media (Image or Video) - Above Title */}
        <div className="mb-6">
          <MainMedia caseStudy={caseStudy} />
        </div>

        {/* Title/Description + Metadata */}
        <div className="flex flex-col gap-2 flex-1">
          {/* Title and Description */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              {caseStudy.projectUrl ? (
                <a
                  href={caseStudy.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id={`case-study-title-${caseStudy._id}`}
                  data-cursor-target={`case-study-title-${caseStudy._id}`}
                  data-cursor-rounded="full"
                  className="inline-flex items-center gap-2 px-2 py-1 rounded-full relative -left-2 cursor-hover"
                  aria-label={`Visit ${caseStudy.title}`}
                >
                  <h3 className="text-xl md:text-2xl font-semibold font-sans group-hover:text-accent transition-colors duration-300">
                    {caseStudy.title}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                </a>
              ) : (
                <Link href={`/work/${caseStudy.slug}`} className="inline-flex items-center gap-2 px-2 py-1 rounded-full relative -left-2">
                  <h3 className="text-xl md:text-2xl font-semibold font-sans group-hover:text-accent transition-colors duration-300">
                    {caseStudy.title}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                </Link>
              )}
            </div>
            {caseStudy.company && (
              <p className="text-sm text-accent font-medium mb-3 font-sans">
                {caseStudy.company}
              </p>
            )}
            {(caseStudy.shortDescription || caseStudy.description) && (
              <p className="text-sm md:text-base text-muted-foreground font-sans leading-relaxed mb-4">
                {caseStudy.shortDescription || caseStudy.description}
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-row gap-6 md:gap-8 text-sm">
            {caseStudy.role && (
              <div>
                <div className="text-xs font-medium text-muted-foreground tracking-wide mb-1 font-sans">
                  Role
                </div>
                <div className="font-sans text-foreground">
                  {caseStudy.role}
                </div>
              </div>
            )}
            {caseStudy.timeline && (
              <div>
                <div className="text-xs font-medium text-muted-foreground tracking-wide mb-1 font-sans">
                  Timeline
                </div>
                <div className="font-sans text-foreground">
                  {caseStudy.timeline}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
