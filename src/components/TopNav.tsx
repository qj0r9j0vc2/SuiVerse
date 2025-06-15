import { useState } from 'react'

type Props = {
  onSearch: (query: string) => void
  darkMode: boolean
  onToggleDark: () => void
}
export function TopNav({ onSearch, darkMode, onToggleDark }: Props) {
  const [input, setInput] = useState('')
  return (
    <nav style={{
      position: 'absolute', top: 0, left: 0, width: '100vw',
      background: darkMode ? 'rgba(12,16,28,0.91)' : 'rgba(235,241,255,0.93)',
      color: darkMode ? '#9ae2f8' : '#224',
      padding: '10px 42px', zIndex: 100, display: 'flex', alignItems: 'center'
    }}>
      <img src="/assets/sui.png" alt="logo" width={36} height={36} style={{ marginRight: 18 }} />
      Sui101
      <div style={{ flex: 1 }} />
      <input
        style={{
          background: darkMode ? '#19202b' : '#e2eaf6', color: '#aee9ff', borderRadius: 8, border: 0,
          padding: '7px 18px', marginLeft: 18, minWidth: 220
        }}
        placeholder="Search topics..."
        value={input}
        onChange={e => {
          setInput(e.target.value)
          onSearch(e.target.value)
        }}
      />
      <button onClick={onToggleDark} style={{
        marginLeft: 20, background: darkMode ? '#333' : '#d2e3ff', color: darkMode ? '#fff' : '#224',
        borderRadius: 16, border: 0, padding: '7px 18px', fontWeight: 700, cursor: 'pointer'
      }}>
        {darkMode ? '🌙 Dark' : '☀️ Light'}
      </button>
    </nav>
  )
}
