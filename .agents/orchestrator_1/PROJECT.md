# Project: Jamal Ibrahim Portfolio Multi-Design Worktrees

## Architecture
The application is built on:
- **Framework**: TanStack Start (`@tanstack/react-start` + `@tanstack/react-router` v1.142.11) with React 19 and Vite 7.
- **Runtime**: Cloudflare Workers with SSR (`@cloudflare/vite-plugin` and `app/worker.ts`).
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss` v4) with CSS `@theme` variables in `app/globals.css`.
- **Database & Storage**: Cloudflare D1 SQLite via Drizzle ORM (`app/db/`), Cloudflare R2 via Wrangler (`app/services/storageService.ts`).
- **UI Components**: Radix UI primitives, `cmdk` command palette, `lucide-react` icons, `next-themes` dark mode provider.
- **Isolation Architecture**: Three isolated Git worktrees located in `.worktrees/minimalist`, `.worktrees/bento`, and `.worktrees/interactive`, mapped to separate git branches (`design/minimalist`, `design/bento`, `design/interactive`) with distinct dev/preview ports (`3001`, `3002`, `3003`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Baseline Git Commit | Commit untracked TanStack Start migration to `dev` with `.worktrees/` in `.gitignore` | M1 | Survey (Explorers 1, 2, 3) |
| 2 | Worktree Creation | Create git worktrees for Minimalist, Bento, and Interactive on their respective branches | M1 | ORIGINAL_REQUEST §Acceptance |
| 3 | Worktree Environment Isolation | Symlink `.wrangler` (for D1/R2 state), copy `.env`, run `bun install` per worktree | M1 | Survey (Explorer 3) |
| 4 | Distinct Preview Ports | Configure ports 3001, 3002, 3003 in package.json and vite.config.ts per worktree | M1 | ORIGINAL_REQUEST §Acceptance |
| 5 | Minimalist Typography & Fonts | Load Newsreader (serif) / Inter (sans) font pair in `__root.tsx`, clean typographic scale | M2 | ORIGINAL_REQUEST §R1 |
| 6 | Minimalist Monochromatic Theme | Monochromatic zinc/slate palette, 1px subtle micro-borders, understated hover states | M2 | ORIGINAL_REQUEST §R1 |
| 7 | Minimalist Home Route | Editorial statement, clean introductory prose, reading list, natural document scroll | M2 | ORIGINAL_REQUEST §R1 |
| 8 | Minimalist About Route | Single-column narrative story, muted timeline for experience and education | M2 | ORIGINAL_REQUEST §R1 |
| 9 | Minimalist Projects Route | Replace snap carousel with editorial vertical project table/list with tags & links | M2 | ORIGINAL_REQUEST §R1 |
| 10 | Minimalist Blog Route | High-readability prose, optimal measure (65-75ch), distraction-free layout | M2 | ORIGINAL_REQUEST §R1 |
| 11 | Minimalist Contact Route | Clean understated contact form with quiet typography and mailto fallback | M2 | ORIGINAL_REQUEST §R1 |
| 12 | Minimalist Build Verification | Successful `bun run build` with zero errors in `.worktrees/minimalist` | M2 | ORIGINAL_REQUEST §Acceptance |
| 13 | Bento Dark Obsidian Theme | Obsidian dark background (`#050508`), ambient glow radial mesh gradients | M3 | ORIGINAL_REQUEST §R2 |
| 14 | Bento Glassmorphism Borders | Razor-thin glass borders (`border-white/10`), backdrop blur, elevated cards | M3 | ORIGINAL_REQUEST §R2 |
| 15 | Bento Home Modular Grid | Multi-column bento layout: profile, live status, location/timezone, tech matrix, featured showcase | M3 | ORIGINAL_REQUEST §R2 |
| 16 | Bento About Modular Grid | Bento cards for metrics, technical skills matrix, experience cards with impact tags | M3 | ORIGINAL_REQUEST §R2 |
| 17 | Bento Projects Grid | Rich project cards with preview frames, tech badges, impact metrics, action buttons | M3 | ORIGINAL_REQUEST §R2 |
| 18 | Bento Blog & Contact Layouts | Sleek glass card containers with subtle ambient glow outlines | M3 | ORIGINAL_REQUEST §R2 |
| 19 | Bento Build Verification | Successful `bun run build` with zero errors in `.worktrees/bento` | M3 | ORIGINAL_REQUEST §Acceptance |
| 20 | Interactive Terminal Hero | Terminal-inspired hero with interactive CLI shell parser (`help`, `whoami`, `skills`, `projects`, `theme`, `clear`) | M4 | ORIGINAL_REQUEST §R3 |
| 21 | Interactive Global Cmd+K | Global command palette modal (`cmdk`) for keyboard navigation across routes, projects, blogs, theme, resume | M4 | ORIGINAL_REQUEST §R3 |
| 22 | Interactive Micro-Animations & Easter Eggs | Responsive hover widgets, interactive skills display, Konami code, confetti celebration | M4 | ORIGINAL_REQUEST §R3 |
| 23 | Interactive Route Reskins | Developer-first interactive styling across Home, About, Projects, Blog, Contact | M4 | ORIGINAL_REQUEST §R3 |
| 24 | Interactive Build Verification | Successful `bun run build` with zero errors in `.worktrees/interactive` | M4 | ORIGINAL_REQUEST §Acceptance |
| 25 | Cloudflare D1/R2 Data Preservation | Retain all existing D1 queries, services, and R2 asset storage contracts | M2, M3, M4, M5 | ORIGINAL_REQUEST §R4 |
| 26 | Root Comparison Summary | Comprehensive `worktrees_comparison.md` comparing design philosophies, components, and instructions | M5 | ORIGINAL_REQUEST §R4 |
| 27 | Final Multi-Worktree Audit Gate | Full verification of all builds, preview ports, and forensic integrity checks | M5 | ORIGINAL_REQUEST §Acceptance |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Git Worktrees & Environment Foundation | Commit baseline, create 3 worktrees, configure ports 3001/3002/3003, install deps, link wrangler state | none | PLANNED |
| M2 | Minimalist Editorial Design | Full reskin of Home, About, Projects, Blog, Contact in `.worktrees/minimalist` + build verification | M1 | PLANNED |
| M3 | High-Tech Bento Grid Design | Full reskin of Home, About, Projects, Blog, Contact in `.worktrees/bento` + build verification | M1 | PLANNED |
| M4 | Interactive Developer Design | Terminal hero, Cmd+K palette, micro-animations, full reskin in `.worktrees/interactive` + build verification | M1 | PLANNED |
| M5 | Cross-Worktree Verification & Comparison Summary | Build verification across all 3 worktrees, port validation, `worktrees_comparison.md`, review & audit | M2, M3, M4 | PLANNED |

## Interface Contracts

### Shared Route & Data Contracts
All design variations MUST preserve:
1. **Route File Paths**:
   - `app/routes/__root.tsx`: Shared root layout, theme provider, global navigation.
   - `app/routes/index.tsx`: Home page loader and component.
   - `app/routes/about/index.tsx`: About page loader and component.
   - `app/routes/about/uses.tsx`: Uses sub-page.
   - `app/routes/projects/index.tsx`: Projects page loader and component.
   - `app/routes/blog/index.tsx`: Blog listing loader and component.
   - `app/routes/blog/$slug/index.tsx`: Blog post detail loader and component.
   - `app/routes/contact/index.tsx`: Contact form loader and component.
2. **Data Services**:
   - `profileService.getProfile()` -> returns `ProfileType`
   - `projectService.getProjectsWithDetails()` -> returns projects joined with technologies
   - `blogService.getPublishedPosts()` -> returns published posts array
   - `technologyService.getTechnologies()` / `categoryService.getCategories()`
   - `contactService.submitContact(...)` -> mutation to `/api/contact-submissions`
   - `storageService.getFileView(...)` -> Cloudflare R2 asset retrieval
3. **Multi-Port Execution Matrix**:
   - Minimalist: Port 3001 (`bun run dev`, `bun run start`)
   - Bento: Port 3002 (`bun run dev`, `bun run start`)
   - Interactive: Port 3003 (`bun run dev`, `bun run start`)

## Code Layout
- `.worktrees/minimalist/`: Owns branch `design/minimalist`. Modifications strictly inside this directory.
- `.worktrees/bento/`: Owns branch `design/bento`. Modifications strictly inside this directory.
- `.worktrees/interactive/`: Owns branch `design/interactive`. Modifications strictly inside this directory.
- Root repository (`/Users/captjay98/projects/personal/portfolio`): Owns `worktrees_comparison.md`, root `.gitignore`, and shared `.agents/` metadata.
