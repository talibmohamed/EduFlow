import { useState } from 'react';
import { Link } from 'react-router-dom';

const moods = [
  { key: 'low', glyph: '😴', label: 'Resting' },
  { key: 'mid', glyph: '🙂', label: 'Steady' },
  { key: 'high', glyph: '⚡', label: 'Bright' },
];

const tasksBy = {
  low: [{ title: 'Read one short page', meta: '5 min · English' }],
  mid: [
    { title: 'Read one short page', meta: '5 min · English' },
    { title: 'Three multiplication warmups', meta: '8 min · Maths' },
    { title: 'Sketch a leaf you saw today', meta: '10 min · Science' },
  ],
  high: [
    { title: 'Read one short page', meta: '5 min · English' },
    { title: 'Three multiplication warmups', meta: '8 min · Maths' },
    { title: 'Sketch a leaf you saw today', meta: '10 min · Science' },
    { title: 'Write a six-line poem', meta: '12 min · English' },
    { title: 'Finish history timeline', meta: '15 min · History' },
  ],
};

export function Hero() {
  const [mood, setMood] = useState('mid');
  const tasks = tasksBy[mood];

  const words = ['Homework', 'that', 'listens', 'before', 'it', 'asks.'];

  return (
    <section id="top" className="relative pt-32 pb-24 lg:pt-44 lg:pb-32 overflow-hidden">
      {/* Dawn gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, var(--linen) 0%, var(--linen) 40%, oklch(0.93 0.04 240 / 0.35) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px -z-10"
        style={{ background: 'linear-gradient(90deg, transparent, oklch(0.58 0.19 263 / 0.15), transparent)' }}
      />

      <div className="mx-auto max-w-6xl px-6 lg:px-10 text-center">
        <h1 className="font-display text-[42px] sm:text-6xl lg:text-[80px] leading-[1.02] text-ink">
          {words.map((w, i) => (
            <span
              key={i}
              className="inline-block animate-breath mr-[0.28em]"
              style={{ animationDelay: `${i * 220}ms` }}
            >
              {w === 'listens' ? (
                <span className="swash">
                  listens
                  <svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden>
                    <path
                      className="swash-path"
                      d="M3 9 C 50 3 90 12 140 6 S 196 4 197 7"
                      fill="none"
                      stroke="var(--honey)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      pathLength="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </span>
              ) : (
                w
              )}
            </span>
          ))}
        </h1>

        {/* Mood orbit */}
        <div
          className="mt-16 lg:mt-20 mx-auto relative h-40 flex items-center justify-center gap-10 sm:gap-16"
          role="radiogroup"
          aria-label="How does the child feel today?"
        >
          {moods.map((m, i) => {
            const active = mood === m.key;
            return (
              <button
                key={m.key}
                role="radio"
                aria-checked={active}
                aria-label={m.label}
                onMouseEnter={() => setMood(m.key)}
                onFocus={() => setMood(m.key)}
                onClick={() => setMood(m.key)}
                className={`relative animate-float text-5xl sm:text-6xl transition-all duration-500 ${
                  active ? 'scale-125' : 'scale-90 opacity-55 hover:opacity-90'
                }`}
                style={{ animationDelay: `${i * 1200}ms` }}
              >
                <span aria-hidden>{m.glyph}</span>
                {active && (
                  <span
                    aria-hidden
                    className="absolute -inset-6 rounded-full -z-10"
                    style={{
                      background: 'radial-gradient(circle, oklch(0.86 0.16 95 / 0.35), transparent 70%)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-2 text-sm text-muted-foreground">Hover the feelings — watch today reshape itself.</p>

        {/* Live homework preview */}
        <div className="mt-10 mx-auto max-w-2xl">
          <div className="paper-card p-5 sm:p-7 text-left">
            <div className="flex items-center justify-between mb-5">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Today · Tuesday</div>
              <div className="text-xs tabular-nums text-muted-foreground">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              </div>
            </div>
            <ul className="space-y-2.5">
              {tasks.map((t, i) => (
                <li
                  key={t.title}
                  className="flex items-start gap-4 p-4 rounded-xl bg-linen/60 border border-border/40 animate-rise"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span
                    aria-hidden
                    className="mt-1 h-5 w-5 rounded-full border-2 flex-shrink-0"
                    style={{ borderColor: 'var(--meadow)' }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-ink">{t.title}</div>
                    <div className="text-sm text-muted-foreground tabular-nums">{t.meta}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/register" className="btn-paper btn-primary">
            Start your morning
          </Link>
          <a href="#how" className="btn-paper btn-ghost">
            How it works
          </a>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          For children 8–14 — built with families, doctors, and teachers.
        </p>
      </div>
    </section>
  );
}
