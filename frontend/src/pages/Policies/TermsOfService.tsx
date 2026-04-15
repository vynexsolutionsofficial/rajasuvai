import React from 'react';
import './PolicyPage.css';

const TermsOfService: React.FC = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <div className="policy-header">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last Updated: October 2023</p>
        </div>
        
        <div className="policy-content">
          <h2>1. Terms</h2>
          <p>
            By accessing the website at rajasuvai.com, you are agreeing to be bound by these terms of service, 
            all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on Rajasuvai's website for personal, non-commercial transitory viewing only. 
            This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
            <li>attempt to decompile or reverse engineer any software contained on the website;</li>
            <li>remove any copyright or other proprietary notations from the materials; or</li>
            <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>

          <h2>3. Disclaimer</h2>
          <p>
            The materials on Rajasuvai's website are provided on an 'as is' basis. Rajasuvai makes no warranties, expressed or implied, 
            and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, 
            fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2>4. Limitations</h2>
          <p>
            In no event shall Rajasuvai or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, 
            or due to business interruption) arising out of the use or inability to use the materials on Rajasuvai's website.
          </p>

          <h2>5. Revisions and Errata</h2>
          <p>
            The materials appearing on the website could include technical, typographical, or photographic errors. 
            Rajasuvai does not warrant that any of the materials on its website are accurate, complete or current. 
            We may make changes to the materials contained on its website at any time without notice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
