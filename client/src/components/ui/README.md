# EduFlow UI kit

Last updated: 2026-06-03

Small domain-specific wrappers around HeroUI primitives. These components keep EduFlow calm, props-driven, and consistent with `client/DESIGN-SYSTEM.md`.

## Conventions

- Calm voice.
- No red.
- English defaults.
- Props-driven copy.
- HeroUI primitives only.
- Design-system tokens and classes only.
- Warm paper surfaces.
- Touch-friendly controls.

## EmojiButton

| Prop | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `emoji` | `string` | Yes | None | Large glyph shown above the label. |
| `label` | `string` | Yes | None | Visible text under the emoji. |
| `selected` | `boolean` | No | `false` | Uses primary solid styling when selected. |
| `onPress` | `() => void` | No | None | Called by the HeroUI button. |
| `ariaLabel` | `string` | No | `label` | Accessible button label. |

```jsx
<EmojiButton emoji="🙂" label="Medium" selected onPress={() => setEnergy('medium')} />
```

## EnergyPicker

| Prop | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `kind` | `'energy' \| 'focus'` | No | `'energy'` | Selects the emoji preset. |
| `value` | `'low' \| 'medium' \| 'high'` | Yes | None | Current selected level. |
| `onChange` | `(next) => void` | Yes | None | Receives the next level. |
| `label` | `string` | No | None | Small heading above the group. |

- Energy preset: low `😴`, medium `🙂`, high `⚡`.
- Focus preset: low `🎈`, medium `📘`, high `🚀`.
- Level labels: `Low`, `Medium`, `High`.

```jsx
<EnergyPicker value={energy} onChange={setEnergy} label="How is your energy today?" />
```

```jsx
<EnergyPicker kind="focus" value={focus} onChange={setFocus} label="How is your focus today?" />
```

## HomeworkCard

| Prop | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `homework` | `object` | Yes | None | Contains `id`, `title`, `subject`, `dueDate`, `estimatedMinutes`, optional `difficulty`, optional `priority`. |
| `onPress` | `() => void` | No | None | Makes the HeroUI card pressable. |
| `tasksRemaining` | `number` | No | None | Shows a success chip with steps left. |

```jsx
<HomeworkCard
  homework={{
    id: 1,
    title: 'Read chapter 3',
    subject: 'English',
    dueDate: new Date(),
    estimatedMinutes: 10,
  }}
  tasksRemaining={1}
/>
```

- Difficulty is intentionally hidden.
- This matches the MVP decision.

## EmptyState

| Prop | Type | Required | Default | Notes |
| --- | --- | --- | --- | --- |
| `emoji` | `string` | No | `🌿` | Calm visual marker. |
| `title` | `string` | Yes | None | Main message. |
| `description` | `string` | No | None | Supporting text. |
| `action` | `ReactNode` | No | None | Optional action slot. |

```jsx
<EmptyState emoji="🌿" title="No homework today" description="Enjoy a quiet moment." />
```

- `No homework today` — `Enjoy a quiet moment.`
- `Your progress will appear here` — `Start a task and you'll see it light up.`
- `Nothing to review` — `Come back when a new update is ready.`

## Adding a new wrapper

Start from a HeroUI primitive. Keep copy configurable through props. Use existing design-system tokens and classes. Avoid new colors, raw controls, and blame-oriented wording.

## Showcase

Live preview at `/ui-kit` (public, dev only).
