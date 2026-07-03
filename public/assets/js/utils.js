// ===============================================
// UTILITY FUNCTIONS
// ===============================================

/**
 * Collection of reusable utility functions
 */

/**
 * Storage utilities with error handling
 */
export const StorageUtils = {
    /**
     * Safely get item from localStorage
     * @param {string} key - Storage key
     * @returns {string|null} Stored value or null
     */
    getItem(key) {
        try {
            if (typeof Storage !== 'undefined' && window.localStorage) {
                return localStorage.getItem(key);
            }
        } catch {
            console.warn(`Cannot access localStorage for key: ${key}`);
        }
        return null;
    },

    /**
     * Safely set item in localStorage
     * @param {string} key - Storage key
     * @param {string} value - Value to store
     * @returns {boolean} Success status
     */
    setItem(key, value) {
        try {
            if (typeof Storage !== 'undefined' && window.localStorage) {
                localStorage.setItem(key, value);
                return true;
            }
        } catch {
            console.warn(`Cannot save to localStorage for key: ${key}`);
        }
        return false;
    },

    /**
     * Safely remove item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    removeItem(key) {
        try {
            if (typeof Storage !== 'undefined' && window.localStorage) {
                localStorage.removeItem(key);
                return true;
            }
        } catch {
            console.warn(`Cannot remove from localStorage for key: ${key}`);
        }
        return false;
    },

    /**
     * Check if localStorage is available
     * @returns {boolean} Availability status
     */
    isAvailable() {
        try {
            return typeof Storage !== 'undefined' && window.localStorage !== undefined;
        } catch {
            return false;
        }
    }
};

/**
 * DOM utilities
 */
export const DOMUtils = {
    /**
     * Safely query selector
     * @param {string} selector - CSS selector
     * @param {Element} context - Context element (default: document)
     * @returns {Element|null} Found element or null
     */
    querySelector(selector, context = document) {
        try {
            return context.querySelector(selector);
        } catch (error) {
            console.error(`Invalid selector: ${selector}`, error);
            return null;
        }
    },

    /**
     * Safely query all selectors
     * @param {string} selector - CSS selector
     * @param {Element} context - Context element (default: document)
     * @returns {NodeList|Array} Found elements
     */
    querySelectorAll(selector, context = document) {
        try {
            return context.querySelectorAll(selector);
        } catch (error) {
            console.error(`Invalid selector: ${selector}`, error);
            return [];
        }
    },

    /**
     * Create element with attributes
     * @param {string} tag - Element tag name
     * @param {Object} attributes - Element attributes
     * @param {string} content - Text content (will be sanitized)
     * @returns {Element} Created element
     */
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else if (key === 'dataset' && attributes.dataset) {
                Object.keys(attributes.dataset).forEach(dataKey => {
                    element.dataset[dataKey] = attributes.dataset[dataKey];
                });
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        if (content) {
            // Use textContent for safety - caller should use DOM methods for HTML
            element.textContent = content;
        }
        
        return element;
    },

    /**
     * Remove element from DOM
     * @param {Element} element - Element to remove
     */
    removeElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }
};

/**
 * Validation utilities
 */
export const ValidationUtils = {
    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} Validation result
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate URL
     * @param {string} url - URL to validate
     * @returns {boolean} Validation result
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Sanitize HTML string
     * @param {string} html - HTML string to sanitize
     * @returns {string} Sanitized string
     */
    sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    },

    /**
     * Check if string is empty or whitespace
     * @param {string} str - String to check
     * @returns {boolean} Check result
     */
    isEmpty(str) {
        return !str || str.trim().length === 0;
    }
};

/**
 * Performance utilities
 */
export const PerformanceUtils = {
    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function} Throttled function
     */
    throttle(func, limit = 300) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        };
    },

    /**
     * Get page load time
     * @returns {number} Load time in milliseconds
     */
    getLoadTime() {
        if ('performance' in window) {
            const perfData = performance.timing;
            return perfData.loadEventEnd - perfData.navigationStart;
        }
        return 0;
    }
};

/**
 * Environment utilities
 */
export const EnvironmentUtils = {
    /**
     * Check if running in development mode
     * @returns {boolean} Development status
     */
    isDevelopment() {
        const devHosts = ['localhost', '127.0.0.1', ''];
        return devHosts.includes(window.location.hostname);
    },

    /**
     * Check if running in production mode
     * @returns {boolean} Production status
     */
    isProduction() {
        return !EnvironmentUtils.isDevelopment();
    },

    /**
     * Check if mobile device
     * @returns {boolean} Mobile device status
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Check if touch device
     * @returns {boolean} Touch device status
     */
    isTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
};

/**
 * Error handling utilities
 */
export const ErrorUtils = {
    /**
     * Safely execute function with error handling
     * @param {Function} fn - Function to execute
     * @param {Function} fallback - Fallback function
     * @returns {*} Function result or fallback result
     */
    safeExecute(fn, fallback = () => null) {
        try {
            return fn();
        } catch (error) {
            console.error('Error in safe execution:', error);
            return fallback();
        }
    },

    /**
     * Log error with context
     * @param {string} context - Error context
     * @param {Error} error - Error object
     */
    logError(context, error) {
        if (EnvironmentUtils.isDevelopment()) {
            console.error(`[${context}]`, error);
        }
    }
};

// Make utilities available globally for non-module scripts
if (typeof window !== 'undefined') {
    window.StorageUtils = StorageUtils;
    window.DOMUtils = DOMUtils;
    window.ValidationUtils = ValidationUtils;
    window.PerformanceUtils = PerformanceUtils;
    window.EnvironmentUtils = EnvironmentUtils;
    window.ErrorUtils = ErrorUtils;
}
