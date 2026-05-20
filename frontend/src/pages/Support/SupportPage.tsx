import React, { useState } from 'react';
import { Phone, Clock, MapPin, Send } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './SupportPage.css';

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
        message: `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
      });
      showToast('Message sent! We\'ll respond within 2 hours.', 'success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">

      {/* ── Hero ── */}
      <section className="contact-hero">
        <h1 className="contact-hero-title">Get in Touch</h1>
        <p className="contact-hero-sub">
          Questions about our spices, orders, or anything else? We're here to help.
        </p>
      </section>

      {/* ── Info Strip ── */}
      <div className="contact-info-strip">
        <div className="contact-info-card">
          <div className="contact-info-icon-box">
            <Phone size={20} />
          </div>
          <span className="contact-info-label">Phone</span>
          <span className="contact-info-value">+91 99999 00000</span>
        </div>
        <div className="contact-info-card">
          <div className="contact-info-icon-box">
            <Clock size={20} />
          </div>
          <span className="contact-info-label">Hours</span>
          <span className="contact-info-value">Mon–Sat, 9am – 7pm</span>
        </div>
        <div className="contact-info-card">
          <div className="contact-info-icon-box">
            <MapPin size={20} />
          </div>
          <span className="contact-info-label">Location</span>
          <span className="contact-info-value">Coimbatore, Tamil Nadu</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="contact-body container">

        {/* Form Card */}
        <div className="contact-form-card">
          <h2 className="contact-form-title">Send us a Message</h2>
          <p className="contact-form-sub">Fill out the form and we'll respond within 2 hours.</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="contact-input-group">
                <label className="contact-label">Full Name</label>
                <input
                  type="text"
                  className="contact-input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="contact-input-group">
                <label className="contact-label">Email Address</label>
                <input
                  type="email"
                  className="contact-input"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="contact-input-group">
              <label className="contact-label">Subject</label>
              <input
                type="text"
                className="contact-input"
                placeholder="e.g. Order enquiry, Product question..."
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
              />
            </div>

            <div className="contact-input-group">
              <label className="contact-label">Message</label>
              <textarea
                className="contact-textarea"
                placeholder="Tell us how we can help..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="contact-submit-btn" disabled={sending}>
              <Send size={16} />
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          <div className="contact-social-row">
            <span className="contact-social-label">Follow us</span>
            <div className="contact-socials">
              <a href="#" className="social-btn" aria-label="Instagram">IG</a>
              <a href="#" className="social-btn" aria-label="Facebook">FB</a>
            </div>
          </div>
        </div>

        {/* Visual Card */}
        <div className="contact-visual-card">
          <img
            src="/products/garam_masala.png"
            alt="Artisan Spices"
            className="contact-visual-img"
          />
          <div className="contact-visual-overlay">
            <p className="contact-visual-quote">"Crafted with tradition,<br />delivered with care."</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SupportPage;
