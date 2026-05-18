import express from 'express';
import webpush from 'web-push';
import PushSubscription from '../models/PushSubscription.js';

const router = express.Router();

// Lazy initialization of VAPID details
let vapidConfigured = false;

function ensureVapidConfigured() {
  if (vapidConfigured) return;
  
  const vapidEmail = process.env.VAPID_EMAIL || 'mailto:mayursomnathpawar123@gmail.com';
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

  if (!vapidPublicKey || !vapidPrivateKey) {
    console.error('[push] VAPID keys not found in environment variables');
    throw new Error('VAPID keys not configured');
  }
  
  webpush.setVapidDetails(
    vapidEmail,
    vapidPublicKey,
    vapidPrivateKey
  );
  
  vapidConfigured = true;
  console.log('[push] VAPID details configured successfully');
}

router.post('/subscribe', async (req, res) => {
  try {
    ensureVapidConfigured();
    const { subscription } = req.body;
    if (!subscription?.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription' });
    }
    await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        active: true
      },
      { upsert: true, new: true }
    );
    console.log('[push] new subscription saved');
    return res.json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    console.error('[push] subscribe error:', err.message);
    return res.status(500).json({ error: 'Failed to save subscription' });
  }
});

router.post('/unsubscribe', async (req, res) => {
  try {
    const { endpoint } = req.body;
    await PushSubscription.findOneAndUpdate(
      { endpoint },
      { active: false }
    );
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// Test endpoint to send notification immediately (for testing)
router.post('/test', async (req, res) => {
  try {
    ensureVapidConfigured();
    await sendDailyNotification();
    return res.json({ success: true, message: 'Test notification sent' });
  } catch (err) {
    console.error('[push] test notification error:', err.message);
    return res.status(500).json({ error: 'Failed to send test notification' });
  }
});

export async function sendDailyNotification() {
  ensureVapidConfigured();
  const subscriptions = await PushSubscription.find({ active: true });
  console.log(`[push] sending daily notification to ${subscriptions.length} subscribers`);

  const payload = JSON.stringify({
    title: '🍳 What\'s for dinner tonight?',
    body: 'Tap what\'s in your kitchen and get a real Indian recipe in 10 seconds',
    icon: '/favicon.ico',
    url: 'https://chefmate-frontend.vercel.app/app'
  });

  let successCount = 0;
  let failCount = 0;

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: sub.keys },
        payload
      );
      successCount++;
    } catch (err) {
      failCount++;
      if (err.statusCode === 410) {
        await PushSubscription.findOneAndUpdate(
          { endpoint: sub.endpoint },
          { active: false }
        );
      }
    }
  }

  console.log(`[push] sent: ${successCount} success, ${failCount} failed`);
}

router.post('/test-notification', async (req, res) => {
  try {
    await sendDailyNotification()
    return res.json({ success: true, message: 'Test notification sent' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})

export default router;
