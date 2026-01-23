'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { memo } from 'react'
import type { CaseStudyListItem } from '@/types/sanity'
import { itemVariants } from '@/lib/animations'
import MagneticWrapper from '@/components/magnetic-wrapper'
import { ImageTooltip } from '@/components/image-tooltip'

// WIP badge messages for each card
const WIP_MESSAGES = [
  'Deep dive coming soon',
  'Compiling case study..',
  'Zooming in shortly',
  'Showcase coming soon',
]

// Tooltip text for WIP items
const WIP_TOOLTIP = "Not quite done yet, sorry!"

interface CaseStudyCardProps {
  caseStudy: CaseStudyListItem
  index?: number
}

// WIP Badge component
function WipBadge({ message }: { message: string }) {
  return (
    <div className="absolute top-3 left-3 z-10">
      <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-sans font-medium bg-black/60 text-white/60 backdrop-blur-sm shadow-lg">
        {message}
      </span>
    </div>
  )
}

function MainMedia({ 
  caseStudy,
  index = 0,
  isWip = true
}: { 
  caseStudy: CaseStudyListItem
  index?: number 
  isWip?: boolean
}) {
  const isVideo = caseStudy.mainMediaType === 'video'
  const videoUrl = caseStudy.mainVideoUrl || caseStudy.mainVideo?.url
  const imageUrl = caseStudy.mainImage?.isHidden ? null : caseStudy.mainImage?.url

  // Use WIP tooltip or title for hover
  const tooltipText = isWip ? WIP_TOOLTIP : (caseStudy.oneLiner || caseStudy.title)
  
  // Get WIP badge message based on index (cycle through messages)
  const wipMessage = WIP_MESSAGES[index % WIP_MESSAGES.length]

  const renderContent = (content: React.ReactNode) => {
    if (!isWip && !caseStudy.projectUrl) {
      return (
        <Link href={`/work/${caseStudy.slug}`} className="block">
          {content}
        </Link>
      )
    }
    return content
  }

  if (isVideo && videoUrl) {
    // External video URL (YouTube, Vimeo, etc.)
    if (caseStudy.mainVideoUrl) {
      return (
        <ImageTooltip text={tooltipText} alignTopLeft>
          {renderContent(
            <div className="relative w-full aspect-video overflow-hidden rounded-md bg-primary/10 shadow-lg" data-cursor-ignore>
              {isWip && <WipBadge message={wipMessage} />}
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
          )}
        </ImageTooltip>
      )
    }
    // Uploaded video file
    return (
      <ImageTooltip text={tooltipText} alignTopLeft>
        {renderContent(
          <div className="relative w-full aspect-video overflow-hidden rounded-md bg-primary/10 shadow-lg group" data-cursor-ignore>
            {isWip && <WipBadge message={wipMessage} />}
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover group-hover:opacity-80 group-hover:scale-105 transition-all duration-300"
            />
          </div>
        )}
      </ImageTooltip>
    )
  }

  if (imageUrl) {
    return (
      <ImageTooltip text={tooltipText} alignTopLeft>
        {renderContent(
          <div
            className="relative w-full aspect-video overflow-hidden rounded-md bg-primary/10 shadow-lg group"
            data-cursor-ignore
          >
            {isWip && <WipBadge message={wipMessage} />}
            <Image
              src={imageUrl}
              alt={caseStudy.mainImage?.alt || caseStudy.title}
              fill
              className="object-contain group-hover:opacity-70 group-hover:scale-[102%] transition-all duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              quality={90}
            />
          </div>
        )}
      </ImageTooltip>
    )
  }

  return null
}

function CaseStudyCard({ caseStudy, index = 0 }: CaseStudyCardProps) {
  // Determine if this is a WIP based on the slug (ungate Data Studio)
  const isWip = caseStudy.slug !== 'data-studio'
  const tooltipText = isWip ? WIP_TOOLTIP : (caseStudy.oneLiner || caseStudy.title)

  return (
    <motion.div
      variants={itemVariants}
      className="h-full"
    >
      <div 
        className="rounded-xl h-full flex flex-col"
        data-cursor-target={`case-study-title-${caseStudy._id}`}
      >
        {/* Main Media (Image or Video) - Above Title */}
        <div className="mb-8">
          <MainMedia caseStudy={caseStudy} index={index} isWip={isWip} />
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
                    className="cursor-hover inline-flex items-center gap-3 px-2 py-1 rounded-full relative -left-2 group/title"
                    aria-label={`Visit ${caseStudy.title}`}
                  >
                    <h3 className="text-2xl font-medium font-sans my-2 transition-colors duration-300 group-hover/title:text-accent">
                      {caseStudy.oneLiner || caseStudy.title}
                    </h3>
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transition-all duration-500 ease-[0.23,1,0.32,1] opacity-0 -translate-x-3 group-hover/title:opacity-100 group-hover/title:translate-x-0 group-hover/title:text-accent" />
                  </a>
                </MagneticWrapper>
              ) : !isWip ? (
                <MagneticWrapper
                  strength={0.3}
                  data-cursor-rounded="full"
                >
                  <Link
                    href={`/work/${caseStudy.slug}`}
                    id={`case-study-title-${caseStudy._id}`}
                    data-cursor-target={`case-study-title-${caseStudy._id}`}
                    className="cursor-hover inline-flex items-center gap-3 px-4 -ml-2 hover:bg-accent/10 py-1 rounded-full relative -left-2 group/title"
                    aria-label={`View ${caseStudy.title} case study`}
                  >
                    <h3 className="text-2xl font-medium font-sans transition-colors duration-300 group-hover/title:text-accent">
                      {caseStudy.oneLiner || caseStudy.title}
                    </h3>
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transition-all duration-500 ease-[0.23,1,0.32,1] opacity-0 -translate-x-3 group-hover/title:opacity-100 group-hover/title:translate-x-0 group-hover/title:text-accent" />
                  </Link>
                </MagneticWrapper>
              ) : (
                <h3 className="text-2xl font-medium font-sans">
                  {caseStudy.oneLiner || caseStudy.title}
                </h3>
              )}
            </div>
            {/* {(caseStudy.shortDescription || caseStudy.description) && (
              <p className="text-lg text-muted-foreground font-sans leading-snug mb-4">
                {caseStudy.shortDescription || caseStudy.description}
              </p>
            )} */}
          </div>

          {/* Metadata */}
          <div className="gap-6 md:gap-8 text-sm hidden">
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
          {(caseStudy.shortDescription || caseStudy.description) && (
            <p className="text-lg text-muted-foreground font-sans leading-snug mb-4">
              {caseStudy.shortDescription || caseStudy.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default memo(CaseStudyCard)
