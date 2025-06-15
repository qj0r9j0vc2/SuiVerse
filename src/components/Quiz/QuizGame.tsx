import React, { useState, useEffect } from 'react';
import { fetchQuizQuestions, QuizQuestion } from '../../mocks/quiz';

function getBadge(score: number, total: number) {
  const pct = (score / total) * 100;
  if (pct >= 90) return { level: 'Master', emoji: '🥇', label: 'Sui Master' };
  if (pct >= 70) return { level: 'Expert', emoji: '🥈', label: 'Sui Expert' };
  if (pct >= 40) return { level: 'Novice', emoji: '🥉', label: 'Sui Novice' };
  return { level: 'Beginner', emoji: '🪙', label: 'Sui Beginner' };
}

export function QuizGame({ user, onClose }: { user: any; onClose: () => void }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetchQuizQuestions().then(setQuestions);
  }, []);

  function handleAnswer(answer: string | number) {
    const q = questions[current];
    let correct = false;
    if (q.type === 'multiple') correct = answer === q.answer;
    else correct = String(answer).trim().toLowerCase() === String(q.answer).toLowerCase();

    setScore((s) => (correct ? s + 1 : s));
    setUserAnswers((arr) => [...arr, answer]);
    if (current + 1 < questions.length) setCurrent((c) => c + 1);
    else setFinished(true);
  }

  // Badge with user avatar (UI/UX enhanced)
  function BadgeGraphic({ badge, user }: any) {
    return (
      <div className="flex flex-col items-center mt-4 mb-5">
        <div className="relative flex items-center justify-center">
          <span className="text-6xl">{badge.emoji}</span>
          {user?.image && (
            <img
              src={user.image}
              alt="X Profile"
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

  function shareOnTwitter() {
    const badge = getBadge(score, questions.length);
    const text = encodeURIComponent(
      `I earned the ${badge.label} on SuiVerse Quiz! 🏅\nCheck your level at`
    );
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}%0A${url}`,
      '_blank'
    );
  }

  if (questions.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-24 text-xl text-cyan-500 font-bold">
        Loading questions...
      </div>
    );

  if (!finished)
    return (
      <div className="min-w-[300px] md:min-w-[370px] py-5 px-2 flex flex-col items-center">
        <div className="mb-4 w-full flex justify-between items-center">
          <span className="text-neutral-400 text-sm font-semibold">
            {current + 1} / {questions.length}
          </span>
          <button
            className="text-gray-400 text-2xl font-extrabold hover:text-cyan-400 transition"
            aria-label="Close quiz"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="w-full">
          <h3 className="mb-3 text-base md:text-lg font-bold text-cyan-600 dark:text-cyan-200 drop-shadow">
            Q{current + 1}. {questions[current].question}
          </h3>
          {questions[current].type === 'multiple' ? (
            <div className="flex flex-col gap-2">
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
        </div>
      </div>
    );

  // Result section
  const badge = getBadge(score, questions.length);

  return (
    <div className="flex flex-col items-center justify-center min-w-[320px] md:min-w-[380px] py-8">
      <BadgeGraphic badge={badge} user={user} />
      <div className="mt-2 text-neutral-500 font-semibold text-lg">
        Correct Answers: <span className="text-cyan-600">{score}</span> / {questions.length}
      </div>
      <button
        className="mt-7 w-full rounded-xl px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition text-white text-lg font-bold shadow-lg flex items-center justify-center gap-2"
        onClick={shareOnTwitter}
        aria-label="Share badge to X"
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" aria-hidden className="mr-1">
          <path d="M20.877 20.877h-3.681l-5.401-7.406-4.097 7.406H2l7.332-12.892-6.629-7.424h3.672l5.075 6.588L15.4 2h3.58l-7.157 11.935L20.877 20.877z" fill="currentColor"/>
        </svg>
        Share badge on X
      </button>
      <button
        className="mt-4 text-cyan-400 hover:text-cyan-600 underline font-semibold"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}

// Short answer input (with focus/keyboard UX)
function ShortInput({ onSubmit }: { onSubmit: (ans: string) => void }) {
  const [v, setV] = useState('');
  useEffect(() => {
    // Auto focus input for keyboard UX
    const el = document.getElementById('quiz-short-input');
    if (el) (el as HTMLInputElement).focus();
  }, []);
  return (
    <form
      className="flex gap-2 mt-1"
      onSubmit={e => {
        e.preventDefault();
        if (!v) return;
        onSubmit(v);
        setV('');
      }}
    >
      <input
        id="quiz-short-input"
        value={v}
        onChange={e => setV(e.target.value)}
        className="flex-1 rounded-xl border border-cyan-200 bg-white/90 px-3 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow"
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
