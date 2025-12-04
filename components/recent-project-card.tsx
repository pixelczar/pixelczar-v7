'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { ProjectListItem } from '@/types/sanity'

interface RecentProjectCardProps {
  project: ProjectListItem
  index?: number
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

function TiltImage({ image, title, index }: { image: { url: string; alt: string }; title: string; index: number }) {
  return (
    <div className="relative w-full aspect-[4/3]">
      <motion.div
        className="absolute inset-0 rounded-md hover:shadow-2xl cursor-pointer overflow-hidden"
        initial={false}
        whileHover={{ 
          scale: 1.4,
          zIndex: 50,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
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
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 40vw, 400px"
          quality={100}
          unoptimized={true}
        />
      </motion.div>
    </div>
  )
}

export default function RecentProjectCard({ project, index = 0 }: RecentProjectCardProps) {
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

  const cardContent = (
    <>
      {/* Top Section: Title/Description (2/3) + Metadata (1/3) */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 max-w-4xl mx-auto">
        {/* Title and Description - 2/3 width */}
        <div className="flex-[2] min-w-0">
          <div className="flex items-center gap-3 mb-3">
            {project.projectUrl ? (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                id={`project-title-${project._id}`}
                data-cursor-target={`project-title-${project._id}`}
                data-cursor-rounded="full"
                className="inline-flex items-center gap-2 px-2 py-1 rounded-full relative -left-2 cursor-hover"
                aria-label={`Visit ${project.title}`}
              >
                <h3 className="text-2xl font-semibold font-sans group-hover:text-accent transition-colors duration-300">
                  {project.title}
                </h3>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
              </a>
            ) : (
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full relative -left-2">
                <h3 className="text-xl font-semibold font-sans">
                  {project.title}
                </h3>
              </div>
            )}
          </div>
          {project.description && (
            <p className="text-base text-muted-foreground font-sans leading-relaxed">
              {toPlainText(project.description)}
            </p>
          )}
          {project.tags && project.tags.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
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
          {project.role && (
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 font-sans">
                Role
              </div>
              <div className="text-sm font-sans text-foreground">
                {toPlainText(project.role)}
              </div>
            </div>
          )}
          {project.timeline && (
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 font-sans">
                Timeline
              </div>
              <div className="text-sm font-sans text-foreground">
                {toPlainText(project.timeline)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Images - 3 across */}
      {project.gallery && project.gallery.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 max-w-4xl mx-auto">
          {project.gallery.slice(0, 3).map((image, idx) => (
            <TiltImage key={idx} image={image} title={project.title} index={idx} />
          ))}
        </div>
      ) : project.mainImage ? (
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-md bg-muted/50 mt-6" data-cursor-ignore>
          <Image
            src={project.mainImage.url}
            alt={project.mainImage.alt || project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>
      ) : null}
    </>
  )

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="mb-8 group"
    >
      <div 
        className={`bg-card/30 rounded-lg group-hover:bg-card/50 transition-all duration-300 p-6 ${project.projectUrl ? 'cursor-hover' : ''}`}
        data-cursor-target={project.projectUrl ? `project-title-${project._id}` : undefined}
      >
        {cardContent}
      </div>
    </motion.div>
  )
}

