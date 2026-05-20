import React, { useState, useEffect } from 'react';
import {
  Search,
  Loader2,
  Mail,
  Phone,
  ShoppingBag,
  Calendar,
  Shield,
  ShieldCheck,
  User as UserIcon,
  Eye,
  UserX,
  UserCheck,
  Download,
  X
} from 'lucide-react';
import './UserManagement.css';
import './ProductManagement.css';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  is_active: boolean;
  created_at: string;
  order_count: number;
}

interface UserOrder {
  id: number;
  status: string;
  total_price: number;
  created_at: string;
  order_items?: { id: number; quantity: number; unit_price: number; products?: { name: string } }[];
}

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

const UserManagement: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/admin/users');
      setUsers(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`${newRole === 'admin' ? 'Promote' : 'Demote'} ${user.name} to ${newRole}?`)) return;
    setUpdatingId(user.id);
    try {
      await api.patch(`/api/admin/users/${user.id}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
      showToast(`Role updated to ${newRole}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update role', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleStatus = async (user: User) => {
    const newStatus = !user.is_active;
    const action = newStatus ? 'enable' : 'disable';
    if (!window.confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} ${user.name}'s account?`)) return;
    setUpdatingId(user.id);
    try {
      await api.patch(`/api/admin/users/${user.id}/status`, { is_active: newStatus });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: newStatus } : u));
      showToast(`Account ${newStatus ? 'enabled' : 'disabled'}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const viewUserOrders = async (user: User) => {
    setViewingUser(user);
    setOrdersLoading(true);
    try {
      const data = await api.get(`/api/admin/users/${user.id}/orders`);
      setUserOrders(data || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load orders', 'error');
      setUserOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleExportCsv = () => {
    const rows = filteredUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      role: u.role,
      status: u.is_active ? 'active' : 'disabled',
      orders: u.order_count,
      joined: new Date(u.created_at).toISOString().split('T')[0]
    }));
    exportToCsv(`suvai-users-${new Date().toISOString().split('T')[0]}.csv`, rows);
    showToast(`Exported ${rows.length} users`, 'success');
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user-mgmt">
      <div className="admin-toolbar">
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'rgba(255,255,255,0.4)' }} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="search-input"
            style={{ paddingLeft: '2.5rem', width: '300px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn-secondary" onClick={handleExportCsv} disabled={filteredUsers.length === 0}>
          <Download size={16} style={{ marginRight: '0.4rem' }} />
          Export CSV
        </button>
      </div>

      <div className="admin-table-container">
        {loading && users.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={32} />
            <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.4)' }}>Loading users...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer Info</th>
                <th>Contact</th>
                <th>Orders</th>
                <th>Joined</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ opacity: user.is_active ? 1 : 0.45 }}>
                  <td>
                    <div className="user-info-cell">
                      <div className="user-avatar-mini">{user.name?.charAt(0) || <UserIcon size={16}/>}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>UID: #{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="contact-item"><Mail size={14} /> {user.email}</div>
                      <div className="contact-item"><Phone size={14} /> {user.phone || 'N/A'}</div>
                    </div>
                  </td>
                  <td>
                    <div className="stats-pill">
                      <ShoppingBag size={14} />
                      {user.order_count} Orders
                    </div>
                  </td>
                  <td>
                    <div className="joined-date">
                      <Calendar size={14} />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className={`role-badge ${user.role}`}>
                      {user.role === 'admin' ? <ShieldCheck size={12} /> : <Shield size={12} />}
                      {user.role}
                    </div>
                  </td>
                  <td>
                    <div className={`status-pill ${user.is_active ? 'good' : 'out'}`}>
                      {user.is_active ? 'Active' : 'Disabled'}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => viewUserOrders(user)}
                        title="View Orders"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => toggleRole(user)}
                        disabled={updatingId === user.id}
                        title={user.role === 'admin' ? 'Demote to Customer' : 'Promote to Admin'}
                      >
                        {updatingId === user.id ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={16} />}
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() => toggleStatus(user)}
                        disabled={updatingId === user.id}
                        title={user.is_active ? 'Disable Account' : 'Enable Account'}
                      >
                        {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {viewingUser && (
        <div className="modal-overlay" onClick={() => setViewingUser(null)}>
          <div className="admin-modal" style={{ width: '700px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2>Orders by {viewingUser.name}</h2>
              <X size={24} onClick={() => setViewingUser(null)} style={{ cursor: 'pointer' }} />
            </div>

            {ordersLoading ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : userOrders.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                No orders yet.
              </div>
            ) : (
              <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {userOrders.map(order => (
                  <div key={order.id} style={{
                    background: 'rgba(255,255,255,0.04)',
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    marginBottom: '0.75rem',
                    borderLeft: `3px solid ${order.status === 'Delivered' ? '#4ade80' : order.status === 'Cancelled' ? '#ef4444' : '#f9a826'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 700 }}>#{order.id}</div>
                      <div className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>
                      {new Date(order.created_at).toLocaleString()} · ₹{order.total_price}
                    </div>
                    {order.order_items && order.order_items.length > 0 && (
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                        {order.order_items.map(i => `${i.products?.name || 'Item'} × ${i.quantity}`).join(' · ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
