import { useState } from 'react';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotification() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const subscribe = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Push notifications are not supported in your browser')
      return false
    }

    setIsLoading(true)

    try {
      // Register service worker and wait for it to be active
      const registration = await navigator.serviceWorker.register('/sw.js')

      // Wait for service worker to become active
      await navigator.serviceWorker.ready

      console.log('[push] service worker ready:', registration.active?.state)

      // Request permission
      const permission = await Notification.requestPermission()
      console.log('[push] permission result:', permission)

      if (permission !== 'granted') {
        console.log('[push] permission denied or dismissed')
        setIsLoading(false)
        return false
      }

      // Get active registration after ready
      const activeRegistration = await navigator.serviceWorker.ready

      // Subscribe to push
      const subscription = await activeRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      })

      console.log('[push] subscription created:', subscription.endpoint)

      // Save to backend
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/push/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription })
        }
      )

      const data = await response.json()
      console.log('[push] backend response:', data)

      setIsSubscribed(true)
      setIsLoading(false)
      return true
    } catch (err) {
      console.error('[push] subscription failed:', err)
      setIsLoading(false)
      return false
    }
  }

  return { subscribe, isSubscribed, isLoading };
}
