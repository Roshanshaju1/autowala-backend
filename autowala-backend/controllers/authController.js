const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// REGISTER
const register = async (req, res) => {
  const { name, mobile, password, confirmPassword } = req.body;

  if (!name || !mobile || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  if (mobile.length < 10) {
    return res.status(400).json({ message: 'Enter a valid mobile number.' });
  }

  try {
    // Check if mobile already exists
    const [existing] = await db.query('SELECT id FROM users WHERE mobile = ?', [mobile]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Mobile number already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const [result] = await db.query(
      'INSERT INTO users (name, mobile, password) VALUES (?, ?, ?)',
      [name, mobile, hashedPassword]
    );

    res.status(201).json({
      message: 'Registration successful! Please login.',
      userId: result.insertId
    });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// LOGIN
const login = async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({ message: 'Mobile and password are required.' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE mobile = ?', [mobile]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid mobile number or password.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid mobile number or password.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, mobile: user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { id: user.id, name: user.name, mobile: user.mobile }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, mobile, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ message: 'User not found.' });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { register, login, getProfile };
