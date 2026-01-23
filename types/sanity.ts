import type { PortableTextBlock } from '@portabletext/types'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Sanity Image with metadata
export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
    url?: string
    metadata?: {
      dimensions: {
        width: number
        height: number
        aspectRatio: number
      }
    }
  }
  alt?: string
  caption?: string
  isHidden?: boolean
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

// Project type from Sanity (for Play page - recent projects)
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
  mainMediaType?: 'image' | 'video'
  mainImage?: SanityImage
  mainVideo?: {
    asset: {
      _ref: string
      url?: string
    }
  }
  mainVideoUrl?: string
  gallery?: SanityImage[]
  tags?: string[]
  projectUrl?: string
  featured?: boolean
  order?: number
}

// Showcase type from Sanity (for Work page - professional work)
export interface CaseStudy {
  _id: string
  _type: 'caseStudy'
  _createdAt: string
  _updatedAt: string
  title: string
          slug: {
            current: string
            _type: 'slug'
          }
          oneLiner?: string
          company?: string
  metrics?: Array<{
    label: string
    value: string
  }>
  mainMediaType?: 'image' | 'video'
  
  mainVideo?: {
    asset: {
      _ref: string
      url?: string
    }
  }
  mainVideoUrl?: string
  mainImage?: SanityImage & {
    dimensions?: {
      width: number
      height: number
      aspectRatio: number
    }
  }
  tags?: string[]
  shortDescription?: string
  description?: string
  role?: string
  content?: PortableTextBlock[]
  outcomes?: PortableTextBlock[]
  timeline?: string 
  gallery?: SanityImage[]
  projectUrl?: string
  featured?: boolean
  order?: number
}

// Gallery Item type from Sanity
export interface GalleryItem {
  _id: string
  _type: 'galleryItem'
  title?: string
  type: 'image' | 'video'
  size: 'large' | 'medium' | 'small'
  image?: SanityImage
  video?: {
    asset: {
      _ref: string
      url?: string
    }
  }
  videoUrl?: string
  caption?: string
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
  mainMediaType?: 'image' | 'video'
  mainImage?: {
    url: string
    alt: string
    isHidden?: boolean
  }
  mainVideo?: {
    url: string
  }
  mainVideoUrl?: string
  gallery?: Array<{
    url: string
    alt: string
    isHidden?: boolean
  }>
  tags?: string[]
  featured?: boolean
  projectUrl?: string
}

// Simplified case study for listing pages
export interface CaseStudyListItem {
  _id: string
  title: string
  slug: string
  oneLiner?: string
  company?: string
  shortDescription?: string
  description?: string
  role?: string
  timeline?: string
  mainMediaType?: 'image' | 'video'
  mainImage?: {
    url: string
    alt: string
    caption?: string
    isHidden?: boolean
  }
  mainVideo?: {
    url: string
  }
  mainVideoUrl?: string
  gallery?: Array<{
    url: string
    alt: string
    isHidden?: boolean
  }>
  tags?: string[]
  featured?: boolean
  projectUrl?: string
  isWip?: boolean
}

// Gallery item for client rendering
export interface GalleryItemClient {
  _id: string
  type: 'image' | 'video'
  size: 'large' | 'medium' | 'small'
  src: string
  alt: string
  caption?: string
  videoUrl?: string
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

