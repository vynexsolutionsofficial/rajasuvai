import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CheckCircle, ArrowLeft, Loader2, Pencil, Trash2, X } from 'lucide-react';
import { api } from '../../services/api';
import './AddressSelection.css';

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

const AddressSelection: React.FC = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [saving, setSaving] = useState(false);

  const [tempAddress, setTempAddress] = useState<Partial<Address>>({
    full_name: '', phone: '', pincode: '', address_line1: '',
    address_line2: '', city: '', state: '', tag: 'Home', is_default: false
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/addresses');
      if (Array.isArray(data)) {
        setAddresses(data);
        const defaultAddr = data.find(a => a.is_default) || data[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const isAddressComplete = (addr: Address | null) => {
    if (!addr) return false;
    return !!(addr.full_name && addr.phone && addr.pincode && addr.address_line1 && addr.city && addr.state);
  };

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || null;

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/api/addresses/${id}`);
      setAddresses(prev => prev.filter(a => a.id !== id));
      if (selectedAddressId === id) setSelectedAddressId(null);
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingAddress) {
        const updated = await api.put(`/api/addresses/${editingAddress.id}`, tempAddress);
        setAddresses(prev => prev.map(a => a.id === editingAddress.id ? updated : a));
      } else {
        const created = await api.post('/api/addresses', tempAddress);
        setAddresses(prev => [...prev, created]);
        setSelectedAddressId(created.id);
      }
      setShowModal(false);
    } catch (err) {
      console.error('Error saving address:', err);
      alert('Failed to save address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const openModal = (addr: Address | null = null) => {
    if (addr) {
      setEditingAddress(addr);
      setTempAddress(addr);
    } else {
      setEditingAddress(null);
      setTempAddress({
        full_name: '', phone: '', pincode: '', address_line1: '',
        address_line2: '', city: '', state: '', tag: 'Home', is_default: false
      });
    }
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="checkout-step-loading">
        <Loader2 className="animate-spin" size={40} />
        <p>Loading your shipping locations...</p>
      </div>
    );
  }

  return (
    <div className="address-selection-page">
      <div className="checkout-progress-bar container">
        <div className="progress-step completed"><span>1</span> Cart</div>
        <div className="progress-divider active"></div>
        <div className="progress-step active"><span>2</span> Address</div>
        <div className="progress-divider"></div>
        <div className="progress-step"><span>3</span> Payment</div>
      </div>

      <main className="address-selection-container container">
        <header className="selection-header">
          <button className="btn-back-to-cart" onClick={() => navigate('/cart')}>
            <ArrowLeft size={18} /> Back to Cart
          </button>
          <h1 className="selection-title">Select Delivery Address</h1>
        </header>

        <div className="address-grid">
          {addresses.length === 0 ? (
            <div className="empty-addresses-note">
               <p>No delivery addresses found. Add one to get started!</p>
            </div>
          ) : (
            addresses.map((addr) => (
              <div 
                key={addr.id} 
                className={`address-selectable-card ${selectedAddressId === addr.id ? 'selected' : ''}`}
                onClick={() => setSelectedAddressId(addr.id)}
              >
                <div className="selection-indicator">
                  {selectedAddressId === addr.id && <CheckCircle size={20} className="check-icon" />}
                </div>
                <div className="address-content">
                  <div className="addr-header">
                    <span className="addr-tag">{addr.tag}</span>
                    {selectedAddressId === addr.id && <span className="deliver-here-badge">Deliver Here</span>}
                  </div>
                  <h3>{addr.full_name}</h3>
                  <p>{addr.address_line1}, {addr.address_line2}</p>
                  <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="addr-phone">Phone: {addr.phone}</p>
                </div>
                <div className="address-card-actions-mini">
                  <button className="btn-mini-action" onClick={(e) => { e.stopPropagation(); openModal(addr); }}>
                    <Pencil size={14} />
                  </button>
                  <button className="btn-mini-action delete" onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}

          <button className="btn-add-new-address-card" onClick={() => openModal()}>
            <Plus size={32} />
            <span>Add Additional Address</span>
          </button>
        </div>

        <footer className="selection-footer">
          <p className="selection-hint">
            {!selectedAddressId 
              ? "Please select or add a delivery address to proceed."
              : !isAddressComplete(selectedAddress)
                ? "This address is incomplete. Please edit to add missing details."
                : "Great! You're one step away from your artisan spices."}
          </p>
          <button 
            className="btn-proceed-payment" 
            disabled={!isAddressComplete(selectedAddress)}
            onClick={() => navigate('/checkout/payment', { state: { addressId: selectedAddressId } })}
          >
            PROCEED TO PAYMENT
          </button>
        </footer>
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="address-modal-compact">
             <div className="modal-header">
                <h3>{editingAddress ? 'Update Location' : 'New Delivery Location'}</h3>
                <button onClick={() => setShowModal(false)}><X /></button>
             </div>
              <form onSubmit={handleAddressSubmit} className="compact-address-form">
                <div className="form-grid-2">
                    <div className="input-group">
                        <label>Receiver's Name</label>
                        <input type="text" value={tempAddress.full_name} onChange={e => setTempAddress({...tempAddress, full_name: e.target.value})} required />
                    </div>
                    <div className="input-group">
                        <label>Mobile Number</label>
                        <input type="tel" value={tempAddress.phone} onChange={e => setTempAddress({...tempAddress, phone: e.target.value})} required />
                    </div>
                </div>
                <div className="input-group">
                    <label>Street Address / House No.</label>
                    <input type="text" value={tempAddress.address_line1} onChange={e => setTempAddress({...tempAddress, address_line1: e.target.value})} placeholder="e.g. 123, Rose Villa" required />
                </div>
                <div className="input-group">
                    <label>Landmark / Area (Optional)</label>
                    <input type="text" value={tempAddress.address_line2 || ''} onChange={e => setTempAddress({...tempAddress, address_line2: e.target.value})} placeholder="e.g. Near MG Road" />
                </div>
                <div className="form-grid-3">
                    <div className="input-group">
                        <label>City</label>
                        <input type="text" value={tempAddress.city} onChange={e => setTempAddress({...tempAddress, city: e.target.value})} required />
                    </div>
                    <div className="input-group">
                        <label>State</label>
                        <input type="text" value={tempAddress.state} onChange={e => setTempAddress({...tempAddress, state: e.target.value})} required />
                    </div>
                    <div className="input-group">
                        <label>Pincode</label>
                        <input type="text" value={tempAddress.pincode} onChange={e => setTempAddress({...tempAddress, pincode: e.target.value})} required />
                    </div>
                </div>
                <div className="form-tag-selection">
                    <label>Save as:</label>
                    <div className="tag-options">
                        {['Home', 'Work', 'Other'].map(tag => (
                            <button 
                                key={tag}
                                type="button" 
                                className={`tag-btn ${tempAddress.tag === tag ? 'active' : ''}`}
                                onClick={() => setTempAddress({...tempAddress, tag})}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
                <button type="submit" className="btn-confirm-final" disabled={saving}>
                    {saving ? 'SAVING...' : 'CONFIRM DELIVERY LOCATION'}
                </button>
              </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelection;
