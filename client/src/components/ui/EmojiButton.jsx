/**
 * Uses onClick intentionally, not HeroUI onPress, so showcase states can mirror native button behavior.
 */
export function EmojiButton({
  emoji,
  label,
  selected,
  forceHover,
  forceFocus,
  onClick,
  ariaLabel,
}) {
  return (
    <button
      aria-label={ariaLabel ?? label}
      aria-pressed={selected}
      className="emoji-btn"
      data-force-focus={forceFocus ? '' : undefined}
      data-force-hover={forceHover ? '' : undefined}
      data-selected={selected ? '' : undefined}
      onClick={onClick}
      type="button"
    >
      {selected && <span aria-hidden className="emoji-btn-halo" />}
      <span aria-hidden className="emoji-btn-glyph">
        {emoji}
      </span>
      <span className="emoji-btn-label">{label}</span>
    </button>
  );
}

export function KitField({ heading, children }) {
  return (
    <div>
      {heading && (
        <div className="mb-3 text-center font-display text-[14px] text-ink/85">
          {heading}
        </div>
      )}
      {children}
    </div>
  );
}

export default EmojiButton;
