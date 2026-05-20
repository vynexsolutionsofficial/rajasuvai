import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertTriangle, CheckCircle2, History, Save } from 'lucide-react';
import './ProductManagement.css';
import { api } from '../../services/api';

interface InventoryItem {
  id: number;
  product_id: number;
  quantity: number;
  low_stock_threshold: number;
  updated_at: string;
  products: { name: string; category: string };
}

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQty, setEditQty] = useState('');
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => { fetchInventory(); }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/admin/inventory');
      if (data) setInventory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditQty(String(item.quantity));
  };

  const saveStock = async (item: InventoryItem) => {
    const qty = parseInt(editQty);
    if (isNaN(qty) || qty < 0) return;
    setSavingId(item.id);
    try {
      await api.put(`/api/admin/inventory/${item.id}`, {
        quantity: qty,
        low_stock_threshold: item.low_stock_threshold
      });
      setInventory(prev => prev.map(i => i.id === item.id ? { ...i, quantity: qty, updated_at: new Date().toISOString() } : i));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.products?.name}</td>
                  <td>{item.products?.category}</td>
                  <td>
                    {editingId === item.id ? (
                      <input
                        type="number"
                        min="0"
                        value={editQty}
                        onChange={e => setEditQty(e.target.value)}
                        style={{
                          width: '80px', padding: '4px 8px', borderRadius: '6px',
                          border: '1px solid #f9a826', background: 'rgba(249,168,38,0.1)',
                          color: '#fff', fontSize: '1rem', fontWeight: 700
                        }}
                        autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') saveStock(item); if (e.key === 'Escape') setEditingId(null); }}
                      />
                    ) : (
                      <span style={{ fontWeight: 700, fontSize: '1.1rem', color: item.quantity <= item.low_stock_threshold ? '#ef4444' : '#4ade80' }}>
                        {item.quantity}
                      </span>
                    )}
                  </td>
                  <td>{item.low_stock_threshold}</td>
                  <td>
                    {item.quantity <= item.low_stock_threshold ? (
                      <div className="status-badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <AlertTriangle size={14} /> Low Stock
                      </div>
                    ) : (
                      <div className="status-badge" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CheckCircle2 size={14} /> Healthy
                      </div>
                    )}
                  </td>
                  <td>{new Date(item.updated_at).toLocaleString()}</td>
                  <td>
                    {editingId === item.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn-icon"
                          style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => saveStock(item)}
                          disabled={savingId === item.id}
                        >
                          {savingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                          Save
                        </button>
                        <button
                          className="btn-icon"
                          style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: 0.6 }}
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn-icon"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        onClick={() => startEdit(item)}
                      >
                        Edit Stock
                      </button>
                    )}
                  </td>
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
