import { defineArrayMember, defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: DocumentIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'project' }),
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
        defineArrayMember({
          type: 'block',
        }),
      ],
      description: 'Key results and impact of the project',
    }),
    defineField({
      name: 'codeSnippet',
      title: 'Code Snippet',
      type: 'code',
      options: {
        language: 'javascript',
        languageAlternatives: [
          { title: 'JavaScript', value: 'javascript' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'HTML', value: 'html' },
          { title: 'CSS', value: 'css' },
          { title: 'JSON', value: 'json' },
          { title: 'JSX', value: 'jsx' },
          { title: 'TSX', value: 'tsx' },
          { title: 'Python', value: 'python' },
          { title: 'Shell', value: 'shell' },
        ],
        withFilename: true,
      },
      description: 'Optional code snippet related to the project',
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
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
        }),
        defineField({
          name: 'caption',
          type: 'string',
          title: 'Caption',
        }),
        defineField({
          name: 'isHidden',
          type: 'boolean',
          title: 'Hide from Showcase',
          description: 'When enabled, this image will not be shown in the public showcase',
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
            defineField({
              name: 'isHidden',
              type: 'boolean',
              title: 'Hide from Showcase',
              description: 'When enabled, this image will not be shown in the public showcase',
              initialValue: false,
              validation: (Rule) => Rule.custom((value) => value === true ? { message: 'This item is currently hidden from the public showcase.', status: 'info' } : true),
            }),
          ],
          preview: {
            select: {
              title: 'caption',
              media: 'asset',
              isHidden: 'isHidden',
            },
            prepare({ title, media, isHidden }) {
              return {
                title: `${isHidden ? '🚫 ' : ''}${title || 'Image'}`,
                subtitle: isHidden ? 'HIDDEN' : '',
                media,
              }
            },
          },
        }),
      ],
      options: {
        layout: 'grid',
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
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
})

