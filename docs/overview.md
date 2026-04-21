# MindBridge Overview

## Contents

- [What MindBridge Is](#what-mindbridge-is)
- [Core Philosophy](#core-philosophy)
- [Why Design Decisions Were Made This Way](#why-design-decisions-were-made-this-way)
- [Product Walkthrough](#product-walkthrough)
- [Screenshots](#screenshots)

## What MindBridge Is

MindBridge is a React single-page prototype for recovery support workflows. It combines social accountability, mentor discovery, live support sessions, private messaging, anonymous participation, and safety tools in one front-end experience.

## Core Philosophy

- Safety first: crisis resources and moderation flows are explicit, visible, and easy to access.
- Progress over perfection: product language reinforces small repeatable wins.
- Low-shame participation: anonymous mode is treated as a primary interaction path.
- Human warmth: typography, palette, and spacing are optimized for emotional safety.

## Why Design Decisions Were Made This Way

- Local-first state architecture enables fast product iteration before backend contracts solidify.
- Route-first information architecture makes major support workflows discoverable and composable.
- Zustand provides low-boilerplate state slices for high-velocity prototyping.
- TanStack Query provider is pre-wired to introduce API-backed server state without shell rewrites.
- The visual system uses calm neutrals plus supportive accents instead of high-contrast alert styling.

## Product Walkthrough

1. Start at /feed to post, react, and reply.
2. Visit /communities and /communities/:slug for topic-specific support spaces.
3. Open /discover to tune mentor ranking weights.
4. Enter /sessions to join a guided room flow.
5. Use /journey to log mood and track goals.
6. Open /messages for one-to-one support threads.
7. Toggle /anonymous to apply privacy controls.
8. Review /notifications, /settings, /admin, and /crisis.

## Screenshots

Screenshots are not committed yet.

Recommended set:

- Feed overview
- Communities grid
- Mentor matching controls
- Session room
- Journey chart + goals
- Anonymous mode state
- Admin flags view

Recommended location: docs/screenshots/

---

Back to [Docs index](../README.md#documentation-index)
