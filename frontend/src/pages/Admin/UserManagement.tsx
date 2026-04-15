import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Loader2, 
  Mail, 
  Phone, 
  ShoppingBag, 
  Calendar,
  Shield,
  User as UserIcon
} from 'lucide-react';
import './UserManagement.css';
import { api } from '../../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
  order_count: number;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/admin/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user-mgmt">
      <div className="admin-toolbar">
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'rgba(255,255,255,0.4)' }} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="search-input"
            style={{ paddingLeft: '2.5rem', width: '300px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        {loading && users.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <Loader2 className="animate-spin" size={32} />
            <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.4)' }}>Loading users...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer Info</th>
                <th>Contact</th>
                <th>Orders</th>
                <th>Joined</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info-cell">
                      <div className="user-avatar-mini">{user.name?.charAt(0) || <UserIcon size={16}/>}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>UID: #{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="contact-item"><Mail size={14} /> {user.email}</div>
                      <div className="contact-item"><Phone size={14} /> {user.phone || 'N/A'}</div>
                    </div>
                  </td>
                  <td>
                    <div className="stats-pill">
                      <ShoppingBag size={14} />
                      {user.order_count} Orders
                    </div>
                  </td>
                  <td>
                    <div className="joined-date">
                      <Calendar size={14} />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className={`role-badge ${user.role}`}>
                      <Shield size={12} />
                      {user.role}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
