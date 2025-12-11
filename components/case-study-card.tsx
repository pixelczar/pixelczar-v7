'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { memo } from 'react'
import type { CaseStudyListItem } from '@/types/sanity'
import { itemVariants } from '@/lib/animations'
import MagneticWrapper from '@/components/magnetic-wrapper'

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

function CaseStudyCard({ caseStudy, index = 0 }: CaseStudyCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="h-full"
    >
      <div 
        className={`rounded-xl group-hover:bg-card/60 h-full flex flex-col ${caseStudy.projectUrl ? 'cursor-hover' : ''}`}
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
                <MagneticWrapper
                  strength={0.3}
                  data-cursor-rounded="full"
                >
                  <a
                    href={caseStudy.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`case-study-title-${caseStudy._id}`}
                    data-cursor-target={`case-study-title-${caseStudy._id}`}
                    className="cursor-hover inline-flex items-center gap-3 px-2 py-1 rounded-full relative -left-2 group"
                    aria-label={`Visit ${caseStudy.title}`}
                  >
                    <h3 className="text-xl md:text-2xl font-semibold font-sans transition-colors duration-300 group-hover:text-accent">
                      {caseStudy.title}
                    </h3>
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 group-hover:text-accent" />
                  </a>
                </MagneticWrapper>
              ) : (
                <h3 className="text-xl md:text-2xl font-semibold font-sans">
                  {caseStudy.title}
                </h3>
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
          <div className="flex flex-row gap-6 md:gap-8 text-sm hidden">
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

export default memo(CaseStudyCard)
