import { defineField, defineType } from 'sanity'
import { VideoIcon } from '@sanity/icons'

export default defineType({
  name: 'videoBlock',
  title: 'Video',
  type: 'object',
  icon: VideoIcon,
  fields: [
    defineField({
      name: 'videoFile',
      title: 'Video File (Upload)',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      description: 'Upload a video file to Sanity (or use URL below for static files)',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'URL to video file (e.g., /videos/filename.mp4 for files in /public/videos/)',
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Description for accessibility',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption displayed below the video',
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      description: 'How should this video be displayed?',
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
    }),
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      initialValue: false,
      description: 'Video starts playing automatically',
    }),
    defineField({
      name: 'loop',
      title: 'Loop',
      type: 'boolean',
      initialValue: false,
      description: 'Video loops continuously',
    }),
    defineField({
      name: 'muted',
      title: 'Muted',
      type: 'boolean',
      initialValue: true,
      description: 'Video plays without sound (required for autoplay)',
    }),
    defineField({
      name: 'controls',
      title: 'Show Controls',
      type: 'boolean',
      initialValue: true,
      description: 'Show video player controls',
    }),
    defineField({
      name: 'isHidden',
      type: 'boolean',
      title: 'Hide Video',
      description: 'When enabled, this video will be hidden from the showcase',
      initialValue: false,
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value) => {
      if (!value?.videoFile && !value?.videoUrl) {
        return 'Either a video file or video URL must be provided'
      }
      return true
    }),
  preview: {
    select: {
      url: 'videoUrl',
      file: 'videoFile.asset.originalFilename',
      caption: 'caption',
      layout: 'layout',
      isHidden: 'isHidden',
    },
    prepare({ url, file, caption, layout, isHidden }) {
      const source = url || file || 'Video'
      return {
        title: `${isHidden ? '🚫 ' : ''}${caption || source}`,
        subtitle: `Video (${layout || 'narrow'})`,
        media: VideoIcon,
      }
    },
  },
})
