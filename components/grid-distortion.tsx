"use client"

import { useRef, useEffect, useState, useCallback } from "react"

export interface EffectParams {
  grid: number
  hoverDistance: number
  clickExplosion: number
  strength: number
  relaxation: number
  bounceCount: number
  monochrome: boolean
}

interface GridDistortionProps {
  grid?: number
  hoverDistance?: number
  clickExplosion?: number
  strength?: number
  relaxation?: number
  bounceCount?: number
  monochrome?: boolean
  imageSrc: string
  className?: string
}

const GridDistortion = ({
  grid = 24,
  hoverDistance = 3,
  clickExplosion = 200,
  strength = 0.5,
  relaxation = 0.12,
  bounceCount = 4,
  monochrome = false,
  imageSrc,
  className = "",
}: GridDistortionProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const tilesRef = useRef<HTMLDivElement[]>([])
  const hoverOffsetsRef = useRef<Float32Array | null>(null)
  const clickOffsetsRef = useRef<Float32Array | null>(null)
  const animationRef = useRef<number>(0)
  const paramsRef = useRef({ grid, hoverDistance, clickExplosion, strength, relaxation, bounceCount, monochrome })
  const mouseRef = useRef({ x: -9999, y: -9999, clicked: false, clickX: 0, clickY: 0 })
  const dimsRef = useRef({ w: 0, h: 0, tileW: 0, tileH: 0 })
  const [tiles, setTiles] = useState<number[]>([])

  useEffect(() => {
    paramsRef.current = { grid, hoverDistance, clickExplosion, strength, relaxation, bounceCount, monochrome }
  }, [grid, hoverDistance, clickExplosion, strength, relaxation, bounceCount, monochrome])

  // Generate tile indices when grid changes
  useEffect(() => {
    const n = grid
    setTiles(Array.from({ length: n * n }, (_, i) => i))
    hoverOffsetsRef.current = new Float32Array(n * n * 2)
    clickOffsetsRef.current = new Float32Array(n * n * 2)
    tilesRef.current = []
  }, [grid])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateDims = () => {
      const rect = container.getBoundingClientRect()
      const n = paramsRef.current.grid
      dimsRef.current = {
        w: rect.width,
        h: rect.height,
        tileW: rect.width / n,
        tileH: rect.height / n,
      }
    }

    const ro = new ResizeObserver(updateDims)
    ro.observe(container)
    updateDims()

    const onMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect()
      mouseRef.current.x = e.clientX - r.left
      mouseRef.current.y = e.clientY - r.top
    }

    const onLeave = () => {
      mouseRef.current.x = -9999
      mouseRef.current.y = -9999
    }

    const onClick = (e: MouseEvent) => {
      const r = container.getBoundingClientRect()
      mouseRef.current.clicked = true
      mouseRef.current.clickX = e.clientX - r.left
      mouseRef.current.clickY = e.clientY - r.top
    }

    container.addEventListener("mousemove", onMove, { passive: true })
    container.addEventListener("mouseleave", onLeave, { passive: true })
    container.addEventListener("click", onClick)

    let running = true

    const loop = () => {
      if (!running) return
      animationRef.current = requestAnimationFrame(loop)

      const hoverOffsets = hoverOffsetsRef.current
      const clickOffsets = clickOffsetsRef.current
      const tileEls = tilesRef.current
      if (!hoverOffsets || !clickOffsets || tileEls.length === 0) return

      const p = paramsRef.current
      const { w, h, tileW, tileH } = dimsRef.current
      if (w === 0) return

      const n = p.grid
      const mouse = mouseRef.current
      const radius = p.hoverDistance * tileW
      const radiusSq = radius * radius
      const push = p.strength * tileW
      const hoverHeal = p.relaxation
      const clickHeal = p.relaxation * 0.7 // Much faster heal for click

      // Click explosion
      if (mouse.clicked) {
        const str = p.clickExplosion * 0.4
        const maxD = Math.max(w, h) * 0.5
        for (let row = 0; row < n; row++) {
          for (let col = 0; col < n; col++) {
            const cx = (col + 0.5) * tileW
            const cy = (row + 0.5) * tileH
            const dx = cx - mouse.clickX
            const dy = cy - mouse.clickY
            const d = Math.hypot(dx, dy)
            if (d < maxD && d > 1) {
              const f = str * Math.pow(1 - d / maxD, 2)
              const idx = (row * n + col) * 2
              clickOffsets[idx] += (dx / d) * f
              clickOffsets[idx + 1] += (dy / d) * f
            }
          }
        }
        mouse.clicked = false
      }

      // Update and apply transforms
      for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
          const i = row * n + col
          const idx = i * 2
          
          // Hover offsets
          let hx = hoverOffsets[idx]
          let hy = hoverOffsets[idx + 1]

          // Hover push
          const cx = (col + 0.5) * tileW
          const cy = (row + 0.5) * tileH
          const dx = cx - mouse.x
          const dy = cy - mouse.y
          const distSq = dx * dx + dy * dy

          if (distSq < radiusSq && distSq > 1) {
            const dist = Math.sqrt(distSq)
            const falloff = 1 - dist / radius
            const force = push * falloff * falloff
            hx += (dx / dist) * force * 0.25
            hy += (dy / dist) * force * 0.25
          }

          // Heal hover (fast)
          hx *= 1 - hoverHeal
          hy *= 1 - hoverHeal
          if (Math.abs(hx) < 0.1) hx = 0
          if (Math.abs(hy) < 0.1) hy = 0
          hoverOffsets[idx] = hx
          hoverOffsets[idx + 1] = hy

          // Heal click (much faster now)
          let cx2 = clickOffsets[idx]
          let cy2 = clickOffsets[idx + 1]
          cx2 *= 1 - clickHeal
          cy2 *= 1 - clickHeal
          if (Math.abs(cx2) < 0.1) cx2 = 0
          if (Math.abs(cy2) < 0.1) cy2 = 0
          clickOffsets[idx] = cx2
          clickOffsets[idx + 1] = cy2

          // Combined offset
          const ox = hx + cx2
          const oy = hy + cy2

          // Apply transform
          const el = tileEls[i]
          if (el) {
            if (ox === 0 && oy === 0) {
              el.style.transform = ""
            } else {
              el.style.transform = `translate3d(${ox}px,${oy}px,0)`
            }
          }
        }
      }
    }

    loop()

    return () => {
      running = false
      cancelAnimationFrame(animationRef.current)
      ro.disconnect()
      container.removeEventListener("mousemove", onMove)
      container.removeEventListener("mouseleave", onLeave)
      container.removeEventListener("click", onClick)
    }
  }, [tiles.length])

  const n = paramsRef.current.grid

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        backgroundColor: "#000",
      }}
    >
      {tiles.map((i) => {
        const row = Math.floor(i / n)
        const col = i % n
        return (
          <div
            key={i}
            ref={(el) => {
              if (el) tilesRef.current[i] = el
            }}
            style={{
              position: "absolute",
              left: `${(col / n) * 100}%`,
              top: `${(row / n) * 100}%`,
              width: `${(100 / n) * 1.04}%`, // Slightly larger to prevent gaps
              height: `${(100 / n) * 1.04}%`, // Slightly larger to prevent gaps
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: `${n * 100}% ${n * 100}%`,
              backgroundPosition: `${(col / (n - 1)) * 100}% ${(row / (n - 1)) * 100}%`,
              willChange: "transform",
              filter: monochrome ? "grayscale(1)" : undefined,
            }}
          />
        )
      })}
    </div>
  )
}

export default GridDistortion
