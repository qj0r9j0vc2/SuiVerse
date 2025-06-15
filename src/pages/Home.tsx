import { useQuery } from '@tanstack/react-query'
import React, { useState, useMemo } from 'react'
import { TopicGraph3D } from '../components/TopicGraph3D'
import { QuizModal } from '../components/Quiz/QuizModal'
import Header from '../components/Header'
import TwitterLoginModal from '../components/TwitterLoginModal'
import DocsSection from '../components/DocsSection'
import type { TopicGraph, TopicNode } from '../types/graph'


const getSiteTitle = (nodes: TopicNode[]) => nodes[0]?.title || 'SuiVerse'
const getShortDesc = (nodes: TopicNode[]) => nodes[0]?.shortDesc || 'A guide to the Sui blockchain.'

const fetchGraph = async (): Promise<TopicGraph> => {
  const res = await fetch('/api/topic-graph')
  return res.json()
}





export default function Home() {
  const { data, isLoading } = useQuery<TopicGraph>({
    queryKey: ['topic-graph'],
    queryFn: fetchGraph,
  })

  const [focusPos, setFocusPos] = useState<[number, number, number] | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeNode, setActiveNode] = useState<TopicNode | null>(null)
  const [search, setSearch] = useState('')

  const [quizOpen, setQuizOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

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

  const siteTitle = data ? getSiteTitle(data.nodes) : 'SuiVerse'
  const siteShortDesc = data ? getShortDesc(data.nodes) : 'A guide to the Sui blockchain.'

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #11162d 70%, #18223b 100%)',
        overflowX: 'hidden',
        overflowY: 'auto',
        position: 'relative',
        fontFamily: 'Inter, Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 40,
      }}
    >

      <Header
        title={siteTitle}
        shortDesc={siteShortDesc}
        search={search}
        onSearch={setSearch}
      />

      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#e8fbff',
          pointerEvents: 'none',
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 900 }}>Deep dive into Sui</div>
        <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>
          welcome to the SuiVerse
        </div>
      </div>


      {activeNode && (
        <aside
          style={{
            position: 'absolute',
            top: 0, right: 0,
            width: 400,
            height: '100vh',
            background: 'rgba(24,32,59,0.99)',
            color: '#d7fbff',
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
            onClick={() => {
              if (user) setQuizOpen(true)
              else setLoginOpen(true)
            }}
          >
            Prove your knowledge
          </button>
        </aside>
      )}


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


      <div
        style={{
          width: '80%',
          height: '70vh',
          margin: '120px auto 0',
          padding: 20,
          boxSizing: 'border-box',
        }}
      >
        {isLoading ? (
          <div
            style={{
              color: '#4ff3ff',
              fontWeight: 700,
              fontSize: 36,
              textAlign: 'center',
              paddingTop: 160,
            }}
          >
            Loading the SuiVerse universe...
          </div>
        ) : (
          <TopicGraph3D
            graph={filtered}
            focusPos={focusPos}
            setFocusPos={setFocusPos}
            activeId={activeId}
            setActiveId={setActiveId}
            setActiveNode={setActiveNode}
          />
        )}
      </div>

      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p
          style={{
            color: '#d7fbff',
            fontSize: 17,
            maxWidth: 720,
            margin: '0 auto 24px',
            lineHeight: 1.6,
          }}
        >
          Explore the official documentation and community tools to keep learning.
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <a
            href="https://docs.sui.io/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#16254a',
              color: '#aeefff',
              padding: '12px 18px',
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            docs.sui.io
          </a>
          <a
            href="https://suivision.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#16254a',
              color: '#aeefff',
              padding: '12px 18px',
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            suivision.xyz
          </a>
          <a
            href="https://discord.gg/sui"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#16254a',
              color: '#aeefff',
              padding: '12px 18px',
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Sui Discord
          </a>
          <a
            href="https://github.com/MystenLabs/sui"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#16254a',
              color: '#aeefff',
              padding: '12px 18px',
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Sui GitHub
          </a>
        </div>
      </section>

      <DocsSection />

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
