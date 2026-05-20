import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Store, Save, CheckCircle, Loader2, Mail, Smartphone, MapPin, Package, Megaphone } from 'lucide-react';
import './ProductManagement.css';
import { api } from '../../services/api';

const DEFAULTS = {
  store_name: 'Suvai Premium Spices',
  support_email: 'support@rajasuvai.com',
  business_phone: '+91 98765 43210',
  warehouse_address: '12, Kuruvikkaran Salai, Anna Nagar, Madurai, Tamil Nadu 625020',
  low_stock_threshold: '10',
  shipping_fee: '50',
  announcement_enabled: 'true',
  announcement_text: 'Free shipping on orders above ₹500 | Use code SPICE10 for 10% off'
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/admin/settings').then(data => {
      if (data && !data.error) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    }).finally(() => setLoading(false));
  }, []);

  const set = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await api.put('/api/admin/settings', settings);
      if (res.error) {
        setError(res.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <Loader2 className="animate-spin" size={32} color="#f9a826" />
    </div>
  );

  return (
    <div style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <form onSubmit={handleSave}>
        {/* Store Info */}
        <div className="dashboard-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#f9a826' }}>
            <Store size={18} /> Store Information
          </h3>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Store Name</label>
            <input className="search-input" style={{ width: '100%' }} value={settings.store_name} onChange={e => set('store_name', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label><Mail size={12} style={{ marginRight: 4 }} />Support Email</label>
              <input type="email" className="search-input" style={{ width: '100%' }} value={settings.support_email} onChange={e => set('support_email', e.target.value)} />
            </div>
            <div className="form-group">
              <label><Smartphone size={12} style={{ marginRight: 4 }} />Business Phone</label>
              <input className="search-input" style={{ width: '100%' }} value={settings.business_phone} onChange={e => set('business_phone', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label><MapPin size={12} style={{ marginRight: 4 }} />Warehouse Address</label>
            <textarea className="search-input" style={{ width: '100%', minHeight: '70px', padding: '0.75rem' }} value={settings.warehouse_address} onChange={e => set('warehouse_address', e.target.value)} />
          </div>
        </div>

        {/* Commerce Settings */}
        <div className="dashboard-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#f9a826' }}>
            <Package size={18} /> Commerce Settings
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Low Stock Alert Threshold</label>
              <input type="number" min="1" className="search-input" style={{ width: '100%' }} value={settings.low_stock_threshold} onChange={e => set('low_stock_threshold', e.target.value)} />
              <small style={{ color: 'rgba(255,255,255,0.3)', display: 'block', marginTop: 4 }}>Alert triggers below this quantity</small>
            </div>
            <div className="form-group">
              <label>Shipping Fee (₹)</label>
              <input type="number" min="0" className="search-input" style={{ width: '100%' }} value={settings.shipping_fee} onChange={e => set('shipping_fee', e.target.value)} />
              <small style={{ color: 'rgba(255,255,255,0.3)', display: 'block', marginTop: 4 }}>Flat shipping fee applied at checkout</small>
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="dashboard-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#f9a826' }}>
            <Megaphone size={18} /> Announcement Bar
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.announcement_enabled === 'true'}
                onChange={e => set('announcement_enabled', e.target.checked ? 'true' : 'false')}
              />
              <span>Enable announcement bar on site</span>
            </label>
          </div>
          <div className="form-group">
            <label>Announcement Text</label>
            <input className="search-input" style={{ width: '100%' }} value={settings.announcement_text} onChange={e => set('announcement_text', e.target.value)} disabled={settings.announcement_enabled !== 'true'} />
          </div>
        </div>

        {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem' }} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && (
            <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle size={18} /> Settings saved!
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default Settings;
