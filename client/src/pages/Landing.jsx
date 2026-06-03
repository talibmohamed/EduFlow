/*
 * EduFlow — landing page.
 *
 * A calm, adaptive homework companion for children 8–14 with fluctuating energy.
 * Design intent: Apple-grade restraint, Headspace warmth, Linear's editorial
 * sharpness. Everything breathes; nothing screams. No red, ever.
 *
 * The whole page shares ONE "energy" state (low / medium / high). It drives both
 * the product demos *and* the page's own mood (type size, motion, palette warmth).
 * By the time a visitor reaches the final CTA, they have already used EduFlow.
 */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';

/* ------------------------------------------------------------------ data --- */

const WEEKDAY = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

const ENERGY = {
  low: { key: 'low', emoji: '😴', label: 'Rest', day: 'A heavy morning' },
  medium: { key: 'medium', emoji: '🙂', label: 'Steady', day: 'A steady morning' },
  high: { key: 'high', emoji: '⚡', label: 'Bright', day: 'A bright morning' },
};
const ORDER = ['low', 'medium', 'high'];

// The same homework, sized to the day: a heavy morning keeps only the gentlest
// task; a bright one holds the full list. Same source, different shape.
const SOURCE = [
  { id: 'read', subject: 'English', title: 'Read one short page', min: 5, in: ['low', 'medium', 'high'] },
  { id: 'maths', subject: 'Maths', title: 'Three multiplication warm-ups', min: 8, in: ['medium', 'high'] },
  { id: 'leaf', subject: 'Science', title: 'Sketch a leaf you saw today', min: 10, in: ['medium', 'high'] },
  { id: 'poem', subject: 'English', title: 'Write a six-line poem', min: 12, in: ['high'] },
  { id: 'history', subject: 'History', title: 'Finish history timeline', min: 15, in: ['high'] },
];

const tasksFor = (energy) => SOURCE.filter((task) => task.in.includes(energy));

// Section 4 — the three honest days, in their own lighter "table" style.
const SHIFT = {
  low: { label: 'Low energy', note: 'One task. Done in ten minutes. Enough.' },
  medium: { label: 'Steady', note: 'The normal rhythm — kind and clear.' },
  high: { label: 'Bright', note: 'When the body says yes, the day stretches.' },
};

const PROBLEMS = [
  {
    Icon: ClockGlyph,
    text: 'Fixed homework assumes a fixed body. The schedule is set long before anyone asks how today actually feels.',
  },
  {
    Icon: GridGlyph,
    text: 'On a hard day, a long list is not motivation — it is a wall. The effort a child did manage gets lost behind it.',
  },
  {
    Icon: PulseGlyph,
    text: 'Energy moves. Some mornings hold a lot, some hold a little. School rarely leaves room for that difference.',
  },
];

const CHAPTERS = [
  ['01', 'Each morning, the child checks in.', 'Energy and focus, in three calm taps.', 'checkin'],
  ['02', 'EduFlow adapts the day.', 'The right size, the right order — never too much at once.', 'adapt'],
  ['03', 'The child works in small steps.', 'Kind tasks, with clear and visible progress.', 'steps'],
  ['04', 'Parents and teachers see the effort.', 'Honest signals, quietly shared. No more guessing.', 'effort'],
];

const ROLES = [
  ['For the child', 'A space that meets you where you are today.', ChildArt],
  ['For the parent', 'See the effort. Trust the rhythm.', ParentArt],
  ['For the teacher', 'Real signals, not excuses. Quiet weekly summaries.', TeacherArt],
];

const FAQS = [
  [
    'Is EduFlow a medical tool?',
    'No. EduFlow does not diagnose or treat anything. It simply adapts the day’s workload around a short morning check-in.',
  ],
  [
    'Does it work without internet?',
    'Offline support is on the roadmap. For now, EduFlow needs a connection to sync the day.',
  ],
  [
    'Is my child’s data safe?',
    'Yes. No medical data is stored — only a simple daily signal, kept private to your family.',
  ],
  [
    'Does my teacher need to use it?',
    'No. Families can begin on their own. If a teacher wants context, gentle weekly summaries are available.',
  ],
  ['Is it free?', 'Free during the MVP, with no card required. A freemium option may come later.'],
  ['What ages?', 'Built for children 8 to 14, with room to grow alongside them.'],
];

/* --------------------------------------------------------------- motion --- */

const EASE = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: i * 0.08 } }),
};

const wordUp = {
  hidden: { opacity: 0, y: '0.55em' },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.1 + i * 0.085 } }),
};

const viewportOnce = { once: true, amount: 0.25 };

/* ----------------------------------------------------------- primitives --- */

// A block that rises 12px into view once. Honors reduced motion via MotionConfig.
function Reveal({ as = 'div', i = 0, className, children, ...rest }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      custom={i}
      initial="hidden"
      variants={fadeUp}
      viewport={viewportOnce}
      whileInView="show"
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Display heading whose words fade in one by one, with a single "beat" word that
// lands a touch later — a quiet rhythm break, like a heartbeat.
function Heading({ text, beat, accent, className = '', id }) {
  const words = text.split(' ');
  return (
    <motion.h2
      className={`ef-head ${className}`}
      id={id}
      initial="hidden"
      viewport={{ once: true, amount: 0.4 }}
      whileInView="show"
    >
      {words.map((word, i) => {
        const clean = word.replace(/[.,?!’']/g, '');
        const isBeat = beat && clean === beat;
        const wordClass = ['ef-word', isBeat && 'ef-beat', accent && clean === accent && 'ef-accent']
          .filter(Boolean)
          .join(' ');
        return (
          <motion.span className={wordClass} custom={isBeat ? i + 1.5 : i} key={`${word}-${i}`} variants={wordUp}>
            {word}
          </motion.span>
        );
      })}
    </motion.h2>
  );
}

// A faint pale-clay band that sweeps in as the section arrives — like turning a
// page in a notebook.
function PageTurn() {
  return (
    <motion.span
      aria-hidden="true"
      className="ef-pageturn"
      initial={{ scaleX: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
      viewport={{ once: true, amount: 0.8 }}
      whileInView={{ scaleX: 1 }}
    />
  );
}

// Hand-drawn pencil divider — not a straight rule.
function PencilRule() {
  return (
    <div aria-hidden="true" className="ef-pencil">
      <svg height="12" preserveAspectRatio="none" viewBox="0 0 1200 12" width="100%">
        <path
          d="M3 7 C 180 1 340 11 560 5 S 980 1 1197 6"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

// Counts up to a number when it changes (instant under reduced motion).
function Ticker({ value, reduce }) {
  const mv = useMotionValue(value);
  const rounded = useTransform(mv, (v) => Math.round(v));
  useEffect(() => {
    const controls = animate(mv, value, { duration: reduce ? 0 : 0.5, ease: EASE });
    return () => controls.stop();
  }, [mv, value, reduce]);
  return <motion.span className="ef-tnum">{rounded}</motion.span>;
}

/* ------------------------------------------------------ product surfaces --- */

// The adaptive day: a clean white card whose task list reshapes with the energy
// level. Rows re-layout smoothly as they enter and leave (framer `layout`).
function AdaptiveStack({ energy, label = `TODAY · ${WEEKDAY}`, large = false, tick = false, reduce = false }) {
  const tasks = tasksFor(energy);
  const count = tasks.length;
  return (
    <div className={large ? 'ef-stack ef-stack-lg' : 'ef-stack'}>
      <div className="ef-stack-head">
        <span className="ef-stack-label">{label}</span>
        <span className="ef-stack-count">
          {tick ? <Ticker reduce={reduce} value={count} /> : <span className="ef-tnum">{count}</span>}{' '}
          {count === 1 ? 'task' : 'tasks'}
        </span>
      </div>
      <motion.ul className="ef-tasks">
        <AnimatePresence initial={false} mode="popLayout">
          {tasks.map((task, i) => (
            <motion.li
              animate={{ opacity: 1, y: 0 }}
              className="ef-task"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: 10 }}
              key={task.id}
              layout
              transition={{ duration: 0.45, ease: EASE, delay: i * 0.06 }}
            >
              <TaskCircle />
              <span className="ef-task-body">
                <span className="ef-task-title">{task.title}</span>
                <span className="ef-task-meta">
                  <span className="ef-tnum">{task.min}</span> min · {task.subject}
                </span>
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}

// A hollow green circle — a kind "to do", never a red mark.
function TaskCircle() {
  return (
    <svg aria-hidden="true" className="ef-task-circle" fill="none" height="22" viewBox="0 0 22 22" width="22">
      <circle cx="11" cy="11" r="9" stroke="var(--green)" strokeWidth="2" />
    </svg>
  );
}

// Three feelings, floating bare on the page. Hover, focus or click sets the mood;
// the active one scales up under a honey glow while the others rest, dimmed.
function EmojiRow({ active, onPreview, onCommit }) {
  return (
    <div aria-label="How does the child feel today?" className="ef-feelings" role="group">
      {ORDER.map((key, i) => {
        const mode = ENERGY[key];
        const isActive = active === key;
        return (
          <button
            aria-label={mode.label}
            aria-pressed={isActive}
            className={`ef-feeling${isActive ? ' is-active' : ''}`}
            key={key}
            onClick={() => onCommit(key)}
            onFocus={() => onPreview(key)}
            onMouseEnter={() => onPreview(key)}
            style={{ animationDelay: `${i * 1.2}s` }}
            type="button"
          >
            <span aria-hidden="true" className="ef-feeling-glow" />
            <span aria-hidden="true" className="ef-feeling-glyph">
              {mode.emoji}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// The page's mood switch, living in the nav. The unexpected move: it re-tones the
// entire site.
function EnergyChip({ value, onChange }) {
  return (
    <div aria-label="Set the mood of the page" className="ef-chip" role="group">
      {ORDER.map((key) => (
        <button
          aria-label={`${ENERGY[key].label} mode`}
          aria-pressed={value === key}
          className={value === key ? 'ef-chip-btn is-active' : 'ef-chip-btn'}
          key={key}
          onClick={() => onChange(key)}
          title={`${ENERGY[key].label} mode`}
          type="button"
        >
          <span aria-hidden="true">{ENERGY[key].emoji}</span>
        </button>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- hooks --- */

function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

// Drag-to-scroll for the horizontal day rail (touch scrolls natively).
function useDragScroll() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let down = false;
    let startX = 0;
    let startLeft = 0;
    const onDown = (e) => {
      down = true;
      startX = e.pageX;
      startLeft = el.scrollLeft;
      el.classList.add('is-grabbing');
    };
    const onMove = (e) => {
      if (!down) return;
      el.scrollLeft = startLeft - (e.pageX - startX);
    };
    const onUp = () => {
      down = false;
      el.classList.remove('is-grabbing');
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);
  return ref;
}

/* ----------------------------------------------------------------- page --- */

export default function Landing() {
  const [energy, setEnergy] = useState('medium'); // committed page mood — drives the gentle re-tone
  const [mood, setMood] = useState('medium'); // hero demo mood — follows hover, stays local and light
  const scrolled = useScrolled();
  const reduce = useReducedMotion();
  const dayRail = useDragScroll();

  // Commit a mood everywhere (click / chip / slider). Hover only nudges `mood`,
  // so sweeping the emojis never repaints the whole page.
  const commit = (key) => {
    setEnergy(key);
    setMood(key);
  };
  const sliderIndex = ORDER.indexOf(energy);

  return (
    <MotionConfig reducedMotion="user" transition={{ ease: EASE }}>
      <div className={`ef-root energy-${energy}`} data-energy={energy}>
        <a className="ef-skip" href="#main">
          Skip to content
        </a>
        <Grain />

        {/* 1 — NAV ----------------------------------------------------------- */}
        <nav className={scrolled ? 'ef-nav is-scrolled' : 'ef-nav'}>
          <Link className="ef-wordmark" to="/">
            <SunriseMark />
            EduFlow
          </Link>
          <div className="ef-nav-actions">
            <EnergyChip onChange={commit} value={energy} />
            <Link className="ef-btn ef-btn-ghost ef-nav-login" to="/login">
              Log in
            </Link>
            <Link className="ef-btn ef-btn-primary" to="/register">
              Get started
            </Link>
          </div>
        </nav>

        <main id="main">
          {/* 2 — HERO ------------------------------------------------------- */}
          <section className="ef-hero">
            <h1 className="ef-hero-title">
              {['Homework', 'that', 'listens', 'before', 'it', 'asks.'].map((word, i) => (
                <span className="ef-hero-word" key={word} style={{ animationDelay: `${i * 0.22}s` }}>
                  {word === 'listens' ? <Swash>listens</Swash> : word}
                </span>
              ))}
            </h1>

            <div className="ef-demo" aria-label="Interactive demonstration: the day adapts to how you feel">
              <EmojiRow active={mood} onCommit={commit} onPreview={setMood} />
              <p className="ef-feelings-hint">Hover the feelings — watch today reshape itself.</p>
              <AdaptiveStack energy={mood} reduce={reduce} />
            </div>

            <div className="ef-hero-cta">
              <Link className="ef-btn ef-btn-primary ef-btn-lg" to="/register">
                Start your morning
              </Link>
              <a className="ef-btn ef-btn-ghost ef-btn-lg" href="#how">
                How it works
              </a>
            </div>
            <p className="ef-hero-fine">
              For children 8–14 — built with families, doctors, and teachers.
            </p>
          </section>

          <PencilRule />

          {/* 3 — THE PROBLEM ------------------------------------------------ */}
          <section className="ef-section ef-problem" aria-labelledby="problem-quote">
            <Reveal as="blockquote" className="ef-quote" id="problem-quote">
              Some days the homework is impossible.
              <br />
              Some days the schedule doesn’t care.
              <br />
              <span className="ef-quote-accent">That gap is where children break.</span>
            </Reveal>
            <ul className="ef-problem-list">
              {PROBLEMS.map(({ Icon, text }, i) => (
                <Reveal as="li" className="ef-problem-item" i={i} key={text}>
                  <span aria-hidden="true" className="ef-problem-icon">
                    <Icon />
                  </span>
                  <p>{text}</p>
                </Reveal>
              ))}
            </ul>
          </section>

          {/* 4 — THE SHIFT -------------------------------------------------- */}
          <section className="ef-section ef-shift" aria-labelledby="shift-head">
            <PageTurn />
            <Heading accent="child" beat="first" className="ef-shift-head" id="shift-head" text="What if the day asked the child first?" />
            <p className="ef-shift-sub">One source of homework. Three honest days. Drag to walk through them.</p>
            <div className="ef-rail" ref={dayRail} tabIndex={0} aria-label="Three adapted days — drag to explore">
              {ORDER.map((key, i) => (
                <Reveal as="article" className="ef-day-card" i={i} key={key}>
                  <div className="ef-day-top">
                    <span className="ef-day-label">{SHIFT[key].label}</span>
                    <span aria-hidden="true" className="ef-day-glyph">
                      {ENERGY[key].emoji}
                    </span>
                  </div>
                  <ul className="ef-day-tasks">
                    {tasksFor(key).map((task) => (
                      <li className="ef-day-task" key={task.id}>
                        <span aria-hidden="true" className="ef-day-dot" />
                        <span>{task.title}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="ef-day-note">{SHIFT[key].note}</p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* 5 — HOW IT WORKS ----------------------------------------------- */}
          <section className="ef-section ef-how" id="how" aria-labelledby="how-rail">
            <p className="ef-rail-label" id="how-rail">
              How it works
            </p>
            <div className="ef-chapters">
              {CHAPTERS.map(([num, title, copy, kind], i) => (
                <Reveal as="article" className="ef-chapter" i={i} key={num}>
                  <span className="ef-chapter-num ef-tnum">{num}</span>
                  <MiniAnim kind={kind} />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* 6 — EVERYONE IN THE STORY -------------------------------------- */}
          <section className="ef-section ef-roles" aria-labelledby="roles-head">
            <Heading beat="story" className="ef-roles-head" id="roles-head" text="For everyone in the story." />
            <div className="ef-roles-grid">
              {ROLES.map(([title, copy, Art], i) => (
                <Reveal as="article" className="ef-role" i={i} key={title}>
                  <div className="ef-art">
                    <Art />
                  </div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </Reveal>
              ))}
            </div>
          </section>

          {/* 7 — THE PROMISE ------------------------------------------------ */}
          <section className="ef-section ef-promise" aria-labelledby="promise-head">
            <PageTurn />
            <h2 className="ef-haiku" id="promise-head">
              <Reveal as="span" i={0}>
                No red badges.
              </Reveal>
              <Reveal as="span" i={1}>
                No keeping score.
              </Reveal>
              <Reveal as="span" className="ef-haiku-accent" i={2}>
                Just today, done well enough.
              </Reveal>
            </h2>
          </section>

          {/* 8 — INTERACTIVE SAMPLE ----------------------------------------- */}
          <section className="ef-section ef-sample" aria-labelledby="sample-head">
            <div className="ef-sample-copy">
              <Heading beat="soften" id="sample-head" text="Adjust the day. Watch the work soften." />
              <p>
                The same homework can become one gentle step, a balanced list, or a fuller day. The
                product changes shape long before a child ever feels judged.
              </p>
              <label className="ef-slider-label" htmlFor="ef-slider">
                <span>Energy today</span>
                <strong>
                  {ENERGY[energy].emoji} {ENERGY[energy].label}
                </strong>
              </label>
              <input
                className="ef-slider"
                id="ef-slider"
                max="2"
                min="0"
                onChange={(e) => commit(ORDER[Number(e.target.value)])}
                step="1"
                type="range"
                value={sliderIndex}
                aria-valuetext={ENERGY[energy].label}
              />
              <div aria-hidden="true" className="ef-stations">
                {ORDER.map((key) => (
                  <button
                    className={energy === key ? 'is-active' : ''}
                    key={key}
                    onClick={() => commit(key)}
                    tabIndex={-1}
                    type="button"
                  >
                    {ENERGY[key].emoji} {ENERGY[key].label}
                  </button>
                ))}
              </div>
            </div>
            <AdaptiveStack energy={energy} large reduce={reduce} tick />
          </section>

          {/* 9 — FAQ -------------------------------------------------------- */}
          <section className="ef-section ef-faq" aria-labelledby="faq-head">
            <Heading beat="softly" id="faq-head" text="Questions, answered softly." />
            <Faq items={FAQS} />
          </section>

          {/* 10 — FINAL CTA ------------------------------------------------- */}
          <section className="ef-final" aria-labelledby="final-head">
            <Reveal as="h2" className="ef-final-head" id="final-head">
              Tomorrow morning starts gentler.
            </Reveal>
            <Reveal as="div" i={1}>
              <Link className="ef-btn ef-btn-light ef-final-btn" to="/register">
                Create your account
              </Link>
            </Reveal>
            <Reveal as="p" className="ef-final-fine" i={2}>
              Free during the MVP. No card required.
            </Reveal>
          </section>
        </main>

        {/* 11 — FOOTER ------------------------------------------------------ */}
        <footer className="ef-footer">
          <span className="ef-footer-mark">EduFlow</span>
          <span className="ef-footer-credit">ISEP Software Engineering — Team Banana Yellow — 2026</span>
        </footer>
      </div>
    </MotionConfig>
  );
}

/* ------------------------------------------------------------ accordion --- */

function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="ef-faq-list">
      {items.map(([question, answer], i) => {
        const isOpen = open === i;
        return (
          <div className="ef-faq-item" key={question}>
            <h3 className="ef-faq-heading">
              <button
                aria-expanded={isOpen}
                className="ef-faq-q"
                onClick={() => setOpen(isOpen ? -1 : i)}
                type="button"
              >
                <span>{question}</span>
                <Chevron open={isOpen} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  animate={{ height: 'auto', opacity: 1 }}
                  className="ef-faq-a"
                  exit={{ height: 0, opacity: 0 }}
                  initial={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                  transition={{ duration: 0.32, ease: EASE }}
                >
                  <p>{answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------- looping mini-animations --- */

// Each tiny animation loops only while in view, and stops entirely under reduced
// motion (CSS gates on [data-play]).
function MiniAnim({ kind }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });
  return (
    <span aria-hidden="true" className={`ef-mini ef-mini-${kind}`} data-play={inView} ref={ref}>
      {kind === 'checkin' && (
        <svg fill="none" height="40" viewBox="0 0 64 40" width="64">
          <circle className="d d1" cx="14" cy="20" r="6" />
          <circle className="d d2" cx="32" cy="20" r="6" />
          <circle className="d d3" cx="50" cy="20" r="6" />
        </svg>
      )}
      {kind === 'adapt' && (
        <svg fill="none" height="40" viewBox="0 0 64 40" width="64">
          <rect className="bar b1" height="7" rx="3.5" width="46" x="9" y="6" />
          <rect className="bar b2" height="7" rx="3.5" width="46" x="9" y="17" />
          <rect className="bar b3" height="7" rx="3.5" width="46" x="9" y="28" />
        </svg>
      )}
      {kind === 'steps' && (
        <svg fill="none" height="40" viewBox="0 0 64 40" width="64">
          <circle cx="32" cy="20" opacity="0.25" r="14" />
          <circle className="ring" cx="32" cy="20" pathLength="1" r="14" transform="rotate(-90 32 20)" />
        </svg>
      )}
      {kind === 'effort' && (
        <svg fill="none" height="40" viewBox="0 0 64 40" width="64">
          <circle cx="32" cy="20" opacity="0.25" r="15" />
          <path className="tick" d="M24 20.5l5.5 5.5L41 14.5" pathLength="1" />
        </svg>
      )}
    </span>
  );
}

function Chevron({ open }) {
  return (
    <svg
      className="ef-chev"
      fill="none"
      height="20"
      style={{ transform: open ? 'rotate(180deg)' : 'none' }}
      viewBox="0 0 24 24"
      width="20"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

/* --------------------------------------- texture, marks & line drawings --- */

// A genuine paper grain: static fractal noise at ~4% opacity, multiply-blended.
function Grain() {
  return (
    <svg aria-hidden="true" className="ef-grain">
      <filter id="ef-noise">
        <feTurbulence baseFrequency="0.82" numOctaves="2" stitchTiles="stitch" type="fractalNoise" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect filter="url(#ef-noise)" height="100%" width="100%" />
    </svg>
  );
}

// Small sunrise mark beside the wordmark.
function SunriseMark() {
  return (
    <svg aria-hidden="true" className="ef-mark" fill="none" height="20" viewBox="0 0 24 24" width="24">
      <path d="M3 18h18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M6.5 18a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M12 3v3M5 8l1.6 1.6M19 8l-1.6 1.6" stroke="var(--honey)" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

// A hand-drawn honey underline that draws itself in under a word.
function Swash({ children }) {
  return (
    <span className="ef-swash">
      {children}
      <svg aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 200 14">
        <path
          className="ef-swash-path"
          d="M3 9 C 50 3 90 12 140 6 S 196 4 197 7"
          fill="none"
          pathLength="1"
          stroke="var(--honey)"
          strokeLinecap="round"
          strokeWidth="5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

const glyphProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function ClockGlyph() {
  return (
    <svg height="26" viewBox="0 0 28 28" width="26" {...glyphProps} strokeWidth={1.6}>
      <circle cx="14" cy="14" r="9" />
      <path d="M14 9v5l3.5 2.2" />
    </svg>
  );
}

function GridGlyph() {
  return (
    <svg height="26" viewBox="0 0 28 28" width="26" {...glyphProps} strokeWidth={1.6}>
      <rect height="18" rx="2.5" width="18" x="5" y="5" />
      <path d="M5 11h18M5 17h18M11 5v18" />
    </svg>
  );
}

function PulseGlyph() {
  return (
    <svg height="26" viewBox="0 0 28 28" width="26" {...glyphProps} strokeWidth={1.6}>
      <path d="M3 14h5l2.5-6 4 12 2.5-6H25" />
    </svg>
  );
}

// Editorial line illustrations — charcoal on cream, single weight, no photography.
function ChildArt() {
  return (
    <svg aria-hidden="true" className="ef-illu" viewBox="0 0 220 240" {...glyphProps} strokeWidth={2}>
      <circle cx="170" cy="46" r="15" stroke="var(--honey)" />
      <path d="M170 22v8M194 46h-8M188 28l-5 5M152 28l5 5" stroke="var(--honey)" />
      <circle cx="92" cy="104" r="22" />
      <path d="M64 178c0-18 12-30 28-30s28 12 28 30" />
      <path d="M70 150l22-9 22 9M92 141v34" />
      <path d="M40 196c40-7 100-7 150 2" opacity="0.6" />
    </svg>
  );
}

function ParentArt() {
  return (
    <svg aria-hidden="true" className="ef-illu" viewBox="0 0 220 240" {...glyphProps} strokeWidth={2}>
      <path d="M44 70C92 30 150 38 182 92" opacity="0.55" />
      <circle cx="80" cy="104" r="22" />
      <path d="M52 180c0-18 12-30 28-30s28 12 28 30" />
      <circle cx="142" cy="128" r="15" />
      <path d="M122 184c0-13 9-22 20-22s20 9 20 22" />
      <path d="M108 132c2-2.4 5.5-2.4 6.6 0 1.1-2.4 4.6-2.4 6.6 0 1.6 2-1.6 5.4-6.6 8.6-5-3.2-8.2-6.6-6.6-8.6z" stroke="var(--green)" />
    </svg>
  );
}

function TeacherArt() {
  return (
    <svg aria-hidden="true" className="ef-illu" viewBox="0 0 220 240" {...glyphProps} strokeWidth={2}>
      <circle cx="58" cy="98" r="20" />
      <path d="M30 176c0-17 13-28 28-28s28 11 28 28" />
      <rect height="78" rx="6" width="92" x="104" y="60" />
      <path d="M116 116l16-18 14 12 22-30" stroke="var(--green)" />
      <path d="M150 84l16-6M166 78l-6-3M166 78l-3 6" stroke="var(--green)" />
      <path d="M120 150h60" opacity="0.5" />
    </svg>
  );
}