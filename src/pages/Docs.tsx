import { useState } from 'react'
import Header from '../components/Header'
import { QuizModal } from '../components/Quiz/QuizModal'

const mockUser = {
  name: 'Gizmo',
  image: '/assets/dog.jpg',
}

export default function Docs() {
  const [difficulty, setDifficulty] = useState('beginner')
  const [quizOpen, setQuizOpen] = useState(false)

  const getContent = () => {
    if (difficulty === 'advanced')
      return 'Advanced documentation covers deep technical details of Sui.'
    if (difficulty === 'intermediate')
      return 'Intermediate docs explain key concepts with some code examples.'
    return 'Beginner docs introduce the basics of the Sui blockchain.'
  }

  const handleLogin = () => {
    alert('Twitter OAuth2 login placeholder')
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
      <div style={{ paddingTop: 120, maxWidth: 800, margin: '0 auto' }}>
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
          }}
        >
          Sign in with Twitter
        </button>
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
        <p style={{ fontSize: 18, lineHeight: 1.6 }}>{getContent()}</p>
        <button
          onClick={() => setQuizOpen(true)}
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
      </div>
      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} user={mockUser} />
    </div>
  )
}
