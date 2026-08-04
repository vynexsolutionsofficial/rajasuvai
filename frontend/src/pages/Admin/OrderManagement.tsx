import React, { useState, useEffect } from 'react';
import {
  Eye, CheckCircle, Truck, Clock, Loader2, Calendar, User, Phone, Mail,
  Package, MapPin, AlertCircle, Download,
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/ui/DataTable';
import { Sheet } from '../../components/ui/Sheet';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/cn';

const exportToCsv = (filename: string, rows: Record<string, any>[]) => {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const ORDER_STATUSES = ['Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled'] as const;

const statusStyles: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Packed: 'bg-purple-100 text-purple-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-fresh-100 text-fresh-700',
  Cancelled: 'bg-error-50 text-error-600',
};

const statusIcons: Record<string, React.ReactNode> = {
  Pending: <Clock size={13} />,
  Packed: <Package size={13} />,
  Shipped: <Truck size={13} />,
  Delivered: <CheckCircle size={13} />,
  Cancelled: <AlertCircle size={13} />,
};

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  products?: { name: string; image: string };
}

interface Order {
  id: number;
  client_id: number;
  status: 'Pending' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  total_price: number;
  created_at: string;
  clients: { name: string; email: string; phone: string; address?: string };
  order_items?: OrderItem[];
}

const OrderManagement: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [bulkSaving, setBulkSaving] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/admin/orders');
      if (data) setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrderDetails = async (id: number) => {
    setModalLoading(true);
    setIsModalOpen(true);
    try {
      const data = await api.get(`/api/admin/orders/${id}`);
      if (data) setSelectedOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const data = await api.post(`/api/admin/orders/${id}/status`, { status: newStatus });
      if (!data.error) {
        fetchOrders();
        if (selectedOrder?.id === id) fetchOrderDetails(id);
      } else {
        showToast(data.error || 'Failed to update status', 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.clients?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.toString().includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.size === filteredOrders.length ? new Set() : new Set(filteredOrders.map((o) => o.id)));
  };

  const bulkUpdateStatus = async (status: string) => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Update ${selectedIds.size} order(s) to "${status}"?`)) return;
    setBulkSaving(true);
    try {
      const res = await api.post('/api/admin/orders/bulk-status', { ids: Array.from(selectedIds), status });
      showToast(`Updated ${res.updated} order(s)`, 'success');
      setSelectedIds(new Set());
      fetchOrders();
    } catch (err: any) {
      showToast(err.message || 'Bulk update failed', 'error');
    } finally {
      setBulkSaving(false);
    }
  };

  const handleExportCsv = () => {
    const rows = filteredOrders.map((o) => ({
      order_id: o.id,
      customer: o.clients?.name || '',
      email: o.clients?.email || '',
      phone: o.clients?.phone || '',
      status: o.status,
      total: o.total_price,
      created_at: new Date(o.created_at).toISOString(),
    }));
    exportToCsv(`suvai-orders-${new Date().toISOString().split('T')[0]}.csv`, rows);
    showToast(`Exported ${rows.length} orders`, 'success');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-black/10 px-3 text-sm"
        >
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.size > 0 && (
            <select
              disabled={bulkSaving}
              onChange={(e) => { if (e.target.value) bulkUpdateStatus(e.target.value); e.target.value = ''; }}
              className="h-10 rounded-lg border border-black/10 px-3 text-sm"
            >
              <option value="">Bulk update ({selectedIds.size}) →</option>
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          <Button variant="outline" size="sm" onClick={handleExportCsv} disabled={filteredOrders.length === 0}>
            <Download size={15} /> Export CSV
          </Button>
        </div>
      </div>

      <DataTable
        data={filteredOrders}
        rowKey={(o) => o.id}
        loading={loading && orders.length === 0}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search orders or customers..."
        emptyTitle="No orders found"
        columns={[
          {
            header: '',
            className: 'w-10',
            render: (o) => <input type="checkbox" checked={selectedIds.has(o.id)} onChange={() => toggleSelected(o.id)} className="size-4 accent-brand-500" />,
          },
          { header: 'Order ID', render: (o) => <span className="font-semibold">#{o.id}</span> },
          {
            header: 'Customer',
            render: (o) => (
              <div>
                <div className="font-medium text-brand-950">{o.clients?.name}</div>
                <div className="text-xs text-black/40">{o.clients?.phone}</div>
              </div>
            ),
          },
          { header: 'Date', render: (o) => new Date(o.created_at).toLocaleDateString() },
          { header: 'Amount', render: (o) => `₹${o.total_price}` },
          {
            header: 'Status',
            render: (o) => (
              <span className={cn('flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', statusStyles[o.status])}>
                {statusIcons[o.status]} {o.status}
              </span>
            ),
          },
          {
            header: 'Actions',
            render: (o) => (
              <button onClick={() => fetchOrderDetails(o.id)} title="View Details" className="flex size-8 items-center justify-center rounded-lg text-black/50 hover:bg-black/5">
                <Eye size={15} />
              </button>
            ),
          },
        ]}
      />
      {filteredOrders.length > 0 && (
        <label className="flex w-fit items-center gap-2 text-xs text-black/50">
          <input type="checkbox" checked={filteredOrders.length > 0 && selectedIds.size === filteredOrders.length} onChange={toggleSelectAll} className="size-4 accent-brand-500" />
          Select all visible orders
        </label>
      )}

      <Sheet open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedOrder ? `Order Details #${selectedOrder.id}` : 'Order Details'} side="right" className="sm:max-w-lg">
        {modalLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-brand-500" /></div>
        ) : selectedOrder && (
          <div className="space-y-6 p-5">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h4 className="border-b border-black/5 pb-2 text-xs font-bold tracking-wide text-black/40">CUSTOMER DETAILS</h4>
                <div className="mt-3 space-y-2 text-sm text-black/70">
                  <div className="flex items-center gap-2"><User size={14} className="text-brand-500" /> {selectedOrder.clients?.name}</div>
                  <div className="flex items-center gap-2"><Mail size={14} className="text-brand-500" /> {selectedOrder.clients?.email}</div>
                  <div className="flex items-center gap-2"><Phone size={14} className="text-brand-500" /> {selectedOrder.clients?.phone}</div>
                  <div className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 text-brand-500" /> {selectedOrder.clients?.address || 'No address provided'}</div>
                </div>
              </div>
              <div>
                <h4 className="border-b border-black/5 pb-2 text-xs font-bold tracking-wide text-black/40">MANAGEMENT</h4>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-black/70"><Calendar size={14} className="text-brand-500" /> {new Date(selectedOrder.created_at).toLocaleString()}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {ORDER_STATUSES.map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(selectedOrder.id, status)}
                        className={cn(
                          'rounded-full px-2.5 py-1 text-xs font-semibold',
                          statusStyles[status],
                          selectedOrder.status === status ? 'ring-2 ring-brand-500' : 'opacity-50'
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-bold tracking-wide text-black/40">ORDERED ITEMS</h4>
              <div className="divide-y divide-black/5 rounded-xl border border-black/5">
                {selectedOrder.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-3 py-2.5 text-sm">
                    <div className="flex items-center gap-2.5">
                      <img src={item.products?.image} alt="" className="size-8 rounded object-cover" />
                      <span className="text-brand-950">{item.products?.name}</span>
                    </div>
                    <span className="text-black/50">{item.quantity} × ₹{item.unit_price}</span>
                    <span className="font-semibold text-brand-950">₹{(item.unit_price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-brand-50/50 p-4">
              <span className="text-sm text-black/55">Order Subtotal</span>
              <span className="text-lg font-bold text-brand-600">₹{selectedOrder.total_price.toLocaleString()}</span>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
};

export default OrderManagement;
