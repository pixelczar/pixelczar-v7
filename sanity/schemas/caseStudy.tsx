import { defineArrayMember, defineField, defineType } from 'sanity'
import { CaseIcon, InfoOutlineIcon } from '@sanity/icons'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

const CalloutIcon = InfoOutlineIcon

export default defineType({
  name: 'caseStudy',
  title: 'Showcase',
  type: 'document',
  icon: CaseIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'caseStudy' }),
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
      name: 'oneLiner',
      title: 'One Liner',
      type: 'string',
      description: 'Catchy one-liner title shown in the Showcase detail page intro',
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      description: 'Company name for this case study',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
      description: 'Brief one-liner for card display (shown on Work page)',
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'text',
      rows: 4,
      description: 'Detailed description (shown on case study detail page)',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g., "VP of Design", "Lead Product Designer"',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'callout',
                type: 'object',
                title: 'Callout',
                icon: CalloutIcon,
                fields: [
                  {
                    name: 'variant',
                    type: 'string',
                    title: 'Style',
                    options: {
                      list: [
                        { title: 'Info (Blue)', value: 'info' },
                        { title: 'Warning (Yellow)', value: 'warning' },
                        { title: 'Success (Green)', value: 'success' },
                        { title: 'Error (Red)', value: 'error' },
                        { title: 'Muted (Gray)', value: 'muted' },
                      ],
                      layout: 'radio',
                    },
                    initialValue: 'info',
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt text' },
            { name: 'caption', type: 'string', title: 'Caption' },
            {
              name: 'layout',
              type: 'string',
              title: 'Layout',
              description: 'How should this image be displayed?',
              options: {
                list: [
                  { title: 'Narrow (default)', value: 'narrow' },
                  { title: 'Full Width', value: 'full-width' },
                  { title: 'Half Left (50-50)', value: 'half-left' },
                  { title: 'Half Right (50-50)', value: 'half-right' },
                ],
                layout: 'radio',
              },
              initialValue: 'narrow',
            },
          ],
        }),
        defineArrayMember({
          type: 'twoColumnBlock',
          title: 'Two Column (Image + Text)',
        }),
        defineArrayMember({
          type: 'calloutBlock',
          title: 'Callout Block',
        }),
        defineArrayMember({
          type: 'videoBlock',
          title: 'Video',
        }),
        defineArrayMember({
          type: 'divider',
        }),
      ],
      description: 'Full case study content with rich text, images, and videos',
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
      type: 'string',
      description: 'e.g., "2021-2023" or "18 months"',
    }),
    defineField({
      name: 'metrics',
      title: 'Metrics / Highlights',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string', description: 'e.g., "0-1" or "3"' },
            { name: 'value', title: 'Value', type: 'string', description: 'e.g., "New product area buildout"' },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'value',
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(4),
      description: 'Up to 4 metrics shown in the header grid',
    }),
    defineField({
      name: 'mainMediaType',
      title: 'Main Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      description: 'Choose whether the main media is an image or video',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text' },
        { name: 'caption', type: 'string', title: 'Caption' },
      ],
      hidden: ({ parent }) => parent?.mainMediaType === 'video',
    }),
    defineField({
      name: 'mainVideo',
      title: 'Main Video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      hidden: ({ parent }) => parent?.mainMediaType === 'image',
    }),
    defineField({
      name: 'mainVideoUrl',
      title: 'Main Video URL',
      type: 'url',
      description: 'External video URL (YouTube, Vimeo, etc.) - alternative to uploading',
      hidden: ({ parent }) => parent?.mainMediaType === 'image',
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt text' },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        }),
      ],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'projectUrl',
      title: 'Project URL',
      type: 'url',
      description: 'Link to live project or case study',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
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
      subtitle: 'company',
      media: 'mainImage',
      mediaType: 'mainMediaType',
    },
    prepare({ title, subtitle, media, mediaType }) {
      return {
        title: title || 'Untitled',
        subtitle: subtitle || 'No company',
        media: mediaType === 'video' ? undefined : media,
      }
    },
  },
})
