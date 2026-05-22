import React from 'react';
import './PolicyPage.css';

const ShippingPolicy: React.FC = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <div className="policy-header">
          <h1>Shipping Policy</h1>
          <p className="last-updated">Last Updated: May 2026</p>
        </div>
        
        <div className="policy-content">
          <h2>1. Processing Time</h2>
          <p>
            All orders are processed within 1-2 business days from our facility in Chennai, Tamil Nadu. Orders are not shipped or delivered on weekends or public holidays.
            If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
          </p>

          <h2>2. Shipping Rates & Delivery Estimates</h2>
          <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
          <ul>
            <li><strong>Standard Shipping:</strong> 3-5 business days across India</li>
            <li><strong>Express Shipping:</strong> 1-2 business days (available in select metro cities)</li>
          </ul>
          <p>
            <em>Delivery delays can occasionally occur due to unforeseen circumstances or carrier issues.</em>
          </p>

          <h2>3. Shipment Confirmation & Order Tracking</h2>
          <p>
            You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). 
            The tracking number will be active within 24 hours.
          </p>

          <h2>4. International Shipping</h2>
          <p>
            Currently, Rajasuvai Foods Pvt Ltd only ships within India. We are actively working on expanding our delivery network to international locations to share our authentic flavors globally.
          </p>

          <h2>5. Damages</h2>
          <p>
            Rajasuvai Foods Pvt Ltd takes utmost care in packaging; however, we are not liable for products damaged or lost during transit by third-party carriers. 
            If you received your order damaged, please contact us immediately at support@rajasuvai.com with an unboxing video so we can assist you in filing a claim with the delivery partner.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
