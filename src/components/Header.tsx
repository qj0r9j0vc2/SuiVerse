import { useState } from 'react'

type Props = {
  title: string
  shortDesc: string
  search: string
  onSearch: (v: string) => void
}

export default function Header({ title, shortDesc, search, onSearch }: Props) {
  const [input, setInput] = useState(search)
  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        padding: '20px 42px',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        zIndex: 100,
        color: '#7be5fe',
        fontWeight: 800,
        fontSize: 30,
        textShadow: '0 2px 24px #021a3d50',
      }}
    >
      <img src="/assets/sui.png" alt="logo" width={40} height={40} style={{ marginRight: 10 }} />
      <div style={{ pointerEvents: 'none' }}>
        <div>{title}</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#ffe687' }}>{shortDesc}</div>
      </div>
      <div style={{ flex: 1 }} />
      <nav style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <a
          href="https://docs.sui.io/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#b8f4ff', fontSize: 16, fontWeight: 700 }}
        >
          Sui Docs
        </a>
        <a
          href="https://suivision.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#b8f4ff', fontSize: 16, fontWeight: 700 }}
        >
          SuiVision
        </a>
      </nav>
      <input
        style={{
          background: '#19202b',
          color: '#aee9ff',
          borderRadius: 8,
          border: 0,
          padding: '6px 12px',
          minWidth: 160,
        }}
        placeholder="Search topics..."
        value={input}
        onChange={e => {
          setInput(e.target.value)
          onSearch(e.target.value)
        }}
      />
    </header>
  )
}
