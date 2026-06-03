import { Button, Card, Chip } from '@heroui/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CandleButton,
  EmojiButton,
  EmptyState,
  ENERGY_CHOICES,
  EnergyPicker,
  FOCUS_CHOICES,
  HomeworkCard,
} from '../components/ui';

function Section({ title, description, children }) {
  return (
    <section className="mb-16 sm:mb-20">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <div>
          <h2 className="font-display text-[24px] text-ink">{title}</h2>
          <p className="mt-1.5 text-[14px] text-muted-foreground">{description}</p>
        </div>
        <Chip
          className="shrink-0 !rounded-full !bg-[color:var(--clay)]/60 !text-[11px] !uppercase !tracking-[0.14em] !text-ink/70"
          size="sm"
          variant="flat"
        >
          HeroUI
        </Chip>
      </div>
      <Card className="kit-stage !rounded-2xl !border !border-[color:var(--clay)]/60 !bg-white/70 !p-8 !shadow-none">
        {children}
      </Card>
    </section>
  );
}

function StateLabel({ children }) {
  return (
    <div className="mb-4 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </div>
  );
}

export default function UiKit() {
  const [scrolled, setScrolled] = useState(false);
  const [energy, setEnergy] = useState('low');
  const [focus, setFocus] = useState('medium');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;

    const root = document.documentElement;
    let toggled = false;
    const id = window.setInterval(() => {
      toggled = !toggled;
      root.classList.toggle('page-breath-warm', toggled);
    }, 12000);

    return () => {
      window.clearInterval(id);
      root.classList.remove('page-breath-warm');
    };
  }, []);

  return (
    <div className="min-h-screen bg-linen text-ink">
      <header
        className={`fixed inset-x-0 top-0 z-50 h-16 transition-all duration-500 ${
          scrolled ? 'nav-frosted' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">
          <span className="font-display text-[17px] tracking-tight text-ink">
            EduFlow — UI kit
          </span>
          <Button
            as={Link}
            className="!rounded-full !border-[color:var(--clay)] !bg-transparent !px-4 !py-2 !text-sm !text-ink"
            to="/"
            variant="bordered"
          >
            ← Back to home
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-16 pt-28 sm:pb-20 sm:pt-32">
        <Section
          description="The pill button a child taps to share how they feel. Multiple states."
          title="EmojiButton"
        >
          <div className="flex flex-wrap justify-center gap-8">
            <div>
              <StateLabel>Default</StateLabel>
              <EmojiButton emoji="😴" label="Low" />
            </div>
            <div>
              <StateLabel>Hover</StateLabel>
              <EmojiButton emoji="🙂" forceHover label="Medium" />
            </div>
            <div>
              <StateLabel>Focus</StateLabel>
              <EmojiButton emoji="⚡" forceFocus label="Bright" />
            </div>
            <div>
              <StateLabel>Selected</StateLabel>
              <EmojiButton emoji="🎈" label="Low" selected />
            </div>
            <div>
              <StateLabel>Selected + Hover</StateLabel>
              <EmojiButton emoji="🚀" forceHover label="High" selected />
            </div>
          </div>
        </Section>

        <Section
          description="Three EmojiButtons on a soft feelings spectrum. Used for energy or focus."
          title="EnergyPicker"
        >
          <div className="space-y-8">
            <EnergyPicker
              choices={ENERGY_CHOICES}
              heading="How is your energy today?"
              onChange={setEnergy}
              value={energy}
            />
            <EnergyPicker
              choices={FOCUS_CHOICES}
              heading="How is your focus today?"
              onChange={setFocus}
              value={focus}
            />
            <div className="pt-2 text-center text-[13px] tabular-nums text-muted-foreground">
              Selected: energy={energy}, focus={focus}
            </div>
          </div>
        </Section>

        <Section
          description="One homework item. Calm copy, gentle pacing, never blaming."
          title="HomeworkCard"
        >
          <div className="mx-auto max-w-xl space-y-4">
            <HomeworkCard dueInDays={0} minutes={10} subject="English" title="Read chapter 3" />
            <HomeworkCard
              dueInDays={3}
              minutes={25}
              stepsLeft={2}
              subject="Science"
              title="Map of animals"
            />
            <HomeworkCard
              dueInDays={5}
              minutes={40}
              stepsLeft={3}
              subject="Maths"
              title="Math exercises"
            />
            <HomeworkCard
              dueInDays={0}
              forceHover
              minutes={10}
              subject="English"
              title="Read chapter 3"
            />
          </div>
        </Section>

        <Section
          description="When a list has nothing in it. Absence as a quiet, intentional moment."
          title="EmptyState"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <EmptyState
              description="Enjoy a quiet moment."
              emoji="🌿"
              title="No homework today"
            />
            <EmptyState
              action={
                <CandleButton>
                  <Link to="/">Back to home</Link>
                </CandleButton>
              }
              description="Start a task and you'll see it light up."
              emoji="✨"
              title="Your progress will appear here"
            />
          </div>
        </Section>

        <footer className="pt-8 text-center text-[12px] text-muted-foreground">
          Internal preview page. Not linked from the public site.
        </footer>
      </main>
    </div>
  );
}
