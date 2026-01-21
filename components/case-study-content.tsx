'use client'

import Image from 'next/image'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { buildImageUrl } from '@/lib/sanity'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Layout types for images
type ImageLayout = 'narrow' | 'full-width' | 'half-left' | 'half-right' | '50-50'

interface ImageValue {
  asset?: {
    _ref?: string
    _type?: string
  }
  alt?: string
  caption?: string
  layout?: ImageLayout
  hotspot?: any
  crop?: any
}

// Narrow text container - wraps text content
export const NarrowTextContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-3xl mx-auto">{children}</div>
)

// Full-width container for images that break out
export const FullWidthContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-7xl mx-auto my-4">
    {children}
  </div>
)

// 50-50 layout container
export const TwoColumnContainer = ({ 
  children, 
  reverse = false 
}: { 
  children: React.ReactNode
  reverse?: boolean 
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 my-12 items-center">
    {children}
  </div>
)

// Image component with layout support
function CaseStudyImage({ value }: { value: any }) {
  if (value?.isHidden) {
    return null
  }
  
  // Debug: log what we're receiving
  if (process.env.NODE_ENV === 'development') {
    console.log('CaseStudyImage called with value:', value)
  }
  
  // Handle both direct image values and nested structures
  const imageValue = value?._type === 'image' ? value : value
  
  if (!imageValue || !imageValue.asset) {
    console.warn('CaseStudyImage: Invalid image value', { value, imageValue })
    return null
  }

  // Handle dereferenced assets (asset-> in GROQ) - they have a url property
  // Or handle referenced assets (asset in GROQ) - they have a _ref property
  let imageUrl: string | null = null
  if (imageValue.asset.url) {
    // Asset is dereferenced, use URL directly with Sanity CDN optimization params
    const baseUrl = imageValue.asset.url.split('?')[0] // Remove any existing query params
    imageUrl = `${baseUrl}?w=1920&auto=format&fit=max&q=90`
  } else if (imageValue.asset._ref) {
    // Asset is a reference, use buildImageUrl
    imageUrl = buildImageUrl(imageValue as SanityImageSource, 1920)
  } else {
    console.warn('CaseStudyImage: Asset has neither url nor _ref', imageValue.asset)
  }

  if (!imageUrl) {
    console.warn('CaseStudyImage: No image URL generated', imageValue)
    return null
  }

  const layout = imageValue.layout || 'narrow'
  
  // Debug logging (remove in production if needed)
  if (process.env.NODE_ENV === 'development') {
    console.log('CaseStudyImage layout:', layout, 'value:', { 
      layout: imageValue.layout, 
      hasAsset: !!imageValue.asset,
      _type: imageValue._type,
      fullValue: imageValue
    })
  }

  // Full-width image
  if (layout === 'full-width') {
    return (
      <FullWidthContainer>
        <div className="relative w-full overflow-hidden bg-muted rounded-lg md:rounded-xl shadow-sm">
          <Image
            src={imageUrl}
            alt={imageValue.alt || 'Case study image'}
            width={1920}
            height={1080}
            className="w-full h-auto max-h-[90vh] object-cover"
            sizes="100vw"
            quality={90}
          />
        </div>
        {imageValue.caption && (
          <p className="text-sm text-muted-foreground text-center mt-4 max-w-4xl mx-auto">
            {imageValue.caption}
          </p>
        )}
      </FullWidthContainer>
    )
  }

  // 50-50 layout (half-left or half-right)
  // Note: These are automatically grouped with adjacent blocks by CaseStudyPortableText
  // If rendered standalone (not grouped), show as a single column image
  if (layout === 'half-left' || layout === 'half-right') {
    return (
      <div className="my-4">
        <div className="relative w-full min-h-[200px] overflow-hidden bg-muted rounded-lg md:rounded-xl flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={imageValue.alt || 'Case study image'}
            width={1200}
            height={800}
            className="w-full h-auto max-h-[60vh] object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={90}
          />
        </div>
        {imageValue.caption && (
          <p className="text-sm text-muted-foreground text-center mt-4 max-w-4xl mx-auto">{imageValue.caption}</p>
        )}
      </div>
    )
  }

  // Narrow layout (default)
  return (
    <div className="my-12">
      <div className="relative w-full overflow-hidden bg-muted rounded-lg md:rounded-xl shadow-sm">
        <Image
          src={imageUrl}
          alt={imageValue.alt || 'Case study image'}
          width={1400}
          height={1000}
          className="w-full h-auto max-h-[80vh] object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
          quality={90}
        />
      </div>
      {imageValue.caption && (
        <p className="text-sm text-muted-foreground text-center mt-3">{imageValue.caption}</p>
      )}
    </div>
  )
}

// Video component with layout support
function CaseStudyVideo({ value }: { value: any }) {
  if (value?.isHidden) {
    return null
  }

  if (!value) {
    console.warn('CaseStudyVideo: Invalid video value', value)
    return null
  }

  // Get video URL - prioritize uploaded file, fallback to URL field
  let videoUrl: string | null = null
  if (value.videoFile?.asset?.url) {
    // Sanity-hosted video
    videoUrl = value.videoFile.asset.url
  } else if (value.videoUrl) {
    // Static file URL (e.g., /videos/filename.mp4)
    videoUrl = value.videoUrl
  }

  if (!videoUrl) {
    console.warn('CaseStudyVideo: No video URL found', value)
    return null
  }

  const layout = value.layout || 'narrow'
  const autoplay = value.autoplay || false
  const loop = value.loop || false
  const muted = value.muted !== undefined ? value.muted : true // Default to muted for autoplay compatibility
  const controls = value.controls !== undefined ? value.controls : true

  // Full-width video
  if (layout === 'full-width') {
    return (
      <FullWidthContainer>
        <div className="relative w-full overflow-hidden bg-muted rounded-lg md:rounded-xl shadow-sm">
          <video
            src={videoUrl}
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            controls={controls}
            playsInline
            className="w-full h-auto block"
          />
        </div>
        {value.caption && (
          <p className="text-sm text-muted-foreground text-center mt-4 max-w-4xl mx-auto">
            {value.caption}
          </p>
        )}
      </FullWidthContainer>
    )
  }

  // 50-50 layout (half-left or half-right)
  // Note: These are automatically grouped with adjacent blocks by CaseStudyPortableText
  // If rendered standalone (not grouped), show as a single column video
  if (layout === 'half-left' || layout === 'half-right') {
    return (
      <div className="my-4">
        <div className="relative w-full aspect-video overflow-hidden bg-muted rounded-lg md:rounded-xl">
          <video
            src={videoUrl}
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            controls={controls}
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        {value.caption && (
          <p className="text-sm text-muted-foreground mt-2">{value.caption}</p>
        )}
      </div>
    )
  }

  // Narrow layout (default)
  return (
    <div className="my-8">
      <div className="relative w-full overflow-hidden bg-muted rounded-lg md:rounded-xl shadow-sm">
        <video
          src={videoUrl}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          controls={controls}
          playsInline
          className="w-full h-auto block"
        />
      </div>
      {value.caption && (
        <p className="text-sm text-muted-foreground text-center mt-2">{value.caption}</p>
      )}
    </div>
  )
}

// Custom block types for structured sections
function SectionBlock({ value }: { value: any }) {
  const { title, content, layout = 'narrow' } = value
  
  const ContentWrapper = layout === 'full-width' ? 'div' : NarrowTextContainer

  return (
    <section className="my-12">
      {title && (
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 font-sans max-w-[700px] mx-auto">
          {title}
        </h2>
      )}
      <ContentWrapper>
        {content && (
          <div className="prose prose-lg dark:prose-invert max-w-none font-sans prose-headings:font-sans prose-p:font-sans">
            {/* This would need to render nested PortableText if content is portable text */}
            {typeof content === 'string' ? <p>{content}</p> : content}
          </div>
        )}
      </ContentWrapper>
    </section>
  )
}

// Two column block for side-by-side content (explicit block type)
function TwoColumnBlock({ value }: { value: any }) {
  const { image, content, imagePosition = 'left' } = value
  const isImageRight = imagePosition === 'right'

  // Build image URL
  let imageUrl: string | null = null
  if (image?.asset?.url) {
    const baseUrl = image.asset.url.split('?')[0]
    imageUrl = `${baseUrl}?w=1200&auto=format&fit=max&q=90`
  } else if (image?.asset?._ref) {
    imageUrl = buildImageUrl(image as SanityImageSource, 1200)
  }

  // Base components for nested PortableText (without custom types to avoid circular dependency)
  const baseComponents: PortableTextComponents = {
    block: {
      h1: ({ children }) => <h1 className="text-2xl font-semibold mb-4 font-sans">{children}</h1>,
      h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 font-sans">{children}</h2>,
      h3: ({ children }) => <h3 className="text-2xl font-normal tracking-tight pt-8">{children}</h3>,
      normal: ({ children }) => <p className="text-body-main leading-relaxed mb-4 font-sans">{children}</p>,
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-accent pl-4 py-2 my-4 italic text-muted-foreground">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4 font-sans">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4 font-sans">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li className="mb-1 text-body-main">{children}</li>,
      number: ({ children }) => <li className="mb-1 text-body-main">{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      link: ({ value, children }) => (
        <a href={value?.href} target={value?.blank ? '_blank' : undefined} rel={value?.blank ? 'noopener noreferrer' : undefined} className="text-accent hover:underline">
          {children}
        </a>
      ),
    },
  }

  return (
    <TwoColumnContainer reverse={isImageRight}>
      {/* Image side */}
      <div className={isImageRight ? 'md:order-2' : ''}>
        {imageUrl && !image?.isHidden ? (
          <div className="my-4">
            <div className="relative w-full min-h-[200px] overflow-hidden bg-muted rounded-lg md:rounded-xl flex items-center justify-center">
              <Image
                src={imageUrl}
                alt={image.alt || 'Case study image'}
                width={1200}
                height={800}
                className="w-full h-auto max-h-[60vh] object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
              />
            </div>
            {image.caption && (
              <p className="text-sm text-muted-foreground mt-2">{image.caption}</p>
            )}
          </div>
        ) : null}
      </div>
      {/* Content side */}
      <div className={isImageRight ? '' : 'md:order-2'}>
        <div className="prose prose-lg dark:prose-invert max-w-none font-sans prose-headings:font-sans prose-p:font-sans">
          <PortableText value={content} components={baseComponents} />
        </div>
      </div>
    </TwoColumnContainer>
  )
}

// Callout block component
function CalloutBlock({ value }: { value: any }) {
  const { content, variant = 'info', title } = value

  const variantStyles = {
    info: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
    warning: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
    success: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
    error: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    muted: 'bg-muted border-border text-foreground',
  }

  const styles = variantStyles[variant as keyof typeof variantStyles] || variantStyles.muted

  // Base components for nested PortableText
  const baseComponents: PortableTextComponents = {
    block: {
      h1: ({ children }) => <h1 className="text-2xl font-semibold mb-4 font-sans">{children}</h1>,
      h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 font-sans">{children}</h2>,
      h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 font-sans">{children}</h3>,
      normal: ({ children }) => <p className="text-body-main leading-relaxed mb-4 font-sans">{children}</p>,
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-accent pl-4 py-2 my-4 italic text-muted-foreground">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4 font-sans">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4 font-sans">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li className="mb-1">{children}</li>,
      number: ({ children }) => <li className="mb-1">{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      em: ({ children }) => <em className="italic">{children}</em>,
      link: ({ value, children }) => (
        <a href={value?.href} target={value?.blank ? '_blank' : undefined} rel={value?.blank ? 'noopener noreferrer' : undefined} className="text-accent hover:underline">
          {children}
        </a>
      ),
    },
  }

  return (
    <NarrowTextContainer>
      <div className={`my-8 p-6 rounded-lg border ${styles}`}>
        {title && (
          <h3 className="text-lg font-semibold mb-3 font-sans">{title}</h3>
        )}
        <div className="prose prose-lg dark:prose-invert max-w-none font-sans prose-headings:font-sans prose-p:font-sans">
          <PortableText value={content} components={baseComponents} />
        </div>
      </div>
    </NarrowTextContainer>
  )
}

// Main PortableText components configuration
export const caseStudyComponents: PortableTextComponents = {
  // Block-level components
  block: {
    // Headings with narrow column
    h1: ({ children }) => (
      <NarrowTextContainer>
        <h1 className="text-3xl md:text-4xl font-semibold mb-6 font-sans">{children}</h1>
      </NarrowTextContainer>
    ),
    h2: ({ children }) => (
      <NarrowTextContainer>
        <h2 className="text-3xl md:text-5xl font-normal mb-8 opacity-30">{children}</h2>
      </NarrowTextContainer>
    ),
    h3: ({ children }) => (
      <NarrowTextContainer>
        <h3 className="text-2xl font-normal tracking-tight mb-4 mt-16">{children}</h3>
      </NarrowTextContainer>
    ),
    // Paragraphs in narrow column
    normal: ({ children }) => (
      <NarrowTextContainer>
        <p className="text-body-main leading-relaxed mb-16 font-sans">
          {children}
        </p>
      </NarrowTextContainer>
    ),
    // Blockquote
    blockquote: ({ children }) => (
      <NarrowTextContainer>
        <blockquote className="border-l-4 border-accent pl-6 py-4 my-8 italic text-muted-foreground">
          {children}
        </blockquote>
      </NarrowTextContainer>
    ),
  },
  // List components
  list: {
    bullet: ({ children }) => (
      <NarrowTextContainer>
        <ul className="list-disc list-inside space-y-2 mb-6 font-sans">{children}</ul>
      </NarrowTextContainer>
    ),
    number: ({ children }) => (
      <NarrowTextContainer>
        <ol className="list-decimal list-inside space-y-2 mb-6 font-sans">{children}</ol>
      </NarrowTextContainer>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-2 text-body-main">{children}</li>,
    number: ({ children }) => <li className="mb-2 text-body-main">{children}</li>,
  },
  // Marks (inline formatting)
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const target = value?.blank ? '_blank' : undefined
      const rel = value?.blank ? 'noopener noreferrer' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-accent hover:underline"
        >
          {children}
        </a>
      )
    },
    // Callout annotation (inline callout - select text and apply callout style)
    callout: ({ value, children }: { value?: any; children: React.ReactNode }) => {
      const variant = value?.variant || 'info'
      const variantStyles = {
        info: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
        warning: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
        success: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
        error: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
        muted: 'bg-muted border-border text-foreground',
      }
      const styles = variantStyles[variant as keyof typeof variantStyles] || variantStyles.muted
      
      return (
        <span className={`inline-block px-2 py-1 rounded border ${styles} font-medium`}>
          {children}
        </span>
      )
    },
  },
  // Custom types
  types: {
    image: ({ value }: { value: any }) => {
      // Debug: log what we're receiving
      if (process.env.NODE_ENV === 'development') {
        console.log('PortableText image type handler called with value:', value)
      }
      return <CaseStudyImage value={value} />
    },
    videoBlock: ({ value }: { value: any }) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('PortableText videoBlock type handler called with value:', value)
      }
      return <CaseStudyVideo value={value} />
    },
    twoColumnBlock: TwoColumnBlock,
    calloutBlock: CalloutBlock,
    divider: () => (
      <NarrowTextContainer>
        <div className="w-full h-px bg-accent/40 mx-auto mt-16 mb-12 theme-transition" />
      </NarrowTextContainer>
    ),
  },
}

