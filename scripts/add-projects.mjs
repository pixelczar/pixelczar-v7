import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'mdtvl7tb',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const projects = [
  {
    _type: 'project',
    title: 'Atlas',
    slug: { _type: 'slug', current: 'atlas' },
    description: 'A visual sitemap tool that transforms website architecture into navigable spatial maps. Built with React and D3, Atlas helps teams understand complex site structures at a glance, turning hierarchical data into intuitive visual exploration.',
    role: 'Product Designer & Developer',
    timeline: '2024',
    tags: ['React', 'React Flow', 'Next.js', 'TypeScript', 'Firebase'],
    featured: false,
    order: 1,
    outcomes: [
      {
        _type: 'block',
        _key: 'atlas-outcome',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'atlas-span',
            text: 'I wanted to push my experience working with React Flow\'s node-based diagrams and showing a page within a page—creating that iframe preview experience where you can actually see the live site nested within the map visualization.',
            marks: []
          }
        ]
      }
    ]
  },
  {
    _type: 'project',
    title: 'Tracer',
    slug: { _type: 'slug', current: 'tracer' },
    description: 'A Chrome extension that extracts design systems from any website in real-time. Tracer automatically catalogs typography, color palettes, spacing systems, and component patterns, generating comprehensive style guides from live production sites.',
    role: 'Product Designer & Developer',
    timeline: '2024',
    tags: ['Chrome Extension', 'React', 'TypeScript', 'CSS Parser', 'DevTools Protocol', 'Supabase'],
    featured: false,
    order: 2,
    outcomes: [
      {
        _type: 'block',
        _key: 'tracer-outcome',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'tracer-span',
            text: 'Building a custom DevTools panel was the unlock here—being able to inspect computed styles and actually extract the design tokens felt like reverse-engineering magic. The challenge was filtering signal from noise in production CSS.',
            marks: []
          }
        ]
      }
    ]
  },
  {
    _type: 'project',
    title: 'Tangle Map',
    slug: { _type: 'slug', current: 'tangle-map' },
    description: 'Generative art exploring the aesthetics of urban planning and architectural drawing. Seven procedural layers—grids, infrastructure, nodes, and organic flows—combine to visualize the beautiful complexity of problem-solving processes.',
    role: 'Designer & Creative Coder',
    timeline: '2024',
    tags: ['React', 'Canvas 2D', 'Generative Art', 'Procedural Design', 'Tailwind CSS'],
    featured: false,
    order: 3,
    outcomes: [
      {
        _type: 'block',
        _key: 'tangle-outcome',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'tangle-span',
            text: 'Built a custom layer rendering system from scratch using native Canvas 2D—no paper.js or d3.js. Each layer extends BaseLayer and implements its own render() method. The drag-and-drop layer reordering and 3D transformations are all done without WebGL, keeping it lightweight and direct.',
            marks: []
          }
        ]
      }
    ]
  },
  {
    _type: 'project',
    title: 'Kitchen Sync',
    slug: { _type: 'slug', current: 'kitchen-sync' },
    description: 'A collaborative kitchen management app that helps families coordinate meal planning, grocery shopping, and recipe sharing.',
    role: 'Product Designer & Developer',
    timeline: '2024',
    tags: ['React', 'Firebase', 'Recipe Management'],
    featured: false,
    order: 4,
  },
  {
    _type: 'project',
    title: 'Board',
    slug: { _type: 'slug', current: 'board' },
    description: 'A web-based split-flap display that captures the nostalgic mechanical charm of vintage airport terminals. Built with CSS animations and careful attention to the satisfying physics of analog letter-flipping, proving that sometimes the medium is the message.',
    role: 'Designer & Developer',
    timeline: '2024',
    tags: ['React', 'CSS Animations', 'TypeScript', 'Framer Motion', 'Supabase'],
    featured: false,
    order: 5,
    outcomes: [
      {
        _type: 'block',
        _key: 'board-outcome',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'board-span',
            text: 'Getting the flip animation to feel mechanical was all about the timing curves—too smooth and it feels digital, too rigid and it loses charm. I studied videos of real Solari boards to nail that satisfying *clack* moment.',
            marks: []
          }
        ]
      }
    ]
  },
  {
    _type: 'project',
    title: 'Basic Sorcery',
    slug: { _type: 'slug', current: 'basic-sorcery' },
    description: 'Typography and design experiments exploring the intersection of traditional letterforms and modern web capabilities.',
    role: 'Designer & Typographer',
    timeline: '2024',
    tags: ['Typography', 'Web Design', 'CSS', 'Design Experiments'],
    featured: false,
    order: 6,
  }
]

async function addProjects() {
  console.log('Adding projects to Sanity...')
  console.log('Project ID:', client.config().projectId)
  console.log('Dataset:', client.config().dataset)
  
  for (const project of projects) {
    try {
      const result = await client.create(project)
      console.log(`✓ Added: ${project.title} (${result._id})`)
    } catch (error) {
      console.error(`✗ Error adding ${project.title}:`, error.message)
    }
  }
  
  console.log('\nDone! Go to localhost:3000/studio to add images.')
}

addProjects()

