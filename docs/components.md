# Component Reference

## Contents

- [Layout and Feature Components](#layout-and-feature-components)
- [UI Primitives](#ui-primitives)
- [Route/Page Components](#routepage-components)
- [Tag Type to Color Mapping](#tag-type-to-color-mapping)

## Layout and Feature Components

| Component | Props | Behavior notes | Usage |
| --- | --- | --- | --- |
| AppShell | children | Global shell with topbar, sidebar nav, profile context, anon mode palette switch | <AppShell>{children}</AppShell> |
| SearchBar | isAnon:boolean | Local in-memory search; opens dropdown on input/focus | <SearchBar isAnon={false} /> |
| NotifDropdown | isAnon:boolean | Bell trigger, unread badge, click-away close, route navigation on item click | <NotifDropdown isAnon={active} /> |
| PostCard | post, onLike, onReply, delay?:number | Feed card with tags, likes, replies, and inline composer | <PostCard post={p} onLike={toggleLike} onReply={addReply} /> |
| ToastContainer | none | Fixed toast stack renderer based on useUIStore | <ToastContainer /> |

## UI Primitives

| Component | Props | Behavior notes | Usage |
| --- | --- | --- | --- |
| Button | variant='dark', size='md', style, ...props | Pill button with variant and size maps | <Button variant="outline" size="sm">Save</Button> |
| Avatar | initials='MB', background, size=38, goldRing=false, online=false, emoji | Circle avatar with optional ring and online indicator | <Avatar initials="AL" online /> |
| Tag | type='sk', children | Uses tagStyles map for topic/status coloring | <Tag type="mn">Mentor</Tag> |
| Card | children, style | Elevated section container | <Card>{children}</Card> |
| CardTitle | children, action | Header row with optional right action node | <CardTitle action={<Button>All</Button>}>Title</CardTitle> |
| Toggle | checked, onChange, id | Accessible switch implemented over checkbox | <Toggle id="t1" checked={on} onChange={toggle} /> |
| ToggleRow | label, sub, checked, onChange, id | Labeled setting row + Toggle | <ToggleRow label="Anon" checked={on} onChange={toggle} id="anon" /> |
| PageHeader | title, sub, action | Page title and subtitle region; title supports inline HTML | <PageHeader title="Feed <em>Now</em>" sub="Check in" /> |
| EmptyState | icon='🌿', title, sub, action | Centered empty state card | <EmptyState title="No items" sub="Try again" /> |
| Spinner | size=20, color='var(--sage)' | Circular spinner visual | <Spinner size={16} /> |
| Divider | style | Thin horizontal separator | <Divider /> |
| NavLinkPill | to, active, label | Sidebar navigation link with active emphasis | <NavLinkPill to="/feed" active label="Feed" /> |

## Route/Page Components

| Component | Notes |
| --- | --- |
| FeedPage | Post creation and timeline rendering |
| CommunitiesPage | Community card listing |
| CommunityPage | Community detail by slug, empty-state fallback |
| DiscoverPage | Weighted mentor ranking |
| SessionsPage | Session list and room flow |
| JourneyPage | Mood area chart and goals |
| MessagesPage | Thread picker and chat panel |
| NotificationsPage | Full list with mark-all |
| AuthPage | Sign-in and create-account panels with client-side validation |
| AnonPage | Privacy settings toggles |
| SettingsPage | Settings panel scaffold |
| AdminPage | Overview, flags, users tabs |
| CrisisPage | Emergency support references |

## Tag Type to Color Mapping

| Tag type | Background | Foreground | Typical meaning |
| --- | --- | --- | --- |
| so | #dbe4ff | #2b50c7 | Social media topic |
| ax | #ffe3f0 | #a41361 | Anxiety topic |
| al | #ffedd5 | #b45309 | Alcohol topic |
| rc | #dcfce7 | #166534 | Recovery/check-in |
| dp | #ede9fe | #5b21b6 | Depression topic |
| gm | #d1fae5 | #047857 | Gaming topic |
| et | #ffedd5 | #c2410c | Eating-topic marker |
| mn | linear-gradient(135deg,#e8d8a5,#c9a84c) | #6b4f00 | Mentor badge |
| sk | #ececec | #4b5563 | Generic metadata |
| lo | #ede9fe | #6d28d9 | Loneliness topic |

---

Back to [Docs index](../README.md#documentation-index)
