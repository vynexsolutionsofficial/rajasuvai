import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CheckCircle2, ArrowLeft, Loader2, Pencil, Trash2, MapPin } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Sheet } from '../../components/ui/Sheet';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { cn } from '../../lib/cn';
import CheckoutStepper from './CheckoutStepper';

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

const emptyAddress: Partial<Address> = {
  full_name: '', phone: '', pincode: '', address_line1: '',
  address_line2: '', city: '', state: '', tag: 'Home', is_default: false
};

const AddressSelection: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [saving, setSaving] = useState(false);
  const [tempAddress, setTempAddress] = useState<Partial<Address>>(emptyAddress);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/addresses');
      if (Array.isArray(data)) {
        setAddresses(data);
        const defaultAddr = data.find((a) => a.is_default) || data[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const isAddressComplete = (addr: Address | null) =>
    !!(addr && addr.full_name && addr.phone && addr.pincode && addr.address_line1 && addr.city && addr.state);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || null;

  const handleDeleteAddress = async (id: number) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/api/addresses/${id}`);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      if (selectedAddressId === id) setSelectedAddressId(null);
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingAddress) {
        const updated = await api.put(`/api/addresses/${editingAddress.id}`, tempAddress);
        setAddresses((prev) => prev.map((a) => (a.id === editingAddress.id ? updated : a)));
      } else {
        const created = await api.post('/api/addresses', tempAddress);
        setAddresses((prev) => [...prev, created]);
        setSelectedAddressId(created.id);
      }
      setShowModal(false);
    } catch (err) {
      console.error('Error saving address:', err);
      showToast('Failed to save address. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const openModal = (addr: Address | null = null) => {
    setEditingAddress(addr);
    setTempAddress(addr ?? emptyAddress);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-black/50">
        <Loader2 className="size-9 animate-spin text-brand-500" />
        <p className="text-sm">Loading your shipping locations...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <CheckoutStepper current={2} />

      <button onClick={() => navigate('/cart')} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-black/50 hover:text-brand-600">
        <ArrowLeft size={16} /> Back to Cart
      </button>
      <h1 className="mb-6 font-display text-2xl font-bold text-brand-950">Select Delivery Address</h1>

      {addresses.length === 0 ? (
        <EmptyState icon={<MapPin size={28} />} title="No delivery addresses found" description="Add one to get started!" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => setSelectedAddressId(addr.id)}
              className={cn(
                'relative cursor-pointer rounded-2xl border-2 p-4 transition-colors',
                selectedAddressId === addr.id ? 'border-brand-500 bg-brand-50/40' : 'border-black/10 hover:border-black/20'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-semibold text-black/60">{addr.tag}</span>
                {selectedAddressId === addr.id ? (
                  <CheckCircle2 size={20} className="text-brand-500" />
                ) : (
                  <div className="size-5 rounded-full border-2 border-black/15" />
                )}
              </div>
              <h3 className="mt-2 text-sm font-bold text-brand-950">{addr.full_name}</h3>
              <p className="mt-0.5 text-sm text-black/60">{addr.address_line1}, {addr.address_line2}</p>
              <p className="text-sm text-black/60">{addr.city}, {addr.state} - {addr.pincode}</p>
              <p className="mt-1 text-xs text-black/40">Phone: {addr.phone}</p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); openModal(addr); }}
                  className="flex items-center gap-1 rounded-full border border-black/10 px-2.5 py-1 text-xs font-semibold text-black/60 hover:bg-black/5"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr.id); }}
                  className="flex items-center gap-1 rounded-full border border-black/10 px-2.5 py-1 text-xs font-semibold text-error-600 hover:bg-error-50"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => openModal()}
            className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-black/15 text-black/40 hover:border-brand-400 hover:text-brand-500"
          >
            <Plus size={26} />
            <span className="text-sm font-semibold">Add Additional Address</span>
          </button>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-3 border-t border-black/5 pt-6 text-center">
        <p className="text-sm text-black/55">
          {!selectedAddressId
            ? 'Please select or add a delivery address to proceed.'
            : !isAddressComplete(selectedAddress)
              ? 'This address is incomplete. Please edit to add missing details.'
              : "Great! You're one step away from your artisan spices."}
        </p>
        <Button
          size="lg"
          className="w-full sm:w-auto"
          disabled={!isAddressComplete(selectedAddress)}
          onClick={() => navigate('/checkout/payment', { state: { addressId: selectedAddressId } })}
        >
          Proceed to Payment
        </Button>
      </div>

      <Sheet open={showModal} onClose={() => setShowModal(false)} title={editingAddress ? 'Update Location' : 'New Delivery Location'}>
        <form onSubmit={handleAddressSubmit} className="space-y-4 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Receiver's Name">
              <Input value={tempAddress.full_name} onChange={(e) => setTempAddress({ ...tempAddress, full_name: e.target.value })} required />
            </Field>
            <Field label="Mobile Number">
              <Input type="tel" value={tempAddress.phone} onChange={(e) => setTempAddress({ ...tempAddress, phone: e.target.value })} required />
            </Field>
          </div>
          <Field label="Street Address / House No.">
            <Input
              value={tempAddress.address_line1}
              onChange={(e) => setTempAddress({ ...tempAddress, address_line1: e.target.value })}
              placeholder="e.g. 123, Rose Villa"
              required
            />
          </Field>
          <Field label="Landmark / Area (Optional)">
            <Input
              value={tempAddress.address_line2 || ''}
              onChange={(e) => setTempAddress({ ...tempAddress, address_line2: e.target.value })}
              placeholder="e.g. Near MG Road"
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="City">
              <Input value={tempAddress.city} onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })} required />
            </Field>
            <Field label="State">
              <Input value={tempAddress.state} onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })} required />
            </Field>
            <Field label="Pincode">
              <Input value={tempAddress.pincode} onChange={(e) => setTempAddress({ ...tempAddress, pincode: e.target.value })} required />
            </Field>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-black/50">Save as</label>
            <div className="flex gap-2">
              {['Home', 'Work', 'Other'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTempAddress({ ...tempAddress, tag })}
                  className={cn(
                    'rounded-full border px-4 py-1.5 text-xs font-semibold',
                    tempAddress.tag === tag ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-black/10 text-black/55'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={saving} loading={saving}>
            {saving ? 'Saving...' : 'Confirm Delivery Location'}
          </Button>
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

export default AddressSelection;
