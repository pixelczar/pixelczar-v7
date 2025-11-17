import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getProjectBySlug, getAllProjects } from '@/lib/sanity-queries'
import { buildImageUrl, getGalleryImageUrls } from '@/lib/sanity'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PortableText } from '@portabletext/react'

export const revalidate = 60

interface ProjectPageProps {
  params: {
    slug: string
  }
}

// Generate static params for all projects
export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((project) => ({
    slug: project.slug.current,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.title} | Pixelczar`,
    description: project.description || `${project.title} - Portfolio project`,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  // Build optimized image URLs
  const mainImageUrl = project.mainImage ? buildImageUrl(project.mainImage, 1920, 1080) : null
  const mainImage = mainImageUrl
    ? {
        url: mainImageUrl,
        alt: project.mainImage?.alt || project.title,
        caption: project.mainImage?.caption,
      }
    : null

  const galleryImages = project.gallery
    ? getGalleryImageUrls(project.gallery, { width: 1200 })
    : []

  return (
    <div className="bg-background text-foreground theme-transition font-sans">
      <main className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link href="/work">
            <Button variant="ghost" className="mb-8 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>

          {/* Project Header */}
          <div className="mb-12">
            <div className="flex items-start justify-between gap-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-serif italic font-normal">{project.title}</h1>
              {project.featured && (
                <Badge variant="secondary" className="mt-2">
                  Featured
                </Badge>
              )}
            </div>

            {/* Project Metadata */}
            <div className="flex flex-wrap gap-6 text-muted-foreground mb-6 font-sans">
              {project.role && (
                <div>
                  <span className="text-sm font-medium text-foreground">Role: </span>
                  {project.role}
                </div>
              )}
              {project.timeline && (
                <div>
                  <span className="text-sm font-medium text-foreground">Timeline: </span>
                  {project.timeline}
                </div>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <p className="text-xl text-muted-foreground mb-6 font-sans">{project.description}</p>
            )}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Project URL */}
            {project.projectUrl && (
              <Link href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  View Live Project
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          {/* Main Image */}
          {mainImage && (
            <div className="mb-12">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </div>
              {mainImage.caption && (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  {mainImage.caption}
                </p>
              )}
            </div>
          )}

          {/* Outcomes */}
          {project.outcomes && project.outcomes.length > 0 && (
            <div className="mb-12 font-sans">
              <h2 className="text-2xl font-semibold mb-4 font-sans">Key Outcomes</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none font-sans">
                <PortableText value={project.outcomes} />
              </div>
            </div>
          )}

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <div className="mb-12 font-sans">
              <h2 className="text-2xl font-semibold mb-6 font-sans">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {galleryImages.map((image, index) => (
                  <div key={index} className="space-y-2">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    {image.caption && (
                      <p className="text-sm text-muted-foreground">{image.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

