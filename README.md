# MindBridge

MindBridge is a React front-end prototype for recovery support. This README is a concise entry point; full documentation lives in docs/.

## Quick Start

```bash
npm install
npm run dev
```

Other commands:

- npm run build
- npm run preview
- npm run lint

## Documentation Index

- [Product Overview](docs/overview.md)
- [Tech Stack and Commands](docs/tech-stack.md)
- [Project Structure](docs/project-structure.md)
- [Routing](docs/routing.md)
- [State Management](docs/state-management.md)
- [Component Reference](docs/components.md)
- [Design System](docs/design-system.md)
- [Domain Models: Communities and Mentors](docs/domain-models.md)
- [Roadmap and Environment Variables](docs/roadmap-and-env.md)

## Requirements Coverage

| Requested Area | Implemented In |
| --- | --- |
| Project overview, philosophy, design rationale | [docs/overview.md](docs/overview.md) |
| Tech stack (dependency versions, roles, wiring status) | [docs/tech-stack.md](docs/tech-stack.md) |
| Commands (dev/build/preview/lint) | [docs/tech-stack.md](docs/tech-stack.md) |
| Full annotated project structure | [docs/project-structure.md](docs/project-structure.md) |
| Complete routing table | [docs/routing.md](docs/routing.md) |
| Zustand stores: schemas/actions/persistence/examples | [docs/state-management.md](docs/state-management.md) |
| Component reference with props/examples/behavior notes | [docs/components.md](docs/components.md) |
| Tag type to color mapping table | [docs/components.md](docs/components.md) |
| Design system tokens/typography/layout/animation/stagger | [docs/design-system.md](docs/design-system.md) |
| Communities schema/slug table/add flow | [docs/domain-models.md](docs/domain-models.md) |
| Mentors schema and matching algorithm | [docs/domain-models.md](docs/domain-models.md) |
| Backend/auth roadmap and env-variable guidance | [docs/roadmap-and-env.md](docs/roadmap-and-env.md) |

## Deployment

Vercel SPA rewrites are configured in vercel.json.

Typical build flow:

```bash
npm install
npm run build
```
