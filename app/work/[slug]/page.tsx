import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getCaseStudyBySlug, getAllCaseStudies } from '@/lib/sanity-queries'
import { buildImageUrl, getGalleryImageUrls } from '@/lib/sanity'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PortableText } from '@portabletext/react'

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

  // Build optimized image URLs
  const mainImageUrl = caseStudy.mainImage ? buildImageUrl(caseStudy.mainImage, 1920, 1080) : null
  const mainImage = mainImageUrl
    ? {
        url: mainImageUrl,
        alt: caseStudy.mainImage?.alt || caseStudy.title,
        caption: caseStudy.mainImage?.caption,
      }
    : null

  const galleryImages = caseStudy.gallery
    ? getGalleryImageUrls(caseStudy.gallery, { width: 1200 })
    : []

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
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-serif italic font-normal">{caseStudy.title}</h1>
              {caseStudy.featured && (
                <Badge variant="secondary" className="mt-2">
                  Featured
                </Badge>
              )}
            </div>

            {/* Company */}
            {caseStudy.company && (
              <p className="text-xl text-accent font-medium mb-4">
                {typeof caseStudy.company === 'string' ? caseStudy.company : toPlainText(caseStudy.company)}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap gap-6 text-muted-foreground mb-6 font-sans">
              {caseStudy.role && (
                <div>
                  <span className="text-sm font-medium text-foreground">Role: </span>
                  {typeof caseStudy.role === 'string' ? caseStudy.role : toPlainText(caseStudy.role)}
                </div>
              )}
              {caseStudy.timeline && (
                <div>
                  <span className="text-sm font-medium text-foreground">Timeline: </span>
                  {typeof caseStudy.timeline === 'string' ? caseStudy.timeline : toPlainText(caseStudy.timeline)}
                </div>
              )}
            </div>

            {/* Description */}
            {caseStudy.description && (
              <div className="text-xl text-muted-foreground mb-6 font-sans prose prose-lg dark:prose-invert max-w-none">
                {typeof caseStudy.description === 'string' ? (
                  <p>{caseStudy.description}</p>
                ) : (
                  <PortableText value={caseStudy.description} />
                )}
              </div>
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

          {/* Content - Full Case Study */}
          {caseStudy.content && caseStudy.content.length > 0 && (
            <div className="mb-12 font-sans">
              <div className="prose prose-lg dark:prose-invert max-w-none font-sans prose-headings:font-sans prose-p:font-sans">
                <PortableText 
                  value={caseStudy.content}
                  components={{
                    types: {
                      image: ({ value }) => {
                        const imageUrl = buildImageUrl(value, 1200)
                        if (!imageUrl) return null
                        return (
                          <div className="my-8">
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                              <Image
                                src={imageUrl}
                                alt={value.alt || 'Case study image'}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 1024px"
                              />
                            </div>
                            {value.caption && (
                              <p className="text-sm text-muted-foreground text-center mt-2">
                                {value.caption}
                              </p>
                            )}
                          </div>
                        )
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Outcomes */}
          {caseStudy.outcomes && caseStudy.outcomes.length > 0 && (
            <div className="mb-12 font-sans">
              <h2 className="text-2xl font-semibold mb-4 font-sans">Key Outcomes</h2>
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
