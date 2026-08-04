import React from 'react';
import PolicyLayout, { PolicyHeading, PolicyList } from './PolicyLayout';

const PrivacyPolicy: React.FC = () => {
  return (
    <PolicyLayout title="Privacy Policy">
      <PolicyHeading>1. Information We Collect</PolicyHeading>
      <p>
        We collect information you provide directly to us, such as when you create or modify your account,
        place an order, contact customer support, or subscribe to our newsletter. This information may include:
        your name, email address, phone number, shipping and billing address, and payment transaction details.
      </p>

      <PolicyHeading>2. How We Use Your Information</PolicyHeading>
      <p>We may use the information we collect about you to:</p>
      <PolicyList>
        <li>Process and fulfill your orders, including sending emails to confirm your order status and shipment.</li>
        <li>Communicate with you about products, services, offers, and promotions.</li>
        <li>Maintain and improve our website, troubleshoot technical issues, and analyze shopping trends.</li>
        <li>Prevent fraudulent transactions and monitor against theft.</li>
      </PolicyList>

      <PolicyHeading>3. Sharing of Information</PolicyHeading>
      <p>
        We do not sell or rent your personal information to third parties. We only share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you. This includes:
      </p>
      <PolicyList>
        <li><strong>Payment Gateways:</strong> To securely process your credit card and UPI payments.</li>
        <li><strong>Logistics Partners:</strong> To print shipping labels and deliver your orders.</li>
        <li><strong>Analytics Providers:</strong> To help us understand how customers interact with our website.</li>
      </PolicyList>

      <PolicyHeading>4. Data Security</PolicyHeading>
      <p>
        We implement a variety of security measures to maintain the safety of your personal information.
        Your personal data is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential.
        All sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology.
      </p>

      <PolicyHeading>5. Cookies</PolicyHeading>
      <p>
        Our website uses "cookies" to enhance your shopping experience, remember the items in your cart, and compile aggregate data about site traffic so that we can offer better site experiences in the future.
        You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies through your browser settings.
      </p>

      <PolicyHeading>6. Your Rights</PolicyHeading>
      <p>
        You have the right to access, correct, or delete your personal data stored with us. You may update your account information by logging into your profile. If you wish to completely delete your account, please contact us at support@rajasuvai.com.
      </p>
    </PolicyLayout>
  );
};

export default PrivacyPolicy;
