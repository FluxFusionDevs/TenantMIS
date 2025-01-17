'use server'

import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:loquellanoralphjenrey@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

let subscription: webpush.PushSubscription | null = null

// Utility to transform subscription into the expected format
function transformSubscription(sub: PushSubscription): webpush.PushSubscription {
  return {
    endpoint: sub.endpoint,
    keys: {
      p256dh: sub.toJSON().keys?.p256dh || '',
      auth: sub.toJSON().keys?.auth || '',
    },
  }
}

export async function subscribeUser(sub: PushSubscription) {
  subscription = transformSubscription(sub)
  // In a production environment, store the subscription in a database
  return { success: true }
}

export async function unsubscribeUser() {
  subscription = null
  // In a production environment, remove the subscription from the database
  return { success: true }
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error('No subscription available')
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icon.png',
      })
    )
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}
