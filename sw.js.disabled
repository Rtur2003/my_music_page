// Service Worker for PWA Main Site Only
// Version 1.2.0 - Admin Panel Excluded

// Skip admin panel entirely
if (location.pathname.includes('/admin.html') || location.pathname.includes('/admin')) {
    // Do nothing for admin panel
    return;
}

const CACHE_NAME = 'music-portfolio-main-v1.3.0';
const CACHE_STRATEGY = {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Critical resources to cache immediately
const CRITICAL_CACHE_URLS = [
    '/admin.html',
    '/index.html',
    '/manifest.json',
    '/assets/css/admin.css',
    '/assets/css/style.css',
    '/assets/js/admin.js',
    '/assets/js/main.js',
    '/assets/js/music-player.js',
    '/assets/js/gallery.js',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png'
];

// Runtime cache strategies - only local resources
const RUNTIME_CACHE_STRATEGIES = {
    '/admin.html': CACHE_STRATEGY.CACHE_FIRST,
    '/index.html': CACHE_STRATEGY.CACHE_FIRST,
    '/assets/': CACHE_STRATEGY.CACHE_FIRST
};

// Install Event - Cache critical resources
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing v' + CACHE_NAME);
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Service Worker: Caching critical resources');
                return cache.addAll(CRITICAL_CACHE_URLS);
            })
            .then(() => {
                console.log('✅ Service Worker: Critical resources cached');
                return self.skipWaiting(); // Activate immediately
            })
            .catch(error => {
                console.error('❌ Service Worker: Install failed', error);
            })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activating v' + CACHE_NAME);
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME && cacheName.startsWith('music-portfolio-admin-')) {
                            console.log('🗑️ Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activated successfully');
                return self.clients.claim(); // Take control immediately
            })
    );
});

// Fetch Event - Handle network requests with caching strategies
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external domains (except allowed CDNs)
    if (url.origin !== location.origin && 
        !url.hostname.includes('googleapis.com') && 
        !url.hostname.includes('cdnjs.cloudflare.com')) {
        return;
    }
    
    // Apply caching strategy based on URL pattern
    event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Determine cache strategy
    let strategy = CACHE_STRATEGY.NETWORK_FIRST; // Default
    
    for (const [pattern, strategyType] of Object.entries(RUNTIME_CACHE_STRATEGIES)) {
        if (pathname.startsWith(pattern) || url.href.startsWith(pattern)) {
            strategy = strategyType;
            break;
        }
    }
    
    try {
        switch (strategy) {
            case CACHE_STRATEGY.CACHE_FIRST:
                return await cacheFirst(request);
            case CACHE_STRATEGY.NETWORK_FIRST:
                return await networkFirst(request);
            case CACHE_STRATEGY.STALE_WHILE_REVALIDATE:
                return await staleWhileRevalidate(request);
            default:
                return await networkFirst(request);
        }
    } catch (error) {
        console.error('Service Worker: Request failed', error);
        return await offlineFallback(request);
    }
}

// Cache First Strategy - For static assets
async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        throw error;
    }
}

// Network First Strategy - For dynamic content
async function networkFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Stale While Revalidate Strategy - For frequently updated content
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    
    // Return cached version immediately if available
    const cachedResponse = await cache.match(request);
    
    // Update cache in background
    const networkResponsePromise = fetch(request).then(response => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => {}); // Ignore network errors
    
    return cachedResponse || await networkResponsePromise;
}

// Offline Fallback - When all else fails
async function offlineFallback(request) {
    const url = new URL(request.url);
    
    // Serve offline page for navigation requests
    if (request.mode === 'navigate') {
        const cache = await caches.open(CACHE_NAME);
        
        // Try to serve admin.html if requesting admin page
        if (url.pathname.includes('admin')) {
            const adminPage = await cache.match('/admin.html');
            if (adminPage) return adminPage;
        }
        
        // Otherwise serve main page
        const mainPage = await cache.match('/index.html');
        if (mainPage) return mainPage;
        
        // Last resort - offline page
        return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Offline - Müzik Portföyü</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        padding: 50px; 
                        background: #1a1b3e; 
                        color: white; 
                    }
                    h1 { color: #6c5ce7; }
                    .retry-btn { 
                        background: #6c5ce7; 
                        color: white; 
                        padding: 10px 20px; 
                        border: none; 
                        border-radius: 5px; 
                        cursor: pointer; 
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <h1>🔌 Bağlantı Yok</h1>
                <p>İnternet bağlantınızı kontrol edin ve tekrar deneyin.</p>
                <button class="retry-btn" onclick="location.reload()">Tekrar Dene</button>
            </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' }
        });
    }
    
    // For other requests, return a basic error response
    return new Response('Network error', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' }
    });
}

// Background Sync for offline actions
self.addEventListener('sync', event => {
    console.log('🔄 Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'sync-admin-data') {
        event.waitUntil(syncAdminData());
    }
    
    if (event.tag === 'sync-uploaded-files') {
        event.waitUntil(syncUploadedFiles());
    }
});

async function syncAdminData() {
    try {
        console.log('📤 Service Worker: Syncing admin data...');
        
        // Get pending admin data from IndexedDB or localStorage
        const pendingData = JSON.parse(localStorage.getItem('pending_admin_sync') || '[]');
        
        for (const data of pendingData) {
            // Simulate API calls to sync data
            console.log('📤 Syncing:', data.type, data.id);
            
            // Remove from pending after successful sync
            const updatedPending = pendingData.filter(item => item.id !== data.id);
            localStorage.setItem('pending_admin_sync', JSON.stringify(updatedPending));
        }
        
        console.log('✅ Service Worker: Admin data synced successfully');
        
        // Notify clients about sync completion
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_COMPLETE',
                data: 'admin-data'
            });
        });
        
    } catch (error) {
        console.error('❌ Service Worker: Admin data sync failed', error);
        throw error;
    }
}

async function syncUploadedFiles() {
    try {
        console.log('📤 Service Worker: Syncing uploaded files...');
        
        // Handle file uploads that were queued while offline
        const pendingUploads = JSON.parse(localStorage.getItem('pending_file_uploads') || '[]');
        
        for (const upload of pendingUploads) {
            console.log('📤 Uploading file:', upload.filename);
            
            // Simulate file upload process
            // In real implementation, this would upload to your server
            
            // Remove from pending after successful upload
            const updatedPending = pendingUploads.filter(item => item.id !== upload.id);
            localStorage.setItem('pending_file_uploads', JSON.stringify(updatedPending));
        }
        
        console.log('✅ Service Worker: Files synced successfully');
        
        // Notify clients
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_COMPLETE',
                data: 'file-uploads'
            });
        });
        
    } catch (error) {
        console.error('❌ Service Worker: File sync failed', error);
        throw error;
    }
}

// Push notifications support
self.addEventListener('push', event => {
    console.log('🔔 Service Worker: Push notification received');
    
    let notificationData = {
        title: 'Müzik Portföyü Admin',
        body: 'Admin panel güncellemesi mevcut',
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/icon-72x72.png',
        tag: 'admin-update',
        renotify: true,
        requireInteraction: false,
        actions: [
            {
                action: 'open-admin',
                title: 'Admin Panel\'i Aç',
                icon: '/assets/icons/action-admin.png'
            },
            {
                action: 'dismiss',
                title: 'Kapat',
                icon: '/assets/icons/action-dismiss.png'
            }
        ],
        data: {
            url: '/admin.html',
            timestamp: Date.now()
        }
    };
    
    // Parse push data if available
    if (event.data) {
        try {
            const pushData = event.data.json();
            notificationData = { ...notificationData, ...pushData };
        } catch (error) {
            console.error('Service Worker: Failed to parse push data', error);
        }
    }
    
    event.waitUntil(
        self.registration.showNotification(notificationData.title, notificationData)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('🔔 Service Worker: Notification clicked', event.action);
    
    event.notification.close();
    
    const action = event.action;
    const data = event.notification.data;
    
    if (action === 'open-admin' || !action) {
        // Open admin panel
        event.waitUntil(
            clients.matchAll({ type: 'window' })
                .then(clientList => {
                    // Check if admin panel is already open
                    for (const client of clientList) {
                        if (client.url.includes('admin.html') && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    
                    // Open new admin panel window
                    if (clients.openWindow) {
                        return clients.openWindow(data.url || '/admin.html');
                    }
                })
        );
    } else if (action === 'dismiss') {
        // Just close notification
        console.log('Service Worker: Notification dismissed');
    }
});

// Handle notification close
self.addEventListener('notificationclose', event => {
    console.log('🔔 Service Worker: Notification closed');
    
    // Analytics or cleanup if needed
    const notificationData = event.notification.data;
    if (notificationData && notificationData.trackClose) {
        // Track notification close event
        console.log('Tracking notification close:', notificationData);
    }
});

// Periodic background sync for admin updates
self.addEventListener('periodicsync', event => {
    console.log('⏰ Service Worker: Periodic sync triggered', event.tag);
    
    if (event.tag === 'admin-health-check') {
        event.waitUntil(performAdminHealthCheck());
    }
    
    if (event.tag === 'cache-cleanup') {
        event.waitUntil(performCacheCleanup());
    }
});

async function performAdminHealthCheck() {
    try {
        console.log('🏥 Service Worker: Performing admin health check...');
        
        // Check if admin panel is functioning correctly
        const adminResponse = await fetch('/admin.html', { method: 'HEAD' });
        
        if (!adminResponse.ok) {
            // Send notification about admin panel issues
            await self.registration.showNotification('Admin Panel Uyarısı', {
                body: 'Admin panel erişiminde sorun tespit edildi',
                icon: '/assets/icons/icon-192x192.png',
                tag: 'admin-health-warning',
                actions: [
                    { action: 'check-admin', title: 'Kontrol Et' }
                ]
            });
        }
        
        console.log('✅ Service Worker: Admin health check completed');
    } catch (error) {
        console.error('❌ Service Worker: Admin health check failed', error);
    }
}

async function performCacheCleanup() {
    try {
        console.log('🧹 Service Worker: Performing cache cleanup...');
        
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        
        // Remove old or unused cache entries
        const cleanupPromises = keys.map(async request => {
            const response = await cache.match(request);
            const cacheDate = response.headers.get('date');
            
            if (cacheDate) {
                const cacheAge = Date.now() - new Date(cacheDate).getTime();
                const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
                
                if (cacheAge > maxAge) {
                    console.log('🗑️ Removing old cache entry:', request.url);
                    return cache.delete(request);
                }
            }
        });
        
        await Promise.all(cleanupPromises);
        console.log('✅ Service Worker: Cache cleanup completed');
    } catch (error) {
        console.error('❌ Service Worker: Cache cleanup failed', error);
    }
}

// Message handling from clients
self.addEventListener('message', event => {
    console.log('💬 Service Worker: Message received', event.data);
    
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'CLAIM_CLIENTS':
            self.clients.claim();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_NAME });
            break;
            
        case 'CLEAR_CACHE':
            clearCache().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        case 'SYNC_REQUEST':
            // Register background sync
            self.registration.sync.register(data.tag);
            break;
            
        default:
            console.log('Service Worker: Unknown message type', type);
    }
});

async function clearCache() {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('🧹 Service Worker: All caches cleared');
        return true;
    } catch (error) {
        console.error('❌ Service Worker: Cache clear failed', error);
        return false;
    }
}

// Error handling
self.addEventListener('error', event => {
    console.error('❌ Service Worker: Error occurred', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('❌ Service Worker: Unhandled promise rejection', event.reason);
});

console.log('🚀 Service Worker: Loaded successfully v' + CACHE_NAME);