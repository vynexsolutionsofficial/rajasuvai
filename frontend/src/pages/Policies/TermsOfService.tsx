import React from 'react';
import PolicyLayout, { PolicyHeading } from './PolicyLayout';

const TermsOfService: React.FC = () => {
  return (
    <PolicyLayout title="Terms of Service">
      <PolicyHeading>1. Introduction</PolicyHeading>
      <p>
        Welcome to Rajasuvai! These Terms of Service ("Terms") govern your use of the website rajasuvai.com operated by Rajasuvai Foods Pvt Ltd ("we", "our", or "us").
        By accessing or using our website, purchasing our products, or registering an account, you agree to be bound by these Terms.
        If you do not agree with any part of these Terms, you must refrain from using our services.
      </p>

      <PolicyHeading>2. User Accounts</PolicyHeading>
      <p>
        When you create an account with us, you guarantee that the information you provide is accurate, complete, and current at all times.
        Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account.
        You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account.
      </p>

      <PolicyHeading>3. Products and Pricing</PolicyHeading>
      <p>
        We strive to ensure that all details, descriptions, and prices of products appearing on our website are accurate.
        However, errors may occur. If we discover an error in the price of any goods you have ordered, we will inform you of this as soon as possible and give you the option of reconfirming your order at the correct price or cancelling it.
        All prices are inclusive of GST as applicable in India. Delivery costs will be charged in addition; such additional charges are clearly displayed where applicable and included in the 'Total Cost'.
      </p>

      <PolicyHeading>4. Intellectual Property</PolicyHeading>
      <p>
        The website and its original content, features, and functionality are and will remain the exclusive property of Rajasuvai Foods Pvt Ltd and its licensors.
        The website is protected by copyright, trademark, and other laws of India. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Rajasuvai Foods Pvt Ltd.
      </p>

      <PolicyHeading>5. Limitation of Liability</PolicyHeading>
      <p>
        In no event shall Rajasuvai Foods Pvt Ltd, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages,
        including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service;
        (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content,
        whether based on warranty, contract, tort (including negligence) or any other legal theory.
      </p>

      <PolicyHeading>6. Governing Law & Jurisdiction</PolicyHeading>
      <p>
        These Terms shall be governed and construed in accordance with the laws of India.
        Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Chennai, Tamil Nadu.
      </p>

      <PolicyHeading>7. Contact Us</PolicyHeading>
      <p>
        If you have any questions about these Terms, please contact us at: <br />
        <strong>Email:</strong> support@rajasuvai.com <br />
        <strong>Address:</strong> Rajasuvai Foods Pvt Ltd, Chennai, Tamil Nadu, India.
      </p>
    </PolicyLayout>
  );
};

export default TermsOfService;
