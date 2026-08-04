import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { api } from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const socialIcons = [
  { label: 'Instagram', path: 'M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.256 1.216.6 1.772 1.153a4.9 4.9 0 011.153 1.772c.247.637.415 1.363.465 2.428.05 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.05-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.01 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm0 8.25a3.25 3.25 0 110-6.5 3.25 3.25 0 010 6.5zm5.2-8.45a1.17 1.17 0 100-2.34 1.17 1.17 0 000 2.34z' },
  { label: 'Facebook', path: 'M13.5 21v-7.5H16l.5-3H13.5V8.5c0-.87.24-1.46 1.5-1.46H16.5V4.35C16.24 4.32 15.35 4.25 14.32 4.25c-2.15 0-3.62 1.31-3.62 3.72V10.5H8.2v3h2.5V21h2.8z' },
  { label: 'YouTube', path: 'M22 12c0-2.4-.24-4.1-.24-4.1s-.24-1.4-.97-2.03c-.93-.75-1.96-.75-2.44-.81C15.05 5 12 5 12 5s-3.05 0-6.35.06c-.48.06-1.51.06-2.44.81-.73.63-.97 2.03-.97 2.03S2 9.6 2 12s.24 4.1.24 4.1.24 1.4.97 2.03c.93.75 2.14.72 2.68.8C7.7 19 12 19 12 19s3.05 0 6.35-.06c.48-.06 1.51-.06 2.44-.81.73-.63.97-2.03.97-2.03S22 14.4 22 12zm-12.2 2.9V9.1L15.8 12l-6 2.9z' },
];

const Footer: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await api.post('/api/newsletter', { email });
      showToast('Subscribed! Welcome to the Spice Trail.', 'success');
      setEmail('');
    } catch {
      showToast('Could not subscribe. Please try again.', 'error');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="mt-16 border-t border-black/5 bg-white">
      <div className="border-b border-black/5 bg-brand-50/50">
        <div className="mx-auto flex max-w-(--container-page) flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="font-display text-xl font-bold text-brand-950">Join the Spice Trail</h3>
            <p className="mt-1 text-sm text-black/55">Recipes, spice care tips, and exclusive offers in your inbox.</p>
          </div>
          <form onSubmit={handleNewsletter} className="flex w-full max-w-sm gap-2 sm:w-auto">
            <input
              type="email"
              placeholder="yourname@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 w-full rounded-full border border-black/10 bg-white px-4 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="submit"
              disabled={subscribing}
              className="h-11 shrink-0 rounded-full bg-brand-500 px-5 text-sm font-bold text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {subscribing ? '...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-(--container-page) px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2">
            <h2 className="font-display text-2xl font-extrabold text-brand-950">RAJASUVAI</h2>
            <p className="mt-3 max-w-xs text-sm text-black/55">
              Defining the standard of premium authentic taste since 1984 — sourcing the finest
              ingredients from the heart of South India.
            </p>
            <div className="mt-4 flex gap-2">
              {socialIcons.map(({ label, path }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full bg-black/5 text-brand-950 hover:bg-brand-100 hover:text-brand-600"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                    <path d={path} />
                  </svg>
                </a>
              ))}
              <a
                href="#"
                aria-label="WhatsApp"
                className="flex size-9 items-center justify-center rounded-full bg-black/5 text-brand-950 hover:bg-brand-100 hover:text-brand-600"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-wide text-black/40">SHOP</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/shop" className="text-black/65 hover:text-brand-600">All Products</Link></li>
              <li><Link to="/wholesale" className="text-black/65 hover:text-brand-600">Wholesale</Link></li>
              <li><Link to="/story" className="text-black/65 hover:text-brand-600">Our Story</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-wide text-black/40">CUSTOMER CARE</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/contact" className="text-black/65 hover:text-brand-600">Contact Support</Link></li>
              <li><Link to="/shipping" className="text-black/65 hover:text-brand-600">Shipping Policy</Link></li>
              <li><Link to="/returns" className="text-black/65 hover:text-brand-600">Returns &amp; Refunds</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-black/5">
        <div className="mx-auto flex max-w-(--container-page) flex-col items-center gap-3 px-6 py-5 text-xs text-black/45 sm:flex-row sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Rajasuvai. All rights reserved. Powered by{' '}
            <a href="https://vynexsolution.in" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-600 hover:underline">
              Vynex Solution
            </a>
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-brand-600">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-brand-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
