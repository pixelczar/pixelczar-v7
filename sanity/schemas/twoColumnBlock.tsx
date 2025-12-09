import { defineField, defineType } from 'sanity'
import { ColumnsIcon } from '@sanity/icons'

export default defineType({
  name: 'twoColumnBlock',
  title: 'Two Column (Image + Text)',
  type: 'object',
  icon: ColumnsIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text' },
        { name: 'caption', type: 'string', title: 'Caption' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Text content that appears next to the image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      description: 'Which side should the image appear on?',
    }),
  ],
  preview: {
    select: {
      image: 'image',
      position: 'imagePosition',
      content: 'content',
    },
    prepare({ image, position, content }) {
      // Extract first 40 chars of text for preview
      const textPreview = content?.[0]?.children?.[0]?.text || ''
      const shortPreview = textPreview.length > 40 ? textPreview.substring(0, 40) + '...' : textPreview
      return {
        title: shortPreview || `Two Column (Image ${position || 'left'})`,
        subtitle: `Image ${position || 'left'}`,
        media: image || ColumnsIcon,
      }
    },
  },
})

