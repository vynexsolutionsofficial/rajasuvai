import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, AlertTriangle,
  Award, Package, History, Activity, Calendar,
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { api } from '../../services/api';
import { Skeleton } from '../../components/ui/Skeleton';
import { cn } from '../../lib/cn';

const toInputDate = (d: Date) => d.toISOString().split('T')[0];

const metricStyles = {
  green: { bg: 'bg-fresh-100', text: 'text-fresh-700' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700' },
  brand: { bg: 'bg-brand-100', text: 'text-brand-700' },
};

const Dashboard: React.FC = () => {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const [dateFrom, setDateFrom] = useState(toInputDate(firstOfMonth));
  const [dateTo, setDateTo] = useState(toInputDate(now));
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0, totalClients: 0 });
  const [analytics, setAnalytics] = useState<{ month: string; amount: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; qty: number }[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const params = dateFrom && dateTo ? `?from=${dateFrom}&to=${dateTo}` : '';
        const [sData, aData] = await Promise.all([
          api.get(`/api/admin/dashboard-stats${params}`),
          api.get('/api/admin/analytics'),
        ]);
        if (sData) {
          setStats({
            totalSales: sData.totalRevenue,
            totalOrders: sData.totalOrders,
            totalProducts: sData.totalProducts || 0,
            totalClients: sData.totalUsers,
          });
          setRecentOrders(sData.recentOrders || []);
          setLowStockProducts(sData.lowStock || []);
        }
        if (aData) {
          setAnalytics(aData.monthlyRevenue);
          setTopProducts(aData.topProducts);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [dateFrom, dateTo]);

  const metrics = [
    { label: 'Total Revenue', value: `₹${stats.totalSales.toLocaleString()}`, trend: '+12.5% Growth', icon: DollarSign, color: 'green' as const },
    { label: 'Total Orders', value: stats.totalOrders, trend: '+5.2% Volume', icon: ShoppingBag, color: 'blue' as const },
    { label: 'Total Customers', value: stats.totalClients, trend: '+4.1% Acquisition', icon: Users, color: 'purple' as const },
    { label: 'Live Inventory', value: stats.totalProducts, trend: 'Active Products', icon: Activity, color: 'brand' as const },
  ];

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-black/5 bg-white px-5 py-3.5">
        <Calendar size={16} className="text-black/40" />
        <span className="text-xs font-bold tracking-wide text-black/40">REVENUE PERIOD</span>
        <input type="date" value={dateFrom} max={dateTo} onChange={(e) => setDateFrom(e.target.value)} className="rounded-lg border border-black/10 px-3 py-1.5 text-sm" />
        <span className="text-black/30">→</span>
        <input type="date" value={dateTo} min={dateFrom} onChange={(e) => setDateTo(e.target.value)} className="rounded-lg border border-black/10 px-3 py-1.5 text-sm" />
        <button
          onClick={() => { const t = new Date(); setDateFrom(toInputDate(new Date(t.getFullYear(), t.getMonth(), 1))); setDateTo(toInputDate(t)); }}
          className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-semibold text-black/55 hover:bg-black/5"
        >
          This Month
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map(({ label, value, trend, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-black/5 bg-white p-5">
            <div className={cn('flex size-11 items-center justify-center rounded-xl', metricStyles[color].bg, metricStyles[color].text)}>
              <Icon size={20} />
            </div>
            <p className="mt-3 text-xs font-semibold text-black/45">{label}</p>
            <p className="mt-0.5 font-display text-2xl font-bold text-brand-950">{value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-fresh-600">
              <ArrowUpRight size={12} /> {trend}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-white p-5 lg:col-span-2">
          <h3 className="flex items-center gap-2 text-sm font-bold text-brand-950">
            <TrendingUp size={16} className="text-brand-500" /> Revenue Overview
          </h3>
          <div className="mt-4 h-[300px]">
            <ResponsiveContainer>
              <AreaChart data={analytics}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e67e00" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e67e00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
                <XAxis dataKey="month" stroke="#00000060" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#00000060" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #eee', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} itemStyle={{ color: '#e67e00', fontWeight: 600 }} />
                <Area type="monotone" dataKey="amount" stroke="#e67e00" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-black/5 bg-white p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-brand-950">
              <Award size={16} className="text-brand-500" /> Top Selling
            </h3>
            <div className="mt-3 max-h-[200px] space-y-2 overflow-y-auto">
              {topProducts.length > 0 ? topProducts.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg border-l-2 border-brand-500 bg-brand-50/50 px-3 py-2">
                  <div>
                    <h4 className="text-xs font-semibold text-brand-950">{p.name}</h4>
                    <span className="text-[11px] text-black/40">Rank #{idx + 1}</span>
                  </div>
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-bold text-brand-700">{p.qty} Sold</span>
                </div>
              )) : <EmptyRow text="Awaiting sales data" />}
            </div>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-brand-950">
              <AlertTriangle size={16} className="text-error-500" /> Stock Alerts
            </h3>
            <div className="mt-3 max-h-[200px] space-y-2 overflow-y-auto">
              {lowStockProducts.length > 0 ? lowStockProducts.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border-l-2 border-error-500 bg-error-50/50 px-3 py-2">
                  <div>
                    <h4 className="text-xs font-semibold text-brand-950">{item.products?.name}</h4>
                    <span className="text-[11px] text-error-600">Only {item.quantity} units left</span>
                  </div>
                  <span className="rounded-full bg-error-100 px-2 py-0.5 text-[11px] font-bold text-error-700">Restock</span>
                </div>
              )) : (
                <div className="flex items-center justify-center gap-2 rounded-lg bg-fresh-50 py-4 text-sm font-medium text-fresh-700">
                  <Package size={16} /> Inventory Healthy
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold text-brand-950">
          <History size={16} className="text-brand-500" /> Recent Sales Activity
        </h3>
        <div className="mt-3 divide-y divide-black/5">
          {recentOrders.length > 0 ? recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between py-3">
              <div>
                <h4 className="text-sm font-semibold text-brand-950">{order.clients?.name || 'Customer'}</h4>
                <span className="text-xs text-black/40">Order #{order.id} · {new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-brand-600">₹{order.total_price}</div>
                <span className="text-xs font-medium text-black/50">{order.status}</span>
              </div>
            </div>
          )) : <EmptyRow text="No recent activity recorded" />}
        </div>
      </div>
    </div>
  );
};

const EmptyRow: React.FC<{ text: string }> = ({ text }) => (
  <div className="py-6 text-center text-xs text-black/35">{text}</div>
);

export default Dashboard;
