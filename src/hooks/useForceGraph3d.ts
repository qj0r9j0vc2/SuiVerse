import { useEffect, useState } from 'react'
import * as d3 from 'd3-force-3d'
import type { TopicGraph, TopicNode, TopicLink } from '../types/graph'

type NodeWithPosition = TopicNode & { x: number, y: number, z: number }
type LinkWithRefs = {
  source: NodeWithPosition
  target: NodeWithPosition
  weight?: number
}

export function useForceGraph3d(graph: TopicGraph, iterations = 300) {
  const [nodes, setNodes] = useState<NodeWithPosition[]>([])
  const [links, setLinks] = useState<LinkWithRefs[]>([])

  useEffect(() => {
    if (!graph || !graph.nodes || !graph.links) {
        setNodes([])
        setLinks([])
        return
      }
  
    const nodeObjs: NodeWithPosition[] = graph.nodes.map(n => ({
      ...n,
      x: Math.random() * 10,
      y: Math.random() * 10,
      z: Math.random() * 10,
    }))

    const linkObjs = graph.links.map(l => ({
      ...l,
      source: nodeObjs.find(n => n.id === l.source)!,
      target: nodeObjs.find(n => n.id === l.target)!,
    }))

    const sim = d3.forceSimulation(nodeObjs as any)
      .force('charge', d3.forceManyBody().strength(-120))
      .force('link', d3.forceLink(linkObjs as any).distance(6).strength(1))
      .force('center', d3.forceCenter(0, 0, 0))
      .stop()

    for (let i = 0; i < iterations; i++) sim.tick()

    setNodes([...nodeObjs])
    setLinks([...linkObjs])
  }, [graph])

  return { nodes, links }
}
