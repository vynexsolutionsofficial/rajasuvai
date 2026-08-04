import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Loader2, Upload } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../supabaseClient';
import { getProductCoverImage } from '../../utils/imageLoader';
import { DataTable } from '../../components/ui/DataTable';
import { Sheet } from '../../components/ui/Sheet';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const resolveImage = (image: string | undefined): string => {
  if (!image) return '';
  if (image.startsWith('http') || image.startsWith('/')) return image;
  return getProductCoverImage(image) || '';
};

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  bulk_rate?: number | null;
  wholesale_price?: number | null;
  category_id: number;
  size_g?: number | null;
  mrp?: number | null;
  offer?: string | null;
  kg?: number | null;
  image: string;
  description: string;
  sku: string;
  status: 'active' | 'inactive';
  categories?: { name: string };
  inventory?: { quantity: number; low_stock_threshold: number };
}

const ProductManagement: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> & { initial_stock?: number; low_stock_threshold?: number }>({});
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5MB', 'error');
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file, { cacheControl: '3600', upsert: false });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path);
      setCurrentProduct((p) => ({ ...p, image: publicUrl }));
      showToast('Image uploaded', 'success');
    } catch (err: any) {
      showToast(err.message || 'Upload failed. Check that bucket "product-images" exists.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        api.get('/api/admin/products'),
        api.get('/api/admin/categories'),
      ]);
      if (productsData) setProducts(productsData);
      if (categoriesData) setCategories(categoriesData);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isEditing ? `/api/admin/products/${currentProduct.id}` : '/api/admin/products';
      const payload = {
        ...currentProduct,
        quantity: currentProduct.inventory?.quantity || currentProduct.initial_stock,
        low_stock_threshold: currentProduct.inventory?.low_stock_threshold || currentProduct.low_stock_threshold,
      };
      const resData = isEditing ? await api.put(endpoint, payload) : await api.post(endpoint, payload);
      if (resData.error) throw new Error(resData.error || 'Failed to save product');
      setIsModalOpen(false);
      setCurrentProduct({});
      setIsEditing(false);
      fetchInitialData();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const resData = await api.delete(`/api/admin/products/${id}`);
      if (!resData.error) fetchInitialData();
      else throw new Error(resData.error || 'Delete failed');
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct({ ...product, low_stock_threshold: product.inventory?.low_stock_threshold, initial_stock: product.inventory?.quantity });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categories?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <DataTable
        data={filteredProducts}
        rowKey={(p) => p.id}
        loading={loading && products.length === 0}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name, category or SKU..."
        emptyTitle="No products found"
        actions={
          <Button onClick={() => { setIsEditing(false); setCurrentProduct({ status: 'active', low_stock_threshold: 10 }); setIsModalOpen(true); }}>
            <Plus size={18} /> Add Product
          </Button>
        }
        columns={[
          {
            header: 'Product',
            render: (p) => (
              <div className="flex items-center gap-3">
                <img src={resolveImage(p.image)} alt={p.name} className="size-11 rounded-lg object-cover" />
                <div>
                  <div className="font-semibold text-brand-950">{p.name}</div>
                  {p.categories?.name && <div className="text-xs text-black/40">{p.categories.name}</div>}
                </div>
              </div>
            ),
          },
          { header: 'Size (g)', render: (p) => p.size_g || '—' },
          { header: 'MRP', render: (p) => (p.mrp ? `₹${p.mrp}` : '—') },
          { header: 'Offer', render: (p) => <span className="text-fresh-600">{p.offer || '—'}</span> },
          { header: 'Retail Price', render: (p) => <span className="font-semibold">{p.price ? (String(p.price).startsWith('₹') ? p.price : `₹${p.price}`) : '—'}</span> },
          { header: 'Wholesale', render: (p) => (p.wholesale_price ? `₹${p.wholesale_price}` : '—') },
          { header: 'Kg', render: (p) => p.kg || '—' },
          {
            header: 'Actions',
            render: (p) => (
              <div className="flex gap-1.5">
                <button onClick={() => openEditModal(p)} title="Edit" className="flex size-8 items-center justify-center rounded-lg text-black/50 hover:bg-black/5">
                  <Edit2 size={15} />
                </button>
                <button onClick={() => handleDelete(p.id)} title="Delete" className="flex size-8 items-center justify-center rounded-lg text-error-600 hover:bg-error-50">
                  <Trash2 size={15} />
                </button>
              </div>
            ),
          },
        ]}
      />

      <Sheet open={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEditing ? 'Edit Product' : 'Add New Product'} side="right">
        <form onSubmit={handleSave} className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Product Name"><Input value={currentProduct.name || ''} required onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })} /></Field>
            <Field label="SKU"><Input value={currentProduct.sku || ''} required placeholder="e.g. SUV-TUR-01" onChange={(e) => setCurrentProduct({ ...currentProduct, sku: e.target.value })} /></Field>
          </div>

          <Field label="Category">
            <select
              value={currentProduct.category_id || ''}
              required
              onChange={(e) => setCurrentProduct({ ...currentProduct, category_id: parseInt(e.target.value) })}
              className="h-11 w-full rounded-xl border border-black/10 px-3.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Size (g)"><Input type="number" value={currentProduct.size_g ?? ''} placeholder="e.g. 100" onChange={(e) => setCurrentProduct({ ...currentProduct, size_g: e.target.value ? parseInt(e.target.value) : null })} /></Field>
            <Field label="MRP (₹)"><Input type="number" step="0.01" value={currentProduct.mrp ?? ''} placeholder="e.g. 120" onChange={(e) => setCurrentProduct({ ...currentProduct, mrp: e.target.value ? parseFloat(e.target.value) : null })} /></Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Offer"><Input value={currentProduct.offer || ''} placeholder="e.g. 25%" onChange={(e) => setCurrentProduct({ ...currentProduct, offer: e.target.value })} /></Field>
            <Field label="Retail Price (₹)"><Input value={currentProduct.price || ''} required placeholder="e.g. 90" onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })} /></Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Wholesale Price (₹)"><Input type="number" min={0} step="0.01" placeholder="e.g. 81" value={currentProduct.wholesale_price ?? ''} onChange={(e) => setCurrentProduct({ ...currentProduct, wholesale_price: e.target.value ? parseFloat(e.target.value) : null })} /></Field>
            <Field label="Kg"><Input type="number" min={0} step="0.01" placeholder="e.g. 90" value={currentProduct.kg ?? ''} onChange={(e) => setCurrentProduct({ ...currentProduct, kg: e.target.value ? parseFloat(e.target.value) : null })} /></Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label={isEditing ? 'Current Stock' : 'Initial Stock'}>
              <Input
                type="number"
                value={isEditing ? currentProduct.inventory?.quantity || 0 : currentProduct.initial_stock || 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (isEditing) setCurrentProduct({ ...currentProduct, inventory: { ...currentProduct.inventory!, quantity: val } });
                  else setCurrentProduct({ ...currentProduct, initial_stock: val });
                }}
              />
            </Field>
            <Field label="Low Stock Threshold">
              <Input
                type="number"
                value={isEditing ? currentProduct.inventory?.low_stock_threshold || 10 : currentProduct.low_stock_threshold || 10}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (isEditing) setCurrentProduct({ ...currentProduct, inventory: { ...currentProduct.inventory!, low_stock_threshold: val } });
                  else setCurrentProduct({ ...currentProduct, low_stock_threshold: val });
                }}
              />
            </Field>
          </div>

          <Field label="Product Image — folder name or URL">
            <div className="flex items-start gap-3">
              {currentProduct.image && <img src={resolveImage(currentProduct.image)} alt="preview" className="size-16 rounded-lg border border-black/10 object-cover" />}
              <div className="flex-1 space-y-2">
                <Input placeholder="e.g. kadalai — or — https://..." value={currentProduct.image || ''} required onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.value })} />
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} hidden />
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} {uploading ? 'Uploading…' : 'Upload Image'}
                </Button>
              </div>
            </div>
          </Field>

          <Field label="Description">
            <textarea
              value={currentProduct.description || ''}
              rows={3}
              onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-[2]">{isEditing ? 'Update Product' : 'Create Product'}</Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </div>
        </form>
      </Sheet>
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold text-black/50">{label}</label>
    {children}
  </div>
);

export default ProductManagement;
