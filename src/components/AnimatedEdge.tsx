import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type AnimatedEdgeProps = {
  start: THREE.Vector3
  end: THREE.Vector3
  isActive: boolean
  curve: THREE.Curve<THREE.Vector3>
}

export function AnimatedEdge({ curve, isActive }: AnimatedEdgeProps) {
  const mesh = useRef<THREE.Mesh>(null)
  const t = useRef(Math.random()) 

  useFrame((_, delta) => {
    t.current = (t.current + delta * (isActive ? 0.6 : 0.18)) % 1
    if (mesh.current) {
      const pos = curve.getPoint(t.current)
      mesh.current.position.set(pos.x, pos.y, pos.z)
    }
  })

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.17, 13, 13]} />
      <meshBasicMaterial color={isActive ? '#fff7ae' : '#8df9ff'} transparent opacity={isActive ? 0.92 : 0.43} />
    </mesh>
  )
}
