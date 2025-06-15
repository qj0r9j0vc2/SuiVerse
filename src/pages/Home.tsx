import { useQuery } from '@tanstack/react-query'
import React, { useState, useMemo, useEffect } from 'react'
import { TopicGraph3D } from '../components/TopicGraph3D'
import type { TopicGraph, TopicNode } from '../types/graph'


const getSiteTitle = (nodes: TopicNode[]) => nodes[0]?.title || 'Sui101'
const getShortDesc = (nodes: TopicNode[]) => nodes[0]?.shortDesc || 'A guide to the Sui blockchain.'


const fetchGraph = async (): Promise<TopicGraph> => {
  const res = await fetch('/api/topic-graph')
  return res.json()
}

// Quiz question mock API
type QuizQuestion = {
  id: string;
  type: 'multiple' | 'short';
  question: string;
  options?: string[];
  answer: string | number;
};
async function fetchQuizQuestions(): Promise<QuizQuestion[]> {
  await new Promise(r => setTimeout(r, 300));
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
  ];
}

// Badge logic by score
function getBadge(score: number, total: number) {
  const pct = (score / total) * 100;
  if (pct >= 90) return { level: 'Master', emoji: '🥇', label: 'Sui Master' };
  if (pct >= 70) return { level: 'Expert', emoji: '🥈', label: 'Sui Expert' };
  if (pct >= 40) return { level: 'Novice', emoji: '🥉', label: 'Sui Novice' };
  return { level: 'Beginner', emoji: '🪙', label: 'Sui Beginner' };
}

// Mock X(Twitter) user
const mockUser = {
  name: 'Gizmo',
  image: '/assets/dog.jpg',
};

// Short answer input, with better UX
function ShortInput({ onSubmit }: { onSubmit: (ans: string) => void }) {
  const [value, setValue] = useState('');
  useEffect(() => {
    const el = document.getElementById('quiz-short-input');
    if (el) (el as HTMLInputElement).focus();
  }, []);
  return (
    <form
      className="flex gap-2 mt-1 w-full"
      onSubmit={e => {
        e.preventDefault();
        if (!value) return;
        onSubmit(value);
        setValue('');
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
  );
}

// Badge graphic (with X profile image)
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
  );
}

// Main quiz modal
export function QuizModal({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: any;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  // 60s timer
  const [timeLeft, setTimeLeft] = useState(60);
  useEffect(() => {
    if (!open) return;
    setCurrent(0);
    setScore(0);
    setUserAnswers([]);
    setFinished(false);
    setTimeLeft(60);
    setLoading(true);
    fetchQuizQuestions().then(qs => {
      setQuestions(qs);
      setLoading(false);
    });
  }, [open]);

  useEffect(() => {
    if (!open || finished) return;
    if (timeLeft === 0) {
      setFinished(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [open, finished, timeLeft]);

  function handleAnswer(answer: string | number) {
    const q = questions[current];
    let correct = false;
    if (q.type === 'multiple') correct = answer === q.answer;
    else correct = String(answer).trim().toLowerCase() === String(q.answer).toLowerCase();

    setScore(s => (correct ? s + 1 : s));
    setUserAnswers(arr => [...arr, answer]);
    if (current + 1 < questions.length) setCurrent(c => c + 1);
    else setFinished(true);
  }

  // Badge for result
  const badge = getBadge(score, questions.length);

  function shareOnTwitter() {
    const text = encodeURIComponent(
      `I earned the ${badge.label} on Sui 101 Quiz! 🏅\nCheck your level at`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}%0A${url}`,
      '_blank'
    );
  }

  if (!open) return null;

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
        background: '#171e2b',
        borderRadius: 22,
        padding: '40px 32px 36px 32px',
        minWidth: 360,
        minHeight: 220,
        maxWidth: '96vw',
        maxHeight: '92vh',
        boxShadow: '0 4px 64px #2cf5ff42',
        color: '#f1fdff',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'auto',
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
      >×</button>
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
          from { opacity: 0; transform: scale(0.96);}
          to   { opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
}


export default function Home() {
  const { data, isLoading } = useQuery<TopicGraph>({
    queryKey: ['topic-graph'],
    queryFn: fetchGraph,
  })

  const [focusPos, setFocusPos] = useState<[number, number, number] | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeNode, setActiveNode] = useState<TopicNode | null>(null)
  const [darkMode] = useState(true)
  const [search, setSearch] = useState('')

  const [quizOpen, setQuizOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!data) return { nodes: [], links: [] }
    const nodes = data.nodes.filter(n =>
      !search ||
      n.label.toLowerCase().includes(search.toLowerCase())
    )
    const links = data.links.filter(
      l => nodes.find(n => n.id === l.source) && nodes.find(n => n.id === l.target)
    )
    return { nodes, links }
  }, [data, search])

  const siteTitle = data ? getSiteTitle(data.nodes) : 'Sui101'
  const siteShortDesc = data ? getShortDesc(data.nodes) : 'A guide to the Sui blockchain.'

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: darkMode ? 'linear-gradient(120deg, #11162d 70%, #18223b 100%)' : '#eef4fc',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >

      <header style={{
        position: 'absolute',
        top: 0, left: 0,
        width: 470,
        minHeight: 86,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '28px 0 0 42px',
        pointerEvents: 'none',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          fontSize: 33, fontWeight: 800, color: '#7be5fe',
          letterSpacing: 1, marginBottom: 7,
          textShadow: '0 2px 24px #021a3d50',
          gap: 16,
        }}>
          <img src="/assets/sui.png" alt="logo" width={43} height={43} style={{ marginRight: 6 }} />
          {siteTitle}
        </div>
        <div style={{
          fontSize: 16.5, fontWeight: 500, color: '#ffe687',
          textShadow: '0 2px 8px #002c', maxWidth: 400,
          lineHeight: 1.6, marginLeft: 3,
        }}>
          {siteShortDesc}
        </div>
      </header>


      {activeNode && (
        <aside
          style={{
            position: 'absolute',
            top: 0, right: 0,
            width: 400,
            height: '100vh',
            background: darkMode ? 'rgba(24,32,59,0.99)' : 'rgba(250,252,255,0.97)',
            color: darkMode ? '#d7fbff' : '#222',
            boxShadow: '-12px 0 32px #02122e80',
            borderRadius: '24px 0 0 24px',
            padding: '54px 36px 32px 36px',
            zIndex: 9999,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            transition: 'background 0.22s, color 0.15s',
            animation: 'slideInPanel 0.42s cubic-bezier(.54,.02,.2,1.1)',
          }}
        >
          <button
            onClick={() => setActiveNode(null)}
            style={{
              position: 'absolute', top: 23, right: 26,
              background: 'none', border: 'none',
              color: '#93e4ff',
              fontWeight: 700,
              fontSize: 28, cursor: 'pointer', lineHeight: 1,
              opacity: 0.8, transition: 'opacity 0.2s'
            }}
            aria-label="Close"
            tabIndex={0}
          >×</button>

          <div style={{
            width: '100%',
            maxWidth: 390,
            margin: '0 auto',
            marginBottom: 16,
          }}>

            <div
              style={{
                width: '100%',
                aspectRatio: '16/9',
                background: '#f9fdff',
                borderRadius: 28,
                overflow: 'hidden',
                boxShadow: '0 2px 16px #25e4ff22',
                marginBottom: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={activeNode.logoUrl}
                alt="Topic Image"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: 28,
                  display: 'block',
                  background: '#f9fdff',
                }}
                onError={e => (e.currentTarget.src = '/assets/logo-default.png')}
                draggable={false}
              />
            </div>

            <div style={{
              width: '100%',
              fontSize: 26,
              fontWeight: 900,
              color: '#64d6ff',
              letterSpacing: 1.5,
              textAlign: 'center',
              marginBottom: 5,
              textShadow: '0 2px 16px #aaf6ff90',
            }}>
              {activeNode.title}
            </div>
          </div>


          <div style={{ marginBottom: 19, fontSize: 16.8, fontWeight: 700, color: '#ffe297' }}>
            Difficulty:{' '}
            <span style={{
              fontWeight: 900,
              color: activeNode.difficulty >= 8 ? '#ff6464' : activeNode.difficulty >= 5 ? '#ffd700' : '#67fa98'
            }}>
              {activeNode.difficulty} / 10
            </span>
          </div>

          <div style={{
            fontSize: 15.7, color: '#f2ffe4', marginBottom: 24, lineHeight: 1.72,
            fontWeight: 500, letterSpacing: 0.02,
          }}>
            {activeNode.longDesc}
          </div>

          {Array.isArray(activeNode.toc) && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ color: '#8cd6ff', fontWeight: 700, fontSize: 15.8, marginBottom: 7 }}>
                Table of Contents
              </div>
              {activeNode.toc.map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    padding: '8px 0',
                    color: '#54dbff',
                    fontWeight: 600,
                    fontSize: 15.4,
                    textDecoration: 'underline',
                    marginBottom: 2,
                    borderLeft: '3px solid #7be5fe55',
                    paddingLeft: 9,
                    transition: 'color 0.15s'
                  }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          )}

          {data && (
            <div style={{ marginTop: 22 }}>
              <div style={{ color: '#b2e7ff', fontWeight: 700, fontSize: 15.5, marginBottom: 8 }}>
                Related Topics
              </div>

              {Array.from(
                new Set(
                  data.links
                    .filter(l => l.source === activeNode.id || l.target === activeNode.id)
                    .map(l => l.source === activeNode.id ? l.target : l.source)
                    .filter(id => id !== activeNode.id)
                )
              ).map((otherId, idx) => {
                const otherNode = data.nodes.find(n => n.id === otherId)
                if (!otherNode) return null
                return (
                  <div
                    key={otherNode.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 10,
                      cursor: 'pointer',
                      borderRadius: 10,
                      padding: '10px 14px',
                      background: '#16254a',
                      fontWeight: 600,
                      gap: 9,
                      minHeight: 36,
                      boxShadow: '0 1px 6px #0228',
                      transition: 'background 0.13s, box-shadow 0.13s',
                      userSelect: 'none',
                    }}
                    tabIndex={0}
                    onClick={() => {
                      setActiveId(otherNode.id)
                      setActiveNode(otherNode)
                    }}
                  >
                    {otherNode.logoUrl && (
                      <img src={otherNode.logoUrl} alt="" style={{ width: 23, marginRight: 9, borderRadius: 6, flexShrink: 0 }} />
                    )}
                    <span style={{
                      color: '#aeefff', fontSize: 15.7, overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140
                    }}>
                      {otherNode.title}
                    </span>
                  </div>
                )
              })}
            </div>
          )}


          <button
            style={{
              marginTop: 36,
              background: 'linear-gradient(90deg,#2ac2f9,#6f95ff 93%)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 18,
              padding: '14px 0',
              border: 'none',
              borderRadius: 17,
              boxShadow: '0 2px 16px #2ff8ff20',
              letterSpacing: 0.7,
              cursor: 'pointer',
              transition: 'background 0.15s',
              width: '100%',
            }}
            onClick={() => setQuizOpen(true)}
          >
            Prove your knowledge
          </button>
        </aside>
      )}


      <QuizModal open={quizOpen} onClose={() => setQuizOpen(false)} user={mockUser} />


      <div style={{ width: '100vw', height: '100vh' }}>
        {isLoading ? (
          <div
            style={{
              color: darkMode ? '#4ff3ff' : '#333',
              fontWeight: 700,
              fontSize: 36,
              textAlign: 'center',
              paddingTop: 160,
            }}
          >
            Loading the Sui101 universe...
          </div>
        ) : (
          <TopicGraph3D
            graph={filtered}
            darkMode={darkMode}
            focusPos={focusPos}
            setFocusPos={setFocusPos}
            activeId={activeId}
            setActiveId={setActiveId}
            setActiveNode={setActiveNode}
          />
        )}
      </div>


      <style>
        {`
        @keyframes slideInPanel {
          from { transform: translateX(60px); opacity: 0.1;}
          to { transform: none; opacity: 1;}
        }
        `}
      </style>
    </div>
  )
}
