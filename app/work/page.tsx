import { getCaseStudiesList, getGalleryItems } from '@/lib/sanity-queries'
import { buildImageUrl } from '@/lib/sanity'
import { experienceData } from '@/lib/data'
import WorkPageClient from '@/components/work-page-client'
import type { CaseStudyListItem, GalleryItemClient } from '@/types/sanity'

export const revalidate = 60

export const metadata = {
  title: 'Work • Will Smith',
  description: 'Showcases, portfolio projects, and professional experience',
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

export default async function WorkPage() {
  let caseStudies: CaseStudyListItem[] = []
  let galleryItems: GalleryItemClient[] = []

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
        // For video, get video URL or uploaded video asset
        videoUrl = typeof cs.mainVideoUrl === 'string' ? cs.mainVideoUrl : undefined
        videoAssetUrl = cs.mainVideo?.asset?.url || null
      } else {
        // For image, use the existing logic
        imageUrl = (cs.mainImage && !cs.mainImage.isHidden) ? buildImageUrl(cs.mainImage, 1200) : null
      }
      
      const galleryUrls = cs.gallery?.filter((img: any) => !img.isHidden)?.map((img: any) => ({
        url: buildImageUrl(img, 1200),
        alt: typeof img.alt === 'string' ? img.alt : cs.title,
      }))?.filter((img: any): img is { url: string; alt: string } => img.url !== null)
      
      const originalTitle = String(cs.title || '')
      const oneLiner = typeof cs.oneLiner === 'string' ? cs.oneLiner : undefined
      
      return {
        _id: String(cs._id || ''),
        title: oneLiner || originalTitle, // Use one-liner as the primary title in the grid
        slug: String(cs.slug || ''),
        oneLiner,
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
        gallery: galleryUrls,
      }
    })
  } catch (error) {
    console.error('Error fetching case studies:', error)
  }

  try {
    const rawGalleryItems = await getGalleryItems()
    galleryItems = rawGalleryItems
      .filter((item: any) => !item.isHidden)
      .map((item: any) => {
      let src = ''
      const isVideo = item.type === 'video'
      const externalVideoUrl = typeof item.videoUrl === 'string' ? item.videoUrl : undefined
      
      if (isVideo) {
        src = item.video?.asset?.url || ''
      } else {
        src = item.image ? buildImageUrl(item.image, 1600) || '' : ''
      }
      
      return {
        _id: String(item._id || ''),
        type: (isVideo ? 'video' : 'image') as 'image' | 'video',
        size: (['large', 'medium', 'small'].includes(item.size) ? item.size : 'medium') as 'large' | 'medium' | 'small',
        src,
        alt: typeof item.image?.alt === 'string' ? item.image.alt : item.title || 'Gallery item',
        caption: typeof item.caption === 'string' ? item.caption : undefined,
        videoUrl: externalVideoUrl,
      }
    }).filter((item: GalleryItemClient) => {
      return item.src || item.videoUrl
    })
  } catch (error) {
    console.error('Error fetching gallery items:', error)
  }

  return <WorkPageClient caseStudies={caseStudies} experienceData={experienceData} galleryItems={galleryItems} />
}
