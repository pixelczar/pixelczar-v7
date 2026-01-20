import { defineField, defineType } from 'sanity'
import { RemoveIcon } from '@sanity/icons'

export default defineType({
  name: 'divider',
  title: 'Divider',
  type: 'object',
  icon: RemoveIcon,
  fields: [
    defineField({
      name: 'style',
      type: 'string',
      title: 'Style',
      initialValue: 'standard',
      options: {
        list: [{ title: 'Standard Accent', value: 'standard' }],
      },
    }),
  ],
  preview: {
    select: {
      style: 'style',
    },
    prepare({ style }) {
      return { 
        title: `Divider (${style || 'standard'})`,
        media: RemoveIcon
      }
    },
  },
})
