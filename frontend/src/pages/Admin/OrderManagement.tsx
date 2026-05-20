import React, { useState, useEffect } from 'react';
import {
  Eye,
  CheckCircle,
  Truck,
  Clock,
  Search,
  X,
  Loader2,
  Calendar,
  User,
  Phone,
  Mail,
  Package,
  MapPin,
  AlertCircle,
  Download,
  CheckSquare
} from 'lucide-react';
import './ProductManagement.css';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const exportToCsv = (filename: string, rows: Record<string, any>[]) => {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    headers.join(','),
    ...rows.map(r => headers.map(h => escape(r[h])).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const ORDER_STATUSES = ['Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled'] as const;

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
  clients: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
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

  useEffect(() => {
    fetchOrders();
  }, []);

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
        if (selectedOrder?.id === id) {
          fetchOrderDetails(id);
        }
      } else {
        showToast(data.error || 'Failed to update status', 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.clients?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toString().includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelected = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map(o => o.id)));
    }
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
    const rows = filteredOrders.map(o => ({
      order_id: o.id,
      customer: o.clients?.name || '',
      email: o.clients?.email || '',
      phone: o.clients?.phone || '',
      status: o.status,
      total: o.total_price,
      created_at: new Date(o.created_at).toISOString()
    }));
    exportToCsv(`suvai-orders-${new Date().toISOString().split('T')[0]}.csv`, rows);
    showToast(`Exported ${rows.length} orders`, 'success');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock size={16} />;
      case 'Packed': return <Package size={16} />;
      case 'Shipped': return <Truck size={16} />;
      case 'Delivered': return <CheckCircle size={16} />;
      case 'Cancelled': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="order-mgmt">
      <div className="admin-toolbar" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'rgba(255,255,255,0.4)' }} />
            <input
              type="text"
              placeholder="Search orders or customers..."
              className="search-input"
              style={{ paddingLeft: '2.5rem', width: '280px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="search-input"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '140px' }}
          >
            <option value="all">All Statuses</option>
            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {selectedIds.size > 0 && (
            <>
              <select
                className="search-input"
                disabled={bulkSaving}
                onChange={e => { if (e.target.value) bulkUpdateStatus(e.target.value); e.target.value = ''; }}
                style={{ width: 'auto', minWidth: '180px' }}
              >
                <option value="">Bulk update ({selectedIds.size}) →</option>
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </>
          )}
          <button className="btn-secondary" onClick={handleExportCsv} disabled={filteredOrders.length === 0}>
            <Download size={16} style={{ marginRight: '0.4rem' }} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="admin-table-container">
        {loading && orders.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={32} />
            <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.4)' }}>Loading orders...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    checked={filteredOrders.length > 0 && selectedIds.size === filteredOrders.length}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                </th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} style={{ background: selectedIds.has(order.id) ? 'rgba(249,168,38,0.05)' : undefined }}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(order.id)}
                      onChange={() => toggleSelected(order.id)}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                  </td>
                  <td style={{ fontWeight: 600 }}>#{order.id}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{order.clients?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{order.clients?.phone}</div>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>₹{order.total_price}</td>
                  <td>
                    <div className={`status-badge status-${order.status.toLowerCase()}`} 
                         style={{ 
                           display: 'flex', 
                           alignItems: 'center', 
                           gap: '0.4rem', 
                           width: 'fit-content',
                           background: order.status === 'Packed' ? 'rgba(168, 85, 247, 0.1)' : order.status === 'Cancelled' ? 'rgba(239, 68, 68, 0.1)' : undefined,
                           color: order.status === 'Packed' ? '#a855f7' : order.status === 'Cancelled' ? '#ef4444' : undefined
                         }}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => fetchOrderDetails(order.id)} title="View Details">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="admin-modal" style={{ width: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            {modalLoading ? (
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : selectedOrder && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h2>Order Details #{selectedOrder.id}</h2>
                  <X size={24} onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div className="order-info-section">
                    <h4 style={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Customer Details</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> {selectedOrder.clients?.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> {selectedOrder.clients?.email}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> {selectedOrder.clients?.phone}</div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}><MapPin size={16} style={{ marginTop: '3px' }}/> {selectedOrder.clients?.address || 'No address provided'}</div>
                    </div>
                  </div>
                  <div className="order-info-section">
                    <h4 style={{ color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Management</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> {new Date(selectedOrder.created_at).toLocaleString()}</div>
                      <div className="status-workflow" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {['Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                          <button 
                            key={status}
                            className={`status-badge`} 
                            style={{ 
                              opacity: selectedOrder.status === status ? 1 : 0.4, 
                              cursor: 'pointer', 
                              border: selectedOrder.status === status ? '1px solid rgba(255,255,255,0.4)' : 'none',
                              background: status === 'Cancelled' ? 'rgba(239, 68, 68, 0.1)' : status === 'Packed' ? 'rgba(168, 85, 247, 0.1)' : undefined,
                              color: status === 'Cancelled' ? '#ef4444' : status === 'Packed' ? '#a855f7' : undefined
                            }}
                            onClick={() => updateStatus(selectedOrder.id, status)}
                          >{status}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-items-table" style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>Ordered Items</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <tr>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Product</th>
                        <th style={{ padding: '0.75rem', textAlign: 'center' }}>Price</th>
                        <th style={{ padding: '0.75rem', textAlign: 'center' }}>Qty</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.order_items?.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img src={item.products?.image} alt="" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} />
                              <span>{item.products?.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>₹{item.unit_price}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>{item.quantity}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{(item.unit_price * item.quantity).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ color: 'rgba(255,255,255,0.5)' }}>Order Subtotal</span>
                     <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#f9a826' }}>₹{selectedOrder.total_price.toLocaleString()}</span>
                   </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
