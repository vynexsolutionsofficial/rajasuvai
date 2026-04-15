import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  AlertTriangle,
  Award,
  Package,
  History,
  Activity
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import './Dashboard.css';
import { api } from '../../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalClients: 0
  });
  const [analytics, setAnalytics] = useState<{ month: string, amount: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string, qty: number }[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [sData, aData] = await Promise.all([
          api.get('/api/admin/dashboard-stats'),
          api.get('/api/admin/analytics')
        ]);
        
        if (sData) {
          setStats({
            totalSales: sData.totalRevenue,
            totalOrders: sData.totalOrders,
            totalProducts: sData.totalProducts || 0,
            totalClients: sData.totalUsers
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
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="loader" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#f9a826', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.5)' }}>Generating Analytics...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(74, 222, 128, 0.2)', color: '#4ade80' }}>
            <DollarSign size={24} />
          </div>
          <div className="metric-label">Total Revenue</div>
          <div className="metric-value">₹{stats.totalSales.toLocaleString()}</div>
          <div className="metric-trend trend-up">
            <ArrowUpRight size={14} /> +12.5% Growth
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
            <ShoppingBag size={24} />
          </div>
          <div className="metric-label">Total Orders</div>
          <div className="metric-value">{stats.totalOrders}</div>
          <div className="metric-trend trend-up">
            <ArrowUpRight size={14} /> +5.2% Volume
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7' }}>
            <Users size={24} />
          </div>
          <div className="metric-label">Total Customers</div>
          <div className="metric-value">{stats.totalClients}</div>
          <div className="metric-trend trend-up">
            <ArrowUpRight size={14} /> +4.1% Acquisition
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(249, 168, 38, 0.2)', color: '#f9a826' }}>
            <Activity size={24} />
          </div>
          <div className="metric-label">Live Inventory</div>
          <div className="metric-value">{stats.totalProducts}</div>
          <div className="metric-trend trend-up">
            <ArrowUpRight size={14} /> Active Products
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-container" style={{ flex: 2 }}>
          <h3 className="chart-title"><TrendingUp size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}/> Revenue Overview</h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <AreaChart data={analytics}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f9a826" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f9a826" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#f9a826', fontWeight: 600 }}
                  labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#f9a826" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 className="chart-title"><Award size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}/> Top Selling</h3>
            <div className="recent-orders-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {topProducts.length > 0 ? (
                topProducts.map((p, idx) => (
                  <div className="order-item-mini" key={idx} style={{ borderLeft: '3px solid #f9a826' }}>
                    <div className="order-info-mini">
                      <h4 style={{ color: '#fff' }}>{p.name}</h4>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>Leaderboard Rank #{idx + 1}</span>
                    </div>
                    <div className="status-badge" style={{ background: 'rgba(249, 168, 38, 0.1)', color: '#f9a826' }}>
                      {p.qty} Sold
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '2rem' }}>
                  Awaiting Sales Data
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="chart-title"><AlertTriangle size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}/> Stock Alerts</h3>
            <div className="recent-orders-list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((item) => (
                  <div className="order-item-mini" key={item.id} style={{ borderLeft: '3px solid #ef4444' }}>
                    <div className="order-info-mini">
                      <h4>{item.products?.name}</h4>
                      <span style={{ color: '#ef4444' }}>Only {item.quantity} units left</span>
                    </div>
                    <div className="status-badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                      Restock
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#4ade80', padding: '1rem', background: 'rgba(74, 222, 128, 0.05)', borderRadius: '8px' }}>
                  <Package size={16} /> Inventory Healthy
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: '1.5rem' }}>
        <h3 className="chart-title"><History size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}/> Recent Sales Activity</h3>
        <div className="recent-orders-list">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div className="order-item-mini" key={order.id} style={{ padding: '1rem' }}>
                <div className="order-info-mini">
                  <h4 style={{ color: '#fff' }}>{order.clients?.name || 'Customer'}</h4>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>Order #{order.id} • {new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#f9a826', marginBottom: '0.25rem' }}>₹{order.total_price}</div>
                  <div className={`status-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '2rem' }}>
              No recent activity recorded
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
