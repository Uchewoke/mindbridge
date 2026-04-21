-- Initial migration for Prisma (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- users
CREATE TABLE "users" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  password_hash text,
  is_active boolean DEFAULT true,
  is_admin boolean DEFAULT false,
  is_anonymous boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  last_seen_at timestamptz
);

CREATE TABLE "profiles" (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name text,
  initials text,
  avatar text,
  bio text,
  role text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE "communities" (
  slug text PRIMARY KEY,
  name text NOT NULL,
  icon text,
  accent_hex text,
  description text,
  members_count integer DEFAULT 0,
  online_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE "community_members" (
  community_slug text REFERENCES communities(slug) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (community_slug, user_id)
);

CREATE TABLE "posts" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  community_slug text REFERENCES communities(slug),
  parent_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  content text,
  metadata jsonb,
  is_anonymous boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  edited_at timestamptz,
  like_count integer DEFAULT 0,
  reply_count integer DEFAULT 0
);

CREATE INDEX posts_created_idx ON posts (created_at DESC);
CREATE INDEX posts_author_idx ON posts (author_id);

CREATE TABLE "post_reactions" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  reaction_type text DEFAULT 'like',
  created_at timestamptz DEFAULT now(),
  UNIQUE (post_id, user_id, reaction_type)
);

CREATE TABLE "mentors" (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  yrs integer,
  helped integer,
  rating numeric(3,2),
  online boolean DEFAULT false,
  topics text[],
  style text[],
  stage text,
  avail integer DEFAULT 0,
  exp integer DEFAULT 0,
  activity integer DEFAULT 0,
  quote text,
  tags jsonb
);

CREATE INDEX mentors_topics_idx ON mentors USING GIN (topics);

CREATE TABLE "sessions" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  host_id uuid REFERENCES users(id) ON DELETE SET NULL,
  community_slug text REFERENCES communities(slug),
  starts_at timestamptz,
  ends_at timestamptz,
  capacity integer,
  status text DEFAULT 'scheduled',
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE "session_participants" (
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  role text DEFAULT 'participant',
  joined_at timestamptz DEFAULT now(),
  left_at timestamptz,
  PRIMARY KEY (session_id, user_id)
);

CREATE TABLE "threads" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_private boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE "thread_participants" (
  thread_id uuid REFERENCES threads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  last_read_at timestamptz,
  PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE "messages" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES threads(id) ON DELETE CASCADE,
  author_id uuid REFERENCES users(id) ON DELETE SET NULL,
  content text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  edited_at timestamptz
);

CREATE TABLE "notifications" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text,
  payload jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE "contracts" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES users(id) ON DELETE SET NULL,
  mentor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  contract_type text,
  terms jsonb,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

CREATE TABLE "admin_flags" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL,
  target_id text NOT NULL,
  flag_type text,
  reason text,
  created_by uuid REFERENCES users(id),
  is_resolved boolean DEFAULT false,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_community_created ON posts (community_slug, created_at DESC);
