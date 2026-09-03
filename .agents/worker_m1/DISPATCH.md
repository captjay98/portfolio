# Task Assignment — Worker M1 (Git Worktrees & Environment Foundation)

Read `/Users/captjay98/projects/personal/portfolio/.agents/ORIGINAL_REQUEST.md` before starting work.
Also read `/Users/captjay98/projects/personal/portfolio/.agents/orchestrator_1/PROJECT.md`.
Also read Explorer 3's handoff report at `/Users/captjay98/projects/personal/portfolio/.agents/explorer_survey_3/handoff.md`.

## Working Directory
`/Users/captjay98/projects/personal/portfolio/.agents/worker_m1`

## Mission
Execute Milestone 1: Setup isolated git worktrees and environment configuration.

1. **Commit Baseline to Git**:
   - In `/Users/captjay98/projects/personal/portfolio`, add `.worktrees/` to `.gitignore`.
   - Stage all untracked and modified files from the TanStack Start migration (`git add -A`).
   - Commit baseline: `git commit -m "feat: complete TanStack Start and Cloudflare D1/R2 migration baseline"`.
   - Copy `/Users/captjay98/projects/personal/portfolio/.agents/orchestrator_1/PROJECT.md` to `/Users/captjay98/projects/personal/portfolio/PROJECT.md`.

2. **Create Git Worktrees**:
   - Create `.worktrees` directory.
   - Create worktree 1: `git worktree add .worktrees/minimalist -b design/minimalist`
   - Create worktree 2: `git worktree add .worktrees/bento -b design/bento`
   - Create worktree 3: `git worktree add .worktrees/interactive -b design/interactive`

3. **Configure Environment, Ports & Dependencies in each Worktree**:
   - For `.worktrees/minimalist`:
     - Copy `.env` from root (`cp ../../.env .env`)
     - Symlink `.wrangler` from root (`ln -s ../../.wrangler .wrangler`)
     - Run `bun install`
     - Update `package.json` scripts to use port 3001:
       `"dev": "vite dev --port 3001 --strictPort"`
       `"start": "vite preview --port 3001 --strictPort"`
     - Update `vite.config.ts` to include `server: { port: 3001, strictPort: true }` and `preview: { port: 3001, strictPort: true }`
   - For `.worktrees/bento`:
     - Copy `.env` from root (`cp ../../.env .env`)
     - Symlink `.wrangler` from root (`ln -s ../../.wrangler .wrangler`)
     - Run `bun install`
     - Update `package.json` scripts to use port 3002:
       `"dev": "vite dev --port 3002 --strictPort"`
       `"start": "vite preview --port 3002 --strictPort"`
     - Update `vite.config.ts` to include `server: { port: 3002, strictPort: true }` and `preview: { port: 3002, strictPort: true }`
   - For `.worktrees/interactive`:
     - Copy `.env` from root (`cp ../../.env .env`)
     - Symlink `.wrangler` from root (`ln -s ../../.wrangler .wrangler`)
     - Run `bun install`
     - Update `package.json` scripts to use port 3003:
       `"dev": "vite dev --port 3003 --strictPort"`
       `"start": "vite preview --port 3003 --strictPort"`
     - Update `vite.config.ts` to include `server: { port: 3003, strictPort: true }` and `preview: { port: 3003, strictPort: true }`

4. **Verify Builds**:
   - Run `bun run build` in `.worktrees/minimalist`
   - Run `bun run build` in `.worktrees/bento`
   - Run `bun run build` in `.worktrees/interactive`
   - Verify all 3 exit with code 0 and generate bundles in `dist/client` and `dist/server`.

5. **Report**:
   Write full completion report to `/Users/captjay98/projects/personal/portfolio/.agents/worker_m1/handoff.md`.

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## 2026-09-03T13:37:31Z
You are Worker M1 (Git Worktrees & Environment Foundation).
Your working directory is: /Users/captjay98/projects/personal/portfolio/.agents/worker_m1

MANDATORY: Read /Users/captjay98/projects/personal/portfolio/.agents/ORIGINAL_REQUEST.md before starting work.
Also read /Users/captjay98/projects/personal/portfolio/.agents/orchestrator_1/PROJECT.md.
Also read Explorer 3's handoff report at /Users/captjay98/projects/personal/portfolio/.agents/explorer_survey_3/handoff.md.
Also read your task instructions at /Users/captjay98/projects/personal/portfolio/.agents/worker_m1/DISPATCH.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your mission:
1. In the root repository (/Users/captjay98/projects/personal/portfolio):
   - Add .worktrees/ to .gitignore.
   - Stage all untracked and modified TanStack Start migration files (`git add -A`).
   - Commit baseline: `git commit -m "feat: complete TanStack Start and Cloudflare D1/R2 migration baseline"`.
   - Ensure /Users/captjay98/projects/personal/portfolio/PROJECT.md exists by copying /Users/captjay98/projects/personal/portfolio/.agents/orchestrator_1/PROJECT.md to /Users/captjay98/projects/personal/portfolio/PROJECT.md.
2. Create the 3 isolated git worktrees:
   - `mkdir -p .worktrees`
   - `git worktree add .worktrees/minimalist -b design/minimalist`
   - `git worktree add .worktrees/bento -b design/bento`
   - `git worktree add .worktrees/interactive -b design/interactive`
3. In EACH of the 3 worktrees:
   - Copy `.env` from root: `cp ../../.env .env`
   - Symlink `.wrangler` state from root: `ln -s ../../.wrangler .wrangler`
   - Run `bun install`
   - Configure distinct dev and preview ports:
     - `.worktrees/minimalist`: port 3001 in package.json and vite.config.ts
     - `.worktrees/bento`: port 3002 in package.json and vite.config.ts
     - `.worktrees/interactive`: port 3003 in package.json and vite.config.ts
4. Verify builds:
   - Run `bun run build` in `.worktrees/minimalist`
   - Run `bun run build` in `.worktrees/bento`
   - Run `bun run build` in `.worktrees/interactive`
   Confirm that all 3 builds succeed with exit code 0.
5. Write your complete handoff report to:
   /Users/captjay98/projects/personal/portfolio/.agents/worker_m1/handoff.md
   Include all executed commands, outputs, verification steps, and worktree paths.
6. When finished, send a message to parent notifying that your report is ready.
