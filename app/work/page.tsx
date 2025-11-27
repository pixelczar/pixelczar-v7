import { getCaseStudiesList } from '@/lib/sanity-queries'
import { buildImageUrl } from '@/lib/sanity'
import { experienceData } from '@/lib/data'
import WorkPageClient from '@/components/work-page-client'
import type { CaseStudyListItem } from '@/types/sanity'

export const revalidate = 60

export const metadata = {
  title: 'Work | Pixelczar',
  description: 'Case studies, portfolio projects, and professional experience',
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

  try {
    const rawCaseStudies = await getCaseStudiesList()

    caseStudies = rawCaseStudies.map((cs: any) => {
      const imageUrl = cs.mainImage ? buildImageUrl(cs.mainImage, 1200) : null
      const galleryUrls = cs.gallery?.map((img: any) => ({
        url: buildImageUrl(img, 1200),
        alt: typeof img.alt === 'string' ? img.alt : cs.title,
      }))?.filter((img: any): img is { url: string; alt: string } => img.url !== null)
      
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
        mainImage: imageUrl
          ? {
              url: imageUrl,
              alt: typeof cs.mainImage?.alt === 'string' ? cs.mainImage.alt : cs.title,
            }
          : undefined,
        gallery: galleryUrls,
      }
    })
  } catch (error) {
    console.error('Error fetching case studies:', error)
  }

  return <WorkPageClient caseStudies={caseStudies} experienceData={experienceData} />
}
