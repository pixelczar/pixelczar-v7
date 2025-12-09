'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { ProjectListItem, GalleryItemClient } from '@/types/sanity'
import { itemVariants, smoothEase } from '@/lib/animations'

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: smoothEase,
      staggerChildren: 0.08,
      delayChildren: 1.15, // Just barely after header (header finishes ~1.05s)
    },
  },
}

// Individual card variants - smooth entrance
const projectCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
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

interface PlayPageClientProps {
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
function ProjectImage({ image, title, index }: { image: { url: string; alt: string }; title: string; index: number }) {
  return (
    <div className="relative w-full aspect-[4/3]">
      <motion.div 
        className="absolute inset-0 rounded-md cursor-pointer overflow-hidden shadow-lg"
        initial={false}
        whileHover={{ 
          scale: 1.5,
          zIndex: 50,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 25,
        }}
        style={{
          transformOrigin: 'center center',
        }}
        data-cursor-ignore
      >
        <Image
          src={image.url}
          alt={image.alt || `${title} - Image ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          quality={100}
          unoptimized={true}
        />
      </motion.div>
    </div>
  )
}

// 2-column project card for Play page - title links to external projectUrl
function ProjectCard({ project, index }: { project: ProjectListItem; index: number }) {
  return (
    <motion.div
      variants={projectCardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      <motion.div 
        className="bg-card/30 rounded-xl"
        variants={cardContentVariants}
      >
        {/* Gallery Images - Above Title (show 2 images) */}
        {project.gallery && project.gallery.length > 0 ? (
          <motion.div 
            className="grid grid-cols-2 gap-6 mb-6"
            variants={imageGridVariants}
          >
            {project.gallery.slice(0, 2).map((image, idx) => (
              <motion.div key={idx} variants={cardImageVariants}>
                <ProjectImage image={image} title={project.title} index={idx} />
              </motion.div>
            ))}
          </motion.div>
        ) : project.mainImage ? (
          <motion.div 
            className="mb-6"
            variants={cardImageVariants}
          >
            <ProjectImage image={project.mainImage} title={project.title} index={0} />
          </motion.div>
        ) : null}

        {/* Title */}
        <motion.div 
          className="flex items-center gap-2 mb-2"
          variants={cardTextVariants}
        >
          {project.projectUrl ? (
            <a 
              href={project.projectUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              data-cursor-rounded="full"
              className="cursor-hover inline-flex items-center gap-3 px-2 py-1 rounded-full relative -left-2 group"
            >
              <h3 className="text-xl md:text-2xl font-semibold font-sans transition-colors duration-300 group-hover:text-accent">
                {project.title}
              </h3>
              <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 group-hover:text-accent transition-colors duration-300" />
            </a>
          ) : (
            <h3 className="text-xl md:text-2xl font-semibold font-sans">
              {project.title}
            </h3>
          )}
        </motion.div>
        
        {/* Description */}
        {project.description && (
          <motion.p 
            className="text-sm text-muted-foreground font-sans line-clamp-2 mb-4"
            variants={cardTextVariants}
          >
            {toPlainText(project.description)}
          </motion.p>
        )}
        
        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <motion.div 
            className="mb-4 flex flex-wrap gap-1.5"
            variants={cardTextVariants}
          >
            {project.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 rounded bg-muted/20 border text-muted-foreground font-sans"
                style={{ borderColor: 'color-mix(in srgb, var(--border) 70%, transparent)' }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

// Gallery item component - all 4:3 ratio, rounded-lg
function GalleryItemComponent({ item, index }: { item: GalleryItemClient; index: number }) {
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
                    <path d="M8 5v14l11-7z"/>
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
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2 mx-auto">
                  <svg className="w-6 h-6 text-muted-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <span className="text-sm text-muted-foreground">Video</span>
              </div>
            </div>
          )
        ) : item.size === 'large' ? (
          <div className="relative w-full">
            <Image
              src={item.src}
              alt={item.alt}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              sizes="100vw"
              quality={90}
            />
          </div>
        ) : (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className="object-contain"
            sizes={item.size === 'medium' ? '50vw' : '33vw'}
            quality={90}
          />
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

export default function PlayPageClient({ projects, galleryItems }: PlayPageClientProps) {
  return (
    <div className="bg-background text-foreground theme-transition relative overflow-hidden">
      <motion.main 
        className="px-6 py-12 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Content */}
        <div className="max-w-4xl mx-auto mb-20">
          <motion.h1 variants={itemVariants} className="heading-display mb-8 text-center">
            <span className="lust-aalt">P</span>ixe<span className="lust-swsh">l</span>
            <span className="lust-ss03">s</span> <span className="lust-aalt">P</span>ushe
            <span className="lust-swsh">d</span>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"
          />
          <motion.h2 variants={itemVariants} className="text-2xl font-normal mb-8 font-sans text-foreground">
            Recent Projects
          </motion.h2>
          <motion.div variants={itemVariants} className="mb-16">
            <p className="text-body-main">
              It's such an incredible time to be a designer. These are experiments, explorations, various other pixels I've been pushing recently.
            </p>
          </motion.div>
        </div>

        {/* Projects Section - 2 Column Grid */}
        {projects.length > 0 && (
          <motion.div 
            className="max-w-7xl mx-auto mb-24"
            variants={projectCardContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {projects.map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Gallery Section */}
        {galleryItems.length > 0 && (
          <>
            <div className="max-w-4xl mx-auto mb-12">
              <motion.div
                variants={itemVariants}
                className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"
              />
              <motion.h2 variants={itemVariants} className="font-normal text-2xl mb-8">
                Various Pixels
              </motion.h2>
              <motion.div variants={itemVariants} className="mb-16">
                <p className="text-body-main">
                  Screenshots, recordings, and visual artifacts from various projects and experiments.
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
