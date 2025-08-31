// Performance Optimization Helpers
const PerformanceUtils = {
    // Throttle function to limit function calls
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },
    
    // Debounce function to delay function execution
    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
    
    // Lazy loading utility
    lazyLoad(elements, options = {}) {
        const defaultOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
            ...options
        };
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        if (element.dataset.src) {
                            element.src = element.dataset.src;
                            element.classList.add('loaded');
                        }
                        observer.unobserve(element);
                    }
                });
            }, defaultOptions);
            
            elements.forEach(el => observer.observe(el));
        } else {
            // Fallback for browsers without IntersectionObserver
            elements.forEach(el => {
                if (el.dataset.src) {
                    el.src = el.dataset.src;
                    el.classList.add('loaded');
                }
            });
        }
    },
    
    // Batch DOM operations for better performance
    batchDOMOperations(operations) {
        const fragment = document.createDocumentFragment();
        operations.forEach(operation => {
            operation(fragment);
        });
        return fragment;
    }
};

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceUtils;
} else if (typeof window !== 'undefined') {
    window.PerformanceUtils = PerformanceUtils;
}