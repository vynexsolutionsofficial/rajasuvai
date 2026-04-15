import React from 'react';
import './PolicyPage.css';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <div className="policy-header">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: October 2023</p>
        </div>
        
        <div className="policy-content">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create or modify your account, 
            request on-demand services, contact customer support, or otherwise communicate with us. This info may include: 
            name, email, phone number, postal address, profile picture, payment method, and other info you choose to provide.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We may use the information we collect about you to:</p>
          <ul>
            <li>Provide, maintain, and improve our services.</li>
            <li>Perform internal operations, including troubleshooting software bugs and operational problems.</li>
            <li>Send you communications we think will be of interest to you, including info about products, services, promotions, and news.</li>
            <li>Personalize and improve the services, including providing or recommending features, content, social connections, referrals, and advertisements.</li>
          </ul>

          <h2>3. Sharing of Information</h2>
          <p>
            We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. 
            This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, 
            so long as those parties agree to keep this information confidential.
          </p>

          <h2>4. Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
            Our payment processing is handled securely through industry-standard providers.
          </p>

          <h2>5. Your Choices</h2>
          <p>
            You may correct your account information at any time by logging into your online or in-app account. 
            If you wish to cancel your account, please email us, but note that we may retain certain info as required by law or for legitimate business purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
