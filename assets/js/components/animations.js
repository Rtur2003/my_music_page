// Animation Controller
class AnimationController {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupStaggeredAnimations();
    }
    
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        observer.unobserve(entry.target);
                    }
                });
            }, this.observerOptions);
            
            animatedElements.forEach(el => observer.observe(el));
        } else {
            // Fallback for browsers without IntersectionObserver
            animatedElements.forEach(el => el.classList.add('animate'));
        }
    }
    
    setupStaggeredAnimations() {
        const staggeredGroups = document.querySelectorAll('[data-stagger-group]');
        
        staggeredGroups.forEach(group => {
            const items = group.querySelectorAll('.stagger-animation');
            const delay = parseInt(group.dataset.staggerDelay) || 100;
            
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.animateStaggeredGroup(items, delay);
                            observer.unobserve(entry.target);
                        }
                    });
                }, this.observerOptions);
                
                observer.observe(group);
            } else {
                this.animateStaggeredGroup(items, delay);
            }
        });
    }
    
    animateStaggeredGroup(items, delay) {
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate');
            }, index * delay);
        });
    }
    
    // Utility method to animate elements with custom timing
    animateElement(element, animationClass = 'fade-in-up', delay = 0) {
        setTimeout(() => {
            element.classList.add(animationClass);
        }, delay);
    }
    
    // Method to create smooth transitions between sections
    transitionToSection(sectionId, callback) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        // Add transition class
        section.classList.add('section-transition');
        
        // Smooth scroll to section
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Execute callback after transition
        if (callback && typeof callback === 'function') {
            setTimeout(callback, 800);
        }
    }
    
    // Method to add hover effects to cards
    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.card, .music-card, .gallery-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }
    
    // Parallax effect for hero section
    setupParallaxEffect() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;
        
        const parallaxHandler = PerformanceUtils.throttle(() => {
            const scrollY = window.scrollY;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 16); // ~60fps
        
        window.addEventListener('scroll', parallaxHandler);
    }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const animationController = new AnimationController();
    
    // Setup additional effects after page load
    window.addEventListener('load', () => {
        animationController.setupCardHoverEffects();
        animationController.setupParallaxEffect();
    });
    
    // Make available globally
    window.animationController = animationController;
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}