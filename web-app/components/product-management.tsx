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

const emptyLiquor = {
  bottleMl: 750,
  shotMl: 30,
  fullBottleWeightG: 1000,
  emptyBottleWeightG: 400,
  toleranceShots: 1,
};

const emptyForm = {
  id: '',
  name: '',
  category: '',
  unit: '',
  stockType: 'simple_unit',
  costPrice: 0,
  sellPrice: 0,
  reorderLevel: 0,
  active: true,
  liquorProfile: emptyLiquor,
};

export function ProductManagement({ initialProducts }: { initialProducts: ProductRow[] }) {
  const [products, setProducts] = useState<ProductRow[]>(initialProducts);
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(initialProducts[0]?.id ?? null);
  const [form, setForm] = useState<any>(buildForm(initialProducts[0]) ?? emptyForm);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((product) =>
      [product.name, product.category, product.unit, product.stock_type]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q)),
    );
  }, [products, query]);

  function syncSelection(nextProducts: ProductRow[], preferredId?: string | null) {
    const nextSelected = nextProducts.find((item) => item.id === preferredId)
      ?? nextProducts.find((item) => item.id === selectedId)
      ?? nextProducts[0]
      ?? null;
    setSelectedId(nextSelected?.id ?? null);
    setForm(nextSelected ? buildForm(nextSelected) : emptyForm);
  }

  async function refresh(preferredId?: string | null) {
    const response = await fetch('/api/products');
    const data = await response.json();
    if (!response.ok) {
      setStatus(`Error: ${data.error ?? 'Failed to refresh products'}`);
      return;
    }
    const nextProducts = data.products ?? [];
    setProducts(nextProducts);
    syncSelection(nextProducts, preferredId);
  }

  function handleSelect(product: ProductRow) {
    setSelectedId(product.id);
    setForm(buildForm(product));
    setStatus('');
  }

  function handleNew() {
    setSelectedId(null);
    setForm(emptyForm);
    setStatus('Ready to add a new product');
  }

  async function createItem() {
    setStatus('Creating product...');
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanPayload(form)),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(`Error: ${data.error ?? 'Failed to create product'}`);
      return;
    }
    setStatus('Product created');
    await refresh(data.product?.id ?? null);
  }

  async function saveItem() {
    if (!selectedId) return createItem();
    setStatus('Updating product...');
    const response = await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedId, ...cleanPayload(form) }),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(`Error: ${data.error ?? 'Failed to update product'}`);
      return;
    }
    setStatus('Product updated');
    await refresh(selectedId);
  }

  async function deactivateItem() {
    if (!selectedId) return;
    setStatus('Deactivating product...');
    const response = await fetch(`/api/products?id=${selectedId}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) {
      setStatus(`Error: ${data.error ?? 'Failed to deactivate product'}`);
      return;
    }
    setStatus('Product deactivated');
    await refresh(selectedId);
  }

  return (
    <div className="inventory-layout">
      <section className="card inventory-form-panel">
        <div className="inventory-panel-title">Manage Product Details</div>
        <ProductForm value={form} onChange={setForm} />
        <div className="inventory-actions">
          <button type="button" onClick={createItem}>Save</button>
          <button type="button" onClick={saveItem}>Update</button>
          <button type="button" className="button secondary" onClick={deactivateItem} disabled={!selectedId}>Delete</button>
          <button type="button" className="button secondary" onClick={handleNew}>Clear</button>
        </div>
        {status ? <div className="subtle" style={{ marginTop: 12 }}>{status}</div> : null}
      </section>

      <section className="card inventory-list-panel">
        <div className="inventory-list-header">
          <div className="inventory-panel-title">Search Products</div>
          <div className="inventory-search-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, category, unit..."
            />
            <button type="button" className="button secondary" onClick={() => setQuery('')}>Show All</button>
          </div>
        </div>

        <div className="inventory-table-wrap">
          <table className="table inventory-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Type</th>
                <th>Sell</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? filtered.map((product) => (
                <tr
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className={product.id === selectedId ? 'selected-row' : ''}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.unit}</td>
                  <td>{product.stock_type}</td>
                  <td>{product.sell_price}</td>
                  <td>{product.active ? 'Active' : 'Inactive'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6}>No matching products.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function buildForm(product?: ProductRow | null) {
  if (!product) return null;
  const liquor = product.liquor_profiles?.[0];
  return {
    id: product.id,
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
}

function cleanPayload(value: any) {
  return {
    name: value.name,
    category: value.category,
    unit: value.unit,
    stockType: value.stockType,
    costPrice: Number(value.costPrice),
    sellPrice: Number(value.sellPrice),
    reorderLevel: Number(value.reorderLevel),
    active: Boolean(value.active),
    liquorProfile: value.stockType === 'liquor_weighted' ? {
      bottleMl: Number(value.liquorProfile.bottleMl),
      shotMl: Number(value.liquorProfile.shotMl),
      fullBottleWeightG: Number(value.liquorProfile.fullBottleWeightG),
      emptyBottleWeightG: Number(value.liquorProfile.emptyBottleWeightG),
      toleranceShots: Number(value.liquorProfile.toleranceShots),
    } : null,
  };
}

function ProductForm({ value, onChange }: { value: any; onChange: (next: any) => void }) {
  const showLiquor = value.stockType === 'liquor_weighted';

  return (
    <div className="form">
      <label>Category<input value={value.category} onChange={(e) => onChange({ ...value, category: e.target.value })} /></label>
      <label>Unit<input value={value.unit} onChange={(e) => onChange({ ...value, unit: e.target.value })} /></label>
      <label>Name<input value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} /></label>
      <label>Cost Price<input type="number" value={value.costPrice} onChange={(e) => onChange({ ...value, costPrice: Number(e.target.value) })} /></label>
      <label>Sell Price<input type="number" value={value.sellPrice} onChange={(e) => onChange({ ...value, sellPrice: Number(e.target.value) })} /></label>
      <label>Reorder Level<input type="number" value={value.reorderLevel} onChange={(e) => onChange({ ...value, reorderLevel: Number(e.target.value) })} /></label>
      <label>Stock Type
        <select value={value.stockType} onChange={(e) => onChange({ ...value, stockType: e.target.value, liquorProfile: value.liquorProfile || emptyLiquor })}>
          <option value="simple_unit">simple_unit</option>
          <option value="full_bottle">full_bottle</option>
          <option value="liquor_weighted">liquor_weighted</option>
        </select>
      </label>
      <label>Status
        <select value={value.active ? 'active' : 'inactive'} onChange={(e) => onChange({ ...value, active: e.target.value === 'active' })}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>

      {showLiquor ? (
        <div className="inventory-liquor-box">
          <strong>Liquor Profile</strong>
          <div className="form-row">
            <label>Bottle ml<input type="number" value={value.liquorProfile.bottleMl} onChange={(e) => onChange({ ...value, liquorProfile: { ...value.liquorProfile, bottleMl: Number(e.target.value) } })} /></label>
            <label>Shot ml<input type="number" value={value.liquorProfile.shotMl} onChange={(e) => onChange({ ...value, liquorProfile: { ...value.liquorProfile, shotMl: Number(e.target.value) } })} /></label>
          </div>
          <div className="form-row">
            <label>Full wt (g)<input type="number" value={value.liquorProfile.fullBottleWeightG} onChange={(e) => onChange({ ...value, liquorProfile: { ...value.liquorProfile, fullBottleWeightG: Number(e.target.value) } })} /></label>
            <label>Empty wt (g)<input type="number" value={value.liquorProfile.emptyBottleWeightG} onChange={(e) => onChange({ ...value, liquorProfile: { ...value.liquorProfile, emptyBottleWeightG: Number(e.target.value) } })} /></label>
            <label>Tolerance<input type="number" value={value.liquorProfile.toleranceShots} onChange={(e) => onChange({ ...value, liquorProfile: { ...value.liquorProfile, toleranceShots: Number(e.target.value) } })} /></label>
          </div>
        </div>
      ) : null}
    </div>
  );
}
