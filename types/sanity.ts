import type { PortableTextBlock } from '@portabletext/types'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Sanity Image with metadata
export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

// Project type from Sanity
export interface Project {
  _id: string
  _type: 'project'
  _createdAt: string
  _updatedAt: string
  title: string
  slug: {
    current: string
    _type: 'slug'
  }
  description?: string
  role?: string
  outcomes?: PortableTextBlock[]
  timeline?: string
  mainImage?: SanityImage
  gallery?: SanityImage[]
  tags?: string[]
  projectUrl?: string
  featured?: boolean
  order?: number
}

// Simplified project for listing pages
export interface ProjectListItem {
  _id: string
  title: string
  slug: string
  description?: string
  role?: string
  timeline?: string
  mainImage?: {
    url: string
    alt: string
  }
  gallery?: Array<{
    url: string
    alt: string
  }>
  tags?: string[]
  featured?: boolean
  projectUrl?: string
}

// Full project with optimized image URLs
export interface ProjectWithImages extends Omit<Project, 'mainImage' | 'gallery'> {
  mainImage?: {
    url: string
    alt: string
    caption?: string
  }
  gallery?: Array<{
    url: string
    alt: string
    caption?: string
  }>
}

