import { http, HttpResponse } from 'msw'
import {
  AUTH_USER,
  MATCH_RESULTS,
  MENTOR_CATALOG,
  POSTS,
  FLAGS,
  ADMIN_USERS,
  COMMUNITIES,
} from './fixtures'

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

const auth = [
  http.post('/api/auth/signin', async ({ request }) => {
    const body = await request.json()
    if (!body.email || !body.password) {
      return HttpResponse.json({ message: 'Email and password are required.' }, { status: 400 })
    }
    // Reject anything that doesn't match fixture email (demo guard)
    if (body.email !== AUTH_USER.email) {
      return HttpResponse.json({ message: 'Invalid credentials.' }, { status: 401 })
    }
    return HttpResponse.json({
      token: 'mock-jwt-token.dev.mindbridge',
      user: AUTH_USER,
    })
  }),

  http.post('/api/auth/signup', async ({ request }) => {
    const body = await request.json()
    if (!body.email || !body.password || !body.name) {
      return HttpResponse.json({ message: 'All fields are required.' }, { status: 400 })
    }
    return HttpResponse.json(
      {
        token: 'mock-jwt-token.dev.mindbridge',
        user: { ...AUTH_USER, id: 'u-new-' + Date.now(), name: body.name, email: body.email },
      },
      { status: 201 },
    )
  }),

  http.post('/api/auth/signout', () => {
    return HttpResponse.json({ ok: true })
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json({ user: AUTH_USER })
  }),
]

// ---------------------------------------------------------------------------
// Feed
// ---------------------------------------------------------------------------

const feed = [
  http.get('/api/posts', () => {
    return HttpResponse.json({
      posts: POSTS,
      meta: { total: POSTS.length, page: 1, pageSize: 20 },
    })
  }),

  http.post('/api/posts', async ({ request }) => {
    const body = await request.json()
    const newPost = {
      id: 'p-' + Date.now(),
      authorId: AUTH_USER.id,
      authorName: body.anonymous ? 'Anonymous' : AUTH_USER.name,
      anonymous: Boolean(body.anonymous),
      category: body.category || 'general',
      content: body.content,
      likes: 0,
      likedByMe: false,
      comments: 0,
      createdAt: new Date().toISOString(),
    }
    // Mutate the live fixture array so GET /api/posts returns the new post
    POSTS.unshift(newPost)
    return HttpResponse.json({ post: newPost }, { status: 201 })
  }),

  http.post('/api/posts/:id/like', ({ params }) => {
    const post = POSTS.find((p) => p.id === params.id)
    if (!post) return HttpResponse.json({ message: 'Not found.' }, { status: 404 })
    post.likedByMe = !post.likedByMe
    post.likes += post.likedByMe ? 1 : -1
    return HttpResponse.json({ postId: params.id, likes: post.likes, likedByMe: post.likedByMe })
  }),
]

// ---------------------------------------------------------------------------
// Mentors
// ---------------------------------------------------------------------------

const mentors = [
  http.post('/api/mentors/match', () => {
    return HttpResponse.json({
      matches: MATCH_RESULTS,
      meta: { total: MATCH_RESULTS.length },
    })
  }),

  http.get('/api/mentors', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')?.toLowerCase() ?? ''
    const filtered = q
      ? MENTOR_CATALOG.filter(
          (m) => m.displayName.toLowerCase().includes(q) || m.expertise.topics.some((t) => t.includes(q)),
        )
      : MENTOR_CATALOG
    return HttpResponse.json({
      mentors: filtered,
      meta: { total: filtered.length, page: 1, pageSize: 20 },
    })
  }),
]

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

const admin = [
  http.get('/api/admin/flags', () => {
    return HttpResponse.json({ flags: FLAGS })
  }),

  http.delete('/api/admin/flags/:id', ({ params }) => {
    const idx = FLAGS.findIndex((f) => f.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: 'Not found.' }, { status: 404 })
    FLAGS.splice(idx, 1)
    return HttpResponse.json({ ok: true })
  }),

  http.get('/api/admin/users', () => {
    return HttpResponse.json({ users: ADMIN_USERS })
  }),

  http.patch('/api/admin/users/:id', async ({ params, request }) => {
    const patch = await request.json()
    const user = ADMIN_USERS.find((u) => u.id === params.id)
    if (!user) return HttpResponse.json({ message: 'Not found.' }, { status: 404 })
    Object.assign(user, patch)
    return HttpResponse.json({ user })
  }),
]

// ---------------------------------------------------------------------------
// Account
// ---------------------------------------------------------------------------

const account = [
  http.post('/api/account/export', () => {
    return HttpResponse.json({
      fileName: `mindbridge-export-${new Date().toISOString().slice(0, 10)}.json`,
      data: {
        exportedAt: new Date().toISOString(),
        user: AUTH_USER,
      },
    })
  }),

  http.post('/api/account/deactivate', () => {
    return HttpResponse.json({ ok: true })
  }),
]

// ---------------------------------------------------------------------------
// Export all handlers
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Communities
// ---------------------------------------------------------------------------

const communities = [
  http.get('/api/communities', () => {
    return HttpResponse.json({ communities: COMMUNITIES, meta: { total: COMMUNITIES.length } })
  }),

  http.post('/api/communities', async ({ request }) => {
    const body = await request.json()
    if (!body.name || !body.desc) {
      return HttpResponse.json({ message: 'Name and description are required.' }, { status: 400 })
    }
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const existing = COMMUNITIES.find((c) => c.slug === slug)
    if (existing) {
      return HttpResponse.json({ message: 'A community with that name already exists.' }, { status: 409 })
    }
    const newCommunity = {
      slug: slug + '-' + Date.now(),
      name: body.name.trim(),
      icon: body.icon || '🌱',
      accentHex: body.accentHex || '#0CA678',
      desc: body.desc.trim(),
      members: 1,
      online: 1,
      posts: [],
      createdByMe: true,
    }
    COMMUNITIES.push(newCommunity)
    return HttpResponse.json({ community: newCommunity }, { status: 201 })
  }),
]

export const handlers = [...auth, ...feed, ...mentors, ...admin, ...account, ...communities]
