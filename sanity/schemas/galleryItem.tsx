import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export default defineType({
  name: 'galleryItem',
  title: 'Gallery Item',
  type: 'document',
  icon: ImagesIcon,
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'galleryItem' }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal title for organization',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: [
          { title: 'Large (Full Width)', value: 'large' },
          { title: 'Medium (Half Width)', value: 'medium' },
          { title: 'Small (Third Width)', value: 'small' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text' },
      ],
      hidden: ({ parent }) => parent?.type === 'video',
    }),
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      hidden: ({ parent }) => parent?.type === 'image',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'External video URL (YouTube, Vimeo, etc.) - alternative to uploading',
      hidden: ({ parent }) => parent?.type === 'image',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
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
      type: 'type',
      size: 'size',
      media: 'image',
    },
    prepare({ title, type, size, media }) {
      return {
        title: title || 'Untitled',
        subtitle: `${type || 'image'} • ${size || 'medium'}`,
        media,
      }
    },
  },
})

