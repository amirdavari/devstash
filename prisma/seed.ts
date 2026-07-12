import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// System item types — immutable, shared across all users (userId = null).
// Mirrors the "system types" table in context/project-overview.md.
const SYSTEM_ITEM_TYPES = [
  { name: 'snippet', icon: 'Code', color: '#3b82f6' },
  { name: 'prompt', icon: 'Sparkles', color: '#8b5cf6' },
  { name: 'note', icon: 'StickyNote', color: '#fde047' },
  { name: 'command', icon: 'Terminal', color: '#f97316' },
  { name: 'link', icon: 'Link', color: '#10b981' },
  { name: 'file', icon: 'File', color: '#6b7280' },
  { name: 'image', icon: 'Image', color: '#ec4899' },
]

async function main() {
  for (const type of SYSTEM_ITEM_TYPES) {
    // Postgres treats NULL as distinct in unique indexes, so the
    // @@unique([userId, name]) constraint can't dedupe system types (userId is
    // null). Guard with an explicit lookup to keep the seed idempotent.
    const existing = await prisma.itemType.findFirst({
      where: { name: type.name, userId: null },
    })

    if (existing) {
      await prisma.itemType.update({
        where: { id: existing.id },
        data: { icon: type.icon, color: type.color, isSystem: true },
      })
    } else {
      await prisma.itemType.create({
        data: { ...type, isSystem: true },
      })
    }
  }

  console.log(`Seeded ${SYSTEM_ITEM_TYPES.length} system item types.`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })