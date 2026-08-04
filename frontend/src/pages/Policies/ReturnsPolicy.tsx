import React from 'react';
import PolicyLayout, { PolicyHeading, PolicyList } from './PolicyLayout';

const ReturnsPolicy: React.FC = () => {
  return (
    <PolicyLayout title="Returns & Refunds">
      <PolicyHeading>1. Return Eligibility</PolicyHeading>
      <p>
        Due to the perishable nature of our products (spices, oils, staples) and in compliance with FSSAI hygiene standards, we generally do not accept returns on food items.
        However, we want you to be completely satisfied with your Rajasuvai purchase.
        If you receive a defective, damaged, or incorrect item, you may request a refund or replacement within 7 days of delivery.
      </p>

      <PolicyHeading>2. Conditions for Return/Refund</PolicyHeading>
      <PolicyList>
        <li>The item must be in its original packaging, unopened and unused.</li>
        <li>You must provide visual proof (photos or unboxing video) of the damaged or incorrect item.</li>
        <li>A receipt or proof of purchase is required.</li>
      </PolicyList>

      <PolicyHeading>3. Process to Request a Refund</PolicyHeading>
      <p>
        To initiate a request, please contact us at <strong>support@rajasuvai.com</strong> with your order number, details of the issue, and accompanying photos.
        We will notify you of the approval or rejection of your refund/replacement within 48 hours.
      </p>

      <PolicyHeading>4. Approved Refunds</PolicyHeading>
      <p>
        If approved, your refund will be processed and applied to your original method of payment (e.g., Credit Card, UPI) within 5-7 business days.
        In the case of a replacement, a new order will be dispatched to you at no additional cost.
      </p>

      <PolicyHeading>5. Non-Refundable Items</PolicyHeading>
      <PolicyList>
        <li>Gift cards</li>
        <li>Items purchased on final sale or clearance</li>
        <li>Food items that have been opened or used</li>
      </PolicyList>
    </PolicyLayout>
  );
};

export default ReturnsPolicy;
