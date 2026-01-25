import { createClient } from '@sanity/client'

const client = createClient({
    projectId: 'mdtvl7tb',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
})

const fathom = {
    _type: 'project',
    title: 'Fathom',
    slug: { _type: 'slug', current: 'fathom' },
    description: 'A Chrome extension that replaces the default scrollbar in Claude and ChatGPT with a rich timeline visualization. Navigate long AI conversations with minimap-style markers showing previous prompts, attachments, and letting you jump directly to past exchanges.',
    role: 'Product Designer & Developer',
    timeline: '2025',
    tags: ['Chrome Extension', 'React', 'TypeScript', 'AI/UX', 'Claude', 'ChatGPT'],
    projectUrl: 'https://www.linkedin.com/pulse/ai-chats-missing-minimap-will-smith-3sfae/',
    featured: true,
    order: 0,
    outcomes: [
        {
            _type: 'block',
            _key: 'fathom-outcome-1',
            style: 'normal',
            children: [
                {
                    _type: 'span',
                    _key: 'fathom-span-1',
                    text: 'Built from a real friction point I kept hitting: losing valuable AI responses in endless scroll. The pattern exists in IDEs (Cursor, VS Code minimaps), photo apps, and canvas tools—but chat interfaces somehow missed it.',
                    marks: []
                }
            ]
        },
        {
            _type: 'block',
            _key: 'fathom-outcome-2',
            style: 'normal',
            children: [
                {
                    _type: 'span',
                    _key: 'fathom-span-2',
                    text: 'The challenge was injecting UI into apps I don\'t control—content script injection, DOM observation, and maintaining position sync across dynamic content loads. Minimal, native-feeling design that doesn\'t fight the host interface.',
                    marks: []
                }
            ]
        }
    ]
}

async function addFathom() {
    console.log('Adding Fathom to Sanity...')
    console.log('Project ID:', client.config().projectId)
    console.log('Dataset:', client.config().dataset)

    try {
        // First check if Fathom already exists
        const existing = await client.fetch('*[_type == "project" && slug.current == "fathom"][0]')

        if (existing) {
            console.log('⚠️  Fathom already exists with ID:', existing._id)
            console.log('   If you want to update it, delete it first or use a patch.')
            return
        }

        const result = await client.create(fathom)
        console.log(`✓ Added: Fathom (${result._id})`)
        console.log('\nDone! Go to localhost:3000/studio to add images.')
    } catch (error) {
        console.error(`✗ Error adding Fathom:`, error.message)
    }
}

addFathom()
