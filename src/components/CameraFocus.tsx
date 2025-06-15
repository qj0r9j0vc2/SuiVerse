import { useThree, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type Props = {
  target: [number, number, number] | null
  onArrived?: () => void
  distance?: number          
  speed?: number            
  randomize?: boolean       
}

function getRandomOffset() {
  const azimuth = (Math.random() - 0.5) * 16
  const elevation = (Math.random() - 0.5) * 12
  const distDelta = (Math.random() - 0.5) * 12
  return { azimuth, elevation, distDelta }
}

export function CameraFocus({
  target,
  onArrived,
  distance = 13,
  speed = 0.02,
  randomize = true,
}: Props) {
  const { camera, controls } = useThree() as any
  const lastTarget = useRef<[number, number, number] | null>(null)
  const offsetRef = useRef<{ azimuth: number; elevation: number; distDelta: number }>({ azimuth: 0, elevation: 0, distDelta: 0 })

  useEffect(() => {
    lastTarget.current = target
    if (target && randomize) {
      offsetRef.current = getRandomOffset()
    } else {
      offsetRef.current = { azimuth: 0, elevation: 0, distDelta: 0 }
    }
  }, [target, randomize])

  useFrame(() => {
    if (!lastTarget.current) return
    const { azimuth, elevation, distDelta } = offsetRef.current
    const base = new THREE.Vector3(...lastTarget.current)
    const cameraGoal = base.clone()
      .add(new THREE.Vector3(azimuth, elevation, distance + distDelta))

    camera.position.lerp(cameraGoal, speed)
    controls?.target.lerp(base, speed)
    controls?.update?.()
    if (camera.position.distanceTo(cameraGoal) < 0.07) {
      camera.position.copy(cameraGoal)
      controls?.target.copy(base)
      controls?.update?.()
      onArrived?.()
    }
  })
  return null
}
