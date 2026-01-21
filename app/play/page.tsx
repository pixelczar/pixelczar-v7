import { getProjectsList, getGalleryItems } from '@/lib/sanity-queries'
import { buildImageUrl } from '@/lib/sanity'
import type { ProjectListItem, GalleryItemClient } from '@/types/sanity'
import PlayPageClient from './play-page-client'

export const revalidate = 60

export const metadata = {
  title: 'Pixels Pushed | Pixelczar',
  description: 'Creative projects, experiments, and explorations',
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

export default async function PlayPage() {
  let projects: ProjectListItem[] = []
  let galleryItems: GalleryItemClient[] = []
  
  try {
    const rawProjects = await getProjectsList()
    projects = rawProjects.map((project: any) => {
      const imageUrl = (project.mainImage && !project.mainImage.isHidden) ? buildImageUrl(project.mainImage, 1200) : null
      const galleryUrls = project.gallery?.filter((img: any) => !img.isHidden)?.map((img: any) => ({
        url: buildImageUrl(img, 1200),
        alt: typeof img.alt === 'string' ? img.alt : project.title,
      }))?.filter((img: any): img is { url: string; alt: string } => img.url !== null)
      
      return {
        _id: String(project._id || ''),
        title: String(project.title || ''),
        slug: String(project.slug || ''),
        description: toPlainText(project.description),
        role: typeof project.role === 'string' ? project.role : undefined,
        timeline: typeof project.timeline === 'string' ? project.timeline : undefined,
        tags: Array.isArray(project.tags) ? project.tags.filter((t: any) => typeof t === 'string') : undefined,
        featured: Boolean(project.featured),
        projectUrl: typeof project.projectUrl === 'string' ? project.projectUrl : undefined,
        mainImage: imageUrl
          ? {
              url: imageUrl,
              alt: typeof project.mainImage?.alt === 'string' ? project.mainImage.alt : project.title,
            }
          : undefined,
        gallery: galleryUrls,
      }
    })
  } catch (error) {
    console.log('Error fetching projects:', error)
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
        // For videos: use uploaded video asset URL (not external videoUrl which is handled separately)
        src = item.video?.asset?.url || ''
      } else {
        // Image - use higher resolution for quality
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
      // Keep items that have either a src OR an external videoUrl
      return item.src || item.videoUrl
    })
  } catch (error) {
    console.log('Error fetching gallery items:', error)
  }

  return <PlayPageClient projects={projects} galleryItems={galleryItems} />
}
