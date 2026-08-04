import React, { useState, useEffect } from 'react';
import {
  Loader2, Mail, Phone, ShoppingBag, Calendar, Shield, ShieldCheck,
  User as UserIcon, Eye, UserX, UserCheck, Download,
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { DataTable } from '../../components/ui/DataTable';
import { Sheet } from '../../components/ui/Sheet';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/cn';

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
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const orderStatusColor = (status: string) =>
  status === 'Delivered' ? 'border-fresh-500' : status === 'Cancelled' ? 'border-error-500' : 'border-brand-500';

const UserManagement: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`${newRole === 'admin' ? 'Promote' : 'Demote'} ${user.name} to ${newRole}?`)) return;
    setUpdatingId(user.id);
    try {
      await api.patch(`/api/admin/users/${user.id}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
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
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_active: newStatus } : u)));
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
    const rows = filteredUsers.map((u) => ({
      id: u.id, name: u.name, email: u.email, phone: u.phone || '', role: u.role,
      status: u.is_active ? 'active' : 'disabled', orders: u.order_count,
      joined: new Date(u.created_at).toISOString().split('T')[0],
    }));
    exportToCsv(`suvai-users-${new Date().toISOString().split('T')[0]}.csv`, rows);
    showToast(`Exported ${rows.length} users`, 'success');
  };

  const filteredUsers = users.filter((u) => u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-5">
      <DataTable
        data={filteredUsers}
        rowKey={(u) => u.id}
        loading={loading && users.length === 0}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name or email..."
        emptyTitle="No users found"
        actions={<Button variant="outline" size="sm" onClick={handleExportCsv} disabled={filteredUsers.length === 0}><Download size={15} /> Export CSV</Button>}
        columns={[
          {
            header: 'Customer',
            render: (u) => (
              <div className={cn('flex items-center gap-3', !u.is_active && 'opacity-45')}>
                <div className="flex size-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {u.name?.charAt(0) || <UserIcon size={14} />}
                </div>
                <div>
                  <div className="font-semibold text-brand-950">{u.name}</div>
                  <div className="text-xs text-black/40">UID: #{u.id}</div>
                </div>
              </div>
            ),
          },
          {
            header: 'Contact',
            render: (u) => (
              <div className="space-y-1 text-xs text-black/60">
                <div className="flex items-center gap-1.5"><Mail size={12} /> {u.email}</div>
                <div className="flex items-center gap-1.5"><Phone size={12} /> {u.phone || 'N/A'}</div>
              </div>
            ),
          },
          { header: 'Orders', render: (u) => <span className="flex items-center gap-1.5 text-sm"><ShoppingBag size={13} className="text-brand-500" /> {u.order_count}</span> },
          { header: 'Joined', render: (u) => <span className="flex items-center gap-1.5 text-sm"><Calendar size={13} className="text-black/35" /> {new Date(u.created_at).toLocaleDateString()}</span> },
          {
            header: 'Role',
            render: (u) => (
              <span className={cn('flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize', u.role === 'admin' ? 'bg-brand-100 text-brand-700' : 'bg-black/5 text-black/55')}>
                {u.role === 'admin' ? <ShieldCheck size={12} /> : <Shield size={12} />} {u.role}
              </span>
            ),
          },
          {
            header: 'Status',
            render: (u) => (
              <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', u.is_active ? 'bg-fresh-100 text-fresh-700' : 'bg-error-50 text-error-600')}>
                {u.is_active ? 'Active' : 'Disabled'}
              </span>
            ),
          },
          {
            header: 'Actions',
            render: (user) => (
              <div className="flex gap-1.5">
                <button onClick={() => viewUserOrders(user)} title="View Orders" className="flex size-8 items-center justify-center rounded-lg text-black/50 hover:bg-black/5"><Eye size={15} /></button>
                <button onClick={() => toggleRole(user)} disabled={updatingId === user.id} title={user.role === 'admin' ? 'Demote to Customer' : 'Promote to Admin'} className="flex size-8 items-center justify-center rounded-lg text-black/50 hover:bg-black/5">
                  {updatingId === user.id ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={15} />}
                </button>
                <button onClick={() => toggleStatus(user)} disabled={updatingId === user.id} title={user.is_active ? 'Disable Account' : 'Enable Account'} className="flex size-8 items-center justify-center rounded-lg text-error-600 hover:bg-error-50">
                  {user.is_active ? <UserX size={15} /> : <UserCheck size={15} />}
                </button>
              </div>
            ),
          },
        ]}
      />

      <Sheet open={!!viewingUser} onClose={() => setViewingUser(null)} title={`Orders by ${viewingUser?.name || ''}`} side="right">
        <div className="p-5">
          {ordersLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="size-8 animate-spin text-brand-500" /></div>
          ) : userOrders.length === 0 ? (
            <p className="py-16 text-center text-sm text-black/40">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {userOrders.map((order) => (
                <div key={order.id} className={cn('rounded-xl border-l-4 bg-black/[0.02] p-4', orderStatusColor(order.status))}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-950">#{order.id}</span>
                    <span className="text-xs font-semibold text-black/50">{order.status}</span>
                  </div>
                  <div className="mt-1 text-xs text-black/45">{new Date(order.created_at).toLocaleString()} · ₹{order.total_price}</div>
                  {order.order_items && order.order_items.length > 0 && (
                    <div className="mt-1.5 text-xs text-black/55">{order.order_items.map((i) => `${i.products?.name || 'Item'} × ${i.quantity}`).join(' · ')}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Sheet>
    </div>
  );
};

export default UserManagement;
