import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* --- Section 3: The Problem --- */
export function Problem() {
  return (
    <section className="py-28 lg:py-40 bg-linen">
      <div className="mx-auto max-w-6xl px-6 lg:px-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        <blockquote className="font-display text-[28px] sm:text-[32px] leading-snug text-ink">
          "Some days the homework is impossible.
          <br />
          Some days the schedule doesn't care.
          <br />
          <span className="italic" style={{ color: 'var(--sky)' }}>
            That gap is where children break.
          </span>
          "
        </blockquote>
        <div className="space-y-7 text-[17px] leading-[1.7] text-ink/85">
          {[
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <circle cx="10" cy="10" r="7.5" />
                  <path d="M10 5.5v5l3 2" strokeLinecap="round" />
                </svg>
              ),
              text: "School calendars run on fixed weeks. Bodies don't. A flare on Tuesday doesn't move Thursday's worksheet.",
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M3 6h14M3 10h14M3 14h9" strokeLinecap="round" />
                </svg>
              ),
              text: 'Homework lists are written for the average child on the average day. Your child has neither.',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M4 16c2-4 10-4 12 0M10 9V4M7 5l3-2 3 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              text: 'Work piles up. Guilt follows. Then the avoidance. Then the family argument over a worksheet that was never going to fit.',
            },
          ].map((p) => (
            <div key={p.text} className="flex gap-4">
              <span className="mt-1 text-ink/60 flex-shrink-0">{p.icon}</span>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Section 4: The Shift --- */
export function Shift() {
  const days = [
    {
      label: 'Low energy',
      glyph: '😴',
      tasks: ['Read one short page'],
      note: 'One task. Done in ten minutes. Enough.',
    },
    {
      label: 'Steady',
      glyph: '🙂',
      tasks: ['Read one short page', 'Three maths warmups', 'Sketch a leaf'],
      note: 'The normal rhythm — kind and clear.',
    },
    {
      label: 'Bright',
      glyph: '⚡',
      tasks: [
        'Read one short page',
        'Three maths warmups',
        'Sketch a leaf',
        'Write a six-line poem',
        'Finish history timeline',
      ],
      note: 'When the body says yes, the day stretches.',
    },
  ];

  return (
    <section className="relative py-28 lg:py-40 overflow-hidden" style={{ background: 'var(--clay)' }}>
      <div className="absolute inset-x-0 top-0 pencil-divider opacity-60" />
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-center text-ink max-w-3xl mx-auto leading-[1.08]">
          What if the day asked the{' '}
          <em className="not-italic" style={{ color: 'var(--sky)' }}>
            child
          </em>{' '}
          first?
        </h2>
        <p className="text-center text-muted-foreground mt-5 max-w-xl mx-auto">
          One source of homework. Three honest days. Drag to walk through them.
        </p>

        <div className="mt-16 grid gap-5 lg:gap-7 md:grid-cols-3 items-start">
          {days.map((d, i) => (
            <article
              key={d.label}
              className="paper-card p-7 animate-rise"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{d.label}</span>
                <span className="text-2xl" aria-hidden>
                  {d.glyph}
                </span>
              </div>
              <ul className="space-y-2.5">
                {d.tasks.map((t) => (
                  <li key={t} className="flex items-start gap-3 p-3 rounded-lg bg-linen/70">
                    <span
                      className="mt-1 h-4 w-4 rounded-full border-2 flex-shrink-0"
                      style={{ borderColor: 'var(--meadow)' }}
                    />
                    <span className="text-[15px] text-ink">{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-ink/70 italic">{d.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Section 5: How it works --- */
export function HowItWorks() {
  const chapters = [
    { n: '01', t: 'Each morning, the child checks in.', d: 'Energy and focus, three taps. No essays. No tests.' },
    { n: '02', t: 'EduFlow adapts the day.', d: 'Right size. Right order. Never too much.' },
    { n: '03', t: 'The child works in small steps.', d: 'Kind tasks, clear progress, easy pauses.' },
    { n: '04', t: 'Parents and teachers see the effort.', d: 'Honest signals. No more guessing.' },
  ];
  return (
    <section id="how" className="py-28 lg:py-40 bg-card">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="max-w-2xl mb-16">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">How it works</div>
          <h2 className="font-display text-4xl sm:text-5xl text-ink leading-[1.1]">
            Four quiet steps.{' '}
            <em className="not-italic" style={{ color: 'var(--meadow)' }}>
              Every day.
            </em>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {chapters.map((c, i) => (
            <article key={c.n} className="paper-card p-7 lg:p-9 relative">
              <span
                aria-hidden
                className="absolute top-4 right-5 text-[11px] font-mono text-ink/40"
                style={{ transform: `rotate(${i % 2 === 0 ? '-2deg' : '2deg'})` }}
              >
                ✕
              </span>
              <div className="font-display text-5xl tabular-nums mb-5" style={{ color: 'var(--sky)' }}>
                {c.n}
              </div>
              <h3 className="font-display text-2xl text-ink mb-3 leading-snug">{c.t}</h3>
              <p className="text-ink/75 leading-relaxed">{c.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Section 6: For every person --- */
export function Audiences() {
  const cards = [
    {
      who: 'For the child',
      copy: 'A space that meets you where you are today.',
      illo: (
        <svg
          viewBox="0 0 220 240"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-ink/75"
        >
          <circle cx="170" cy="46" r="15" stroke="var(--honey)" />
          <path d="M170 22v8M194 46h-8M188 28l-5 5M152 28l5 5" stroke="var(--honey)" />
          <circle cx="92" cy="104" r="22" />
          <path d="M64 178c0-18 12-30 28-30s28 12 28 30" />
          <path d="M70 150l22-9 22 9M92 141v34" />
          <path d="M40 196c40-7 100-7 150 2" opacity="0.6" />
        </svg>
      ),
    },
    {
      who: 'For the parent',
      copy: 'See the effort. Trust the rhythm.',
      illo: (
        <svg
          viewBox="0 0 220 240"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-ink/75"
        >
          <path d="M44 70C92 30 150 38 182 92" opacity="0.55" />
          <circle cx="80" cy="104" r="22" />
          <path d="M52 180c0-18 12-30 28-30s28 12 28 30" />
          <circle cx="142" cy="128" r="15" />
          <path d="M122 184c0-13 9-22 20-22s20 9 20 22" />
          <path
            d="M108 132c2-2.4 5.5-2.4 6.6 0 1.1-2.4 4.6-2.4 6.6 0 1.6 2-1.6 5.4-6.6 8.6-5-3.2-8.2-6.6-6.6-8.6z"
            stroke="var(--meadow)"
          />
        </svg>
      ),
    },
    {
      who: 'For the teacher',
      copy: 'Real signals, not excuses. Quiet weekly summaries.',
      illo: (
        <svg
          viewBox="0 0 220 240"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-ink/75"
        >
          <circle cx="58" cy="98" r="20" />
          <path d="M30 176c0-17 13-28 28-28s28 11 28 28" />
          <rect height="78" rx="6" width="92" x="104" y="60" />
          <path d="M116 116l16-18 14 12 22-30" stroke="var(--meadow)" />
          <path d="M150 84l16-6M166 78l-6-3M166 78l-3 6" stroke="var(--meadow)" />
          <path d="M120 150h60" opacity="0.5" />
        </svg>
      ),
    },
  ];
  return (
    <section className="py-28 lg:py-40 bg-linen">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <h2 className="font-display text-4xl sm:text-5xl text-ink leading-[1.1] max-w-2xl mb-16">
          For every person in the story.
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <article key={c.who} className="paper-card p-7 flex flex-col">
              <div
                className="aspect-[4/5] rounded-lg mb-6 flex items-center justify-center p-8"
                style={{ background: 'var(--clay)' }}
              >
                {c.illo}
              </div>
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">{c.who}</div>
              <p className="font-display text-2xl text-ink leading-snug">{c.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Section 7: The Promise --- */
export function Promise() {
  return (
    <section className="py-56 lg:py-72" style={{ background: 'var(--clay)' }}>
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="font-display text-3xl sm:text-5xl lg:text-6xl leading-[1.15] text-ink">
          No red badges.
          <br />
          No keeping score.
          <br />
          <span style={{ color: 'var(--meadow)' }}>Just today, done well enough.</span>
        </p>
      </div>
    </section>
  );
}

/* --- Section 8: Interactive sample --- */
const allTasks = [
  { title: 'Read one short page', meta: '5 min · English', weight: 1 },
  { title: 'Three maths warmups', meta: '8 min · Maths', weight: 2 },
  { title: 'Sketch a leaf you saw today', meta: '10 min · Science', weight: 3 },
  { title: 'Write a six-line poem', meta: '12 min · English', weight: 4 },
  { title: 'Finish history timeline', meta: '15 min · History', weight: 5 },
  { title: 'Practice spelling list', meta: '8 min · English', weight: 3 },
];

export function InteractiveSample() {
  const [level, setLevel] = useState(2);
  const counts = { 1: 1, 2: 3, 3: 6 };
  const labels = { 1: 'Resting', 2: 'Steady', 3: 'Bright' };
  const minutes = { 1: 5, 2: 23, 3: 58 };
  const tasks = allTasks.slice(0, counts[level]);

  return (
    <section className="py-28 lg:py-40 bg-card">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="text-center mb-14">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Try it</div>
          <h2 className="font-display text-4xl sm:text-5xl text-ink leading-[1.1]">
            Adjust the morning. Watch today breathe.
          </h2>
        </div>

        <div className="paper-card p-6 sm:p-10">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Today · Tuesday</div>
              <div className="font-display text-2xl text-ink mt-1">{labels[level]}</div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Total</div>
              <div className="font-display text-2xl tabular-nums text-ink mt-1">{minutes[level]} min</div>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3 px-1">
              <span>😴 Low</span>
              <span>🙂 Medium</span>
              <span>⚡ High</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={1}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              aria-label="Energy level"
              className="w-full h-2 rounded-full cursor-pointer"
              style={{
                background: `linear-gradient(90deg, var(--sky) 0%, var(--sky) ${((level - 1) / 2) * 100}%, var(--clay) ${
                  ((level - 1) / 2) * 100
                }%, var(--clay) 100%)`,
              }}
            />
          </div>

          <ul className="space-y-2.5">
            {tasks.map((t, i) => (
              <li
                key={t.title}
                className="flex items-start gap-4 p-4 rounded-xl bg-linen/70 border border-border/40 animate-rise"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span
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
    </section>
  );
}

/* --- Section 9: FAQ --- */
export function FAQ() {
  const items = [
    {
      q: 'Is EduFlow a medical tool?',
      a: "No. EduFlow doesn't diagnose, monitor, or treat anything. It simply adapts the school day to how a child says they feel.",
    },
    {
      q: 'Does it work without internet?',
      a: "Offline mode is on our roadmap. For now, a connection is needed to sync the day's plan.",
    },
    {
      q: 'Is my child’s data safe?',
      a: 'No medical data is stored. Mood check-ins live only as a daily signal — used to shape the day, then quietly archived.',
    },
    {
      q: 'Does my teacher need to use it?',
      a: 'No. EduFlow works on its own. If the teacher wants, gentle weekly summaries are available.',
    },
    {
      q: 'Is it free?',
      a: 'Yes during MVP. Freemium tiers will come later, with the core experience always free.',
    },
    {
      q: 'What ages?',
      a: 'Built for 8 to 14. The system is built to extend, so older students will follow.',
    },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="py-28 lg:py-40 bg-linen">
      <div className="mx-auto max-w-[720px] px-6">
        <h2 className="font-display text-4xl sm:text-5xl text-ink mb-14 leading-[1.1]">Soft questions, honest answers.</h2>
        <div className="space-y-3">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} className="paper-card">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-6 flex items-start justify-between gap-6 min-h-[44px]"
                >
                  <span className="font-display text-xl text-ink">{it.q}</span>
                  <span
                    aria-hidden
                    className={`mt-1.5 text-ink/50 transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`}
                  >
                    +
                  </span>
                </button>
                <div className="overflow-hidden transition-all duration-500" style={{ maxHeight: isOpen ? 200 : 0 }}>
                  <p className="px-6 pb-6 text-ink/80 leading-relaxed">{it.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --- Section 10: Final CTA --- */
export function FinalCTA() {
  return (
    <section id="cta" className="py-32 lg:py-44" style={{ background: 'var(--sky)' }}>
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.08]" style={{ color: 'oklch(0.98 0.01 85)' }}>
          Tomorrow morning starts gentler.
        </h2>
        <div className="mt-14">
          <Link
            to="/register"
            className="btn-paper inline-flex !px-12 !py-5 text-base"
            style={{ background: 'var(--linen)', color: 'var(--ink)' }}
          >
            Create your account
          </Link>
        </div>
        <p className="mt-6 text-sm" style={{ color: 'oklch(0.98 0.01 85 / 0.8)' }}>
          Free during MVP. No card required.
        </p>
      </div>
    </section>
  );
}

/* --- Section 11: Footer --- */
export function Footer() {
  return (
    <footer className="bg-linen">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="pencil-divider opacity-50" />
        <div className="h-20 flex items-center justify-between text-sm text-ink/70">
          <span className="font-display text-base text-ink">EduFlow</span>
          <span>ISEP Software Engineering — Team Banana Yellow — 2026</span>
        </div>
      </div>
    </footer>
  );
}

/* --- Generic reveal-on-scroll wrapper --- */
export function Reveal({ children }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      {children}
    </div>
  );
}
