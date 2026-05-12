import { insertDemoRecord, listDemoRecords } from '@/lib/demo-store';
import { hasSupabaseEnv } from '@/lib/env';
import { getSupabaseAdmin } from '@/lib/supabase';
import { stockCountLineSchema, stockIssueSchema } from '@/lib/validation';

export async function createOpeningCount(payload: unknown) {
  const data = stockCountLineSchema.parse(payload);

  if (!hasSupabaseEnv()) {
    return { mode: 'demo', record: insertDemoRecord('openingCounts', data as unknown as Record<string, unknown>) };
  }

  const supabase = getSupabaseAdmin();
  const { data: result, error } = await supabase.from('stock_session_items').upsert({
    session_id: data.sessionId,
    product_id: data.productId,
    opening_full_bottles: data.openingFullBottles ?? 0,
    opening_gross_weight_g: data.openingGrossWeightG ?? 0,
    issued_qty: data.issuedQty ?? 0,
    notes: data.notes ?? null,
  }, { onConflict: 'session_id,product_id' }).select().single();

  if (error) throw error;
  return { mode: 'supabase', record: result };
}

export async function createClosingCount(payload: unknown) {
  const data = stockCountLineSchema.parse(payload);

  if (!hasSupabaseEnv()) {
    return { mode: 'demo', record: insertDemoRecord('closingCounts', data as unknown as Record<string, unknown>) };
  }

  const supabase = getSupabaseAdmin();
  const { data: result, error } = await supabase.from('stock_session_items').upsert({
    session_id: data.sessionId,
    product_id: data.productId,
    closing_full_bottles: data.closingFullBottles ?? 0,
    closing_gross_weight_g: data.closingGrossWeightG ?? 0,
    notes: data.notes ?? null,
  }, { onConflict: 'session_id,product_id' }).select().single();

  if (error) throw error;
  return { mode: 'supabase', record: result };
}

export async function createStockIssue(payload: unknown) {
  const data = stockIssueSchema.parse(payload);

  if (!hasSupabaseEnv()) {
    return { mode: 'demo', record: insertDemoRecord('stockIssues', data as unknown as Record<string, unknown>) };
  }

  const supabase = getSupabaseAdmin();
  const { data: result, error } = await supabase.from('stock_issues').insert({
    session_id: data.sessionId ?? null,
    product_id: data.productId,
    quantity: data.quantity,
    issue_date: data.issueDate,
    issued_by_user_id: data.issuedByUserId,
    received_by_user_id: data.receivedByUserId,
    notes: data.notes ?? null,
  }).select().single();

  if (error) throw error;
  return { mode: 'supabase', record: result };
}

export function getDemoRecentActivity() {
  return {
    openingCounts: listDemoRecords('openingCounts'),
    closingCounts: listDemoRecords('closingCounts'),
    stockIssues: listDemoRecords('stockIssues'),
  };
}
