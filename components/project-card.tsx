'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { ProjectListItem } from '@/types/sanity'

interface ProjectCardProps {
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

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/work/${project.slug}`}>
        <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300 font-sans">
          {project.mainImage && (
            <div className="relative w-full aspect-video overflow-hidden bg-muted">
              <Image
                src={project.mainImage.url}
                alt={project.mainImage.alt || project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {project.featured && (
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    Featured
                  </Badge>
                </div>
              )}
            </div>
          )}

          <CardContent className="p-6">
            <div className="space-y-3">
              <div>
                <h3 className="text-2xl font-semibold mb-2 font-sans">
                  {project.title}
                </h3>
                {project.role && (
                  <p className="text-sm text-muted-foreground mb-2 font-sans">
                    {toPlainText(project.role)}
                  </p>
                )}
              </div>

              {project.description && (
                <p className="text-muted-foreground line-clamp-3 font-sans">
                  {toPlainText(project.description)}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {project.timeline && (
                  <span className="text-sm text-muted-foreground font-sans">
                    {toPlainText(project.timeline)}
                  </span>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs font-sans">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs font-sans">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

