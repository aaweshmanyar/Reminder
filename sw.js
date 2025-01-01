// Log Service Worker lifecycle events
self.addEventListener('install', event => {
    console.log('Service Worker installed');
    self.skipWaiting(); // Activate the service worker immediately
});

self.addEventListener('activate', event => {
    console.log('Service Worker activated');
    self.clients.claim(); // Claim all open clients immediately
});

// Listen for messages from the main script
self.addEventListener('message', event => {
    const { title, body } = event.data;
    self.registration.showNotification(title, {
        body: body,
        icon: 'https://img.freepik.com/free-vector/blue-notification-bell-with-one-notification_78370-6899.jpg',
    });
});
