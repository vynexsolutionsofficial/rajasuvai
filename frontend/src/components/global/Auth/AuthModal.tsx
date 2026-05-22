import React, { useState } from 'react';
import { X, ChevronRight, Mail } from 'lucide-react';
import { supabase } from '../../../supabaseClient';
import './AuthModal.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface AuthModalProps {
  onClose: () => void;
}

type Step = 'choose' | 'otp-email' | 'otp-code' | 'email-login' | 'signup';

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<Step>('choose');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });

  const showMsg = (type: 'error' | 'success', text: string) => setMessage({ type, text });

  // ---- OTP FLOW ----
  const handleSendOTP = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showMsg('success', 'OTP sent to your email. Check your inbox.');
        setStep('otp-code');
      } else {
        showMsg('error', data.message || 'Failed to send OTP');
      }
    } catch {
      showMsg('error', 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, otp: otpCode })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.userExists) {
          // Existing user — sign them in silently via email magic link or prompt password
          showMsg('success', 'Verified! Please use Email Login to sign in.');
          setTimeout(() => setStep('email-login'), 1500);
        } else {
          // New user — move to signup to collect name + password
          showMsg('success', 'Email verified! Complete your profile below.');
          setFormData(f => ({ ...f, email: otpEmail }));
          setTimeout(() => setStep('signup'), 1000);
        }
      } else {
        showMsg('error', data.message || 'Invalid or expired OTP');
      }
    } catch {
      showMsg('error', 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ---- EMAIL / PASSWORD LOGIN ----
  const handleEmailLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      showMsg('success', 'Login successful!');
      setTimeout(onClose, 1200);
    } catch (err: any) {
      showMsg('error', err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // ---- SIGN UP ----
  const handleSignUp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        showMsg('success', 'Account created! You can now log in.');
        setTimeout(() => setStep('email-login'), 1500);
      } else {
        showMsg('error', data.message || data.error || 'Registration failed');
      }
    } catch {
      showMsg('error', 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  // ---- GOOGLE ----
  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err: any) {
      showMsg('error', err.message || 'Google Login failed. Please enable Google OAuth in Supabase.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {/* ---- CHOOSE METHOD ---- */}
        {step === 'choose' && (
          <>
            <div className="auth-modal-header">
              <h2>Welcome to Rajasuvai</h2>
              <p>Choose how you'd like to sign in</p>
            </div>
            <div className="auth-method-list">
              <button className="auth-method-btn" onClick={() => setStep('otp-email')}>
                <Mail size={20} />
                <span>Login with Email OTP</span>
                <ChevronRight size={16} />
              </button>
              <button className="auth-method-btn" onClick={() => setStep('email-login')}>
                <span style={{ fontSize: '1.1rem' }}>🔑</span>
                <span>Login with Password</span>
                <ChevronRight size={16} />
              </button>
              <button className="auth-method-btn" onClick={() => setStep('signup')}>
                <span style={{ fontSize: '1.1rem' }}>✨</span>
                <span>Create New Account</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}

        {/* ---- OTP: ENTER EMAIL ---- */}
        {step === 'otp-email' && (
          <>
            <div className="auth-modal-header">
              <h2>Login with OTP</h2>
              <p>We'll send a 6-digit code to your email</p>
            </div>
            <form onSubmit={handleSendOTP} className="auth-modal-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={otpEmail}
                  onChange={(e) => setOtpEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <button type="submit" className="btn-request-otp" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'} <ChevronRight size={20} />
              </button>
              <button type="button" className="btn-back" onClick={() => setStep('choose')}>
                Back
              </button>
            </form>
          </>
        )}

        {/* ---- OTP: ENTER CODE ---- */}
        {step === 'otp-code' && (
          <>
            <div className="auth-modal-header">
              <h2>Enter OTP</h2>
              <p>Check your inbox at <strong>{otpEmail}</strong></p>
            </div>
            <form onSubmit={handleVerifyOTP} className="auth-modal-form">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  autoFocus
                  style={{ letterSpacing: '0.3em', fontSize: '1.4rem', textAlign: 'center' }}
                />
              </div>
              <button type="submit" className="btn-request-otp" disabled={loading || otpCode.length < 6}>
                {loading ? 'Verifying...' : 'Verify & Continue'} <ChevronRight size={20} />
              </button>
              <button type="button" className="btn-back" onClick={() => setStep('otp-email')}>
                Resend OTP
              </button>
            </form>
          </>
        )}

        {/* ---- EMAIL + PASSWORD LOGIN ---- */}
        {step === 'email-login' && (
          <>
            <div className="auth-modal-header">
              <h2>Login with Password</h2>
              <p>Enter your email and password</p>
            </div>
            <form onSubmit={handleEmailLogin} className="auth-modal-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn-request-otp" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'} <ChevronRight size={20} />
              </button>
              <button type="button" className="btn-back" onClick={() => setStep('choose')}>
                Back
              </button>
            </form>
          </>
        )}

        {/* ---- SIGN UP ---- */}
        {step === 'signup' && (
          <>
            <div className="auth-modal-header">
              <h2>Create Account</h2>
              <p>Join the Rajasuvai family</p>
            </div>
            <form onSubmit={handleSignUp} className="auth-modal-form">
              <div className="form-grid">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Create Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <button type="submit" className="btn-request-otp" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'} <ChevronRight size={20} />
              </button>
              <button type="button" className="btn-back" onClick={() => setStep('choose')}>
                Already have an account? Login
              </button>
            </form>
          </>
        )}

        {message && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {(step === 'choose' || step === 'email-login') && (
          <>
            <div className="auth-modal-divider">
              <span>Or continue with</span>
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
          </>
        )}

        <div className="auth-modal-footer">
          <p>
            By continuing, you agree to our{' '}
            <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Use</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
