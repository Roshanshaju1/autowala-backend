import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Trip = () => {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tripData, setTripData] = useState(null);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState('book'); // 'book' | 'history'
  const [histLoading, setHistLoading] = useState(false);

  const token = localStorage.getItem('autowala_token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchHistory = async () => {
    setHistLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/trip/history', authHeader);
      setHistory(res.data);
    } catch {
      setHistory([]);
    } finally {
      setHistLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'history') fetchHistory();
  }, [tab]);

  const handleBook = async () => {
    if (!pickup.trim() || !drop.trim()) {
      setError('Please enter both pickup and drop locations.');
      return;
    }
    setError('');
    setLoading(true);
    setTripData(null);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/trip/book',
        { pickup_location: pickup, drop_location: drop },
        authHeader
      );
      setTripData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not book trip. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!tripData?.trip?.id) return;
    try {
      await axios.patch(`http://localhost:5000/api/trip/cancel/${tripData.trip.id}`, {}, authHeader);
      setTripData(null);
      setPickup('');
      setDrop('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel trip.');
    }
  };

  const getStatusClass = (status) => {
    const map = { completed: 'status-completed', cancelled: 'status-cancelled', accepted: 'status-accepted', pending: 'status-pending' };
    return map[status] || 'status-pending';
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-logo">🚗 Trip</div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setTab('book')}
            style={{
              background: tab === 'book' ? 'var(--primary)' : 'var(--dark3)',
              border: 'none', borderRadius: '20px', padding: '6px 16px',
              color: tab === 'book' ? '#000' : 'var(--text-muted)',
              fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Book
          </button>
          <button
            onClick={() => setTab('history')}
            style={{
              background: tab === 'history' ? 'var(--primary)' : 'var(--dark3)',
              border: 'none', borderRadius: '20px', padding: '6px 16px',
              color: tab === 'history' ? '#000' : 'var(--text-muted)',
              fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            History
          </button>
        </div>
      </header>

      <div className="page-content">
        {tab === 'book' ? (
          <>
            <div className="trip-form">
              <h3 style={{ marginBottom: '1.25rem', fontFamily: 'Rajdhani, sans-serif', fontSize: '1.2rem' }}>
                📍 Enter Locations
              </h3>

              {error && <div className="alert alert-error">⚠️ {error}</div>}

              <div className="location-input-group">
                <span className="location-dot pickup" />
                <input
                  className="location-input"
                  placeholder="Pickup location (e.g. Ernakulam Junction)"
                  value={pickup}
                  onChange={e => { setPickup(e.target.value); setError(''); }}
                />
              </div>

              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.2rem', margin: '2px 0' }}>↕</div>

              <div className="location-input-group">
                <span className="location-dot drop" />
                <input
                  className="location-input"
                  placeholder="Drop location (e.g. MG Road)"
                  value={drop}
                  onChange={e => { setDrop(e.target.value); setError(''); }}
                />
              </div>

              <button
                className="btn-primary btn-block"
                style={{ marginTop: '1.25rem' }}
                onClick={handleBook}
                disabled={loading}
              >
                {loading ? <><span className="spinner" />Finding Driver...</> : '🔍 Search Driver'}
              </button>
            </div>

            {/* Driver Result */}
            {tripData && (
              <div className="driver-result-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>✅</span>
                  <span style={{ fontWeight: 700, color: 'var(--success)', fontFamily: 'Rajdhani, sans-serif', fontSize: '1.1rem' }}>
                    Driver Found!
                  </span>
                </div>

                <div className="driver-header">
                  <div className="driver-avatar">🧑</div>
                  <div>
                    <div className="driver-name">{tripData.driver.name}</div>
                    <div className="driver-vehicle">🚗 {tripData.driver.vehicle_number}</div>
                  </div>
                  <div className="driver-rating">⭐ {tripData.driver.rating}</div>
                </div>

                <div className="trip-info-row">
                  <span className="trip-info-label">Estimated Fare</span>
                  <span className="trip-info-value">₹{tripData.trip.fare}</span>
                </div>

                <div className="trip-info-row">
                  <span className="trip-info-label">Payment</span>
                  <span className="trip-info-value" style={{ color: 'var(--text)' }}>Cash / UPI</span>
                </div>

                <div style={{ background: 'var(--dark3)', borderRadius: 10, padding: '10px 14px', marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                  <strong style={{ color: 'var(--text)' }}>📍 From:</strong> {tripData.trip.pickup_location}<br />
                  <strong style={{ color: 'var(--text)' }}>📌 To:</strong> {tripData.trip.drop_location}
                </div>

                <div className="contact-buttons">
                  <a className="btn-call" href={`tel:${tripData.driver.mobile}`}>
                    📞 Call Driver
                  </a>
                  <a
                    className="btn-whatsapp"
                    href={`https://wa.me/91${tripData.driver.mobile}?text=Hello%20I%20booked%20an%20auto%20via%20AutoWala.%20Are%20you%20available?`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    💬 WhatsApp
                  </a>
                </div>

                <button className="btn-cancel" onClick={handleCancel}>
                  ✕ Cancel Trip
                </button>
              </div>
            )}

            {!tripData && !loading && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🚗</div>
                <p style={{ fontSize: '0.9rem' }}>Enter your pickup & drop to find nearby auto drivers</p>
              </div>
            )}
          </>
        ) : (
          <>
            <h3 className="section-title">📋 Trip History</h3>
            {histLoading ? (
              <div className="loading-full">
                <div className="spinner-large" />
                <span>Loading history...</span>
              </div>
            ) : history.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📭</div>
                <p>No trips yet. Book your first ride!</p>
              </div>
            ) : (
              history.map(trip => (
                <div className="trip-history-item" key={trip.id}>
                  <div className="trip-history-header">
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      #{trip.id} · {new Date(trip.created_at).toLocaleDateString('en-IN')}
                    </span>
                    <span className={`trip-status-badge ${getStatusClass(trip.status)}`}>
                      {trip.status}
                    </span>
                  </div>
                  <div className="trip-route">
                    <strong>From:</strong> {trip.pickup_location}<br />
                    <strong>To:</strong> {trip.drop_location}
                  </div>
                  {trip.driver_name && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      🧑 {trip.driver_name} · {trip.vehicle_number}
                    </div>
                  )}
                  {trip.fare && (
                    <div style={{ marginTop: '4px', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                      ₹{trip.fare}
                    </div>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>

      <Navbar />
    </div>
  );
};

export default Trip;
