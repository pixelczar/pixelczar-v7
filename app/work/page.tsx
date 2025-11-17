import { getProjectsList } from '@/lib/sanity-queries'
import { buildImageUrl } from '@/lib/sanity'
import { experienceData } from '@/lib/data'
import WorkPageClient from '@/components/work-page-client'
import type { ProjectListItem } from '@/types/sanity'

export const revalidate = 60 // Revalidate every 60 seconds

export const metadata = {
  title: 'Building Ideas | Pixelczar',
  description: 'Portfolio projects and professional experience',
}

export default async function WorkPage() {
  const projects = await getProjectsList()

  // Transform projects to include optimized image URLs
  const projectsWithImages: ProjectListItem[] = projects.map((project) => {
    const imageUrl = project.mainImage ? buildImageUrl(project.mainImage, 800, 600) : null
    const galleryUrls = project.gallery?.map((img) => ({
      url: buildImageUrl(img, 800, 600),
      alt: img.alt || project.title,
    }))
    
    return {
      ...project,
      mainImage: imageUrl
        ? {
            url: imageUrl,
            alt: project.mainImage?.alt || project.title,
          }
        : undefined,
      gallery: galleryUrls,
    }
  })

  return <WorkPageClient projects={projectsWithImages} experienceData={experienceData} />
}
