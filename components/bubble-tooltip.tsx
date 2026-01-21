"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BubbleTooltipProps {
  text: string
  children: React.ReactNode
  className?: string
  alignRight?: boolean 
  alignTopLeft?: boolean
  offset?: number
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
  elementRight?: number, 
  alignTopLeft?: boolean,
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
    y = mouseY + offset
  } else {
    // Default: position down and to the left from cursor (cursor at top right)
    x = mouseX - tooltipWidth - offset
    y = mouseY + offset
  }
  
  // If right-align is enabled, align right edge of tooltip with right edge of element
  if (elementRight !== undefined) {
    x = elementRight - tooltipWidth
  }
  
  // Check left edge collision
  if (x < 0) {
    if (elementRight !== undefined) {
      x = 8 
    } else if (alignTopLeft) {
      x = 8
    } else {
      x = mouseX + offset
    }
  }
  
  // Check right edge collision
  if (x + tooltipWidth > viewportWidth) {
    if (alignTopLeft) {
      x = mouseX - tooltipWidth - offset
      if (x < 0) {
        x = viewportWidth - tooltipWidth - 8
      }
    } else {
      x = mouseX - tooltipWidth - offset
      if (x < 0) {
        x = viewportWidth - tooltipWidth - 8
      }
    }
  }
  
  // Check bottom edge collision
  if (y + tooltipHeight > viewportHeight) {
    y = mouseY - tooltipHeight - offset
    if (y < 0) {
      y = viewportHeight - tooltipHeight - 8
    }
  }
  
  return { x, y }
}

export function BubbleTooltip({ 
  text, 
  children, 
  className = '', 
  alignRight = false, 
  alignTopLeft = false,
  offset = 12
}: BubbleTooltipProps) {
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

  useEffect(() => {
    if (showTooltip && tooltipRef.current) {
      requestAnimationFrame(() => {
        if (tooltipRef.current) {
          const tooltipRect = tooltipRef.current.getBoundingClientRect()
          const elementRight = alignRight && wrapperRef.current
            ? wrapperRef.current.getBoundingClientRect().right
            : undefined
          
          const position = calculateTooltipPosition(
            mousePosition.x,
            mousePosition.y,
            tooltipRect.width || 200,
            tooltipRect.height || 40,
            elementRight,
            alignTopLeft,
            offset
          )
          setTooltipPosition(position)
        }
      })
    } else if (showTooltip) {
      const elementRight = alignRight && wrapperRef.current
        ? wrapperRef.current.getBoundingClientRect().right
        : undefined
      
      const position = calculateTooltipPosition(
        mousePosition.x,
        mousePosition.y,
        200,
        40,
        elementRight,
        alignTopLeft,
        offset
      )
      setTooltipPosition(position)
    }
  }, [mousePosition.x, mousePosition.y, showTooltip, alignRight, alignTopLeft, offset])

  useEffect(() => {
    if (isHovered) {
      timeoutRef.current = setTimeout(() => {
        setShowTooltip(true)
      }, 50) // Faster response for bubble tooltip
    } else {
      setShowTooltip(false)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [isHovered, mousePosition.x, mousePosition.y])

  const displayText = text ? truncateText(text) : ''

  if (!text) {
    return <>{children}</>
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-block ${className}`}
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
            initial={{ opacity: 0, scale: 0.5, y: 10, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 10, rotate: 5 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
            className="fixed pointer-events-none z-[10001]"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transformOrigin: "center bottom",
            }}
          >
            <div className="bg-foreground text-background px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium font-sans shadow-2xl border border-border/10 backdrop-blur-md relative">
              {displayText}
              {/* Optional: Add a small triangle for the bubble tip */}
              <div 
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45"
                style={{ clipPath: "polygon(100% 100%, 0% 100%, 100% 0%)" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
