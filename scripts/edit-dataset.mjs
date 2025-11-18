/**
 * Script to programmatically edit your Sanity dataset
 * 
 * Usage examples:
 *   node scripts/edit-dataset.mjs
 * 
 * Make sure SANITY_API_TOKEN is set in your .env file
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env.local') })

const client = createClient({
  projectId: 'mdtvl7tb',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

/**
 * Example: Update a single document
 */
async function updateSingleDocument() {
  const documentId = 'your-document-id-here'
  
  try {
    const result = await client
      .patch(documentId)
      .set({ 
        timeline: '2025',
        // Add other fields you want to update
      })
      .commit()
    
    console.log('✓ Updated document:', result._id)
  } catch (error) {
    console.error('✗ Error updating document:', error.message)
  }
}

/**
 * Example: Update multiple documents matching a query
 */
async function updateMultipleDocuments() {
  try {
    // First, fetch all documents matching your criteria
    const documents = await client.fetch(
      `*[_type == "project" && timeline == "2024"]{_id, title}`
    )
    
    console.log(`Found ${documents.length} documents to update`)
    
    // Update each document
    for (const doc of documents) {
      await client
        .patch(doc._id)
        .set({ timeline: '2025' })
        .commit()
      
      console.log(`✓ Updated: ${doc.title}`)
    }
  } catch (error) {
    console.error('✗ Error updating documents:', error.message)
  }
}

/**
 * Example: Create a new document
 */
async function createDocument() {
  try {
    const result = await client.create({
      _type: 'project',
      title: 'New Project',
      slug: { _type: 'slug', current: 'new-project' },
      description: 'Project description here',
      timeline: '2025',
      // Add other fields as needed
    })
    
    console.log('✓ Created document:', result._id)
  } catch (error) {
    console.error('✗ Error creating document:', error.message)
  }
}

/**
 * Example: Delete a document
 */
async function deleteDocument(documentId) {
  try {
    await client.delete(documentId)
    console.log('✓ Deleted document:', documentId)
  } catch (error) {
    console.error('✗ Error deleting document:', error.message)
  }
}

/**
 * Example: Query and display documents
 */
async function queryDocuments() {
  try {
    const projects = await client.fetch(
      `*[_type == "project"] | order(order asc) {
        _id,
        title,
        timeline,
        description,
        tags
      }`
    )
    
    console.log(`\nFound ${projects.length} projects:\n`)
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (${project.timeline})`)
      console.log(`   ID: ${project._id}`)
      if (project.tags) {
        console.log(`   Tags: ${project.tags.join(', ')}`)
      }
      console.log('')
    })
  } catch (error) {
    console.error('✗ Error querying documents:', error.message)
  }
}

// Run the script
async function main() {
  console.log('Sanity Dataset Editor\n')
  console.log('Available functions:')
  console.log('  - updateSingleDocument()')
  console.log('  - updateMultipleDocuments()')
  console.log('  - createDocument()')
  console.log('  - deleteDocument(id)')
  console.log('  - queryDocuments()\n')
  
  // Uncomment the function you want to run:
  
  // await queryDocuments()
  // await updateMultipleDocuments()
  // await updateSingleDocument()
  // await createDocument()
  // await deleteDocument('document-id-here')
}

main().catch(console.error)

