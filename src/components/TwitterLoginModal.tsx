import React from 'react'

const mockUser = {
  name: 'Explorer',
  image: '/assets/dog.jpg',
}

type Props = {
  open: boolean
  onClose: () => void
  onLogin: (user: any) => void
}

export default function TwitterLoginModal({ open, onClose, onLogin }: Props) {
  if (!open) return null
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2147483647,
      }}
    >
      <div
        style={{
          background: '#1b2330',
          borderRadius: 18,
          padding: '36px 32px',
          color: '#eafaff',
          boxShadow: '0 4px 32px #02162e90',
          textAlign: 'center',
          minWidth: 280,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>
          Sign in to play
        </div>
        <button
          onClick={() => {
            onLogin(mockUser)
          }}
          style={{
            padding: '12px 24px',
            background: '#1da1f2',
            color: '#fff',
            border: 'none',
            borderRadius: 20,
            fontWeight: 700,
            cursor: 'pointer',
            width: '100%',
            fontSize: 16,
          }}
        >
          Sign in with Twitter
        </button>
        <button
          onClick={onClose}
          style={{
            marginTop: 14,
            background: 'none',
            border: 'none',
            color: '#93e4ff',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
