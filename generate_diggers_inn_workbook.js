const ExcelJS = require('exceljs');
const path = require('path');

const workbook = new ExcelJS.Workbook();
workbook.creator = 'OpenClaw';
workbook.lastModifiedBy = 'OpenClaw';
workbook.created = new Date();
workbook.modified = new Date();
workbook.calcProperties.fullCalcOnLoad = true;

const C = {
  darkGreen: '123524',
  green: '1F5A43',
  greenSoft: 'EAF4EE',
  gold: 'C9A227',
  goldSoft: 'F6EDC8',
  cream: 'FFF9E8',
  white: 'FFFFFF',
  text: '1F1F1F',
  grey: 'F3F4F6',
  red: 'B3261E',
  redSoft: 'FDECEC',
  border: 'D8C98E'
};

function styleCell(cell, opts = {}) {
  if (opts.font) cell.font = opts.font;
  if (opts.fill) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: opts.fill } };
  if (opts.alignment) cell.alignment = opts.alignment;
  if (opts.border) cell.border = opts.border;
  if (opts.numFmt) cell.numFmt = opts.numFmt;
  if (typeof opts.locked === 'boolean') cell.protection = { locked: opts.locked };
}

const thinBorder = {
  top: { style: 'thin', color: { argb: C.border } },
  left: { style: 'thin', color: { argb: C.border } },
  bottom: { style: 'thin', color: { argb: C.border } },
  right: { style: 'thin', color: { argb: C.border } }
};

const fonts = {
  title: { color: { argb: C.white }, bold: true, size: 16, name: 'Aptos' },
  header: { color: { argb: C.white }, bold: true, size: 11, name: 'Aptos' },
  sub: { color: { argb: C.gold }, bold: true, size: 12, name: 'Aptos' },
  body: { color: { argb: C.text }, size: 10, name: 'Aptos' },
  cardLabel: { color: { argb: C.darkGreen }, bold: true, size: 10, name: 'Aptos' },
  note: { color: { argb: C.darkGreen }, italic: true, size: 10, name: 'Aptos' },
  button: { color: { argb: C.white }, bold: true, size: 11, name: 'Aptos' }
};

function addTitle(ws, title, endCol) {
  ws.mergeCells(`A1:${endCol}1`);
  const c = ws.getCell('A1');
  c.value = title;
  styleCell(c, { font: fonts.title, fill: C.darkGreen, alignment: { vertical: 'middle', horizontal: 'left' } });
  ws.getRow(1).height = 24;
}

function addHeaderRow(ws, rowNum, headers) {
  const row = ws.getRow(rowNum);
  headers.forEach((h, i) => {
    const cell = row.getCell(i + 1);
    cell.value = h;
    styleCell(cell, { font: fonts.header, fill: C.darkGreen, alignment: { vertical: 'middle', horizontal: 'center' }, border: thinBorder, locked: true });
  });
  row.height = 22;
}

function stripeRows(ws, startRow, endRow, startCol, endCol) {
  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      const cell = ws.getRow(r).getCell(c);
      if (!cell.fill) {
        styleCell(cell, { fill: r % 2 === 0 ? C.cream : C.white, font: fonts.body, border: thinBorder, alignment: { vertical: 'middle' } });
      }
    }
    ws.getRow(r).height = 21;
  }
}

function setCols(ws, widths) {
  ws.columns = widths.map(w => ({ width: w }));
}

function addInputValidation(cell, formulae) {
  cell.dataValidation = {
    type: 'list',
    allowBlank: true,
    formulae: [formulae],
    showErrorMessage: true,
    errorStyle: 'warning',
    errorTitle: 'Choose from list',
    error: 'Please use the dropdown.'
  };
}

function lockSheet(ws) {
  return ws.protect('1234', {
    selectLockedCells: false,
    selectUnlockedCells: true,
    formatCells: false,
    formatColumns: false,
    formatRows: false,
    insertColumns: false,
    insertRows: false,
    deleteColumns: false,
    deleteRows: false,
    sort: false,
    autoFilter: true,
    pivotTables: false
  });
}

const dashboard = workbook.addWorksheet('Dashboard', { views: [{ showGridLines: false }] });
const inventory = workbook.addWorksheet('Inventory Master', { views: [{ state: 'frozen', ySplit: 2, showGridLines: false }] });
const count = workbook.addWorksheet('Daily Stock Count', { views: [{ state: 'frozen', ySplit: 2, showGridLines: false }] });
const sales = workbook.addWorksheet('Sales Log', { views: [{ state: 'frozen', ySplit: 2, showGridLines: false }] });
const purchases = workbook.addWorksheet('Purchases', { views: [{ state: 'frozen', ySplit: 2, showGridLines: false }] });
const reports = workbook.addWorksheet('Reports', { views: [{ state: 'frozen', ySplit: 2, showGridLines: false }] });
const lists = workbook.addWorksheet('Lists', { state: 'veryHidden' });

// Lists
[['A1','Categories'],['B1','Units'],['C1','Waiters'],['D1','Payment Methods'],['E1','Suppliers']].forEach(([ref, text]) => {
  const c = lists.getCell(ref);
  c.value = text;
  styleCell(c, { font: fonts.header, fill: C.darkGreen, border: thinBorder });
});
['Beer','Wine','Spirits','Soft Drink','Food','Mixer','Cleaning','Other'].forEach((v, i) => lists.getCell(`A${i+2}`).value = v);
['Bottle','Can','Case','Litre','ml','Plate','Pack','Kg','Piece'].forEach((v, i) => lists.getCell(`B${i+2}`).value = v);
['Waiter 1','Waiter 2','Waiter 3','Bar 1','Manager'].forEach((v, i) => lists.getCell(`C${i+2}`).value = v);
['Cash','Mobile Money','Card','Transfer','Credit'].forEach((v, i) => lists.getCell(`D${i+2}`).value = v);
['Default Supplier','Local Beverages','Fresh Foods','House Supplies'].forEach((v, i) => lists.getCell(`E${i+2}`).value = v);
setCols(lists, [18,18,18,18,22]);

// Dashboard
addTitle(dashboard, 'Diggers Inn Restaurant & Pub — Inventory & Operations Dashboard', 'L');
setCols(dashboard, [4,15,15,4,15,15,4,15,15,4,15,15]);
[
  ['B2:C2', 'Go to Inventory', '#\'Inventory Master\'!A1'],
  ['E2:F2', 'Daily Count', '#\'Daily Stock Count\'!A1'],
  ['H2:I2', 'Sales Log', '#\'Sales Log\'!A1'],
  ['K2:L2', 'Purchases', '#\'Purchases\'!A1']
].forEach(([range, text, link]) => {
  dashboard.mergeCells(range);
  const cell = dashboard.getCell(range.split(':')[0]);
  cell.value = text;
  cell.hyperlink = link;
  styleCell(cell, { font: fonts.button, fill: C.green, alignment: { horizontal: 'center', vertical: 'middle' }, border: thinBorder, locked: true });
});

const cards = [
  ['B4:C5', 'Today Sales', '=SUMIFS(\'Sales Log\'!$F:$F,\'Sales Log\'!$A:$A,TODAY())'],
  ['E4:F5', 'This Week Sales', '=SUMIFS(\'Sales Log\'!$F:$F,\'Sales Log\'!$A:$A,">="&TODAY()-WEEKDAY(TODAY(),2)+1,\'Sales Log\'!$A:$A,"<="&TODAY())'],
  ['H4:I5', 'Stock Value', '=SUMPRODUCT(\'Inventory Master\'!$J$3:$J$300,\'Inventory Master\'!$D$3:$D$300)'],
  ['K4:L5', 'Low Stock Items', '=COUNTIF(\'Inventory Master\'!$L$3:$L$300,"REORDER")'],
  ['B7:C8', 'Variance / Losses Today', '=SUMIFS(\'Daily Stock Count\'!$I:$I,\'Daily Stock Count\'!$A:$A,TODAY())'],
  ['E7:F8', 'Gross Profit Estimate', '=SUMPRODUCT(\'Sales Log\'!$D$3:$D$2000,IFNA(VLOOKUP(\'Sales Log\'!$C$3:$C$2000,\'Inventory Master\'!$A$3:$E$300,5,FALSE)-VLOOKUP(\'Sales Log\'!$C$3:$C$2000,\'Inventory Master\'!$A$3:$E$300,4,FALSE),0))'],
  ['H7:I8', 'Today Transactions', '=COUNTIFS(\'Sales Log\'!$A:$A,TODAY())'],
  ['K7:L8', 'Reorder Value', '=SUMPRODUCT((\'Inventory Master\'!$L$3:$L$300="REORDER")*(\'Inventory Master\'!$K$3:$K$300-\'Inventory Master\'!$J$3:$J$300)*\'Inventory Master\'!$D$3:$D$300)']
];
let helperCol = 2;
cards.forEach(([range, label, formula]) => {
  dashboard.mergeCells(range);
  const start = range.split(':')[0];
  const topLeft = dashboard.getCell(start);
  const helper = dashboard.getCell(30, helperCol++);
  helper.value = { formula: formula.slice(1) };
  helper.numFmt = '#,##0.00';
  topLeft.value = `${label}\n`;
  styleCell(topLeft, { font: fonts.cardLabel, fill: C.greenSoft, alignment: { horizontal: 'center', vertical: 'middle', wrapText: true }, border: thinBorder, locked: true });
  dashboard.getCell(start).note = `Formula: ${formula}`;
});
dashboard.getCell('A27').value = 'Tip: staff should only type in cream-coloured cells. Grey cells calculate automatically.';
styleCell(dashboard.getCell('A27'), { font: fonts.note, locked: true });
for (const rowNum of [4,5,7,8]) dashboard.getRow(rowNum).height = 28;

// KPI helper displays
[['B5','B30'],['E5','C30'],['H5','D30'],['K5','E30'],['B8','F30'],['E8','G30'],['H8','H30'],['K8','I30']].forEach(([target, source]) => {
  dashboard.getCell(target).value = { formula: `${source}` };
  styleCell(dashboard.getCell(target), { font: { color: { argb: C.darkGreen }, bold: true, size: 18, name: 'Aptos' }, fill: C.greenSoft, alignment: { horizontal: 'center', vertical: 'middle' }, border: thinBorder, numFmt: '#,##0.00', locked: true });
});

[['A11:D11','Low Stock List'],['F11:I11','Top Selling Products'],['J11:L11','7-Day Sales Data']].forEach(([range, title]) => {
  dashboard.mergeCells(range);
  const c = dashboard.getCell(range.split(':')[0]);
  c.value = title;
  styleCell(c, { font: fonts.sub, fill: C.green, alignment: { horizontal: 'center', vertical: 'middle' }, border: thinBorder, locked: true });
});
addHeaderRow(dashboard, 12, ['Item','Current Stock','Reorder Level','Status','','Item','Qty Sold','','','Date','Sales Total','']);
dashboard.getCell('A13').value = { formula: 'FILTER({\'Inventory Master\'!A3:A300,\'Inventory Master\'!J3:J300,\'Inventory Master\'!K3:K300,\'Inventory Master\'!L3:L300},\'Inventory Master\'!L3:L300="REORDER")' };
dashboard.getCell('F13').value = { formula: 'QUERY({\'Sales Log\'!C3:C2000,\'Sales Log\'!D3:D2000},"select Col1,sum(Col2) where Col1 is not null group by Col1 order by sum(Col2) desc limit 5 label Col1 \'Item\', sum(Col2) \'Qty Sold\'",0)' };
dashboard.getCell('J13').value = { formula: 'QUERY({\'Sales Log\'!A3:A2000,\'Sales Log\'!F3:F2000},"select Col1,sum(Col2) where Col1 is not null group by Col1 order by Col1 desc limit 7 label Col1 \'Date\', sum(Col2) \'Sales Total\'",0)' };

// Inventory Master
addTitle(inventory, 'Inventory Master', 'L');
setCols(inventory, [24,16,12,12,12,14,12,12,12,14,14,12]);
addHeaderRow(inventory, 2, ['Item Name','Category','Unit','Cost Price','Sell Price','Opening Stock','Purchases','Sales','Wastage','Current Stock','Reorder Level','Status']);
for (let r = 3; r <= 300; r++) {
  inventory.getCell(`G${r}`).value = { formula: `SUMIFS(Purchases!$D:$D,Purchases!$C:$C,$A${r})` };
  inventory.getCell(`H${r}`).value = { formula: `SUMIFS('Sales Log'!$D:$D,'Sales Log'!$C:$C,$A${r})` };
  inventory.getCell(`I${r}`).value = { formula: `SUMIFS('Daily Stock Count'!$F:$F,'Daily Stock Count'!$B:$B,$A${r})` };
  inventory.getCell(`J${r}`).value = { formula: `F${r}+G${r}-H${r}-I${r}` };
  inventory.getCell(`L${r}`).value = { formula: `IF(J${r}<=K${r},"REORDER","OK")` };
  ['D','E'].forEach(col => inventory.getCell(`${col}${r}`).numFmt = '#,##0.00');
  ['G','H','I','J'].forEach(col => inventory.getCell(`${col}${r}`).numFmt = '#,##0.00');
  ['A','B','C','D','E','F','K'].forEach(col => styleCell(inventory.getCell(`${col}${r}`), { locked: false, fill: C.cream, border: thinBorder, font: fonts.body }));
  ['G','H','I','J','L'].forEach(col => styleCell(inventory.getCell(`${col}${r}`), { locked: true, fill: C.grey, border: thinBorder, font: fonts.body }));
  addInputValidation(inventory.getCell(`B${r}`), 'Lists!$A$2:$A$20');
  addInputValidation(inventory.getCell(`C${r}`), 'Lists!$B$2:$B$20');
}
stripeRows(inventory, 3, 300, 1, 12);
inventory.addConditionalFormatting({ ref: 'L3:L300', rules: [{ type: 'containsText', operator: 'containsText', text: 'REORDER', style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: C.redSoft }, fgColor: { argb: C.redSoft } }, font: { color: { argb: C.red }, bold: true } } }] });

// Daily Stock Count
addTitle(count, 'Daily Stock Count', 'I');
setCols(count, [13,24,12,12,12,12,20,16,12]);
addHeaderRow(count, 2, ['Date','Item','Opening','Added','Sold','Wastage','Closing Physical Count','Expected Closing','Variance']);
for (let r = 3; r <= 1000; r++) {
  const openingFormula = r === 3
    ? `IFERROR(VLOOKUP(B${r},'Inventory Master'!$A$3:$L$300,6,FALSE),0)`
    : `IFERROR(LOOKUP(2,1/(($B$3:$B${r-1}=B${r})*($A$3:$A${r-1}<A${r})),$G$3:$G${r-1}),IFERROR(VLOOKUP(B${r},'Inventory Master'!$A$3:$L$300,6,FALSE),0))`;
  count.getCell(`C${r}`).value = { formula: openingFormula };
  count.getCell(`D${r}`).value = { formula: `SUMIFS(Purchases!$D:$D,Purchases!$A:$A,$A${r},Purchases!$C:$C,$B${r})` };
  count.getCell(`E${r}`).value = { formula: `SUMIFS('Sales Log'!$D:$D,'Sales Log'!$A:$A,$A${r},'Sales Log'!$C:$C,$B${r})` };
  count.getCell(`H${r}`).value = { formula: `C${r}+D${r}-E${r}-F${r}` };
  count.getCell(`I${r}`).value = { formula: `H${r}-G${r}` };
  ['A','B','F','G'].forEach(col => styleCell(count.getCell(`${col}${r}`), { locked: false, fill: C.cream, border: thinBorder, font: fonts.body }));
  ['C','D','E','H','I'].forEach(col => styleCell(count.getCell(`${col}${r}`), { locked: true, fill: C.grey, border: thinBorder, font: fonts.body }));
  addInputValidation(count.getCell(`B${r}`), `'Inventory Master'!$A$3:$A$300`);
}
stripeRows(count, 3, 1000, 1, 9);
count.addConditionalFormatting({ ref: 'I3:I1000', rules: [{ type: 'cellIs', operator: 'notEqual', formulae: ['0'], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: C.goldSoft }, fgColor: { argb: C.goldSoft } }, font: { color: { argb: C.red }, bold: true } } }] });

// Sales Log
addTitle(sales, 'Sales Log', 'G');
setCols(sales, [13,16,24,10,12,12,16]);
addHeaderRow(sales, 2, ['Date','Waiter','Item','Qty','Unit Price','Total','Payment Method']);
for (let r = 3; r <= 2000; r++) {
  sales.getCell(`E${r}`).value = { formula: `IFERROR(VLOOKUP(C${r},'Inventory Master'!$A$3:$L$300,5,FALSE),0)` };
  sales.getCell(`F${r}`).value = { formula: `D${r}*E${r}` };
  ['E','F'].forEach(col => sales.getCell(`${col}${r}`).numFmt = '#,##0.00');
  ['A','B','C','D','G'].forEach(col => styleCell(sales.getCell(`${col}${r}`), { locked: false, fill: C.cream, border: thinBorder, font: fonts.body }));
  ['E','F'].forEach(col => styleCell(sales.getCell(`${col}${r}`), { locked: true, fill: C.grey, border: thinBorder, font: fonts.body }));
  addInputValidation(sales.getCell(`B${r}`), 'Lists!$C$2:$C$20');
  addInputValidation(sales.getCell(`C${r}`), `'Inventory Master'!$A$3:$A$300`);
  addInputValidation(sales.getCell(`G${r}`), 'Lists!$D$2:$D$20');
}
stripeRows(sales, 3, 2000, 1, 7);

// Purchases
addTitle(purchases, 'Purchases', 'F');
setCols(purchases, [13,20,24,10,12,14]);
addHeaderRow(purchases, 2, ['Date','Supplier','Item','Qty','Unit Cost','Total Cost']);
for (let r = 3; r <= 1500; r++) {
  purchases.getCell(`E${r}`).value = { formula: `IFERROR(VLOOKUP(C${r},'Inventory Master'!$A$3:$L$300,4,FALSE),0)` };
  purchases.getCell(`F${r}`).value = { formula: `D${r}*E${r}` };
  ['E','F'].forEach(col => purchases.getCell(`${col}${r}`).numFmt = '#,##0.00');
  ['A','B','C','D'].forEach(col => styleCell(purchases.getCell(`${col}${r}`), { locked: false, fill: C.cream, border: thinBorder, font: fonts.body }));
  ['E','F'].forEach(col => styleCell(purchases.getCell(`${col}${r}`), { locked: true, fill: C.grey, border: thinBorder, font: fonts.body }));
  addInputValidation(purchases.getCell(`B${r}`), 'Lists!$E$2:$E$20');
  addInputValidation(purchases.getCell(`C${r}`), `'Inventory Master'!$A$3:$A$300`);
}
stripeRows(purchases, 3, 1500, 1, 6);

// Reports
addTitle(reports, 'Reports', 'J');
setCols(reports, [16,14,14,4,16,18,14,4,12,12]);
[['A3:C3','Daily Sales Summary'],['E3:G3','Weekly Sales Summary'],['A20:C20','Monthly Sales Summary'],['E20:G20','Variance Summary']].forEach(([range, title]) => {
  reports.mergeCells(range);
  const c = reports.getCell(range.split(':')[0]);
  c.value = title;
  styleCell(c, { font: fonts.sub, fill: C.green, alignment: { horizontal: 'center', vertical: 'middle' }, border: thinBorder, locked: true });
});
reports.getCell('A4').value = { formula: 'QUERY({\'Sales Log\'!A3:A2000,\'Sales Log\'!F3:F2000},"select Col1,sum(Col2) where Col1 is not null group by Col1 order by Col1 desc label Col1 \'Date\', sum(Col2) \'Sales Total\'",0)' };
reports.getCell('E4').value = { formula: 'QUERY({ARRAYFORMULA(\'Sales Log\'!A3:A2000-WEEKDAY(\'Sales Log\'!A3:A2000,2)+1),\'Sales Log\'!F3:F2000},"select Col1,sum(Col2) where Col1 is not null group by Col1 order by Col1 desc label Col1 \'Week Starting\', sum(Col2) \'Sales Total\'",0)' };
reports.getCell('A21').value = { formula: 'QUERY({TEXT(\'Sales Log\'!A3:A2000,"YYYY-MM"),\'Sales Log\'!F3:F2000},"select Col1,sum(Col2) where Col1 is not null group by Col1 order by Col1 desc label Col1 \'Month\', sum(Col2) \'Sales Total\'",0)' };
reports.getCell('E21').value = { formula: 'QUERY({\'Daily Stock Count\'!A3:A1000,\'Daily Stock Count\'!B3:B1000,\'Daily Stock Count\'!I3:I1000},"select Col1,Col2,Col3 where Col1 is not null and Col3 <> 0 order by Col1 desc label Col1 \'Date\', Col2 \'Item\', Col3 \'Variance\'",0)' };
reports.getCell('A40').value = 'If Google Sheets does not import charts, insert charts from the prepared summary blocks in this tab and Dashboard.';
styleCell(reports.getCell('A40'), { font: fonts.note, locked: true });

// Cell comments / notes for staff
inventory.getCell('A3').note = 'Enter each product once. Example: Mosi Lager 330ml.';
count.getCell('G3').note = 'Type the physical count after checking the shelf or store room.';
sales.getCell('D3').note = 'Enter quantity sold only. Price fills automatically.';
purchases.getCell('D3').note = 'Enter quantity received from supplier.';

async function finish() {
  for (const ws of [dashboard, inventory, count, sales, purchases, reports]) {
    await lockSheet(ws);
  }
  const out = path.join('/home/lua-sonda/.openclaw/workspace/outputs/diggers-inn-sheets-system', 'Diggers_Inn_Google_Sheets_System.xlsx');
  await workbook.xlsx.writeFile(out);
  console.log(out);
}

finish().catch(err => {
  console.error(err);
  process.exit(1);
});
