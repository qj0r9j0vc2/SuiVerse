import { useRef, useState, useMemo } from 'react'
import { Html, Billboard } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

const NODE_COLORS = [
  "#59eaff", "#4f93fa", "#7ee7c4", "#7ca7ff", "#af7bff",
  "#ffc887", "#89d5fc", "#fff587", "#b5ffec", "#ffb5f4",
]
function colorForTitle(title: string) {
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = (hash * 31 + title.charCodeAt(i)) % NODE_COLORS.length
  }
  return NODE_COLORS[Math.abs(hash)]
}

type Props = {
  position: [number, number, number]
  label: string
  title: string
  logoUrl?: string
  isActive?: boolean
  onClick?: () => void
}
export function PlanetNode({
  position, label, title, logoUrl, isActive, onClick,
}: Props) {
  const group = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  const hexagonRings = useMemo(() => {
    const rings: Float32Array[] = []
    const r = 1.96
    const segments = 6
    for (let k = 0; k < 3; k++) {
      const ring: number[] = []
      for (let i = 0; i <= segments; i++) {
        const a = (Math.PI * 2 * i) / segments
        let x = Math.cos(a) * r
        let y = Math.sin(a) * r
        let z = 0
        if (k === 1) [x, y, z] = [x, 0, y]
        if (k === 2) [x, y, z] = [0, x, y]
        ring.push(x, y, z)
      }
      rings.push(new Float32Array(ring))
    }
    return rings
  }, [])

  const logoTexture = useLoader(
    THREE.TextureLoader,
    logoUrl || '/assets/sui.png'  
  )
  
  const baseScale = 1.3
  const scale = hovered ? baseScale * 1.14 : baseScale

  const mainColor = colorForTitle(title)
  const SPHERE_RADIUS = 1.74
  const LOGO_OFFSET = 0.18   
  const LOGO_SIZE = 1.58     

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh
        visible={!!logoTexture}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <sphereGeometry args={[SPHERE_RADIUS, 42, 42]} />
        <meshPhysicalMaterial
          color={mainColor}
          metalness={0.39}
          roughness={0.19}
          clearcoat={0.16}
          opacity={0.30}
          transparent
          envMapIntensity={0.38}
        />
      </mesh>

      {/* 3D hex wire */}
      {logoTexture && hexagonRings.map((positions, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={mainColor}
            opacity={isActive ? 0.44 : hovered ? 0.33 : 0.15}
            transparent
            depthTest={false}
          />
        </line>
      ))}


      {logoUrl && (
  <Billboard>
    <mesh
      position={[0, 0, SPHERE_RADIUS + LOGO_OFFSET]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <planeGeometry args={[LOGO_SIZE, LOGO_SIZE]} />
      <meshStandardMaterial
  map={logoTexture}
  color="#fff"
  metalness={0.14}
  roughness={0.23}
  transparent
  opacity={1}
  emissive="#fff"
  emissiveIntensity={hovered ? 0.09 : 0.02}   
  depthTest={false}
/>

    </mesh>
  </Billboard>
)}

      {!logoTexture && (
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onClick}
        >
          <sphereGeometry args={[SPHERE_RADIUS, 44, 44]} />
          <meshStandardMaterial
            color={mainColor}
            metalness={0.74}
            roughness={0.23}
            opacity={0.89}
            transparent
            envMapIntensity={0.62}
          />
        </mesh>
      )}

<Billboard position={[0, -2.1, 0]}>
        <Html center style={{ userSelect: 'none', pointerEvents: 'none', marginTop: 0 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              background: 'rgba(19,28,49,0.97)',
              color: mainColor,
              padding: '4px 16px',
              borderRadius: 16,
              boxShadow: '0 2px 12px #002b',
              minWidth: 48,
              textAlign: 'center',
              textShadow: '0 1px 6px #0038',
              border: isActive ? `2px solid ${mainColor}` : hovered ? `2px solid ${mainColor}` : '2px solid #183d5888',
              opacity: 0.99,
              marginTop: 6,
              pointerEvents: 'none'
            }}
          >
            {label}
          </div>
        </Html>
      </Billboard>
    </group>
  )
}
