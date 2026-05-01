import { config as loadEnv } from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Ensure env is available even when modules are imported outside server bootstrap.
loadEnv()
loadEnv({ path: '../.env' })

// Force the standard query engine so local postgres URLs work in dev.
process.env.PRISMA_CLIENT_ENGINE_TYPE ??= 'library'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Configure backend/.env or root .env')
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
})
