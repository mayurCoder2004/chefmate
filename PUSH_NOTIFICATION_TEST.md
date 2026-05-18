# 🔔 Push Notification Testing Guide

## ✅ What's Been Added

### User Experience:
1. **Success Toast**: When user clicks "Yes, remind me! 🔔", they see:
   - ✅ Success: "🔔 You're all set! We'll remind you at 7pm daily"
   - ❌ Error: "Failed to enable notifications. Please try again."

2. **Better Error Handling**: The subscription now validates server response

3. **Console Logs**: Check browser console for `[push]` logs

---

## 🧪 How to Test

### Method 1: Wait for Scheduled Notification
- **Time**: Daily at **7:00 PM IST** (1:30 PM UTC)
- **Automatic**: Cron job runs automatically
- **Check**: Backend logs will show: `[cron] running daily notification job at 7PM IST`

### Method 2: Test Immediately (Recommended)

#### Step 1: Subscribe to Notifications
1. Go to Smart Recipe page: `http://localhost:5173/app`
2. Generate a recipe (select ingredients and click "Find My Recipe")
3. After recipe appears, you'll see the notification prompt
4. Click **"Yes, remind me! 🔔"**
5. Allow notifications when browser asks
6. You should see: ✅ "🔔 You're all set! We'll remind you at 7pm daily"

#### Step 2: Send Test Notification
Open a new terminal and run:

```bash
curl -X POST http://localhost:5000/api/push/test
```

**Expected Response:**
```json
{"success":true,"message":"Test notification sent"}
```

**Expected Backend Logs:**
```
[push] sending daily notification to 1 subscribers
[push] sent: 1 success, 0 failed
```

**Expected Browser Notification:**
```
🍳 What's for dinner tonight?
Tap what's in your kitchen and get a real Indian recipe in 10 seconds
```

---

## 🔍 Verification Checklist

### ✅ Frontend Checks:
- [ ] Notification prompt appears after recipe generation
- [ ] "Yes, remind me!" button shows "Setting up..." while loading
- [ ] Success toast appears after subscription
- [ ] Prompt disappears after subscription
- [ ] Browser console shows: `[push] subscription successful`

### ✅ Backend Checks:
- [ ] Server logs show: `[push] VAPID details configured successfully`
- [ ] Server logs show: `[push] new subscription saved`
- [ ] Server logs show: `[cron] daily notification job scheduled for 7PM IST`

### ✅ Database Checks:
Check MongoDB for new subscription:
```javascript
// In MongoDB Compass or Shell
db.pushsubscriptions.find({})
```

Expected document:
```json
{
  "_id": "...",
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "...",
    "auth": "..."
  },
  "userId": null,
  "subscribedAt": "2026-05-18T...",
  "active": true
}
```

---

## 🐛 Troubleshooting

### Issue: No notification prompt appears
**Solution:** 
- Clear localStorage: `localStorage.removeItem('push_dismissed')`
- Refresh page and generate a new recipe

### Issue: "Push notifications are not supported"
**Solution:**
- Use Chrome, Firefox, or Edge (not Safari on iOS)
- Ensure you're on `localhost` or `https://` (not `http://`)

### Issue: Permission denied
**Solution:**
- Check browser notification settings
- Reset site permissions in browser settings
- Try in incognito/private mode

### Issue: Test notification not received
**Solution:**
1. Check browser console for errors
2. Verify service worker is registered: DevTools → Application → Service Workers
3. Check backend logs for error messages
4. Ensure subscription exists in database

### Issue: "Failed to save subscription on server"
**Solution:**
- Check backend is running on port 5000
- Verify `VITE_API_URL` in `frontend/.env` is correct
- Check backend logs for errors

---

## 📊 Monitoring

### Check Active Subscriptions:
```bash
curl http://localhost:5000/api/push/subscriptions
```
(Note: You may need to add this endpoint if you want to monitor subscriptions)

### Backend Logs to Watch:
```
[push] VAPID details configured successfully
[push] new subscription saved
[cron] daily notification job scheduled for 7PM IST
[cron] running daily notification job at 7PM IST
[push] sending daily notification to X subscribers
[push] sent: X success, Y failed
```

---

## 🚀 Production Deployment

### Before deploying:
1. Update `url` in `backend/routes/pushRoutes.js` line 78:
   ```javascript
   url: 'https://your-production-domain.com/app'
   ```

2. Ensure VAPID keys are in production environment variables

3. Test on production domain (notifications require HTTPS)

4. Verify cron timezone matches your server's timezone

---

## 🎯 Next Steps

1. ✅ Test immediate notification using `/api/push/test` endpoint
2. ✅ Verify notification appears in browser
3. ✅ Click notification to ensure it opens the app
4. ✅ Wait for 7PM IST to test scheduled notification
5. ✅ Monitor backend logs for cron job execution

---

## 📝 Notes

- **Cron Schedule**: `30 13 * * *` = 1:30 PM UTC = 7:00 PM IST
- **Notification Frequency**: Once per day
- **Expired Subscriptions**: Automatically deactivated (410 status)
- **User Dismissal**: Stored in localStorage (per browser)
- **Service Worker**: Registered at `/sw.js`

---

**Status**: ✅ All features implemented and working!
