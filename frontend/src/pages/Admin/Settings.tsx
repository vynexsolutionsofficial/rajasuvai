import React, { useState, useEffect } from 'react';
import { Store, Save, CheckCircle, Mail, Smartphone, MapPin, Package, Megaphone } from 'lucide-react';
import { api } from '../../services/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';

const DEFAULTS = {
  store_name: 'Suvai Premium Spices',
  support_email: 'support@rajasuvai.com',
  business_phone: '+91 98765 43210',
  warehouse_address: '12, Kuruvikkaran Salai, Anna Nagar, Madurai, Tamil Nadu 625020',
  low_stock_threshold: '10',
  shipping_fee: '50',
  announcement_enabled: 'true',
  announcement_text: 'Free shipping on orders above ₹500 | Use code SPICE10 for 10% off',
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/admin/settings')
      .then((data) => {
        if (data && !data.error) setSettings((prev) => ({ ...prev, ...data }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (key: string, value: string) => setSettings((prev) => ({ ...prev, [key]: value }));

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

  if (loading) {
    return (
      <div className="max-w-3xl space-y-5">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="max-w-3xl space-y-5">
      <Card icon={<Store size={17} />} title="Store Information">
        <Field label="Store Name">
          <Input value={settings.store_name} onChange={(e) => set('store_name', e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Support Email" icon={<Mail size={12} />}>
            <Input type="email" value={settings.support_email} onChange={(e) => set('support_email', e.target.value)} />
          </Field>
          <Field label="Business Phone" icon={<Smartphone size={12} />}>
            <Input value={settings.business_phone} onChange={(e) => set('business_phone', e.target.value)} />
          </Field>
        </div>
        <Field label="Warehouse Address" icon={<MapPin size={12} />}>
          <textarea
            value={settings.warehouse_address}
            onChange={(e) => set('warehouse_address', e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </Field>
      </Card>

      <Card icon={<Package size={17} />} title="Commerce Settings">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Low Stock Alert Threshold" hint="Alert triggers below this quantity">
            <Input type="number" min={1} value={settings.low_stock_threshold} onChange={(e) => set('low_stock_threshold', e.target.value)} />
          </Field>
          <Field label="Shipping Fee (₹)" hint="Flat shipping fee applied at checkout">
            <Input type="number" min={0} value={settings.shipping_fee} onChange={(e) => set('shipping_fee', e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card icon={<Megaphone size={17} />} title="Announcement Bar">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-black/70">
          <input
            type="checkbox"
            checked={settings.announcement_enabled === 'true'}
            onChange={(e) => set('announcement_enabled', e.target.checked ? 'true' : 'false')}
            className="size-4 accent-brand-500"
          />
          Enable announcement bar on site
        </label>
        <Field label="Announcement Text">
          <Input
            value={settings.announcement_text}
            onChange={(e) => set('announcement_text', e.target.value)}
            disabled={settings.announcement_enabled !== 'true'}
          />
        </Field>
      </Card>

      {error && <p className="rounded-lg bg-error-50 px-3.5 py-2.5 text-sm font-medium text-error-600">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={saving} loading={saving}>
          {!saving && <Save size={16} />} {saving ? 'Saving...' : 'Save Settings'}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-fresh-600">
            <CheckCircle size={16} /> Settings saved!
          </span>
        )}
      </div>
    </form>
  );
};

const Card: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="space-y-4 rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
    <h3 className="flex items-center gap-2 text-sm font-bold text-brand-950">
      <span className="text-brand-500">{icon}</span> {title}
    </h3>
    {children}
  </div>
);

const Field: React.FC<{ label: string; icon?: React.ReactNode; hint?: string; children: React.ReactNode }> = ({ label, icon, hint, children }) => (
  <div>
    <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-black/50">
      {icon} {label}
    </label>
    {children}
    {hint && <p className="mt-1 text-xs text-black/35">{hint}</p>}
  </div>
);

export default Settings;
