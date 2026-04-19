import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-bg" />
      <div className="landing-grid" />

      <div className="landing-content">
        <div className="brand-badge">
          🚗 Kerala's #1 Auto App
        </div>

        <h1 className="landing-title">
          Auto
          <span>Wala</span>
        </h1>

        <p className="landing-subtitle">
          Book your auto-rickshaw in seconds. Fast, safe, and reliable rides across Kerala.
        </p>

        <div className="landing-buttons">
          <button
            className="btn-primary"
            onClick={() => navigate('/register')}
          >
            Get Started
          </button>
          <button
            className="btn-outline"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>

        <div className="landing-stats">
          <div className="stat-item">
            <div className="stat-num">500+</div>
            <div className="stat-label">Drivers</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">10K+</div>
            <div className="stat-label">Rides</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">4.8★</div>
            <div className="stat-label">Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
