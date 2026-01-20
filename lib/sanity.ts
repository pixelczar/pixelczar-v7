import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { apiVersion, dataset, projectId } from '@/sanity/env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
})

// Image URL builder for optimized images
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Helper function to build image URLs with default optimization
export function buildImageUrl(
  source: SanityImageSource | null | undefined,
  width?: number,
  height?: number
): string | null {
  if (!source) return null

  // Check if the image has a valid asset reference or object
  if (typeof source === 'object' && 'asset' in source) {
    const asset = (source as any).asset
    if (!asset || (!asset._ref && !asset._id)) {
      console.warn('Image asset is missing or has no _ref/_id property')
      return null
    }
  }

  try {
    let imageBuilder = urlFor(source).auto('format').fit('max')

    if (width) {
      imageBuilder = imageBuilder.width(width)
    }

    if (height) {
      imageBuilder = imageBuilder.height(height)
    }

    return imageBuilder.url()
  } catch (error) {
    console.error('Error building image URL:', error)
    return null
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
  if (typeof value === 'object' && value !== null && '_type' in value) {
    return ''
  }
  return String(value)
}

// Helper to get gallery image URLs
export function getGalleryImageUrls(
  gallery: Array<any> | null | undefined,
  options?: { width?: number; height?: number }
) {
  if (!gallery || !Array.isArray(gallery)) return []

  return gallery
    .map((image) => {
      const url = buildImageUrl(image, options?.width, options?.height)
      if (!url) return null
      
      return {
        url,
        alt: toPlainText(image.alt) || '',
        caption: toPlainText(image.caption) || '',
      }
    })
    .filter((image): image is { url: string; alt: string; caption: string } => image !== null)
}

