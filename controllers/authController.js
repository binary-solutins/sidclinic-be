const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

exports.register = async (req, res) => {
  const { name, email, password, specialty, bio } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Name, email, password, specialty, and bio are required' });
  }

  try {
    const [userExists] = await db.query('SELECT * FROM users2 WHERE email = ?', [email]);
    // Check if user already exists
    if (userExists && userExists.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    await db.query('INSERT INTO users2 (name, email, password, specialty, bio) VALUES (?, ?, ?, ?, ?)', [name, email, hashedPassword, specialty, bio]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
    console.log(err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Destructure the results array properly
    const [rows] = await db.query('SELECT * FROM users2 WHERE email = ?', [email]);
    console.log(rows)
    // Check if any user was found
    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
   
    if (!rows.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, rows.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: rows.user_id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};