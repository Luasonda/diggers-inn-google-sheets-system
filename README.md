# Diggers Inn Restaurant & Pub — Google Sheets Inventory & Operations System

## Files
- `Diggers_Inn_Google_Sheets_System.xlsx` — ready-to-import Google Sheets workbook
- `generate_diggers_inn_workbook.js` — generator script used to build the workbook

## Required Tabs
1. **Dashboard**
2. **Inventory Master**
3. **Daily Stock Count**
4. **Sales Log**
5. **Purchases**
6. **Reports**
7. **Lists** *(hidden helper tab for dropdowns)*

---

## 1) Dashboard
### Purpose
Simple management view for daily control.

### KPI cards
- Today Sales
- This Week Sales
- Stock Value
- Low Stock Items
- Variance / Losses Today
- Gross Profit Estimate
- Today Transactions
- Reorder Value

### Dashboard blocks
- **Low Stock List** — items flagged `REORDER`
- **Top Selling Products** — top 5 by quantity sold
- **7-Day Sales Data** — daily sales summary for quick charting

### Main formulas
- Today Sales  
  `=SUMIFS('Sales Log'!F:F,'Sales Log'!A:A,TODAY())`
- This Week Sales  
  `=SUMIFS('Sales Log'!F:F,'Sales Log'!A:A,">="&TODAY()-WEEKDAY(TODAY(),2)+1,'Sales Log'!A:A,"<="&TODAY())`
- Stock Value  
  `=SUMPRODUCT('Inventory Master'!J3:J300,'Inventory Master'!D3:D300)`
- Low Stock Items  
  `=COUNTIF('Inventory Master'!L3:L300,"REORDER")`
- Variance / Losses Today  
  `=SUMIFS('Daily Stock Count'!I:I,'Daily Stock Count'!A:A,TODAY())`
- Gross Profit Estimate  
  `=SUMPRODUCT('Sales Log'!D3:D2000,IFNA(VLOOKUP('Sales Log'!C3:C2000,'Inventory Master'!A3:E300,5,FALSE)-VLOOKUP('Sales Log'!C3:C2000,'Inventory Master'!A3:E300,4,FALSE),0))`

---

## 2) Inventory Master
### Columns
`Item Name | Category | Unit | Cost Price | Sell Price | Opening Stock | Purchases | Sales | Wastage | Current Stock | Reorder Level | Status`

### Staff inputs
- Item Name
- Category
- Unit
- Cost Price
- Sell Price
- Opening Stock
- Reorder Level

### Auto formulas
- Purchases  
  `=SUMIFS(Purchases!D:D,Purchases!C:C,$A3)`
- Sales  
  `=SUMIFS('Sales Log'!D:D,'Sales Log'!C:C,$A3)`
- Wastage  
  `=SUMIFS('Daily Stock Count'!F:F,'Daily Stock Count'!B:B,$A3)`
- Current Stock  
  `=F3+G3-H3-I3`
- Status  
  `=IF(J3<=K3,"REORDER","OK")`

---

## 3) Daily Stock Count
### Columns
`Date | Item | Opening | Added | Sold | Wastage | Closing Physical Count | Expected Closing | Variance`

### Staff inputs
- Date
- Item
- Wastage
- Closing Physical Count

### Auto formulas
- Opening  
  pulls prior physical count for same item, or opening stock from Inventory Master
- Added  
  `=SUMIFS(Purchases!D:D,Purchases!A:A,$A3,Purchases!C:C,$B3)`
- Sold  
  `=SUMIFS('Sales Log'!D:D,'Sales Log'!A:A,$A3,'Sales Log'!C:C,$B3)`
- Expected Closing  
  `=C3+D3-E3-F3`
- Variance  
  `=H3-G3`

### Meaning of variance
- **Positive** = shortage / possible theft / undercount
- **Negative** = extra stock / overcount / entry issue

---

## 4) Sales Log
### Columns
`Date | Waiter | Item | Qty | Unit Price | Total | Payment Method`

### Staff inputs
- Date
- Waiter
- Item
- Qty
- Payment Method

### Auto formulas
- Unit Price  
  `=IFERROR(VLOOKUP(C3,'Inventory Master'!A3:L300,5,FALSE),0)`
- Total  
  `=D3*E3`

---

## 5) Purchases
### Columns
`Date | Supplier | Item | Qty | Unit Cost | Total Cost`

### Staff inputs
- Date
- Supplier
- Item
- Qty

### Auto formulas
- Unit Cost  
  `=IFERROR(VLOOKUP(C3,'Inventory Master'!A3:L300,4,FALSE),0)`
- Total Cost  
  `=D3*E3`

---

## 6) Reports
### Auto-generated summaries
- Daily Sales Summary
- Weekly Sales Summary
- Monthly Sales Summary
- Variance Summary

### Key formulas
- Daily summary  
  `=QUERY({'Sales Log'!A3:A2000,'Sales Log'!F3:F2000},"select Col1,sum(Col2) where Col1 is not null group by Col1 order by Col1 desc label Col1 'Date', sum(Col2) 'Sales Total'",0)`
- Weekly summary  
  `=QUERY({ARRAYFORMULA('Sales Log'!A3:A2000-WEEKDAY('Sales Log'!A3:A2000,2)+1),'Sales Log'!F3:F2000},"select Col1,sum(Col2) where Col1 is not null group by Col1 order by Col1 desc label Col1 'Week Starting', sum(Col2) 'Sales Total'",0)`
- Monthly summary  
  `=QUERY({TEXT('Sales Log'!A3:A2000,"YYYY-MM"),'Sales Log'!F3:F2000},"select Col1,sum(Col2) where Col1 is not null group by Col1 order by Col1 desc label Col1 'Month', sum(Col2) 'Sales Total'",0)`
- Variance summary  
  `=QUERY({'Daily Stock Count'!A3:A1000,'Daily Stock Count'!B3:B1000,'Daily Stock Count'!I3:I1000},"select Col1,Col2,Col3 where Col1 is not null and Col3 <> 0 order by Col1 desc label Col1 'Date', Col2 'Item', Col3 'Variance'",0)`

---

## Theme / Design Choices
- **Dark green** headers and section bars
- **Gold accents** for premium pub feel
- **White header text**
- **Cream input cells** = staff should type here
- **Grey formula cells** = leave alone
- Alternating row colours for readability
- Conditional formatting for:
  - `REORDER` items
  - non-zero stock variances

---

## Google Sheets Setup Instructions
1. Open Google Drive.
2. Click **New → File upload**.
3. Upload `Diggers_Inn_Google_Sheets_System.xlsx`.
4. Right-click the uploaded file.
5. Choose **Open with → Google Sheets**.
6. In Google Sheets, rename the live file if needed.
7. Protect key ranges again inside Google Sheets if you want stronger in-app permissions:
   - Data → Protect sheets and ranges
8. Add real items in **Inventory Master** first.
9. Then use:
   - **Sales Log** every time sales happen
   - **Purchases** when stock arrives
   - **Daily Stock Count** at closing time
10. Confirm dashboard numbers update correctly.

---

## Best UX Improvements for Low-Skill Staff
1. **Only type in cream cells** — easiest training rule.
2. **Use dropdowns everywhere possible** — reduces spelling mistakes.
3. **Enter Inventory Master first** — avoids broken lookups.
4. **Use one row per sale item** — simple and consistent.
5. **Do physical count once per day** — ideally at closing.
6. **Protect formula columns** — staff should not edit grey cells.
7. **Freeze header rows** — already built in.
8. **Use short product names** on phones.
9. **Pin the Dashboard** as the opening tab for management.
10. **Print a one-page cheat sheet** with 3 rules:
   - Log sales
   - Log purchases
   - Count stock daily

---

## Recommended Google Sheets Protections
Protect these columns:
- **Inventory Master:** G:L
- **Daily Stock Count:** C:E, H:I
- **Sales Log:** E:F
- **Purchases:** E:F

---

## Recommended Staff Workflow
### Start of setup
1. Fill Inventory Master
2. Set reorder levels
3. Test one fake sale, one fake purchase, one stock count
4. Confirm Dashboard updates

### Daily use
1. Waiters or cashier log sales in **Sales Log**
2. Manager/store person logs supplier deliveries in **Purchases**
3. Closing supervisor completes **Daily Stock Count**
4. Owner/manager checks **Dashboard** and **Reports**

---

## Optional Improvements Later
Keep phase 2 simple if needed:
- waiter performance summary
- recipe / ingredient-level stock deduction
- category profit view
- Google Forms for mobile entry
- Apps Script alerts to WhatsApp/email for low stock

---

## GitHub
This package is ready to push to GitHub once the target repository name/privacy is confirmed.
