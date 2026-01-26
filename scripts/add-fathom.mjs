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
    description: 'A Chrome extension that adds spatial navigation to AI chat interfaces. Replaces the default scrollbar with a minimal "depth gauge" showing conversation landmarks — code blocks, artifacts, images — with progressive disclosure and ghost preview tooltips. Works on Claude and ChatGPT.',
    role: 'Designer & Developer',
    timeline: '2025',
    tags: ['Chrome Extension', 'AI', 'UX Design', 'Product Design', 'Interaction Design', 'Progressive Disclosure'],
    // projectUrl: pending Chrome Web Store link
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
                    text: 'Identified a missing navigation pattern across all major AI chat interfaces',
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
                    text: 'Built and shipped a working extension for Claude and ChatGPT',
                    marks: []
                }
            ]
        },
        {
            _type: 'block',
            _key: 'fathom-outcome-3',
            style: 'normal',
            children: [
                {
                    _type: 'span',
                    _key: 'fathom-span-3',
                    text: 'Published article on the design rationale that gained traction on LinkedIn',
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
            console.log('Fathom already exists with ID:', existing._id)
            console.log('Updating with new details...')
            const { _type, ...updateFields } = fathom
            const result = await client.patch(existing._id).set(updateFields).commit()
            console.log(`✓ Updated: Fathom (${result._id})`)
            console.log('\nDone! Go to localhost:3000/studio to add images.')
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
