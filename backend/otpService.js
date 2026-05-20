/**
 * Email OTP Service
 * In-memory store with 10-minute expiry. Each email gets one active OTP at a time.
 */

const otpStore = new Map(); // email -> { otp, expiresAt }
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

export const generateOTP = (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS
  });
  return otp;
};

export const verifyOTP = (email, code) => {
  const entry = otpStore.get(email.toLowerCase());
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return false;
  }
  if (entry.otp !== code) return false;
  otpStore.delete(email.toLowerCase());
  return true;
};

export const hasActiveOTP = (email) => {
  const entry = otpStore.get(email.toLowerCase());
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return false;
  }
  return true;
};
