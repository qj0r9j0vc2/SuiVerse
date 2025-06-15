import { useState, useEffect } from 'react'

// Quiz question mock API
type QuizQuestion = {
  id: string
  type: 'multiple' | 'short'
  question: string
  options?: string[]
  answer: string | number
}

async function fetchQuizQuestions(): Promise<QuizQuestion[]> {
  await new Promise(r => setTimeout(r, 300))
  return [
    {
      id: '1',
      type: 'multiple',
      question: 'What is the name of consensus on Sui?',
      options: ['Narwhal & Bullshark', 'HotStuff', 'Tendermint', 'Raft'],
      answer: 0,
    },
    {
      id: '2',
      type: 'short',
      question: 'What is the native token of Sui?',
      answer: 'SUI',
    },
    {
      id: '3',
      type: 'multiple',
      question: 'What is the main advantage of the Move language?',
      options: ['High throughput', 'Static typing', 'Memory safety', 'Automatic contract execution'],
      answer: 2,
    },
    // More questions...
  ]
}

function getBadge(score: number, total: number) {
  const pct = (score / total) * 100
  if (pct >= 90) return { level: 'Master', emoji: '🥇', label: 'Sui Master' }
  if (pct >= 70) return { level: 'Expert', emoji: '🥈', label: 'Sui Expert' }
  if (pct >= 40) return { level: 'Novice', emoji: '🥉', label: 'Sui Novice' }
  return { level: 'Beginner', emoji: '🪙', label: 'Sui Beginner' }
}

function ShortInput({ onSubmit }: { onSubmit: (ans: string) => void }) {
  const [value, setValue] = useState('')
  useEffect(() => {
    const el = document.getElementById('quiz-short-input')
    if (el) (el as HTMLInputElement).focus()
  }, [])
  return (
    <form
      className="flex gap-2 mt-1 w-full"
      onSubmit={e => {
        e.preventDefault()
        if (!value) return
        onSubmit(value)
        setValue('')
      }}
    >
      <input
        id="quiz-short-input"
        value={value}
        onChange={e => setValue(e.target.value)}
        className="flex-1 rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow"
        placeholder="Type your answer"
        autoComplete="off"
        aria-label="Short answer"
      />
      <button
        className="rounded-xl px-4 py-2 bg-cyan-500 hover:bg-cyan-600 transition text-white font-bold shadow"
        type="submit"
      >
        Submit
      </button>
    </form>
  )
}

function BadgeGraphic({ badge, user }: { badge: any; user: any }) {
  return (
    <div className="flex flex-col items-center mt-4 mb-5">
      <div className="relative flex items-center justify-center">
        <span className="text-6xl">{badge.emoji}</span>
        {user && user.image && (
          <img
            src={user.image}
            alt="X profile"
            className="absolute -bottom-2 -right-2 w-14 h-14 rounded-full border-4 border-white shadow-xl bg-gray-100 object-cover"
            aria-label="X Profile Image"
          />
        )}
      </div>
      <span className="mt-4 text-lg font-bold text-neutral-800 dark:text-cyan-200 drop-shadow">
        {badge.label}
      </span>
      <span className="text-sm text-cyan-500 font-semibold tracking-wide mt-0.5 uppercase">
        {badge.level} Level
      </span>
    </div>
  )
}

export function QuizModal({
  open,
  onClose,
  user,
}: {
  open: boolean
  onClose: () => void
  user: any
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    if (!open) return
    setCurrent(0)
    setScore(0)
    setFinished(false)
    setTimeLeft(60)
    setLoading(true)
    fetchQuizQuestions().then(qs => {
      setQuestions(qs)
      setLoading(false)
    })
  }, [open])

  useEffect(() => {
    if (!open || finished) return
    if (timeLeft === 0) {
      setFinished(true)
      return
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [open, finished, timeLeft])

  function handleAnswer(ans: string | number) {
    const q = questions[current]
    const correct =
      q.type === 'multiple'
        ? ans === q.answer
        : String(ans).trim().toLowerCase() === String(q.answer).toLowerCase()
    if (correct) setScore(s => s + 1)
    if (current + 1 < questions.length) setCurrent(c => c + 1)
    else setFinished(true)
  }

  const badge = getBadge(score, questions.length)

  function shareOnTwitter() {
    const text = encodeURIComponent(
      `I earned the ${badge.label} on SuiVerse Quiz! 🏅\nCheck your level at`
    )
    const url = encodeURIComponent(window.location.href)
    window.open(`https://twitter.com/intent/tweet?text=${text}%0A${url}`, '_blank')
  }

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483647,
        background: 'rgba(10,14,22,0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(3.5px)',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg,#13203b,#1c2c48)',
          borderRadius: 22,
          border: '1px solid #2cf5ff55',
          padding: '40px 32px 36px 32px',
          minWidth: 360,
          minHeight: 220,
          maxWidth: '96vw',
          maxHeight: '92vh',
          boxShadow: '0 6px 64px #2cf5ff42',
          color: '#f1fdff',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'auto',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: 16,
            top: 13,
            background: 'none',
            border: 'none',
            color: '#71eaff',
            fontSize: 28,
            fontWeight: 900,
            cursor: 'pointer',
          }}
          aria-label="Close"
        >
          ×
        </button>
        <div className="min-h-[210px]">
          {loading ? (
            <div className="flex flex-col items-center py-14 text-lg text-cyan-500 font-bold">
              Loading questions...
            </div>
          ) : !finished ? (
            <>
              <div className="text-right text-sm font-semibold text-cyan-400 mb-2 select-none">
                ⏳ {timeLeft}s left
              </div>
              <div className="font-extrabold text-lg md:text-xl mb-3 text-cyan-700 dark:text-cyan-200 drop-shadow">
                Q{current + 1}. {questions[current]?.question}
              </div>
              {questions[current]?.type === 'multiple' ? (
                <div className="flex flex-col gap-2 w-full">
                  {questions[current].options?.map((opt, idx) => (
                    <button
                      key={idx}
                      className="w-full rounded-xl px-4 py-2 text-left font-semibold text-neutral-800 dark:text-cyan-50 bg-gradient-to-r from-cyan-100 to-cyan-50 hover:from-cyan-200 hover:to-cyan-100 dark:from-[#14334c] dark:to-[#19384b] shadow transition"
                      onClick={() => handleAnswer(idx)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <ShortInput onSubmit={handleAnswer} />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center pt-3 pb-4">
              <BadgeGraphic badge={badge} user={user} />
              <div className="text-neutral-700 dark:text-cyan-100 font-bold text-base mt-1 mb-2">
                Correct Answers: <span className="text-cyan-600">{score}</span> / {questions.length}
              </div>
              <button
                className="mt-5 w-full rounded-xl px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition text-white text-lg font-bold shadow-lg flex items-center justify-center gap-2"
                onClick={shareOnTwitter}
                aria-label="Share badge to X"
              >
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" aria-hidden className="mr-1">
                  <path d="M20.877 20.877h-3.681l-5.401-7.406-4.097 7.406H2l7.332-12.892-6.629-7.424h3.672l5.075 6.588L15.4 2h3.58l-7.157 11.935L20.877 20.877z" fill="currentColor"/>
                </svg>
                Share badge on X
              </button>
              <button
                className="mt-3 text-cyan-400 hover:text-cyan-600 underline font-semibold"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

export default QuizModal
