'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageTooltipProps {
  text: string
  children: React.ReactNode
  className?: string
}

// Truncate text to a reasonable length for tooltip
function truncateText(text: string, maxLength: number = 60): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function ImageTooltip({ text, children, className = '' }: ImageTooltipProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (e: React.MouseEvent) => {
    const pos = { x: e.clientX, y: e.clientY }
    setMousePosition(pos)
    setIsHovered(true)
    console.log('🟢 Tooltip hover enter', { text: text.substring(0, 30), pos })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isHovered) {
      const newPos = { x: e.clientX, y: e.clientY }
      setMousePosition(newPos)
    }
  }

  const handleMouseLeave = () => {
    console.log('🔴 Tooltip hover leave')
    setIsHovered(false)
    setShowTooltip(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  useEffect(() => {
    if (isHovered) {
      // Small delay before showing to avoid flickering
      timeoutRef.current = setTimeout(() => {
        console.log('✅ Setting showTooltip to true', { mousePosition, text: text.substring(0, 30) })
        setShowTooltip(true)
      }, 150)
    } else {
      setShowTooltip(false)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [isHovered, mousePosition.x, mousePosition.y, text])

  const displayText = text ? truncateText(text) : ''

  // Don't render tooltip wrapper if no text
  if (!text) {
    console.log('⚠️ No text provided to ImageTooltip')
    return <>{children}</>
  }

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {showTooltip && displayText && (
          <motion.div
            key="tooltip"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="fixed pointer-events-none z-[10001]"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
              transform: 'translate(12px, calc(-100% - 12px))',
            }}
          >
            <div className="bg-black/90 backdrop-blur-sm text-white px-4 py-2 rounded-full whitespace-nowrap text-base font-medium font-sans shadow-xl">
              {displayText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

