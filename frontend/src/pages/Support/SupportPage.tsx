import React, { useState } from 'react';
import { Phone, Clock, MapPin, Send } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const SupportPage: React.FC = () => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      await api.post('/api/support', {
        subject: form.subject || 'General Enquiry',
        message: `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
      });
      showToast("Message sent! We'll respond within 2 hours.", 'success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <section className="mx-auto max-w-(--container-page) px-6 pt-12 pb-8 text-center sm:pt-16">
        <h1 className="font-display text-3xl font-bold text-brand-950 sm:text-4xl">Get in Touch</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-black/55">
          Questions about our spices, orders, or anything else? We're here to help.
        </p>
      </section>

      <div className="mx-auto grid max-w-(--container-page) grid-cols-1 gap-3 px-6 sm:grid-cols-3">
        <InfoCard icon={<Phone size={18} />} label="Phone" value="+91 99999 00000" />
        <InfoCard icon={<Clock size={18} />} label="Hours" value="Mon–Sat, 9am – 7pm" />
        <InfoCard icon={<MapPin size={18} />} label="Location" value="Coimbatore, Tamil Nadu" />
      </div>

      <div className="mx-auto grid max-w-(--container-page) gap-6 px-6 py-12 lg:grid-cols-5">
        <div className="rounded-2xl border border-black/5 bg-white p-6 sm:p-8 lg:col-span-3">
          <h2 className="font-display text-xl font-bold text-brand-950">Send us a Message</h2>
          <p className="mt-1 text-sm text-black/50">Fill out the form and we'll respond within 2 hours.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <Input
              placeholder="Subject — e.g. Order enquiry, Product question..."
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <textarea
              placeholder="Tell us how we can help..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              rows={5}
              className="w-full rounded-xl border border-black/10 px-3.5 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <Button type="submit" size="lg" disabled={sending} loading={sending}>
              {!sending && <Send size={16} />} {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>

        <div className="relative overflow-hidden rounded-2xl lg:col-span-2">
          <img src="/products/garam_masala.png" alt="Artisan Spices" className="h-64 w-full object-cover lg:h-full" />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-6">
            <p className="font-display text-lg text-white italic">"Crafted with tradition,<br />delivered with care."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-black/5 bg-white p-5 text-center">
    <div className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-500">{icon}</div>
    <span className="text-xs font-semibold text-black/40">{label}</span>
    <span className="text-sm font-bold text-brand-950">{value}</span>
  </div>
);

export default SupportPage;
