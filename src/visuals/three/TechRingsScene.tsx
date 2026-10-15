import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

/** Values driven from the DOM side (pointer, scroll) without re-rendering React. */
export type RingsState = {
  pointer: { x: number; y: number }
  /** Section scroll progress 0 → 1. */
  scroll: number
}

/** Studio reflections from three's built-in RoomEnvironment (no extra dependency). */
function Studio() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const room = new RoomEnvironment()
    const env = pmrem.fromScene(room, 0.035).texture
    scene.environment = env
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
      room.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose()
          ;(Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose())
        }
      })
    }
  }, [gl, scene])
  return null
}

function Rings({ state, compact }: { state: RingsState; compact: boolean }) {
  const group = useRef<THREE.Group>(null)
  const a = useRef<THREE.Mesh>(null)
  const b = useRef<THREE.Mesh>(null)
  const c = useRef<THREE.Mesh>(null)
  const seg = compact ? 96 : 160

  const { gold, bronze, graphite, geoA, geoB, geoC } = useMemo(
    () => ({
      gold: new THREE.MeshStandardMaterial({ color: '#d9b690', metalness: 1, roughness: 0.22 }),
      bronze: new THREE.MeshStandardMaterial({ color: '#a8754c', metalness: 1, roughness: 0.3 }),
      graphite: new THREE.MeshStandardMaterial({ color: '#2a2b30', metalness: 0.85, roughness: 0.32 }),
      geoA: new THREE.TorusGeometry(1.25, 0.11, 32, seg),
      geoB: new THREE.TorusGeometry(1.0, 0.085, 32, seg),
      geoC: new THREE.TorusGeometry(0.74, 0.065, 32, seg),
    }),
    [seg],
  )
  useEffect(
    () => () => {
      ;[gold, bronze, graphite, geoA, geoB, geoC].forEach((x) => x.dispose())
    },
    [gold, bronze, graphite, geoA, geoB, geoC],
  )

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    const d = Math.min(dt, 1 / 30)
    // Slow, calm counter-rotation of the interlocking rings.
    if (a.current) a.current.rotation.set(Math.PI / 2.4 + Math.sin(t * 0.18) * 0.08, t * 0.12, 0)
    if (b.current) b.current.rotation.set(t * 0.1, Math.PI / 3, Math.PI / 6 + Math.cos(t * 0.15) * 0.1)
    if (c.current) c.current.rotation.set(-t * 0.14, -Math.PI / 5, t * 0.08)
    if (group.current) {
      const g = group.current
      const tx = -state.pointer.y * 0.18 + (state.scroll - 0.5) * 0.35
      const ty = state.pointer.x * 0.28
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, tx, 3, d)
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ty, 3, d)
      g.position.y = Math.sin(t * 0.5) * 0.04
    }
  })

  return (
    <group ref={group}>
      <mesh ref={a} geometry={geoA} material={gold} />
      <mesh ref={b} geometry={geoB} material={graphite} />
      <mesh ref={c} geometry={geoC} material={bronze} />
    </group>
  )
}

type Props = { state: RingsState; active: boolean; compact: boolean; onReady: () => void }

/** Interlocking metallic rings. Renders only while `active` (in view). */
export default function TechRingsScene({ state, active, compact, onReady }: Props) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={compact ? [1, 1.5] : [1, 1.75]}
      camera={{ fov: 32, position: [0, 0, 5.1] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={() => requestAnimationFrame(onReady)}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color="#fff6ea" />
      <directionalLight position={[-4, -2, 2]} intensity={0.5} color="#c79b69" />
      <Studio />
      <Rings state={state} compact={compact} />
    </Canvas>
  )
}
