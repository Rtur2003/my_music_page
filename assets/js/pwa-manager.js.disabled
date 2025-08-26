// PWA Manager - Progressive Web App Features
// Enterprise-level PWA functionality for admin panel

class PWAManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.serviceWorker = null;
        this.deferredPrompt = null;
        this.syncQueue = [];
        this.pushSubscription = null;
        
        this.init();
    }
    
    async init() {
        console.log('🚀 PWA Manager: Initializing...');
        
        // Register service worker
        await this.registerServiceWorker();
        
        // Setup offline/online detection
        this.setupConnectionListeners();
        
        // Setup install prompt
        this.setupInstallPrompt();
        
        // Setup push notifications
        await this.setupPushNotifications();
        
        // Setup background sync
        this.setupBackgroundSync();
        
        // Setup periodic sync
        this.setupPeriodicSync();
        
        // Update UI based on PWA status
        this.updatePWAStatus();
        
        console.log('✅ PWA Manager: Initialized successfully');
    }
    
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });
                
                this.serviceWorker = registration;
                console.log('✅ Service Worker registered:', registration.scope);
                
                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('🔄 New Service Worker found, installing...');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateAvailable();
                        }
                    });
                });
                
                // Listen for messages from service worker
                navigator.serviceWorker.addEventListener('message', event => {
                    this.handleServiceWorkerMessage(event.data);
                });
                
                return registration;
            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
                return null;
            }
        } else {
            console.warn('⚠️ Service Worker not supported');
            return null;
        }
    }
    
    setupConnectionListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('🌐 Connection restored');
            this.showNotification('Bağlantı geri geldi', 'Offline veriler senkronize ediliyor...', 'success');
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('📡 Connection lost');
            this.showNotification('Bağlantı kesildi', 'Offline modda çalışmaya devam edebilirsiniz', 'warning');
        });
    }
    
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
            console.log('📱 PWA install prompt ready');
        });
        
        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA installed successfully');
            this.showNotification('App Yüklendi', 'Müzik portföyü başarıyla yüklendi!', 'success');
            this.deferredPrompt = null;
            this.hideInstallButton();
        });
    }
    
    async setupPushNotifications() {
        if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const permission = await this.requestNotificationPermission();
                
                if (permission === 'granted') {
                    await this.subscribeToPushNotifications();
                }
            } catch (error) {
                console.error('❌ Push notification setup failed:', error);
            }
        }
    }
    
    async requestNotificationPermission() {
        const permission = await Notification.requestPermission();
        console.log('🔔 Notification permission:', permission);
        return permission;
    }
    
    async subscribeToPushNotifications() {
        try {
            if (!this.serviceWorker) {
                throw new Error('Service worker not available');
            }
            
            const registration = this.serviceWorker;
            
            // Check if already subscribed
            let subscription = await registration.pushManager.getSubscription();
            
            if (!subscription) {
                // Create new subscription
                const vapidPublicKey = 'BNXjxGglWjbgQpfRFSGGpOOllzDomSwbcpyW6kj8ZvVKjF-F7j8o_YdUgc_3KH7_5nHWvYNJBNtW9YnF9W5uN8s'; // Replace with your VAPID key
                
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
                });
                
                console.log('✅ Push notification subscription created');
            }
            
            this.pushSubscription = subscription;
            
            // Send subscription to server (in real app)
            console.log('📤 Push subscription:', JSON.stringify(subscription));
            
            // Store subscription locally for demo
            localStorage.setItem('push_subscription', JSON.stringify(subscription));
            
        } catch (error) {
            console.error('❌ Push subscription failed:', error);
        }
    }
    
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
            
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    
    setupBackgroundSync() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            console.log('✅ Background Sync supported');
            
            // Setup sync for offline actions
            window.addEventListener('offline', () => {
                this.queueOfflineActions();
            });
        } else {
            console.warn('⚠️ Background Sync not supported');
        }
    }
    
    async setupPeriodicSync() {
        if ('serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype) {
            try {
                const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
                
                if (status.state === 'granted') {
                    const registration = this.serviceWorker;
                    
                    // Register periodic sync for admin health checks
                    await registration.periodicSync.register('admin-health-check', {
                        minInterval: 24 * 60 * 60 * 1000, // 24 hours
                    });
                    
                    // Register periodic sync for cache cleanup
                    await registration.periodicSync.register('cache-cleanup', {
                        minInterval: 7 * 24 * 60 * 60 * 1000, // 7 days
                    });
                    
                    console.log('✅ Periodic Sync registered');
                } else {
                    console.warn('⚠️ Periodic Sync permission not granted');
                }
            } catch (error) {
                console.error('❌ Periodic Sync setup failed:', error);
            }
        } else {
            console.warn('⚠️ Periodic Sync not supported');
        }
    }
    
    showInstallButton() {
        // Add install button to admin panel if not exists
        if (!document.getElementById('pwa-install-btn')) {
            const installBtn = document.createElement('button');
            installBtn.id = 'pwa-install-btn';
            installBtn.className = 'btn btn-primary pwa-install-btn';
            installBtn.innerHTML = '<i class="fas fa-download"></i> App Olarak Yükle';
            installBtn.onclick = () => this.installPWA();
            
            // Add to admin header
            const adminHeader = document.querySelector('.admin-header-right');
            if (adminHeader) {
                adminHeader.insertBefore(installBtn, adminHeader.firstChild);
            }
        }
    }
    
    hideInstallButton() {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.remove();
        }
    }
    
    async installPWA() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log('📱 PWA install outcome:', outcome);
            this.deferredPrompt = null;
        }
    }
    
    showUpdateAvailable() {
        // Show update notification
        this.showNotification(
            'Güncelleme Mevcut',
            'Yeni bir sürüm yüklendi. Sayfayı yenileyin.',
            'info',
            [
                {
                    text: 'Şimdi Güncelle',
                    action: () => this.updateServiceWorker()
                },
                {
                    text: 'Daha Sonra',
                    action: () => {}
                }
            ]
        );
    }
    
    updateServiceWorker() {
        if (this.serviceWorker && this.serviceWorker.waiting) {
            this.serviceWorker.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    }
    
    handleServiceWorkerMessage(data) {
        const { type, data: messageData } = data;
        
        switch (type) {
            case 'SYNC_COMPLETE':
                console.log('✅ Background sync completed:', messageData);
                this.showNotification('Senkronizasyon Tamamlandı', 'Verileriniz başarıyla senkronize edildi', 'success');
                break;
                
            case 'CACHE_UPDATED':
                console.log('🔄 Cache updated:', messageData);
                break;
                
            case 'NOTIFICATION':
                this.showNotification(messageData.title, messageData.body, messageData.type);
                break;
                
            default:
                console.log('Service Worker message:', type, messageData);
        }
    }
    
    async queueOfflineActions() {
        // Queue any pending admin actions for sync when online
        const pendingActions = JSON.parse(localStorage.getItem('pending_admin_actions') || '[]');
        
        if (pendingActions.length > 0) {
            console.log('📋 Queuing offline actions:', pendingActions.length);
            
            // Register background sync
            if (this.serviceWorker && 'sync' in window.ServiceWorkerRegistration.prototype) {
                try {
                    await this.serviceWorker.sync.register('sync-admin-data');
                    console.log('✅ Background sync registered');
                } catch (error) {
                    console.error('❌ Background sync registration failed:', error);
                }
            }
        }
    }
    
    async syncOfflineData() {
        if (this.isOnline) {
            // Trigger background sync for pending data
            if (this.serviceWorker) {
                this.serviceWorker.active?.postMessage({
                    type: 'SYNC_REQUEST',
                    data: { tag: 'sync-admin-data' }
                });
            }
        }
    }
    
    // Offline data management
    addOfflineAction(action) {
        const pendingActions = JSON.parse(localStorage.getItem('pending_admin_actions') || '[]');
        pendingActions.push({
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...action
        });
        localStorage.setItem('pending_admin_actions', JSON.stringify(pendingActions));
        
        console.log('📝 Offline action queued:', action.type);
    }
    
    // Push notification methods
    async sendTestNotification() {
        if (Notification.permission === 'granted') {
            new Notification('Test Bildirimi', {
                body: 'PWA özellikleri çalışıyor!',
                icon: '/assets/icons/icon-192x192.png',
                badge: '/assets/icons/icon-72x72.png',
                tag: 'test-notification'
            });
        }
    }
    
    async scheduleNotification(title, body, delay = 5000) {
        setTimeout(() => {
            if (Notification.permission === 'granted') {
                new Notification(title, {
                    body: body,
                    icon: '/assets/icons/icon-192x192.png',
                    tag: 'scheduled-notification'
                });
            }
        }, delay);
    }
    
    // PWA status methods
    updatePWAStatus() {
        const status = {
            isInstalled: this.isPWAInstalled(),
            isOnline: this.isOnline,
            hasServiceWorker: !!this.serviceWorker,
            hasNotifications: Notification.permission === 'granted',
            supportsPush: 'PushManager' in window,
            supportsSync: 'sync' in window.ServiceWorkerRegistration.prototype
        };
        
        // Update admin panel UI with PWA status
        this.displayPWAStatus(status);
        
        return status;
    }
    
    isPWAInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone ||
               document.referrer.includes('android-app://');
    }
    
    displayPWAStatus(status) {
        // Create PWA status widget in admin panel
        let statusWidget = document.getElementById('pwa-status-widget');
        
        if (!statusWidget) {
            statusWidget = document.createElement('div');
            statusWidget.id = 'pwa-status-widget';
            statusWidget.className = 'pwa-status-widget';
            
            // Add to dashboard or settings section
            const dashboard = document.querySelector('#dashboard .dashboard-widgets');
            if (dashboard) {
                const widget = document.createElement('div');
                widget.className = 'widget';
                widget.innerHTML = `
                    <h3>
                        <i class="fas fa-mobile-alt"></i>
                        PWA Durumu
                    </h3>
                    <div id="pwa-status-content"></div>
                `;
                dashboard.appendChild(widget);
                statusWidget = widget.querySelector('#pwa-status-content');
            }
        }
        
        if (statusWidget) {
            statusWidget.innerHTML = `
                <div class="pwa-status-grid">
                    <div class="status-item ${status.isInstalled ? 'active' : ''}">
                        <i class="fas fa-mobile-alt"></i>
                        <span>Yüklü</span>
                        <div class="status-indicator ${status.isInstalled ? 'green' : 'gray'}"></div>
                    </div>
                    <div class="status-item ${status.isOnline ? 'active' : ''}">
                        <i class="fas fa-wifi"></i>
                        <span>Online</span>
                        <div class="status-indicator ${status.isOnline ? 'green' : 'red'}"></div>
                    </div>
                    <div class="status-item ${status.hasServiceWorker ? 'active' : ''}">
                        <i class="fas fa-cog"></i>
                        <span>Service Worker</span>
                        <div class="status-indicator ${status.hasServiceWorker ? 'green' : 'gray'}"></div>
                    </div>
                    <div class="status-item ${status.hasNotifications ? 'active' : ''}">
                        <i class="fas fa-bell"></i>
                        <span>Bildirimler</span>
                        <div class="status-indicator ${status.hasNotifications ? 'green' : 'gray'}"></div>
                    </div>
                </div>
                <div class="pwa-actions">
                    ${!status.isInstalled && this.deferredPrompt ? '<button class="btn btn-sm btn-primary" onclick="pwaManager.installPWA()"><i class="fas fa-download"></i> App Olarak Yükle</button>' : ''}
                    ${!status.hasNotifications ? '<button class="btn btn-sm btn-secondary" onclick="pwaManager.requestNotificationPermission()"><i class="fas fa-bell"></i> Bildirimleri Etkinleştir</button>' : ''}
                    <button class="btn btn-sm btn-secondary" onclick="pwaManager.sendTestNotification()"><i class="fas fa-bell"></i> Test Bildirimi</button>
                </div>
            `;
        }
    }
    
    showNotification(title, message, type = 'info', actions = []) {
        // Show in-app notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} pwa-notification`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-header">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                    <strong>${title}</strong>
                </div>
                <p>${message}</p>
                ${actions.length > 0 ? `
                    <div class="notification-actions">
                        ${actions.map((action, index) => `
                            <button class="btn btn-sm ${index === 0 ? 'btn-primary' : 'btn-secondary'}" onclick="this.closest('.notification').remove(); (${action.action.toString()})()">${action.text}</button>
                        `).join('')}
                    </div>
                ` : ''}
                <button class="notification-close" onclick="this.closest('.notification').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles if not exists
        if (!document.getElementById('pwa-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'pwa-notification-styles';
            styles.textContent = `
                .pwa-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    max-width: 400px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    border-left: 4px solid var(--primary-color);
                }
                .pwa-notification.notification-success { border-left-color: #00cec9; }
                .pwa-notification.notification-error { border-left-color: #e74c3c; }
                .pwa-notification.notification-warning { border-left-color: #f39c12; }
                .pwa-notification .notification-content { padding: 1rem; }
                .pwa-notification .notification-header { display: flex; align-items: center; margin-bottom: 0.5rem; }
                .pwa-notification .notification-header i { margin-right: 0.5rem; color: var(--primary-color); }
                .pwa-notification .notification-actions { margin-top: 1rem; display: flex; gap: 0.5rem; }
                .pwa-notification .notification-close { 
                    position: absolute; 
                    top: 8px; 
                    right: 8px; 
                    background: none; 
                    border: none; 
                    font-size: 0.8rem; 
                    cursor: pointer; 
                    opacity: 0.7;
                }
                .pwa-status-grid { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr; 
                    gap: 1rem; 
                    margin-bottom: 1rem; 
                }
                .status-item { 
                    display: flex; 
                    align-items: center; 
                    gap: 0.5rem; 
                    padding: 0.5rem; 
                    border-radius: 8px; 
                    background: var(--card-bg); 
                }
                .status-indicator { 
                    width: 8px; 
                    height: 8px; 
                    border-radius: 50%; 
                    margin-left: auto; 
                }
                .status-indicator.green { background: #00cec9; }
                .status-indicator.red { background: #e74c3c; }
                .status-indicator.gray { background: #bbb; }
                .pwa-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds if no actions
        if (actions.length === 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 300);
                }
            }, 5000);
        }
    }
    
    // Cache management
    async clearAppCache() {
        if (this.serviceWorker) {
            const messageChannel = new MessageChannel();
            
            return new Promise((resolve) => {
                messageChannel.port1.onmessage = (event) => {
                    resolve(event.data.success);
                };
                
                this.serviceWorker.active?.postMessage(
                    { type: 'CLEAR_CACHE' },
                    [messageChannel.port2]
                );
            });
        }
        return false;
    }
    
    async getAppVersion() {
        if (this.serviceWorker) {
            const messageChannel = new MessageChannel();
            
            return new Promise((resolve) => {
                messageChannel.port1.onmessage = (event) => {
                    resolve(event.data.version);
                };
                
                this.serviceWorker.active?.postMessage(
                    { type: 'GET_VERSION' },
                    [messageChannel.port2]
                );
            });
        }
        return 'Unknown';
    }
}

// Initialize PWA Manager when DOM is ready
let pwaManager;

document.addEventListener('DOMContentLoaded', () => {
    pwaManager = new PWAManager();
    
    // Make it globally accessible for button clicks
    window.pwaManager = pwaManager;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PWAManager;
}