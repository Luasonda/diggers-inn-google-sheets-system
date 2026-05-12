"use client";

import { useMemo, useState } from 'react';

type ProductRow = {
  id: string;
  name: string;
  category: string;
  unit: string;
  stock_type: 'full_bottle' | 'liquor_weighted' | 'simple_unit';
  cost_price: number;
  sell_price: number;
  reorder_level: number;
  active: boolean;
  liquor_profiles?: Array<{
    bottle_ml: number;
    shot_ml: number;
    full_bottle_weight_g: number;
    empty_bottle_weight_g: number;
    tolerance_shots: number;
  }>;
};

const emptyLiquor = { bottleMl: 750, shotMl: 30, fullBottleWeightG: 1000, emptyBottleWeightG: 400, toleranceShots: 1 };
const emptyForm = { name: '', category: '', unit: '', stockType: 'simple_unit', costPrice: 0, sellPrice: 0, reorderLevel: 0, active: true, liquorProfile: emptyLiquor };

export function ProductManagement({ initialProducts }: { initialProducts: ProductRow[] }) {
  const [products, setProducts] = useState<ProductRow[]>(initialProducts);
  const [status, setStatus] = useState('');
  const [form, setForm] = useState<any>(emptyForm);
  const [editing, setEditing] = useState<Record<string, any>>({});

  const rows = useMemo(() => [...products], [products]);

  async function refresh() {
    const response = await fetch('/api/products');
    const data = await response.json();
    if (response.ok) setProducts(data.products ?? []);
  }

  async function createItem() {
    setStatus('Creating product...');
    const response = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await response.json();
    if (!response.ok) return setStatus(`Error: ${data.error ?? 'Failed to create product'}`);
    setForm(emptyForm);
    setStatus('Product created');
    await refresh();
  }

  async function saveItem(id: string) {
    const draft = editing[id];
    if (!draft) return;
    setStatus('Saving product...');
    const response = await fetch('/api/products', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...draft }) });
    const data = await response.json();
    if (!response.ok) return setStatus(`Error: ${data.error ?? 'Failed to save product'}`);
    setStatus('Product updated');
    await refresh();
  }

  async function deactivateItem(id: string) {
    setStatus('Deactivating product...');
    const response = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) return setStatus(`Error: ${data.error ?? 'Failed to deactivate product'}`);
    setStatus('Product deactivated');
    await refresh();
  }

  function updateDraft(id: string, patch: any) {
    setEditing((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  return (
    <div className="grid cols-2">
      <section className="card">
        <h2>Add product</h2>
        <ProductForm value={form} onChange={setForm} />
        <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
          <button type="button" onClick={createItem}>Create product</button>
          {status ? <span className="subtle">{status}</span> : null}
        </div>
      </section>

      <section className="card">
        <h2>Existing products</h2>
        <div style={{ display: 'grid', gap: 16, maxHeight: '70vh', overflow: 'auto', paddingRight: 4 }}>
          {rows.map((product) => {
            const liquor = product.liquor_profiles?.[0];
            const draft = editing[product.id] ?? {
              name: product.name,
              category: product.category,
              unit: product.unit,
              stockType: product.stock_type,
              costPrice: product.cost_price,
              sellPrice: product.sell_price,
              reorderLevel: product.reorder_level,
              active: product.active,
              liquorProfile: liquor ? {
                bottleMl: liquor.bottle_ml,
                shotMl: liquor.shot_ml,
                fullBottleWeightG: liquor.full_bottle_weight_g,
                emptyBottleWeightG: liquor.empty_bottle_weight_g,
                toleranceShots: liquor.tolerance_shots,
              } : emptyLiquor,
            };
            return (
              <article key={product.id} className="card soft" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                  <div>
                    <strong>{product.name}</strong>
                    <div className="subtle">{product.category} · {product.unit}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className="badge">{product.stock_type}</span>
                    <span className="badge" style={{ opacity: product.active ? 1 : 0.65 }}>{product.active ? 'active' : 'inactive'}</span>
                  </div>
                </div>
                <ProductForm value={draft} onChange={(next) => updateDraft(product.id, next)} compact />
                <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => saveItem(product.id)}>Save changes</button>
                  <button type="button" className="button secondary" onClick={() => deactivateItem(product.id)}>Deactivate</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ProductForm({ value, onChange, compact = false }: { value: any; onChange: (next: any) => void; compact?: boolean }) {
  const showLiquor = value.stockType === 'liquor_weighted';
  return (
    <div className="form">
      <div className="form-row">
        <label>Name<input value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} /></label>
        <label>Category<input value={value.category} onChange={(e) => onChange({ ...value, category: e.target.value })} /></label>
      </div>
      <div className="form-row">
        <label>Unit<input value={value.unit} onChange={(e) => onChange({ ...value, unit: e.target.value })} /></label>
        <label>Stock type
          <select value={value.stockType} onChange={(e) => onChange({ ...value, stockType: e.target.value, liquorProfile: value.liquorProfile || emptyLiquor })}>
            <option value="simple_unit">simple_unit</option>
            <option value="full_bottle">full_bottle</option>
            <option value="liquor_weighted">liquor_weighted</option>
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>Cost price<input type="number" value={value.costPrice} onChange={(e) => onChange({ ...value, costPrice: Number(e.target.value) })} /></label>
        <label>Sell price<input type="number" value={value.sellPrice} onChange={(e) => onChange({ ...value, sellPrice: Number(e.target.value) })} /></label>
        <label>Reorder level<input type="number" value={value.reorderLevel} onChange={(e) => onChange({ ...value, reorderLevel: Number(e.target.value) })} /></label>
      </div>
      <label><input type="checkbox" checked={value.active} onChange={(e) => onChange({ ...value, active: e.target.checked })} /> Active</label>
      {showLiquor ? (
        <div className="card" style={{ padding: compact ? 12 : 16 }}>
          <h3 style={{ marginTop: 0 }}>Liquor profile</h3>
          <div className="form-row">
            <label>Bottle ml<input type="number" value={value.liquorProfile.bottleMl} onChange={(e) => onChange({ ...value, liquorProfile: { ...value.liquorProfile, bottleMl: Number(e.target.value) } })} /></label>
            <label>Shot ml<input type="number" value={value.liquorProfile.shotMl} onChange={(e) => onChange({ ...value, liquorProfile: { ...value.liquorProfile, shotMl: Number(e.target.value) } })} /></label>
          </div>
          <div className="form-row">
            <label>Full bottle weight (g)<input type="number" value={value.liquorProfile.fullBottleWeightG} onChange={(e) => onChange({ ...value, liquorProfile: { ...value.liquorProfile, fullBottleWeightG: Number(e.target.value) } })} /></label>
            <label>Empty bottle weight (g)<input type="number" value={value.liquorProfile.emptyBottleWeightG} onChange={(e) => onChange({ ...value, liquorProfile: { ...value.liquorProfile, emptyBottleWeightG: Number(e.target.value) } })} /></label>
            <label>Tolerance shots<input type="number" value={value.liquorProfile.toleranceShots} onChange={(e) => onChange({ ...value, liquorProfile: { ...value.liquorProfile, toleranceShots: Number(e.target.value) } })} /></label>
          </div>
        </div>
      ) : null}
    </div>
  );
}
