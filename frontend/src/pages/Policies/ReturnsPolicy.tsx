import React from 'react';
import './PolicyPage.css';

const ReturnsPolicy: React.FC = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <div className="policy-header">
          <h1>Returns & Refunds</h1>
          <p className="last-updated">Last Updated: October 2023</p>
        </div>
        
        <div className="policy-content">
          <h2>1. Return Eligibility</h2>
          <p>
            Due to the perishable nature of our products (spices, oils, staples), we generally do not accept returns. 
            However, we want you to be completely satisfied with your purchase. 
            If you receive a defective, damaged, or incorrect item, you may request a refund or replacement within 7 days of delivery.
          </p>

          <h2>2. Conditions for Return/Refund</h2>
          <ul>
            <li>The item must be in its original packaging, unopened and unused.</li>
            <li>You must provide visual proof (photos) of the damaged or incorrect item.</li>
            <li>A receipt or proof of purchase is required.</li>
          </ul>

          <h2>3. Process to Request a Refund</h2>
          <p>
            To initiate a request, please contact us at support@rajasuvai.com with your order number, details of the issue, and accompanying photos. 
            We will notify you of the approval or rejection of your refund/replacement.
          </p>

          <h2>4. Approved Refunds</h2>
          <p>
            If approved, your refund will be processed and applied to your original method of payment within 5-7 business days. 
            In the case of a replacement, a new order will be dispatched to you at no additional cost.
          </p>

          <h2>5. Non-Refundable Items</h2>
          <ul>
            <li>Gift cards</li>
            <li>Items purchased on final sale or clearance</li>
            <li>Items that have been opened or used</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicy;
