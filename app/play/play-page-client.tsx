'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { ProjectListItem, GalleryItemClient } from '@/types/sanity'

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface PlayPageClientProps {
  projects: ProjectListItem[]
  galleryItems: GalleryItemClient[]
}

// Project image component - 4:3 ratio, no zoom, images contained
function ProjectImage({ image, title, index }: { image: { url: string; alt: string }; title: string; index: number }) {
  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-md bg-black/40 border border-border/50">
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

// 2-column project card for Play page - links to external projectUrl
function ProjectCard({ project, index }: { project: ProjectListItem; index: number }) {
  const content = (
    <div className={`bg-card/30 rounded-xl p-5 transition-all duration-300 ${project.projectUrl ? 'group-hover:bg-card/50' : ''}`}>
      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <h3 className={`text-lg font-semibold font-sans transition-colors duration-300 ${project.projectUrl ? 'group-hover:text-accent' : ''}`}>
          {project.title}
        </h3>
        {project.projectUrl && (
          <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
        )}
      </div>
      
      {/* Description */}
      {project.description && (
        <p className="text-sm text-muted-foreground font-sans line-clamp-2 mb-4">
          {project.description}
        </p>
      )}
      
      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-0.5 rounded bg-muted/20 border text-muted-foreground font-sans"
              style={{ borderColor: 'color-mix(in srgb, var(--border) 70%, transparent)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Gallery Images - 3 images in a row with 4:3 ratio */}
      {project.gallery && project.gallery.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {project.gallery.slice(0, 3).map((image, idx) => (
            <ProjectImage key={idx} image={image} title={project.title} index={idx} />
          ))}
        </div>
      ) : project.mainImage ? (
        <div className="grid grid-cols-3 gap-3">
          <ProjectImage image={project.mainImage} title={project.title} index={0} />
        </div>
      ) : null}
    </div>
  )

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay: index * 0.1,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="group"
    >
      {project.projectUrl ? (
        <a 
          href={project.projectUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </motion.div>
  )
}

// Gallery item component - all 4:3 ratio, rounded-lg
function GalleryItemComponent({ item, index }: { item: GalleryItemClient; index: number }) {
  // Size classes for max-w-7xl container:
  // Large = full width, Medium = 50% (half), Small = 33% (third)
  const sizeClasses = {
    small: 'w-full md:w-[calc(33.333%-1rem)]',
    medium: 'w-full md:w-[calc(50%-0.75rem)]',
    large: 'w-full',
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.6,
            delay: index * 0.08,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`${sizeClasses[item.size]} relative overflow-hidden rounded-lg bg-black/40 group`}
    >
      <div className="relative w-full aspect-[4/3]">
        {item.type === 'video' ? (
          item.videoUrl ? (
            // External video (YouTube/Vimeo) - show as iframe or link
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
            // Uploaded video file - use object-cover to fill frame
            <video
              src={item.src}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            // Video without source - show placeholder
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
        ) : (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className="object-contain"
            sizes={item.size === 'large' ? '100vw' : item.size === 'medium' ? '50vw' : '33vw'}
            quality={90}
          />
        )}
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Caption */}
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
      <main className="px-6 py-12 relative">
        {/* Header Content */}
        <div className="max-w-4xl mx-auto mb-20">
          <motion.h1 variants={itemVariants} className="heading-display mb-8 text-center">
            <span className="lust-aalt">P</span>ixe<span className="lust-swsh">l</span>
            <span className="lust-ss03">s</span> <span className="lust-aalt">P</span>ushe
            <span className="lust-swsh">d</span>
          </motion.h1>

          {/* Separator Line */}
          <motion.div
            variants={itemVariants}
            className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"
          />
          <motion.h2 variants={itemVariants} className="text-2xl font-normal mb-8 font-sans text-foreground">
            Creative Projects
          </motion.h2>
          <motion.div variants={itemVariants} className="mb-16">
            <p className="text-body-main">
              A collection of side projects, experiments, and visual explorations. These are the pixels I push when I'm not building products—playing with new techniques, testing ideas, and having fun with design.
            </p>
          </motion.div>
        </div>

        {/* Projects Section - 2 Column Grid */}
        {projects.length > 0 && (
          <div className="max-w-7xl mx-auto mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Gallery Section */}
        {galleryItems.length > 0 && (
          <>
            <div className="max-w-4xl mx-auto mb-12">
              {/* Separator Line */}
              <motion.div
                variants={itemVariants}
                className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"
              />
              <motion.h2 variants={itemVariants} className="font-normal text-2xl mb-8 text-muted-foreground">
                Gallery
              </motion.h2>
              <motion.div variants={itemVariants} className="mb-16">
                <p className="text-body-main">
                  Screenshots, recordings, and visual artifacts from various projects and experiments.
                </p>
              </motion.div>
            </div>

            {/* Gallery - flex wrap layout for proper sizing */}
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-4 md:gap-6">
                {galleryItems.map((item, index) => (
                  <GalleryItemComponent key={item._id} item={item} index={index} />
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
