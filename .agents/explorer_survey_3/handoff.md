# Handoff Report — Explorer 3: Data Integrations, Build System & Git Worktrees

## Executive Summary
This report provides the authoritative technical analysis of the data layer, build system, and git worktree isolation strategy for Jamal Ibrahim's portfolio at `/Users/captjay98/projects/personal/portfolio`. The codebase is built on **TanStack Start** (`v1.142.11`), **Vite 7** (`v7.3.0`), **React 19**, **Tailwind CSS v4**, **Cloudflare D1 SQLite** via **Drizzle ORM** (`v0.45.2`), and **Cloudflare R2** object storage via **Wrangler** (`v4.56.0`).

A critical git blocker was identified: the current Git `HEAD` commit (`38e49e7`) still contains the legacy Next.js application, while the complete TanStack Start migration currently sits as unstaged modifications and untracked files in the working tree. This report provides the exact sequential protocol required to safely commit this baseline, construct the three isolated worktrees (`.worktrees/minimalist`, `.worktrees/bento`, `.worktrees/interactive`), bind distinct preview ports (`3001`, `3002`, `3003`), and ensure complete dependency and data fidelity.

---

## 1. Observation

### 1.1 Git Status and Commit History
Direct command: `git status`
```text
On branch dev
Your branch is up to date with 'origin/dev'.

Changes not staged for commit:
	modified:   .gitignore
	deleted:    next.config.ts
	deleted:    open-next.config.ts
	modified:   package.json
	modified:   postcss.config.mjs
	deleted:    src/... (all legacy Next.js files in src/)
	modified:   tsconfig.json
	deleted:    wrangler.toml

Untracked files:
	.agents/
	.env.example
	.factory/
	ORIGINAL_REQUEST.md
	app/
	bun.lock
	data/
	drizzle.config.ts
	migrations/
	mocks/
	package-lock.json
	public/_headers
	public/blog/how-i-built-this-site.png
	scripts/d1/
	tsr.config.json
	vite.config.ts
	wrangler.jsonc
```

Direct command: `git log -1 --oneline`
```text
38e49e7 removed all vercel
```

Direct command: `git worktree list`
```text
/Users/captjay98/projects/personal/portfolio  38e49e7 [dev]
```

### 1.2 Build System & Verification
- **Package Manager**: Bun (detected via active `bun.lock` of size 245,152 bytes; `bun run` is standard).
- **Scripts** (`package.json`, lines 6-16):
  ```json
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "start": "vite preview",
    "deploy": "vite build && wrangler deploy --config dist/server/wrangler.json",
    "db:generate": "drizzle-kit generate",
    "db:migrate:local": "wrangler d1 migrations apply portfolio-db --local",
    "db:migrate:remote": "wrangler d1 migrations apply portfolio-db --remote",
    "db:seed:local": "wrangler d1 execute portfolio-db --local --file=migrations/seed.sql",
    "db:seed:remote": "wrangler d1 execute portfolio-db --remote --file=migrations/seed.sql"
  }
  ```
- **Vite & SSR Configuration** (`vite.config.ts`, lines 1-28):
  - Plugins: `cloudflare({ viteEnvironment: { name: 'ssr' } })`, `tanstackStart({ srcDirectory: 'app' })`, `viteReact()`, `tsconfigPaths()`
  - Path Aliases: `@app` -> `./app`, `@` -> `./app`
  - Server ignore: `**/.wrangler/**`
- **Build Verification Execution**:
  Direct command: `bun run build`
  - Client Build: `✓ built in 4.99s`
  - SSR Build: `✓ 4829 modules transformed. built in 4.36s`
  - Exit code: `0` (Zero errors)
  - Generated output:
    - `dist/client/assets/` (Static client bundles, router manifest, fonts, CSS)
    - `dist/server/` (`worker-entry-*.js` (971 kB), `wrangler.json` (1.69 kB), `.dev.vars` (0.14 kB))
- **TypeScript Configuration** (`tsconfig.json`, lines 1-22):
  - Target `ES2017`, Module `esnext`, ModuleResolution `bundler`, `strict: true`, `noEmit: true`.
  - Path mapping: `"@app/*": ["./app/*"]`.
  - Note: Legacy `seeders/` and `scripts/` directories contain obsolete references to `node-appwrite` and `../src/`, but Vite ignores them as it builds strictly from entrypoints (`app/client.tsx`, `app/worker.ts`).

### 1.3 Cloudflare D1 Database Integration
- **Wrangler Bindings** (`wrangler.jsonc`, lines 13-20):
  ```json
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "portfolio-db",
      "database_id": "5fda5883-e8ea-4406-8bbc-267e22d61ecd",
      "migrations_dir": "./migrations"
    }
  ]
  ```
- **Drizzle ORM Configuration** (`drizzle.config.ts`, lines 1-8):
  - Schema: `./app/db/schema.ts`
  - Dialect: `sqlite`
  - Out: `./migrations`
- **Database Client Access** (`app/db/index.ts`, lines 4-31):
  - `getDb(customDb?: D1Database)` returns `drizzle(customDb || globalThis.DB || globalThis.env.DB || globalThis.__env__.DB || require('cloudflare:workers').env.DB, { schema })`.
- **Database Schema** (`app/db/schema.ts`, 233 lines):
  - 19 Tables: `profile`, `categories`, `technologies`, `skills`, `experiences`, `experienceAccomplishments`, `projects`, `blogSeries`, `blogPosts`, `education`, `currentTechStack`, `uses`, `socialLinks`, `contactSubmissions`, `visitors`, `comments`, `guestBook`, `siteSettings`, `adminUsers`.
  - JSON columns stored as strings with `{ mode: 'json' }` (e.g. `category_ids`, `technology_ids`, `related_post_ids`).
- **Seed Data & Local State**:
  - `migrations/seed.sql`: 257,696 bytes of SQL `INSERT` statements exported from previous Appwrite production records.
  - Local Miniflare SQLite file present at:
    `.wrangler/state/v3/d1/miniflare-D1DatabaseObject/6a53138e6b1e8db7593e323a69fbad2666176c38a5d66bfe7915d4320bddd8f0.sqlite` (535 kB WAL file, populated with data).
  - Seeding command: `bun run db:seed:local`.

### 1.4 Cloudflare R2 Storage Assets
- **Wrangler Bindings** (`wrangler.jsonc`, lines 21-26):
  ```json
  "r2_buckets": [
    {
      "binding": "BUCKET",
      "bucket_name": "portfolio-assets"
    }
  ]
  ```
- **Worker & API Routing** (`app/worker.ts` & `app/api/index.ts`, lines 653-692):
  - Upload: `POST /api/storage/upload` -> Multipart form data -> `bucket.put(key, buffer, { httpMetadata: { contentType } })` -> returns `{ fileId: key, url: '/api/storage/${key}' }`.
  - Fetch / Serve: `GET /api/storage/:key` -> `bucket.get(storageKey)` -> returns streamed response with headers:
    `Cache-Control: public, max-age=31536000, immutable`, `etag: object.httpEtag`.
  - Delete: `DELETE /api/storage/:key` -> `bucket.delete(storageKey)`.
- **Client Service Helper** (`app/services/storageService.ts`, lines 25-30):
  - `storageService.getFileView(fileId)` checks if `fileId` starts with `http://`, `https://`, or `/` (returns verbatim); otherwise returns `/api/storage/${fileId}`.

### 1.5 Server Data Services & Hydration Patterns
- **Dual-Mode Data Fetching Pattern**:
  Every service in `app/services/` (`profileService`, `projectService`, `blogService`, `technologyService`, `categoryService`, etc.) checks execution environment:
  ```typescript
  const isServer = typeof window === "undefined";
  if (isServer) {
    const db = getDb();
    return await db.select().from(table)...;
  }
  const res = await fetch("/api/endpoint");
  return await res.json();
  ```
  - During SSR: directly accesses D1 SQLite via Drizzle ORM in memory/Worker.
  - During client hydration / SPA navigation: fetches the unified `/api/*` endpoints handled in `app/api/index.ts`.
- **Loader Fallback Resilience**:
  All loaders in `app/routes/` (`/`, `/about`, `/projects`, `/blog`, `/contact`) wrap queries in `try/catch` and provide fallback mock structures if the database query fails, guaranteeing zero-crash SSR rendering.

### 1.6 Environment Variables & Git Ignore Status
- `.env` contains:
  - `VITE_APPWRITE_PROJECT_ID=67de53f7003790f8388f`
  - `VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1`
  - `VITE_APPWRITE_DATABASE_ID=portfolio`
- `.gitignore`:
  - Contains `.env`, `.wrangler/`, `dist/`, `node_modules/`.
  - **Does NOT yet contain `.worktrees/`**.

---

## 2. Logic Chain

### 2.1 Git Worktree Creation Prerequisite
1. **Premise**: `git worktree add <path> -b <branch>` checks out a branch from an existing git commit object in `.git`.
2. **Observation**: `git log -1` is `38e49e7` ("removed all vercel"), which contains Next.js in `src/`. The entire TanStack Start migration (`app/`, `vite.config.ts`, `wrangler.jsonc`, `drizzle.config.ts`, `migrations/`, `bun.lock`) exists only as unstaged modifications and untracked files in the root working directory.
3. **Inference**: If a worktree is created before committing, the worktree will checkout `38e49e7` (the old Next.js files), and none of the untracked TanStack Start files will exist in `.worktrees/<variant>`.
4. **Conclusion**: The baseline TanStack Start migration MUST be committed to `dev` first. Additionally, `.worktrees/` must be appended to `.gitignore` before committing, so that worktree folders do not dirty the root repository's git status.

### 2.2 Dependency and Environment Isolation
1. **Premise**: Git worktrees are independent working trees sharing the same `.git` repository, but each has its own independent filesystem directory.
2. **Observation**: Files that are in `.gitignore` (`node_modules/`, `.env`, `.wrangler/`) are NOT copied or tracked by git when a worktree is checked out.
3. **Inference**:
   - `node_modules`: Running `bun install` inside each worktree provides total dependency isolation. Because Bun caches packages globally in `~/.bun/install/cache`, `bun install` in a new worktree takes less than 2 seconds and uses hardlinks without duplicating disk storage.
   - `.env`: The `.env` file must be explicitly copied to `.worktrees/<variant>/.env`.
   - `.wrangler` (Local D1/R2 State): In development, `@cloudflare/vite-plugin` and Wrangler read local SQLite files from `.wrangler/state/v3/d1/`. By creating a symbolic link (`ln -s ../../.wrangler .worktrees/<variant>/.wrangler`), all three worktrees instantly share the exact same 257 kB seeded D1 database state without file duplication or out-of-sync data.

### 2.3 Port Assignment Strategy
1. **Premise**: The acceptance criteria mandate that each worktree configures distinct local dev/preview ports (e.g. 3001, 3002, 3003) for simultaneous local testing.
2. **Observation**:
   - `vite dev --help` and `vite preview --help` confirm support for `--port <port>` and `--strictPort`.
   - Vite 7 allows specifying port in `vite.config.ts` (`server: { port: 3001, strictPort: true }`, `preview: { port: 3001, strictPort: true }`) or directly in `package.json` scripts (`"dev": "vite dev --port 3001"`, `"start": "vite preview --port 3001"`).
3. **Inference**: Configuring both `package.json` scripts and `vite.config.ts` in each worktree guarantees that running `bun run dev` or `bun run start` in each directory automatically binds strictly to 3001, 3002, and 3003 without accidental collisions.

---

## 3. Caveats
1. **Appwrite Legacy Files**: The repository contains legacy seeders in `seeders/` and export data in `data/appwrite-export/`. These are retained for reference and data migration history, but are not executed during runtime or build.
2. **TypeScript Excludes**: `tsconfig.json` currently includes `**/*.ts`. Running `tsc --noEmit` fails on legacy `seeders/` because those scripts imported deleted `src/` modules. Vite's build does not use `tsc` for emission and bundles `app/worker.ts` and `app/client.tsx` with zero errors. A minor enhancement to `tsconfig.json` to add `"exclude": ["node_modules", "seeders", "legacy-backup"]` is recommended.
3. **Cloudflare Remote Bindings**: Remote D1 and R2 deployments require Cloudflare API credentials. For local worktree development and preview, Wrangler Miniflare handles all D1 and R2 operations locally using `.wrangler/state`.

---

## 4. Conclusion & Actionable Execution Plan

### 4.1 Git Worktree Creation & Setup Protocol
The following exact sequential commands must be executed by the orchestrator/environment setup worker:

#### Phase A: Commit TanStack Start Baseline in Root
```bash
cd /Users/captjay98/projects/personal/portfolio

# 1. Ignore worktrees in root .gitignore
if ! grep -q "^\.worktrees/" .gitignore; then
  echo -e "\n# Isolated git worktrees\n.worktrees/" >> .gitignore
fi

# 2. Stage all baseline migration changes (removing old src/, adding new app/ and configs)
git add -A

# 3. Commit the baseline
git commit -m "feat: complete TanStack Start and Cloudflare D1/R2 migration baseline"
```

#### Phase B: Create Worktrees
```bash
# Ensure .worktrees directory exists
mkdir -p .worktrees

# 1. Minimalist Worktree
git worktree add .worktrees/minimalist -b design/minimalist

# 2. Bento Worktree
git worktree add .worktrees/bento -b design/bento

# 3. Interactive Worktree
git worktree add .worktrees/interactive -b design/interactive
```

#### Phase C: Configure Environment & Dependencies per Worktree

##### For `.worktrees/minimalist` (Port 3001):
```bash
cd /Users/captjay98/projects/personal/portfolio/.worktrees/minimalist

# Copy environment
cp ../../.env .env

# Symlink local D1/R2 database state
ln -s ../../.wrangler .wrangler

# Install isolated dependencies
bun install

# Configure Port 3001 in package.json
node -e '
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  pkg.scripts.dev = "vite dev --port 3001 --strictPort";
  pkg.scripts.start = "vite preview --port 3001 --strictPort";
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
'
```

##### For `.worktrees/bento` (Port 3002):
```bash
cd /Users/captjay98/projects/personal/portfolio/.worktrees/bento

# Copy environment
cp ../../.env .env

# Symlink local D1/R2 database state
ln -s ../../.wrangler .wrangler

# Install isolated dependencies
bun install

# Configure Port 3002 in package.json
node -e '
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  pkg.scripts.dev = "vite dev --port 3002 --strictPort";
  pkg.scripts.start = "vite preview --port 3002 --strictPort";
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
'
```

##### For `.worktrees/interactive` (Port 3003):
```bash
cd /Users/captjay98/projects/personal/portfolio/.worktrees/interactive

# Copy environment
cp ../../.env .env

# Symlink local D1/R2 database state
ln -s ../../.wrangler .wrangler

# Install isolated dependencies
bun install

# Configure Port 3003 in package.json
node -e '
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  pkg.scripts.dev = "vite dev --port 3003 --strictPort";
  pkg.scripts.start = "vite preview --port 3003 --strictPort";
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
'
```

### 4.2 Port Mapping Matrix
| Worktree Path | Git Branch | Dev Port | Preview Port | Dev Command | Build Verification |
|---|---|---|---|---|---|
| `.worktrees/minimalist` | `design/minimalist` | **3001** | **3001** | `bun run dev` | `bun run build` |
| `.worktrees/bento` | `design/bento` | **3002** | **3002** | `bun run dev` | `bun run build` |
| `.worktrees/interactive` | `design/interactive` | **3003** | **3003** | `bun run dev` | `bun run build` |

---

## 5. Verification Method

To independently verify the findings of this report:

1. **Verify Baseline Build in Root**:
   ```bash
   cd /Users/captjay98/projects/personal/portfolio
   bun run build
   ```
   *Expected*: Builds client and SSR bundles with exit code `0` in under 10 seconds.

2. **Verify D1 SQLite Database State**:
   ```bash
   ls -lh /Users/captjay98/projects/personal/portfolio/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/
   ```
   *Expected*: Shows `.sqlite`, `.sqlite-shm`, and `.sqlite-wal` files with active seed data.

3. **Verify Worktree Creation and Isolated Builds** (after executing Phase A, B, C):
   ```bash
   cd /Users/captjay98/projects/personal/portfolio/.worktrees/minimalist && bun run build
   cd /Users/captjay98/projects/personal/portfolio/.worktrees/bento && bun run build
   cd /Users/captjay98/projects/personal/portfolio/.worktrees/interactive && bun run build
   ```
   *Expected*: All three worktrees produce successful builds without errors or missing files.

4. **Verify Simultaneous Local Server Port Binding**:
   - Worktree Minimalist: `bun run dev` in `.worktrees/minimalist` starts on `http://localhost:3001`
   - Worktree Bento: `bun run dev` in `.worktrees/bento` starts on `http://localhost:3002`
   - Worktree Interactive: `bun run dev` in `.worktrees/interactive` starts on `http://localhost:3003`

5. **Invalidation Conditions**:
   - If worktrees are created before committing the uncommitted files, worktrees will lack `app/` and fail.
   - If `.env` is omitted from worktrees, SSR secret injection in Vite will show missing environment warnings.
