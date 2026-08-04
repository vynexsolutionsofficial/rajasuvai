import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, ChevronRight, Mail, Lock, Sparkles } from 'lucide-react';
import { supabase } from '../../../supabaseClient';
import { api } from '../../../services/api';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { cn } from '../../../lib/cn';

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
      const data = await api.post('/api/auth/send-otp', { email: otpEmail });
      if (data.success) {
        showMsg('success', 'OTP sent to your email. Check your inbox.');
        setStep('otp-code');
      } else {
        showMsg('error', data.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      showMsg('error', err.message || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const data = await api.post('/api/auth/verify-otp', { email: otpEmail, otp: otpCode });
      if (data.success) {
        if (data.userExists) {
          showMsg('success', 'Verified! Please use Email Login to sign in.');
          setTimeout(() => setStep('email-login'), 1500);
        } else {
          showMsg('success', 'Email verified! Complete your profile below.');
          setFormData((f) => ({ ...f, email: otpEmail }));
          setTimeout(() => setStep('signup'), 1000);
        }
      } else {
        showMsg('error', data.message || 'Invalid or expired OTP');
      }
    } catch (err: any) {
      showMsg('error', err.message || 'Verification failed. Please try again.');
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
      // Supabase returns this when "Confirm email" is enabled and the user
      // hasn't clicked the link in the confirmation email yet.
      const notConfirmed = /email not confirmed/i.test(err?.message || '');
      showMsg(
        'error',
        notConfirmed
          ? 'Please confirm your email first — check your inbox for the confirmation link, then log in.'
          : err.message || 'Invalid credentials'
      );
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
      const data = await api.post('/api/auth/register', formData);
      if (data.requiresConfirmation) {
        showMsg('success', 'Account created! Check your email for a confirmation link, then log in.');
        setTimeout(() => setStep('email-login'), 3000);
      } else {
        showMsg('success', 'Account created! You can now log in.');
        setTimeout(() => setStep('email-login'), 1500);
      }
    } catch (err: any) {
      showMsg('error', err.message || 'Registration failed');
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
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (err: any) {
      showMsg('error', err.message || 'Google Login failed. Please enable Google OAuth in Supabase.');
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full text-black/40 hover:bg-black/5"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* ---- CHOOSE METHOD ---- */}
        {step === 'choose' && (
          <>
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-brand-950">Welcome to Rajasuvai</h2>
              <p className="mt-1 text-sm text-black/55">Choose how you'd like to sign in</p>
            </div>
            <div className="space-y-2">
              <AuthMethodButton icon={<Mail size={18} />} label="Login with Email OTP" onClick={() => setStep('otp-email')} />
              <AuthMethodButton icon={<Lock size={18} />} label="Login with Password" onClick={() => setStep('email-login')} />
              <AuthMethodButton icon={<Sparkles size={18} />} label="Create New Account" onClick={() => setStep('signup')} />
            </div>
          </>
        )}

        {/* ---- OTP: ENTER EMAIL ---- */}
        {step === 'otp-email' && (
          <>
            <ModalHeader title="Login with OTP" subtitle="We'll send a 6-digit code to your email" />
            <form onSubmit={handleSendOTP} className="space-y-3">
              <Input
                type="email"
                placeholder="Your email address"
                value={otpEmail}
                onChange={(e) => setOtpEmail(e.target.value)}
                required
                autoFocus
              />
              <Button type="submit" className="w-full" disabled={loading} loading={loading}>
                {loading ? 'Sending...' : 'Send OTP'} <ChevronRight size={18} />
              </Button>
              <BackButton onClick={() => setStep('choose')} />
            </form>
          </>
        )}

        {/* ---- OTP: ENTER CODE ---- */}
        {step === 'otp-code' && (
          <>
            <ModalHeader title="Enter OTP" subtitle={<>Check your inbox at <strong className="text-brand-950">{otpEmail}</strong></>} />
            <form onSubmit={handleVerifyOTP} className="space-y-3">
              <Input
                type="text"
                placeholder="6-digit OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
                autoFocus
                className="text-center text-xl tracking-[0.3em]"
              />
              <Button type="submit" className="w-full" disabled={loading || otpCode.length < 6} loading={loading}>
                {loading ? 'Verifying...' : 'Verify & Continue'} <ChevronRight size={18} />
              </Button>
              <BackButton onClick={() => setStep('otp-email')} label="Resend OTP" />
            </form>
          </>
        )}

        {/* ---- EMAIL + PASSWORD LOGIN ---- */}
        {step === 'email-login' && (
          <>
            <ModalHeader title="Login with Password" subtitle="Enter your email and password" />
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoFocus
              />
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <Button type="submit" className="w-full" disabled={loading} loading={loading}>
                {loading ? 'Logging in...' : 'Login'} <ChevronRight size={18} />
              </Button>
              <BackButton onClick={() => setStep('choose')} />
            </form>
          </>
        )}

        {/* ---- SIGN UP ---- */}
        {step === 'signup' && (
          <>
            <ModalHeader title="Create Account" subtitle="Join the Rajasuvai family" />
            <form onSubmit={handleSignUp} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  type="password"
                  placeholder="Create Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading} loading={loading}>
                {loading ? 'Creating...' : 'Create Account'} <ChevronRight size={18} />
              </Button>
              <BackButton onClick={() => setStep('choose')} label="Already have an account? Login" />
            </form>
          </>
        )}

        {message && (
          <div
            className={cn(
              'mt-4 rounded-lg px-3.5 py-2.5 text-sm font-medium',
              message.type === 'error' ? 'bg-error-50 text-error-600' : 'bg-fresh-100 text-fresh-700'
            )}
          >
            {message.text}
          </div>
        )}

        {(step === 'choose' || step === 'email-login') && (
          <>
            <div className="my-5 flex items-center gap-3 text-xs font-medium text-black/40">
              <div className="h-px flex-1 bg-black/10" />
              Or continue with
              <div className="h-px flex-1 bg-black/10" />
            </div>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-black/10 py-2.5 text-sm font-semibold text-brand-950 hover:bg-black/[0.03] disabled:opacity-60"
            >
              <svg viewBox="0 0 48 48" width="20" height="20">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              Google
            </button>
          </>
        )}

        <p className="mt-5 text-center text-xs text-black/40">
          By continuing, you agree to our{' '}
          <a href="/privacy" className="underline hover:text-brand-600">Privacy Policy</a> and{' '}
          <a href="/terms" className="underline hover:text-brand-600">Terms of Use</a>.
        </p>
      </motion.div>
    </div>,
    document.body
  );
};

const ModalHeader: React.FC<{ title: string; subtitle: React.ReactNode }> = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="font-display text-2xl font-bold text-brand-950">{title}</h2>
    <p className="mt-1 text-sm text-black/55">{subtitle}</p>
  </div>
);

const BackButton: React.FC<{ onClick: () => void; label?: string }> = ({ onClick, label = 'Back' }) => (
  <button type="button" onClick={onClick} className="w-full text-center text-sm font-semibold text-black/50 hover:text-brand-600">
    {label}
  </button>
);

const AuthMethodButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-3 rounded-xl border border-black/10 px-4 py-3.5 text-left text-sm font-semibold text-brand-950 hover:border-brand-300 hover:bg-brand-50/50"
  >
    <span className="text-brand-500">{icon}</span>
    <span className="flex-1">{label}</span>
    <ChevronRight size={16} className="text-black/30" />
  </button>
);

export default AuthModal;
