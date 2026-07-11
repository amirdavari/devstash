# DevStash
A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types.

## Context Files
Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interaction.md
- @context/current-feature.md

@AGENTS.md

## Version-specific docs (see AGENTS.md above)

This project runs **Next.js 16.2.10** / **React 19.2.4**, whose APIs may differ from your
training data. AGENTS.md requires reading the bundled docs before touching Next.js code.
Where to look under `node_modules/next/dist/docs/`:

- App Router (this project uses it): `01-app/`
- Config reference: `01-app/03-api-reference/05-config/`
- Functions/APIs: `01-app/03-api-reference/04-functions/`

## Commands

```bash
npm run dev      # start the dev server (http://localhost:3000)
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

There is no test runner configured yet.

## Architecture

- **App Router** under `src/app/`. `layout.tsx` is the root layout (loads the Geist /
  Geist Mono fonts via `next/font/google` and exposes them as `--font-geist-sans` /
  `--font-geist-mono` CSS variables); `page.tsx` is the route body for `/`.
- **Styling is Tailwind CSS v4.** `src/app/globals.css` pulls in the framework with a
  single `@import "tailwindcss";` — there is no `tailwind.config.js`. PostCSS is wired
  through `@tailwindcss/postcss` in `postcss.config.mjs`.
- **Path alias:** `@/*` maps to `./src/*` (see `tsconfig.json`).
- **ESLint** uses the flat-config format (`eslint.config.mjs`) composing
  `eslint-config-next` core-web-vitals + typescript presets.
- TypeScript is `strict` with `noEmit`; type checking happens via the build, not a
  separate script.
