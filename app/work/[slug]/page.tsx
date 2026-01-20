import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getCaseStudyBySlug, getAllCaseStudies } from '@/lib/sanity-queries'
import { buildImageUrl, getGalleryImageUrls } from '@/lib/sanity'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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
        title: 'Showcase Not Found',
      }
    }

    const descriptionText = toPlainText(caseStudy.description) || `${caseStudy.title} - Showcase`

    return {
      title: `${caseStudy.title} | Pixelczar`,
      description: descriptionText,
    }
  } catch (error) {
    return {
      title: 'Showcase | Pixelczar',
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
        width: caseStudy.mainImage?.asset?.metadata?.dimensions?.width || 1200,
        height: caseStudy.mainImage?.asset?.metadata?.dimensions?.height || 900,
      }
    : null

  const galleryImages = caseStudy.gallery
    ? getGalleryImageUrls(caseStudy.gallery, { width: 1200 })
    : []

  const isVideo = caseStudy.mainMediaType === 'video'
  const videoUrl = caseStudy.mainVideoUrl || caseStudy.mainVideo?.asset?.url

  // Debug log
  if (process.env.NODE_ENV === 'development') {
    console.log('Showcase Media Debug:', { 
      title: caseStudy.title,
      mediaType: caseStudy.mainMediaType, 
      hasImage: !!mainImage, 
      imageUrl: mainImage?.url,
      isVideo, 
      videoUrl 
    })
  }

  return (
    <div className="bg-background text-foreground theme-transition font-sans">
      <main className="px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          {/* <Link href="/work" className="inline-block mb-12">
            <Button variant="ghost" className="-ml-4 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Work
            </Button>
          </Link> */}

          {/* Title Section */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl tracking-tight font-sans not-italic font-semibold text-center">
              {caseStudy.title}
            </h1>
            <Separator className="bg-foreground/10" />
          </div>

          {/* Intro Section */}
          <div className="">
            
            <div className="mx-auto max-w-3xl">
              <div className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"></div>
              <h2 className="text-3xl md:text-5xl font-normal mb-8 opacity-30">Intro</h2>
              
              {/* Catchy One-Liner */}
              {caseStudy.oneLiner && (
                <h3 className="text-2xl font-normal tracking-tight mb-4">
                  {caseStudy.oneLiner}
                </h3>
              )}

              {/* Short Description or Description as intro to the work */}
              {(caseStudy.shortDescription || caseStudy.description) && (
              <p className="text-body-main font-medium mb-16 leading-tighter">
                {toPlainText(caseStudy.shortDescription || caseStudy.description)}
              </p>
              )}

            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start py-8">
              {/* Left Column: Metadata & Stats */}
              <div className="md:col-span-4 space-y-12">
                  <div>
                    <p className="text-xl font-normal mb-2">
                      {caseStudy.company} <span className="text-muted-foreground mx-2"> →  </span>{caseStudy.timeline && `${caseStudy.timeline}`}
                    </p>
                    <h3 className="text-lg text-muted-foreground mb-1">{toPlainText(caseStudy.role)}</h3>
                  </div>

                {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                    {caseStudy.metrics.map((metric, i) => (
                      <div key={i} className="space-y-1">
                        <p className="text-4xl md:text-6xl font-normal mb-2 opacity-30">
                          {metric.label}
                        </p>
                        <p className="text-body-main font-medium mb-6 leading-tighter">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Hero Media */}
              <div className="md:col-span-8">
                <div className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-muted/10">
                  {isVideo && videoUrl ? (
                    caseStudy.mainVideoUrl ? (
                      <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative aspect-video flex items-center justify-center bg-muted/50 hover:bg-muted/70 transition-colors"
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
                        className="w-full h-auto block"
                      />
                    )
                  ) : mainImage ? (
                    <Image
                      src={mainImage.url}
                      alt={mainImage.alt}
                      width={mainImage.width}
                      height={mainImage.height}
                      className="w-full h-auto block"
                      priority
                      sizes="(max-width: 1280px) 100vw, 800px"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>

      

          {/* The Work Section */}
          <div className="mb-24">
            <div className="mx-auto max-w-3xl">
              <div className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"></div>
              <h2 className="text-3xl md:text-5xl font-normal mb-8 opacity-30">The Work</h2>
            </div>        

            {/* Content (PortableText) */}
            {caseStudy.content && caseStudy.content.length > 0 && (
              <div className="mb-24">
                <CaseStudyPortableText value={caseStudy.content} />
              </div>
            )}
          </div>

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <div className="mb-24">
              <div className="mx-auto max-w-3xl">
                <div className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition"></div>
                <h2 className="text-3xl md:text-5xl font-normal mb-8 opacity-30">Gallery</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {galleryImages.map((image, index) => (
                  <div key={index} className="space-y-4">
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-muted border border-foreground/5 shadow-lg">
                      <Image
                        src={image.url}
                        alt={image.alt || `Gallery image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    {image.caption && (
                      <p className="text-sm text-muted-foreground px-2">{image.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Footer Navigation */}
          <div className="flex justify-between items-center pt-12 mt-24">
             <Link href="/work">
              <Button variant="link" className="px-0 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Work
              </Button>
            </Link>
            
            {caseStudy.projectUrl && (
              <Link href={caseStudy.projectUrl} target="_blank" rel="noopener noreferrer">
                <Button className="gap-2 rounded-full px-8 py-6 text-lg">
                  Visit Project
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
