"use client"

import { useRef, useEffect } from "react"
import * as THREE from "three"

const vertexShader = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const fragmentShader = `
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec4 offset = texture2D(uDataTexture, vUv);
  vec4 color = texture2D(uTexture, uv - 0.02 * offset.rg);
  gl_FragColor = color;
}`

interface GridDistortionProps {
  grid?: number
  mouse?: number
  strength?: number
  relaxation?: number
  imageSrc: string
  className?: string
}

const GridDistortion = ({
  grid = 15,
  mouse = 0.1,
  strength = 0.15,
  relaxation = 0.9,
  imageSrc,
  className = "",
}: GridDistortionProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null)
  const planeRef = useRef<THREE.Mesh | null>(null)
  const imageAspectRef = useRef(1)
  const animationIdRef = useRef<number | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const frozenRef = useRef(false)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    })
    // Set pixel ratio but ensure it doesn't create oversized canvas
    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    renderer.setPixelRatio(pixelRatio)
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer

    container.innerHTML = ""
    const canvas = renderer.domElement
    canvas.style.display = "block"
    canvas.style.width = "100%"
    canvas.style.height = "100%"
    canvas.style.maxWidth = "100%"
    canvas.style.maxHeight = "100%"
    canvas.style.objectFit = "contain"
    container.appendChild(canvas)

    // Store pixelRatio for use in handleResize
    const pixelRatioRef = { current: pixelRatio }

    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000)
    camera.position.z = 2
    cameraRef.current = camera

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uTexture: { value: null as THREE.Texture | null },
      uDataTexture: { value: null as THREE.DataTexture | null },
    }

    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(imageSrc, (texture) => {
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.wrapS = THREE.ClampToEdgeWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
      imageAspectRef.current = texture.image.width / texture.image.height
      uniforms.uTexture.value = texture
      handleResize()
    })

    const size = grid
    const data = new Float32Array(4 * size * size)
    // Initialize with zeros so the image starts clean (no initial distortion)
    for (let i = 0; i < size * size; i++) {
      data[i * 4] = 0
      data[i * 4 + 1] = 0
    }

    const dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType)
    dataTexture.needsUpdate = true
    uniforms.uDataTexture.value = dataTexture

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    })

    const geometry = new THREE.PlaneGeometry(1, 1, size - 1, size - 1)
    const plane = new THREE.Mesh(geometry, material)
    planeRef.current = plane
    scene.add(plane)

    const handleResize = () => {
      if (!container || !renderer || !camera) return

      const rect = container.getBoundingClientRect()
      const width = Math.floor(rect.width)
      const height = Math.floor(rect.height)

      if (width === 0 || height === 0) return

      const containerAspect = width / height

      // Set renderer size - the third parameter false means don't update style
      // We'll handle styling manually to ensure proper constraints
      renderer.setSize(width, height, false)
      
      // Update canvas element styles to match container exactly
      const canvas = renderer.domElement
      canvas.setAttribute('width', String(Math.floor(width * pixelRatioRef.current)))
      canvas.setAttribute('height', String(Math.floor(height * pixelRatioRef.current)))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      canvas.style.maxWidth = "100%"
      canvas.style.maxHeight = "100%"
      canvas.style.display = "block"

      if (plane && imageAspectRef.current) {
        const imageAspect = imageAspectRef.current
        if (containerAspect > imageAspect) {
          // Container is wider than image - fit height, center width
          plane.scale.set(imageAspect, 1, 1)
        } else {
          // Container is taller than image - fit width, center height
          plane.scale.set(containerAspect, containerAspect / imageAspect, 1)
        }
      }

      const frustumHeight = 1
      const frustumWidth = frustumHeight * containerAspect
      camera.left = -frustumWidth / 2
      camera.right = frustumWidth / 2
      camera.top = frustumHeight / 2
      camera.bottom = -frustumHeight / 2
      camera.updateProjectionMatrix()

      uniforms.resolution.value.set(width, height, 1, 1)
    }

    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        handleResize()
      })
      resizeObserver.observe(container)
      resizeObserverRef.current = resizeObserver
    } else {
      window.addEventListener("resize", handleResize)
    }

    const mouseState = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vX: 0,
      vY: 0,
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = 1 - (e.clientY - rect.top) / rect.height
      mouseState.vX = x - mouseState.prevX
      mouseState.vY = y - mouseState.prevY
      mouseState.x = x
      mouseState.y = y
      mouseState.prevX = x
      mouseState.prevY = y
    }

    const handleMouseLeave = () => {
      // Reset mouse state - this will allow the relaxation animation to smoothly heal
      // The existing relaxation logic in the animate loop will handle animating back to zero
      mouseState.x = 0
      mouseState.y = 0
      mouseState.prevX = 0
      mouseState.prevY = 0
      mouseState.vX = 0
      mouseState.vY = 0
    }

    const handleClick = () => {
      frozenRef.current = !frozenRef.current
      setTimeout(() => {
        frozenRef.current = false
      }, 2000)
    }

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)
    container.addEventListener("click", handleClick)

    handleResize()

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      if (!renderer || !scene || !camera) return

      uniforms.time.value += 0.05

      const data = dataTexture.image.data
      if (!data) return

      const maxDistSq = (size * mouse) ** 2
      const gridMouseX = size * mouseState.x
      const gridMouseY = size * mouseState.y
      
      // Only update if mouse has moved significantly or we need to relax
      const mouseMoved = Math.abs(mouseState.vX) > 0.001 || Math.abs(mouseState.vY) > 0.001
      const mouseIsActive = Math.abs(mouseState.x) > 0.01 || Math.abs(mouseState.y) > 0.01
      const needsRelaxation = !frozenRef.current && (!mouseIsActive || mouseMoved)

      // Always relax when mouse is not active (smoothly animate back to zero)
      if (needsRelaxation) {
        // Relax all cells smoothly
        for (let i = 0; i < size * size; i++) {
          data[i * 4] *= relaxation
          data[i * 4 + 1] *= relaxation
        }
      }

      // Only apply mouse distortion if mouse moved significantly
      if (mouseMoved && !frozenRef.current) {
        // Calculate affected grid bounds to optimize loop
        const minI = Math.max(0, Math.floor(gridMouseX - size * mouse))
        const maxI = Math.min(size - 1, Math.ceil(gridMouseX + size * mouse))
        const minJ = Math.max(0, Math.floor(gridMouseY - size * mouse))
        const maxJ = Math.min(size - 1, Math.ceil(gridMouseY + size * mouse))

        for (let i = minI; i <= maxI; i++) {
          for (let j = minJ; j <= maxJ; j++) {
            const dx = gridMouseX - i
            const dy = gridMouseY - j
            const distSq = dx * dx + dy * dy
            
            if (distSq < maxDistSq && distSq > 0.001) {
              const index = 4 * (i + size * j)
              const dist = Math.sqrt(distSq)
              const power = Math.min((size * mouse) / dist, 10)
              data[index] += strength * 100 * mouseState.vX * power
              data[index + 1] -= strength * 100 * mouseState.vY * power
            }
          }
        }
      }

      // Only update texture if something changed
      if (needsRelaxation || mouseMoved) {
        dataTexture.needsUpdate = true
      }
      
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      } else {
        window.removeEventListener("resize", handleResize)
      }

      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
      container.removeEventListener("click", handleClick)

      if (renderer) {
        renderer.dispose()
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement)
        }
      }

      if (geometry) geometry.dispose()
      if (material) material.dispose()
      if (dataTexture) dataTexture.dispose()
      if (uniforms.uTexture.value) {
        uniforms.uTexture.value.dispose()
      }

      sceneRef.current = null
      rendererRef.current = null
      cameraRef.current = null
      planeRef.current = null
    }
  }, [grid, mouse, strength, relaxation, imageSrc])

  return (
    <div
      ref={containerRef}
      className={`${className}`}
      style={{
        width: "100%",
        height: "100%",
        maxHeight: "100%",
        minWidth: "0",
        minHeight: "0",
        cursor: "pointer",
        display: "block",
        position: "relative",
        overflow: "hidden",
      }}
    />
  )
}

export default GridDistortion
