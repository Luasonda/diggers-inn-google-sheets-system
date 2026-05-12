import { AppNav } from '@/components/nav';
import { HeaderUser } from '@/components/header-user';
import { ProductManagement } from '@/components/product-management';
import { listProductsDetailed } from '@/lib/product-service';
import { requirePermission } from '@/lib/session';

export default async function ProductsPage() {
  await requirePermission('products.read');
  const products = await listProductsDetailed();

  return (
    <main className="container">
      <div className="header">
        <div>
          <div className="badge">Products</div>
          <h1>Product management</h1>
          <p className="subtle">Manage stock items, pricing, reorder levels, and liquor-specific bottle profiles.</p>
        </div>
        <div style={{ display: 'grid', gap: 10, justifyItems: 'end' }}>
          <HeaderUser />
          <AppNav />
        </div>
      </div>
      <ProductManagement initialProducts={products as any} />
    </main>
  );
}
