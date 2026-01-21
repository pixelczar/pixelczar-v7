import { defineArrayMember, defineField, defineType } from 'sanity'
import { SplitVerticalIcon } from '@sanity/icons'

export default defineType({
  name: 'twoColumnBlock',
  title: 'Two Column (Image + Text)',
  type: 'object',
  icon: SplitVerticalIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
        defineField({ name: 'caption', type: 'string', title: 'Caption' }),
        defineField({
          name: 'isHidden',
          type: 'boolean',
          title: 'Hide Image',
          description: 'When enabled, the image portion of this block will be hidden',
          initialValue: false,
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
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
      isHidden: 'image.isHidden',
    },
    prepare({ image, position, content, isHidden }) {
      // Extract first 40 chars of text for preview
      const textPreview = content?.[0]?.children?.[0]?.text || ''
      const shortPreview = textPreview.length > 40 ? textPreview.substring(0, 40) + '...' : textPreview
      return {
        title: `${isHidden ? '🚫 ' : ''}${shortPreview || `Two Column (Image ${position || 'left'})`}`,
        subtitle: `Image ${position || 'left'}${isHidden ? ' (HIDDEN)' : ''}`,
        media: image || SplitVerticalIcon,
      }
    },
  },
})

