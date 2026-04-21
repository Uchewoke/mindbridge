PostgreSQL schema for MindBridge

Contents
- `schema.sql` — canonical CREATE TABLE statements for core domain models:
  - users, profiles
  - communities, community_members
  - posts, post_reactions
  - mentors
  - sessions, session_participants
  - threads, thread_participants, messages
  - notifications, contracts, admin_flags

Notes & next steps
- `schema.sql` uses `pgcrypto` for `gen_random_uuid()`; enable the extension in your database.
- Add migrations (Flyway/Knex/Hasura/TypeORM) and seed data for initial communities and demo users.
- Consider full-text search (`tsvector`) and additional indexes on `posts.content` for feed queries.
- Add constraints, rate-limits, and archival strategies for large tables (messages, posts).

If you want, I can generate migration files for a specific migration tool (Knex, Sequelize, Flyway).
