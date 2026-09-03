# TanStack Start Migration Recovery Plan

## Current State Analysis
Your project is in a partial TanStack Start migration state with several issues:

### Structure
- **New TanStack Start setup**: `app/` directory with routes, router, SSR/client entry
- **Old Next.js structure**: `src/app/` directory still exists
- **Services location**: Most services in `src/services/` and `src/lib/`
- **Components**: Duplicated across both `src/components/` and `app/components/`

### Identified Issues

1. **Import Path Conflicts**
   - `app/hooks/useAuth.ts` imports from `@app/lib/appwrite` (✓ exists)
   - `src/hooks/useAuth.ts` imports from `@/lib/appwrite` (✓ exists)
   - Most files import from `@/lib/appwrite` or `@/services/*` which don't exist in `app/` namespace
   - Services are duplicated across `src/services/` and missing from `app/services/`

2. **Environment Variables**
   - Appwrite config uses `process.env.NEXT_PUBLIC_*` (Next.js prefix)
   - TanStack Start uses Vinxi which has different env variable handling
   - No `.env` file example found

3. **Path Alias Issues**
   - `tsconfig.json` has `@/*` → `./src/*` and `@app/*` → `./app/*`
   - Components in `app/` sometimes import from `@/services` which points to `src/services`
   - Creates confusion and potential build failures

4. **Duplicate Routes/Pages**
   - `src/app/` contains Next.js app router pages
   - `app/routes/` contains TanStack file-based routes
   - This causes confusion about which is the source of truth

5. **Module Resolution**
   - `node:async_hooks` mock exists but TanStack Start may not be loading it correctly
   - Vite config in `app.config.ts` has alias for this mock

## Recovery Plan

### Phase 1: Consolidate Services & Lib (Critical Path)
1. **Create `app/services/` directory** and move/copy all services from `src/services/`
2. **Create `app/lib/` directory** with appwrite config for TanStack Start
3. **Update imports** in `app/components/` to use local `@app/` imports
4. **Remove `src/` dependencies** from `app/` code completely

### Phase 2: Environment Variables
1. **Rename environment variables** from `NEXT_PUBLIC_*` to standard `VITE_*` or `*`
2. **Update Appwrite config** in both `src/lib/appwrite.ts` and create `app/lib/appwrite.ts`
3. **Create `.env.example`** with TanStack Start compatible env vars

### Phase 3: Remove Duplication
1. **Archive `src/app/`** (move to `legacy-backup/` or remove entirely)
2. **Keep `src/services/` temporarily** for backward compatibility, then remove
3. **Consolidate components** - use only `app/components/`
4. **Update `app/` imports** to consistently use `@app/` prefix

### Phase 4: Vinxi/Build Configuration
1. **Verify `app.config.ts`** has correct aliases and plugins
2. **Ensure `node:async_hooks` mock is working** for Vinxi async context
3. **Generate routes** with `bun run generate` and verify `routeTree.gen.ts`

### Phase 5: Final Cleanup
1. **Run `bun run dev`** and fix any remaining build errors
2. **Remove `src/` directory** (except seeders/scripts if needed)
3. **Update tsconfig** to remove `@/*` → `./src/*` path alias
4. **Commit** clean TanStack Start setup

## Immediate Action Items

1. Move services to `app/` namespace
2. Fix import paths in `app/components/` 
3. Update environment variable handling
4. Test build with `bun run dev`
5. Remove old Next.js artifacts