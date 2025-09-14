// ===============================================
// GLOBAL ERROR HANDLER & PERFORMANCE MONITOR
// ===============================================

class ErrorHandler {
    constructor() {
        this.errors = [];
        this.performanceMetrics = {
            loadTime: 0,
            domReady: 0,
            resourcesLoaded: 0
        };
        this.init();
    }

    init() {
        this.setupGlobalErrorHandling();
        this.setupPerformanceMonitoring();
        this.setupConsoleProtection();
        console.log('🛡️ Error handler and performance monitor initialized');
    }

    setupGlobalErrorHandling() {
        // Handle JavaScript errors
        window.addEventListener('error', (event) => {
            this.logError({
                type: 'JavaScript Error',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                timestamp: new Date().toISOString()
            });
        });

        // Handle Promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                type: 'Unhandled Promise Rejection',
                message: event.reason,
                timestamp: new Date().toISOString()
            });
        });

        // Handle resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.logError({
                    type: 'Resource Load Error',
                    element: event.target.tagName,
                    source: event.target.src || event.target.href,
                    timestamp: new Date().toISOString()
                });
            }
        }, true);
    }

    setupPerformanceMonitoring() {
        // Page load timing
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.timing;
                this.performanceMetrics = {
                    loadTime: perfData.loadEventEnd - perfData.navigationStart,
                    domReady: perfData.domContentLoadedEventEnd - perfData.navigationStart,
                    resourcesLoaded: perfData.loadEventEnd - perfData.domContentLoadedEventEnd
                };
                
                console.log('⚡ Performance metrics:', this.performanceMetrics);
                
                // Warn if page is slow
                if (this.performanceMetrics.loadTime > 3000) {
                    console.warn('⚠️ Page load time is slow:', this.performanceMetrics.loadTime + 'ms');
                }
            }, 100);
        });

        // Monitor memory usage (if available)
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                    console.warn('⚠️ High memory usage detected');
                }
            }, 30000);
        }
    }

    setupConsoleProtection() {
        // Minimal console protection in production
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            const originalLog = console.log;
            console.log = (...args) => {
                if (args[0] && typeof args[0] === 'string' && args[0].includes('🎵')) {
                    originalLog(...args);
                }
            };
        }
    }

    logError(errorData) {
        this.errors.push(errorData);
        
        // Keep only last 50 errors
        if (this.errors.length > 50) {
            this.errors.shift();
        }

        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.error('🚨 Error logged:', errorData);
        }
    }

    getErrorReport() {
        return {
            errors: this.errors,
            performance: this.performanceMetrics,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
    }

    // Safe fallback for critical functions
    safeFunctionCall(fn, fallback = () => {}) {
        try {
            return fn();
        } catch (error) {
            this.logError({
                type: 'Safe Function Call Error',
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            return fallback();
        }
    }

    // Prevent page breaking on critical errors
    preventPageBreak() {
        const criticalElements = document.querySelectorAll('.sonic-hero, .sonic-nav, .music-player');
        criticalElements.forEach(element => {
            if (element) {
                element.style.maxWidth = '100%';
                element.style.overflow = 'hidden';
            }
        });
    }
}

// Initialize error handler
const errorHandler = new ErrorHandler();
window.errorHandler = errorHandler;

// Prevent page breaking on load
document.addEventListener('DOMContentLoaded', () => {
    errorHandler.preventPageBreak();
});

// Safe localStorage wrapper
window.safeStorage = {
    getItem: (key) => errorHandler.safeFunctionCall(() => localStorage.getItem(key), null),
    setItem: (key, value) => errorHandler.safeFunctionCall(() => localStorage.setItem(key, value)),
    removeItem: (key) => errorHandler.safeFunctionCall(() => localStorage.removeItem(key))
};

// Export removed for vanilla JS compatibility
// export default ErrorHandler;