export type TopicTOCItem = {
  name: string
  link: string
}

export type TopicNode = {
  id: string
  label: string
  title: string
  shortDesc: string
  longDesc: string
  toc: TopicTOCItem[]
  logoUrl?: string
  difficulty: number
}

export type TopicLink = {
  source: string | TopicNode
  target: string | TopicNode
}

export type TopicGraph = {
  nodes: TopicNode[]
  links: TopicLink[]
}
