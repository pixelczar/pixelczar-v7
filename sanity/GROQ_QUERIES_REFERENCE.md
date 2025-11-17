# GROQ Query Reference for Portfolio Projects

Quick reference for common GROQ queries you can use with your Sanity CMS portfolio.

## Basic Queries

### Get All Projects

```groq
*[_type == "project"]
```

### Get All Projects with Specific Fields

```groq
*[_type == "project"] {
  title,
  slug,
  description,
  mainImage
}
```

### Get Projects Sorted by Order

```groq
*[_type == "project"] | order(order asc)
```

## Filtering

### Get Featured Projects Only

```groq
*[_type == "project" && featured == true]
```

### Get Projects by Tag

```groq
*[_type == "project" && "Design System" in tags]
```

### Get Projects by Multiple Tags (OR)

```groq
*[_type == "project" && ("UI Design" in tags || "UX Research" in tags)]
```

### Get Projects by Multiple Tags (AND)

```groq
*[_type == "project" && "UI Design" in tags && "Mobile" in tags]
```

### Get Recent Projects

```groq
*[_type == "project"] | order(_createdAt desc)[0...5]
```

## Pagination

### Get First 10 Projects

```groq
*[_type == "project"][0...10]
```

### Get Next 10 Projects (offset)

```groq
*[_type == "project"][10...20]
```

### Pagination with Variables

```groq
*[_type == "project"][$start...$end]
```

## Single Document

### Get Project by Slug

```groq
*[_type == "project" && slug.current == "my-project-slug"][0]
```

### Get Project by ID

```groq
*[_id == "project-id-here"][0]
```

## Image Handling

### Get Project with Image Asset Reference

```groq
*[_type == "project"] {
  title,
  mainImage {
    asset->{
      _id,
      url
    },
    alt,
    hotspot
  }
}
```

### Get Project with Gallery

```groq
*[_type == "project"][0] {
  title,
  gallery[] {
    asset->{
      _id,
      url
    },
    alt,
    caption
  }
}
```

## Advanced Queries

### Get Projects with Count

```groq
{
  "projects": *[_type == "project"],
  "total": count(*[_type == "project"])
}
```

### Get Featured Projects and Regular Projects Separately

```groq
{
  "featured": *[_type == "project" && featured == true] | order(order asc),
  "regular": *[_type == "project" && featured != true] | order(order asc)
}
```

### Get Projects Grouped by Tag

```groq
{
  "tags": array::unique(*[_type == "project"].tags[]),
  "projects": *[_type == "project"]
}
```

### Search Projects by Title or Description

```groq
*[_type == "project" && (
  title match "*search term*" ||
  description match "*search term*"
)]
```

### Get Projects with Conditional Fields

```groq
*[_type == "project"] {
  title,
  slug,
  "hasGallery": defined(gallery),
  "imageCount": count(gallery),
  "tagCount": count(tags)
}
```

## Sorting

### Sort by Multiple Fields

```groq
*[_type == "project"] | order(featured desc, order asc, title asc)
```

### Sort by Date Created

```groq
*[_type == "project"] | order(_createdAt desc)
```

### Sort by Date Updated

```groq
*[_type == "project"] | order(_updatedAt desc)
```

## Projections (Field Transformations)

### Rename Fields

```groq
*[_type == "project"] {
  "id": _id,
  "name": title,
  "projectSlug": slug.current
}
```

### Add Computed Fields

```groq
*[_type == "project"] {
  title,
  "tagCount": count(tags),
  "hasImages": defined(mainImage) || count(gallery) > 0,
  "url": "/work/" + slug.current
}
```

### Flatten Slug Object

```groq
*[_type == "project"] {
  title,
  "slug": slug.current
}
```

## Filtering with Arrays

### Projects with Any Tags

```groq
*[_type == "project" && count(tags) > 0]
```

### Projects with Specific Number of Tags

```groq
*[_type == "project" && count(tags) >= 3]
```

### Projects with Gallery Images

```groq
*[_type == "project" && count(gallery) > 0]
```

## Date Filtering

### Projects Created After a Date

```groq
*[_type == "project" && _createdAt > "2024-01-01T00:00:00Z"]
```

### Projects Updated in the Last 30 Days

```groq
*[_type == "project" && _updatedAt > now() - 60*60*24*30]
```

## Using with TypeScript

### In Server Components

```typescript
import { client } from '@/lib/sanity'

export default async function MyPage() {
  const projects = await client.fetch(
    `*[_type == "project"] | order(order asc) {
      title,
      "slug": slug.current,
      mainImage
    }`
  )
  
  return <div>{/* render projects */}</div>
}
```

### With Parameters

```typescript
import { client } from '@/lib/sanity'

const query = `*[_type == "project" && $tag in tags] | order(order asc)`
const params = { tag: 'UI Design' }

const projects = await client.fetch(query, params)
```

### With Dynamic Parameters

```typescript
const getProjectsByFilters = async (filters: {
  featured?: boolean
  tags?: string[]
  limit?: number
}) => {
  let query = '*[_type == "project"'
  
  if (filters.featured !== undefined) {
    query += ` && featured == ${filters.featured}`
  }
  
  if (filters.tags && filters.tags.length > 0) {
    const tagConditions = filters.tags
      .map(tag => `"${tag}" in tags`)
      .join(' || ')
    query += ` && (${tagConditions})`
  }
  
  query += '] | order(order asc)'
  
  if (filters.limit) {
    query += `[0...${filters.limit}]`
  }
  
  return client.fetch(query)
}
```

## Useful Functions

| Function | Description | Example |
|----------|-------------|---------|
| `count()` | Count items | `count(tags)` |
| `defined()` | Check if field exists | `defined(mainImage)` |
| `match()` | Text search | `title match "*design*"` |
| `now()` | Current timestamp | `_createdAt > now()` |
| `array::unique()` | Get unique array values | `array::unique(tags)` |
| `lower()` | Convert to lowercase | `lower(title)` |
| `upper()` | Convert to uppercase | `upper(title)` |

## Tips

1. **Use projections** to limit data transfer - only fetch what you need
2. **Index frequently queried fields** for better performance
3. **Use parameters** (`$param`) instead of string interpolation for security
4. **Test queries** in the Vision plugin at `/studio`
5. **Fetch only what you display** - separate queries for lists vs. detail pages

## Testing Queries

Visit `http://localhost:3000/studio` and click on "Vision" in the toolbar to test queries in real-time.

## Additional Resources

- [GROQ Official Documentation](https://www.sanity.io/docs/groq)
- [GROQ Cheat Sheet](https://www.sanity.io/docs/query-cheat-sheet)
- [Vision Plugin](https://www.sanity.io/docs/the-vision-plugin)

