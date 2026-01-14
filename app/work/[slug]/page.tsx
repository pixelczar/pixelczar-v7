import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getCaseStudyBySlug, getAllCaseStudies } from '@/lib/sanity-queries'
import { buildImageUrl, getGalleryImageUrls } from '@/lib/sanity'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PortableText } from '@portabletext/react'
import { NarrowTextContainer, FullWidthContainer } from '@/components/case-study-content'
import CaseStudyPortableText from '@/components/case-study-portable-text'

export const revalidate = 60

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all case studies
export async function generateStaticParams() {
  try {
    const caseStudies = await getAllCaseStudies()
    return caseStudies.map((cs) => ({
      slug: cs.slug?.current || '',
    })).filter(p => p.slug)
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
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
  return ''
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { slug } = await params
  
  try {
    const caseStudy = await getCaseStudyBySlug(slug)

    if (!caseStudy) {
      return {
        title: 'Case Study Not Found',
      }
    }

    const descriptionText = toPlainText(caseStudy.description) || `${caseStudy.title} - Case Study`

    return {
      title: `${caseStudy.title} | Pixelczar`,
      description: descriptionText,
    }
  } catch (error) {
    return {
      title: 'Case Study | Pixelczar',
    }
  }
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params
  const caseStudy = await getCaseStudyBySlug(slug)

  if (!caseStudy) {
    notFound()
  }

  const mainImageUrl = caseStudy.mainImage ? buildImageUrl(caseStudy.mainImage, 1920, 1080) : null
  const mainImage = mainImageUrl
    ? {
        url: mainImageUrl,
        alt: toPlainText(caseStudy.mainImage?.alt) || caseStudy.title,
        caption: toPlainText(caseStudy.mainImage?.caption),
      }
    : null

  const galleryImages = caseStudy.gallery
    ? getGalleryImageUrls(caseStudy.gallery, { width: 1200 })
    : []

  const isVideo = caseStudy.mainMediaType === 'video'
  const videoUrl = caseStudy.mainVideoUrl || caseStudy.mainVideo?.asset?.url

  return (
    <div className="bg-background text-foreground theme-transition font-sans">
      <main className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link href="/work">
            <Button variant="ghost" className="mb-8 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Work
            </Button>
          </Link>

          {/* Case Study Header */}
          <div className="mb-12">
            <div className="flex items-start justify-between gap-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-serif italic font-normal">{caseStudy.title}</h1>
              {caseStudy.featured && (
                <Badge variant="secondary" className="mt-2">
                  Featured
                </Badge>
              )}
            </div>

            {/* Company */}
            {caseStudy.company && (
              <p className="text-lg text-accent font-medium mb-4 font-sans">{caseStudy.company}</p>
            )}

            {/* Case Study Metadata */}
            <div className="flex flex-wrap gap-6 text-muted-foreground mb-6 font-sans">
              {caseStudy.role && (
                <div>
                  <span className="text-sm font-medium text-foreground">Role: </span>
                  {toPlainText(caseStudy.role)}
                </div>
              )}
              {caseStudy.timeline && (
                <div>
                  <span className="text-sm font-medium text-foreground">Timeline: </span>
                  {toPlainText(caseStudy.timeline)}
                </div>
              )}
            </div>

            {/* Short Description or Description */}
            {(caseStudy.shortDescription || caseStudy.description) && (
              <p className="text-xl text-muted-foreground mb-6 font-sans">
                {toPlainText(caseStudy.shortDescription || caseStudy.description)}
              </p>
            )}

            {/* Tags */}
            {caseStudy.tags && caseStudy.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {caseStudy.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Project URL */}
            {caseStudy.projectUrl && (
              <Link href={caseStudy.projectUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  View Project
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          {/* Main Media (Image or Video) */}
          {isVideo && videoUrl ? (
            <div className="mb-12">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                {caseStudy.mainVideoUrl ? (
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
                ) : (
                  <video
                    src={videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          ) : mainImage ? (
            <div className="mb-12">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt}
                  fill
                  className="object-contain"
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
          ) : null}

          {/* Content (PortableText) */}
          {caseStudy.content && caseStudy.content.length > 0 && (
            <div className="mb-12 font-sans">
              <CaseStudyPortableText value={caseStudy.content} />
            </div>
          )}

          {/* Outcomes */}
          {caseStudy.outcomes && caseStudy.outcomes.length > 0 && (
            <div className="mb-12 font-sans">
              <h2 className="text-2xl font-semibold mb-4 font-sans">Outcomes</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none font-sans">
                <PortableText value={caseStudy.outcomes} />
              </div>
            </div>
          )}

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <div className="mb-12 font-sans">
              <h2 className="text-2xl font-semibold mb-6 font-sans">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {galleryImages.map((image, index) => (
                  <div key={index} className="space-y-2">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={image.url}
                        alt={image.alt || `Gallery image ${index + 1}`}
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
