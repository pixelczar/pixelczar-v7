import { defineField, defineType } from 'sanity'
import { AlertCircleIcon } from '@sanity/icons'

export default defineType({
  name: 'calloutBlock',
  title: 'Callout',
  type: 'object',
  icon: AlertCircleIcon,
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Style',
      type: 'string',
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
      description: 'Choose the callout style/color',
    }),
    defineField({
      name: 'title',
      title: 'Title (Optional)',
      type: 'string',
      description: 'Optional title for the callout',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      variant: 'variant',
      content: 'content',
    },
    prepare({ title, variant, content }) {
      // Extract first 60 chars of text for preview
      const textPreview = content?.[0]?.children?.[0]?.text || ''
      const shortPreview = textPreview.length > 60 ? textPreview.substring(0, 60) + '...' : textPreview
      return {
        title: title || shortPreview || 'Callout Block',
        subtitle: variant ? `${variant.charAt(0).toUpperCase() + variant.slice(1)} callout` : 'Callout',
        media: AlertCircleIcon,
      }
    },
  },
})

