"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { SlidersHorizontal, X, RefreshCw } from "lucide-react"
import type { EffectParams } from "./grid-distortion"

interface MosaicControlsProps {
  params: EffectParams
  onParamsChange: (params: EffectParams) => void
  visible?: boolean
}

interface SliderProps {
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  label: string
  format?: (v: number) => string
}

function MagneticSlider({ value, min, max, step, onChange, label, format }: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 })

  const percentage = ((value - min) / (max - min)) * 100

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const thumbX = rect.left + (percentage / 100) * rect.width
    const thumbY = rect.top + rect.height / 2
    
    const dx = e.clientX - thumbX
    const dy = e.clientY - thumbY
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    if (dist < 30 && !isDragging) {
      setMagneticOffset({
        x: dx * 0.2,
        y: dy * 0.2,
      })
    } else if (!isDragging) {
      setMagneticOffset({ x: 0, y: 0 })
    }
  }

  const handleMouseLeave = () => {
    if (!isDragging) {
      setMagneticOffset({ x: 0, y: 0 })
    }
  }

  const updateValue = useCallback((clientX: number) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const rawValue = min + percent * (max - min)
    const steppedValue = Math.round(rawValue / step) * step
    const clampedValue = Math.max(min, Math.min(max, steppedValue))
    onChange(clampedValue)
  }, [min, max, step, onChange])

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setMagneticOffset({ x: 0, y: 0 })
    updateValue(e.clientX)
    
    const handlePointerMove = (e: PointerEvent) => {
      updateValue(e.clientX)
    }
    
    const handlePointerUp = () => {
      setIsDragging(false)
      setMagneticOffset({ x: 0, y: 0 })
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
    
    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
  }

  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between">
        <label className="text-xs text-white/50 font-sans lowercase tracking-wide">
          {label}
        </label>
        <span className="text-xs text-white/40 font-sans tabular-nums">
          {format ? format(value) : value}
        </span>
      </div>
      <div
        ref={trackRef}
        className="relative h-5 flex items-center touch-none select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
      >
        {/* Track */}
        <div className="absolute inset-x-0 h-1 rounded-full bg-white/10">
          {/* Range */}
          <div 
            className={`absolute h-full rounded-full transition-colors duration-150 ${
              isDragging ? 'bg-[hsl(var(--accent))]' : 'bg-white/25'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {/* Thumb */}
        <motion.div
          className={`absolute w-2.5 h-2.5 rounded-full shadow-sm transition-colors duration-150 ${
            isDragging 
              ? 'bg-[hsl(var(--accent))] scale-110' 
              : 'bg-white/80 hover:bg-white'
          }`}
          style={{ 
            left: `calc(${percentage}% - 5px)`,
          }}
          animate={{
            x: magneticOffset.x,
            y: magneticOffset.y,
            scale: isDragging ? 1.2 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            mass: 0.5,
          }}
        />
      </div>
    </div>
  )
}

export default function MosaicControls({ params, onParamsChange, visible = true }: MosaicControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateParam = useCallback((key: keyof EffectParams, value: number | boolean) => {
    onParamsChange({
      ...params,
      [key]: value,
    })
  }, [params, onParamsChange])

  const randomizeParams = useCallback(() => {
    const newParams: EffectParams = {
      grid: Math.floor(Math.random() * (24 - 4 + 1)) + 4,
      hoverDistance: Number((Math.random() * (6 - 0.5) + 0.5).toFixed(1)),
      strength: Number((Math.random() * (1 - 0.05) + 0.05).toFixed(2)),
      relaxation: Number((Math.random() * (0.3 - 0.03) + 0.03).toFixed(2)),
      clickExplosion: Math.round((Math.random() * 500) / 10) * 10,
      monochrome: Math.random() > 0.5,
      bounceCount: params.bounceCount, // Keep existing bounceCount as it's not in the UI
    }
    onParamsChange(newParams)
  }, [params.bounceCount, onParamsChange])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="absolute top-3 right-3 z-10 hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <motion.button
                key="toggle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                onClick={() => setIsExpanded(true)}
                className="w-8 h-8 rounded-md bg-black/80 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors duration-150"
                aria-label="Open effect controls"
              >
                <SlidersHorizontal className="w-4 h-4 text-[hsl(var(--accent))]" />
              </motion.button>
            ) : (
              <motion.div
                key="panel"
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="bg-black/80 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-[180px]"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/80 font-sans tracking-wide">
                      Effect
                    </span>
                    <button
                      onClick={randomizeParams}
                      className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/10 transition-colors duration-150 group"
                      title="Randomize parameters"
                      aria-label="Randomize parameters"
                    >
                      <RefreshCw className="w-3 h-3 text-white/40 group-hover:text-[hsl(var(--accent))] transition-colors" />
                    </button>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/10 transition-colors duration-150"
                    aria-label="Close controls"
                  >
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>

                {/* Controls */}
                <div className="px-3 py-2.5 space-y-2">
                  <MagneticSlider
                    value={params.grid}
                    min={4}
                    max={24}
                    step={1}
                    onChange={(v) => updateParam("grid", v)}
                    label="grid"
                  />

                  <MagneticSlider
                    value={params.hoverDistance}
                    min={0.5}
                    max={6}
                    step={0.1}
                    onChange={(v) => updateParam("hoverDistance", v)}
                    label="radius"
                    format={(v) => v.toFixed(1)}
                  />

                  <MagneticSlider
                    value={params.strength}
                    min={0.05}
                    max={1}
                    step={0.01}
                    onChange={(v) => updateParam("strength", v)}
                    label="strength"
                    format={(v) => v.toFixed(2)}
                  />

                  <MagneticSlider
                    value={params.relaxation}
                    min={0.03}
                    max={0.3}
                    step={0.01}
                    onChange={(v) => updateParam("relaxation", v)}
                    label="heal"
                    format={(v) => v.toFixed(2)}
                  />

                  <MagneticSlider
                    value={params.clickExplosion}
                    min={0}
                    max={500}
                    step={10}
                    onChange={(v) => updateParam("clickExplosion", v)}
                    label="click"
                  />

                  {/* Monochrome Toggle */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                    <label className="text-xs text-white/50 font-sans lowercase tracking-wide">
                      mono
                    </label>
                    <Switch
                      checked={params.monochrome}
                      onCheckedChange={(checked) => updateParam("monochrome", checked)}
                      className="scale-[0.65] origin-right data-[state=checked]:bg-[hsl(var(--accent))] data-[state=unchecked]:bg-white/15"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
