import { z } from 'zod';
import { ROLES } from '@/lib/auth';

export const roleSchema = z.enum(ROLES);

export const productSchema = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(80),
  unit: z.string().trim().min(1).max(40),
  stockType: z.enum(['full_bottle', 'liquor_weighted', 'simple_unit']),
  costPrice: z.number().nonnegative(),
  sellPrice: z.number().nonnegative(),
  reorderLevel: z.number().int().nonnegative(),
  active: z.boolean().default(true),
});

export const liquorProfileSchema = z.object({
  productId: z.string().uuid(),
  bottleMl: z.number().positive(),
  shotMl: z.number().positive(),
  fullBottleWeightG: z.number().positive(),
  emptyBottleWeightG: z.number().nonnegative(),
  toleranceShots: z.number().nonnegative().default(0),
}).refine((data) => data.fullBottleWeightG > data.emptyBottleWeightG, {
  message: 'Full bottle weight must exceed empty bottle weight',
  path: ['fullBottleWeightG'],
});

export const stockSessionSchema = z.object({
  businessDate: z.string().date(),
  location: z.string().trim().min(1).max(100),
  openedByUserId: z.string().uuid(),
  status: z.enum(['draft', 'open', 'submitted', 'locked']).default('draft'),
});

export const stockIssueSchema = z.object({
  sessionId: z.string().uuid().optional(),
  productId: z.string().uuid(),
  quantity: z.number().nonnegative(),
  issueDate: z.string().date(),
  issuedByUserId: z.string().uuid(),
  receivedByUserId: z.string().uuid(),
  notes: z.string().max(500).optional(),
});

export const stockCountLineSchema = z.object({
  sessionId: z.string().uuid(),
  productId: z.string().uuid(),
  openingFullBottles: z.number().nonnegative().optional(),
  openingGrossWeightG: z.number().nonnegative().optional(),
  issuedQty: z.number().nonnegative().default(0),
  closingFullBottles: z.number().nonnegative().optional(),
  closingGrossWeightG: z.number().nonnegative().optional(),
  notes: z.string().max(500).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type LiquorProfileInput = z.infer<typeof liquorProfileSchema>;
export type StockSessionInput = z.infer<typeof stockSessionSchema>;
export type StockIssueInput = z.infer<typeof stockIssueSchema>;
export type StockCountLineInput = z.infer<typeof stockCountLineSchema>;
