'use client'

import { useEffect, useState, useRef } from 'react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'

type DarkThemeVariant = 'midnight' | 'original' | 'teal'

// Magnetic button wrapper component
function MagneticButton({
  onClick,
  className,
  style,
  ariaLabel,
  title,
}: {
  onClick: () => void
  className: string
  style: React.CSSProperties
  ariaLabel: string
  title: string
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return

    const { clientX, clientY } = e
    const { width, height, left, top } = ref.current.getBoundingClientRect()
    const centerX = left + width / 2
    const centerY = top + height / 2
    const deltaX = clientX - centerX
    const deltaY = clientY - centerY

    setPosition({
      x: deltaX * 0.3,
      y: deltaY * 0.3,
    })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
        mass: 0.5,
      }}
    >
      <button
        ref={ref}
        onClick={onClick}
        className={`cursor-hover ${className}`}
        style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-cursor-rounded="full"
        aria-label={ariaLabel}
        title={title}
      />
    </motion.div>
  )
}

export default function DarkThemePicker() {
  const { theme } = useTheme()
  const [variant, setVariant] = useState<DarkThemeVariant>('original')
  const [mounted, setMounted] = useState(false)
  const prevThemeRef = useRef<string | undefined>(undefined)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    setMounted(true)
    // Load saved preference
    const saved = localStorage.getItem('dark-theme-variant') as DarkThemeVariant | null
    if (saved) {
      setVariant(saved)
      document.documentElement.setAttribute('data-dark-variant', saved)
    } else {
      document.documentElement.setAttribute('data-dark-variant', 'original')
    }
  }, [])

  // Track theme changes to prevent animation on page transitions
  useEffect(() => {
    if (mounted) {
      prevThemeRef.current = theme
    }
  }, [theme, mounted])

  const handleVariantChange = (newVariant: DarkThemeVariant) => {
    setVariant(newVariant)
    localStorage.setItem('dark-theme-variant', newVariant)
    document.documentElement.setAttribute('data-dark-variant', newVariant)
  }

  if (!mounted) return null

  const containerVariants = {
    hidden: { 
      opacity: 0,
      width: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      width: 'auto',
      scale: 1,
      transition: {
        width: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
        opacity: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const },
        scale: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const },
        staggerChildren: 0.03,
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      width: 0,
      scale: 0.8,
      transition: {
        width: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
        opacity: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const },
        scale: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const },
        staggerChildren: 0.02,
        staggerDirection: -1,
      },
    },
  }

  const buttonVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.6,
      x: -8,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 25,
      },
    },
    exit: { 
      opacity: 0, 
      scale: 0.6,
      x: -8,
      transition: {
        duration: 0.15,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  }

  // Only animate if theme actually changed from light to dark, not on page navigation
  const themeChanged = prevThemeRef.current !== undefined && prevThemeRef.current !== theme
  const isVisible = theme === 'dark'
  const shouldAnimate = themeChanged && prevThemeRef.current === 'light' && theme === 'dark'
  const shouldExit = themeChanged && prevThemeRef.current === 'dark' && theme === 'light'

  // If visible and theme hasn't changed, render without animation
  if (isVisible && !shouldAnimate && !shouldExit) {
    return (
      <div className="flex items-center gap-2 h-5 theme-transition">
        <MagneticButton
          onClick={() => handleVariantChange('original')}
          className={`w-5 h-5 rounded-full border-2 border-transparent transition-all duration-200 theme-transition ${
            variant === 'original'
              ? 'ring-1 ring-accent scale-105'
              : 'hover:scale-105'
          }`}
          style={{ 
            backgroundColor: '#1d232a',
            borderColor: variant === 'original'
              ? 'color-mix(in srgb, var(--border) 30%, transparent)'
              : 'color-mix(in srgb, var(--border) 50%, transparent)',
            boxSizing: 'border-box',
            opacity: 1,
            outline: 'none',
          }}
          ariaLabel="Original dark theme"
          title="Original dark theme"
        />
        <MagneticButton
          onClick={() => handleVariantChange('teal')}
          className={`w-5 h-5 rounded-full border-2 transition-all duration-200 theme-transition ${
            variant === 'teal'
              ? 'ring-2 ring-accent/60 scale-105'
              : 'hover:scale-105'
          }`}
          style={{ 
            backgroundColor: '#070d10',
            borderColor: variant === 'teal'
              ? 'color-mix(in srgb, var(--border) 30%, transparent)'
              : 'color-mix(in srgb, var(--border) 50%, transparent)',
            boxSizing: 'border-box',
            opacity: 1,
            outline: 'none',
          }}
          ariaLabel="Deep teal theme"
          title="Deep teal theme"
        />
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={`dark-picker-${theme}`}
          variants={containerVariants}
          initial={shouldAnimate ? "hidden" : "visible"}
          animate="visible"
          exit="exit"
          className="flex items-center gap-2 h-5 theme-transition"
        >
          <motion.div variants={buttonVariants} style={{ display: 'flex', alignItems: 'center' }}>
          <MagneticButton
            onClick={() => handleVariantChange('original')}
            className={`w-5 h-5 rounded-full border-2 transition-all duration-200 theme-transition ${
              variant === 'original'
                ? 'ring-2 ring-accent/60 scale-105'
                : 'hover:scale-105'
            }`}
            style={{ 
              backgroundColor: '#1d232a',
              borderColor: variant === 'original'
                ? 'color-mix(in srgb, var(--border) 30%, transparent)'
                : 'color-mix(in srgb, var(--border) 50%, transparent)',
              boxSizing: 'border-box',
              opacity: 1,
              outline: 'none',
            }}
            ariaLabel="Original dark theme"
            title="Original dark theme"
          />
        </motion.div>
        <motion.div variants={buttonVariants} style={{ display: 'flex', alignItems: 'center' }}>
          <MagneticButton
            onClick={() => handleVariantChange('teal')}
            className={`w-5 h-5 rounded-full border-2 transition-all duration-200 theme-transition ${
              variant === 'teal'
                ? 'ring-2 ring-accent/60 scale-105'
                : 'hover:scale-105'
            }`}
            style={{ 
              backgroundColor: '#070d10',
              borderColor: variant === 'teal'
                ? 'color-mix(in srgb, var(--border) 30%, transparent)'
                : 'color-mix(in srgb, var(--border) 50%, transparent)',
              boxSizing: 'border-box',
              opacity: 1,
              outline: 'none',
            }}
            ariaLabel="Deep teal theme"
            title="Deep teal theme"
          />
        </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

