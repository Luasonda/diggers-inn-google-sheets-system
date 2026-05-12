# Diggers Bar & Restaurant — Stock Control Web App MVP

## What the Excel workbook is doing
The workbook is a daily bar stock-control system with two main stock methods:

1. **Bottle stock count**
   - Opening stock count
   - Stock issued from stores (AM/PM)
   - Closing stock count
   - Computed expected stock
   - Shortage / variance

2. **Liquor stock count**
   - Tracks full bottles plus partial bottles by weight
   - Converts bottle weight into net content, shots, and ml
   - Calculates depletion vs transfers/issues
   - Compares expected vs actual closing quantity

## Main problems with the current Excel approach
- One pair of sheets per day/month creates duplication
- Staff can accidentally break formulas
- No proper role-based access
- Hard to audit who changed what
- Hard to get clean historical reporting
- Manual entry errors create negative/invalid values
- Liquor calculations are too fragile in spreadsheets

## MVP goal
Build a web app that replaces the daily Excel workflow with controlled forms, automated calculations, role-based access, and reports.

## Core user roles

### 1) Admin / Manager
Can:
- manage products
- manage bottle profiles and empty/full bottle weights
- view all reports
- approve stock adjustments
- manage users and roles
- see variances, shortages, and audit logs

### 2) Storekeeper
Can:
- record stock purchases/receipts
- issue stock to the bar
- view stock balances
- view issue history

### 3) Bartender
Must be limited to only:
- opening stock count
- issuing acknowledgement / bar issue entries (depending on workflow)
- closing stock count

Bartenders should **not** edit:
- product master
- bottle profiles
- prices
- reports configuration
- historic locked records
- user accounts
- stock adjustments

## Recommended MVP modules

### A. Authentication & Roles
- email/password login
- role-based permissions
- branch/location support later if needed

### B. Product Master
Fields:
- item name
- category
- unit
- stock type (`full_bottle`, `liquor_weighted`, `simple_unit`)
- cost price
- selling price
- reorder level
- active/inactive

### C. Liquor Bottle Profile
For weighted liquor items:
- bottle size ml
- shot size ml
- full bottle weight grams
- empty bottle weight grams
- computed net content grams
- optional tolerance threshold

### D. Daily Stock Session
Each day should have a single stock session:
- business date
- shift (optional later)
- opened by
- closed by
- status (`draft`, `open`, `submitted`, `locked`)

### E. Opening Count Entry
Bartender enters:
- opening full bottle count or unit count
- opening gross weight for partial liquor bottles where needed

System computes:
- opening net weight
- opening shots
- opening ml

### F. Stock Issue Entry
Storekeeper/manager records stock issued to bar:
- date/time
- item
- quantity issued
- destination bar
- issued by
- received by

System links issues into the day’s stock session automatically.

### G. Closing Count Entry
Bartender enters:
- closing full bottle count or unit count
- closing gross weight for partial liquor bottles

System computes:
- expected closing stock
- actual closing stock
- variance / shortage
- depletion in shots/ml

### H. Variance Dashboard
Manager sees:
- today’s shortages
- items with biggest variance
- low-stock items
- items needing reorder
- unresolved anomalies

### I. Reports
MVP reports:
- daily stock variance report
- issues by date/item
- low stock report
- product movement history
- liquor depletion report

### J. Audit Log
Track:
- who created/edited counts
- who issued stock
- who locked a day
- manual adjustments with reason

## Suggested data model

### users
- id
- name
- email
- role
- password_hash
- active

### products
- id
- name
- category
- unit
- stock_type
- cost_price
- sell_price
- reorder_level
- active

### liquor_profiles
- id
- product_id
- bottle_ml
- shot_ml
- full_bottle_weight_g
- empty_bottle_weight_g
- tolerance_shots

### stock_sessions
- id
- business_date
- status
- opened_by
- closed_by
- locked_by
- locked_at

### stock_session_items
- id
- session_id
- product_id
- opening_full_bottles
- opening_gross_weight_g
- opening_computed_shots
- issued_qty
- closing_full_bottles
- closing_gross_weight_g
- closing_computed_shots
- expected_closing_qty
- actual_closing_qty
- variance_qty
- variance_value
- notes

### stock_issues
- id
- issue_date
- product_id
- qty
- issued_by
- received_by
- session_id (nullable)
- notes

### purchases
- id
- purchase_date
- product_id
- qty
- unit_cost
- supplier
- recorded_by

### audit_logs
- id
- user_id
- action
- entity_type
- entity_id
- payload_json
- created_at

## Key business rules
- One product must have one stock method only
- Weighted-liquor products require a liquor profile
- Locked sessions cannot be edited except by admin
- Variances beyond tolerance should be flagged automatically
- Bartenders can only work on today’s active session
- Opening count should default from previous closing where appropriate
- Issues should increase expected stock for the current session

## Recommended tech stack

### Best fit for this project
- **Frontend:** Next.js
- **Backend:** Next.js server routes or Supabase
- **Database:** PostgreSQL (Supabase is fine)
- **Auth:** Supabase Auth or NextAuth
- **Hosting:** Vercel
- **Source control:** GitHub

## Why this stack
- good for forms + dashboards
- easy GitHub workflow
- easy deployment
- proper multi-user access
- cleaner than trying to force this into Google Sheets

## MVP screens
1. Login
2. Dashboard
3. Products
4. Daily Stock Session List
5. Opening Count Form
6. Stock Issues Form
7. Closing Count Form
8. Variance Report
9. Purchases
10. User Management (admin only)

## Build order

### Phase 1
- auth
- roles
- products
- liquor profiles
- stock sessions
- opening count
- issue entry
- closing count
- variance calculation

### Phase 2
- reports
- audit trail UI
- printable PDF reports
- mobile-first improvements
- WhatsApp/email alerts

## Non-negotiable permissions from Lua
Bartenders should be limited only to:
- opening stock count
- issuing
- closing stock counts

Everything else should be restricted.

## Recommendation
Start with a proper web app MVP instead of another spreadsheet layer. The Excel file is useful as a business-rules reference, but it should not remain the operating system.
