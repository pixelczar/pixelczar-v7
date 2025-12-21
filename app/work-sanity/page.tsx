import { getProjectsList } from '@/lib/sanity-queries'
import { buildImageUrl } from '@/lib/sanity'
import ProjectCard from '@/components/project-card'
import RecentProjectCard from '@/components/recent-project-card'
import type { ProjectListItem } from '@/types/sanity'

export const revalidate = 60 // Revalidate every 60 seconds

export const metadata = {
  title: 'Work | Pixelczar',
  description: 'Portfolio projects and case studies',
}

export default async function WorkPage() {
  const projects = await getProjectsList()

  // Transform projects to include optimized image URLs
  const projectsWithImages: ProjectListItem[] = projects.map((project) => {
    const imageUrl = project.mainImage ? buildImageUrl(project.mainImage, 800, 600) : null
    
    return {
      ...project,
      mainImage: imageUrl
        ? {
            url: imageUrl,
            alt: project.mainImage?.alt || project.title,
          }
        : undefined,
    }
  })

  return (
    <div className="bg-background text-foreground theme-transition relative overflow-hidden">
      <main className="px-6 py-12 relative">
        {/* Header Content */}
        <div className="max-w-4xl mx-auto mb-20">
          <h1 className="heading-display mb-8 text-center">
            <span className="lust-aalt">B</span>ui<span className="lust-swsh">l</span>din<span className="lust-swsh">g</span> <span className="lust-aalt">I</span>dea<span className="lust-swsh">s</span>
          </h1>

          {/* Separator Line */}
          <div className="w-full h-px bg-accent/40 mx-auto mt-16 mb-6 theme-transition" />

          <h2 className="font-normal text-2xl mb-12 font-sans">From Concept to Product</h2>

          <div className="mb-16">
            <p className="text-body-main font-sans">
              I have been the principal Product Designer at high-growth venture-backed
              startups for the past 15 years or so. My experience encompasses shaping
              the visual design, UI, and data visualization of a B2B SaaS app. I'm a
              sucker for the well-executed basics of a clean layout, vibrant color
              palette, and ample white space around the typography.
            </p>
          </div>
        </div>

        {/* Recent Projects Section */}
        {projectsWithImages.length > 0 && (
          <div className="max-w-7xl mx-auto mb-24">
            <h2 className="text-3xl font-normal mb-12 font-sans">Recent Projects</h2>
            <div>
              {projectsWithImages.slice(0, 6).map((project, index) => (
                <RecentProjectCard key={project._id} project={project} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto">
          {projectsWithImages.length === 0 ? (
            <div className="text-center py-20 font-sans">
              <p className="text-muted-foreground text-lg mb-4">
                No projects found. Add your first project in the Sanity Studio.
              </p>
              <a
                href="/studio"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Sanity Studio →
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projectsWithImages.map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

