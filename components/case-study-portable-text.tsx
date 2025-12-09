'use client'

import { PortableText } from '@portabletext/react'
import { caseStudyComponents } from './case-study-content'
import { TwoColumnContainer } from './case-study-content'

interface CaseStudyPortableTextProps {
  value: any
}

// Process content array to group half-left/half-right images with adjacent blocks
function processContentForTwoColumn(content: any[]): any[] {
  const processed: any[] = []
  let i = 0

  while (i < content.length) {
    const current = content[i]
    
    // Check if current block is a half-left or half-right image
    if (
      current._type === 'image' &&
      (current.layout === 'half-left' || current.layout === 'half-right')
    ) {
      const nextBlock = content[i + 1]
      
      // Case 1: Next block is also an image with opposite layout (two images side-by-side)
      if (
        nextBlock &&
        nextBlock._type === 'image' &&
        ((current.layout === 'half-left' && nextBlock.layout === 'half-right') ||
         (current.layout === 'half-right' && nextBlock.layout === 'half-left'))
      ) {
        // Pair two images together
        if (process.env.NODE_ENV === 'development') {
          console.log('Pairing two images:', {
            first: { layout: current.layout, _key: current._key },
            second: { layout: nextBlock.layout, _key: nextBlock._key }
          })
        }
        processed.push({
          _type: 'twoColumnGroup',
          _key: `two-col-${current._key}`,
          image: current,
          content: nextBlock,
        })
        i += 2 // Skip both images
        continue
      }
      
      // Case 1b: Next block is also an image, pair them regardless of layout (flexible pairing)
      if (nextBlock && nextBlock._type === 'image') {
        if (process.env.NODE_ENV === 'development') {
          console.log('Pairing two images (flexible):', {
            first: { layout: current.layout, _key: current._key },
            second: { layout: nextBlock.layout, _key: nextBlock._key }
          })
        }
        processed.push({
          _type: 'twoColumnGroup',
          _key: `two-col-${current._key}`,
          image: current,
          content: nextBlock,
        })
        i += 2 // Skip both images
        continue
      }
      
      // Case 2: Next block is non-image content (image + text/heading)
      if (nextBlock && nextBlock._type !== 'image') {
        processed.push({
          _type: 'twoColumnGroup',
          _key: `two-col-${current._key}`,
          image: current,
          content: nextBlock,
        })
        i += 2 // Skip both blocks
        continue
      }
    }

    // Not a half-left/half-right image, or no adjacent block to pair with
    processed.push(current)
    i++
  }

  return processed
}

// Component to render a two-column group
function TwoColumnGroup({ value }: { value: any }) {
  const { image, content } = value
  const isImageRight = image.layout === 'half-right'

  return (
    <TwoColumnContainer reverse={isImageRight}>
      {/* Image side */}
      <div className={isImageRight ? 'md:order-2' : ''}>
        <PortableText 
          value={[image]} 
          components={caseStudyComponents}
        />
      </div>
      {/* Content side */}
      <div className={isImageRight ? '' : 'md:order-2'}>
        <PortableText 
          value={[content]} 
          components={caseStudyComponents}
        />
      </div>
    </TwoColumnContainer>
  )
}

export default function CaseStudyPortableText({ value }: CaseStudyPortableTextProps) {
  // Process content to group half-left/half-right images with adjacent blocks
  const processedContent = processContentForTwoColumn(value || [])

  // Add custom component for two-column groups
  const components = {
    ...caseStudyComponents,
    types: {
      ...caseStudyComponents.types,
      twoColumnGroup: TwoColumnGroup,
    },
  }

  return <PortableText value={processedContent} components={components} />
}

