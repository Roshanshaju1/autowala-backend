const db = require('../config/db');

// BOOK TRIP - Find available driver and create trip
const bookTrip = async (req, res) => {
  const { pickup_location, drop_location } = req.body;
  const user_id = req.user.id;

  if (!pickup_location || !drop_location) {
    return res.status(400).json({ message: 'Pickup and drop locations are required.' });
  }

  try {
    // Find an available driver
    const [drivers] = await db.query(
      'SELECT * FROM drivers WHERE status = ? ORDER BY RAND() LIMIT 1',
      ['available']
    );

    if (drivers.length === 0) {
      return res.status(404).json({ message: 'No drivers available right now. Please try again shortly.' });
    }

    const driver = drivers[0];

    // Calculate a simple fare (₹20 base + ₹10/km estimate)
    const fare = (Math.floor(Math.random() * 80) + 50).toFixed(2); // Random ₹50–₹130

    // Create trip record
    const [result] = await db.query(
      'INSERT INTO trips (user_id, pickup_location, drop_location, driver_id, status, fare) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, pickup_location, drop_location, driver.id, 'accepted', fare]
    );

    // Mark driver as busy
    await db.query('UPDATE drivers SET status = ? WHERE id = ?', ['busy', driver.id]);

    res.status(201).json({
      message: 'Driver found! Trip booked successfully.',
      trip: {
        id: result.insertId,
        pickup_location,
        drop_location,
        fare,
        status: 'accepted'
      },
      driver: {
        id: driver.id,
        name: driver.name,
        mobile: driver.mobile,
        vehicle_number: driver.vehicle_number,
        rating: driver.rating
      }
    });
  } catch (err) {
    console.error('Book Trip Error:', err);
    res.status(500).json({ message: 'Server error. Could not book trip.' });
  }
};

// GET USER TRIP HISTORY
const getTripHistory = async (req, res) => {
  try {
    const [trips] = await db.query(
      `SELECT t.*, d.name as driver_name, d.mobile as driver_mobile, d.vehicle_number
       FROM trips t
       LEFT JOIN drivers d ON t.driver_id = d.id
       WHERE t.user_id = ?
       ORDER BY t.created_at DESC
       LIMIT 10`,
      [req.user.id]
    );
    res.json(trips);
  } catch (err) {
    console.error('Trip History Error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// CANCEL TRIP
const cancelTrip = async (req, res) => {
  const { trip_id } = req.params;

  try {
    const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [trip_id, req.user.id]);

    if (trips.length === 0) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const trip = trips[0];

    if (trip.status === 'completed' || trip.status === 'cancelled') {
      return res.status(400).json({ message: `Trip is already ${trip.status}.` });
    }

    await db.query('UPDATE trips SET status = ? WHERE id = ?', ['cancelled', trip_id]);

    // Free up the driver
    if (trip.driver_id) {
      await db.query('UPDATE drivers SET status = ? WHERE id = ?', ['available', trip.driver_id]);
    }

    res.json({ message: 'Trip cancelled successfully.' });
  } catch (err) {
    console.error('Cancel Trip Error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// COMPLETE TRIP (for driver / admin use)
const completeTrip = async (req, res) => {
  const { trip_id } = req.params;

  try {
    const [trips] = await db.query('SELECT * FROM trips WHERE id = ?', [trip_id]);

    if (trips.length === 0) return res.status(404).json({ message: 'Trip not found.' });

    await db.query('UPDATE trips SET status = ? WHERE id = ?', ['completed', trip_id]);

    // Free up driver
    if (trips[0].driver_id) {
      await db.query('UPDATE drivers SET status = ? WHERE id = ?', ['available', trips[0].driver_id]);
    }

    res.json({ message: 'Trip marked as completed.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { bookTrip, getTripHistory, cancelTrip, completeTrip };
