import React, { useState, useEffect } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  LogOut,
  CheckCircle,
  AlertCircle,
  Save,
  Loader2,
  Shield,
  Bell,
  Plus,
  Camera,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { api } from '../../services/api';
import './Profile.css';

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
  products: {
    name: string;
    image: string;
  };
}

interface Order {
  id: number;
  status: string;
  total_price: number;
  created_at: string;
  order_items: OrderItem[];
}

type TabType = 'account' | 'orders' | 'addresses' | 'security' | 'notifications';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
          api.get('/api/orders/my-orders')
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setMessage(null);
    try {
      const resData = await api.patch('/api/users/profile', {
        name: profile.name,
        phone: profile.phone,
        address: profile.address
      });

      if (!resData.error) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: resData.error || 'Failed to update profile.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error.' });
    } finally {
      setSaving(false);
    }
  };

  const [selectedOrderForSupport, setSelectedOrderForSupport] = useState<Order | null>(null);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportCategory, setSupportCategory] = useState('Delivery');
  const [supportSuccess, setSupportSuccess] = useState(false);

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [tempAddress, setTempAddress] = useState<Partial<Address>>({
    full_name: '',
    phone: '',
    pincode: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    tag: 'Home',
    is_default: false
  });

  const handlePhotoUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const mockUrl = URL.createObjectURL(file);
    setProfile(prev => prev ? { ...prev, photo_url: mockUrl } : null);
    try {
      await api.patch('/api/users/profile', { photo_url: mockUrl });
      setMessage({ type: 'success', text: 'Profile photo updated!' });
    } catch (err) {
      console.error('Error updating photo:', err);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint = editingAddress ? `/api/addresses/${editingAddress.id}` : '/api/addresses';
      const resData = editingAddress 
        ? await api.put(endpoint, tempAddress)
        : await api.post(endpoint, tempAddress);
        
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
        setAddresses(prev => prev.filter(a => a.id !== id));
        setMessage({ type: 'success', text: 'Address deleted.' });
      } else {
        setMessage({ type: 'error', text: resData.error || 'Failed to delete address.' });
      }
    } catch (err) {
      console.error('Error deleting address:', err);
      setMessage({ type: 'error', text: 'Connection error while deleting.' });
    }
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSupportSuccess(true);
    setTimeout(() => {
      setSupportSuccess(false);
      setSelectedOrderForSupport(null);
      setSupportMessage('');
    }, 2500);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('rajasuvai_dev_admin');
    window.location.href = '/';
  };

  const openAddressModal = (address: Address | null = null) => {
    if (address) {
      setEditingAddress(address);
      setTempAddress(address);
    } else {
      setEditingAddress(null);
      setTempAddress({
        full_name: '', phone: '', pincode: '', address_line1: '',
        address_line2: '', city: '', state: '', tag: 'Home', is_default: false
      });
    }
    setShowAddressModal(true);
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <Loader2 className="animate-spin" size={40} />
        <p>Loading your ecosystem...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <aside className="profile-sidebar">
          <div className="user-info-brief">
            <div className="avatar-wrapper">
              <div className="avatar">
                {profile?.photo_url ? (
                  <img src={profile.photo_url} alt={profile.name} />
                ) : (
                  profile?.name.charAt(0) || 'U'
                )}
              </div>
              <label htmlFor="photo-upload" className="edit-avatar-btn">
                <Camera size={14} />
                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpdate} hidden />
              </label>
            </div>
            <div className="brief-details">
              <h3>{profile?.name}</h3>
              <p>{profile?.email}</p>
              <div className="tier-badge">Spice Gold Member</div>
            </div>
          </div>

          <nav className="profile-nav">
            <button className={activeTab === 'account' ? 'active' : ''} onClick={() => setActiveTab('account')}>
              <User size={18} /> My Profile
            </button>
            <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
              <Package size={18} /> Order History
            </button>
            <button className={activeTab === 'addresses' ? 'active' : ''} onClick={() => setActiveTab('addresses')}>
              <MapPin size={18} /> My Addresses
            </button>
            <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>
              <Shield size={18} /> Security
            </button>
            <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
              <Bell size={18} /> Notifications
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} /> Log Out
            </button>
          </nav>
        </aside>

        {/* Mobile-only horizontal tab strip */}
        <div className="profile-mobile-tabs">
          {(['account', 'orders', 'addresses', 'security', 'notifications'] as TabType[]).map(tab => (
            <button
              key={tab}
              className={`profile-mobile-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'account' ? 'Profile' : tab === 'orders' ? 'Orders' : tab === 'addresses' ? 'Addresses' : tab === 'security' ? 'Security' : 'Alerts'}
            </button>
          ))}
        </div>

        <main className="profile-main">
          {activeTab === 'account' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Account Settings</h2>
                <p>Manage your profile details and contact information.</p>
              </div>
              {message && (
                <div className={`profile-message ${message.type}`}>
                  {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {message.text}
                </div>
              )}
              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-grid">
                  <div className="input-group">
                    <label>Full Name</label>
                    <input type="text" value={profile?.name || ''} 
                      onChange={(e) => setProfile(prev => prev ? {...prev, name: e.target.value} : null)} required />
                  </div>
                  <div className="input-group read-only">
                    <label>Email Address</label>
                    <input type="email" value={profile?.email || ''} readOnly />
                    <small>Email cannot be changed.</small>
                  </div>
                  <div className="input-group">
                    <label>Phone Number</label>
                    <input type="tel" value={profile?.phone || ''} 
                      onChange={(e) => setProfile(prev => prev ? {...prev, phone: e.target.value} : null)} required />
                  </div>
                </div>
                <div className="input-group full-width" style={{ marginTop: '2rem' }}>
                  <label>Default Shipping Address</label>
                  <textarea value={profile?.address || ''} 
                    onChange={(e) => setProfile(prev => prev ? {...prev, address: e.target.value} : null)}
                    placeholder="Enter your shipping address..." required />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={saving}>
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Your Orders</h2>
                <p>View and track all your previous purchases.</p>
              </div>
              <div className="orders-list">
                {orders.length === 0 ? (
                  <div className="no-data-placeholder">
                    <Package size={48} />
                    <p>No orders found yet.</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="order-card-professional">
                      <div className="order-professional-header">
                        <div className="order-id-mono">Order: #{order.id.toString().padStart(6, '0')}</div>
                        <div className="status-badge-minimal" data-status={order.status}>{order.status}</div>
                      </div>
                      <div className="order-items-minimalist">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="item-row">
                            <span className="item-qty-tag">{item.quantity}×</span>
                            <span className="item-name-prof">{item.products.name}</span>
                            <span className="item-price-prof">₹{item.unit_price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-professional-footer">
                        <div className="timestamp-prof">{new Date(order.created_at).toLocaleDateString()}</div>
                        <div className="total-prof">Total: ₹{order.total_price}</div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <button className="btn-action-prof outline" onClick={() => setSelectedOrderForSupport(order)}>Need Help?</button>
                          <button className="btn-action-prof">View Details</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>My Addresses</h2>
                <p>Manage your saved shipping locations for a faster checkout experience.</p>
              </div>
              <div className="address-grid">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`address-card-detailed ${addr.is_default ? 'active-address' : ''}`}>
                    <div className="address-card-header">
                      <span className="address-tag">{addr.tag}</span>
                      {addr.is_default && <span className="default-badge">Primary</span>}
                    </div>
                    <div className="address-card-body">
                      <h4>{addr.full_name}</h4>
                      <p>{addr.address_line1}</p>
                      {addr.address_line2 && <p>{addr.address_line2}</p>}
                      <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="addr-phone">Phone: {addr.phone}</p>
                    </div>
                    <div className="address-card-actions">
                      <button onClick={() => openAddressModal(addr)}><Pencil size={14} /> Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteAddress(addr.id)}><Trash2 size={14} /> Delete</button>
                    </div>
                  </div>
                ))}
                <button className="add-address-card-v2" onClick={() => openAddressModal()}>
                  <Plus size={32} />
                  <span>Add New Address</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Security</h2>
                <p>Update your password and keep your account safe.</p>
              </div>
              <form className="profile-form">
                <div className="input-group">
                  <label>Current Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className="form-grid" style={{ marginTop: '1.5rem' }}>
                  <div className="input-group">
                    <label>New Password</label>
                    <input type="password" />
                  </div>
                  <div className="input-group">
                    <label>Confirm New Password</label>
                    <input type="password" />
                  </div>
                </div>
                <button className="btn-save" title="Password Update" style={{ marginTop: '2rem' }}>Change Password</button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Notifications</h2>
                <p>Manage how you receive updates and alerts.</p>
              </div>
              <div className="notification-settings">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Order Updates</h4>
                    <p>Get notified about your purchase status and delivery.</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Promotions</h4>
                    <p>Receive offers, discounts, and new product alerts.</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showAddressModal && (
        <div className="modal-overlay">
          <div className="address-modal">
            <div className="modal-header">
              <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
              <button className="close-modal" onClick={() => setShowAddressModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleAddressSubmit} className="address-form-detailed">
              <div className="form-row">
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" value={tempAddress.full_name} onChange={(e) => setTempAddress({...tempAddress, full_name: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Mobile Number</label>
                  <input type="tel" value={tempAddress.phone} onChange={(e) => setTempAddress({...tempAddress, phone: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Pincode</label>
                  <input type="text" value={tempAddress.pincode} onChange={(e) => setTempAddress({...tempAddress, pincode: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>City</label>
                  <input type="text" value={tempAddress.city} onChange={(e) => setTempAddress({...tempAddress, city: e.target.value})} required />
                </div>
              </div>
              <div className="input-group full-width">
                <label>Address Line 1</label>
                <input type="text" value={tempAddress.address_line1} onChange={(e) => setTempAddress({...tempAddress, address_line1: e.target.value})} placeholder="House No, Building Name..." required />
              </div>
              <div className="input-group full-width">
                <label>Address Line 2 (Optional)</label>
                <input type="text" value={tempAddress.address_line2} onChange={(e) => setTempAddress({...tempAddress, address_line2: e.target.value})} placeholder="Area, Colony, Road, Landmark..." />
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>State</label>
                  <input type="text" value={tempAddress.state} onChange={(e) => setTempAddress({...tempAddress, state: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Address Tag</label>
                  <select value={tempAddress.tag} onChange={(e) => setTempAddress({...tempAddress, tag: e.target.value})}>
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" id="is-default" checked={tempAddress.is_default} onChange={(e) => setTempAddress({...tempAddress, is_default: e.target.checked})} />
                <label htmlFor="is-default">Set as default address</label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddressModal(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? <Loader2 className="animate-spin" size={18} /> : (editingAddress ? 'Update' : 'Save')} Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedOrderForSupport && (
        <div className="support-modal-overlay">
          <div className="support-modal">
            <div className="support-modal-header">
              <h3>Support Ticket: Order #{selectedOrderForSupport.id}</h3>
              <button className="close-support" onClick={() => setSelectedOrderForSupport(null)}>✕</button>
            </div>
            {supportSuccess ? (
              <div className="support-success">
                <CheckCircle size={48} />
                <h4>Ticket Raised Successfully</h4>
                <p>Our support team will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="support-form">
                <div className="input-group">
                  <label>What do you need help with?</label>
                  <select value={supportCategory} onChange={(e) => setSupportCategory(e.target.value)}>
                    <option value="Delivery">Delivery Status</option>
                    <option value="Product">Product Quality</option>
                    <option value="Payment">Payment/Billing</option>
                    <option value="Other">Other Issues</option>
                  </select>
                </div>
                <div className="input-group" style={{ marginTop: '1.5rem' }}>
                  <label>Your Message</label>
                  <textarea value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)} placeholder="Provide more details about your inquiry..." required />
                </div>
                <button type="submit" className="btn-save" style={{ width: '100%', marginTop: '2rem', justifyContent: 'center' }}>Submit Inquiry</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
