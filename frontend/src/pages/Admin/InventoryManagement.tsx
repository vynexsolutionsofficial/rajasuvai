import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  History
} from 'lucide-react';
import './ProductManagement.css'; 
import { supabase } from '../../supabaseClient';

interface InventoryItem {
  id: number;
  product_id: number;
  quantity: number;
  low_stock_threshold: number;
  updated_at: string;
  products: {
    name: string;
    category: string;
  };
}

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const getAuthToken = async () => {
    if (localStorage.getItem('rajasuvai_dev_admin') === 'true') return 'DEV_ADMIN_TOKEN';
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const apiFetch = async (endpoint: string) => {
    const token = await getAuthToken();
    const headers = { 'Authorization': `Bearer ${token}` };
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return fetch(`${baseUrl}${endpoint}`, { headers });
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin/inventory');
      if (res.ok) setInventory(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = inventory.filter(i => 
    i.products?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="inventory-mgmt">
      <div className="admin-toolbar">
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'rgba(255,255,255,0.4)' }} />
          <input 
            type="text" 
            placeholder="Search stock..." 
            className="search-input"
            style={{ paddingLeft: '2.5rem', width: '300px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn-icon" onClick={fetchInventory}><History size={18} /> Refresh</button>
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Threshold</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.products?.name}</td>
                  <td>{item.products?.category}</td>
                  <td style={{ fontWeight: 700, fontSize: '1.1rem', color: item.quantity <= item.low_stock_threshold ? '#ef4444' : '#4ade80' }}>
                    {item.quantity}
                  </td>
                  <td>{item.low_stock_threshold}</td>
                  <td>
                    {item.quantity <= item.low_stock_threshold ? (
                      <div className="status-badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <AlertTriangle size={14} /> Low Stock
                      </div>
                    ) : (
                      <div className="status-badge" style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CheckCircle2 size={14} /> Healthy
                      </div>
                    )}
                  </td>
                  <td>{new Date(item.updated_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;
