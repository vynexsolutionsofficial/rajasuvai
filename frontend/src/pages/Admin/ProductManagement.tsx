import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Loader2, AlertTriangle, Package } from 'lucide-react';
import './ProductManagement.css';
import { supabase } from '../../supabaseClient';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  category_id: number;
  image: string;
  description: string;
  sku: string;
  status: 'active' | 'inactive';
  categories?: { name: string };
  inventory?: { quantity: number; low_stock_threshold: number };
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> & { initial_stock?: number; low_stock_threshold?: number }>({});
  const [isEditing, setIsEditing] = useState(false);

  const getAuthToken = async () => {
    if (localStorage.getItem('rajasuvai_dev_admin') === 'true') return 'DEV_ADMIN_TOKEN';
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = await getAuthToken();
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      }
    });
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        apiFetch('/api/admin/products'),
        apiFetch('/api/admin/categories')
      ]);
      
      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isEditing ? `/api/admin/products/${currentProduct.id}` : '/api/admin/products';
      const method = isEditing ? 'PUT' : 'POST';
      
      const payload = {
        ...currentProduct,
        quantity: currentProduct.inventory?.quantity || currentProduct.initial_stock,
        low_stock_threshold: currentProduct.inventory?.low_stock_threshold || currentProduct.low_stock_threshold
      };

      const response = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save product');
      }

      setIsModalOpen(false);
      setCurrentProduct({});
      setIsEditing(false);
      fetchInitialData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (response.ok) fetchInitialData();
      else throw new Error('Delete failed');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct({
      ...product,
      low_stock_threshold: product.inventory?.low_stock_threshold,
      initial_stock: product.inventory?.quantity
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categories?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="product-mgmt">
      <div className="admin-toolbar">
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'rgba(255,255,255,0.4)' }} />
          <input 
            type="text" 
            placeholder="Search by name, category or SKU..." 
            className="search-input"
            style={{ paddingLeft: '2.5rem', width: '300px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={() => { setIsEditing(false); setCurrentProduct({ status: 'active', low_stock_threshold: 10 }); setIsModalOpen(true); }}>
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="admin-table-container">
        {loading && products.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={32} />
            <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.4)' }}>Loading products...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Info</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stock = product.inventory?.quantity || 0;
                const threshold = product.inventory?.low_stock_threshold || 10;
                const isLow = stock <= threshold && stock > 0;
                const isOut = stock === 0;

                return (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        <img src={product.image} alt={product.name} className="product-thumb" />
                        <div>
                          <div style={{ fontWeight: 600 }}>{product.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>SKU: {product.sku || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td>{product.categories?.name || 'Uncategorized'}</td>
                    <td>{product.price}</td>
                    <td>
                      <div className={`status-pill ${isOut ? 'out' : isLow ? 'low' : 'good'}`}>
                        {isOut ? <X size={12} /> : isLow ? <AlertTriangle size={12} /> : <Package size={12} />}
                        {stock} in stock
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" onClick={() => openEditModal(product)} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDelete(product.id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="admin-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
              <X size={24} onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer' }} />
            </div>
            <form onSubmit={handleSave}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Product Name</label>
                  <input 
                    type="text" 
                    value={currentProduct.name || ''} 
                    required
                    onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>SKU</label>
                  <input 
                    type="text" 
                    value={currentProduct.sku || ''} 
                    required
                    placeholder="e.g. SUV-TUR-01"
                    onChange={(e) => setCurrentProduct({...currentProduct, sku: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Price (e.g., ₹250)</label>
                  <input 
                    type="text" 
                    value={currentProduct.price || ''} 
                    required
                    onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Category</label>
                  <select 
                    value={currentProduct.category_id || ''} 
                    required
                    onChange={(e) => setCurrentProduct({...currentProduct, category_id: parseInt(e.target.value)})}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>{isEditing ? 'Current Stock' : 'Initial Stock'}</label>
                  <input 
                    type="number" 
                    value={isEditing ? (currentProduct.inventory?.quantity || 0) : (currentProduct.initial_stock || 0)} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (isEditing) {
                        setCurrentProduct({
                          ...currentProduct, 
                          inventory: { ...currentProduct.inventory!, quantity: val }
                        });
                      } else {
                        setCurrentProduct({...currentProduct, initial_stock: val});
                      }
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Low Stock Threshold</label>
                  <input 
                    type="number" 
                    value={isEditing ? (currentProduct.inventory?.low_stock_threshold || 10) : (currentProduct.low_stock_threshold || 10)} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (isEditing) {
                        setCurrentProduct({
                          ...currentProduct, 
                          inventory: { ...currentProduct.inventory!, low_stock_threshold: val }
                        });
                      } else {
                        setCurrentProduct({...currentProduct, low_stock_threshold: val});
                      }
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input 
                  type="text" 
                  value={currentProduct.image || ''} 
                  required
                  onChange={(e) => setCurrentProduct({...currentProduct, image: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={currentProduct.description || ''} 
                  rows={3}
                  onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                  {isEditing ? 'Update Product' : 'Create Product'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
