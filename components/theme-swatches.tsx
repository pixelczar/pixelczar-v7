'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import MagneticWrapper from '@/components/magnetic-wrapper'
import { ImageTooltip } from '@/components/image-tooltip'
import { smoothEase } from '@/lib/animations'

const swatchContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
}

const swatchItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: smoothEase,
    },
  },
}

type ThemeOption = 'light' | 'dark-original' | 'dark-teal'

interface ThemeSwatch {
  id: ThemeOption
  label: string
  backgroundColor: string
  borderColor: string
  theme: 'light' | 'dark'
  variant?: 'original' | 'teal'
}

const swatches: ThemeSwatch[] = [
  {
    id: 'light',
    label: 'Polar Express',
    backgroundColor: '#ffffff', // white
    borderColor: '#ffffff', // white
    theme: 'light',
  },
  {
    id: 'dark-original',
    label: 'OG Dark',
    backgroundColor: 'hsl(340 71% 56%)', // accent color from dark original theme
    borderColor: 'hsl(340 71% 56%)', // accent color from dark original theme
    theme: 'dark',
    variant: 'original',
  },
  {
    id: 'dark-teal',
    label: 'Czarface',
    backgroundColor: 'hsl(65 100% 50%)', // accent color from dark teal theme
    borderColor: 'hsl(65 100% 50%)', // accent color from dark teal theme
    theme: 'dark',
    variant: 'teal',
  },
]

export default function ThemeSwatches() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>('light')
  const [darkVariant, setDarkVariant] = useState<'original' | 'teal'>('teal')
  const [isLightMode, setIsLightMode] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    // Read directly from DOM to avoid transitions
    const htmlElement = document.documentElement
    const isDark = htmlElement.classList.contains('dark')
    const variant = htmlElement.getAttribute('data-dark-variant') || 'original'

    setIsLightMode(!isDark)
    setDarkVariant(variant as 'original' | 'teal')

    // Set current theme immediately based on DOM state
    if (isDark) {
      setCurrentTheme(variant === 'teal' ? 'dark-teal' : 'dark-original')
    } else {
      setCurrentTheme('light')
    }

    // Use requestAnimationFrame to ensure DOM is ready, then show immediately
    requestAnimationFrame(() => {
      setMounted(true)
      setHasInitialized(true)
    })
  }, [])

  const handleSwatchClick = (swatch: ThemeSwatch) => {
    if (!mounted) return

    // Add theme-changing class to prevent flicker
    document.documentElement.classList.add('theme-changing')

    // Update theme
    if (swatch.theme === 'light') {
      setTheme('light')
      setCurrentTheme('light')
      localStorage.setItem('pixel-czar-theme', 'light')
      // Remove dark class if present
      document.documentElement.classList.remove('dark')
    } else {
      setTheme('dark')
      setCurrentTheme(swatch.id)
      localStorage.setItem('pixel-czar-theme', 'dark')

      // Set dark variant
      if (swatch.variant) {
        setDarkVariant(swatch.variant)
        localStorage.setItem('dark-theme-variant', swatch.variant)
        document.documentElement.setAttribute('data-dark-variant', swatch.variant)
        // Ensure dark class is present
        document.documentElement.classList.add('dark')
      }
    }

    // Remove theme-changing class after transition completes
    setTimeout(() => {
      document.documentElement.classList.remove('theme-changing')
    }, 300)
  }

  // Sync with theme changes from elsewhere (but skip initial mount since we handle it above)
  useEffect(() => {
    if (!mounted) return

    const htmlElement = document.documentElement
    const isDark = htmlElement.classList.contains('dark')
    const variant = htmlElement.getAttribute('data-dark-variant') || 'original'

    setIsLightMode(!isDark)

    if (isDark) {
      setCurrentTheme(variant === 'teal' ? 'dark-teal' : 'dark-original')
      setDarkVariant(variant as 'original' | 'teal')
    } else {
      setCurrentTheme('light')
    }
  }, [theme, resolvedTheme, mounted])

  // Helper to convert hex or hsl to rgba
  const colorToRgba = (color: string, alpha: number) => {
    // Handle HSL colors (e.g., "hsl(340 71% 56%)")
    if (color.startsWith('hsl')) {
      // Extract HSL values
      const match = color.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/)
      if (match) {
        const h = parseInt(match[1])
        const s = parseInt(match[2])
        const l = parseInt(match[3])
        // Convert HSL to RGB
        const c = (1 - Math.abs(2 * (l / 100) - 1)) * (s / 100)
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
        const m = (l / 100) - c / 2

        let r = 0, g = 0, b = 0
        if (h < 60) { r = c; g = x; b = 0 }
        else if (h < 120) { r = x; g = c; b = 0 }
        else if (h < 180) { r = 0; g = c; b = x }
        else if (h < 240) { r = 0; g = x; b = c }
        else if (h < 300) { r = x; g = 0; b = c }
        else { r = c; g = 0; b = x }

        return `rgba(${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)}, ${alpha})`
      }
    }

    // Handle hex colors (e.g., "#ffffff")
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16)
      const g = parseInt(color.slice(3, 5), 16)
      const b = parseInt(color.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    // Fallback
    return color
  }

  return (
    <motion.div
      className="flex items-center h-5 -space-x-2"
      style={{
        width: '5.5rem', // Fixed width: 3 swatches (1.5rem each with padding) + 2 gaps (0.5rem each) = 5.5rem
      }}
      variants={swatchContainerVariants}
      initial="hidden"
      animate={mounted ? "visible" : "hidden"}
    >
      {swatches.map((swatch) => {
        const isSelected = currentTheme === swatch.id

        // Light mode overrides for each swatch
        let borderColor = swatch.borderColor
        let fillColor = swatch.backgroundColor

        if (isLightMode) {
          if (swatch.id === 'light') {
            borderColor = '#f0f1f2'
            fillColor = '#f0f1f2'
          } else if (swatch.id === 'dark-original') {
            // OG Pink: pink border, pink bg
            borderColor = swatch.backgroundColor // pink
            fillColor = swatch.backgroundColor // pink
          } else if (swatch.id === 'dark-teal') {
            // Czarface: dark border, yellow bg
            borderColor = '#1a1a1a'
            fillColor = swatch.backgroundColor // yellow
          }
        }

        return (
          <motion.div key={swatch.id} variants={swatchItemVariants}>
            <ImageTooltip text={swatch.label} alignRight preferTop>
              <MagneticWrapper
                strength={0.3}
                className=""
              >
                <motion.button
                  onClick={() => handleSwatchClick(swatch)}
                  data-cursor-rounded="full"
                  className={`cursor-hover relative w-8 h-8 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all focus:ring-offset-background group ${hasInitialized ? 'transition-all duration-300' : ''
                    }`}
                  whileHover={{
                    opacity: 1, // 100% on hover
                  }}
                  aria-label={swatch.label}
                >
                  <span
                    className={`w-2.5 h-2.5 border ${hasInitialized ? 'transition-all duration-300' : ''}`}
                    style={{
                      backgroundColor: isSelected
                        ? colorToRgba(fillColor, 1)
                        : colorToRgba(fillColor, 1),
                      borderColor: borderColor,
                    }}
                  />
                </motion.button>
              </MagneticWrapper>
            </ImageTooltip>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

