import React, { useState, useEffect } from 'react';
import {
  User, Package, MapPin, LogOut, CheckCircle, AlertCircle, Save, Loader2,
  Shield, Bell, Plus, Camera, Pencil, Trash2,
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { api } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Sheet } from '../../components/ui/Sheet';
import { EmptyState } from '../../components/ui/EmptyState';
import { cn } from '../../lib/cn';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  photo_url?: string;
}

interface Address {
  id: number;
  full_name: string;
  phone: string;
  pincode: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  tag: string;
  is_default: boolean;
}

interface OrderItem {
  id: number;
  quantity: number;
  unit_price: number;
  products: { name: string; image: string };
}

interface Order {
  id: number;
  status: string;
  total_price: number;
  created_at: string;
  order_items: OrderItem[];
}

type TabType = 'account' | 'orders' | 'addresses' | 'security' | 'notifications';

const TABS: { id: TabType; label: string; mobileLabel: string; icon: React.ReactNode }[] = [
  { id: 'account', label: 'My Profile', mobileLabel: 'Profile', icon: <User size={18} /> },
  { id: 'orders', label: 'Order History', mobileLabel: 'Orders', icon: <Package size={18} /> },
  { id: 'addresses', label: 'My Addresses', mobileLabel: 'Addresses', icon: <MapPin size={18} /> },
  { id: 'security', label: 'Security', mobileLabel: 'Security', icon: <Shield size={18} /> },
  { id: 'notifications', label: 'Notifications', mobileLabel: 'Alerts', icon: <Bell size={18} /> },
];

const emptyAddress: Partial<Address> = {
  full_name: '', phone: '', pincode: '', address_line1: '',
  address_line2: '', city: '', state: '', tag: 'Home', is_default: false
};

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAddresses = async () => {
    try {
      const data = await api.get('/api/addresses');
      if (data) setAddresses(data);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileData, ordersData] = await Promise.all([
          api.get('/api/users/profile'),
          api.get('/api/orders/my-orders'),
        ]);
        if (profileData) setProfile(profileData);
        if (ordersData) setOrders(ordersData);
        await fetchAddresses();
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setMessage(null);
    try {
      const resData = await api.patch('/api/users/profile', {
        name: profile.name, phone: profile.phone, address: profile.address,
      });
      if (!resData.error) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: resData.error || 'Failed to update profile.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Connection error.' });
    } finally {
      setSaving(false);
    }
  };

  const [selectedOrderForSupport, setSelectedOrderForSupport] = useState<Order | null>(null);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportCategory, setSupportCategory] = useState('Delivery');
  const [supportSuccess, setSupportSuccess] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleChangePassword = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setSavingPassword(true);
    setPasswordMsg(null);
    try {
      const res = await api.patch('/api/users/password', { newPassword: passwordForm.newPassword });
      if (res.error) {
        setPasswordMsg({ type: 'error', text: res.error });
      } else {
        setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
        setPasswordForm({ newPassword: '', confirmPassword: '' });
      }
    } catch {
      setPasswordMsg({ type: 'error', text: 'Connection error. Please try again.' });
    } finally {
      setSavingPassword(false);
    }
  };

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [tempAddress, setTempAddress] = useState<Partial<Address>>(emptyAddress);

  const handlePhotoUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const mockUrl = URL.createObjectURL(file);
    setProfile((prev) => (prev ? { ...prev, photo_url: mockUrl } : null));
    try {
      await api.patch('/api/users/profile', { photo_url: mockUrl });
      setMessage({ type: 'success', text: 'Profile photo updated!' });
    } catch (err) {
      console.error('Error updating photo:', err);
    }
  };

  const handleAddressSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint = editingAddress ? `/api/addresses/${editingAddress.id}` : '/api/addresses';
      const resData = editingAddress ? await api.put(endpoint, tempAddress) : await api.post(endpoint, tempAddress);
      if (!resData.error) {
        await fetchAddresses();
        setShowAddressModal(false);
        setEditingAddress(null);
        setMessage({ type: 'success', text: editingAddress ? 'Address updated!' : 'Address added!' });
      } else {
        setMessage({ type: 'error', text: resData.error || 'Failed to save address.' });
      }
    } catch (err) {
      console.error('Error saving address:', err);
      setMessage({ type: 'error', text: 'Connection error while saving address.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const resData = await api.delete(`/api/addresses/${id}`);
      if (!resData.error) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        setMessage({ type: 'success', text: 'Address deleted.' });
      } else {
        setMessage({ type: 'error', text: resData.error || 'Failed to delete address.' });
      }
    } catch (err) {
      console.error('Error deleting address:', err);
      setMessage({ type: 'error', text: 'Connection error while deleting.' });
    }
  };

  const handleSupportSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/api/support', {
        order_id: selectedOrderForSupport?.id?.toString(),
        subject: `${supportCategory} Issue - Order #${selectedOrderForSupport?.id}`,
        message: supportMessage,
      });
      if (!res.error) {
        setSupportSuccess(true);
        setTimeout(() => {
          setSupportSuccess(false);
          setSelectedOrderForSupport(null);
          setSupportMessage('');
        }, 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to submit ticket. Please try again.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Connection error.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const openAddressModal = (address: Address | null = null) => {
    setEditingAddress(address);
    setTempAddress(address ?? emptyAddress);
    setShowAddressModal(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
        <Loader2 className="size-10 animate-spin text-brand-500" />
        <h3 className="font-display text-lg font-bold text-brand-950">Loading your account...</h3>
        <p className="max-w-sm text-sm text-black/50">Fetching your profile and order details.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-(--container-page) px-4 py-6 sm:px-6 sm:py-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-black/5 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex size-14 items-center justify-center overflow-hidden rounded-full bg-brand-500 text-lg font-bold text-white">
                  {profile?.photo_url ? <img src={profile.photo_url} alt={profile.name} className="size-full object-cover" /> : profile?.name?.charAt(0) || 'U'}
                </div>
                <label htmlFor="photo-upload" className="absolute -right-1 -bottom-1 flex size-6 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-brand-950 text-white">
                  <Camera size={11} />
                  <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpdate} hidden />
                </label>
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-brand-950">{profile?.name}</h3>
                <p className="truncate text-xs text-black/45">{profile?.email}</p>
              </div>
            </div>
            <span className="mt-3 inline-block rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold text-brand-600">SPICE GOLD MEMBER</span>

            <nav className="mt-5 space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold',
                    activeTab === tab.id ? 'bg-brand-50 text-brand-700' : 'text-black/55 hover:bg-black/5'
                  )}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
              <button onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-error-600 hover:bg-error-50">
                <LogOut size={18} /> Log Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Mobile tab strip */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-xs font-semibold',
                activeTab === tab.id ? 'border-brand-500 bg-brand-500 text-white' : 'border-black/10 text-black/55'
              )}
            >
              {tab.mobileLabel}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main>
          {activeTab === 'account' && (
            <Section title="Account Settings" subtitle="Manage your profile details and contact information.">
              <FormMessage message={message} />
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name">
                    <Input value={profile?.name || ''} onChange={(e) => setProfile((p) => (p ? { ...p, name: e.target.value } : null))} required />
                  </Field>
                  <Field label="Email Address">
                    <Input type="email" value={profile?.email || ''} readOnly className="bg-black/[0.03] text-black/50" />
                  </Field>
                  <Field label="Phone Number">
                    <Input type="tel" value={profile?.phone || ''} onChange={(e) => setProfile((p) => (p ? { ...p, phone: e.target.value } : null))} required />
                  </Field>
                </div>
                <Field label="Default Shipping Address">
                  <textarea
                    value={profile?.address || ''}
                    onChange={(e) => setProfile((p) => (p ? { ...p, address: e.target.value } : null))}
                    placeholder="Enter your shipping address..."
                    required
                    rows={3}
                    className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </Field>
                <Button type="submit" disabled={saving} loading={saving}>
                  {!saving && <Save size={16} />} Update Profile
                </Button>
              </form>
            </Section>
          )}

          {activeTab === 'orders' && (
            <Section title="Your Orders" subtitle="View and track all your previous purchases.">
              {orders.length === 0 ? (
                <EmptyState icon={<Package size={28} />} title="No orders yet" description="Start shopping to see your orders here." />
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onCancelled={() => setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: 'Cancelled' } : o)))}
                      onNeedHelp={() => setSelectedOrderForSupport(order)}
                      onMessage={setMessage}
                    />
                  ))}
                </div>
              )}
            </Section>
          )}

          {activeTab === 'addresses' && (
            <Section title="My Addresses" subtitle="Manage your saved shipping locations for a faster checkout experience.">
              <div className="grid gap-3 sm:grid-cols-2">
                {addresses.map((addr) => (
                  <div key={addr.id} className={cn('rounded-2xl border p-4', addr.is_default ? 'border-brand-300 bg-brand-50/30' : 'border-black/10')}>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-semibold text-black/60">{addr.tag}</span>
                      {addr.is_default && <span className="rounded-full bg-brand-500 px-2.5 py-0.5 text-[10px] font-bold text-white">PRIMARY</span>}
                    </div>
                    <h4 className="mt-2 text-sm font-bold text-brand-950">{addr.full_name}</h4>
                    <p className="mt-0.5 text-sm text-black/60">{addr.address_line1}</p>
                    {addr.address_line2 && <p className="text-sm text-black/60">{addr.address_line2}</p>}
                    <p className="text-sm text-black/60">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="mt-1 text-xs text-black/40">Phone: {addr.phone}</p>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => openAddressModal(addr)} className="flex items-center gap-1 rounded-full border border-black/10 px-2.5 py-1 text-xs font-semibold text-black/60 hover:bg-black/5">
                        <Pencil size={12} /> Edit
                      </button>
                      <button onClick={() => handleDeleteAddress(addr.id)} className="flex items-center gap-1 rounded-full border border-black/10 px-2.5 py-1 text-xs font-semibold text-error-600 hover:bg-error-50">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => openAddressModal()}
                  className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-black/15 text-black/40 hover:border-brand-400 hover:text-brand-500"
                >
                  <Plus size={26} />
                  <span className="text-sm font-semibold">Add New Address</span>
                </button>
              </div>
            </Section>
          )}

          {activeTab === 'security' && (
            <Section title="Security" subtitle="Update your password and keep your account safe.">
              <FormMessage message={passwordMsg} />
              <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                <Field label="New Password">
                  <Input type="password" placeholder="At least 6 characters" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))} required minLength={6} />
                </Field>
                <Field label="Confirm New Password">
                  <Input type="password" placeholder="Repeat new password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))} required />
                </Field>
                <Button type="submit" disabled={savingPassword} loading={savingPassword}>
                  {!savingPassword && <Shield size={16} />} Change Password
                </Button>
              </form>
            </Section>
          )}

          {activeTab === 'notifications' && (
            <Section title="Notifications" subtitle="Manage how you receive updates and alerts.">
              <div className="divide-y divide-black/5 rounded-2xl border border-black/5 bg-white">
                <NotificationRow title="Order Updates" desc="Get notified about your purchase status and delivery." />
                <NotificationRow title="Promotions" desc="Receive offers, discounts, and new product alerts." />
              </div>
            </Section>
          )}
        </main>
      </div>

      {/* Address modal */}
      <Sheet open={showAddressModal} onClose={() => setShowAddressModal(false)} title={editingAddress ? 'Edit Address' : 'Add New Address'}>
        <form onSubmit={handleAddressSubmit} className="space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name"><Input value={tempAddress.full_name} onChange={(e) => setTempAddress({ ...tempAddress, full_name: e.target.value })} required /></Field>
            <Field label="Mobile Number"><Input type="tel" value={tempAddress.phone} onChange={(e) => setTempAddress({ ...tempAddress, phone: e.target.value })} required /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Pincode"><Input value={tempAddress.pincode} onChange={(e) => setTempAddress({ ...tempAddress, pincode: e.target.value })} required /></Field>
            <Field label="City"><Input value={tempAddress.city} onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })} required /></Field>
          </div>
          <Field label="Address Line 1"><Input value={tempAddress.address_line1} onChange={(e) => setTempAddress({ ...tempAddress, address_line1: e.target.value })} placeholder="House No, Building Name..." required /></Field>
          <Field label="Address Line 2 (Optional)"><Input value={tempAddress.address_line2 || ''} onChange={(e) => setTempAddress({ ...tempAddress, address_line2: e.target.value })} placeholder="Area, Colony, Road, Landmark..." /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="State"><Input value={tempAddress.state} onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })} required /></Field>
            <Field label="Address Tag">
              <select
                value={tempAddress.tag}
                onChange={(e) => setTempAddress({ ...tempAddress, tag: e.target.value })}
                className="h-11 w-full rounded-xl border border-black/10 px-3.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-black/65">
            <input type="checkbox" checked={tempAddress.is_default} onChange={(e) => setTempAddress({ ...tempAddress, is_default: e.target.checked })} className="size-4 accent-brand-500" />
            Set as default address
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddressModal(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={saving} loading={saving}>{editingAddress ? 'Update' : 'Save'} Address</Button>
          </div>
        </form>
      </Sheet>

      {/* Support modal */}
      <Sheet open={!!selectedOrderForSupport} onClose={() => setSelectedOrderForSupport(null)} title={`Support: Order #${selectedOrderForSupport?.id}`}>
        {supportSuccess ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <CheckCircle size={44} className="text-fresh-500" />
            <h4 className="text-lg font-bold text-brand-950">Ticket Raised Successfully</h4>
            <p className="text-sm text-black/55">Our support team will contact you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSupportSubmit} className="space-y-4 p-5">
            <Field label="What do you need help with?">
              <select
                value={supportCategory}
                onChange={(e) => setSupportCategory(e.target.value)}
                className="h-11 w-full rounded-xl border border-black/10 px-3.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="Delivery">Delivery Status</option>
                <option value="Product">Product Quality</option>
                <option value="Payment">Payment/Billing</option>
                <option value="Other">Other Issues</option>
              </select>
            </Field>
            <Field label="Your Message">
              <textarea
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Provide more details about your inquiry..."
                required
                rows={4}
                className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </Field>
            <Button type="submit" className="w-full">Submit Inquiry</Button>
          </form>
        )}
      </Sheet>
    </div>
  );
};

const Section: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
    <div className="mb-5">
      <h2 className="font-display text-lg font-bold text-brand-950">{title}</h2>
      <p className="mt-0.5 text-sm text-black/50">{subtitle}</p>
    </div>
    {children}
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold text-black/50">{label}</label>
    {children}
  </div>
);

const FormMessage: React.FC<{ message: { type: 'success' | 'error'; text: string } | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className={cn('mb-4 flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-sm font-medium', message.type === 'success' ? 'bg-fresh-100 text-fresh-700' : 'bg-error-50 text-error-600')}>
      {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {message.text}
    </div>
  );
};

const NotificationRow: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div className="flex items-center justify-between p-4">
    <div>
      <h4 className="text-sm font-bold text-brand-950">{title}</h4>
      <p className="text-xs text-black/45">{desc}</p>
    </div>
    <input type="checkbox" defaultChecked className="size-5 accent-brand-500" />
  </div>
);

const STATUS_STEPS = ['Pending', 'Packed', 'Shipped', 'Delivered'];

const OrderCard: React.FC<{
  order: Order;
  onCancelled: () => void;
  onNeedHelp: () => void;
  onMessage: (m: { type: 'success' | 'error'; text: string }) => void;
}> = ({ order, onCancelled, onNeedHelp, onMessage }) => {
  const currentIdx = STATUS_STEPS.findIndex((s) => s.toLowerCase() === order.status.toLowerCase());
  const isCancelled = order.status.toLowerCase() === 'cancelled';
  const canCancel = ['pending', 'packed', 'pending_payment', 'paid'].includes(order.status.toLowerCase());

  const handleCancel = async () => {
    if (!confirm('Cancel this order?')) return;
    const res = await api.post(`/api/orders/${order.id}/cancel`, {});
    if (!res.error) {
      onCancelled();
      onMessage({ type: 'success', text: 'Order cancelled successfully.' });
    } else {
      onMessage({ type: 'error', text: res.error || 'Failed to cancel order.' });
    }
  };

  return (
    <div className="rounded-2xl border border-black/5 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-black/45">Order #{order.id.toString().padStart(6, '0')}</span>
        <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', isCancelled ? 'bg-error-50 text-error-600' : 'bg-brand-50 text-brand-700')}>
          {order.status}
        </span>
      </div>

      {!isCancelled && (
        <div className="mt-4 flex items-center">
          {STATUS_STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-1">
                <div className={cn('size-2.5 rounded-full', i <= currentIdx ? 'bg-brand-500' : 'bg-black/10')} />
                <span className={cn('text-[10px] font-semibold', i <= currentIdx ? 'text-brand-950' : 'text-black/35')}>{step}</span>
              </div>
              {i < STATUS_STEPS.length - 1 && <div className={cn('mb-4 h-0.5 flex-1', i < currentIdx ? 'bg-brand-500' : 'bg-black/10')} />}
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="mt-4 space-y-1.5 border-t border-black/5 pt-3">
        {order.order_items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-brand-600">{item.quantity}×</span>
            <span className="flex-1 text-black/70">{item.products.name}</span>
            <span className="font-medium text-brand-950">₹{item.unit_price}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-3">
        <div className="text-xs text-black/45">{new Date(order.created_at).toLocaleDateString('en-IN')}</div>
        <div className="text-sm font-bold text-brand-950">Total: ₹{order.total_price}</div>
        <div className="flex gap-2">
          {canCancel && (
            <button onClick={handleCancel} className="rounded-full border border-error-200 px-3 py-1.5 text-xs font-semibold text-error-600 hover:bg-error-50">
              Cancel
            </button>
          )}
          <button onClick={onNeedHelp} className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-black/60 hover:bg-black/5">
            Need Help?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
