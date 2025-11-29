import { client } from './sanity'
import type { Project, ProjectListItem, CaseStudy, CaseStudyListItem, GalleryItem } from '@/types/sanity'

// Base project fields for listing (Play page - recent projects)
const PROJECT_LIST_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  description,
  role,
  timeline,
  mainImage {
    asset,
    alt,
    hotspot,
    crop
  },
  gallery[] {
    asset,
    alt,
    hotspot,
    crop
  },
  tags,
  featured,
  order,
  projectUrl
`

// Full project fields including gallery
const PROJECT_FULL_FIELDS = `
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  description,
  role,
  outcomes,
  timeline,
  mainImage {
    asset,
    alt,
    caption,
    hotspot,
    crop
  },
  gallery[] {
    asset,
    alt,
    caption,
    hotspot,
    crop
  },
  tags,
  projectUrl,
  featured,
  order
`

// Case Study fields for listing (Work page)
const CASE_STUDY_LIST_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  company,
  shortDescription,
  description,
  role,
  timeline,
  mainImage {
    asset,
    alt,
    hotspot,
    crop
  },
  gallery[] {
    asset,
    alt,
    hotspot,
    crop
  },
  tags,
  featured,
  order,
  projectUrl
`

// Full case study fields
const CASE_STUDY_FULL_FIELDS = `
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  company,
  shortDescription,
  description,
  role,
  content,
  outcomes,
  timeline,
  mainImage {
    asset,
    alt,
    caption,
    hotspot,
    crop
  },
  gallery[] {
    asset,
    alt,
    caption,
    hotspot,
    crop
  },
  tags,
  projectUrl,
  featured,
  order
`

// Gallery item fields
const GALLERY_ITEM_FIELDS = `
  _id,
  title,
  type,
  size,
  image {
    asset,
    alt
  },
  video {
    asset-> {
      _id,
      url
    }
  },
  videoUrl,
  caption,
  order
`

// Get all projects (sorted by orderRank for drag & drop ordering)
export async function getAllProjects(): Promise<Project[]> {
  return client.fetch(
    `*[_type == "project"] | order(orderRank asc) {
      ${PROJECT_FULL_FIELDS}
    }`
  )
}

// Get featured projects
export async function getFeaturedProjects(): Promise<Project[]> {
  return client.fetch(
    `*[_type == "project" && featured == true] | order(orderRank asc) {
      ${PROJECT_FULL_FIELDS}
    }`
  )
}

// Get projects for listing (lighter data, no gallery)
export async function getProjectsList(): Promise<ProjectListItem[]> {
  return client.fetch(
    `*[_type == "project"] | order(orderRank asc) {
      ${PROJECT_LIST_FIELDS}
    }`
  )
}

// Get single project by slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug][0] {
      ${PROJECT_FULL_FIELDS}
    }`,
    { slug }
  )
}

// Get projects by tag
export async function getProjectsByTag(tag: string): Promise<Project[]> {
  return client.fetch(
    `*[_type == "project" && $tag in tags] | order(orderRank asc) {
      ${PROJECT_FULL_FIELDS}
    }`,
    { tag }
  )
}

// Get all unique tags
export async function getAllTags(): Promise<string[]> {
  return client.fetch(
    `array::unique(*[_type == "project"].tags[])`
  )
}

// Flexible query with optional fields
export async function getProjects(options?: {
  fields?: string[]
  featured?: boolean
  limit?: number
  offset?: number
  tags?: string[]
}): Promise<any[]> {
  const {
    fields = [],
    featured,
    limit,
    offset = 0,
    tags
  } = options || {}

  // Build filter conditions
  const conditions = ['_type == "project"']
  if (featured !== undefined) {
    conditions.push(`featured == ${featured}`)
  }
  if (tags && tags.length > 0) {
    const tagConditions = tags.map(tag => `"${tag}" in tags`).join(' || ')
    conditions.push(`(${tagConditions})`)
  }

  const filter = conditions.join(' && ')

  // Build field selection
  const fieldSelection = fields.length > 0
    ? fields.join(',\n  ')
    : PROJECT_FULL_FIELDS

  // Build pagination
  const pagination = limit
    ? `[${offset}...${offset + limit}]`
    : ''

  const query = `*[${filter}]${pagination} | order(orderRank asc) {
    ${fieldSelection}
  }`

  return client.fetch(query)
}

// ============================================
// CASE STUDIES (Work page - professional work)
// ============================================

// Get all case studies
export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  return client.fetch(
    `*[_type == "caseStudy"] | order(orderRank asc) {
      ${CASE_STUDY_FULL_FIELDS}
    }`
  )
}

// Get case studies for listing
export async function getCaseStudiesList(): Promise<CaseStudyListItem[]> {
  return client.fetch(
    `*[_type == "caseStudy"] | order(orderRank asc) {
      ${CASE_STUDY_LIST_FIELDS}
    }`
  )
}

// Get single case study by slug
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  return client.fetch(
    `*[_type == "caseStudy" && slug.current == $slug][0] {
      ${CASE_STUDY_FULL_FIELDS}
    }`,
    { slug }
  )
}

// Get featured case studies
export async function getFeaturedCaseStudies(): Promise<CaseStudy[]> {
  return client.fetch(
    `*[_type == "caseStudy" && featured == true] | order(orderRank asc) {
      ${CASE_STUDY_FULL_FIELDS}
    }`
  )
}

// ============================================
// GALLERY ITEMS (Play page gallery)
// ============================================

// Get all gallery items
export async function getGalleryItems(): Promise<GalleryItem[]> {
  return client.fetch(
    `*[_type == "galleryItem"] | order(orderRank asc) {
      ${GALLERY_ITEM_FIELDS}
    }`
  )
}

