import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'mdtvl7tb',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function removeTracerLink() {
  console.log('Finding Tracer project...')
  
  // Find the Tracer project
  const tracer = await client.fetch(`*[_type == "project" && slug.current == "tracer"][0]{_id, title, projectUrl}`)
  
  if (!tracer) {
    console.log('Tracer project not found')
    return
  }
  
  console.log(`Found: ${tracer.title} (${tracer._id})`)
  
  if (tracer.projectUrl) {
    console.log(`Current projectUrl: ${tracer.projectUrl}`)
    console.log('Removing projectUrl...')
    
    await client
      .patch(tracer._id)
      .unset(['projectUrl'])
      .commit()
    
    console.log('✓ projectUrl removed from Tracer')
  } else {
    console.log('Tracer already has no projectUrl')
  }
}

removeTracerLink()

