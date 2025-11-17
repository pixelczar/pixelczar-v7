# Sanity CMS Setup Guide for Pixelczar Portfolio

This guide will walk you through completing the Sanity CMS setup for your Next.js portfolio website.

## 📦 What's Been Set Up

All the necessary files and configurations have been created:

- ✅ Sanity packages added to `package.json`
- ✅ Project schema with image gallery support (`sanity/schemas/project.ts`)
- ✅ Sanity Studio configuration (`sanity.config.ts`, `sanity.cli.ts`)
- ✅ Sanity client and helper functions (`lib/sanity.ts`)
- ✅ GROQ query helpers (`lib/sanity-queries.ts`)
- ✅ TypeScript types (`types/sanity.ts`)
- ✅ Project card component (`components/project-card.tsx`)
- ✅ Work page with Sanity integration (`app/work-sanity/page.tsx`)
- ✅ Individual project detail page (`app/work/[slug]/page.tsx`)
- ✅ Studio route (`app/studio/[[...index]]/page.tsx`)

## 🚀 Setup Steps (What You Need to Do)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Initialize Sanity Project

Run the Sanity initialization command:

```bash
npx sanity init
```

**During the initialization process:**

1. **Login to Sanity** - You'll be prompted to authenticate with your Sanity account
2. **Create a new project** - Choose "Create new project"
3. **Project name** - Enter: `pixelczar-portfolio`
4. **Use the default dataset configuration** - Choose "Yes"
5. **Dataset name** - Use: `production`
6. **Output path** - Press Enter to use the current directory

⚠️ **Important:** The init command will generate a `sanity.config.ts` file, but we've already created a custom one. If prompted to overwrite, choose **No** or backup our version first.

After initialization, you'll see your **Project ID** in the output. Copy this ID!

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory (use `env.example` as a template):

```bash
cp env.example .env.local
```

Then edit `.env.local` and add your Project ID:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_actual_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

Replace `your_actual_project_id_here` with the Project ID from Step 2.

### Step 4: Configure Sanity Project Settings

Go to [sanity.io/manage](https://sanity.io/manage) and select your project:

1. **Add CORS Origins:**
   - Go to **API** → **CORS Origins**
   - Add your development URL: `http://localhost:3000`
   - Add your production URL: `https://pixelczar.com`
   - Allow credentials: **Yes**

2. **Add Deployment URL (optional but recommended):**
   - This allows you to host the Studio at a custom URL
   - In the project settings, add your studio URL if hosting separately

### Step 5: Start Your Development Server

Run both Next.js and Sanity Studio:

```bash
# Terminal 1 - Next.js dev server
npm run dev

# Terminal 2 - Sanity Studio (if you want to run it separately)
npm run sanity
```

**Access your applications:**
- Next.js app: `http://localhost:3000`
- Sanity Studio: `http://localhost:3000/studio` (embedded in Next.js)

### Step 6: Create Your First Project

1. Open the Sanity Studio at `http://localhost:3000/studio`
2. Click on "Project" in the sidebar
3. Click "Create" button
4. Fill in the fields:
   - **Title** (required) - e.g., "Reprise Commerce Platform"
   - **Slug** - Click "Generate" to auto-create from title
   - **Description** - Brief overview of the project
   - **Role** - e.g., "Lead Product Designer"
   - **Outcomes** - Use the rich text editor for key results
   - **Timeline** - e.g., "2023-2024"
   - **Main Image** - Upload your hero/featured image (enable hotspot for smart cropping)
   - **Gallery** - Add multiple project images
   - **Tags** - Add relevant tags (press Enter after each tag)
   - **Project URL** - Optional link to live project
   - **Featured** - Toggle on for important projects
   - **Order** - Lower numbers appear first (0, 1, 2, etc.)
5. Click **Publish**

### Step 7: View Your Projects

The work page has been set up at two locations:

- **New Sanity-powered page**: `/work-sanity` - Uses data from Sanity CMS
- **Original page**: `/work` - Your existing timeline-based page

When you're ready to switch to the Sanity version:
1. Delete or rename `app/work/page.tsx` (the old one)
2. Rename `app/work-sanity/page.tsx` to `app/work/page.tsx`

Or you can manually update your existing `/work` page to use the Sanity data.

## 📚 How to Use the System

### Fetching Projects

Several query helpers are available in `lib/sanity-queries.ts`:

```typescript
// Get all projects
const projects = await getAllProjects()

// Get featured projects only
const featured = await getFeaturedProjects()

// Get projects for listing (lighter, no gallery)
const list = await getProjectsList()

// Get single project by slug
const project = await getProjectBySlug('my-project-slug')

// Get projects by tag
const tagged = await getProjectsByTag('Design System')

// Flexible query with custom fields
const custom = await getProjects({
  fields: ['title', 'slug', 'description'],
  featured: true,
  limit: 3,
})
```

### Image Optimization

Use the helper functions in `lib/sanity.ts`:

```typescript
import { buildImageUrl, getGalleryImageUrls } from '@/lib/sanity'

// Single image with optimization
const imageUrl = buildImageUrl(project.mainImage, 800, 600)

// Gallery images
const galleryUrls = getGalleryImageUrls(project.gallery, {
  width: 1200,
  height: 800,
})
```

### Flexible Field Selection

Not all fields need to be displayed everywhere. The schema supports flexible queries:

```typescript
// Minimal card view - just show basics
const minimal = await getProjects({
  fields: ['title', 'slug', 'mainImage', 'tags'],
})

// Detailed view - include everything
const detailed = await getProjects({
  fields: [
    'title',
    'slug',
    'description',
    'role',
    'outcomes',
    'timeline',
    'mainImage',
    'gallery',
    'tags',
    'projectUrl',
  ],
})
```

## 🎨 Project Schema Fields Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | Yes | Project title |
| `slug` | Slug | Yes | Auto-generated from title |
| `description` | Text | No | Brief description |
| `role` | String | No | Your role (e.g., "Lead Designer") |
| `outcomes` | Rich Text | No | Key results/impact (portable text) |
| `timeline` | String | No | Timeline (e.g., "2023-2024") |
| `mainImage` | Image | No | Hero/featured image with hotspot |
| `gallery` | Array[Image] | No | Additional project images |
| `tags` | Array[String] | No | Project tags |
| `projectUrl` | URL | No | Link to live project |
| `featured` | Boolean | No | Display prominently |
| `order` | Number | No | Sort order (lower = first) |

## 🔧 Customization Options

### Adding New Fields

Edit `sanity/schemas/project.ts` to add new fields:

```typescript
defineField({
  name: 'client',
  title: 'Client',
  type: 'string',
  description: 'Client or company name',
})
```

### Creating Additional Content Types

Create new schema files in `sanity/schemas/` and add them to `sanity/schemas/index.ts`:

```typescript
import project from './project'
import blogPost from './blogPost' // New schema

export const schemaTypes = [project, blogPost]
```

### Customizing the Studio

Edit `sanity.config.ts` to customize the Studio interface, add plugins, or modify structure.

## 📝 Common Tasks

### Reordering Projects

In the Studio, change the **Order** field (lower numbers appear first).

### Featuring Projects

Toggle the **Featured** checkbox in the Studio, then query:

```typescript
const featured = await getFeaturedProjects()
```

### Adding Captions to Images

When uploading images in the Studio, expand the image and fill in:
- **Alternative text** - For accessibility and SEO
- **Caption** - Displayed below the image

### Publishing Changes

After editing a project, click **Publish** in the Studio. Changes will appear on your site after the revalidation period (60 seconds by default).

## 🐛 Troubleshooting

### "Invalid project ID" error
- Make sure `.env.local` exists and contains the correct `NEXT_PUBLIC_SANITY_PROJECT_ID`
- Restart your dev server after adding environment variables

### Images not loading
- Check CORS settings in Sanity dashboard
- Verify image URLs are being built correctly with `buildImageUrl()`

### Studio not loading at /studio
- Make sure `app/studio/[[...index]]/page.tsx` exists
- Clear Next.js cache: `rm -rf .next` and restart

### Changes not appearing
- Projects are revalidated every 60 seconds
- Force refresh: Add `?revalidate=1` to the URL
- Or update `revalidate` value in page files

## 📚 Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Image Optimization](https://www.sanity.io/docs/image-url)
- [Next.js Integration](https://www.sanity.io/docs/next-js)

## ✅ Next Steps

1. Install dependencies
2. Run `npx sanity init` to create your project
3. Configure `.env.local` with your Project ID
4. Set up CORS origins in Sanity dashboard
5. Start your dev server and access the Studio
6. Create your first project!
7. View it at `/work-sanity` or integrate into existing `/work` page

---

Need help? Check the [Sanity Community](https://www.sanity.io/community) or [Discord](https://slack.sanity.io/).

