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
  
  const dataStudioId = 'e0a86cbb-cd68-4822-b7ce-282251196164'
  
  await updateSingleDocument(dataStudioId, {
    metrics: [
      { _key: 'm1', _type: 'object', label: '0-1', value: 'New product area buildout' },
      { _key: 'm2', _type: 'object', label: '3', value: 'Iteration chunks' },
      { _key: 'm3', _type: 'object', label: 'AI', value: 'LLM-powered data manipulation' },
      { _key: 'm4', _type: 'object', label: 'Live', value: 'Custom data on your real production app' }
    ]
  })
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

