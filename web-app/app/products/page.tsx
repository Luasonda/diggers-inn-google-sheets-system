import { AppNav } from '@/components/nav';
import { products } from '@/lib/mock-data';

export default function ProductsPage() {
  return (
    <main className="container">
      <div className="header">
        <div>
          <div className="badge">Products</div>
          <h1>Inventory master</h1>
          <p className="subtle">Manager-only area for stock items and liquor bottle profiles.</p>
        </div>
        <AppNav />
      </div>
      <section className="card">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Category</th><th>Unit</th><th>Stock type</th><th>Reorder level</th></tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={`${product.name}-${product.unit}`}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.unit}</td>
                <td>{product.type}</td>
                <td>{product.reorder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
