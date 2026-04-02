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
  AlertCircle
} from 'lucide-react';
import './ProductManagement.css'; 
import { supabase } from '../../supabaseClient';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

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
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/api/admin/orders');
      if (response.ok) {
        setOrders(await response.json());
      }
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
      const response = await apiFetch(`/api/admin/orders/${id}`);
      if (response.ok) {
        setSelectedOrder(await response.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await apiFetch(`/api/admin/orders/${id}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchOrders();
        if (selectedOrder?.id === id) {
          fetchOrderDetails(id);
        }
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.clients?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id.toString().includes(searchQuery)
  );

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
      <div className="admin-toolbar">
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'rgba(255,255,255,0.4)' }} />
          <input 
            type="text" 
            placeholder="Search orders or customers..." 
            className="search-input"
            style={{ paddingLeft: '2.5rem', width: '300px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                <tr key={order.id}>
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
