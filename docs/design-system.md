# Design System

## Contents

- [Typography](#typography)
- [CSS Custom Properties](#css-custom-properties)
- [Layout Tokens and Patterns](#layout-tokens-and-patterns)
- [Animation Classes and Keyframes](#animation-classes-and-keyframes)
- [Stagger Pattern](#stagger-pattern)

## Typography

- Body font: DM Sans
- Display and heading font: Fraunces
- Tone goal: calm, human, and supportive rather than clinical

## CSS Custom Properties

Defined in src/styles/globals.css.

| Token | Value | Purpose |
| --- | --- | --- |
| --sage | #7fa878 | Primary supportive green |
| --sage-l | #a8c9a2 | Light green accent |
| --sage-d | #4e7a49 | Dark green emphasis |
| --sage-m | #d4e8d0 | Soft active-state fill |
| --terra | #c4775a | Warm accent |
| --terra-l | #e8a889 | Light terra accent |
| --terra-m | #f5ddd4 | Soft terra surface |
| --cream | #f4efe6 | Main background |
| --cream-d | #ede5d3 | Darker gradient stop |
| --mist | #ebf0e8 | Neutral surface |
| --ink | #1b2118 | Main text |
| --ink-s | #3a4636 | Secondary text |
| --ink-m | rgba(27, 33, 24, 0.44) | Muted text |
| --gold | #c9a84c | Mentor ring |
| --blush | #d97b6a | Danger accent |
| --anon-bg | #0d0f0c | Anonymous mode background |
| --anon-accent | #3dff8f | Anonymous mode accent |
| --sidebar-w | 256px | Sidebar width token |
| --topbar-h | 62px | Topbar height token |
| --r | 20px | Large radius |
| --r-sm | 12px | Medium radius |
| --r-xs | 8px | Small radius |
| --sh | 0 2px 18px rgba(27, 33, 24, 0.08) | Base shadow |
| --sh-2 | 0 12px 44px rgba(27, 33, 24, 0.14) | Overlay shadow |
| --t | 0.18s cubic-bezier(0.4, 0, 0.2, 1) | Motion timing |

## Layout Tokens and Patterns

- Shell layout: sticky topbar + fixed sidebar + flowing main content
- Desktop offset: main content uses sidebar width token
- Responsive strategy: inline media-query overrides for critical two-column sections

## Animation Classes and Keyframes

- .anim-fade-up: fadeUp (opacity + translateY)
- .anim-pop-in: popIn (opacity + scale)
- .anim-fade-in: fadeIn (opacity)

Keyframes are defined in src/styles/globals.css.

## Stagger Pattern

Current stagger strategy is inline animationDelay:

- Feed cards: delay = index * 0.04s
- Community cards: delay = index * 0.06s

This produces gentle sequential reveal without adding timeline complexity.

---

Back to [Docs index](../README.md#documentation-index)
