import { getProjectsList, getGalleryItems } from '@/lib/sanity-queries'
import { buildImageUrl } from '@/lib/sanity'
import PixelsClient from './pixels-client'

export const revalidate = 60

export const metadata = {
  title: 'Pixels | Pixelczar',
  description: 'An infinite canvas of creative work',
}

type MediaItem = { url: string; width: number; height: number; type?: 'image' | 'video'; title?: string }

const MAX_TEX_WIDTH = 800

// Extract native dimensions from a Sanity image asset ref
// Format: image-{hash}-{width}x{height}-{format}
function getDimsFromAsset(asset: any): { w: number; h: number } | null {
  const ref = asset?._ref || asset?._id
  if (typeof ref !== 'string') return null
  const match = ref.match(/-(\d+)x(\d+)[-.]/)
  if (!match) return null
  return { w: parseInt(match[1], 10), h: parseInt(match[2], 10) }
}

function pushImage(media: MediaItem[], source: any, title?: string, fallbackWidth = MAX_TEX_WIDTH) {
  const url = buildImageUrl(source, fallbackWidth)
  if (!url) return
  const dims = getDimsFromAsset(source?.asset || source)
  if (dims) {
    const scale = Math.min(1, MAX_TEX_WIDTH / dims.w)
    media.push({ url, width: Math.round(dims.w * scale), height: Math.round(dims.h * scale), title })
  } else {
    media.push({ url, width: 0, height: 0, title })
  }
}

export default async function PixelsPage() {
  const media: MediaItem[] = []

  try {
    const projects = await getProjectsList()
    for (const project of projects) {
      const name = typeof project.title === 'string' ? project.title : undefined
      if (project.mainImage && !(project.mainImage as any).isHidden) {
        pushImage(media, project.mainImage, name)
      }
      if (Array.isArray(project.gallery)) {
        for (const img of project.gallery) {
          if ((img as any).isHidden) continue
          pushImage(media, img, name)
        }
      }
    }
  } catch (error) {
    console.log('Error fetching projects for pixels:', error)
  }

  try {
    const galleryItems = await getGalleryItems()
    for (const item of galleryItems) {
      if ((item as any).isHidden) continue
      const name = typeof (item as any).title === 'string' ? (item as any).title : undefined
      if (item.type === 'video') {
        const videoUrl = (item as any).video?.asset?.url || (typeof (item as any).videoUrl === 'string' ? (item as any).videoUrl : null)
        if (videoUrl) media.push({ url: videoUrl, width: 0, height: 0, type: 'video', title: name })
      } else {
        if (item.image) pushImage(media, item.image, name)
      }
    }
  } catch (error) {
    console.log('Error fetching gallery for pixels:', error)
  }

  return <PixelsClient media={media} />
}
