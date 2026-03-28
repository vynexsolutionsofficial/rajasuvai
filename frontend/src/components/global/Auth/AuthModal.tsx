import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { supabase } from '../../../supabaseClient';
import './AuthModal.css';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'register' | 'otp' | 'email'>('phone');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    password: '' 
  });

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Google Login failed' });
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Login successful!' });
        setTimeout(onClose, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Invalid credentials' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (phone: string, mode: 'login' | 'signup') => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, mode })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'OTP sent to your WhatsApp!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to send WhatsApp OTP.' });
      }
      return response.ok;
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error.' });
      return false;
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const otpSent = await sendOtp(phoneNumber, 'login');
      if (otpSent) {
        setUserExists(true); // Since backend verified it exists for 'login' mode
        setStep('otp');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, otp })
      });
      const data = await response.json();
      if (data.success) {
        if (userExists) {
          setMessage({ type: 'success', text: 'Login successful!' });
          setTimeout(onClose, 2000);
        } else {
          setStep('register');
        }
      } else {
        setMessage({ type: 'error', text: 'Invalid OTP' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Verification failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      // For new registrations, we should technically handle OTP first if we wanted WhatsApp verification,
      // but based on the user request, we just "check if mobile is registered... if no add to db".
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, phone: phoneNumber })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Account created successfully!' });
        setTimeout(onClose, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || data.error || 'Registration failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="auth-tabs">
          <button 
            className={mode === 'login' ? 'active' : ''} 
            onClick={() => { setMode('login'); setStep('phone'); }}
          >
            Login
          </button>
          <button 
            className={mode === 'signup' ? 'active' : ''} 
            onClick={() => { setMode('signup'); setStep('register'); }}
          >
            Sign Up
          </button>
        </div>

        {mode === 'login' && step === 'phone' && (
          <>
            <div className="auth-modal-header">
              <h2>{loginMethod === 'phone' ? 'Login with OTP' : 'Login with Email'}</h2>
              <p>Welcome back! Choose your preferred login method.</p>
            </div>

            <div className="login-method-toggle">
              <button 
                className={loginMethod === 'phone' ? 'active' : ''} 
                onClick={() => setLoginMethod('phone')}
              >
                Phone
              </button>
              <button 
                className={loginMethod === 'email' ? 'active' : ''} 
                onClick={() => setLoginMethod('email')}
              >
                Email
              </button>
            </div>

            {loginMethod === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="auth-modal-form">
                <div className="phone-input-wrapper">
                  <div className="country-selector">
                    <img src="https://flagcdn.com/w20/in.png" alt="India" />
                    <ChevronRight size={16} />
                  </div>
                  <input 
                    type="tel" 
                    placeholder="Phone number" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-request-otp" disabled={loading}>
                  {loading ? 'Processing...' : 'Request OTP'} <ChevronRight size={20} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleEmailLogin} className="auth-modal-form">
                <div className="input-group">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="password" 
                    placeholder="Password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn-request-otp" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'} <ChevronRight size={20} />
                </button>
              </form>
            )}
          </>
        )}

        {mode === 'signup' && (
          <>
            <div className="auth-modal-header">
              <h2>Create Account</h2>
              <p>Join the Rajasuvai family for exclusive spice blends.</p>
            </div>
            <form onSubmit={handleRegisterSubmit} className="auth-modal-form">
              <div className="form-grid">
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="password" 
                    placeholder="Create Password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-request-otp" disabled={loading}>
                {loading ? 'Creating...' : 'Sign Up'} <ChevronRight size={20} />
              </button>
            </form>
          </>
        )}

        {step === 'otp' && (
          <>
            <div className="auth-modal-header">
              <h2>Verify WhatsApp OTP</h2>
              <p>We've sent a 6-digit code to +91 {phoneNumber}</p>
            </div>
            <form onSubmit={handleVerifyOtp} className="auth-modal-form">
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Enter 6-digit OTP" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              <button type="submit" className="btn-request-otp" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Login'} <ChevronRight size={20} />
              </button>
              <button type="button" className="btn-back" onClick={() => setStep('phone')}>
                Try another number
              </button>
            </form>
          </>
        )}

        {step === 'register' && mode === 'login' && (
          <>
            <div className="auth-modal-header">
              <h2>Finish Setup</h2>
              <p>Just one last step to complete your account.</p>
            </div>
            <form onSubmit={handleRegisterSubmit} className="auth-modal-form">
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="btn-request-otp" disabled={loading}>
                {loading ? 'Finishing...' : 'Complete Registration'} <ChevronRight size={20} />
              </button>
            </form>
          </>
        )}

        {message && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="auth-modal-divider">
          <span>Or Login Using</span>
        </div>

        <button className="btn-google-login" onClick={handleGoogleLogin} disabled={loading}>
          <svg viewBox="0 0 48 48" width="24" height="24">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Google
        </button>

        <a href="#" className="auth-modal-link">Having trouble logging in?</a>

        <div className="auth-modal-footer">
          <p>
            By continuing, you agree to our <br />
            <a href="#">Privacy Policy</a> and <a href="#">Terms of Use</a>.
          </p>
        </div>
      </div>
    </div>
  );
};


export default AuthModal;
