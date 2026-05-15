import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Email Subscriber Schema
const emailSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  recipeName: {
    type: String,
    default: ''
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    default: 'recipe_capture'
  }
});

const EmailSubscriber = mongoose.model('EmailSubscriber', emailSubscriberSchema);

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/email/capture
router.post('/capture', async (req, res) => {
  try {
    const { email, recipeName } = req.body;

    // Validate email format
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Check if email already exists
    const existingSubscriber = await EmailSubscriber.findOne({ email: trimmedEmail });

    if (existingSubscriber) {
      return res.status(200).json({ 
        success: true, 
        message: 'Already subscribed!' 
      });
    }

    // Create new subscriber
    const newSubscriber = new EmailSubscriber({
      email: trimmedEmail,
      recipeName: recipeName || '',
      subscribedAt: new Date(),
      source: 'recipe_capture'
    });

    await newSubscriber.save();

    return res.status(201).json({ 
      success: true, 
      message: 'Subscribed successfully!' 
    });

  } catch (error) {
    console.error('Email capture error:', error);

    // Handle duplicate key error (in case of race condition)
    if (error.code === 11000) {
      return res.status(200).json({ 
        success: true, 
        message: 'Already subscribed!' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Failed to save email. Please try again.' 
    });
  }
});

export default router;
