# Project Structure

## Contents

- [Annotated Tree](#annotated-tree)

## Annotated Tree

```text
.
|- .env.example                   # Example environment variables for future API/auth integration
|- .gitignore                     # Ignore patterns for logs, build output, and editor artifacts
|- eslint.config.js               # Flat ESLint configuration
|- index.html                     # HTML entry template mounting #root and loading src/main.jsx
|- package-lock.json              # Dependency lockfile
|- package.json                   # Scripts and dependency manifest
|- README.md                      # Root documentation landing page
|- vercel.json                    # SPA rewrite rules for Vercel deployments
|- vite.config.js                 # Vite config, alias setup, and dev proxy
|- public/
|  |- favicon.svg                 # Browser tab icon
|  |- icons.svg                   # Static SVG icon sprite asset
|- src/
|  |- App.css                     # Legacy Vite template stylesheet, not imported
|  |- App.jsx                     # Application root, providers, and route declarations
|  |- index.css                   # Legacy Vite template stylesheet, not imported
|  |- main.jsx                    # React entry point and global style import
|  |- assets/
|  |  |- hero.png                 # Static image asset, currently unused
|  |  |- react.svg                # Legacy template asset, currently unused
|  |  |- vite.svg                 # Legacy template asset, currently unused
|  |- components/
|  |  |- feed/
|  |  |  |- PostCard.jsx          # Feed post card with actions and reply composer
|  |  |- layout/
|  |  |  |- AppShell.jsx          # Global topbar, sidebar, and shell composition
|  |  |  |- SearchBar.jsx         # Header search with local index and route navigation
|  |  |- notifications/
|  |  |  |- NotifDropdown.jsx     # Bell dropdown with unread badges and routing
|  |  |- ui/
|  |  |  |- index.jsx             # Shared UI primitives
|  |  |  |- Toast.jsx             # Global toast stack renderer
|  |- pages/
|  |  |- Communities.jsx          # Communities list and community detail screens
|  |  |- Discover.jsx             # Mentor discovery and weighted matching
|  |  |- index.jsx                # Feed, anon, messages, notifications, settings, admin, crisis pages
|  |  |- Journey.jsx              # Mood chart and goal management screen
|  |  |- Sessions.jsx             # Session lobby and room interaction screen
|  |- stores/
|  |  |- index.js                 # Zustand stores and mock data
|  |- styles/
|     |- globals.css              # Active design tokens, typography, and animation rules
|- docs/
   |- overview.md                 # Product goals, philosophy, and walkthrough
   |- tech-stack.md               # Dependencies and command reference
   |- project-structure.md        # Annotated repository tree
   |- routing.md                  # Route table and component mapping
   |- state-management.md         # Full Zustand schemas and actions
   |- components.md               # Component reference and tag color map
   |- design-system.md            # Tokens, typography, layout, and motion
   |- domain-models.md            # Communities and mentors schemas and algorithms
   |- roadmap-and-env.md          # Backend/auth roadmap and env guidance
```

---

Back to [Docs index](../README.md#documentation-index)
