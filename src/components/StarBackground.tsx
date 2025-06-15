import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Star = {
  position: [number, number, number]
  size: number
  color: string
  glow: boolean
  twinkle: number
}

function randomColor() {
  const palette = ['#c9e8fa', '#b6cfff', '#ffeedd', '#f7ffc9', '#fcd6bb', '#9af6fa', '#e2e7ff', '#b0fff8']
  return palette[Math.floor(Math.random() * palette.length)]
}


function randomSpherePosition(radius: number): [number, number, number] {
  const u = Math.random()
  const v = Math.random()
  const theta = 2 * Math.PI * u
  const phi = Math.acos(2 * v - 1)
  const r = radius * Math.cbrt(Math.random()) 
  const x = r * Math.sin(phi) * Math.cos(theta)
  const y = r * Math.sin(phi) * Math.sin(theta)
  const z = r * Math.cos(phi)
  return [x, y, z]
}

export function StarBackground({ count = 1500, radius = 90 }) {
  const stars: Star[] = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const glow = Math.random() > 0.965
        return {
          position: randomSpherePosition(radius * (glow ? 1 : 0.98)),
          size: glow
            ? Math.random() * 0.17 + 0.17     
            : Math.random() * 0.10 + 0.03,    
          color: glow
            ? '#fffbe7'
            : randomColor(),
          glow,
          twinkle: Math.random() * 1.8 + 0.4
        }
      }),
    [count, radius]
  )
  

  const group = useRef<THREE.Group>(null)
  const time = useRef(0)

  useFrame((_, delta) => {
    time.current += delta
    if (group.current) {
      group.current.rotation.y += 0.0003
      group.current.rotation.z += 0.00017
    }
  })

  return (
    <group ref={group}>
      {stars.filter(s => s.glow).map((star, i) => {
        const s = 1 + Math.sin(time.current * star.twinkle + i * 2.8) * 0.09
        return (
          <mesh
  key={i}
  position={star.position}
  scale={[s * star.size, s * star.size, s * star.size]}  
>
  <sphereGeometry args={[1, 12, 12]} />
  <meshBasicMaterial
    color={star.color}
    transparent
    opacity={star.glow ? 0.12 : 0.87}
    blending={star.glow ? THREE.AdditiveBlending : THREE.NormalBlending}
    depthWrite={false}
  />
</mesh>
        )
      })}
      {stars.map((star, i) => {
        const s = 1 + Math.sin(time.current * star.twinkle + i * 6.7) * 0.09
        return (
          <mesh
  key={`glow-${i}`}
  position={star.position}
  scale={[s * star.size * 2.7, s * star.size * 2.7, s * star.size * 2.7]}  
>
  <sphereGeometry args={[1, 20, 20]} />
  <meshBasicMaterial
    color={star.color}
    transparent
    opacity={0.16}
    blending={THREE.AdditiveBlending}
    depthWrite={false}
  />
</mesh>
        )
      })}
    </group>
  )
}
