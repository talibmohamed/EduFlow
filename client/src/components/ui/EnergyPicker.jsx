import { useState } from 'react';
import { EmojiButton } from './EmojiButton';

export const ENERGY_CHOICES = [
  { key: 'low', emoji: '😴', label: 'Low' },
  { key: 'medium', emoji: '🙂', label: 'Medium' },
  { key: 'high', emoji: '⚡', label: 'High' },
];

export const FOCUS_CHOICES = [
  { key: 'low', emoji: '🎈', label: 'Low' },
  { key: 'medium', emoji: '📘', label: 'Medium' },
  { key: 'high', emoji: '🚀', label: 'High' },
];

export function EnergyPicker({ heading, choices, value, onChange }) {
  const [local, setLocal] = useState(value);
  const selected = onChange ? value : local;

  function handleSelect(key) {
    if (onChange) {
      onChange(key);
      return;
    }

    setLocal(key);
  }

  return (
    <div>
      {heading && (
        <div className="mb-4 text-center font-display text-[14px] text-ink/85">
          {heading}
        </div>
      )}
      <div className="relative">
        <svg
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-1/2 h-2 w-full -translate-y-1/2"
          preserveAspectRatio="none"
          viewBox="0 0 600 8"
        >
          <path
            d="M0 4 Q 60 2.2, 120 4 T 240 4 T 360 4 T 480 4 T 600 4"
            fill="none"
            stroke="var(--clay)"
            strokeLinecap="round"
            strokeOpacity="0.55"
            strokeWidth="1"
          />
        </svg>
        <div className="relative flex items-end justify-center gap-4">
          {choices.map((choice) => {
            const isSelected = choice.key === selected;

            return (
              <div
                className="transition-transform duration-500"
                key={choice.key}
                style={{ transform: isSelected ? 'translateY(-4px)' : 'translateY(0)' }}
              >
                <EmojiButton
                  emoji={choice.emoji}
                  label={choice.label}
                  onClick={() => handleSelect(choice.key)}
                  selected={isSelected}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default EnergyPicker;
