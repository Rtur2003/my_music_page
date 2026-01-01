// ===============================================
// GLOBAL ERROR HANDLER & PERFORMANCE MONITOR
// ===============================================

/**
 * Handles global errors and monitors performance metrics
 * @class ErrorHandler
 */
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

    /**
     * Initializes error handler and performance monitoring
     */
    init() {
        this.setupGlobalErrorHandling();
        this.setupPerformanceMonitoring();
        this.setupConsoleProtection();
        console.log('🛡️ Error handler and performance monitor initialized');
    }

    /**
     * Sets up global error handling for JavaScript errors, promise rejections, and resource errors
     */
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

    /**
     * Sets up performance monitoring
     * Tracks page load times and memory usage
     */
    setupPerformanceMonitoring() {
        // Page load timing
        window.addEventListener('load', () => {
            setTimeout(() => {
                try {
                    const perfData = performance.timing;
                    this.performanceMetrics = {
                        loadTime: perfData.loadEventEnd - perfData.navigationStart,
                        domReady: perfData.domContentLoadedEventEnd - perfData.navigationStart,
                        resourcesLoaded: perfData.loadEventEnd - perfData.domContentLoadedEventEnd
                    };
                    
                    this.logPerformanceMetrics();
                } catch (error) {
                    console.error('Performance monitoring error:', error);
                }
            }, 100);
        });

        // Monitor memory usage (if available)
        this.setupMemoryMonitoring();
    }

    /**
     * Logs performance metrics
     */
    logPerformanceMetrics() {
        if (this.isDevelopment()) {
            console.log('⚡ Performance metrics:', this.performanceMetrics);
            
            // Warn if page is slow
            if (this.performanceMetrics.loadTime > 3000) {
                console.warn('⚠️ Page load time is slow:', this.performanceMetrics.loadTime + 'ms');
            }
        }
    }

    /**
     * Sets up memory usage monitoring
     */
    setupMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                try {
                    const memory = performance.memory;
                    if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                        console.warn('⚠️ High memory usage detected');
                    }
                } catch {
                    // Memory API not available or error occurred
                }
            }, 30000);
        }
    }

    /**
     * Sets up minimal console protection in production
     * Allows important logs with emoji markers
     */
    setupConsoleProtection() {
        // Only in production
        if (this.isProduction()) {
            const originalLog = console.log;
            console.log = (...args) => {
                // Allow logs with special markers
                if (args[0] && typeof args[0] === 'string' && 
                    (args[0].includes('🎵') || args[0].includes('⚡') || args[0].includes('🖼️'))) {
                    originalLog(...args);
                }
            };
        }
    }

    /**
     * Logs error with context
     * @param {Object} errorData - Error data object
     */
    logError(errorData) {
        this.errors.push(errorData);
        
        // Keep only last 50 errors
        if (this.errors.length > 50) {
            this.errors.shift();
        }

        // Log to console in development
        if (this.isDevelopment()) {
            console.error('🚨 Error logged:', errorData);
        }
    }

    /**
     * Gets complete error report
     * @returns {Object} Error report with metrics
     */
    getErrorReport() {
        return {
            errors: this.errors,
            performance: this.performanceMetrics,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Safely executes function with error handling
     * @param {Function} fn - Function to execute
     * @param {Function} fallback - Fallback function
     * @returns {*} Function result or fallback result
     */
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

    /**
     * Prevents page breaking on critical errors
     * Ensures critical UI elements remain functional
     */
    preventPageBreak() {
        const criticalElements = document.querySelectorAll('.sonic-hero, .sonic-nav, .music-player');
        criticalElements.forEach(element => {
            if (element) {
                element.style.maxWidth = '100%';
                element.style.overflow = 'hidden';
            }
        });
    }

    /**
     * Checks if running in development mode
     * @returns {boolean} True if development
     */
    isDevelopment() {
        const devHosts = ['localhost', '127.0.0.1', ''];
        return devHosts.includes(window.location.hostname);
    }

    /**
     * Checks if running in production mode
     * @returns {boolean} True if production
     */
    isProduction() {
        return !this.isDevelopment();
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