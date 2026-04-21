# State Management

## Contents

- [Persistence Summary](#persistence-summary)
- [useUserStore](#useuserstore)
- [useAnonStore](#useanonstore)
- [useNotifStore](#usenotifstore)
- [useUIStore](#useuistore)
- [useFeedStore](#usefeedstore)
- [useJourneyStore](#usejourneystore)
- [useSettingsStore](#usesettingsstore)
- [useAuthStore](#useauthstore)
- [useMessagesStore](#usemessagesstore)

MindBridge currently defines 9 Zustand stores.

## Persistence Summary

| Store | Persisted | Storage key |
| --- | --- | --- |
| useUserStore | Yes | mindbridge-user |
| useJourneyStore | Yes | mindbridge-journey |
| useSettingsStore | Yes | mindbridge-settings |
| useAuthStore | Yes | mindbridge-auth |
| useAnonStore | No | N/A |
| useNotifStore | No | N/A |
| useUIStore | No | N/A |
| useFeedStore | No | N/A |
| useMessagesStore | No | N/A |

## useUserStore

Schema:

- user.id: string
- user.name: string
- user.initials: string
- user.email: string
- user.role: string
- user.bio: string
- user.avatar: string (CSS gradient)
- user.streak: number
- user.points: number
- user.topics: string[]
- user.style: string[]
- user.stage: string
- user.joinedCommunities: string[]
- user.onboarded: boolean

Actions:

- setUser(partial): shallow merge onto user
- incrementStreak(): increment user.streak by 1

Usage:

```jsx
const setUser = useUserStore((s) => s.setUser)
setUser({ bio: 'Small wins this week.' })
```

## useAnonStore

Schema:

- active: boolean
- alias: string
- emoji: string
- autoExpire: boolean
- noReadReceipts: boolean
- hideReplyCount: boolean
- randomAliasEachSession: boolean

Actions:

- toggle()
- enable()
- disable()
- updateSettings(payload)
- randomizeAlias()

Usage:

```jsx
const anon = useAnonStore((s) => s)
anon.updateSettings({ noReadReceipts: true })
```

## useNotifStore

Schema:

- notifications: Notification[]
- unreadCount: getter computed from notifications

Notification fields:

- id: string
- unread: boolean
- type: string
- initials: string
- avatar: string
- text: string (HTML)
- time: string
- action: string (route)

Actions:

- markRead(id)
- markAllRead()
- addNotif(notif)

Usage:

```jsx
const markAllRead = useNotifStore((s) => s.markAllRead)
markAllRead()
```

## useUIStore

Schema:

- sidebarOpen: boolean
- toasts: Array<{ id: string, msg: string, type: string }>
- modal: any

Actions:

- toggleSidebar()
- closeSidebar()
- openModal(modal)
- closeModal()
- toast(msg, type = 'default', duration = 2800)

Usage:

```jsx
const toast = useUIStore((s) => s.toast)
toast('Saved', 'success')
```

## useFeedStore

Schema:

- posts: Post[]

Post fields:

- id: string
- authorId: string
- initials: string
- name: string
- avatar: string
- role: string
- time: string
- tags: Array<[string, string]>
- body: string
- tip: string
- likes: number
- liked: boolean
- replies: Array<{ id: string, name: string, text: string }>

Actions:

- toggleLike(postId)
- addReply(postId, reply)
- addPost(post)

Usage:

```jsx
const addReply = useFeedStore((s) => s.addReply)
addReply('p1', { name: 'You', text: 'Thanks for sharing.' })
```

## useJourneyStore

Schema:

- goals: Array<{ id: string, text: string, done: boolean, streak: number }>
- moodLogs: Array<{ date: string, score: number, note: string }>
- todayMood: number

Actions:

- toggleGoal(id)
- addGoal(text)
- logMood(score, note = '')

Usage:

```jsx
const logMood = useJourneyStore((s) => s.logMood)
logMood(4, 'Calmer after session')
```

## useSettingsStore

Schema:

- notifPrefs: { emailDigest: boolean, push: boolean, sessionReminders: boolean }
- privacyPrefs: { searchable: boolean, dataSharing: boolean, weeklyExport: boolean }
- mentorPrefs: { availableForMentoring: boolean, dmRequests: boolean, officeHours: string }
- a11yPrefs: { reducedMotion: boolean, largerText: boolean, higherContrast: boolean }

Actions:

- setNotifPrefs(next)
- setPrivacyPrefs(next)
- setMentorPrefs(next)
- setA11yPrefs(next)

Setter behavior notes:

- Each setter accepts either a direct object value or an updater function.
- Store is persisted and survives refreshes and browser restarts.

Usage:

```jsx
const notifPrefs = useSettingsStore((s) => s.notifPrefs)
const setNotifPrefs = useSettingsStore((s) => s.setNotifPrefs)
setNotifPrefs((prev) => ({ ...prev, push: !prev.push }))
```

## useAuthStore

Schema:

- isAuthenticated: boolean
- sessionToken: string | null

Actions:

- signIn(token?)
- signOut()

Behavior notes:

- Store is persisted under `mindbridge-auth`.
- Protected routes redirect unauthenticated users to `/login`.
- Auth routes (`/auth`, `/login`, `/signup`) redirect authenticated users to `/feed`.

Usage:

```jsx
const signIn = useAuthStore((s) => s.signIn)
const signOut = useAuthStore((s) => s.signOut)
signIn()
```

## useMessagesStore

Schema:

- threads: Array<{ id: string, name: string, initials: string, last: string }>
- chats: Record<string, Array<{ id: string, mine: boolean, text: string, time: string }>>
- activeThread: string

Actions:

- setActiveThread(id)
- sendMessage(threadId, text)

Behavior notes for sendMessage:

- Adds outbound message immediately
- Adds simulated inbound auto-reply after 1600 ms

Usage:

```jsx
const sendMessage = useMessagesStore((s) => s.sendMessage)
sendMessage('t1', 'Checking in tonight.')
```

---

Back to [Docs index](../README.md#documentation-index)
