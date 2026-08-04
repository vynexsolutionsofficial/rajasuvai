import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, CheckCircle2, History, Save } from 'lucide-react';
import { api } from '../../services/api';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/cn';

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

  useEffect(() => {
    fetchInventory();
  }, []);

  const startEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditQty(String(item.quantity));
  };

  const saveStock = async (item: InventoryItem) => {
    const qty = parseInt(editQty);
    if (isNaN(qty) || qty < 0) return;
    setSavingId(item.id);
    try {
      await api.put(`/api/admin/inventory/${item.id}`, { quantity: qty, low_stock_threshold: item.low_stock_threshold });
      setInventory((prev) => prev.map((i) => (i.id === item.id ? { ...i, quantity: qty, updated_at: new Date().toISOString() } : i)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  const filtered = inventory.filter((i) => i.products?.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-5">
      <DataTable
        data={filtered}
        rowKey={(i) => i.id}
        loading={loading}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search stock..."
        emptyTitle="No inventory items found"
        actions={<Button variant="outline" size="sm" onClick={fetchInventory}><History size={15} /> Refresh</Button>}
        columns={[
          { header: 'Product', render: (i) => <span className="font-semibold text-brand-950">{i.products?.name}</span> },
          { header: 'Category', render: (i) => i.products?.category },
          {
            header: 'Current Stock',
            render: (item) =>
              editingId === item.id ? (
                <input
                  type="number"
                  min={0}
                  value={editQty}
                  onChange={(e) => setEditQty(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') saveStock(item); if (e.key === 'Escape') setEditingId(null); }}
                  className="w-20 rounded-lg border border-brand-400 bg-brand-50 px-2 py-1 text-base font-bold text-brand-950"
                />
              ) : (
                <span className={cn('text-base font-bold', item.quantity <= item.low_stock_threshold ? 'text-error-600' : 'text-fresh-600')}>
                  {item.quantity}
                </span>
              ),
          },
          { header: 'Threshold', render: (i) => i.low_stock_threshold },
          {
            header: 'Status',
            render: (i) =>
              i.quantity <= i.low_stock_threshold ? (
                <span className="flex w-fit items-center gap-1.5 rounded-full bg-error-50 px-2.5 py-1 text-xs font-semibold text-error-600">
                  <AlertTriangle size={13} /> Low Stock
                </span>
              ) : (
                <span className="flex w-fit items-center gap-1.5 rounded-full bg-fresh-100 px-2.5 py-1 text-xs font-semibold text-fresh-700">
                  <CheckCircle2 size={13} /> Healthy
                </span>
              ),
          },
          { header: 'Last Updated', render: (i) => new Date(i.updated_at).toLocaleString() },
          {
            header: 'Actions',
            render: (item) =>
              editingId === item.id ? (
                <div className="flex gap-2">
                  <button onClick={() => saveStock(item)} disabled={savingId === item.id} className="flex items-center gap-1 rounded-lg bg-fresh-100 px-2.5 py-1.5 text-xs font-semibold text-fresh-700">
                    {savingId === item.id ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-black/50 hover:bg-black/5">Cancel</button>
                </div>
              ) : (
                <button onClick={() => startEdit(item)} className="rounded-lg border border-black/10 px-2.5 py-1.5 text-xs font-semibold text-black/60 hover:bg-black/5">Edit Stock</button>
              ),
          },
        ]}
      />
    </div>
  );
};

export default InventoryManagement;
