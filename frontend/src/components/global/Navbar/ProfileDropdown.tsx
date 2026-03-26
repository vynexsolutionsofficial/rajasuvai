import React, { useState } from 'react';
import { supabase } from '../../../supabaseClient';
import './ProfileDropdown.css';

interface ProfileDropdownProps {
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onClose }) => {
  const [authMode, setAuthMode] = useState<'email' | 'mobile'>('email');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    identifier: '', // email or phone
    password: '',
    address: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (authMode === 'email') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.identifier,
          password: formData.password,
        });

        if (error) {
          // If login fails, try registration via our backend
          const regRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              email: formData.identifier,
              phone: '',
              password: formData.password,
              address: formData.address
            })
          });
          
          if (!regRes.ok) {
            const regData = await regRes.json();
            throw new Error(regData.error || 'Identity not found. Please register.');
          }
          
          setMessage({ type: 'success', text: 'Account created! Please sign in.' });
        } else {
          setMessage({ type: 'success', text: 'Welcome back!' });
          setTimeout(onClose, 1500);
        }
      } else {
        // Mobile Auth logic (Placeholder for now)
        setMessage({ type: 'error', text: 'Mobile auth coming soon!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-dropdown-container">
      <div className="profile-dropdown-box">
        <div className="auth-toggle">
          <button 
            className={authMode === 'email' ? 'active' : ''} 
            onClick={() => setAuthMode('email')}
          >
            Email
          </button>
          <button 
            className={authMode === 'mobile' ? 'active' : ''} 
            onClick={() => setAuthMode('mobile')}
          >
            Mobile
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label>{authMode === 'email' ? 'Email Address' : 'Mobile Number'}</label>
            <input 
              type={authMode === 'email' ? 'email' : 'tel'} 
              name="identifier"
              placeholder={authMode === 'email' ? 'your@email.com' : '+91 00000 00000'}
              value={formData.identifier}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Address Details</label>
            <textarea 
              name="address"
              placeholder="Street, City, Pincode"
              value={formData.address}
              onChange={handleInputChange}
              rows={2}
            />
          </div>

          {message && (
            <div className={`auth-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="form-footer">
            <button type="button" className="btn-skip" onClick={onClose} disabled={loading}>
              Skip
            </button>
            <button type="submit" className="btn-proceed" disabled={loading}>
              {loading ? '...' : 'Proceed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileDropdown;
