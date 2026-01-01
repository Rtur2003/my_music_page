// Service Worker for Hasan Arthur Altuntaş Portfolio PWA
// Version 5.0.0

const CACHE_NAME = 'hasan-arthur-portfolio-v5.0.0';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/sections/00-base.css',
  './assets/css/sections/01-navigation.css',
  './assets/css/sections/02-hero.css',
  './assets/css/sections/03-about.css',
  './assets/css/sections/04-music.css',
  './assets/css/sections/05-software.css',
  './assets/css/sections/06-gallery.css',
  './assets/css/sections/07-updates.css',
  './assets/css/sections/08-contact.css',
  './assets/css/sections/09-footer.css',
  './assets/js/performance-optimizer.js',
  './assets/js/accessibility-enhancer.js',
  './assets/js/error-handler.js',
  './assets/js/security.js',
  './assets/js/form-validator.js',
  './assets/js/music-final.js',
  './assets/js/theme-and-navigation.js',
  './assets/js/gallery.js',
  './assets/js/contact-form.js',
  './assets/js/sonic-interactions.js',
  './assets/js/redirect-warning.js',
  './assets/js/github-stats.js',
  './assets/js/language-simple.js',
  './assets/images/logo-main.png',
  './assets/images/hasan-arthur-profile.jpg',
  './favicon.ico'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v5.0.0');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell and content');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('[SW] Failed to cache resources:', error);
        // Don't fail installation if some resources can't be cached
        return Promise.resolve();
      })
  );

  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker v5.0.0');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Ensure the new service worker takes control immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip cross-origin requests
  if (requestUrl.origin !== location.origin) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          console.log('[SW] Serving from cache:', event.request.url);
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request).then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the fetched resource
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch((error) => {
          console.error('[SW] Fetch failed:', error);

          // Return offline fallback for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }

          // Return placeholder for images
          if (event.request.destination === 'image') {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#d4b078" opacity="0.1"/><text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="14" fill="#d4b078">Offline</text></svg>',
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          }

          throw error;
        });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    console.log('[SW] Background sync for contact form');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Get pending form submissions from IndexedDB
    const pendingSubmissions = await getPendingSubmissions();

    for (const submission of pendingSubmissions) {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submission.data)
        });

        if (response.ok) {
          await removePendingSubmission(submission.id);
          console.log('[SW] Form submission synced successfully');
        }
      } catch (error) {
        console.error('[SW] Failed to sync form submission:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getPendingSubmissions() {
  // In a real implementation, this would read from IndexedDB
  return [];
}

async function removePendingSubmission(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('[SW] Removing pending submission:', id);
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');

  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: './assets/images/logo-main.png',
    badge: './assets/images/logo-main.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: './assets/images/logo-main.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: './assets/images/logo-main.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Hasan Arthur Portfolio', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received');

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    console.log('[SW] Periodic sync for content updates');
    event.waitUntil(checkForUpdates());
  }
});

async function checkForUpdates() {
  try {
    // Check for new music releases or content updates
    const response = await fetch('./api/check-updates');
    if (response.ok) {
      const updates = await response.json();
      if (updates.hasUpdates) {
        // Show notification about new content
        self.registration.showNotification('New Music Available!', {
          body: 'Check out the latest tracks from Hasan Arthur',
          icon: './assets/images/logo-main.png',
          tag: 'content-update'
        });
      }
    }
  } catch (error) {
    console.error('[SW] Failed to check for updates:', error);
  }
}

console.log('[SW] Service Worker v1.0.0 loaded successfully');