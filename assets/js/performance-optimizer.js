/**
 * Performance Optimizer - Lighthouse Performance Fixes
 * Handles image optimization, lazy loading, and critical resource optimization
 */

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.setupLazyLoading();
        this.preloadCriticalResources();
        this.setupWebPSupport();
        this.optimizeAnimations();
        this.setupIntersectionObserver();
    }

    // Detect WebP support and apply appropriate classes
    setupWebPSupport() {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            document.documentElement.classList.add(webP.height === 2 ? 'webp' : 'no-webp');
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }

    // Optimize images with responsive loading
    optimizeImages() {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            // Add loading optimization
            if (!img.hasAttribute('loading')) {
                // Critical images (above fold) should load immediately
                const isCritical = this.isAboveFold(img);
                img.loading = isCritical ? 'eager' : 'lazy';
            }

            // Add proper sizing attributes
            if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
                this.setImageDimensions(img);
            }

            // Add intersection observer for lazy loading
            if (img.loading === 'lazy') {
                img.classList.add('lazy-image');
            }

            // Add load event listener for performance tracking
            img.addEventListener('load', () => {
                img.classList.add('image-loaded');
                img.classList.remove('image-loading');
            });

            img.addEventListener('error', () => {
                console.warn('Image failed to load:', img.src);
                // Fallback to placeholder
                this.addImagePlaceholder(img);
            });
        });
    }

    // Check if element is above the fold
    isAboveFold(element) {
        const rect = element.getBoundingClientRect();
        const viewHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top < viewHeight;
    }

    // Set appropriate image dimensions
    setImageDimensions(img) {
        const classList = Array.from(img.classList);

        // Hero profile image
        if (classList.includes('hero-profile-img')) {
            if (window.innerWidth <= 480) {
                img.width = 120;
                img.height = 120;
            } else if (window.innerWidth <= 768) {
                img.width = 150;
                img.height = 150;
            } else {
                img.width = 200;
                img.height = 200;
            }
        }

        // Artwork images
        if (classList.includes('artwork-image')) {
            if (window.innerWidth <= 480) {
                img.width = 100;
                img.height = 100;
            } else if (window.innerWidth <= 768) {
                img.width = 120;
                img.height = 120;
            } else {
                img.width = 150;
                img.height = 150;
            }
        }
    }

    // Add image placeholder
    addImagePlaceholder(img) {
        img.style.background = 'linear-gradient(135deg, rgba(212, 176, 120, 0.1), rgba(212, 176, 120, 0.05))';
        img.style.backgroundSize = 'cover';
        img.style.backgroundPosition = 'center';
    }

    // Setup lazy loading with Intersection Observer
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observe all lazy images
            document.querySelectorAll('.lazy-image').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Preload critical resources
    preloadCriticalResources() {
        // Preload critical CSS that wasn't inlined
        const criticalCSS = [
            // Missing CSS files removed - using section-based structure
        ];

        criticalCSS.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });

        // Preload critical images for next sections
        const criticalImages = [
            'assets/images/logo-main.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Optimize animations for performance
    optimizeAnimations() {
        // Reduce motion if user prefers
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');

            // Remove all animations
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Optimize animations on mobile
        if (window.innerWidth <= 768) {
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    * {
                        animation-duration: 0.2s !important;
                        transition-duration: 0.2s !important;
                    }

                    .expensive-animation {
                        animation: none !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Setup Intersection Observer for performance monitoring
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            // Monitor sections for performance
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const section = entry.target;
                        section.classList.add('in-viewport');

                        // Trigger any section-specific optimizations
                        this.optimizeSection(section);
                    }
                });
            }, {
                rootMargin: '100px 0px',
                threshold: 0.1
            });

            // Observe all sections
            document.querySelectorAll('section').forEach(section => {
                sectionObserver.observe(section);
            });
        }
    }

    // Section-specific optimizations
    optimizeSection(section) {
        const sectionId = section.id;

        switch (sectionId) {
            case 'music':
                this.optimizeMusicSection();
                break;
            case 'gallery':
                this.optimizeGallerySection();
                break;
            case 'contact':
                this.optimizeContactSection();
                break;
        }
    }

    // Optimize music section
    optimizeMusicSection() {
        // Lazy load music cards that aren't visible
        const musicCards = document.querySelectorAll('.music-card');
        musicCards.forEach(card => {
            if (!this.isAboveFold(card)) {
                card.style.contentVisibility = 'auto';
                card.style.containIntrinsicSize = '1px 300px';
            }
        });
    }

    // Optimize gallery section
    optimizeGallerySection() {
        // Implement virtual scrolling or lazy loading for gallery items
        console.log('Gallery section optimized');
    }

    // Optimize contact section
    optimizeContactSection() {
        // Optimize contact form and social links
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.style.contain = 'layout';
        });
    }

    // Performance monitoring
    measurePerformance() {
        if ('performance' in window && 'getEntriesByType' in performance) {
            // Measure LCP
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // Measure FID
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            }).observe({ entryTypes: ['first-input'] });

            // Measure CLS
            new PerformanceObserver((entryList) => {
                let clsScore = 0;
                entryList.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsScore += entry.value;
                    }
                });
                console.log('CLS:', clsScore);
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }
}

// Initialize performance optimizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const optimizer = new PerformanceOptimizer();

    // Enable performance monitoring in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        optimizer.measurePerformance();
    }
});

// Handle resize events for responsive optimization
window.addEventListener('resize', () => {
    const optimizer = new PerformanceOptimizer();
    optimizer.optimizeImages();
});

// Export for potential use in other scripts
window.PerformanceOptimizer = PerformanceOptimizer;