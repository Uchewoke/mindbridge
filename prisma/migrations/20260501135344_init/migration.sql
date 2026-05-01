/*
  Warnings:

  - The primary key for the `mentors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `mentors` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `mentors` table. The data in that column could be lost. The data in that column will be cast from `Decimal(3,2)` to `DoublePrecision`.
  - The primary key for the `profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `profiles` table. All the data in the column will be lost.
  - Made the column `is_resolved` on table `admin_flags` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `admin_flags` required. This step will fail if there are existing NULL values in that column.
  - Made the column `members_count` on table `communities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `online_count` on table `communities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `communities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `joined_at` on table `community_members` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `contracts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `contracts` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `mentors` table without a default value. This is not possible if the table is not empty.
  - Made the column `online` on table `mentors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `avail` on table `mentors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `exp` on table `mentors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `activity` on table `mentors` required. This step will fail if there are existing NULL values in that column.
  - Made the column `thread_id` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `notifications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_read` on table `notifications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `notifications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `post_id` on table `post_reactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `post_reactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reaction_type` on table `post_reactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `post_reactions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_anonymous` on table `posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `like_count` on table `posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reply_count` on table `posts` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `joined_at` on table `session_participants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `sessions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `sessions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_private` on table `threads` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `threads` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_active` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_admin` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_anonymous` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "admin_flags" DROP CONSTRAINT "admin_flags_created_by_fkey";

-- DropForeignKey
ALTER TABLE "community_members" DROP CONSTRAINT "community_members_community_slug_fkey";

-- DropForeignKey
ALTER TABLE "community_members" DROP CONSTRAINT "community_members_user_id_fkey";

-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_client_id_fkey";

-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_mentor_id_fkey";

-- DropForeignKey
ALTER TABLE "mentors" DROP CONSTRAINT "mentors_user_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_author_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_thread_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "post_reactions" DROP CONSTRAINT "post_reactions_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_reactions" DROP CONSTRAINT "post_reactions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_author_id_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_community_slug_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "session_participants" DROP CONSTRAINT "session_participants_session_id_fkey";

-- DropForeignKey
ALTER TABLE "session_participants" DROP CONSTRAINT "session_participants_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_community_slug_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_host_id_fkey";

-- DropForeignKey
ALTER TABLE "thread_participants" DROP CONSTRAINT "thread_participants_thread_id_fkey";

-- DropForeignKey
ALTER TABLE "thread_participants" DROP CONSTRAINT "thread_participants_user_id_fkey";

-- DropIndex
DROP INDEX "idx_posts_community_created";

-- DropIndex
DROP INDEX "posts_author_idx";

-- DropIndex
DROP INDEX "idx_users_email";

-- AlterTable
ALTER TABLE "admin_flags" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "is_resolved" SET NOT NULL,
ALTER COLUMN "resolved_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "communities" ALTER COLUMN "members_count" SET NOT NULL,
ALTER COLUMN "online_count" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "community_members" ALTER COLUMN "joined_at" SET NOT NULL,
ALTER COLUMN "joined_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "contracts" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "mentors" DROP CONSTRAINT "mentors_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "userId" UUID NOT NULL,
ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "online" SET NOT NULL,
ALTER COLUMN "topics" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "style" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "avail" SET NOT NULL,
ALTER COLUMN "exp" SET NOT NULL,
ALTER COLUMN "activity" SET NOT NULL,
ADD CONSTRAINT "mentors_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "thread_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "edited_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "is_read" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "post_reactions" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "post_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "reaction_type" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "is_anonymous" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "edited_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "like_count" SET NOT NULL,
ALTER COLUMN "reply_count" SET NOT NULL;

-- AlterTable
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "userId" UUID NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "session_participants" ALTER COLUMN "joined_at" SET NOT NULL,
ALTER COLUMN "joined_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "left_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "starts_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "ends_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "thread_participants" ALTER COLUMN "last_read_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "threads" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "is_private" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "is_active" SET NOT NULL,
ALTER COLUMN "is_admin" SET NOT NULL,
ALTER COLUMN "is_anonymous" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "last_seen_at" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "user_consents" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "agreed_to_terms" BOOLEAN NOT NULL,
    "agreed_to_privacy" BOOLEAN NOT NULL,
    "agreed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "user_consents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safety_events" (
    "id" SERIAL NOT NULL,
    "user_id" UUID,
    "type" TEXT NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "safety_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_members" ADD CONSTRAINT "community_members_community_slug_fkey" FOREIGN KEY ("community_slug") REFERENCES "communities"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_members" ADD CONSTRAINT "community_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_community_slug_fkey" FOREIGN KEY ("community_slug") REFERENCES "communities"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentors" ADD CONSTRAINT "mentors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_participants" ADD CONSTRAINT "session_participants_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_participants" ADD CONSTRAINT "session_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread_participants" ADD CONSTRAINT "thread_participants_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread_participants" ADD CONSTRAINT "thread_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_flags" ADD CONSTRAINT "admin_flags_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_consents" ADD CONSTRAINT "user_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safety_events" ADD CONSTRAINT "safety_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "posts_created_idx" RENAME TO "posts_created_at_idx";
