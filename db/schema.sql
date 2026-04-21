-- PostgreSQL schema for MindBridge application
-- Uses `pgcrypto` for UUID generation (gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users and profiles
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  password_hash TEXT,
  is_active BOOLEAN DEFAULT true,
  is_admin BOOLEAN DEFAULT false,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_seen_at TIMESTAMPTZ
);

CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT,
  initials TEXT,
  avatar TEXT,
  bio TEXT,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Communities
CREATE TABLE communities (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  accent_hex TEXT,
  description TEXT,
  members_count INTEGER DEFAULT 0,
  online_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE community_members (
  community_slug TEXT REFERENCES communities(slug) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (community_slug, user_id)
);

-- Posts / Feed
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  community_slug TEXT REFERENCES communities(slug),
  parent_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT,
  metadata JSONB,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  edited_at TIMESTAMPTZ,
  like_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0
);

CREATE INDEX posts_created_idx ON posts (created_at DESC);
CREATE INDEX posts_author_idx ON posts (author_id);

CREATE TABLE post_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reaction_type TEXT DEFAULT 'like',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (post_id, user_id, reaction_type)
);

-- Mentors (linked to users/profiles)
CREATE TABLE mentors (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  yrs INTEGER,
  helped INTEGER,
  rating NUMERIC(3,2),
  online BOOLEAN DEFAULT false,
  topics TEXT[] DEFAULT '{}',
  style TEXT[] DEFAULT '{}',
  stage TEXT,
  avail INTEGER DEFAULT 0,
  exp INTEGER DEFAULT 0,
  activity INTEGER DEFAULT 0,
  quote TEXT,
  tags JSONB
);

CREATE INDEX mentors_topics_idx ON mentors USING GIN (topics);

-- Live sessions & room flow
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  host_id UUID REFERENCES users(id) ON DELETE SET NULL,
  community_slug TEXT REFERENCES communities(slug),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  capacity INTEGER,
  status TEXT DEFAULT 'scheduled',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE session_participants (
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'participant',
  joined_at TIMESTAMPTZ DEFAULT now(),
  left_at TIMESTAMPTZ,
  PRIMARY KEY (session_id, user_id)
);

-- Messaging (threads + messages)
CREATE TABLE threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE thread_participants (
  thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ,
  PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  content TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  edited_at TIMESTAMPTZ
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT,
  payload JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contracts (mentor agreements / paid sessions)
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES users(id) ON DELETE SET NULL,
  mentor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  contract_type TEXT,
  terms JSONB,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- Admin flags / moderation
CREATE TABLE admin_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  flag_type TEXT,
  reason TEXT,
  created_by UUID REFERENCES users(id),
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Basic indexes for common lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_community_created ON posts (community_slug, created_at DESC);
