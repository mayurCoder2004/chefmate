import mongoose from 'mongoose';

const pushSubscriptionSchema = new mongoose.Schema({
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  subscribedAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
});

export default mongoose.model('PushSubscription', pushSubscriptionSchema);
