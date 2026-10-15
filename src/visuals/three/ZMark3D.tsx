import { forwardRef, useMemo } from 'react'
import { withBase } from '@/lib/base'
import { useLoader, type ThreeElements } from '@react-three/fiber'
import * as THREE from 'three'
import outline from './z-outline.json'

/**
 * The Zinfity Z as a real 3D object.
 *
 * - Silhouette: traced from the supplied mark's own alpha channel
 *   (scripts/trace-mark.py, ~99% overlap with the original pixels).
 * - Front face: the original logo render, mapped 1:1 in the same pixel space,
 *   rendered unlit and untone-mapped so the brand colours are exactly preserved.
 * - Thickness/bevel: brushed bronze metal that picks up real scene lighting.
 */

export const Z_WIDTH = 2
const scale = Z_WIDTH / outline.width
export const Z_HEIGHT = outline.height * scale
export const Z_DEPTH = 0.16

function buildShapes() {
  return outline.loops.map((loop) => {
    const s = new THREE.Shape()
    loop.points.forEach(([x, y], i) => {
      const X = (x - outline.width / 2) * scale
      const Y = (outline.height / 2 - y) * scale
      if (i === 0) s.moveTo(X, Y)
      else s.lineTo(X, Y)
    })
    s.closePath()
    return s
  })
}

const sheenVertex = /* glsl */ `
  varying vec2 vUv;
  uniform vec4 uMap;
  void main() {
    vUv = uv * uMap.xy + uMap.zw;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const sheenFragment = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D map;
  uniform float uProgress;
  void main() {
    float a = texture2D(map, vUv).a;
    float d = (vUv.x * 0.85 + vUv.y * 0.35) - uProgress;
    float band = smoothstep(0.16, 0.0, abs(d));
    gl_FragColor = vec4(vec3(1.0, 0.95, 0.88), a * band * 0.55);
  }
`

type Props = {
  /** Mirrored, faded copy used as the floor reflection. */
  reflection?: boolean
  sheen?: { current: number }
} & ThreeElements['group']

export const ZMark3D = forwardRef<THREE.Group, Props>(function ZMark3D({ reflection = false, sheen, ...props }, ref) {
  const texture = useLoader(THREE.TextureLoader, withBase('/brand/z-mark.png'))

  const { geometry, faceGeometry, mapTransform } = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    const shapes = buildShapes()
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: Z_DEPTH,
      curveSegments: 1,
      bevelEnabled: true,
      bevelThickness: 0.014,
      bevelSize: 0.01,
      bevelOffset: -0.01,
      bevelSegments: 3,
    })
    geo.translate(0, 0, -Z_DEPTH / 2)
    geo.computeVertexNormals()
    const face = new THREE.ShapeGeometry(shapes, 1)
    face.translate(0, 0, Z_DEPTH / 2 + 0.016)
    // Cap UVs are shape coordinates; map them onto the image's pixel space.
    const map = new THREE.Vector4(1 / Z_WIDTH, 1 / Z_HEIGHT, 0.5, 0.5)
    return { geometry: geo, faceGeometry: face, mapTransform: map }
  }, [texture])

  const materials = useMemo(() => {
    const tex = texture.clone()
    tex.repeat.set(mapTransform.x, mapTransform.y)
    tex.offset.set(mapTransform.z, mapTransform.w)
    tex.needsUpdate = true
    const face = new THREE.MeshBasicMaterial({
      map: tex,
      alphaTest: 0.35,
      toneMapped: false,
      transparent: reflection,
      opacity: reflection ? 0.2 : 1,
      depthWrite: !reflection,
    })
    const side = new THREE.MeshStandardMaterial({
      color: '#a27450',
      metalness: 0.9,
      roughness: 0.32,
      envMapIntensity: 1.1,
      transparent: reflection,
      opacity: reflection ? 0.2 : 1,
      depthWrite: !reflection,
    })
    const sheenMat = new THREE.ShaderMaterial({
      vertexShader: sheenVertex,
      fragmentShader: sheenFragment,
      uniforms: { map: { value: texture }, uProgress: { value: -1 }, uMap: { value: mapTransform } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return { face, side, sheenMat }
  }, [texture, mapTransform, reflection])

  if (sheen) materials.sheenMat.uniforms.uProgress.value = sheen.current

  return (
    <group ref={ref} {...props}>
      <mesh geometry={geometry} material={[materials.face, materials.side]} castShadow={!reflection} />
      {!reflection && sheen && (
        <mesh
          geometry={faceGeometry}
          material={materials.sheenMat}
          onBeforeRender={() => {
            materials.sheenMat.uniforms.uProgress.value = sheen.current
          }}
        />
      )}
    </group>
  )
})
