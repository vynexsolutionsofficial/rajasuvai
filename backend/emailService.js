import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * --- EMAIL NOTIFICATION SERVICE ---
 * Uses Nodemailer with Gmail SMTP
 */

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD // Use Gmail App Password (2FA)
  }
});

/**
 * Reusable sendEmail function
 */
export const sendEmail = async (to, subject, html) => {
  console.log(`[EMAIL SERVICE] Sending to: ${to} | Subject: ${subject}`);
  
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('[EMAIL SERVICE] Gmail credentials not set. Logging email content instead.');
    console.log('HTML CONTENT:', html);
    return { success: true, mock: true };
  }

  try {
    const mailOptions = {
      from: `"Rajasuvai Spices" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SERVICE] Email sent: ${info.response}`);
    return { success: true, info: info.response };
  } catch (error) {
    console.error('[EMAIL SERVICE] Error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * WhatsApp Link Generator Helper
 */
const getWhatsAppLink = (phone, message) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};

/**
 * Notification Templates
 */

export const sendLoginEmail = (to, name) => {
  const subject = 'Login Alert: Welcome back to Rajasuvai Spices';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h1 style="color: #8B5A2B; text-align: center;">Rajasuvai Spices</h1>
      <p>Hello <strong>${name}</strong>,</p>
      <p>We noticed a new login to your account. If this was you, you can safely ignore this email.</p>
      <p>If you suspect unauthorized access, please contact our support team immediately.</p>
      <hr style="border: 0; border-top: 1px solid #eee;" />
      <p style="text-align: center; color: #777; font-size: 12px;">© 2026 Rajasuvai Spices. All rights reserved.</p>
    </div>
  `;
  return sendEmail(to, subject, html);
};

export const sendOrderEmail = (to, name, orderId, amount) => {
  const subject = `Order Confirmed: #${orderId}`;
  const whatsappLink = getWhatsAppLink('918050267797', `Hi Rajasuvai, I have a query about my order #${orderId}`);
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #34A853; text-align: center;">Order Confirmed!</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Thank you for shopping with Rajasuvai Spices! Your order <strong>#${orderId}</strong> for <strong>₹${amount}</strong> is being processed.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${whatsappLink}" style="background-color: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Chat on WhatsApp
        </a>
      </div>
      <p>We'll notify you once it's shipped.</p>
      <hr style="border: 0; border-top: 1px solid #eee;" />
      <p style="text-align: center; color: #777; font-size: 12px;">Premium Quality. Artisan Flavors.</p>
    </div>
  `;
  return sendEmail(to, subject, html);
};

export const sendOrderStatusEmail = (to, name, orderId, status) => {
  const subject = `Order Status Update: #${orderId}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #4285F4; text-align: center;">Order Update</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your order <strong>#${orderId}</strong> has been updated to: <strong style="color: #D97706;">${status.toUpperCase()}</strong>.</p>
      <p>Check your order details on our website for real-time tracking.</p>
      <hr style="border: 0; border-top: 1px solid #eee;" />
      <p style="text-align: center; color: #777; font-size: 12px;">Thank you for choosing Rajasuvai Spices.</p>
    </div>
  `;
  return sendEmail(to, subject, html);
};
