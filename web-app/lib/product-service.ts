import { productSchema, liquorProfileSchema } from '@/lib/validation';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function listProductsDetailed() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      category,
      unit,
      stock_type,
      cost_price,
      sell_price,
      reorder_level,
      active,
      liquor_profiles(
        bottle_ml,
        shot_ml,
        full_bottle_weight_g,
        empty_bottle_weight_g,
        tolerance_shots
      )
    `)
    .order('name');
  if (error) throw error;
  return data ?? [];
}

type ProductInput = {
  id?: string;
  name: string;
  category: string;
  unit: string;
  stockType: 'full_bottle' | 'liquor_weighted' | 'simple_unit';
  costPrice: number;
  sellPrice: number;
  reorderLevel: number;
  active?: boolean;
  liquorProfile?: {
    bottleMl: number;
    shotMl: number;
    fullBottleWeightG: number;
    emptyBottleWeightG: number;
    toleranceShots: number;
  } | null;
};

export async function createProduct(input: ProductInput) {
  const supabase = getSupabaseAdmin();
  const parsed = productSchema.parse({
    name: input.name,
    category: input.category,
    unit: input.unit,
    stockType: input.stockType,
    costPrice: input.costPrice,
    sellPrice: input.sellPrice,
    reorderLevel: input.reorderLevel,
    active: input.active ?? true,
  });

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      name: parsed.name,
      category: parsed.category,
      unit: parsed.unit,
      stock_type: parsed.stockType,
      cost_price: parsed.costPrice,
      sell_price: parsed.sellPrice,
      reorder_level: parsed.reorderLevel,
      active: parsed.active,
    })
    .select('id, name, category, unit, stock_type, cost_price, sell_price, reorder_level, active')
    .single();
  if (error || !product) throw error ?? new Error('Failed to create product');

  if (parsed.stockType === 'liquor_weighted' && input.liquorProfile) {
    const lp = liquorProfileSchema.parse({
      productId: product.id,
      bottleMl: input.liquorProfile.bottleMl,
      shotMl: input.liquorProfile.shotMl,
      fullBottleWeightG: input.liquorProfile.fullBottleWeightG,
      emptyBottleWeightG: input.liquorProfile.emptyBottleWeightG,
      toleranceShots: input.liquorProfile.toleranceShots,
    });
    const { error: liquorError } = await supabase.from('liquor_profiles').upsert({
      product_id: lp.productId,
      bottle_ml: lp.bottleMl,
      shot_ml: lp.shotMl,
      full_bottle_weight_g: lp.fullBottleWeightG,
      empty_bottle_weight_g: lp.emptyBottleWeightG,
      tolerance_shots: lp.toleranceShots,
    });
    if (liquorError) throw liquorError;
  }

  return product;
}

export async function updateProduct(input: ProductInput & { id: string }) {
  const supabase = getSupabaseAdmin();
  const parsed = productSchema.parse({
    name: input.name,
    category: input.category,
    unit: input.unit,
    stockType: input.stockType,
    costPrice: input.costPrice,
    sellPrice: input.sellPrice,
    reorderLevel: input.reorderLevel,
    active: input.active ?? true,
  });

  const { data: product, error } = await supabase
    .from('products')
    .update({
      name: parsed.name,
      category: parsed.category,
      unit: parsed.unit,
      stock_type: parsed.stockType,
      cost_price: parsed.costPrice,
      sell_price: parsed.sellPrice,
      reorder_level: parsed.reorderLevel,
      active: parsed.active,
    })
    .eq('id', input.id)
    .select('id, name, category, unit, stock_type, cost_price, sell_price, reorder_level, active')
    .single();
  if (error || !product) throw error ?? new Error('Failed to update product');

  if (parsed.stockType === 'liquor_weighted' && input.liquorProfile) {
    const lp = liquorProfileSchema.parse({
      productId: product.id,
      bottleMl: input.liquorProfile.bottleMl,
      shotMl: input.liquorProfile.shotMl,
      fullBottleWeightG: input.liquorProfile.fullBottleWeightG,
      emptyBottleWeightG: input.liquorProfile.emptyBottleWeightG,
      toleranceShots: input.liquorProfile.toleranceShots,
    });
    const { error: liquorError } = await supabase.from('liquor_profiles').upsert({
      product_id: lp.productId,
      bottle_ml: lp.bottleMl,
      shot_ml: lp.shotMl,
      full_bottle_weight_g: lp.fullBottleWeightG,
      empty_bottle_weight_g: lp.emptyBottleWeightG,
      tolerance_shots: lp.toleranceShots,
    });
    if (liquorError) throw liquorError;
  } else {
    const { error: liquorDeleteError } = await supabase.from('liquor_profiles').delete().eq('product_id', input.id);
    if (liquorDeleteError) throw liquorDeleteError;
  }

  return product;
}

export async function deactivateProduct(id: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('products')
    .update({ active: false })
    .eq('id', id)
    .select('id, name, active')
    .single();
  if (error) throw error;
  return data;
}
