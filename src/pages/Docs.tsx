import { useState } from 'react'
import Header from '../components/Header'
import { QuizModal } from '../components/Quiz/QuizModal'
import TwitterLoginModal from '../components/TwitterLoginModal'
import { docsSections } from '../docsContent'

export default function Docs() {
  const [difficulty, setDifficulty] = useState('beginner')
  const [quizOpen, setQuizOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [section, setSection] = useState(docsSections[0])

  const getContent = () => {
    if (difficulty === 'advanced')
      return 'Advanced documentation covers deep technical details of Sui.'
    if (difficulty === 'intermediate')
      return 'Intermediate docs explain key concepts with some code examples.'
    return 'Beginner docs introduce the basics of the Sui blockchain.'
  }

  const handleLogin = () => {
    setLoginOpen(true)
  }

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #11162d 70%, #18223b 100%)',
        color: '#d7fbff',
        position: 'relative',
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <Header
        title="SuiVerse Docs"
        shortDesc="Documentation portal"
        search=""
        onSearch={() => {}}
      />

      <div
        style={{
          paddingTop: 120,
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 32,
        }}
      >
        <aside
          style={{
            width: 220,
            paddingRight: 24,
            borderRight: '1px solid #28435b',
            paddingTop: 20,
          }}
        >
          <button
            onClick={handleLogin}
            style={{
              padding: '10px 18px',
              background: '#1da1f2',
              color: '#fff',
              border: 'none',
              borderRadius: 18,
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: 24,
              width: '100%',
            }}
          >
            Sign in with Twitter
          </button>
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

        <main
          style={{
            flex: 1,
            padding: '20px 24px',
            height: 360,
            overflowY: 'auto',
            background: '#0f1a2b',
            borderRadius: 12,
            boxShadow: '0 2px 12px #02162e80',
            color: '#e8f9ff',
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <label style={{ marginRight: 12, fontWeight: 700 }}>Difficulty:</label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 8 }}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <h2 style={{ fontSize: 28, color: '#7be5fe', margin: '0 0 12px' }}>
            {section.title}
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, marginBottom: 20 }}>
            {section.body}
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.6 }}>{getContent()}</p>
          <button
            onClick={() => {
              if (user) setQuizOpen(true)
              else setLoginOpen(true)
            }}
            style={{
              marginTop: 24,
              padding: '12px 24px',
              background: 'linear-gradient(90deg,#2ac2f9,#6f95ff 93%)',
              color: '#fff',
              fontWeight: 700,
              border: 'none',
              borderRadius: 18,
              cursor: 'pointer',
            }}
          >
            Take Quiz
          </button>
        </main>
      </div>

      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} user={user} />
      <TwitterLoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={u => {
          setUser(u)
          setLoginOpen(false)
          setQuizOpen(true)
        }}
      />
    </div>
  )
}
