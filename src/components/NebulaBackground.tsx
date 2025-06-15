import { useLoader, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef } from 'react'

type NebulaLayerProps = {
  url: string
  position: [number, number, number]
  scale: number
  opacity?: number
  rotSpeed?: number
}
export function NebulaLayer({ url, position, scale, opacity = 0.24, rotSpeed = 0.003 }: NebulaLayerProps) {
  const tex = useLoader(THREE.TextureLoader, url)
  const mesh = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (mesh.current) mesh.current.rotation.z += rotSpeed
  })
  return (
    <mesh position={position} scale={[scale, scale, scale]} ref={mesh}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} transparent opacity={opacity} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  )
}
