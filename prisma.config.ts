/*
  Prisma config for Migrate (Prisma v7+ style)

  Move connection URLs here so `schema.prisma` no longer contains a `url` value.
  Adjust as needed: this file is read by Prisma CLI for migrations.

  Example usage:
    export default {
      datasources: {
        db: { url: process.env.DATABASE_URL }
      }
    }

  NOTE: Prisma CLI and runtime may expect different shapes; tweak if your setup needs
  `experimental`/`migrate` keys or provider-specific settings. See:
  https://pris.ly/d/config-datasource
*/

import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
