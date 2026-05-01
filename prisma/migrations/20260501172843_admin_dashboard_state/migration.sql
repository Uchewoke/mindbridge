-- CreateTable
CREATE TABLE "admin_dashboard_flags" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolution" TEXT,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_dashboard_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_dashboard_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_dashboard_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_dashboard_mentors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_dashboard_mentors_pkey" PRIMARY KEY ("id")
);
