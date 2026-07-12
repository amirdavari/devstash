import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import { ContentType } from '../src/generated/prisma/enums'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// System item types — immutable, shared across all users (userId = null).
// Mirrors the "system types" table in context/project-overview.md.
const SYSTEM_ITEM_TYPES = [
  { name: 'snippet', icon: 'Code', color: '#3b82f6' },
  { name: 'prompt', icon: 'Sparkles', color: '#8b5cf6' },
  { name: 'command', icon: 'Terminal', color: '#f97316' },
  { name: 'note', icon: 'StickyNote', color: '#fde047' },
  { name: 'file', icon: 'File', color: '#6b7280' },
  { name: 'image', icon: 'Image', color: '#ec4899' },
  { name: 'link', icon: 'Link', color: '#10b981' },
]

// Demo user for development and demos (context/features/seed-spec.md).
const DEMO_USER = {
  email: 'demo@devstash.io',
  name: 'Demo User',
  password: '12345678',
}

// Sample data. Each item names the system type it uses; links carry a `url`,
// everything else carries `content`. Grouped by the collection they belong to.
type SeedItem = {
  title: string
  type: string
  description?: string
  language?: string
  content?: string
  url?: string
}

type SeedCollection = {
  name: string
  description: string
  items: SeedItem[]
}

const COLLECTIONS: SeedCollection[] = [
  {
    name: 'React Patterns',
    description: 'Reusable React patterns and hooks',
    items: [
      {
        title: 'useDebounce hook',
        type: 'snippet',
        language: 'typescript',
        description: 'Debounce a rapidly-changing value.',
        content: `import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}`,
      },
      {
        title: 'useLocalStorage hook',
        type: 'snippet',
        language: 'typescript',
        description: 'State synced to localStorage.',
        content: `import { useCallback, useState } from 'react'

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : initial
  })

  const update = useCallback(
    (next: T) => {
      setValue(next)
      window.localStorage.setItem(key, JSON.stringify(next))
    },
    [key],
  )

  return [value, update] as const
}`,
      },
      {
        title: 'Theme context provider',
        type: 'snippet',
        language: 'typescript',
        description: 'Compound context provider with a typed hook.',
        content: `import { createContext, useContext, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'
const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
} | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}`,
      },
    ],
  },
  {
    name: 'AI Workflows',
    description: 'AI prompts and workflow automations',
    items: [
      {
        title: 'Code review prompt',
        type: 'prompt',
        description: 'Structured, senior-level code review.',
        content: `You are a senior software engineer performing a code review.

Review the following code for:
1. Correctness — logic errors, edge cases, race conditions
2. Security — injection, auth, unvalidated input
3. Readability — naming, structure, comments
4. Performance — unnecessary work, N+1 queries

For each issue: cite the line, explain the impact, and suggest a concrete fix.
Be direct. Skip praise. If the code is solid, say so briefly.

\`\`\`
{{CODE}}
\`\`\``,
      },
      {
        title: 'Documentation generator',
        type: 'prompt',
        description: 'Generate reference docs from source.',
        content: `Generate clear developer documentation for the code below.

Include:
- A one-sentence summary of what it does
- Parameters (name, type, description)
- Return value
- A short usage example
- Any thrown errors or edge cases

Write in Markdown. Keep it concise and accurate — do not invent behavior.

\`\`\`
{{CODE}}
\`\`\``,
      },
      {
        title: 'Refactoring assistant',
        type: 'prompt',
        description: 'Refactor without changing behavior.',
        content: `Refactor the following code to improve clarity and maintainability
WITHOUT changing its observable behavior.

Rules:
- Preserve the public API and return values
- Prefer small, well-named functions over comments
- Remove dead code and duplication
- Note any behavior you were unsure about instead of guessing

Return the refactored code, then a short bullet list of what you changed and why.

\`\`\`
{{CODE}}
\`\`\``,
      },
    ],
  },
  {
    name: 'DevOps',
    description: 'Infrastructure and deployment resources',
    items: [
      {
        title: 'Multi-stage Node Dockerfile',
        type: 'snippet',
        language: 'dockerfile',
        description: 'Slim production image via multi-stage build.',
        content: `# syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]`,
      },
      {
        title: 'Deploy to production',
        type: 'command',
        language: 'bash',
        description: 'Run migrations then deploy.',
        content: `npx prisma migrate deploy && npm run build && npm start`,
      },
      {
        title: 'Docker documentation',
        type: 'link',
        description: 'Official Docker reference.',
        url: 'https://docs.docker.com/',
      },
      {
        title: 'GitHub Actions documentation',
        type: 'link',
        description: 'Workflow syntax and CI/CD reference.',
        url: 'https://docs.github.com/en/actions',
      },
    ],
  },
  {
    name: 'Terminal Commands',
    description: 'Useful shell commands for everyday development',
    items: [
      {
        title: 'Undo last commit (keep changes)',
        type: 'command',
        language: 'bash',
        description: 'Soft-reset the most recent commit.',
        content: `git reset --soft HEAD~1`,
      },
      {
        title: 'Remove all stopped containers',
        type: 'command',
        language: 'bash',
        description: 'Prune stopped Docker containers.',
        content: `docker container prune -f`,
      },
      {
        title: 'Kill process on a port',
        type: 'command',
        language: 'bash',
        description: 'Find and kill whatever is listening on port 3000.',
        content: `lsof -ti:3000 | xargs kill -9`,
      },
      {
        title: 'Clean install dependencies',
        type: 'command',
        language: 'bash',
        description: 'Reproducible install from the lockfile.',
        content: `rm -rf node_modules package-lock.json && npm install`,
      },
    ],
  },
  {
    name: 'Design Resources',
    description: 'UI/UX resources and references',
    items: [
      {
        title: 'Tailwind CSS documentation',
        type: 'link',
        description: 'Utility-first CSS framework reference.',
        url: 'https://tailwindcss.com/docs',
      },
      {
        title: 'shadcn/ui',
        type: 'link',
        description: 'Composable React component library.',
        url: 'https://ui.shadcn.com',
      },
      {
        title: 'Material Design',
        type: 'link',
        description: "Google's design system guidelines.",
        url: 'https://m3.material.io/',
      },
      {
        title: 'Lucide icons',
        type: 'link',
        description: 'Open-source icon library.',
        url: 'https://lucide.dev/icons',
      },
    ],
  },
]

async function seedSystemItemTypes() {
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

async function seedDemoUser() {
  const passwordHash = await bcrypt.hash(DEMO_USER.password, 12)
  const user = await prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: { name: DEMO_USER.name, passwordHash, emailVerified: new Date() },
    create: {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  })

  console.log(`Seeded demo user ${user.email}.`)
  return user
}

async function seedCollectionsAndItems(userId: string) {
  // Map system type name -> id for wiring items to their ItemType.
  const types = await prisma.itemType.findMany({ where: { userId: null } })
  const typeIdByName = new Map(types.map((t) => [t.name, t.id]))

  let itemCount = 0

  for (const col of COLLECTIONS) {
    // Collections have no natural unique key beyond (userId, name); look up by
    // that pair to keep re-runs idempotent.
    const existing = await prisma.collection.findFirst({
      where: { userId, name: col.name },
    })

    const collection = existing
      ? await prisma.collection.update({
          where: { id: existing.id },
          data: { description: col.description },
        })
      : await prisma.collection.create({
          data: { userId, name: col.name, description: col.description },
        })

    for (const item of col.items) {
      const itemTypeId = typeIdByName.get(item.type)
      if (!itemTypeId) throw new Error(`Unknown item type: ${item.type}`)

      const isLink = item.type === 'link'
      const contentType = isLink ? ContentType.URL : ContentType.TEXT

      // Item titles are unique per user in this seed, so use (userId, title)
      // as the idempotency key.
      const existingItem = await prisma.item.findFirst({
        where: { userId, title: item.title },
      })

      const data = {
        userId,
        itemTypeId,
        title: item.title,
        contentType,
        description: item.description ?? null,
        language: item.language ?? null,
        content: isLink ? null : (item.content ?? null),
        url: isLink ? (item.url ?? null) : null,
      }

      const saved = existingItem
        ? await prisma.item.update({ where: { id: existingItem.id }, data })
        : await prisma.item.create({ data })

      // Link item -> collection (composite PK makes this naturally idempotent).
      await prisma.itemCollection.upsert({
        where: {
          itemId_collectionId: {
            itemId: saved.id,
            collectionId: collection.id,
          },
        },
        update: {},
        create: { itemId: saved.id, collectionId: collection.id },
      })

      itemCount++
    }
  }

  console.log(
    `Seeded ${COLLECTIONS.length} collections and ${itemCount} items.`,
  )
}

async function main() {
  await seedSystemItemTypes()
  const user = await seedDemoUser()
  await seedCollectionsAndItems(user.id)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })