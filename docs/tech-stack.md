# Tech Stack

## Contents

- [Runtime Dependencies](#runtime-dependencies)
- [Development Dependencies](#development-dependencies)
- [Commands](#commands)

## Runtime Dependencies

| Package | Version | Role | Status |
| --- | --- | --- | --- |
| react | ^19.2.4 | UI runtime and component model | Wired |
| react-dom | ^19.2.4 | DOM renderer | Wired |
| react-router-dom | ^7.14.0 | SPA routing and navigation | Wired |
| zustand | ^5.0.12 | Client state stores | Wired |
| @tanstack/react-query | ^5.99.0 | Server-state caching layer scaffold | Wired (provider installed, queries not implemented yet) |
| recharts | ^3.8.1 | Journey mood visualization | Wired |
| date-fns | ^4.1.0 | Date formatting for chart labels | Wired |
| axios | ^1.15.0 | Planned HTTP client for API integration | Ready-to-connect |
| socket.io-client | ^4.8.3 | Planned realtime transport for messages and sessions | Ready-to-connect |
| framer-motion | ^12.38.0 | Planned animation orchestration | Ready-to-connect |

## Development Dependencies

| Package | Version | Role | Status |
| --- | --- | --- | --- |
| vite | ^8.0.4 | Dev server and bundler | Wired |
| @vitejs/plugin-react | ^6.0.1 | React transform plugin | Wired |
| eslint | ^9.39.4 | Lint engine | Wired |
| @eslint/js | ^9.39.4 | Base JavaScript ruleset | Wired |
| eslint-plugin-react-hooks | ^7.0.1 | Hooks safety rules | Wired |
| eslint-plugin-react-refresh | ^0.5.2 | Fast refresh lint rules | Wired |
| globals | ^17.4.0 | Browser globals mapping | Wired |
| @types/react | ^19.2.14 | Optional TS editor support for React | Ready-to-connect |
| @types/react-dom | ^19.2.3 | Optional TS editor support for React DOM | Ready-to-connect |

## Commands

| Command | Description |
| --- | --- |
| npm run dev | Starts Vite development server |
| npm run build | Creates production build output in dist/ |
| npm run preview | Serves built output locally |
| npm run lint | Runs ESLint across project files |

---

Back to [Docs index](../README.md#documentation-index)
