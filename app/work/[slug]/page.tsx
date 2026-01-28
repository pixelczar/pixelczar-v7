import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getCaseStudyBySlug, getAllCaseStudies } from '@/lib/sanity-queries'
import { buildImageUrl, getGalleryImageUrls } from '@/lib/sanity'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { NarrowTextContainer, FullWidthContainer } from '@/components/case-study-content'
import CaseStudyPortableText from '@/components/case-study-portable-text'
import NextProject from '@/components/next-project'
import type { CaseStudyListItem } from '@/types/sanity'
import { buildImageUrl as buildListImageUrl } from '@/lib/sanity'
import { isProjectWip } from '@/lib/work'

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

  // Get all case studies to find the next ones
  const allCaseStudies = await getAllCaseStudies()
  const currentIndex = allCaseStudies.findIndex(cs => cs.slug.current === slug)
  
  // Get next 2 projects for the grid (skipping WIP items)
  const nextProjects: CaseStudyListItem[] = []
  let searchOffset = 1
  while (nextProjects.length < 2 && searchOffset < allCaseStudies.length) {
    const nextIndex = (currentIndex + searchOffset) % allCaseStudies.length
    const nextRaw = allCaseStudies[nextIndex]
    
    // If we've wrapped around to the current project, stop
    if (nextRaw.slug.current === slug) break
    
    // Only add if not WIP
    if (!isProjectWip(nextRaw.slug.current)) {
      const nextImageUrl = (nextRaw.mainImage && !nextRaw.mainImage.isHidden) ? buildListImageUrl(nextRaw.mainImage, 1200) : null
      nextProjects.push({
        _id: nextRaw._id,
        title: nextRaw.title,
        slug: nextRaw.slug.current,
        company: nextRaw.company,
        mainMediaType: nextRaw.mainMediaType,
        mainImage: nextImageUrl ? {
          url: nextImageUrl,
          alt: nextRaw.mainImage?.alt || nextRaw.title,
        } : undefined,
        mainVideo: nextRaw.mainVideo?.asset?.url ? {
          url: nextRaw.mainVideo.asset.url
        } : undefined,
        featured: nextRaw.featured,
        isWip: false, // Since we filtered them out, this will always be false here
      })
    }
    searchOffset++
  }

  const mainImageUrl = (caseStudy.mainImage && !caseStudy.mainImage.isHidden) ? buildImageUrl(caseStudy.mainImage, 1920, 1080) : null
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
              
              {/* Business Context - the hook */}
              {caseStudy.businessContext && (
                <p className="text-lg text-muted-foreground italic mb-6">
                  {caseStudy.businessContext}
                </p>
              )}
              
              {/* Catchy One-Liner */}
              {caseStudy.oneLiner && (
                <h3 className="text-2xl font-normal tracking-tight mb-4">
                  {caseStudy.oneLiner}
                </h3>
              )}

              {/* Short Description or Description as intro to the work */}
              {caseStudy.description && (
              <div className="text-body-main font-medium mb-16 leading-relaxed description whitespace-pre-line">
                {caseStudy.description}
              </div>
              )}

            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start py-8">
              {/* Left Column: Metadata & Stats */}
              <div className="md:col-span-4 space-y-12">
                  <div>
                    <p className="text-xl font-normal mb-2">
                      {caseStudy.company} <span className="text-muted-foreground mx-2"> →  </span>{caseStudy.timeline && `${caseStudy.timeline}`}
                    </p>
                    {caseStudy.role && (
                      <p className="text-lg text-muted-foreground mb-4">{toPlainText(caseStudy.role)}</p>
                    )}
                  </div>

                {/* Contributions - discipline tags */}
                {caseStudy.contributions && caseStudy.contributions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Contributions</p>
                    <p className="text-base leading-relaxed">
                      {caseStudy.contributions.join(' · ')}
                    </p>
                  </div>
                )}

                {/* Impact Statement - the punch */}
                {caseStudy.impactStatement && (
                  <div className="border-l-2 border-accent pl-4">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Outcome</p>
                    <p className="text-lg font-medium">
                      {caseStudy.impactStatement}
                    </p>
                  </div>
                )}

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

          {/* Next Project Section */}
          <NextProject nextProjects={nextProjects} />
          
          {/* Footer Navigation */}
          <div className="flex justify-between items-center pt-12">
             {/* <Link href="/work">
              <Button variant="link" className="px-0 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Work
              </Button>
            </Link> */}
            
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
