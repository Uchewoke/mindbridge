# Routing

## Contents

- [Route Table](#route-table)

Route declarations live in src/App.jsx.

## Route Table

| Path | Component | Notes |
| --- | --- | --- |
| / | Navigate | Redirects to /feed |
| /feed | FeedPage | Main social recovery feed |
| /communities | CommunitiesPage | Community index |
| /communities/:slug | CommunityPage | Community detail by slug |
| /discover | DiscoverPage | Mentor ranking and request actions |
| /sessions | SessionsPage | Session lobby |
| /sessions/:id | SessionsPage | Opens room flow for selected session |
| /journey | JourneyPage | Mood trend and goals |
| /analytics | JourneyPage | Alias route to journey surface |
| /messages | MessagesPage | Thread list and chat panel |
| /notifications | NotificationsPage | Full notifications list |
| /auth | AuthPage | Guest-only route; redirects authenticated users to /feed |
| /login | AuthPage | Guest-only route; redirects authenticated users to /feed |
| /signup | AuthPage | Guest-only route; redirects authenticated users to /feed |
| /anonymous | AnonPage | Anonymous mode controls |
| /settings | SettingsPage | Multi-panel settings UI |
| /admin | AdminPage | Moderation and operations prototype |
| /crisis | CrisisPage | Crisis support resources |
| * | Navigate | Catch-all redirect to /feed |

Protected routes:

- All non-auth feature routes except `/crisis` require authentication.
- Unauthenticated access to protected routes redirects to `/login`.

---

Back to [Docs index](../README.md#documentation-index)
