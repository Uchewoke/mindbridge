import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const TOPICS = [
  '📱 Social Media',
  '🫁 Anxiety',
  '🍂 Alcohol',
  '🌧️ Depression',
  '🎮 Gaming',
  '🤝 Loneliness',
]

const randomAlias = () => {
  const aliases = [
    'Moon Fern',
    'Quiet River',
    'Cinder Pine',
    'Moss Harbor',
    'Fog Lantern',
    'Night Willow',
    'Echo Grove',
    'Silver Tide',
  ]
  return aliases[Math.floor(Math.random() * aliases.length)]
}

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
const resolveNext = (current, next) => (typeof next === 'function' ? next(current) : next)

export const useUserStore = create(
  persist(
    (set) => ({
      user: {
        id: 'u_me',
        name: 'Maya Reed',
        initials: 'MR',
        email: 'maya@mindbridge.app',
        role: 'seeker',
        bio: 'Building steady habits one day at a time.',
        avatar: 'linear-gradient(135deg,#7FA878,#C4775A)',
        streak: 12,
        points: 340,
        topics: [TOPICS[0], TOPICS[1]],
        style: ['Reflective', 'Gentle accountability'],
        stage: 'mid-recovery',
        joinedCommunities: ['social-media', 'anxiety'],
        onboarded: true,
      },
      setUser: (partial) => set((state) => ({ user: { ...state.user, ...partial } })),
      incrementStreak: () =>
        set((state) => ({ user: { ...state.user, streak: state.user.streak + 1 } })),
    }),
    { name: 'mindbridge-user' },
  ),
)

export const useAnonStore = create((set) => ({
  active: false,
  alias: randomAlias(),
  emoji: '👻',
  autoExpire: true,
  noReadReceipts: true,
  hideReplyCount: false,
  randomAliasEachSession: false,
  toggle: () => set((s) => ({ active: !s.active })),
  enable: () => set({ active: true }),
  disable: () => set({ active: false }),
  updateSettings: (payload) => set(payload),
  randomizeAlias: () => set({ alias: randomAlias() }),
}))

export const useNotifStore = create((set) => ({
  notifications: [
    {
      id: 'n1',
      unread: true,
      type: 'match',
      initials: 'AL',
      avatar: 'linear-gradient(135deg,#8ec5fc,#e0c3fc)',
      text: '<strong>Ari</strong> is a new 93% mentor match.',
      time: '2m ago',
      action: '/discover',
    },
    {
      id: 'n2',
      unread: true,
      type: 'session',
      initials: 'CS',
      avatar: 'linear-gradient(135deg,#f6d365,#fda085)',
      text: 'Live room <strong>Breathing Through Urges</strong> starts in 10m.',
      time: '10m ago',
      action: '/sessions',
    },
    {
      id: 'n3',
      unread: false,
      type: 'milestone',
      initials: 'MB',
      avatar: 'linear-gradient(135deg,#a8edea,#fed6e3)',
      text: 'You just hit a <strong>12-day streak</strong>. Keep going.',
      time: '1h ago',
      action: '/journey',
    },
  ],
  get unreadCount() {
    return this.notifications.filter((n) => n.unread).length
  },
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    })),
  markAllRead: () =>
    set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, unread: false })) })),
  addNotif: (notif) =>
    set((state) => ({
      notifications: [
        { id: crypto.randomUUID(), unread: true, time: 'now', ...notif },
        ...state.notifications,
      ],
    })),
}))

export const useUIStore = create((set) => ({
  sidebarOpen: false,
  toasts: [],
  modal: null,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
  toast: (msg, type = 'default', duration = 2800) => {
    const id = crypto.randomUUID()
    set((state) => ({ toasts: [...state.toasts, { id, msg, type }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, duration)
  },
}))

export const useFeedStore = create((set) => ({
  posts: [
    {
      id: 'p1',
      authorId: 'u2',
      initials: 'AL',
      name: 'Ari L.',
      avatar: 'linear-gradient(135deg,#89f7fe,#66a6ff)',
      role: 'mentor',
      time: '15m ago',
      tags: [
        ['so', 'Social Media'],
        ['mn', 'Mentor'],
      ],
      body: 'Today I replaced doom scrolling with a 5-minute walk. Tiny swaps count more than giant promises.',
      tip: 'Try setting your first app limit to 20 minutes. Make success easy.',
      likes: 28,
      liked: false,
      replies: [{ id: 'r1', name: 'Maya', text: 'I tried this and it helped. Thank you.' }],
    },
    {
      id: 'p2',
      authorId: 'u_me',
      initials: 'MR',
      name: 'Maya Reed',
      avatar: 'linear-gradient(135deg,#7FA878,#C4775A)',
      role: 'seeker',
      time: '1h ago',
      tags: [['ax', 'Anxiety']],
      body: 'Hard morning. Shared it here instead of bottling it. That feels like progress.',
      tip: '',
      likes: 11,
      liked: true,
      replies: [],
    },
  ],
  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p,
      ),
    })),
  addReply: (postId, reply) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? { ...p, replies: [...p.replies, { id: crypto.randomUUID(), ...reply }] }
          : p,
      ),
    })),
  addPost: (post) =>
    set((state) => ({
      posts: [
        { id: crypto.randomUUID(), time: now(), likes: 0, liked: false, replies: [], ...post },
        ...state.posts,
      ],
    })),
}))

export const useJourneyStore = create(
  persist(
    (set) => ({
      goals: [
        { id: 'g1', text: 'No social apps before breakfast', done: true, streak: 5 },
        { id: 'g2', text: '10-minute evening reset', done: false, streak: 2 },
      ],
      moodLogs: [
        { date: '2026-04-09', score: 3, note: 'Wobbly but steady.' },
        { date: '2026-04-10', score: 4, note: 'Good support call.' },
        { date: '2026-04-11', score: 4, note: 'More calm than yesterday.' },
      ],
      todayMood: 4,
      toggleGoal: (id) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g)),
        })),
      addGoal: (text) =>
        set((state) => ({
          goals: [...state.goals, { id: crypto.randomUUID(), text, done: false, streak: 0 }],
        })),
      logMood: (score, note = '') =>
        set((state) => ({
          todayMood: score,
          moodLogs: [
            ...state.moodLogs,
            { date: new Date().toISOString().slice(0, 10), score, note },
          ],
        })),
    }),
    { name: 'mindbridge-journey' },
  ),
)

export const useSettingsStore = create(
  persist(
    (set) => ({
      notifPrefs: {
        emailDigest: true,
        push: true,
        sessionReminders: true,
      },
      privacyPrefs: {
        searchable: true,
        dataSharing: false,
        weeklyExport: false,
      },
      mentorPrefs: {
        availableForMentoring: false,
        dmRequests: true,
        officeHours: 'weeknights',
      },
      a11yPrefs: {
        reducedMotion: false,
        largerText: false,
        higherContrast: false,
      },
      setNotifPrefs: (next) =>
        set((state) => ({ notifPrefs: resolveNext(state.notifPrefs, next) })),
      setPrivacyPrefs: (next) =>
        set((state) => ({ privacyPrefs: resolveNext(state.privacyPrefs, next) })),
      setMentorPrefs: (next) =>
        set((state) => ({ mentorPrefs: resolveNext(state.mentorPrefs, next) })),
      setA11yPrefs: (next) => set((state) => ({ a11yPrefs: resolveNext(state.a11yPrefs, next) })),
    }),
    { name: 'mindbridge-settings' },
  ),
)

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      sessionToken: null,
      /** Call with the JWT string returned by the API */
      signIn: (token = crypto.randomUUID()) => set({ isAuthenticated: true, sessionToken: token }),
      signOut: () => set({ isAuthenticated: false, sessionToken: null }),
    }),
    { name: 'mindbridge-auth' },
  ),
)

const AUTO_REPLIES = {
  t1: 'Proud of you for checking in. Want to set one tiny goal for tonight?',
  t2: 'You are not behind. You are practicing. Keep going.',
}

export const useMessagesStore = create((set) => ({
  threads: [
    { id: 't1', name: 'Ari L.', initials: 'AL', last: 'Try the 20-minute timer tonight.' },
    { id: 't2', name: 'Coach Sam', initials: 'CS', last: 'How did your morning routine feel?' },
  ],
  chats: {
    t1: [{ id: 'm1', mine: false, text: 'How is today going for you?', time: '09:10' }],
    t2: [{ id: 'm2', mine: false, text: 'Remember: tiny changes > perfect plans.', time: '08:42' }],
  },
  activeThread: 't1',
  setActiveThread: (id) => set({ activeThread: id }),
  sendMessage: (threadId, text) => {
    const outbound = { id: crypto.randomUUID(), mine: true, type: 'text', text, time: now() }
    set((state) => ({
      chats: { ...state.chats, [threadId]: [...(state.chats[threadId] || []), outbound] },
    }))
    setTimeout(() => {
      const inbound = {
        id: crypto.randomUUID(),
        mine: false,
        type: 'text',
        text: AUTO_REPLIES[threadId] || 'I hear you. Keep sharing.',
        time: now(),
      }
      set((state) => ({
        chats: { ...state.chats, [threadId]: [...(state.chats[threadId] || []), inbound] },
      }))
    }, 1600)
  },
  sendVoiceMessage: (threadId, blobUrl, durationSec) => {
    const outbound = {
      id: crypto.randomUUID(),
      mine: true,
      type: 'voice',
      blobUrl,
      duration: durationSec,
      time: now(),
    }
    set((state) => ({
      chats: { ...state.chats, [threadId]: [...(state.chats[threadId] || []), outbound] },
    }))
    setTimeout(() => {
      const inbound = {
        id: crypto.randomUUID(),
        mine: false,
        type: 'text',
        text: '🎙 Got your voice message — thanks for sharing!',
        time: now(),
      }
      set((state) => ({
        chats: { ...state.chats, [threadId]: [...(state.chats[threadId] || []), inbound] },
      }))
    }, 1600)
  },
}))
