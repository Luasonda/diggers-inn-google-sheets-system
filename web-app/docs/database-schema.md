# Database schema notes

## Core tables
- `users`
- `products`
- `liquor_profiles`
- `locations`
- `stock_sessions`
- `stock_session_items`
- `stock_issues`
- `purchases`
- `stock_adjustments`
- `audit_logs`

## Why this shape

### Products vs liquor_profiles
Not every product needs weight-based logic. Splitting liquor-specific fields into `liquor_profiles` keeps the base product table clean.

### stock_sessions
Each location gets one session per business date. That mirrors the daily Excel rhythm without cloning worksheets forever.

### stock_session_items
This stores the per-item daily operational state:
- opening count
- issued quantity
- closing count
- expected closing
- actual closing
- variance

### stock_issues
Issues are separate events because they should have their own audit trail and may happen multiple times during the day.

### stock_adjustments
Manual corrections should be explicit, rare, and reviewable.

## Permission intent

### Bartender
Allowed:
- read active sessions
- write opening counts
- write issues/receipts relevant to the bar flow
- write closing counts

Blocked from:
- products
- users
- adjustments
- management reports configuration
- historical edits after lock

## Next implementation step
Use Supabase Row Level Security or server-side role checks so UI limits are not the only protection.
