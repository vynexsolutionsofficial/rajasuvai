import React, { useState, useEffect } from 'react';
import { Ticket, CreditCard, Plus, Trash2, CheckCircle, XCircle, Clock, Tag } from 'lucide-react';
import { api } from '../../services/api';
import { DataTable } from '../../components/ui/DataTable';
import { Sheet } from '../../components/ui/Sheet';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/cn';

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
  orders?: { id: number; clients?: { name: string; email: string } };
}

const paymentStatusStyles: Record<string, string> = {
  Success: 'bg-fresh-100 text-fresh-700',
  Failed: 'bg-error-50 text-error-600',
  Pending: 'bg-amber-100 text-amber-700',
};

const OffersManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coupons' | 'payments'>('coupons');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({ discount_type: 'percentage', usage_limit: 100 });

  useEffect(() => {
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
    fetchData();
  }, [activeTab]);

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/api/admin/${activeTab}`);
      if (data) {
        if (activeTab === 'coupons') setCoupons(data);
        else setPayments(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api.post('/api/admin/coupons', newCoupon);
      if (!data.error) {
        refetch();
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
      if (!data.error) refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {([['coupons', Ticket], ['payments', CreditCard]] as const).map(([tab, Icon]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold capitalize',
              activeTab === tab ? 'bg-brand-500 text-white' : 'border border-black/10 text-black/55 hover:bg-black/5'
            )}
          >
            <Icon size={16} /> {tab}
          </button>
        ))}
      </div>

      {activeTab === 'coupons' ? (
        <DataTable
          data={coupons}
          rowKey={(c) => c.id}
          loading={loading}
          emptyTitle="No coupons yet"
          emptyDescription="Create a coupon to start offering discounts."
          actions={<Button onClick={() => setIsModalOpen(true)}><Plus size={18} /> Create Coupon</Button>}
          columns={[
            {
              header: 'Code',
              render: (c) => (
                <span className="flex items-center gap-1.5 font-bold text-brand-600"><Tag size={15} /> {c.code}</span>
              ),
            },
            { header: 'Discount', render: (c) => `${c.value}${c.discount_type === 'percentage' ? '%' : ' OFF'}` },
            { header: 'Expiry', render: (c) => (c.expiry_date ? new Date(c.expiry_date).toLocaleDateString() : 'Never') },
            { header: 'Usage', render: (c) => `${c.used_count} / ${c.usage_limit}` },
            {
              header: 'Status',
              render: (c) => (
                <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold capitalize', c.status === 'active' ? 'bg-fresh-100 text-fresh-700' : 'bg-black/5 text-black/50')}>
                  {c.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              render: (c) => (
                <button onClick={() => handleDeleteCoupon(c.id)} className="flex size-8 items-center justify-center rounded-lg text-error-600 hover:bg-error-50">
                  <Trash2 size={15} />
                </button>
              ),
            },
          ]}
        />
      ) : (
        <DataTable
          data={payments}
          rowKey={(p) => p.id}
          loading={loading}
          emptyTitle="No payments recorded"
          columns={[
            { header: 'Transaction ID', render: (p) => <span className="text-xs text-black/50">{p.transaction_id || 'N/A'}</span> },
            { header: 'Order', render: (p) => `#${p.order_id}` },
            { header: 'Customer', render: (p) => p.orders?.clients?.name || 'Customer' },
            { header: 'Amount', render: (p) => <span className="font-semibold">₹{p.amount}</span> },
            {
              header: 'Status',
              render: (p) => (
                <span className={cn('flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', paymentStatusStyles[p.status])}>
                  {p.status === 'Success' ? <CheckCircle size={13} /> : p.status === 'Failed' ? <XCircle size={13} /> : <Clock size={13} />}
                  {p.status}
                </span>
              ),
            },
            { header: 'Date', render: (p) => new Date(p.created_at).toLocaleString() },
          ]}
        />
      )}

      <Sheet open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Coupon" side="right">
        <form onSubmit={handleCreateCoupon} className="space-y-4 p-5">
          <Field label="Coupon Code">
            <Input placeholder="e.g. SAVE20" required onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Type">
              <select
                onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value as any })}
                className="h-11 w-full rounded-xl border border-black/10 px-3.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </Field>
            <Field label="Value">
              <Input type="number" required onChange={(e) => setNewCoupon({ ...newCoupon, value: parseFloat(e.target.value) })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Usage Limit">
              <Input type="number" defaultValue={100} onChange={(e) => setNewCoupon({ ...newCoupon, usage_limit: parseInt(e.target.value) })} />
            </Field>
            <Field label="Expiry Date">
              <Input type="date" onChange={(e) => setNewCoupon({ ...newCoupon, expiry_date: e.target.value })} />
            </Field>
          </div>
          <Button type="submit" className="w-full">Create Coupon</Button>
        </form>
      </Sheet>
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold text-black/50">{label}</label>
    {children}
  </div>
);

export default OffersManagement;
