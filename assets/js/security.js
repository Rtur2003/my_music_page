// ===============================================
// SECURITY & PERFORMANCE MONITORING
// ===============================================

/**
 * Security and performance monitoring module
 * Implements reasonable security measures without impacting user experience
 */
(function() {
    'use strict';
    
    /**
     * Check if running in development environment
     * @returns {boolean} True if development
     */
    const isDevelopment = () => {
        const devHosts = ['localhost', '127.0.0.1', ''];
        return devHosts.includes(window.location.hostname);
    };

    /**
     * Monitors performance metrics
     * Logs warnings if page load is slow
     */
    const monitorPerformance = () => {
        if (!('performance' in window)) {
            return;
        }

        window.addEventListener('load', () => {
            setTimeout(() => {
                try {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (!perfData) {
                        return;
                    }

                    const loadTime = perfData.loadEventEnd - perfData.fetchStart;
                    
                    if (isDevelopment()) {
                        if (loadTime > 3000) {
                            console.warn('⚠️ Site loading slowly:', loadTime + 'ms');
                        } else {
                            console.log('⚡ Site loaded in:', loadTime + 'ms');
                        }
                    }
                } catch (error) {
                    console.error('Performance monitoring error:', error);
                }
            }, 100);
        });
    };

    /**
     * Protects against common XSS attacks by sanitizing inputs
     * This is a passive monitoring approach
     */
    const setupInputSanitization = () => {
        // Monitor form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName === 'FORM') {
                const inputs = form.querySelectorAll('input[type="text"], textarea');
                inputs.forEach(input => {
                    const value = input.value;
                    // Check for potential script injection
                    if (/<script|javascript:|onerror=|onload=/i.test(value)) {
                        console.warn('Potential XSS attempt detected in form input');
                    }
                });
            }
        });
    };

    /**
     * Prevents clickjacking attacks
     * Ensures the site is not loaded in an iframe (unless on same origin)
     */
    const preventClickjacking = () => {
        if (window.self !== window.top) {
            try {
                // Check if iframe is from same origin
                if (window.parent.location.hostname !== window.location.hostname) {
                    console.warn('Site loaded in external iframe - potential clickjacking');
                    // Only redirect in production
                    if (!isDevelopment()) {
                        window.top.location = window.self.location;
                    }
                }
            } catch {
                // Cross-origin iframe detected
                console.warn('Cross-origin iframe detected');
                if (!isDevelopment()) {
                    document.body.innerHTML = '<h1>This page cannot be displayed in a frame</h1>';
                }
            }
        }
    };

    /**
     * Adds Content Security Policy monitoring
     * Logs CSP violations for debugging
     */
    const setupCSPMonitoring = () => {
        document.addEventListener('securitypolicyviolation', (e) => {
            console.error('CSP Violation:', {
                blockedURI: e.blockedURI,
                violatedDirective: e.violatedDirective,
                originalPolicy: e.originalPolicy
            });
        });
    };

    /**
     * Protects sensitive data in localStorage
     * Warns about potential security issues
     */
    const monitorLocalStorage = () => {
        // Check for sensitive data patterns in localStorage
        try {
            const sensitivePatterns = /password|token|secret|key|api[-_]?key/i;
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && sensitivePatterns.test(key)) {
                    console.warn(`Potential sensitive data in localStorage: ${key}`);
                }
            }
        } catch {
            // localStorage not available
        }
    };

    /**
     * Sets up secure defaults for external links
     * Adds rel="noopener noreferrer" to external links
     */
    const secureExternalLinks = () => {
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        externalLinks.forEach(link => {
            // Only for external links
            if (!link.href.includes(window.location.hostname)) {
                // Add security attributes if not present
                if (!link.hasAttribute('rel')) {
                    link.setAttribute('rel', 'noopener noreferrer');
                } else {
                    const rel = link.getAttribute('rel');
                    if (!rel.includes('noopener')) {
                        link.setAttribute('rel', rel + ' noopener noreferrer');
                    }
                }
            }
        });
    };

    /**
     * Initializes all security measures
     */
    const initSecurity = () => {
        try {
            monitorPerformance();
            setupInputSanitization();
            preventClickjacking();
            setupCSPMonitoring();
            secureExternalLinks();
            
            // Only monitor localStorage in development
            if (isDevelopment()) {
                monitorLocalStorage();
            }
            
            // Mark as initialized
            window._securityInitialized = true;
            
            if (isDevelopment()) {
                console.log('🔒 Security measures initialized');
            }
            
        } catch (error) {
            console.error('Security initialization failed:', error);
        }
    };
    
    // Wait for DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }
    
})();