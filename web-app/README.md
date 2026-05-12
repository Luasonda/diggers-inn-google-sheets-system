# Diggers Stock Web App

Initial Next.js scaffold for the Diggers Bar & Restaurant stock-control system.

## Current scope
- dashboard shell
- products screen
- stock sessions
- opening and closing count screens
- issue entry form
- reports placeholder
- login placeholder
- health endpoint
- setup status page
- database schema SQL
- Zod validation schemas
- role/permission guard scaffolding
- Supabase-ready API routes with demo fallback

## Business rule locked in
Bartenders must only be allowed to:
- opening stock count
- issuing
- closing stock count

## Current schema/auth files
- `db/schema.sql`
- `docs/database-schema.md`
- `lib/auth.ts`
- `lib/rbac.ts`
- `lib/validation.ts`
- `middleware.ts`

## Suggested next implementation steps
1. Create a Supabase project and add the keys to Vercel env vars
2. Apply `db/schema.sql` to the database
3. Replace demo role switching with real login/session auth
4. Swap sample UUIDs for real session/product/user records
5. Port the liquor weight formulas into server-side logic
6. Add audit logging and session locking

## Local run
```bash
npm install
npm run dev
```
