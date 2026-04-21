# Roadmap and Environment

## Contents

- [Environment Variables](#environment-variables)
- [Roadmap](#roadmap)

## Environment Variables

Current app status:

- Core prototype flows do not require runtime env values.
- .env.example already contains placeholders for API and auth integration.

Current example keys:

- VITE_API_URL
- VITE_SOCKET_URL
- VITE_CLERK_PUBLISHABLE_KEY
- VITE_APP_NAME

Guidance for API-layer adoption:

- Keep all client-exposed values prefixed with VITE_.
- Use separate env files per environment.
- Never commit production secrets.

## Roadmap

### Backend Integration

- Replace local seed data with API-backed query and mutation layers
- Introduce typed API client boundaries and error semantics
- Persist profile, feed, messaging, moderation, and journey entities
- Add robust loading, empty, error, and retry UX states

### Authentication and Authorization

- Add sign-up, sign-in, sign-out, and reset flows
- Add route protection for authenticated surfaces
- Introduce role-aware policies for mentor and admin views
- Move anonymous mode from UI toggle to policy-backed privacy behavior

### Front-End Follow-Ups

- Introduce route-level code splitting for better bundle performance
- Add tests for stores, routes, and critical support flows
- Add observability and analytics hooks as backend endpoints land

---

Back to [Docs index](../README.md#documentation-index)
