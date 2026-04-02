import React, { useState } from 'react';
import { 
  Settings as SettingsIcon,
  Store, 
  Bell, 
  Save, 
  CheckCircle,
  Database,
  Mail,
  Smartphone,
  MapPin,
  Lock
} from 'lucide-react';
import './ProductManagement.css'; // Reusing layout styles

const Settings: React.FC = () => {
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="settings-page" style={{ padding: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Sidebar Settings Categories */}
        <div className="settings-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button className="btn-icon active" style={{ width: '100%', justifyContent: 'flex-start', padding: '1rem', borderRadius: '12px', background: 'rgba(249, 168, 38, 0.1)', color: '#f9a826' }}>
            <Store size={20} style={{ marginRight: '0.75rem' }} /> Store Profile
          </button>
          <button className="btn-icon" style={{ width: '100%', justifyContent: 'flex-start', padding: '1rem', borderRadius: '12px', opacity: 0.5 }}>
            <Bell size={20} style={{ marginRight: '0.75rem' }} /> Notifications
          </button>
          <button className="btn-icon" style={{ width: '100%', justifyContent: 'flex-start', padding: '1rem', borderRadius: '12px', opacity: 0.5 }}>
            <Database size={20} style={{ marginRight: '0.75rem' }} /> Backup & Restore
          </button>
          <button className="btn-icon" style={{ width: '100%', justifyContent: 'flex-start', padding: '1rem', borderRadius: '12px', opacity: 0.5 }}>
            <Lock size={20} style={{ marginRight: '0.75rem' }} /> Security
          </button>
        </div>

        {/* Main Settings Form */}
        <div className="settings-content dashboard-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><SettingsIcon size={24} /> General Settings</h2>
            {success && <div style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18}/> Changes Saved</div>}
          </div>

          <form onSubmit={handleSave}>
            <div className="form-section" style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Store Information</h4>
              
              <div className="form-group">
                <label>Store Name</label>
                <input type="text" defaultValue="Suvai Premium Spices" className="search-input" style={{ width: '100%' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label><Mail size={14} /> Support Email</label>
                  <input type="email" defaultValue="support@rajasuvai.com" className="search-input" style={{ width: '100%' }} />
                </div>
                <div className="form-group">
                  <label><Smartphone size={14} /> Business Phone</label>
                  <input type="text" defaultValue="+91 98765 43210" className="search-input" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="form-group">
                <label><MapPin size={14} /> Warehouse Address</label>
                <textarea 
                  defaultValue="12, Kuruvikkaran Salai, Anna Nagar, Madurai, Tamil Nadu 625020" 
                  className="search-input" 
                  style={{ width: '100%', minHeight: '80px', padding: '0.75rem' }}
                />
              </div>
            </div>

            <div className="form-section">
              <h4 style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Global Configurations</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label>Low Stock Threshold</label>
                  <input type="number" defaultValue={10} className="search-input" style={{ width: '100%' }} />
                  <small style={{ color: 'rgba(255,255,255,0.3)', marginTop: '0.25rem', display: 'block' }}>Alert will trigger below this quantity</small>
                </div>
                <div className="form-group">
                  <label>Currency Symbol</label>
                  <input type="text" defaultValue="₹" className="search-input" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
                <Save size={20} /> Save Configuration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
