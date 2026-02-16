'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageTooltipProps {
  text: string
  children: React.ReactNode
  className?: string
  alignRight?: boolean // If true, align right edge of tooltip with right edge of element
  alignTopLeft?: boolean // If true, position cursor at top left of tooltip
}

// Truncate text to a reasonable length for tooltip
function truncateText(text: string, maxLength: number = 120): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

// Calculate tooltip position with edge collision detection
function calculateTooltipPosition(
  mouseX: number,
  mouseY: number,
  tooltipWidth: number,
  tooltipHeight: number,
  elementRight?: number, // Right edge of the element for alignment
  alignTopLeft?: boolean, // Position cursor at top left of tooltip
  preferTop?: boolean, // Prefer positioning above the cursor
  offset: number = 12
) {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // Position based on alignment preference
  let x: number
  let y: number

  if (alignTopLeft) {
    // Cursor at top left of tooltip
    x = mouseX + offset
    y = preferTop ? mouseY - tooltipHeight - offset : mouseY + offset
  } else {
    // Default: position down and to the left from cursor (cursor at top right)
    x = mouseX - tooltipWidth - offset
    y = preferTop ? mouseY - tooltipHeight - offset : mouseY + offset
  }

  // If right-align is enabled, align right edge of tooltip with right edge of element
  if (elementRight !== undefined) {
    x = elementRight - tooltipWidth
  }

  // Check left edge collision
  if (x < 0) {
    // If we're aligning right and it goes off left edge, position at left edge with margin
    if (elementRight !== undefined) {
      x = 8 // Small margin from left
    } else if (alignTopLeft) {
      // For top-left alignment, position at left edge with margin
      x = 8
    } else {
      // Otherwise, position to the right of cursor
      x = mouseX + offset
    }
  }

  // Check right edge collision
  if (x + tooltipWidth > viewportWidth) {
    if (alignTopLeft) {
      // For top-left alignment, position to the left of cursor
      x = mouseX - tooltipWidth - offset
      // If still off screen, position at right edge with margin
      if (x < 0) {
        x = viewportWidth - tooltipWidth - 8
      }
    } else {
      // Position to the left of cursor
      x = mouseX - tooltipWidth - offset
      // If still off screen, position at right edge with margin
      if (x < 0) {
        x = viewportWidth - tooltipWidth - 8
      }
    }
  }

  // Check bottom edge collision (only if not preferTop)
  if (!preferTop && y + tooltipHeight > viewportHeight) {
    // Position above cursor instead
    y = mouseY - tooltipHeight - offset
  }

  // Check top edge collision
  if (y < 0) {
    // Position below cursor instead
    y = mouseY + offset
    // If still off screen (too tall for viewport), position at top edge with margin
    if (y + tooltipHeight > viewportHeight) {
      y = 8
    }
  }

  return { x, y }
}

export function ImageTooltip({ text, children, className = '', alignRight = false, alignTopLeft = false, preferTop = false }: ImageTooltipProps & { preferTop?: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = (e: React.MouseEvent) => {
    const pos = { x: e.clientX, y: e.clientY }
    setMousePosition(pos)
    setIsHovered(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isHovered) {
      const newPos = { x: e.clientX, y: e.clientY }
      setMousePosition(newPos)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setShowTooltip(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  // Update tooltip position with collision detection
  useEffect(() => {
    if (showTooltip && tooltipRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        if (tooltipRef.current) {
          const tooltipRect = tooltipRef.current.getBoundingClientRect()
          const elementRight = alignRight && wrapperRef.current
            ? wrapperRef.current.getBoundingClientRect().right
            : undefined

          const position = calculateTooltipPosition(
            mousePosition.x,
            mousePosition.y,
            tooltipRect.width || 320, // Fallback width estimate (max-w-xs)
            tooltipRect.height || 60,   // Fallback height estimate
            elementRight,
            alignTopLeft,
            preferTop
          )
          setTooltipPosition(position)
        }
      })
    } else if (showTooltip) {
      // Initial position before measurement
      const elementRight = alignRight && wrapperRef.current
        ? wrapperRef.current.getBoundingClientRect().right
        : undefined

      const position = calculateTooltipPosition(
        mousePosition.x,
        mousePosition.y,
        320, // Estimate width (max-w-xs)
        60,   // Estimate height
        elementRight,
        alignTopLeft,
        preferTop
      )
      setTooltipPosition(position)
    }
  }, [mousePosition.x, mousePosition.y, showTooltip, alignRight, alignTopLeft])

  useEffect(() => {
    if (isHovered) {
      // Small delay before showing to avoid flickering
      timeoutRef.current = setTimeout(() => {
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
    return <>{children}</>
  }

  return (
    <div
      ref={wrapperRef}
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
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="fixed pointer-events-none z-[10001]"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
            }}
          >
            <div className="bg-black/90 backdrop-blur-sm text-white px-4 py-2.5 rounded-lg max-w-xs text-sm font-medium font-sans shadow-xl leading-relaxed">
              {displayText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

