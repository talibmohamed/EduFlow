import { Button } from '@heroui/react';

export function EmptyState({ emoji, title, description, action }) {
  return (
    <div className="empty-island">
      <div className="breath-emoji text-[48px] leading-none" aria-hidden>
        {emoji}
      </div>
      <h3 className="mt-5 font-display text-[20px] font-medium text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-[440px] text-[15px] leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}

export function CandleButton({ children }) {
  return (
    <Button
      className="candle-btn !rounded-full !border-[color:var(--clay)] !bg-[color:var(--linen)] !px-5 !py-2.5 !text-sm !font-medium !text-ink"
      variant="bordered"
    >
      <span aria-hidden className="candle-dot" />
      {children}
    </Button>
  );
}

export default EmptyState;
