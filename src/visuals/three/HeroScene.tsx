import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ZMark3D, Z_HEIGHT } from './ZMark3D'

/** Values driven from outside the canvas (scroll, pointer, entrance). */
export type SceneState = {
  progress: { current: number }
  pointer: { current: { x: number; y: number } }
  intro: { current: number }
  sheen: { current: number }
  /** DOM labels (rendered by the hero) positioned by projecting 3D anchors. */
  labels: { current: (HTMLElement | null)[] }
  invalidate?: () => void
}

const FLOOR_Y = -Z_HEIGHT / 2 - 0.12
const IVORY = '#f7f5f0'
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const lerp = THREE.MathUtils.lerp

/** Piecewise keyframes over scroll progress 0 → 1. */
function keyframe(p: number, k: [number, number][]) {
  for (let i = 1; i < k.length; i++) {
    if (p <= k[i][0]) {
      const [p0, v0] = k[i - 1]
      const [p1, v1] = k[i]
      return lerp(v0, v1, smooth(0, 1, (p - p0) / (p1 - p0)))
    }
  }
  return k[k.length - 1][1]
}

/** 3D anchors for the hero's DOM labels, in the same order as HERO_LABELS. */
const LABEL_ANCHORS = [
  new THREE.Vector3(-2.1, 1.25, 0.4),
  new THREE.Vector3(2.0, 1.0, -0.2),
  new THREE.Vector3(-1.9, -0.6, 0.8),
  new THREE.Vector3(2.15, -0.75, 0.5),
]

/** Exposes R3F's invalidate() to the DOM side so scroll/pointer can request frames. */
function Bridge({ state, onReady }: { state: SceneState; onReady: () => void }) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    state.invalidate = invalidate
    invalidate()
    const id = requestAnimationFrame(() => requestAnimationFrame(onReady))
    return () => {
      cancelAnimationFrame(id)
      state.invalidate = undefined
    }
  }, [invalidate, state, onReady])
  return null
}

/** Alpha ramp for the floor in front of the mark: lets the reflection fade out toward the viewer. */
function floorAlpha() {
  const c = document.createElement('canvas')
  c.width = 4
  c.height = 256
  const g = c.getContext('2d')!
  // Canvas top = far edge (just in front of the mark), bottom = toward the camera.
  const grad = g.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, '#000000')
  grad.addColorStop(0.04, '#5a5a5a')
  grad.addColorStop(0.45, '#ffffff')
  grad.addColorStop(1, '#ffffff')
  g.fillStyle = grad
  g.fillRect(0, 0, 4, 256)
  return new THREE.CanvasTexture(c)
}

function Rig({ state, compact }: { state: SceneState; compact: boolean }) {
  const z = useRef<THREE.Group>(null)
  const slide = useRef<THREE.Group>(null)
  const mirror = useRef<THREE.Group>(null)
  const frame = useRef<THREE.Group>(null)
  const frags = useRef<THREE.Group>(null)
  const projected = useMemo(() => new THREE.Vector3(), [])
  const look = useRef(new THREE.Vector3(0, 0, 0))
  const { camera, invalidate } = useThree()
  const size = useThree((s) => s.size)
  const aspect = size.width / size.height

  const fragments = useMemo(() => {
    const count = compact ? 9 : 16
    const rnd = (i: number, s: number) => {
      const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453
      return x - Math.floor(x)
    }
    return Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2 + rnd(i, 1) * 0.6
      const r = 2.1 + rnd(i, 2) * 1.6
      return {
        from: new THREE.Vector3((rnd(i, 3) - 0.5) * 1.2, (rnd(i, 4) - 0.5) * 1.2, -0.2),
        to: new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r * 0.55 + 0.2, (rnd(i, 5) - 0.5) * 2.4),
        rot: new THREE.Euler(rnd(i, 6) * 6, rnd(i, 7) * 6, rnd(i, 8) * 6),
        size: 0.06 + rnd(i, 9) * 0.12,
      }
    })
  }, [compact])

  const fragGeo = useMemo(() => new THREE.TetrahedronGeometry(1, 0), [])
  const fragMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c08f60', metalness: 0.85, roughness: 0.3 }), [])
  const lineMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#c79b69', toneMapped: false, transparent: true, opacity: 0 }), [])
  const shadow = useMemo(softShadow, [])
  // Desktop: the mark starts to the right of the headline, then glides to centre.
  const sideX = compact ? 0 : 1.5

  useFrame((_, dt) => {
    const p = state.progress.current
    const i = state.intro.current
    const { x: px, y: py } = state.pointer.current
    const d = Math.min(dt, 1 / 30)
    let moving = false
    const damp = (cur: number, target: number, lambda = 4) => {
      const next = THREE.MathUtils.damp(cur, target, lambda, d)
      if (Math.abs(next - target) > 0.0005) moving = true
      return next
    }

    // Scroll phases: 0–0.22 the headline ("Moves") drifts and fades out while the
    // mark holds its place; 0.2–0.42 the mark glides to centre; then the camera shots.
    if (slide.current) slide.current.position.x = damp(slide.current.position.x, keyframe(p, [[0, sideX], [0.2, sideX], [0.42, 0]]), 5)

    // Camera: dolly in on entrance, then scroll "shots".
    // Portrait screens need the camera further back so the mark fits the width.
    const zoomOut = compact ? Math.max(1.1, 0.62 / Math.min(0.9, aspect)) : 1
    const camX = keyframe(p, [[0, 0], [0.3, 0], [0.6, 1.7], [1, -1.3]]) + px * 0.35
    const camY = keyframe(p, [[0, 0.25], [0.3, 0.25], [0.6, 0.95], [1, 2.5]]) + py * 0.2
    const camZ = (lerp(11.5, 6.6, i) + keyframe(p, [[0, 0], [0.3, 0], [0.6, -1.0], [1, 1.8]])) * zoomOut
    camera.position.set(damp(camera.position.x, camX), damp(camera.position.y, camY), damp(camera.position.z, camZ))
    look.current.set(0, damp(look.current.y, 0.05 + p * 0.25), 0)
    camera.lookAt(look.current)

    if (z.current) {
      const ry = lerp(-0.7, 0, i) + keyframe(p, [[0, 0], [0.3, 0], [0.6, -0.5], [1, 0.3]]) + px * 0.14
      const rx = py * 0.05 + keyframe(p, [[0, 0], [0.3, 0], [1, 0.12]])
      z.current.rotation.y = damp(z.current.rotation.y, ry, 3)
      z.current.rotation.x = damp(z.current.rotation.x, rx, 3)
      const s = lerp(0.88, 1, i)
      z.current.scale.setScalar(damp(z.current.scale.x, s, 3))
      if (mirror.current) {
        mirror.current.rotation.set(-z.current.rotation.x, z.current.rotation.y, 0)
        mirror.current.scale.set(z.current.scale.x, -z.current.scale.x, z.current.scale.x)
      }
    }

    // The portal frame builds in as the mark arrives at centre.
    const frameTarget = keyframe(p, [[0, compact ? 1 : 0], [0.28, compact ? 1 : 0], [0.45, 1]])
    lineMat.opacity = damp(lineMat.opacity, frameTarget, 5)
    lineMat.visible = lineMat.opacity > 0.01
    if (frame.current) frame.current.rotation.y = damp(frame.current.rotation.y, keyframe(p, [[0, 0], [0.3, 0], [1, -0.35]]) + px * 0.05, 3)

    // Fragments separate from the mark during the middle "systems" shot.
    const spread = smooth(0.36, 0.64, p) * i
    frags.current?.children.forEach((m, k) => {
      const f = fragments[k]
      m.position.lerpVectors(f.from, f.to, spread)
      m.rotation.set(f.rot.x + p * 3, f.rot.y + p * 2, f.rot.z)
      m.scale.setScalar(f.size * spread)
    })

    const labelOpacity = smooth(0.48, 0.58, p) * (1 - smooth(0.82, 0.92, p))
    state.labels.current.forEach((el, k) => {
      if (!el || !LABEL_ANCHORS[k]) return
      el.style.opacity = String(labelOpacity)
      if (labelOpacity <= 0) return
      projected.copy(LABEL_ANCHORS[k]).project(camera)
      const x = (projected.x * 0.5 + 0.5) * size.width
      const y = (-projected.y * 0.5 + 0.5) * size.height
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    })

    if (moving) invalidate()
  })

  return (
    <>
      <group ref={slide} position-x={sideX}>
      <group ref={z}>
        <ZMark3D sheen={state.sheen} />
      </group>
      <group ref={mirror} position={[0, FLOOR_Y * 2, 0]}>
        <ZMark3D reflection />
      </group>
      <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR_Y + 0.004, 0]} scale={[4.2, 1.6, 1]} renderOrder={3}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} toneMapped={false} />
      </mesh>

      {/* Architectural portal behind the mark */}
      <group ref={frame} position={[0, 0.15, -1.3]}>
        {[
          [0, 1.75, 3.8, 0.012],
          [0, -1.45, 3.8, 0.012],
          [-1.9, 0.15, 0.012, 3.2],
          [1.9, 0.15, 0.012, 3.2],
        ].map(([x, y, w, h], k) => (
          <mesh key={k} position={[x, y, 0]} material={lineMat}>
            <boxGeometry args={[w, h, 0.012]} />
          </mesh>
        ))}
      </group>
      </group>
      {[-5.2, -3.6, 3.6, 5.2].map((x) => (
        <mesh key={x} position={[x, 1.5, -3.5]}>
          <boxGeometry args={[0.014, 9, 0.014]} />
          <meshBasicMaterial color="#cfc6b8" toneMapped={false} />
        </mesh>
      ))}

      <group ref={frags}>
        {fragments.map((_, k) => (
          <mesh key={k} geometry={fragGeo} material={fragMat} scale={0} />
        ))}
      </group>

    </>
  )
}

/**
 * Studio reflections for the metal: a small scene of glowing panels on a warm
 * backdrop, pre-filtered once with PMREM and used as scene.environment.
 */
function StudioEnvironment() {
  const { gl, scene, invalidate } = useThree()
  useEffect(() => {
    const studio = new THREE.Scene()
    studio.background = new THREE.Color('#e9e1d4')
    // Glowing panels, each facing the mark.
    const panel = (intensity: number, color: string, pos: [number, number, number], sx: number, sy: number) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }),
      )
      m.position.set(...pos)
      m.scale.set(sx, sy, 1)
      m.lookAt(0, 0, 0)
      studio.add(m)
    }
    panel(2.2, '#ffffff', [0, 4, 3], 8, 1.5)
    panel(1.2, '#f3e2c8', [-5, 1, 1], 6, 2)
    panel(0.8, '#ffffff', [5, -1, 0], 6, 2)
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(studio, 0.02).texture
    scene.environment = env
    invalidate()
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
      studio.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose()
          ;(o.material as THREE.Material).dispose()
        }
      })
    }
  }, [gl, scene, invalidate])
  return null
}

/** Soft radial contact shadow under the mark. */
function softShadow() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(58,42,29,0.55)')
  grad.addColorStop(0.45, 'rgba(58,42,29,0.22)')
  grad.addColorStop(1, 'rgba(58,42,29,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

function Floor() {
  const alpha = useMemo(floorAlpha, [])
  return (
    <>
      {/* Floor only in front of the mark (z 0 → 8), so the type behind it is never covered. */}
      <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR_Y, 4]} renderOrder={2}>
        <planeGeometry args={[30, 8]} />
        <meshBasicMaterial color={IVORY} transparent alphaMap={alpha} toneMapped={false} depthWrite={false} />
      </mesh>
    </>
  )
}

type Props = { state: SceneState; onReady: () => void; compact: boolean }

export default function HeroScene({ state, onReady, compact }: Props) {
  return (
    <Canvas
      frameloop="demand"
      dpr={compact ? [1, 1.5] : [1, 1.75]}
      camera={{ fov: 30, position: [0, 0.3, 11.5], near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <fog attach="fog" args={[IVORY, 9, 24]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#f0d9bd" />
      <Suspense fallback={null}>
        <StudioEnvironment />
        <Rig state={state} compact={compact} />
        <Floor />
        <Bridge state={state} onReady={onReady} />
      </Suspense>
    </Canvas>
  )
}
