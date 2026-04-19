import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('autowala_token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch {
        // fallback to localStorage
        const stored = localStorage.getItem('autowala_user');
        if (stored) setUser(JSON.parse(stored));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('autowala_token');
    localStorage.removeItem('autowala_user');
    navigate('/');
  };

  const getInitials = (name) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  const menuItems = [
    { icon: '🚗', label: 'My Trips', action: () => navigate('/trip') },
    { icon: '💳', label: 'Payment Methods', action: () => {} },
    { icon: '🔔', label: 'Notifications', action: () => {} },
    { icon: '🛡️', label: 'Privacy & Security', action: () => {} },
    { icon: '❓', label: 'Help & Support', action: () => {} },
    { icon: 'ℹ️', label: 'About AutoWala', action: () => {} },
  ];

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-logo">👤 Profile</div>
      </header>

      <div className="page-content">
        {loading ? (
          <div className="loading-full">
            <div className="spinner-large" />
            <span>Loading profile...</span>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="profile-header">
              <div className="profile-avatar-big">
                {getInitials(user?.name || 'U')}
              </div>
              <div className="profile-name">{user?.name || 'AutoWala User'}</div>
              <div className="profile-mobile">📱 {user?.mobile || 'N/A'}</div>
              {user?.created_at && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Member since {new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
                </div>
              )}
            </div>

            {/* Stats Row */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1rem', marginBottom: '1.5rem'
            }}>
              {[
                { label: 'Total Rides', value: '12' },
                { label: 'This Month', value: '3' },
                { label: 'Rating Given', value: '4.8★' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: 'var(--card-bg)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '1rem', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Rajdhani, sans-serif' }}>{s.value}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Menu */}
            <div className="profile-card">
              {menuItems.map((item, i) => (
                <div className="profile-item" key={i} onClick={item.action}>
                  <span className="profile-item-icon">{item.icon}</span>
                  <span className="profile-item-text">{item.label}</span>
                  <span className="profile-item-arrow">›</span>
                </div>
              ))}
            </div>

            {/* App Version */}
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', margin: '1rem 0' }}>
              AutoWala v1.0.0 · Made with ❤️ in Kerala
            </div>

            <button className="btn-logout" onClick={handleLogout}>
              🚪 Logout
            </button>
          </>
        )}
      </div>

      <Navbar />
    </div>
  );
};

export default Profile;
