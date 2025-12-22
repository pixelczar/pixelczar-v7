'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageTooltipProps {
  text: string
  children: React.ReactNode
  className?: string
  alignRight?: boolean // If true, align right edge of tooltip with right edge of element
}

// Truncate text to a reasonable length for tooltip
function truncateText(text: string, maxLength: number = 60): string {
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
  offset: number = 12
) {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  // Always position down and to the left from cursor
  let x = mouseX - tooltipWidth - offset
  let y = mouseY + offset
  
  // If right-align is enabled, align right edge of tooltip with right edge of element
  if (elementRight !== undefined) {
    x = elementRight - tooltipWidth
  }
  
  // Check left edge collision
  if (x < 0) {
    // If we're aligning right and it goes off left edge, position at left edge with margin
    if (elementRight !== undefined) {
      x = 8 // Small margin from left
    } else {
      // Otherwise, position to the right of cursor
      x = mouseX + offset
    }
  }
  
  // Check right edge collision
  if (x + tooltipWidth > viewportWidth) {
    // Position to the left of cursor
    x = mouseX - tooltipWidth - offset
    // If still off screen, position at right edge with margin
    if (x < 0) {
      x = viewportWidth - tooltipWidth - 8
    }
  }
  
  // Check bottom edge collision
  if (y + tooltipHeight > viewportHeight) {
    // Position above cursor instead
    y = mouseY - tooltipHeight - offset
    // If still off screen, position at bottom edge with margin
    if (y < 0) {
      y = viewportHeight - tooltipHeight - 8
    }
  }
  
  return { x, y }
}

export function ImageTooltip({ text, children, className = '', alignRight = false }: ImageTooltipProps) {
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
            tooltipRect.width || 200, // Fallback width estimate
            tooltipRect.height || 40,   // Fallback height estimate
            elementRight
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
        200, // Estimate width
        40,   // Estimate height
        elementRight
      )
      setTooltipPosition(position)
    }
  }, [mousePosition.x, mousePosition.y, showTooltip, alignRight])

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
            <div className="bg-black/90 backdrop-blur-sm text-white px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium font-sans shadow-xl">
              {displayText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

