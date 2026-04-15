import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  CreditCard, 
  Plus, 
  Trash2, 
  Loader2, 
  CheckCircle, 
  XCircle,
  Clock,
  Tag,
  X
} from 'lucide-react';
import './OffersManagement.css';
import { api } from '../../services/api';

interface Coupon {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  value: number;
  expiry_date: string;
  usage_limit: number;
  used_count: number;
  status: 'active' | 'inactive';
}

interface Payment {
  id: number;
  order_id: number;
  transaction_id: string;
  amount: number;
  status: 'Pending' | 'Success' | 'Failed';
  provider: string;
  created_at: string;
  orders?: { 
    id: number;
    clients?: { name: string; email: string }
  };
}

const OffersManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coupons' | 'payments'>('coupons');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    discount_type: 'percentage',
    usage_limit: 100
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/api/admin/${activeTab}`);
      if (data) {
        if (activeTab === 'coupons') setCoupons(data);
        else setPayments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api.post('/api/admin/coupons', newCoupon);
      if (!data.error) {
        fetchData();
        setIsModalOpen(false);
        setNewCoupon({ discount_type: 'percentage', usage_limit: 100 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (id: number) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      const data = await api.delete(`/api/admin/coupons/${id}`);
      if (!data.error) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="offers-mgmt">
      <div className="tab-header">
        <button 
          className={`tab-btn ${activeTab === 'coupons' ? 'active' : ''}`}
          onClick={() => setActiveTab('coupons')}
        >
          <Ticket size={18} /> Coupons
        </button>
        <button 
          className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          <CreditCard size={18} /> Payments
        </button>
      </div>

      <div className="admin-toolbar">
        <div></div> {/* Spacer */}
        {activeTab === 'coupons' && (
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} /> Create Coupon
          </button>
        )}
      </div>

      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : activeTab === 'coupons' ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Expiry</th>
                <th>Usage</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#f9a826' }}>
                      <Tag size={16} /> {coupon.code}
                    </div>
                  </td>
                  <td>{coupon.value}{coupon.discount_type === 'percentage' ? '%' : ' OFF'}</td>
                  <td>{coupon.expiry_date ? new Date(coupon.expiry_date).toLocaleDateString() : 'Never'}</td>
                  <td>{coupon.used_count} / {coupon.usage_limit}</td>
                  <td>
                    <div className={`status-pill ${coupon.status}`}>
                      {coupon.status}
                    </div>
                  </td>
                  <td>
                    <button className="btn-icon delete" onClick={() => handleDeleteCoupon(coupon.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id}>
                  <td style={{ fontSize: '0.8rem', opacity: 0.7 }}>{payment.transaction_id || 'N/A'}</td>
                  <td>#{payment.order_id}</td>
                  <td>{payment.orders?.clients?.name || 'Customer'}</td>
                  <td style={{ fontWeight: 600 }}>₹{payment.amount}</td>
                  <td>
                    <div className={`status-badge status-${payment.status.toLowerCase()}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {payment.status === 'Success' ? <CheckCircle size={14}/> : payment.status === 'Failed' ? <XCircle size={14}/> : <Clock size={14}/>}
                      {payment.status}
                    </div>
                  </td>
                  <td>{new Date(payment.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="admin-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2>Create New Coupon</h2>
              <X size={24} onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer' }} />
            </div>
            <form onSubmit={handleCreateCoupon}>
              <div className="form-group">
                <label>Coupon Code</label>
                <input 
                  type="text" 
                  placeholder="e.g. SAVE20"
                  required
                  onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Type</label>
                  <select onChange={e => setNewCoupon({...newCoupon, discount_type: e.target.value as any})}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Value</label>
                  <input 
                    type="number" 
                    required
                    onChange={e => setNewCoupon({...newCoupon, value: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Usage Limit</label>
                  <input 
                    type="number" 
                    defaultValue={100}
                    onChange={e => setNewCoupon({...newCoupon, usage_limit: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Expiry Date</label>
                  <input 
                    type="date" 
                    onChange={e => setNewCoupon({...newCoupon, expiry_date: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                Create Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersManagement;
