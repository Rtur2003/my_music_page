/**
 * Motion Effects Engine
 * Adds scroll-triggered animations and interactive hover effects
 * Inspired by Motion One / Framer Motion principles
 */

class MotionEngine {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        
        this.init();
    }

    init() {
        // Add base styles for motion if not present
        this.injectStyles();
        
        // Setup Intersection Observer
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersect(entries), 
            this.observerOptions
        );

        // Target elements
        this.observeElements();

        // Listen for DOM changes (if content is loaded dynamically)
        this.setupMutationObserver();
    }

    injectStyles() {
        if (document.getElementById('motion-styles')) return;

        const style = document.createElement('style');
        style.id = 'motion-styles';
        style.textContent = `
            /* Base Motion States */
            [data-motion] {
                opacity: 0;
                will-change: opacity, transform;
                transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), 
                            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
            }

            /* Reduced Motion Override */
            @media (prefers-reduced-motion: reduce) {
                [data-motion] {
                    opacity: 1 !important;
                    transform: none !important;
                    transition: none !important;
                }
            }

            /* Variants */
            [data-motion="fade-up"] {
                transform: translateY(40px);
            }

            [data-motion="fade-in"] {
                transform: scale(0.95);
            }

            [data-motion="slide-right"] {
                transform: translateX(-50px);
            }
            
            [data-motion="slide-left"] {
                transform: translateX(50px);
            }

            /* Active State */
            [data-motion].in-view {
                opacity: 1;
                transform: translate(0) scale(1);
            }

            /* Stagger Delays (up to 10 items) */
            .stagger-1 { transition-delay: 100ms; }
            .stagger-2 { transition-delay: 200ms; }
            .stagger-3 { transition-delay: 300ms; }
            .stagger-4 { transition-delay: 400ms; }
            .stagger-5 { transition-delay: 500ms; }
            .stagger-6 { transition-delay: 600ms; }
            .stagger-7 { transition-delay: 700ms; }
            .stagger-8 { transition-delay: 800ms; }
            .stagger-9 { transition-delay: 900ms; }
            .stagger-10 { transition-delay: 1000ms; }
        `;
        document.head.appendChild(style);
    }

    observeElements() {
        const elements = document.querySelectorAll('[data-motion]');
        elements.forEach(el => this.observer.observe(el));
    }

    handleIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Optional: Unobserve after revealing to only animate once
                this.observer.unobserve(entry.target);
            }
        });
    }

    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.hasAttribute('data-motion')) {
                            this.observer.observe(node);
                        }
                        // Check children if it's a container
                        if (node.nodeType === 1 && node.querySelectorAll) {
                            node.querySelectorAll('[data-motion]').forEach(child => {
                                this.observer.observe(child);
                            });
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.motionEngine = new MotionEngine();
});
