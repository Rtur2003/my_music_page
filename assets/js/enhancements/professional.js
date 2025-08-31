// Professional Enhancements & Industry Standards
// Advanced features for professional music portfolio

class ProfessionalEnhancements {
    constructor() {
        this.analytics = {
            sessionStart: Date.now(),
            pageViews: 0,
            interactions: 0
        };
        
        this.performance = {
            loadTime: 0,
            renderTime: 0
        };
        
        this.init();
    }
    
    init() {
        this.measurePerformance();
        this.setupAnalytics();
        this.setupSEOEnhancements();
        this.setupAccessibilityFeatures();
        this.setupAdvancedInteractions();
        this.setupMusicIndustryFeatures();
    }
    
    measurePerformance() {
        // Measure page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.performance.loadTime = perfData.loadEventEnd - perfData.fetchStart;
            this.performance.renderTime = perfData.domContentLoadedEventEnd - perfData.fetchStart;
            
            console.log('📊 Performance Metrics:', {
                loadTime: Math.round(this.performance.loadTime) + 'ms',
                renderTime: Math.round(this.performance.renderTime) + 'ms'
            });
            
            // Report to console if performance is slow
            if (this.performance.loadTime > 3000) {
                console.warn('⚠️ Page load time is slower than recommended (>3s)');
            }
        });
        
        // Monitor runtime performance
        this.setupPerformanceObserver();
    }
    
    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.entryType === 'largest-contentful-paint') {
                        console.log('🎨 LCP:', Math.round(entry.startTime) + 'ms');
                    }
                    if (entry.entryType === 'first-input-delay') {
                        console.log('👆 FID:', Math.round(entry.processingStart - entry.startTime) + 'ms');
                    }
                });
            });
            
            try {
                observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input-delay'] });
            } catch (e) {
                console.log('Performance observer not fully supported');
            }
        }
    }
    
    setupAnalytics() {
        // Basic analytics tracking (privacy-focused)
        this.trackPageView();
        this.trackUserInteractions();
        this.trackScrollDepth();
        this.trackMusicEngagement();
    }
    
    trackPageView() {
        this.analytics.pageViews++;
        const sessionData = {
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language,
            referrer: document.referrer || 'direct'
        };
        
        console.log('📈 Page View Tracked:', sessionData);
    }
    
    trackUserInteractions() {
        const interactionElements = [
            'button', 'a', '.music-card', '.gallery-item', 
            '.nav-link', '.platform-link'
        ];
        
        interactionElements.forEach(selector => {
            document.addEventListener('click', (e) => {
                if (e.target.matches(selector) || e.target.closest(selector)) {
                    this.analytics.interactions++;
                    const element = e.target.closest(selector) || e.target;
                    
                    console.log('👆 Interaction:', {
                        element: element.tagName,
                        class: element.className,
                        text: element.textContent?.slice(0, 50),
                        timestamp: Date.now()
                    });
                }
            });
        });
    }
    
    trackScrollDepth() {
        let maxScroll = 0;
        const sections = document.querySelectorAll('section[id]');
        
        const scrollHandler = PerformanceUtils.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
            }
            
            // Track section views
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const sectionId = section.id;
                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    if (!section.dataset.viewed) {
                        section.dataset.viewed = 'true';
                        console.log('👀 Section Viewed:', sectionId);
                    }
                }
            });
        }, 1000);
        
        window.addEventListener('scroll', scrollHandler);
        
        // Report scroll depth on page unload
        window.addEventListener('beforeunload', () => {
            console.log('📊 Max Scroll Depth:', maxScroll + '%');
        });
    }
    
    trackMusicEngagement() {
        // Track music interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.play-btn') || e.target.closest('.main-play-button')) {
                console.log('🎵 Music Play Attempted');
            }
            
            if (e.target.closest('.platform-link')) {
                const platform = e.target.closest('.platform-link').className.match(/(\w+)-link/)?.[1];
                console.log('🔗 Platform Link Clicked:', platform);
            }
        });
    }
    
    setupSEOEnhancements() {
        this.generateBreadcrumbs();
        this.optimizeImages();
        this.setupStructuredData();
    }
    
    generateBreadcrumbs() {
        // Generate breadcrumbs for better SEO
        const breadcrumbContainer = document.createElement('nav');
        breadcrumbContainer.className = 'breadcrumbs';
        breadcrumbContainer.setAttribute('aria-label', 'Breadcrumb');
        
        const breadcrumbList = document.createElement('ol');
        breadcrumbList.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><span aria-current="page">Music Portfolio</span></li>
        `;
        
        breadcrumbContainer.appendChild(breadcrumbList);
        
        // Add structured data for breadcrumbs
        const breadcrumbScript = document.createElement('script');
        breadcrumbScript.type = 'application/ld+json';
        breadcrumbScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://hasanarthuraltuntas.com.tr/"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Music Portfolio"
                }
            ]
        });
        
        document.head.appendChild(breadcrumbScript);
    }
    
    optimizeImages() {
        // Add lazy loading and optimize images
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            if (!img.getAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add error handling
            img.addEventListener('error', () => {
                img.style.display = 'none';
                console.warn('🖼️ Image failed to load:', img.src);
            });
            
            // Track image load performance
            img.addEventListener('load', () => {
                console.log('🖼️ Image loaded:', img.alt || img.src.split('/').pop());
            });
        });
    }
    
    setupStructuredData() {
        // Add rich structured data for music
        const musicStructuredData = {
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            "name": "Hasan Arthur Altuntaş",
            "alternateName": "Hasan Arthur",
            "description": "Professional musician, producer & composer specializing in cinematic and instrumental music",
            "genre": ["Cinematic", "Instrumental", "Film Score", "Ambient"],
            "sameAs": [
                "https://open.spotify.com/artist/hasanarthuraltuntas",
                "https://www.youtube.com/@hasanarthuraltuntas",
                "https://music.apple.com/artist/hasan-arthur-altuntas",
                "https://www.instagram.com/hasan_arthur_altuntas",
                "https://soundcloud.com/hasanarthuraltuntas"
            ],
            "hasOccupation": {
                "@type": "Occupation",
                "name": "Musician",
                "occupationalCategory": "Creative Arts"
            }
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(musicStructuredData);
        document.head.appendChild(script);
    }
    
    setupAccessibilityFeatures() {
        this.addSkipLinks();
        this.enhanceKeyboardNavigation();
        this.addAriaLabels();
        this.setupFocusManagement();
    }
    
    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
            border-radius: 4px;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.prepend(skipLink);
    }
    
    enhanceKeyboardNavigation() {
        // Add keyboard support for interactive elements
        const interactiveElements = document.querySelectorAll(
            '.music-card, .gallery-item, .platform-link'
        );
        
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }
    
    addAriaLabels() {
        // Add missing ARIA labels
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            const text = button.textContent?.trim() || 
                        button.querySelector('i')?.className.replace('fas fa-', '') || 
                        'Button';
            button.setAttribute('aria-label', text);
        });
    }
    
    setupFocusManagement() {
        // Manage focus for modals and dynamic content
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active, .admin-access-modal');
                if (activeModal) {
                    const closeBtn = activeModal.querySelector('[data-dismiss], .modal-close, .admin-close-btn');
                    if (closeBtn) closeBtn.click();
                }
            }
        });
    }
    
    setupAdvancedInteractions() {
        this.addHapticFeedback();
        this.setupSwipeGestures();
        this.addContextualHelp();
    }
    
    addHapticFeedback() {
        // Add haptic feedback for mobile devices
        if ('vibrate' in navigator) {
            const tactileElements = document.querySelectorAll('button, .btn, .music-card');
            
            tactileElements.forEach(element => {
                element.addEventListener('click', () => {
                    navigator.vibrate(10); // Brief vibration
                });
            });
        }
    }
    
    setupSwipeGestures() {
        // Add swipe support for gallery and music cards
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // Only handle horizontal swipes (ignore vertical scrolling)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                const target = e.target.closest('.music-card, .gallery-item');
                if (target) {
                    if (deltaX > 0) {
                        console.log('👉 Swipe right on:', target);
                        // Could trigger next/previous navigation
                    } else {
                        console.log('👈 Swipe left on:', target);
                        // Could trigger actions like favorite/share
                    }
                }
            }
        }, { passive: true });
    }
    
    addContextualHelp() {
        // Add helpful tooltips and hints
        const helpTips = {
            '.language-toggle': 'Switch between English and Turkish',
            '.main-play-button': 'Click to play/pause music',
            '.platform-link': 'Listen on external platforms',
            '.filter-btn': 'Filter gallery images by category'
        };
        
        Object.entries(helpTips).forEach(([selector, tip]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!element.hasAttribute('title')) {
                    element.setAttribute('title', tip);
                }
            });
        });
    }
    
    setupMusicIndustryFeatures() {
        this.addMusicMetadata();
        this.setupAudioContext();
        this.addMusicSharingFeatures();
    }
    
    addMusicMetadata() {
        // Add rich music metadata for better discovery
        const musicMetaTags = [
            { property: 'music:musician', content: 'Hasan Arthur Altuntaş' },
            { property: 'music:genre', content: 'Cinematic' },
            { property: 'music:duration', content: '225' }, // 3:45 in seconds
            { name: 'music:preview_url', content: '#' },
        ];
        
        musicMetaTags.forEach(tag => {
            const meta = document.createElement('meta');
            if (tag.property) meta.setAttribute('property', tag.property);
            if (tag.name) meta.setAttribute('name', tag.name);
            meta.setAttribute('content', tag.content);
            document.head.appendChild(meta);
        });
    }
    
    setupAudioContext() {
        // Prepare audio context for advanced audio features
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🎵 Audio Context initialized for advanced features');
        }
    }
    
    addMusicSharingFeatures() {
        // Add native sharing capabilities
        if ('share' in navigator) {
            const shareData = {
                title: 'Hasan Arthur Altuntaş - Music Portfolio',
                text: 'Discover cinematic and instrumental music by Hasan Arthur Altuntaş',
                url: window.location.href
            };
            
            // Add share buttons dynamically
            const shareButton = document.createElement('button');
            shareButton.className = 'share-btn';
            shareButton.innerHTML = '<i class="fas fa-share"></i> Share';
            shareButton.addEventListener('click', async () => {
                try {
                    await navigator.share(shareData);
                    console.log('📤 Content shared successfully');
                } catch (err) {
                    console.log('📤 Sharing cancelled or failed');
                }
            });
            
            // Add to hero section if it exists
            const heroButtons = document.querySelector('.hero-buttons');
            if (heroButtons) {
                heroButtons.appendChild(shareButton);
            }
        }
    }
    
    // Report final metrics
    generatePerformanceReport() {
        const report = {
            loadTime: this.performance.loadTime,
            renderTime: this.performance.renderTime,
            sessionDuration: Date.now() - this.analytics.sessionStart,
            pageViews: this.analytics.pageViews,
            interactions: this.analytics.interactions,
            timestamp: new Date().toISOString()
        };
        
        console.log('📊 Final Performance Report:', report);
        return report;
    }
}

// Initialize professional enhancements
document.addEventListener('DOMContentLoaded', () => {
    const professionalEnhancements = new ProfessionalEnhancements();
    
    // Make available globally for debugging
    window.professionalEnhancements = professionalEnhancements;
    
    // Generate report on page unload
    window.addEventListener('beforeunload', () => {
        professionalEnhancements.generatePerformanceReport();
    });
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfessionalEnhancements;
}