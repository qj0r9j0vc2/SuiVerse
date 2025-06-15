import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useForceGraph3d } from '../hooks/useForceGraph3d'
import { StarBackground } from './StarBackground'
import { PlanetNode } from './PlanetNode'
import { CameraFocus } from './CameraFocus'
import { AnimatedEdge } from './AnimatedEdge'
import type { TopicGraph, TopicNode } from '../types/graph'
import * as THREE from 'three'
import { useRef } from 'react'
import { NebulaLayer } from './NebulaBackground'



type Props = {
  graph: TopicGraph
  focusPos: [number, number, number] | null
  setFocusPos: (v: [number, number, number] | null) => void
  activeId: string | null
  setActiveId: (id: string | null) => void
  setActiveNode: (node: TopicNode | null) => void
}

export function TopicGraph3D({
  graph, focusPos, setFocusPos, activeId, setActiveId, setActiveNode
}: Props) {
  const { nodes, links } = useForceGraph3d(graph)
  const controlsRef = useRef<any>(null)


  return (
    <Canvas camera={{ position: [0, 0, 22], fov: 65 }}>
  {/* <BackgroundImage url="/assets/cubemap/g.png" opacity={0.33} distance={-100} /> */}
  <NebulaLayer url="/assets/nebula1.png" position={[0, 60, -90]} scale={40} opacity={0.27} />
  <NebulaLayer url="/assets/nebula2.webp" position={[-50, -30, -95]} scale={140} opacity={0.19} rotSpeed={0.001} />
  <NebulaLayer url="/assets/nebula4.png" position={[80, 20, 180]} scale={156} opacity={0.24} rotSpeed={-0.0003} />

      <StarBackground count={1500} radius={90} />
      <ambientLight intensity={1.23} />
      <directionalLight position={[22, 24, 18]} intensity={2.1} castShadow />
      <CameraFocus target={focusPos} onArrived={() => setFocusPos(null)} />

      {links?.map((l, i) => {
  const start = new THREE.Vector3(l.source.x, l.source.y, l.source.z)
  const end = new THREE.Vector3(l.target.x, l.target.y, l.target.z)
  const mid = start.clone().lerp(end, 0.5)
  const direction = end.clone().sub(start).normalize()
  const baseCurveHeight = 2.1

  const isRelated = activeId ? (l.source.id === activeId || l.target.id === activeId) : false
  const color = isRelated ? '#fffed3' : '#76eefe'
  const opacity = isRelated ? 0.32 : 0.10


  return (
    <group key={i}>
      {Array.from({ length: 15 }).map((_, j) => {

        const offsetMag = 0.11 * (j - 2) // -0.22 ~ 0 ~ +0.22
        const angle = ((j - 2) * Math.PI) / 5 + i * 0.7
        const offset = new THREE.Vector3(
          Math.cos(angle) * offsetMag,
          Math.sin(angle) * offsetMag * 0.25,
          Math.sin(angle * 1.04) * offsetMag * 0.4
        )

        const control = mid.clone().add(
          new THREE.Vector3(
            -direction.z * baseCurveHeight * 0.78,
            direction.y * 0.17,
            direction.x * baseCurveHeight * 0.62
          )
        ).add(offset)

        const path = new THREE.CatmullRomCurve3([start, control, end])
        return (
          <mesh key={j}>
            <tubeGeometry args={[path, 36, 0.018, 8, false]} />
            <meshStandardMaterial
              color={color}
              opacity={opacity}
              transparent
              metalness={0.47}
              roughness={0.17}
            />
          </mesh>
        )
      })}


      <AnimatedEdge
        start={start}
        end={end}
        isActive={isRelated}
        curve={new THREE.CatmullRomCurve3([start, mid, end])}
      />
    </group>
  )
})}



      {nodes?.map(n => (
        <PlanetNode
          key={n.id}
          position={[n.x, n.y, n.z]}
          label={n.label}
          logoUrl={n.logoUrl}
          title={n.title}
          isActive={activeId === n.id}
          onClick={() => {
            setActiveId(n.id)
            setActiveNode(n)

            if (typeof n.x !== "number" || typeof n.y !== "number" || typeof n.z !== "number") {
              console.warn("Invalid node position", n)
              return
            }
            setFocusPos([n.x, n.y, n.z])

            controlsRef.current?.target?.set(n.x, n.y, n.z)
            controlsRef.current?.update?.()
          }}
          
        />
      ))}


      <OrbitControls
  ref={controlsRef}
  enablePan={false}                  
  minDistance={16}                   
  maxDistance={60}                   
  minPolarAngle={Math.PI * 0.18}     
  maxPolarAngle={Math.PI * 0.85}     
  // minAzimuthAngle={-Math.PI/2}    
  // maxAzimuthAngle={Math.PI/2}
  onStart={() => setFocusPos(null)}
/>
    </Canvas>
  )
}
