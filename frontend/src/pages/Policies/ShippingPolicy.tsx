import React from 'react';
import PolicyLayout, { PolicyHeading, PolicyList } from './PolicyLayout';

const ShippingPolicy: React.FC = () => {
  return (
    <PolicyLayout title="Shipping Policy">
      <PolicyHeading>1. Processing Time</PolicyHeading>
      <p>
        All orders are processed within 1-2 business days from our facility in Chennai, Tamil Nadu. Orders are not shipped or delivered on weekends or public holidays.
        If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
      </p>

      <PolicyHeading>2. Shipping Rates & Delivery Estimates</PolicyHeading>
      <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
      <PolicyList>
        <li><strong>Standard Shipping:</strong> 3-5 business days across India</li>
        <li><strong>Express Shipping:</strong> 1-2 business days (available in select metro cities)</li>
      </PolicyList>
      <p><em>Delivery delays can occasionally occur due to unforeseen circumstances or carrier issues.</em></p>

      <PolicyHeading>3. Shipment Confirmation & Order Tracking</PolicyHeading>
      <p>
        You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s).
        The tracking number will be active within 24 hours.
      </p>

      <PolicyHeading>4. International Shipping</PolicyHeading>
      <p>
        Currently, Rajasuvai Foods Pvt Ltd only ships within India. We are actively working on expanding our delivery network to international locations to share our authentic flavors globally.
      </p>

      <PolicyHeading>5. Damages</PolicyHeading>
      <p>
        Rajasuvai Foods Pvt Ltd takes utmost care in packaging; however, we are not liable for products damaged or lost during transit by third-party carriers.
        If you received your order damaged, please contact us immediately at support@rajasuvai.com with an unboxing video so we can assist you in filing a claim with the delivery partner.
      </p>
    </PolicyLayout>
  );
};

export default ShippingPolicy;
