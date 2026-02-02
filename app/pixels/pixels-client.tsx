'use client'

import { useEffect, useRef, useState, useMemo, useCallback, startTransition } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { KeyboardControls, useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import Link from 'next/link'
import { ArrowLeft, Sun, Moon } from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────

type MediaItem = { url: string; width: number; height: number; type?: 'image' | 'video'; title?: string }

type PlaneData = {
  id: string
  position: THREE.Vector3
  scale: THREE.Vector3
  mediaIndex: number
}

type ChunkData = { key: string; cx: number; cy: number; cz: number }

type CameraGridState = { cx: number; cy: number; cz: number; camZ: number }

// ─── Utils ──────────────────────────────────────────────────────────────────

const run = <T,>(fn: () => T): T => fn()
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}
const hashString = (str: string) => {
  let h = 0
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0
  return Math.abs(h)
}
const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

// ─── Constants ──────────────────────────────────────────────────────────────

const CHUNK_SIZE = 110
const RENDER_DISTANCE = 2
const CHUNK_FADE_MARGIN = 1
const MAX_VELOCITY = 3.2
const DEPTH_FADE_START = 140
const DEPTH_FADE_END = 260
const INVIS_THRESHOLD = 0.01
const KEYBOARD_SPEED = 0.18
const VELOCITY_LERP = 0.16
const VELOCITY_DECAY = 0.92 // (3) bumped from 0.9 for slightly more inertial overshoot
const INITIAL_CAMERA_Z = 50
const INTRO_START_Z = 350 // (6) cinematic open: start far away
const FOCUS_FILL = 0.65
const IDLE_TIMEOUT = 30_000 // (7) ms before idle nudge kicks in
const TILT_MAX = 0.04 // (1) ~2.3 degrees max tilt
const PARTICLE_COUNT = 200 // (5) dust motes

type ChunkOffset = { dx: number; dy: number; dz: number; dist: number }

const CHUNK_OFFSETS: ChunkOffset[] = run(() => {
  const maxDist = RENDER_DISTANCE + CHUNK_FADE_MARGIN
  const offsets: ChunkOffset[] = []
  for (let dx = -maxDist; dx <= maxDist; dx++)
    for (let dy = -maxDist; dy <= maxDist; dy++)
      for (let dz = -maxDist; dz <= maxDist; dz++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz))
        if (dist > maxDist) continue
        offsets.push({ dx, dy, dz, dist })
      }
  return offsets
})

// ─── Texture Manager ────────────────────────────────────────────────────────

const textureCache = new Map<string, THREE.Texture>()
const loadCallbacks = new Map<string, Set<(tex: THREE.Texture) => void>>()
const loader = new THREE.TextureLoader()

const isTextureLoaded = (tex: THREE.Texture): boolean => {
  const img = tex.image as HTMLImageElement | undefined
  return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0
}

const getTexture = (item: MediaItem, onLoad?: (texture: THREE.Texture) => void): THREE.Texture => {
  const key = item.url
  const existing = textureCache.get(key)

  if (existing) {
    if (onLoad) {
      if (item.type === 'video') {
        const vid = existing.image as HTMLVideoElement | undefined
        if (vid && vid.readyState >= 2) onLoad(existing)
        else loadCallbacks.get(key)?.add(onLoad)
      } else {
        if (isTextureLoaded(existing)) onLoad(existing)
        else loadCallbacks.get(key)?.add(onLoad)
      }
    }
    return existing
  }

  const callbacks = new Set<(tex: THREE.Texture) => void>()
  if (onLoad) callbacks.add(onLoad)
  loadCallbacks.set(key, callbacks)

  if (item.type === 'video') {
    const video = document.createElement('video')
    video.src = item.url
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.autoplay = true
    video.preload = 'auto'

    const texture = new THREE.VideoTexture(video)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    texture.colorSpace = THREE.SRGBColorSpace

    const onReady = () => {
      video.removeEventListener('loadeddata', onReady)
      video.play().catch(() => {})
      loadCallbacks.get(key)?.forEach((cb) => { try { cb(texture) } catch {} })
      loadCallbacks.delete(key)
    }
    video.addEventListener('loadeddata', onReady)
    video.addEventListener('error', () => {})

    textureCache.set(key, texture)
    return texture
  }

  const texture = loader.load(
    key,
    (tex) => {
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.generateMipmaps = true
      tex.anisotropy = 4
      tex.colorSpace = THREE.SRGBColorSpace
      tex.needsUpdate = true
      loadCallbacks.get(key)?.forEach((cb) => { try { cb(tex) } catch {} })
      loadCallbacks.delete(key)
    },
    undefined,
    undefined,
  )

  textureCache.set(key, texture)
  return texture
}

// ─── Chunk Plane Generation ─────────────────────────────────────────────────

const MAX_PLANE_CACHE = 256
const planeCache = new Map<string, PlaneData[]>()

const touchPlaneCache = (key: string) => {
  const v = planeCache.get(key)
  if (!v) return
  planeCache.delete(key)
  planeCache.set(key, v)
}

const evictPlaneCache = () => {
  while (planeCache.size > MAX_PLANE_CACHE) {
    const firstKey = planeCache.keys().next().value as string | undefined
    if (!firstKey) break
    planeCache.delete(firstKey)
  }
}

const generateChunkPlanes = (cx: number, cy: number, cz: number, mediaCount?: number): PlaneData[] => {
  const planes: PlaneData[] = []
  const seed = hashString(`${cx},${cy},${cz}`)
  const usedMedia = new Set<number>()
  const mc = mediaCount || 1

  for (let i = 0; i < 5; i++) {
    const s = seed + i * 1000
    const r = (n: number) => seededRandom(s + n)
    const size = 12 + r(4) * 8

    // Pick a media index, re-rolling to avoid duplicates within this chunk
    let idx = Math.floor(r(5) * 1_000_000)
    for (let attempt = 0; attempt < 10 && usedMedia.has(idx % mc); attempt++) {
      idx = Math.floor(seededRandom(s + 50 + attempt) * 1_000_000)
    }
    usedMedia.add(idx % mc)

    planes.push({
      id: `${cx}-${cy}-${cz}-${i}`,
      position: new THREE.Vector3(
        cx * CHUNK_SIZE + r(0) * CHUNK_SIZE,
        cy * CHUNK_SIZE + r(1) * CHUNK_SIZE,
        cz * CHUNK_SIZE + r(2) * CHUNK_SIZE,
      ),
      scale: new THREE.Vector3(size, size, 1),
      mediaIndex: idx,
    })
  }
  return planes
}

const generateChunkPlanesCached = (cx: number, cy: number, cz: number, mediaCount?: number): PlaneData[] => {
  const key = `${cx},${cy},${cz}`
  const cached = planeCache.get(key)
  if (cached) { touchPlaneCache(key); return cached }
  const planes = generateChunkPlanes(cx, cy, cz, mediaCount)
  planeCache.set(key, planes)
  evictPlaneCache()
  return planes
}

const getChunkUpdateThrottleMs = (isZooming: boolean, zoomSpeed: number): number => {
  if (zoomSpeed > 1.5) return 600
  if (zoomSpeed > 1.0) return 500
  if (isZooming) return 400
  return 100
}

const shouldThrottleUpdate = (lastUpdateTime: number, throttleMs: number, currentTime: number): boolean =>
  currentTime - lastUpdateTime >= throttleMs

// ─── Touch Detection ────────────────────────────────────────────────────────

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    const check = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (window.matchMedia?.('(pointer: coarse)').matches ?? false)
      )
    }
    check()
    const mq = window.matchMedia('(pointer: coarse)')
    mq.addEventListener('change', check)
    return () => mq.removeEventListener('change', check)
  }, [])
  return isTouch
}

// ─── Shared Geometry ────────────────────────────────────────────────────────

const PLANE_GEOMETRY = new THREE.PlaneGeometry(1, 1)

// ─── Keyboard Map ───────────────────────────────────────────────────────────

const KEYBOARD_MAP = [
  { name: 'forward', keys: ['w', 'W', 'ArrowUp'] },
  { name: 'backward', keys: ['s', 'S', 'ArrowDown'] },
  { name: 'left', keys: ['a', 'A', 'ArrowLeft'] },
  { name: 'right', keys: ['d', 'D', 'ArrowRight'] },
  { name: 'up', keys: ['e', 'E'] },
  { name: 'down', keys: ['q', 'Q'] },
]

type KeyboardKeys = { forward: boolean; backward: boolean; left: boolean; right: boolean; up: boolean; down: boolean }

const getTouchDistance = (touches: Touch[]) => {
  if (touches.length < 2) return 0
  const [t1, t2] = touches
  const dx = t1.clientX - t2.clientX
  const dy = t1.clientY - t2.clientY
  return Math.sqrt(dx * dx + dy * dy)
}

// ─── Shared State Refs ──────────────────────────────────────────────────────

const focusStateRef = { isFocused: false, focusedMeshId: -1, dimAmount: 0, focusedTitle: '' }
const mouseWorldRef = { x: 0, y: 0 } // (1) for parallax tilt

// Atmosphere theme
const DARK_THEME = { bg: new THREE.Color('#0a0a0a'), fog: new THREE.Color('#0a0a0a') }
const LIGHT_THEME = { bg: new THREE.Color('#f0f0f0'), fog: new THREE.Color('#f0f0f0') }
const atmosphereRef = { isDark: true, lerpedBg: new THREE.Color('#0a0a0a'), lerpedFog: new THREE.Color('#0a0a0a') }

// ─── MediaPlane ─────────────────────────────────────────────────────────────

function MediaPlane({
  position, scale, media, chunkCx, chunkCy, chunkCz, cameraGridRef,
}: {
  position: THREE.Vector3; scale: THREE.Vector3; media: MediaItem
  chunkCx: number; chunkCy: number; chunkCz: number
  cameraGridRef: React.RefObject<CameraGridState>
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)
  const localState = useRef({ opacity: 0, frame: 0, ready: false, tiltX: 0, tiltY: 0 })

  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [isReady, setIsReady] = useState(false)

  useFrame(() => {
    const material = materialRef.current
    const mesh = meshRef.current
    const state = localState.current
    if (!material || !mesh) return

    state.frame = (state.frame + 1) & 1
    if (state.opacity < INVIS_THRESHOLD && !mesh.visible && state.frame === 0) return

    const cam = cameraGridRef.current!
    const dist = Math.max(Math.abs(chunkCx - cam.cx), Math.abs(chunkCy - cam.cy), Math.abs(chunkCz - cam.cz))
    const absDepth = Math.abs(position.z - cam.camZ)

    if (absDepth > DEPTH_FADE_END + 50) {
      state.opacity = 0; material.opacity = 0; material.depthWrite = false; mesh.visible = false; return
    }

    const gridFade = dist <= RENDER_DISTANCE ? 1 : Math.max(0, 1 - (dist - RENDER_DISTANCE) / Math.max(CHUNK_FADE_MARGIN, 0.0001))
    const depthFade = absDepth <= DEPTH_FADE_START ? 1 : Math.max(0, 1 - (absDepth - DEPTH_FADE_START) / Math.max(DEPTH_FADE_END - DEPTH_FADE_START, 0.0001))
    const target = Math.min(gridFade, depthFade * depthFade)

    state.opacity = target < INVIS_THRESHOLD && state.opacity < INVIS_THRESHOLD ? 0 : lerp(state.opacity, target, 0.18)

    // Dim non-focused planes
    let finalOpacity = state.opacity
    if (focusStateRef.dimAmount > 0.01) {
      const isFocusedPlane = mesh.id === focusStateRef.focusedMeshId
      if (!isFocusedPlane) {
        finalOpacity *= 1 - focusStateRef.dimAmount * 0.7
      }
    }

    const isFullyOpaque = finalOpacity > 0.99
    material.opacity = isFullyOpaque ? 1 : finalOpacity
    material.depthWrite = isFullyOpaque
    mesh.visible = finalOpacity > INVIS_THRESHOLD

    // (1) Parallax tilt — subtle 3D rotation based on mouse proximity
    if (mesh.visible && absDepth < 80) {
      const dx = mouseWorldRef.x - position.x
      const dy = mouseWorldRef.y - position.y
      const proximity = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 40)
      const targetTiltY = clamp(dx * 0.003 * proximity, -TILT_MAX, TILT_MAX)
      const targetTiltX = clamp(-dy * 0.003 * proximity, -TILT_MAX, TILT_MAX)
      state.tiltX = lerp(state.tiltX, targetTiltX, 0.08)
      state.tiltY = lerp(state.tiltY, targetTiltY, 0.08)
      mesh.rotation.x = state.tiltX
      mesh.rotation.y = state.tiltY
    } else if (Math.abs(state.tiltX) > 0.001 || Math.abs(state.tiltY) > 0.001) {
      state.tiltX = lerp(state.tiltX, 0, 0.05)
      state.tiltY = lerp(state.tiltY, 0, 0.05)
      mesh.rotation.x = state.tiltX
      mesh.rotation.y = state.tiltY
    }
  })

  const [resolvedAspect, setResolvedAspect] = useState<number | null>(null)

  const displayScale = useMemo(() => {
    const aspect = resolvedAspect ?? (media.width && media.height ? media.width / media.height : 4 / 3)
    return new THREE.Vector3(scale.y * aspect, scale.y, 1)
  }, [resolvedAspect, media.width, media.height, scale])

  useEffect(() => {
    const state = localState.current
    state.ready = false; state.opacity = 0; setIsReady(false); setResolvedAspect(null)
    const material = materialRef.current
    if (material) { material.opacity = 0; material.depthWrite = false; material.map = null }
    const tex = getTexture(media, (loadedTex) => {
      const img = loadedTex.image
      if (img instanceof HTMLVideoElement) {
        setResolvedAspect(img.videoWidth && img.videoHeight ? img.videoWidth / img.videoHeight : 16 / 9)
      } else if (img instanceof HTMLImageElement) {
        if (img.naturalWidth && img.naturalHeight) setResolvedAspect(img.naturalWidth / img.naturalHeight)
      }
      state.ready = true; setIsReady(true)
    })
    setTexture(tex)
  }, [media])

  useEffect(() => {
    const material = materialRef.current; const mesh = meshRef.current; const state = localState.current
    if (!material || !mesh || !texture || !isReady || !state.ready) return
    material.map = texture; material.opacity = state.opacity; material.depthWrite = state.opacity >= 1; mesh.scale.copy(displayScale)
  }, [displayScale, texture, isReady])

  if (!texture || !isReady) return null

  return (
    <mesh ref={meshRef} position={position} scale={displayScale} visible={false} geometry={PLANE_GEOMETRY}>
      <meshBasicMaterial ref={materialRef} transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  )
}

// ─── Chunk ──────────────────────────────────────────────────────────────────

function Chunk({ cx, cy, cz, media, cameraGridRef }: {
  cx: number; cy: number; cz: number; media: MediaItem[]; cameraGridRef: React.RefObject<CameraGridState>
}) {
  const [planes, setPlanes] = useState<PlaneData[] | null>(null)

  useEffect(() => {
    let canceled = false
    const doRun = () => !canceled && setPlanes(generateChunkPlanesCached(cx, cy, cz, media.length))
    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(doRun, { timeout: 100 })
      return () => { canceled = true; cancelIdleCallback(id) }
    }
    const id = setTimeout(doRun, 0)
    return () => { canceled = true; clearTimeout(id) }
  }, [cx, cy, cz, media.length])

  if (!planes) return null

  return (
    <group>
      {planes.map((plane) => {
        const mediaItem = media[plane.mediaIndex % media.length]
        if (!mediaItem) return null
        return (
          <MediaPlane
            key={plane.id} position={plane.position} scale={plane.scale}
            media={mediaItem} chunkCx={cx} chunkCy={cy} chunkCz={cz} cameraGridRef={cameraGridRef}
          />
        )
      })}
    </group>
  )
}

// ─── (5) Particle Dust — instanced tiny motes drifting in space ─────────────

function ParticleDust() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const { camera } = useThree()

  // Seed particle positions relative to camera on mount
  const offsets = useMemo(() => {
    const arr: { x: number; y: number; z: number; vx: number; vy: number; vz: number; phase: number }[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300,
        z: (Math.random() - 0.5) * 300,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        vz: (Math.random() - 0.5) * 0.01,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = clock.getElapsedTime()
    const camPos = camera.position

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = offsets[i]
      // Drift with slow sinusoidal wobble
      const wx = camPos.x + p.x + Math.sin(t * 0.1 + p.phase) * 2
      const wy = camPos.y + p.y + Math.cos(t * 0.08 + p.phase) * 2
      const wz = camPos.z + p.z + Math.sin(t * 0.06 + p.phase * 1.3) * 1.5

      // Wrap particles that drift too far from camera
      const dx = wx - camPos.x; const dy = wy - camPos.y; const dz = wz - camPos.z
      if (Math.abs(dx) > 150) p.x -= Math.sign(dx) * 300
      if (Math.abs(dy) > 150) p.y -= Math.sign(dy) * 300
      if (Math.abs(dz) > 150) p.z -= Math.sign(dz) * 300

      dummy.position.set(wx, wy, wz)
      // Subtle size pulsing
      const s = 0.15 + Math.sin(t * 0.5 + p.phase) * 0.05
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.12} depthWrite={false} />
    </instancedMesh>
  )
}

// ─── SceneController ────────────────────────────────────────────────────────

type FlyTarget = {
  x: number; y: number; z: number
  startX: number; startY: number; startZ: number
  progress: number
  meshId: number
} | null

type ControllerState = {
  velocity: { x: number; y: number; z: number }
  targetVel: { x: number; y: number; z: number }
  basePos: { x: number; y: number; z: number }
  drift: { x: number; y: number }
  driftTarget: { x: number; y: number }
  mouse: { x: number; y: number }
  lastMouse: { x: number; y: number }
  scrollAccum: number
  isDragging: boolean
  dragDistance: number
  lastTouches: Touch[]
  lastTouchDist: number
  lastChunkKey: string
  lastChunkUpdate: number
  pendingChunk: { cx: number; cy: number; cz: number } | null
  flyTarget: FlyTarget
  isFocused: boolean
  // (6) Cinematic intro
  introProgress: number // 0 → 1
  introDone: boolean
  // (7) Idle nudge
  lastInputTime: number
  idleNudged: boolean
}

const createInitialState = (): ControllerState => ({
  velocity: { x: 0, y: 0, z: 0 }, targetVel: { x: 0, y: 0, z: 0 },
  basePos: { x: 0, y: 0, z: INTRO_START_Z }, drift: { x: 0, y: 0 }, driftTarget: { x: 0, y: 0 },
  mouse: { x: 0, y: 0 }, lastMouse: { x: 0, y: 0 },
  scrollAccum: 0, isDragging: false, dragDistance: 0, lastTouches: [], lastTouchDist: 0,
  lastChunkKey: '', lastChunkUpdate: 0, pendingChunk: null, flyTarget: null,
  isFocused: false,
  introProgress: 0, introDone: false,
  lastInputTime: performance.now(), idleNudged: false,
})

function SceneController({ media, onFocusTitle, onFlyComplete }: { media: MediaItem[]; onFocusTitle: (title: string) => void; onFlyComplete: (complete: boolean) => void }) {
  const { camera, gl, scene } = useThree()
  const isTouchDevice = useIsTouchDevice()
  const [, getKeys] = useKeyboardControls<keyof KeyboardKeys>()

  const state = useRef<ControllerState>(createInitialState())
  const cameraGridRef = useRef<CameraGridState>({ cx: 0, cy: 0, cz: 0, camZ: camera.position.z })
  const raycaster = useRef(new THREE.Raycaster())
  const mouseVec = useRef(new THREE.Vector2())

  const [chunks, setChunks] = useState<ChunkData[]>([])
  const flyCompleteFired = useRef(false)

  // Helper to mark user activity (7)
  const markActive = () => { state.current.lastInputTime = performance.now() }

  useEffect(() => {
    const canvas = gl.domElement
    const s = state.current

    const onMouseDown = (e: MouseEvent) => {
      if (!s.introDone) return
      s.isDragging = true; s.dragDistance = 0; s.lastMouse = { x: e.clientX, y: e.clientY }
      markActive()
    }
    const onMouseUp = () => { s.isDragging = false }
    const onClick = (e: MouseEvent) => {
      if (!s.introDone) return
      if (s.dragDistance > 5) return

      if (s.isFocused) {
        s.isFocused = false; s.flyTarget = null
        focusStateRef.isFocused = false; focusStateRef.focusedMeshId = -1
        focusStateRef.focusedTitle = ''
        onFocusTitle(''); onFlyComplete(false); flyCompleteFired.current = false
        markActive()
        return
      }

      mouseVec.current.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
      raycaster.current.setFromCamera(mouseVec.current, camera)
      const hits = raycaster.current.intersectObjects(scene.children, true)
      const hit = hits.find((h) => h.object instanceof THREE.Mesh && h.object.visible && (h.object.material as THREE.MeshBasicMaterial).map)
      if (hit) {
        const pos = hit.object.getWorldPosition(new THREE.Vector3())
        const planeH = hit.object.scale.y
        const planeW = hit.object.scale.x

        const fovRad = THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov)
        const aspect = gl.domElement.width / gl.domElement.height
        const distForHeight = planeH / (2 * Math.tan(fovRad / 2) * FOCUS_FILL)
        const distForWidth = planeW / (2 * Math.tan(fovRad / 2) * aspect * FOCUS_FILL)
        const viewDist = Math.max(distForHeight, distForWidth)

        flyCompleteFired.current = false
        s.flyTarget = {
          x: pos.x, y: pos.y, z: pos.z + viewDist,
          startX: s.basePos.x, startY: s.basePos.y, startZ: s.basePos.z,
          progress: 0, meshId: hit.object.id,
        }
        s.isFocused = true
        focusStateRef.isFocused = true
        focusStateRef.focusedMeshId = hit.object.id

        // (7 / caption) Find which media item this plane shows
        // Walk up to chunk group, find the plane data to get mediaIndex
        const hitMesh = hit.object as THREE.Mesh
        // Use userData if available, otherwise try to match by position
        const matchedMedia = media.find(m => {
          const tex = textureCache.get(m.url)
          return tex && (hitMesh.material as THREE.MeshBasicMaterial).map === tex
        })
        const title = matchedMedia?.title || ''
        focusStateRef.focusedTitle = title
        onFocusTitle(title)

        s.velocity = { x: 0, y: 0, z: 0 }
        s.targetVel = { x: 0, y: 0, z: 0 }
        s.scrollAccum = 0
        markActive()
      }
    }
    const onMouseLeave = () => { s.mouse = { x: 0, y: 0 }; s.isDragging = false }
    const onMouseMove = (e: MouseEvent) => {
      s.mouse = { x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 }
      if (s.isDragging) {
        const dx = e.clientX - s.lastMouse.x; const dy = e.clientY - s.lastMouse.y
        s.dragDistance += Math.abs(dx) + Math.abs(dy)
        s.targetVel.x -= dx * 0.025
        s.targetVel.y += dy * 0.025
        s.lastMouse = { x: e.clientX, y: e.clientY }
        markActive()
      }
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (!s.introDone) return
      s.scrollAccum += e.deltaY * 0.006
      markActive()
    }
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      if (!s.introDone) return
      s.lastTouches = Array.from(e.touches) as Touch[]; s.lastTouchDist = getTouchDistance(s.lastTouches)
      markActive()
    }
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault(); const touches = Array.from(e.touches) as Touch[]
      if (touches.length === 1 && s.lastTouches.length >= 1) {
        const [touch] = touches; const [last] = s.lastTouches
        if (touch && last) { s.targetVel.x -= (touch.clientX - last.clientX) * 0.02; s.targetVel.y += (touch.clientY - last.clientY) * 0.02 }
      } else if (touches.length === 2 && s.lastTouchDist > 0) {
        const dist = getTouchDistance(touches); s.scrollAccum += (s.lastTouchDist - dist) * 0.006; s.lastTouchDist = dist
      }
      s.lastTouches = touches
      markActive()
    }
    const onTouchEnd = (e: TouchEvent) => {
      s.lastTouches = Array.from(e.touches) as Touch[]; s.lastTouchDist = getTouchDistance(s.lastTouches)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      markActive()
      if (e.key === 'Escape' && s.isFocused) {
        s.flyTarget = null; s.isFocused = false
        focusStateRef.isFocused = false; focusStateRef.focusedMeshId = -1
        focusStateRef.focusedTitle = ''; onFocusTitle(''); onFlyComplete(false); flyCompleteFired.current = false
      }
    }

    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('click', onClick)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('keydown', onKeyDown)
    canvas.addEventListener('mouseleave', onMouseLeave)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd, { passive: false })

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('click', onClick)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('keydown', onKeyDown)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [gl, camera, scene, media, onFocusTitle, onFlyComplete])

  useFrame(() => {
    const s = state.current; const now = performance.now()

    // (6) Cinematic intro — ease from INTRO_START_Z to INITIAL_CAMERA_Z
    if (!s.introDone) {
      s.introProgress = Math.min(1, s.introProgress + 0.006) // ~2.8s at 60fps
      const t = easeInOutCubic(s.introProgress)
      s.basePos.z = INTRO_START_Z + (INITIAL_CAMERA_Z - INTRO_START_Z) * t
      camera.position.set(s.basePos.x, s.basePos.y, s.basePos.z)

      if (s.introProgress >= 1) {
        s.introDone = true
        s.basePos.z = INITIAL_CAMERA_Z
        s.lastInputTime = now
      }

      // Still update chunks during intro
      const cx = Math.floor(s.basePos.x / CHUNK_SIZE)
      const cy = Math.floor(s.basePos.y / CHUNK_SIZE)
      const cz = Math.floor(s.basePos.z / CHUNK_SIZE)
      cameraGridRef.current = { cx, cy, cz, camZ: s.basePos.z }
      const key = `${cx},${cy},${cz}`
      if (key !== s.lastChunkKey) { s.pendingChunk = { cx, cy, cz }; s.lastChunkKey = key }
      if (s.pendingChunk && shouldThrottleUpdate(s.lastChunkUpdate, 200, now)) {
        const { cx: ucx, cy: ucy, cz: ucz } = s.pendingChunk
        s.pendingChunk = null; s.lastChunkUpdate = now
        startTransition(() => {
          setChunks(CHUNK_OFFSETS.map((o) => ({ key: `${ucx + o.dx},${ucy + o.dy},${ucz + o.dz}`, cx: ucx + o.dx, cy: ucy + o.dy, cz: ucz + o.dz })))
        })
      }
      return
    }

    const { forward, backward, left, right, up, down } = getKeys()
    const hasKeyInput = forward || backward || left || right || up || down

    // Cancel focus on input
    if (s.isFocused && (hasKeyInput || s.isDragging || Math.abs(s.scrollAccum) > 0.01)) {
      s.flyTarget = null; s.isFocused = false
      focusStateRef.isFocused = false; focusStateRef.focusedMeshId = -1
      focusStateRef.focusedTitle = ''; onFocusTitle(''); onFlyComplete(false); flyCompleteFired.current = false
    }

    if (forward) s.targetVel.z -= KEYBOARD_SPEED
    if (backward) s.targetVel.z += KEYBOARD_SPEED
    if (left) s.targetVel.x -= KEYBOARD_SPEED
    if (right) s.targetVel.x += KEYBOARD_SPEED
    if (down) s.targetVel.y -= KEYBOARD_SPEED
    if (up) s.targetVel.y += KEYBOARD_SPEED
    if (hasKeyInput) markActive()

    const isZooming = Math.abs(s.velocity.z) > 0.05
    const zoomFactor = clamp(s.basePos.z / 50, 0.3, 2.0)
    const driftAmount = 8.0 * zoomFactor
    const driftLerp = isZooming ? 0.2 : 0.12

    // (1) Update mouse world position for parallax tilt
    if (!isTouchDevice) {
      const fovRad = THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov)
      const halfH = Math.tan(fovRad / 2) * 50 // approximate depth
      const halfW = halfH * (gl.domElement.width / gl.domElement.height)
      mouseWorldRef.x = s.basePos.x + s.mouse.x * halfW
      mouseWorldRef.y = s.basePos.y + s.mouse.y * halfH
    }

    // Drift
    if (s.isFocused || s.flyTarget) {
      s.drift.x = lerp(s.drift.x, 0, 0.08)
      s.drift.y = lerp(s.drift.y, 0, 0.08)
    } else if (!s.isDragging) {
      if (isTouchDevice) {
        s.drift.x = lerp(s.drift.x, 0, driftLerp); s.drift.y = lerp(s.drift.y, 0, driftLerp)
      } else {
        s.drift.x = lerp(s.drift.x, s.mouse.x * driftAmount, driftLerp)
        s.drift.y = lerp(s.drift.y, s.mouse.y * driftAmount, driftLerp)
      }
    }

    // (7) Idle nudge — one-shot forward scroll impulse after IDLE_TIMEOUT
    const idleTime = now - s.lastInputTime
    if (idleTime > IDLE_TIMEOUT && !s.isFocused && !s.flyTarget && !s.idleNudged) {
      s.targetVel.z -= 1.2 // quick forward impulse, decays via VELOCITY_DECAY naturally
      s.idleNudged = true
    } else if (idleTime < IDLE_TIMEOUT) {
      s.idleNudged = false
    }

    s.targetVel.z += s.scrollAccum; s.scrollAccum *= 0.8
    s.targetVel.x = clamp(s.targetVel.x, -MAX_VELOCITY, MAX_VELOCITY)
    s.targetVel.y = clamp(s.targetVel.y, -MAX_VELOCITY, MAX_VELOCITY)
    s.targetVel.z = clamp(s.targetVel.z, -MAX_VELOCITY, MAX_VELOCITY)
    s.velocity.x = lerp(s.velocity.x, s.targetVel.x, VELOCITY_LERP)
    s.velocity.y = lerp(s.velocity.y, s.targetVel.y, VELOCITY_LERP)
    s.velocity.z = lerp(s.velocity.z, s.targetVel.z, VELOCITY_LERP)

    // Fly-to with eased interpolation
    if (s.flyTarget) {
      s.flyTarget.progress = Math.min(1, s.flyTarget.progress + 0.012)
      const t = easeInOutCubic(s.flyTarget.progress)
      s.basePos.x = s.flyTarget.startX + (s.flyTarget.x - s.flyTarget.startX) * t
      s.basePos.y = s.flyTarget.startY + (s.flyTarget.y - s.flyTarget.startY) * t
      s.basePos.z = s.flyTarget.startZ + (s.flyTarget.z - s.flyTarget.startZ) * t
      if (s.flyTarget.progress >= 0.85 && !flyCompleteFired.current) {
        flyCompleteFired.current = true
        onFlyComplete(true)
      }
      if (s.flyTarget.progress >= 1) {
        s.basePos.x = s.flyTarget.x; s.basePos.y = s.flyTarget.y; s.basePos.z = s.flyTarget.z
        s.flyTarget = null
      }
    } else {
      s.basePos.x += s.velocity.x; s.basePos.y += s.velocity.y; s.basePos.z += s.velocity.z
    }

    // Dim non-focused planes
    const dimTarget = s.isFocused ? 1 : 0
    focusStateRef.dimAmount = lerp(focusStateRef.dimAmount, dimTarget, 0.06)

    camera.position.set(s.basePos.x + s.drift.x, s.basePos.y + s.drift.y, s.basePos.z)
    s.targetVel.x *= VELOCITY_DECAY; s.targetVel.y *= VELOCITY_DECAY; s.targetVel.z *= VELOCITY_DECAY

    const cx = Math.floor(s.basePos.x / CHUNK_SIZE)
    const cy = Math.floor(s.basePos.y / CHUNK_SIZE)
    const cz = Math.floor(s.basePos.z / CHUNK_SIZE)
    cameraGridRef.current = { cx, cy, cz, camZ: s.basePos.z }

    const key = `${cx},${cy},${cz}`
    if (key !== s.lastChunkKey) { s.pendingChunk = { cx, cy, cz }; s.lastChunkKey = key }

    const throttleMs = getChunkUpdateThrottleMs(isZooming, Math.abs(s.velocity.z))
    if (s.pendingChunk && shouldThrottleUpdate(s.lastChunkUpdate, throttleMs, now)) {
      const { cx: ucx, cy: ucy, cz: ucz } = s.pendingChunk
      s.pendingChunk = null; s.lastChunkUpdate = now
      startTransition(() => {
        setChunks(CHUNK_OFFSETS.map((o) => ({ key: `${ucx + o.dx},${ucy + o.dy},${ucz + o.dz}`, cx: ucx + o.dx, cy: ucy + o.dy, cz: ucz + o.dz })))
      })
    }
  })

  useEffect(() => {
    startTransition(() => {
      setChunks(CHUNK_OFFSETS.map((o) => ({ key: `${o.dx},${o.dy},${o.dz}`, cx: o.dx, cy: o.dy, cz: o.dz })))
    })
  }, [])

  return (
    <>
      <ParticleDust />
      {chunks.map((chunk) => (
        <Chunk key={chunk.key} cx={chunk.cx} cy={chunk.cy} cz={chunk.cz} media={media} cameraGridRef={cameraGridRef} />
      ))}
    </>
  )
}

// ─── Atmosphere Controller ──────────────────────────────────────────────────

function AtmosphereController() {
  const { scene } = useThree()

  useFrame(() => {
    const target = atmosphereRef.isDark ? DARK_THEME : LIGHT_THEME
    atmosphereRef.lerpedBg.lerp(target.bg, 0.04)
    atmosphereRef.lerpedFog.lerp(target.fog, 0.04)

    scene.background = atmosphereRef.lerpedBg.clone()
    if (scene.fog && scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(atmosphereRef.lerpedFog)
    }
  })

  return null
}

// ─── Main Client Component ──────────────────────────────────────────────────

export default function PixelsClient({ media }: { media: MediaItem[] }) {
  const isTouchDevice = useIsTouchDevice()
  const [canvasReady, setCanvasReady] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [isDark, setIsDark] = useState(true)
  const [focusedTitle, setFocusedTitle] = useState('')
  const [labelReady, setLabelReady] = useState(false)
  const interacted = useRef(false)

  const dpr = useMemo(() => {
    if (typeof window === 'undefined') return 1
    return Math.min(window.devicePixelRatio || 1, isTouchDevice ? 1.25 : 1.5)
  }, [isTouchDevice])

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev
      atmosphereRef.isDark = next
      return next
    })
  }, [])

  const handleFocusTitle = useCallback((title: string) => {
    setFocusedTitle(title)
    if (!title) setLabelReady(false)
  }, [])

  const handleFlyComplete = useCallback((complete: boolean) => {
    setLabelReady(complete)
  }, [])

  // Lock body scroll
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [])

  // Fade in canvas
  useEffect(() => {
    const t = setTimeout(() => setCanvasReady(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Hide controls hint after interaction
  useEffect(() => {
    const hide = () => {
      if (!interacted.current) {
        interacted.current = true
        setTimeout(() => setControlsVisible(false), 3000)
      }
    }
    window.addEventListener('mousedown', hide)
    window.addEventListener('touchstart', hide)
    window.addEventListener('keydown', hide)
    const t = setTimeout(() => setControlsVisible(false), 6000)
    return () => {
      window.removeEventListener('mousedown', hide)
      window.removeEventListener('touchstart', hide)
      window.removeEventListener('keydown', hide)
      clearTimeout(t)
    }
  }, [])

  if (!media.length) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-white/40 text-sm font-sans">No media found</p>
      </div>
    )
  }

  const uiColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'
  const uiHoverColor = isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)'
  const hintColor = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)'

  return (
    <div
      className="fixed inset-0 transition-[background-color] duration-[1200ms] ease-out"
      style={{ backgroundColor: isDark ? '#0a0a0a' : '#f0f0f0', cursor: 'grab' }}
    >
      {/* Canvas */}
      <div
        className="absolute inset-0 transition-opacity duration-[1500ms] ease-out"
        style={{ opacity: canvasReady ? 1 : 0, touchAction: 'none' }}
      >
        <KeyboardControls map={KEYBOARD_MAP}>
          <Canvas
            camera={{ position: [0, 0, INTRO_START_Z], fov: 60, near: 1, far: 500 }}
            dpr={dpr}
            flat
            gl={{ antialias: false, powerPreference: 'high-performance' }}
            style={{ width: '100%', height: '100%', touchAction: 'none' }}
          >
            <color attach="background" args={['#0a0a0a']} />
            <fog attach="fog" args={['#0a0a0a', 100, 280]} />
            <AtmosphereController />
            <SceneController media={media} onFocusTitle={handleFocusTitle} onFlyComplete={handleFlyComplete} />
          </Canvas>
        </KeyboardControls>
      </div>

      {/* Vignette overlays */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-[1200ms] ease-out"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
          opacity: isDark ? 1 : 0,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-[1200ms] ease-out"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(255,255,255,0.5) 100%)',
          opacity: isDark ? 0 : 1,
        }}
      />

      {/* (7) Caption overlay — appears after fly-to completes */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 pointer-events-none transition-all duration-500 ease-out"
        style={{
          opacity: focusedTitle && labelReady ? 1 : 0,
          transform: `translateX(-50%) translateY(${focusedTitle && labelReady ? '0' : '6px'})`,
        }}
      >
        <p
          className="text-xs font-sans tracking-[0.2em] uppercase transition-colors duration-500"
          style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}
        >
          {focusedTitle}
        </p>
      </div>

      {/* Top-left chrome: back + theme toggle */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-4">
        <Link
          href="/labs"
          className="cursor-hover flex items-center gap-2 px-3 py-2 -ml-3 rounded-lg transition-all duration-500 hover:bg-white/10"
          style={{ color: uiColor }}
          onMouseEnter={(e) => { e.currentTarget.style.color = uiHoverColor }}
          onMouseLeave={(e) => { e.currentTarget.style.color = uiColor }}
          data-cursor-rounded="full"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-sans">Back</span>
        </Link>

        <div
          className="w-px h-4 transition-colors duration-500"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }}
        />

        <button
          onClick={toggleTheme}
          className="relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 cursor-hover"
          style={{ color: uiColor }}
          onMouseEnter={(e) => { e.currentTarget.style.color = uiHoverColor }}
          onMouseLeave={(e) => { e.currentTarget.style.color = uiColor }}
          data-cursor-rounded="full"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <Sun
            className="w-4 h-4 absolute transition-all duration-500"
            style={{
              opacity: isDark ? 1 : 0,
              transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(90deg) scale(0.5)',
            }}
          />
          <Moon
            className="w-4 h-4 absolute transition-all duration-500"
            style={{
              opacity: isDark ? 0 : 1,
              transform: isDark ? 'rotate(-90deg) scale(0.5)' : 'rotate(0deg) scale(1)',
            }}
          />
        </button>
      </div>

      {/* Controls hint */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-1000"
        style={{ opacity: controlsVisible ? 1 : 0, pointerEvents: 'none' }}
      >
        <p className="text-xs font-sans tracking-wide transition-colors duration-500" style={{ color: hintColor }}>
          {isTouchDevice ? 'Drag to pan \u00B7 Pinch to zoom' : 'Drag or WASD to move \u00B7 Scroll to zoom'}
        </p>
      </div>
    </div>
  )
}
