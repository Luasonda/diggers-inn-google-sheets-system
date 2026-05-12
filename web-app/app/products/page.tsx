import { AppNav } from '@/components/nav';
import { HeaderUser } from '@/components/header-user';
import { getProducts } from '@/lib/queries';
import { requirePermission } from '@/lib/session';

export default async function ProductsPage() {
  await requirePermission('products.read');
  const products = await getProducts();
  return (
    <main className="container">
      <div className="header">
        <div>
          <div className="badge">Products</div>
          <h1>Inventory master</h1>
          <p className="subtle">Manager-only area for stock items and liquor bottle profiles.</p>
        </div>
        <div style={{ display: 'grid', gap: 10, justifyItems: 'end' }}>
          <HeaderUser />
          <AppNav />
        </div>
      </div>
      <section className="card">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Category</th><th>Unit</th><th>Stock type</th><th>Reorder level</th><th>Cost</th><th>Sell</th></tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={`${product.name}-${product.unit}`}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.unit}</td>
                <td>{product.type}</td>
                <td>{product.reorder}</td>
                <td>{'costPrice' in product ? product.costPrice : '—'}</td>
                <td>{'sellPrice' in product ? product.sellPrice : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
