// ===============================================
// SECURITY & ANTI-TAMPERING PROTECTION
// ===============================================

(function() {
    'use strict';
    
    // Anti-debugging protection
    const antiDebug = () => {
        setInterval(() => {
            if (window.devtools && window.devtools.open) {
                document.body.innerHTML = '<h1>Access Denied</h1>';
                return;
            }
        }, 1000);
    };
    
    // Console protection
    const protectConsole = () => {
        const originalLog = console.log;
        console.log = function() {
            // Allow in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                originalLog.apply(console, arguments);
            }
        };
        
        // Disable right-click in production
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                return false;
            });
            
            // Disable F12, Ctrl+Shift+I, Ctrl+U
            document.addEventListener('keydown', (e) => {
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.key === 'u')) {
                    e.preventDefault();
                    return false;
                }
            });
        }
    };
    
    // Source code protection
    const protectSource = () => {
        // Disable text selection in production
        if (window.location.hostname !== 'localhost') {
            document.addEventListener('selectstart', (e) => {
                e.preventDefault();
                return false;
            });
            
            document.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });
        }
    };
    
    // Performance monitoring
    const monitorPerformance = () => {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.fetchStart;
                    
                    if (loadTime > 3000) {
                        console.warn('⚠️ Site loading slowly:', loadTime + 'ms');
                    } else {
                        console.log('⚡ Site loaded in:', loadTime + 'ms');
                    }
                }, 100);
            });
        }
    };
    
    // Initialize security measures
    const initSecurity = () => {
        try {
            antiDebug();
            protectConsole();
            protectSource();
            monitorPerformance();
            
            // Mark as protected
            window._siteProtected = true;
            
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