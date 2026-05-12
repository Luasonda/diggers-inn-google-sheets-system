import { hasSupabaseEnv } from '@/lib/env';
import { getSupabaseAdmin } from '@/lib/supabase';
import { lowStockItems as fallbackLowStock, products as fallbackProducts, sessions as fallbackSessions } from '@/lib/mock-data';
import { getDemoRecentActivity } from '@/lib/stock-service';

export async function getProducts() {
  if (!hasSupabaseEnv()) return fallbackProducts;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('products')
    .select('id, name, category, unit, stock_type, reorder_level, active, cost_price, sell_price')
    .order('name');
  if (error || !data) return fallbackProducts;
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    unit: row.unit,
    type: row.stock_type,
    reorder: Number(row.reorder_level ?? 0),
    active: row.active,
    costPrice: Number(row.cost_price ?? 0),
    sellPrice: Number(row.sell_price ?? 0),
  }));
}

export async function getSessions() {
  if (!hasSupabaseEnv()) return fallbackSessions;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('stock_sessions')
    .select(`
      id,
      business_date,
      status,
      notes,
      locations(name),
      opener:opened_by_user_id(full_name),
      closer:closed_by_user_id(full_name)
    `)
    .order('business_date', { ascending: false })
    .limit(20);
  if (error || !data) return fallbackSessions;
  return data.map((row: any) => ({
    id: row.id,
    date: row.business_date,
    bar: row.locations?.name ?? '—',
    status: row.status,
    openedBy: row.opener?.full_name ?? '—',
    closedBy: row.closer?.full_name ?? '—',
    notes: row.notes ?? '',
  }));
}

export async function getRecentIssues() {
  if (!hasSupabaseEnv()) return getDemoRecentActivity().stockIssues.map((item) => item.payload);
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('stock_issues')
    .select(`
      id,
      issue_date,
      quantity,
      notes,
      products(name),
      issued_by:issued_by_user_id(full_name),
      received_by:received_by_user_id(full_name)
    `)
    .order('issue_date', { ascending: false })
    .limit(20);
  if (error || !data) return [];
  return data.map((row: any) => ({
    id: row.id,
    issueDate: row.issue_date,
    quantity: row.quantity,
    notes: row.notes,
    productName: row.products?.name ?? '—',
    issuedBy: row.issued_by?.full_name ?? '—',
    receivedBy: row.received_by?.full_name ?? '—',
  }));
}

export async function getRecentCounts() {
  if (!hasSupabaseEnv()) return getDemoRecentActivity();
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('stock_session_items')
    .select(`
      id,
      opening_full_bottles,
      opening_gross_weight_g,
      closing_full_bottles,
      closing_gross_weight_g,
      notes,
      updated_at,
      products(name),
      stock_sessions(business_date)
    `)
    .order('updated_at', { ascending: false })
    .limit(20);
  if (error || !data) return { openingCounts: [], closingCounts: [], stockIssues: [] };
  return {
    openingCounts: data
      .filter((row: any) => Number(row.opening_full_bottles ?? 0) > 0 || Number(row.opening_gross_weight_g ?? 0) > 0)
      .map((row: any) => ({
        id: row.id,
        businessDate: row.stock_sessions?.business_date,
        item: row.products?.name ?? '—',
        openingFullBottles: row.opening_full_bottles,
        openingGrossWeightG: row.opening_gross_weight_g,
        notes: row.notes,
        updatedAt: row.updated_at,
      })),
    closingCounts: data
      .filter((row: any) => Number(row.closing_full_bottles ?? 0) > 0 || Number(row.closing_gross_weight_g ?? 0) > 0)
      .map((row: any) => ({
        id: row.id,
        businessDate: row.stock_sessions?.business_date,
        item: row.products?.name ?? '—',
        closingFullBottles: row.closing_full_bottles,
        closingGrossWeightG: row.closing_gross_weight_g,
        notes: row.notes,
        updatedAt: row.updated_at,
      })),
    stockIssues: await getRecentIssues(),
  };
}

export async function getDashboardSummary() {
  const products = await getProducts();
  const sessions = await getSessions();
  const activity = await getRecentCounts();
  const lowStock = products
    .filter((product: any) => product.reorder > 0)
    .slice(0, 5)
    .map((product: any) => ({
      item: product.name,
      category: product.category,
      status: 'Tracked',
      balance: product.reorder,
    }));

  return {
    kpis: [
      { label: 'Products', value: String(products.length), note: 'Live catalog rows' },
      { label: 'Sessions', value: String(sessions.length), note: 'Recent stock sessions' },
      { label: 'Opening Counts', value: String(activity.openingCounts.length), note: 'Recent saved entries' },
      { label: 'Stock Issues', value: String(activity.stockIssues.length), note: 'Recent saved issues' },
    ],
    lowStock: lowStock.length ? lowStock : fallbackLowStock,
  };
}
