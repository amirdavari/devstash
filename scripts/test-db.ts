/**
 * Quick database connectivity + sanity check.
 *
 *   npx tsx scripts/test-db.ts   (or: npm run db:test)
 *
 * Verifies we can reach Neon through the pooled connection, that the schema is
 * migrated, and that the system item types were seeded.
 */
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set — check your .env file.')
  }

  // 1. Can we reach the database at all?
  const [{ now }] = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`
  console.log(`✓ Connected to Postgres — server time: ${now.toISOString()}`)

  // 2. Is the schema migrated? Count every model's rows.
  const [items, itemTypes, collections, tags, users] = await Promise.all([
    prisma.item.count(),
    prisma.itemType.count(),
    prisma.collection.count(),
    prisma.tag.count(),
    prisma.user.count(),
  ])
  console.log('✓ Schema reachable — row counts:')
  console.table({ items, itemTypes, collections, tags, users })

  // 3. Are the system item types seeded?
  const systemTypes = await prisma.itemType.findMany({
    where: { userId: null, isSystem: true },
    select: { name: true, icon: true, color: true },
    orderBy: { name: 'asc' },
  })
  if (systemTypes.length === 0) {
    console.warn('⚠ No system item types found — run `npm run db:seed`.')
  } else {
    console.log(`✓ Found ${systemTypes.length} system item types:`)
    console.table(systemTypes)
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error('✗ Database test failed:')
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })