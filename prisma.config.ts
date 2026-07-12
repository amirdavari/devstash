import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  // This URL is used by the Prisma CLI (migrate, studio, seed). For Neon,
  // point it at the DIRECT (non-pooled) connection. The app at runtime connects
  // separately through the driver adapter with the pooled DATABASE_URL — see
  // src/lib/prisma.ts.
  datasource: {
    url: env('DIRECT_URL'),
  },
})