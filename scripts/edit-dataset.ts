/**
 * Script to programmatically edit your Sanity dataset
 * 
 * Usage:
 *   npx tsx scripts/edit-dataset.ts
 *   or
 *   ts-node scripts/edit-dataset.ts
 * 
 * Make sure SANITY_API_TOKEN is set in your environment
 */

import { createClient } from '@sanity/client'
import { projectId, dataset } from '../sanity/env'

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

/**
 * Example: Update a single document by ID
 */
export async function updateSingleDocument(documentId: string, updates: Record<string, any>) {
  try {
    const result = await client
      .patch(documentId)
      .set(updates)
      .commit()
    
    console.log('✓ Updated document:', result._id)
    return result
  } catch (error: any) {
    console.error('✗ Error updating document:', error.message)
    throw error
  }
}

/**
 * Example: Update multiple documents matching a query
 */
export async function updateMultipleDocuments(
  query: string,
  updates: Record<string, any>
) {
  try {
    // First, fetch all documents matching your criteria
    const documents = await client.fetch(query)
    
    console.log(`Found ${documents.length} documents to update`)
    
    // Update each document
    const results = []
    for (const doc of documents) {
      const result = await client
        .patch(doc._id)
        .set(updates)
        .commit()
      
      console.log(`✓ Updated: ${doc.title || doc._id}`)
      results.push(result)
    }
    
    return results
  } catch (error: any) {
    console.error('✗ Error updating documents:', error.message)
    throw error
  }
}

/**
 * Example: Create a new document
 */
export async function createDocument(document: Record<string, any>) {
  try {
    const result = await client.create(document)
    console.log('✓ Created document:', result._id)
    return result
  } catch (error: any) {
    console.error('✗ Error creating document:', error.message)
    throw error
  }
}

/**
 * Example: Delete a document
 */
export async function deleteDocument(documentId: string) {
  try {
    await client.delete(documentId)
    console.log('✓ Deleted document:', documentId)
  } catch (error: any) {
    console.error('✗ Error deleting document:', error.message)
    throw error
  }
}

/**
 * Example: Query documents
 */
export async function queryDocuments(groqQuery: string) {
  try {
    const results = await client.fetch(groqQuery)
    console.log(`\nFound ${results.length} documents\n`)
    return results
  } catch (error: any) {
    console.error('✗ Error querying documents:', error.message)
    throw error
  }
}

// Example usage
async function main() {
  console.log('Sanity Dataset Editor\n')
  
  // Example 1: Query all projects
  // const projects = await queryDocuments(
  //   `*[_type == "project"] | order(order asc) {
  //     _id,
  //     title,
  //     timeline,
  //     tags
  //   }`
  // )
  // console.log(projects)
  
  // Example 2: Update all projects with timeline "2024" to "2025"
  // await updateMultipleDocuments(
  //   `*[_type == "project" && timeline == "2024"]{_id, title}`,
  //   { timeline: '2025' }
  // )
  
  // Example 3: Update a single document
  // await updateSingleDocument('document-id-here', {
  //   timeline: '2025',
  //   description: 'Updated description'
  // })
  
  // Example 4: Create a new project
  // await createDocument({
  //   _type: 'project',
  //   title: 'New Project',
  //   slug: { _type: 'slug', current: 'new-project' },
  //   description: 'Project description',
  //   timeline: '2025',
  // })
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

