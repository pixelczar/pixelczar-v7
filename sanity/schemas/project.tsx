import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g., "Lead Designer", "Product Designer"',
    }),
    defineField({
      name: 'outcomes',
      title: 'Outcomes',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
      description: 'Key results and impact of the project',
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
      type: 'string',
      description: 'e.g., "2023-2024" or "6 months"',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'projectUrl',
      title: 'Project URL',
      type: 'url',
      description: 'Optional link to live project or case study',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Display this project prominently',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order (lower numbers appear first)',
      validation: (Rule) => Rule.integer().min(0),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'role',
      media: 'mainImage',
    },
  },
  orderings: [
    {
      title: 'Order (Ascending)',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Order (Descending)',
      name: 'orderDesc',
      by: [{ field: 'order', direction: 'desc' }],
    },
    {
      title: 'Title (A-Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
})

