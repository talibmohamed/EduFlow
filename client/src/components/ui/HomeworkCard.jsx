import { Chip } from '@heroui/react';

function formatDue(days, label) {
  if (days <= 0) return { text: 'Due today', tone: 'accent' };
  if (days === 1) return { text: 'Due tomorrow', tone: 'accent' };
  if (days <= 7) return { text: `Due in ${days} days`, tone: 'muted' };
  return { text: `Due ${label ?? ''}`.trim(), tone: 'muted' };
}

// Difficulty is displayed but never used by the adaptation algorithm (cahier §4.3.3).
const DIFFICULTY_FALLBACK_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
const DIFFICULTY_BG = {
  easy: 'var(--meadow)',
  medium: 'var(--sky)',
  hard: 'var(--ink)',
};

export function HomeworkCard({
  title,
  subject,
  minutes,
  dueLabel,
  dueTone,
  dueInDays,
  dueDateLabel,
  stepsLeft,
  difficulty,
  difficultyLabel,
  forceHover,
}) {
  const due = dueLabel
    ? { text: dueLabel, tone: dueTone ?? 'muted' }
    : formatDue(dueInDays, dueDateLabel);
  const bigTask = minutes >= 30;
  const difficultyText = difficulty
    ? difficultyLabel ?? DIFFICULTY_FALLBACK_LABEL[difficulty]
    : null;

  return (
    <div className="hw-card group" data-force-hover={forceHover ? '' : undefined}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Chip className="hw-subject flex-shrink-0" size="sm" variant="flat">
            {subject}
          </Chip>
          {difficultyText && (
            <Chip
              size="sm"
              variant="flat"
              className="flex-shrink-0 text-[11px] font-semibold uppercase tracking-wide"
              style={{ background: DIFFICULTY_BG[difficulty], color: 'white' }}
            >
              {difficultyText}
            </Chip>
          )}
        </div>
        <span className="text-[13px] tabular-nums text-muted-foreground flex-shrink-0">
          <span className={bigTask ? 'hw-min-big' : ''}>{minutes} min</span>
        </span>
      </div>
      <h3 className="mt-3 font-display text-[19px] font-medium leading-snug text-ink">
        {title}
      </h3>
      <div className="mt-4 flex items-center justify-between">
        <span
          className={
            due.tone === 'accent'
              ? 'text-[14px] font-medium text-[color:var(--sky)]'
              : 'text-[14px] text-muted-foreground'
          }
        >
          {due.text}
        </span>
        {typeof stepsLeft === 'number' && stepsLeft > 0 && (
          <Chip className="hw-steps" size="sm" variant="flat">
            {stepsLeft} steps left
          </Chip>
        )}
      </div>
    </div>
  );
}

export default HomeworkCard;
