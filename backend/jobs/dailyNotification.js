import cron from 'node-cron';
import { sendDailyNotification } from '../routes/pushRoutes.js';

export function startDailyNotificationJob() {
  cron.schedule('30 13 * * *', async () => {
    console.log('[cron] running daily notification job at 7PM IST');
    try {
      await sendDailyNotification();
    } catch (err) {
      console.error('[cron] daily notification failed:', err.message);
    }
  });
  console.log('[cron] daily notification job scheduled for 7PM IST');
}
