'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import type { ProjectListItem, GalleryItemClient } from '@/types/sanity'
import { itemVariants, smoothEase } from '@/lib/animations'
import MagneticWrapper from '@/components/magnetic-wrapper'
import { ImageTooltip } from '@/components/image-tooltip'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

// Project card container with smooth stagger - cards come just after header
const projectCardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: smoothEase,
      staggerChildren: 0.12,
      delayChildren: 0.8,
    },
  },
}

// Individual card variants - fade only, no scale
const projectCardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
}

// Card content variants - faster internal animation
const cardContentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0,
    },
  },
}

// Image grid container for staggering individual images
const imageGridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.01,
    },
  },
}

const cardImageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
}

const cardTextVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: smoothEase,
    },
  },
}

interface LabsPageClientProps {
  projects: ProjectListItem[]
  galleryItems: GalleryItemClient[]
}

// Helper to convert Portable Text to plain text
function toPlainText(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value
      .map((block: any) => {
        if (block._type === 'block' && Array.isArray(block.children)) {
          return block.children.map((child: any) => child.text || '').join('')
        }
        return ''
      })
      .join(' ')
      .trim()
  }
  if (typeof value === 'object' && value !== null && '_type' in value) {
    return ''
  }
  return String(value)
}

// Project image component - expands on hover to show larger crisp image
function ProjectImage({ image, title, index, hasLink = false }: { image: { url: string; alt: string }; title: string; index: number; hasLink?: boolean }) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={`relative w-full aspect-[4/3] ${hasLink ? 'group' : ''}`}>
      {/* Loading skeleton */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 rounded-md overflow-hidden"
          >
            <Skeleton className="w-full h-full" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 rounded-md overflow-hidden shadow-lg"
        initial={false}
        animate={{
          opacity: isLoading ? 0 : 1,
        }}
        transition={{
          opacity: { duration: 0.3 },
        }}
        data-cursor-ignore
      >
        {!hasError ? (
          <Image
            src={image.url}
            alt={image.alt || `${title} - Image ${index + 1}`}
            fill
            className={`object-cover transition-all duration-500 ${hasLink ? 'group-hover:opacity-70 group-hover:scale-[102%]' : ''}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            quality={85}
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setHasError(true)
            }}
          />
        ) : (
          <div className="w-full h-full bg-muted/20 flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Failed to load</span>
          </div>
        )}
      </motion.div>
    </div>
  )
}

// 2-column project card for Play page - title links to external projectUrl
function ProjectCard({ project, index }: { project: ProjectListItem; index: number }) {
  const hasLink = Boolean(project.projectUrl)
  const tooltipText = project.title
  const imageContent = project.gallery && project.gallery.length > 0 ? (
    <motion.div
      className="grid grid-cols-1 gap-6 mb-6"
      variants={imageGridVariants}
    >
      {project.gallery.slice(0, 1).map((image, idx) => (
        <motion.div key={idx} variants={cardImageVariants}>
          <ProjectImage image={image} title={project.title} index={idx} hasLink={hasLink} />
        </motion.div>
      ))}
    </motion.div>
  ) : project.mainImage ? (
    <motion.div
      className="mb-6"
      variants={cardImageVariants}
    >
      <ProjectImage image={project.mainImage} title={project.title} index={0} hasLink={hasLink} />
    </motion.div>
  ) : null

  return (
    <motion.div
      variants={projectCardVariants}
    >
      <motion.div
        className="bg-card/30 rounded-xl"
        variants={cardContentVariants}
      >
        {/* Gallery Images - Above Title (show 1 image) */}
        {hasLink && imageContent ? (
          <ImageTooltip text={tooltipText} alignTopLeft>
            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="block" data-cursor-ignore>
              {imageContent}
            </a>
          </ImageTooltip>
        ) : imageContent}

        {/* Title and Tags Row */}
        <motion.div
          className="flex items-center justify-between gap-4 mb-2"
          variants={cardTextVariants}
        >
          <div className="flex items-center gap-1">
            {project.projectUrl ? (
              <MagneticWrapper strength={0.3} data-cursor-rounded="full">
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-hover inline-flex items-center gap-3 px-2 py-1 mb-1 rounded-full relative -left-2 group/title"
                >
                  <h3 className="text-xl md:text-2xl font-semibold font-sans transition-colors duration-300 group-hover/title:text-accent">
                    {project.title}
                  </h3>
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transition-all duration-500 ease-[0.23,1,0.32,1] opacity-0 -translate-x-3 group-hover/title:opacity-100 group-hover/title:translate-x-0 group-hover/title:text-accent" />
                </a>
              </MagneticWrapper>
            ) : (
              <h3 className="text-xl md:text-2xl font-semibold font-sans">
                {project.title}
              </h3>
            )}
          </div>

          {/* Tags - Right Aligned */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end">
              {project.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-1.5 py-0.5 rounded-full border opacity-80 text-muted-foreground font-sans"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Description */}
        {project.description && (
          <motion.p
            className="text-base text-muted-foreground font-sans mb-4"
            variants={cardTextVariants}
          >
            {toPlainText(project.description)}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  )
}

// Canvas card — last item in the projects grid, teases the /pixels experience
// Clean single-hero with subtle edge hints
function CanvasCard({ galleryItems }: { galleryItems: GalleryItemClient[] }) {
  const thumbs = galleryItems
    .filter((item) => item.type === 'image' && item.src)
    .map((item) => item.src)
    .slice(0, 3)

  // Minimal composition: hero with two subtle edge hints
  const placements: { top: string; left: string; w: string; z: number; opacity: number }[] = [
    // Edge hints — subtle peeks
    { top: '20%', left: '-8%',  w: '28%', z: 0, opacity: 0.2 },
    { top: '25%', left: '80%', w: '28%', z: 0, opacity: 0.15 },
    // Hero — centered, clean
    { top: '8%',  left: '12%', w: '76%', z: 1, opacity: 1 },
  ]

  return (
    <motion.div variants={projectCardVariants}>
      <ImageTooltip text="Pixels" alignTopLeft>
        <Link href="/pixels" className="block mb-6 group" data-cursor-ignore>
          <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-[#0a0a0a]">
            {thumbs.map((url, i) => {
              const p = placements[i]
              if (!p) return null
              return (
                <div
                  key={i}
                  className="absolute transition-all duration-700 ease-out group-hover:opacity-80"
                  style={{
                    top: p.top,
                    left: p.left,
                    width: p.w,
                    zIndex: p.z,
                    opacity: p.opacity,
                  }}
                >
                  <div
                    className="relative rounded overflow-hidden shadow-2xl transition-transform duration-700 ease-out group-hover:scale-[102%]"
                    style={{ aspectRatio: '4/3' }}
                  >
                    <Image
                      src={url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="300px"
                      quality={80}
                      loading="lazy"
                    />
                  </div>
                </div>
              )
            })}
            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 50px 15px rgba(0,0,0,0.6)' }} />
          </div>
        </Link>
      </ImageTooltip>

      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-1">
          <MagneticWrapper strength={0.3} data-cursor-rounded="full">
            <Link
              href="/pixels"
              className="cursor-hover inline-flex items-center gap-3 px-2 py-1 mb-1 rounded-full relative -left-2 group/title"
            >
              <h3 className="text-xl md:text-2xl font-semibold font-sans transition-colors duration-300 group-hover/title:text-accent">
                Pixels
              </h3>
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transition-all duration-500 ease-[0.23,1,0.32,1] opacity-0 -translate-x-3 group-hover/title:opacity-100 group-hover/title:translate-x-0 group-hover/title:text-accent" />
            </Link>
          </MagneticWrapper>
        </div>
      </div>
      <p className="text-base text-muted-foreground font-sans mb-4">
        An infinite, explorable canvas of work.
      </p>
    </motion.div>
  )
}

// Gallery item component - all 4:3 ratio, rounded-lg
function GalleryItemComponent({ item, index }: { item: GalleryItemClient; index: number }) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const sizeClasses = {
    small: 'w-full md:w-[calc(33.333%-1rem)]',
    medium: 'w-full md:w-[calc(50%-0.75rem)]',
    large: 'w-full',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: smoothEase,
      }}
      className={`${sizeClasses[item.size]} relative overflow-hidden rounded-lg bg-black/40 group`}
    >
      <div className={`relative w-full ${item.type === 'video' || item.size !== 'large' ? 'aspect-[4/3]' : ''}`}>
        {/* Loading skeleton */}
        <AnimatePresence>
          {isLoading && item.type !== 'video' && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Skeleton className="w-full h-full" />
            </motion.div>
          )}
        </AnimatePresence>

        {item.type === 'video' ? (
          item.videoUrl ? (
            <a
              href={item.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center bg-muted/50"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent/80 flex items-center justify-center mb-2 mx-auto">
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="text-sm text-muted-foreground">Play Video</span>
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
              onLoadedData={() => setIsLoading(false)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2 mx-auto">
                  <svg className="w-6 h-6 text-muted-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="text-sm text-muted-foreground">Video</span>
              </div>
            </div>
          )
        ) : item.size === 'large' ? (
          <div className="relative w-full">
            {!hasError ? (
              <Image
                src={item.src}
                alt={item.alt}
                width={1200}
                height={800}
                className="w-full h-auto object-contain"
                sizes="100vw"
                quality={85}
                loading="lazy"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false)
                  setHasError(true)
                }}
              />
            ) : (
              <div className="w-full aspect-[4/3] bg-muted/20 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Failed to load</span>
              </div>
            )}
          </div>
        ) : (
          <>
            {!hasError ? (
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-contain"
                sizes={item.size === 'medium' ? '50vw' : '33vw'}
                quality={85}
                loading="lazy"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false)
                  setHasError(true)
                }}
                style={{
                  opacity: isLoading ? 0 : 1,
                  transition: 'opacity 0.3s ease-in-out',
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Failed to load</span>
              </div>
            )}
          </>
        )}

        {item.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <p className="text-sm text-white font-sans">{item.caption}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function LabsPageClient({ projects, galleryItems }: LabsPageClientProps) {
  return (
    <div className="bg-background text-foreground theme-transition relative overflow-hidden">
      <motion.main
        className="px-6 py-12 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Content */}
        <div className="max-w-3xl mx-auto mb-20">
          <motion.h1 variants={itemVariants} className="heading-display mb-8 text-center">
            <span className="lust-aalt">P</span>ixe<span className="lust-swsh">l</span>
            <span className="lust-ss03">s</span> <span className="">P</span>ushe
            <span className="lust-swsh">d</span>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"
          />
          <motion.h2 variants={itemVariants} className="text-2xl font-normal mb-16 font-sans text-foreground">
            Projects, explorations, sketches
          </motion.h2>
          {/* <motion.div variants={itemVariants} className="mb-16">
            <p className="text-body-main">
              It's such an incredible time to be a designer. These are experiments, explorations, various other pixels I've been pushing recently.  All design and build implementations are 100% my own.
            </p>
          </motion.div> */}
        </div>

        {/* Projects Section - 3 Column Grid */}
        {projects.length > 0 && (
          <motion.div
            className="max-w-7xl mx-auto mb-24"
            variants={projectCardContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {projects.map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
              ))}
              <CanvasCard galleryItems={galleryItems} />
            </div>
          </motion.div>
        )}

        {/* Gallery Section */}
        {galleryItems.length > 0 && (
          <>
            <div className="max-w-3xl mx-auto mb-12">
              <motion.div
                variants={itemVariants}
                className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"
              />
              <motion.h2 variants={itemVariants} className="font-normal text-2xl mb-8">
                Various Pixels
              </motion.h2>
              <motion.div variants={itemVariants} className="mb-16">
                <p className="text-body-main">
                  Screenshots, recordings, and visual artifacts from various projects and experiments.{' '}
                  <Link href="/pixels" className="text-accent hover:underline">
                    Explore the canvas
                  </Link>.
                </p>
              </motion.div>
            </div>

            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-4 md:gap-6">
                {galleryItems.map((item, index) => (
                  <GalleryItemComponent key={item._id} item={item} index={index} />
                ))}
              </div>
            </div>
          </>
        )}
      </motion.main>
    </div>
  )
}
