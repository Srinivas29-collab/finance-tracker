const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/User');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.send('Auth routes working');
});

// Register route
router.post('/register', async (req, res) => {

  try {

    console.log('Register endpoint hit');

    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    // Check existing user
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // JWT token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {

    console.log('Register error:', error);

    res.status(500).json({
      message: 'Server error during registration'
    });

  }

});

router.post('/login', async (req, res) => {

  try {

    const { email, password } = req.body;

    // Check if all fields entered
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please enter all fields'
      });
    }

    // Find user
    const user = await User.findOne({ email });

    // User not found
    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Success response
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.log('Login error:', error);

    res.status(500).json({
      message: 'Server error during login'
    });

  }

});

router.get('/users', async (req, res) => {

  try {

    const users = await User.find();

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: 'Error fetching users'
    });

  }

});

module.exports = router;