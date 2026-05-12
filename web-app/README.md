# Diggers Stock Web App

Initial Next.js scaffold for the Diggers Bar & Restaurant stock-control system.

## Current scope
- dashboard shell
- products screen
- stock sessions
- issue entry form
- reports placeholder
- login placeholder
- health endpoint
- database schema SQL
- Zod validation schemas
- role/permission guard scaffolding

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
1. Add Supabase project + environment variables
2. Apply `db/schema.sql` to the database
3. Replace demo role switching with real login/session auth
4. Build opening-count and closing-count item-entry screens
5. Port the liquor weight formulas into server-side logic
6. Add audit logging and session locking

## Local run
```bash
npm install
npm run dev
```
