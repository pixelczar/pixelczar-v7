'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'

type DarkThemeVariant = 'midnight' | 'original' | 'teal'

export default function DarkThemePicker() {
  const { theme } = useTheme()
  const [variant, setVariant] = useState<DarkThemeVariant>('original')
  const [mounted, setMounted] = useState(false)

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

  const handleVariantChange = (newVariant: DarkThemeVariant) => {
    setVariant(newVariant)
    localStorage.setItem('dark-theme-variant', newVariant)
    document.documentElement.setAttribute('data-dark-variant', newVariant)
  }

  if (!mounted) return null
  
  // Only show in dark mode
  if (theme !== 'dark') return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-1.5"
      >
        <button
          onClick={() => handleVariantChange('midnight')}
          className={`w-6 h-6 rounded border transition-all duration-200 ${
            variant === 'midnight'
              ? 'ring-1 ring-accent/60 scale-105'
              : 'opacity-70 hover:opacity-100 hover:scale-105'
          }`}
          style={{ 
            backgroundColor: '#0a0e27',
            borderColor: variant === 'midnight' 
              ? 'color-mix(in srgb, var(--border) 30%, transparent)'
              : 'color-mix(in srgb, var(--border) 50%, transparent)'
          }}
          aria-label="Midnight blue theme"
          title="Midnight blue theme"
        />
        <button
          onClick={() => handleVariantChange('original')}
          className={`w-6 h-6 rounded border transition-all duration-200 ${
            variant === 'original'
              ? 'ring-1 ring-accent/60 scale-105'
              : 'opacity-70 hover:opacity-100 hover:scale-105'
          }`}
          style={{ 
            backgroundColor: '#1d232a',
            borderColor: variant === 'original'
              ? 'color-mix(in srgb, var(--border) 30%, transparent)'
              : 'color-mix(in srgb, var(--border) 50%, transparent)'
          }}
          aria-label="Original dark theme"
          title="Original dark theme"
        />
        <button
          onClick={() => handleVariantChange('teal')}
          className={`w-6 h-6 rounded border transition-all duration-200 ${
            variant === 'teal'
              ? 'ring-1 ring-accent/60 scale-105'
              : 'opacity-70 hover:opacity-100 hover:scale-105'
          }`}
          style={{ 
            backgroundColor: '#070d10',
            borderColor: variant === 'teal'
              ? 'color-mix(in srgb, var(--border) 30%, transparent)'
              : 'color-mix(in srgb, var(--border) 50%, transparent)'
          }}
          aria-label="Deep teal theme"
          title="Deep teal theme"
        />
      </motion.div>
    </div>
  )
}

