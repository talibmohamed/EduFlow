import { Chip } from '@heroui/react';

function formatDue(days, label) {
  if (days <= 0) return { text: 'Due today', tone: 'accent' };
  if (days === 1) return { text: 'Due tomorrow', tone: 'accent' };
  if (days <= 7) return { text: `Due in ${days} days`, tone: 'muted' };
  return { text: `Due ${label ?? ''}`.trim(), tone: 'muted' };
}

export function HomeworkCard({
  title,
  subject,
  minutes,
  dueInDays,
  dueDateLabel,
  stepsLeft,
  forceHover,
}) {
  const due = formatDue(dueInDays, dueDateLabel);
  const bigTask = minutes >= 30;

  return (
    <div className="hw-card group" data-force-hover={forceHover ? '' : undefined}>
      <div className="flex items-center justify-between">
        <Chip className="hw-subject" size="sm" variant="flat">
          {subject}
        </Chip>
        <span className="text-[13px] tabular-nums text-muted-foreground">
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
