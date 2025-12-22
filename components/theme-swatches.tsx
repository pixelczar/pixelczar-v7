'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import MagneticWrapper from '@/components/magnetic-wrapper'
import { ImageTooltip } from '@/components/image-tooltip'

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
    label: 'OG Light',
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
  const [darkVariant, setDarkVariant] = useState<'original' | 'teal'>('original')
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
    
    setMounted(true)
    // Small delay to ensure DOM is ready, then allow transitions
    setTimeout(() => setHasInitialized(true), 0)
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

  if (!mounted) {
    // Return empty div with same dimensions to prevent layout shift
    return (
      <div className="flex items-center gap-2 h-5">
        {swatches.map((swatch) => (
          <div
            key={swatch.id}
            className="w-5 h-5 rounded-md border-2"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
          />
        ))}
      </div>
    )
  }

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
    <div className="flex items-center gap-2 h-5">
      {swatches.map((swatch) => {
        const isSelected = currentTheme === swatch.id
        // Use dark border and dark fill for light swatch when in light mode
        const borderColor = swatch.id === 'light' && isLightMode 
          ? '#2d3748' // Use foreground color from light theme
          : swatch.borderColor
        
        // For light swatch in light mode, use dark color for fill
        const fillColor = swatch.id === 'light' && isLightMode
          ? '#2d3748' // Dark color for fill
          : swatch.backgroundColor
        
        return (
          <ImageTooltip key={swatch.id} text={swatch.label} alignRight>
            <MagneticWrapper
              strength={0.3}
              data-cursor-rounded="full"
              className="p-0.5"
            >
              <motion.button
                onClick={() => handleSwatchClick(swatch)}
                className={`cursor-hover relative w-5 h-5 rounded-md border focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background group ${
                  hasInitialized ? 'transition-all duration-300' : ''
                }`}
                style={{
                  backgroundColor: isSelected 
                    ? colorToRgba(fillColor, 0.2) // 30% fill when active
                    : colorToRgba(fillColor, 0.3), // 60% fill when inactive
                  borderColor: borderColor, // Border color - dark for light swatch in light mode
                  opacity: isSelected ? 1 : 0.6, // Element opacity: 100% when active, 60% when inactive (affects border too)
                }}
                whileHover={{ 
                  opacity: 1, // 100% on hover
                  backgroundColor: colorToRgba(fillColor, 1), // Full opacity fill on hover
                }}
                aria-label={swatch.label}
              />
            </MagneticWrapper>
          </ImageTooltip>
        )
      })}
    </div>
  )
}

