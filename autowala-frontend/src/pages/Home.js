import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const OFFERS = [
  { emoji: '🎉', title: '50% OFF First Ride', sub: 'Use code: AUTOWALA50', color: '#f59e0b' },
  { emoji: '⚡', title: 'Flash Deal', sub: 'Rides under ₹30 today!', color: '#10b981' },
  { emoji: '👑', title: 'VIP Member', sub: 'Unlimited rides this month', color: '#8b5cf6' },
  { emoji: '🌧️', title: 'Monsoon Special', sub: '20% off rainy day rides', color: '#3b82f6' },
];

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('autowala_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div>
          <div className="header-logo">🚗 AutoWala</div>
          <div className="header-greeting">{getGreeting()}, {user?.name?.split(' ')[0] || 'Rider'} 👋</div>
        </div>
        <div className="header-avatar" onClick={() => navigate('/profile')}>
          {getInitials(user?.name || 'U')}
        </div>
      </header>

      <div className="page-content">
        {/* Hero Card */}
        <div className="hero-card">
          <h2>Where to go today?</h2>
          <p>Book a safe, affordable auto in seconds</p>
          <button
            className="btn-primary"
            style={{ marginTop: '1rem', padding: '10px 24px', fontSize: '0.9rem' }}
            onClick={() => navigate('/trip')}
          >
            Book a Ride →
          </button>
        </div>

        {/* Quick Actions */}
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-actions">
          <div className="quick-action-btn" onClick={() => navigate('/trip')}>
            <div className="qa-icon">🚗</div>
            Book Auto
          </div>
          <div className="quick-action-btn" onClick={() => navigate('/trip')}>
            <div className="qa-icon">📋</div>
            Trip History
          </div>
          <div className="quick-action-btn" onClick={() => navigate('/profile')}>
            <div className="qa-icon">👤</div>
            My Profile
          </div>
          <div className="quick-action-btn">
            <div className="qa-icon">💬</div>
            Support
          </div>
        </div>

        {/* Offers */}
        <h3 className="section-title">🔥 Offers & Deals</h3>
        <div className="offer-cards">
          {OFFERS.map((offer, i) => (
            <div className="offer-card" key={i} style={{ borderColor: offer.color + '40' }}>
              <div className="offer-emoji">{offer.emoji}</div>
              <div className="offer-title">{offer.title}</div>
              <div className="offer-sub">{offer.sub}</div>
            </div>
          ))}
        </div>

        {/* Why AutoWala */}
        <h3 className="section-title">Why AutoWala?</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { icon: '⚡', title: 'Instant Booking', desc: 'Driver found in under 60 seconds' },
            { icon: '🛡️', title: 'Safe & Verified', desc: 'All drivers are background-checked' },
            { icon: '💰', title: 'Fair Pricing', desc: 'No surge pricing, ever' },
            { icon: '📞', title: 'Direct Contact', desc: 'Call or WhatsApp your driver' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default Home;
