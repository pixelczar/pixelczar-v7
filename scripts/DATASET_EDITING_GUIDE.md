# Editing Your Sanity Dataset Programmatically

There are several ways to edit your Sanity dataset using code instead of the GUI:

## 1. Using Scripts (Recommended for Bulk Edits)

Use the `scripts/edit-dataset.ts` file to programmatically edit your dataset.

### Setup

Make sure you have `SANITY_API_TOKEN` set in your `.env.local` file:
```bash
SANITY_API_TOKEN=your_token_here
```

Get your token from: https://sanity.io/manage

### Running Scripts

```bash
# Using tsx (recommended)
npx tsx scripts/edit-dataset.ts

# Or using ts-node
npx ts-node scripts/edit-dataset.ts
```

### Examples

**Query all projects:**
```typescript
const projects = await queryDocuments(
  `*[_type == "project"] | order(order asc) {
    _id,
    title,
    timeline,
    tags
  }`
)
```

**Update multiple documents:**
```typescript
await updateMultipleDocuments(
  `*[_type == "project" && timeline == "2024"]{_id, title}`,
  { timeline: '2025' }
)
```

**Update a single document:**
```typescript
await updateSingleDocument('document-id-here', {
  timeline: '2025',
  description: 'Updated description'
})
```

**Create a new document:**
```typescript
await createDocument({
  _type: 'project',
  title: 'New Project',
  slug: { _type: 'slug', current: 'new-project' },
  description: 'Project description',
  timeline: '2025',
})
```

## 2. Using Sanity CLI (Import/Export)

### Export your dataset:
```bash
npx sanity dataset export production backup.tar.gz
```

### Import data:
```bash
npx sanity dataset import backup.tar.gz production
```

### Import from JSON:
```bash
npx sanity dataset import data.json production
```

## 3. Using GROQ in Vision Tool (Studio GUI)

1. Go to `/studio` in your browser
2. Click on "Vision" in the toolbar
3. Write GROQ queries to view/edit data

**Example queries:**

View all projects:
```groq
*[_type == "project"] | order(order asc) {
  _id,
  title,
  timeline,
  description
}
```

Find projects by tag:
```groq
*[_type == "project" && "React" in tags] {
  title,
  tags
}
```

## 4. Using Sanity API Directly

You can also use the Sanity API directly in your application code:

```typescript
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'your-project-id',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Patch (update) a document
await client
  .patch('document-id')
  .set({ field: 'value' })
  .commit()

// Create a document
await client.create({
  _type: 'project',
  title: 'New Project',
  // ... other fields
})

// Delete a document
await client.delete('document-id')

// Query documents
const projects = await client.fetch(`*[_type == "project"]`)
```

## 5. Using Sanity MCP (Model Context Protocol)

If you're using Cursor with Sanity MCP, you can use the MCP tools directly:
- `mcp_Sanity_patch_document` - Update specific fields
- `mcp_Sanity_update_document` - AI-powered updates
- `mcp_Sanity_create_document` - Create new documents
- `mcp_Sanity_query_documents` - Query with GROQ

## Best Practices

1. **Always test queries first** - Use `queryDocuments()` to see what will be affected
2. **Backup before bulk edits** - Export your dataset before making large changes
3. **Use transactions** - For multiple related updates, use transactions
4. **Handle errors** - Always wrap operations in try/catch blocks
5. **Use drafts** - Create drafts first, then publish when ready

## Common Operations

### Update all projects' timeline:
```typescript
await updateMultipleDocuments(
  `*[_type == "project"]{_id, title}`,
  { timeline: '2025' }
)
```

### Add a tag to all projects:
```typescript
const projects = await queryDocuments(`*[_type == "project"]{_id, tags}`)
for (const project of projects) {
  const newTags = [...(project.tags || []), 'New Tag']
  await updateSingleDocument(project._id, { tags: newTags })
}
```

### Remove a field from all documents:
```typescript
await updateMultipleDocuments(
  `*[_type == "project"]{_id}`,
  { oldField: null }
)
```

