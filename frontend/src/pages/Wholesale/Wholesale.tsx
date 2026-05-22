import React from "react";

const Wholesale: React.FC = () => (
  <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 1rem", textAlign: "center" }}>
    <div>
      <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "2rem", color: "#1C1917", marginBottom: "1rem" }}>
        Wholesale Enquiries
      </h1>
      <p style={{ color: "#57534E", fontSize: "1.05rem", maxWidth: "480px", margin: "0 auto 2rem" }}>
        Interested in bulk orders? Contact us at{" "}
        <a href="mailto:support@rajasuvai.com" style={{ color: "#E8600A", textDecoration: "none", fontWeight: 600 }}>
          support@rajasuvai.com
        </a>{" "}
        or WhatsApp us for our wholesale price list.
      </p>
      <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
        style={{ display: "inline-block", background: "#25D366", color: "#fff", padding: "12px 28px", borderRadius: "10px", fontWeight: 600, textDecoration: "none", fontSize: "1rem" }}>
        WhatsApp Us
      </a>
    </div>
  </div>
);

export default Wholesale;
