import React, { useState } from 'react'
import { docsSections } from '../docsContent'

export default function DocsSection() {
  const [section, setSection] = useState(docsSections[0])
  return (
    <section style={{ padding: '80px 20px', background: '#0e1423' }}>
      <h2
        style={{
          textAlign: 'center',
          color: '#7be5fe',
          fontSize: 32,
          fontWeight: 800,
          marginBottom: 40,
        }}
      >
        Documentation
      </h2>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        <aside
          style={{
            width: 220,
            paddingRight: 24,
            borderRight: '1px solid #28435b',
          }}
        >
          {docsSections.map(s => (
            <div
              key={s.id}
              onClick={() => setSection(s)}
              style={{
                padding: '8px 4px',
                marginBottom: 6,
                cursor: 'pointer',
                fontWeight: 700,
                color: section.id === s.id ? '#81e9ff' : '#b8f4ff',
              }}
            >
              {s.title}
            </div>
          ))}
        </aside>
        <main style={{ flex: 1, paddingLeft: 24, color: '#e8f9ff' }}>
          <h3 style={{ fontSize: 26, margin: '0 0 12px' }}>{section.title}</h3>
          <p style={{ fontSize: 18, lineHeight: 1.6 }}>{section.body}</p>
        </main>
      </div>
    </section>
  )
}
