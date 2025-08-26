// Development/Production Logger
class Logger {
    constructor() {
        this.isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.levels = {
            ERROR: 0,
            WARN: 1,
            INFO: 2,
            DEBUG: 3
        };
        this.currentLevel = this.isDev ? this.levels.DEBUG : this.levels.ERROR;
    }

    error(...args) {
        if (this.currentLevel >= this.levels.ERROR) {
            console.error('[ERROR]', ...args);
        }
    }

    warn(...args) {
        if (this.currentLevel >= this.levels.WARN) {
            console.warn('[WARN]', ...args);
        }
    }

    info(...args) {
        if (this.currentLevel >= this.levels.INFO) {
            console.info('[INFO]', ...args);
        }
    }

    log(...args) {
        if (this.currentLevel >= this.levels.DEBUG) {
            console.log('[DEBUG]', ...args);
        }
    }

    group(label) {
        if (this.currentLevel >= this.levels.DEBUG) {
            console.group(label);
        }
    }

    groupEnd() {
        if (this.currentLevel >= this.levels.DEBUG) {
            console.groupEnd();
        }
    }

    table(data) {
        if (this.currentLevel >= this.levels.DEBUG) {
            console.table(data);
        }
    }

    time(label) {
        if (this.currentLevel >= this.levels.DEBUG) {
            console.time(label);
        }
    }

    timeEnd(label) {
        if (this.currentLevel >= this.levels.DEBUG) {
            console.timeEnd(label);
        }
    }
}

// Global logger instance
window.logger = new Logger();

// Performance monitoring
class PerformanceMonitorLogger {
    constructor() {
        this.metrics = {};
        this.isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    }

    mark(name) {
        if (this.isDev && performance.mark) {
            performance.mark(name);
        }
    }

    measure(name, startMark, endMark) {
        if (this.isDev && performance.measure) {
            try {
                performance.measure(name, startMark, endMark);
                const measure = performance.getEntriesByName(name)[0];
                this.metrics[name] = measure.duration;
                logger.log(`Performance: ${name} took ${measure.duration.toFixed(2)}ms`);
            } catch (error) {
                logger.warn('Performance measurement failed:', error);
            }
        }
    }

    getMetrics() {
        return this.metrics;
    }

    logNavigationTiming() {
        if (this.isDev && performance.timing) {
            const timing = performance.timing;
            const metrics = {
                'DNS Lookup': timing.domainLookupEnd - timing.domainLookupStart,
                'TCP Connection': timing.connectEnd - timing.connectStart,
                'Server Response': timing.responseEnd - timing.requestStart,
                'DOM Processing': timing.domContentLoadedEventEnd - timing.responseEnd,
                'Total Load Time': timing.loadEventEnd - timing.navigationStart
            };
            
            logger.group('Navigation Timing');
            logger.table(metrics);
            logger.groupEnd();
        }
    }
}

// Global performance monitor instance
window.perfMonitor = new PerformanceMonitorLogger();

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', () => {
    perfMonitor.mark('app-start');
    
    window.addEventListener('load', () => {
        perfMonitor.mark('app-loaded');
        perfMonitor.measure('app-load-time', 'app-start', 'app-loaded');
        
        setTimeout(() => {
            perfMonitor.logNavigationTiming();
        }, 1000);
    });
});

// Memory leak detection helper
class MemoryMonitor {
    constructor() {
        this.listeners = new Set();
        this.intervals = new Set();
        this.timeouts = new Set();
    }

    trackEventListener(element, event, handler) {
        const listenerInfo = { element, event, handler };
        this.listeners.add(listenerInfo);
        element.addEventListener(event, handler);
        return listenerInfo;
    }

    removeEventListener(listenerInfo) {
        if (this.listeners.has(listenerInfo)) {
            listenerInfo.element.removeEventListener(listenerInfo.event, listenerInfo.handler);
            this.listeners.delete(listenerInfo);
        }
    }

    trackInterval(callback, delay) {
        const id = setInterval(callback, delay);
        this.intervals.add(id);
        return id;
    }

    clearInterval(id) {
        if (this.intervals.has(id)) {
            clearInterval(id);
            this.intervals.delete(id);
        }
    }

    trackTimeout(callback, delay) {
        const id = setTimeout(() => {
            callback();
            this.timeouts.delete(id);
        }, delay);
        this.timeouts.add(id);
        return id;
    }

    clearTimeout(id) {
        if (this.timeouts.has(id)) {
            clearTimeout(id);
            this.timeouts.delete(id);
        }
    }

    cleanup() {
        // Clean up all tracked resources
        this.listeners.forEach(listenerInfo => {
            this.removeEventListener(listenerInfo);
        });

        this.intervals.forEach(id => {
            clearInterval(id);
        });

        this.timeouts.forEach(id => {
            clearTimeout(id);
        });

        this.listeners.clear();
        this.intervals.clear();
        this.timeouts.clear();

        logger.log('Memory monitor cleanup completed');
    }

    getStats() {
        return {
            listeners: this.listeners.size,
            intervals: this.intervals.size,
            timeouts: this.timeouts.size
        };
    }
}

// Global memory monitor instance
window.memoryMonitor = new MemoryMonitor();

// Page visibility change optimization
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        // Pause non-critical operations
        logger.log('Page hidden - pausing non-critical operations');
    } else {
        // Resume operations
        logger.log('Page visible - resuming operations');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Logger, PerformanceMonitora, MemoryMonitor };
}