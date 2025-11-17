'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { ProjectListItem } from '@/types/sanity'

interface RecentProjectCardProps {
  project: ProjectListItem
  index?: number
}

function TiltImage({ image, title, index }: { image: { url: string; alt: string }; title: string; index: number }) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.4,
        y: -16,
        zIndex: 10,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-md bg-muted/50 border hover:shadow-2xl"
      data-cursor-ignore
    >
      <Image
        src={image.url}
        alt={image.alt || `${title} - Image ${index + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
      />
    </motion.div>
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
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Project Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {project.projectUrl ? (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                id={`project-title-${project._id}`}
                data-cursor-target={`project-title-${project._id}`}
                className="inline-flex items-center gap-2 px-2 py-1 rounded-full relative -left-2 cursor-hover"
                aria-label={`Visit ${project.title}`}
              >
                <h3 className="text-xl font-semibold font-sans group-hover:text-accent transition-colors duration-300">
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
            <p className="text-base text-muted-foreground line-clamp-3 font-sans">
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Screenshot/Logo Space */}
      {project.gallery && project.gallery.length > 0 ? (
        <div className="mt-3 flex flex-col gap-3">
          {project.gallery.slice(0, 3).map((image, idx) => (
            <TiltImage key={idx} image={image} title={project.title} index={idx} />
          ))}
        </div>
      ) : project.mainImage ? (
        <div className="mt-3 relative w-full aspect-[4/3] overflow-hidden rounded-md bg-muted/50" data-cursor-ignore>
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
        className={`bg-card/30 rounded-lg group-hover:bg-card/50 transition-all duration-300 ${project.projectUrl ? 'cursor-hover' : ''}`}
        data-cursor-target={project.projectUrl ? `project-title-${project._id}` : undefined}
      >
        {cardContent}
      </div>
    </motion.div>
  )
}

