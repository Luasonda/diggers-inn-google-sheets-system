export const kpis = [
  { label: "Today's Variances", value: '4', note: '2 require review' },
  { label: 'Low Stock Items', value: '11', note: '3 urgent reorder' },
  { label: 'Open Sessions', value: '1', note: 'Main bar only' },
  { label: 'Stock Issued Today', value: '29', note: 'bottles / units' },
];

export const lowStockItems = [
  { item: 'Castle Lite 330ml', category: 'Beer', status: 'Reorder', balance: 8 },
  { item: 'Olmeca Gold', category: 'Tequila', status: 'Critical', balance: 1 },
  { item: 'Coca-Cola 500ml', category: 'Soft Drinks', status: 'Reorder', balance: 12 },
];

export const sessions = [
  { date: '2026-05-12', bar: 'Main Bar', status: 'Open', openedBy: 'Brian', closedBy: '—' },
  { date: '2026-05-11', bar: 'Main Bar', status: 'Locked', openedBy: 'Teddy', closedBy: 'Manager' },
];

export const products = [
  { name: 'J&B Rare', category: 'Whiskey', unit: '750ml bottle', type: 'liquor_weighted', reorder: 4 },
  { name: 'Coca-Cola', category: 'Soft Drinks', unit: '500ml bottle', type: 'simple_unit', reorder: 24 },
  { name: 'Mosi Lager', category: 'Beer', unit: '330ml bottle', type: 'full_bottle', reorder: 36 },
];

export const bartenderPermissions = [
  'Opening stock count',
  'Issuing',
  'Closing stock count',
];
