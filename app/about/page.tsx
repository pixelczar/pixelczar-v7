import { getCaseStudiesList } from '@/lib/sanity-queries'
import { buildImageUrl } from '@/lib/sanity'
import type { CaseStudyListItem } from '@/types/sanity'
import AboutPageClient from '@/components/about-page-client'

export const revalidate = 60

export const metadata = {
  title: 'About | Pixelczar',
  description: 'About Will Smith - Product Designer and Design Leader',
}

// Helper to extract plain text from potentially Portable Text fields
function toPlainText(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value
      .map((block: any) => {
        if (block._type === 'block' && Array.isArray(block.children)) {
          return block.children.map((child: any) => child.text || '').join('')
        }
        return ''
      })
      .join('\n')
      .trim() || undefined
  }
  return undefined
}

export default async function AboutPage() {
  let caseStudies: CaseStudyListItem[] = []

  try {
    const rawCaseStudies = await getCaseStudiesList()

    caseStudies = rawCaseStudies
      .filter((cs: any) => {
        // Filter out AI Card Generator
        const title = String(cs.title || '').toLowerCase()
        const slug = String(cs.slug || '').toLowerCase()
        return !title.includes('ai card generator') && !slug.includes('ai-card-generator')
      })
      .map((cs: any) => {
        const isVideo = cs.mainMediaType === 'video'
        let imageUrl = null
        let videoUrl = null
        let videoAssetUrl = null

        if (isVideo) {
          videoUrl = typeof cs.mainVideoUrl === 'string' ? cs.mainVideoUrl : undefined
          videoAssetUrl = cs.mainVideo?.asset?.url || null
        } else {
          imageUrl = cs.mainImage ? buildImageUrl(cs.mainImage, 1200) : null
        }

        return {
          _id: String(cs._id || ''),
          title: String(cs.title || ''),
          slug: String(cs.slug || ''),
          company: typeof cs.company === 'string' ? cs.company : undefined,
          description: toPlainText(cs.description),
          role: typeof cs.role === 'string' ? cs.role : undefined,
          timeline: typeof cs.timeline === 'string' ? cs.timeline : undefined,
          tags: Array.isArray(cs.tags) ? cs.tags.filter((t: any) => typeof t === 'string') : undefined,
          featured: Boolean(cs.featured),
          projectUrl: typeof cs.projectUrl === 'string' ? cs.projectUrl : undefined,
          mainMediaType: isVideo ? 'video' : 'image',
          mainImage: imageUrl
            ? {
              url: imageUrl,
              alt: typeof cs.mainImage?.alt === 'string' ? cs.mainImage.alt : cs.title,
            }
            : undefined,
          mainVideo: videoAssetUrl ? { url: videoAssetUrl } : undefined,
          mainVideoUrl: videoUrl,
        }
      })
  } catch (error) {
    console.error('Error fetching case studies:', error)
  }

  return <AboutPageClient caseStudies={caseStudies} />
}
