import React from 'react';
import './PolicyPage.css';

const ShippingPolicy: React.FC = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <div className="policy-header">
          <h1>Shipping Policy</h1>
          <p className="last-updated">Last Updated: October 2023</p>
        </div>
        
        <div className="policy-content">
          <h2>1. Processing Time</h2>
          <p>
            All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.
            If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
          </p>

          <h2>2. Shipping Rates & Delivery Estimates</h2>
          <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
          <ul>
            <li><strong>Standard Shipping:</strong> 3-5 business days</li>
            <li><strong>Express Shipping:</strong> 1-2 business days</li>
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
            Currently, we only ship within India. We are working on expanding our delivery network to international locations soon.
          </p>

          <h2>5. Damages</h2>
          <p>
            Rajasuvai is not liable for any products damaged or lost during shipping. If you received your order damaged, 
            please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
