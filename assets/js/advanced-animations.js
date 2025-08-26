// Advanced Animation System for Music Portfolio
// Modern animations with professional effects

// Initialize advanced animations
function initializeAdvancedAnimations() {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Apply stagger animations to children
                const staggerElements = entry.target.querySelectorAll('.stagger-animation');
                staggerElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.classList.add('animated');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.animate-on-scroll, .slide-from-left, .slide-from-right, .smooth-reveal').forEach(element => {
        animationObserver.observe(element);
    });
    
    // Enhanced Music Card Animations
    initializeMusicCardAnimations();
    
    // Enhanced Gallery Animations
    initializeGalleryAnimations();
    
    // Modern Button Effects
    initializeModernButtonEffects();
    
    // Parallax Effects
    initializeParallaxEffects();
    
    console.log('🎨 Gelişmiş animasyonlar başlatıldı');
}

// Music Card 3D Hover Effects
function initializeMusicCardAnimations() {
    const musicCards = document.querySelectorAll('.music-card');
    
    musicCards.forEach((card, index) => {
        card.classList.add('professional-hover');
        card.style.animationDelay = `${index * 0.1}s`;
        
        // 3D tilt effect on hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            card.style.boxShadow = '0 25px 50px rgba(108, 92, 231, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            card.style.boxShadow = '';
        });
        
        // Add entrance animation
        card.classList.add('stagger-animation');
        card.classList.add(`stagger-${(index % 6) + 1}`);
    });
}

// Gallery Item Animations
function initializeGalleryAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        item.classList.add('professional-hover');
        
        // Alternating slide directions
        if (index % 2 === 0) {
            item.classList.add('slide-from-left');
        } else {
            item.classList.add('slide-from-right');
        }
        
        item.style.animationDelay = `${index * 0.15}s`;
        
        // Enhanced hover effect
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-15px) scale(1.02)';
            item.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.4)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
            item.style.boxShadow = '';
        });
    });
}

// Modern Button Effects with Ripple
function initializeModernButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.classList.add('modern-btn');
        
        // Ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            ripple.classList.add('ripple-effect');
            
            // Ensure button has relative positioning
            if (getComputedStyle(button).position === 'static') {
                button.style.position = 'relative';
            }
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });
    });
}

// Parallax Effects for Hero Section
function initializeParallaxEffects() {
    const heroImage = document.querySelector('.hero-image');
    const floatingNotes = document.querySelectorAll('.floating-notes i');
    
    if (heroImage) {
        heroImage.classList.add('parallax-element');
    }
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        // Hero image parallax
        if (heroImage) {
            heroImage.style.transform = `translate3d(0, ${rate * 0.3}px, 0)`;
        }
        
        // Floating notes parallax
        floatingNotes.forEach((note, index) => {
            const speed = 0.2 + (index * 0.1);
            note.style.transform = `translate3d(0, ${rate * speed}px, 0) rotate(${rate * 0.1}deg)`;
        });
    });
}

// Smooth reveal animation for sections
function initializeSectionReveals() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-revealed');
                    
                    // Animate section content
                    const animatableElements = entry.target.querySelectorAll('.section-title, .section-subtitle, .music-card, .gallery-item, .skill-item');
                    animatableElements.forEach((element, index) => {
                        setTimeout(() => {
                            element.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            });
        }, { threshold: 0.1 });
        
        sectionObserver.observe(section);
    });
}

// Music Player Enhanced Animations
function enhanceMusicPlayerAnimations() {
    const musicPlayer = document.querySelector('.music-player-main');
    const playButton = document.querySelector('#playPauseBtn');
    const progressBar = document.querySelector('.progress-bar');
    
    if (musicPlayer) {
        musicPlayer.classList.add('professional-hover');
        
        // Pulse animation when playing
        if (playButton) {
            playButton.addEventListener('click', () => {
                const isPlaying = playButton.innerHTML.includes('pause');
                
                if (isPlaying) {
                    musicPlayer.classList.add('playing-state');
                    addMusicVisualizerEffect();
                } else {
                    musicPlayer.classList.remove('playing-state');
                    removeMusicVisualizerEffect();
                }
            });
        }
    }
    
    // Progress bar animation
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const percentage = (clickX / width) * 100;
            
            const progress = progressBar.querySelector('.progress');
            if (progress) {
                progress.style.width = percentage + '%';
                
                // Add ripple effect on progress bar
                const ripple = document.createElement('div');
                ripple.className = 'progress-ripple';
                ripple.style.left = clickX + 'px';
                progressBar.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 500);
            }
        });
    }
}

// Music visualizer effect
function addMusicVisualizerEffect() {
    const trackImage = document.querySelector('.track-image');
    if (trackImage && !trackImage.querySelector('.music-visualizer')) {
        const visualizer = document.createElement('div');
        visualizer.className = 'music-visualizer';
        
        for (let i = 0; i < 5; i++) {
            const bar = document.createElement('div');
            bar.className = 'music-bar';
            bar.style.animationDelay = `${i * 0.1}s`;
            visualizer.appendChild(bar);
        }
        
        trackImage.appendChild(visualizer);
    }
}

function removeMusicVisualizerEffect() {
    const visualizer = document.querySelector('.music-visualizer');
    if (visualizer) {
        visualizer.remove();
    }
}

// Contact form enhanced animations
function enhanceContactFormAnimations() {
    const form = document.getElementById('contactForm');
    const inputs = form?.querySelectorAll('input, textarea');
    
    inputs?.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentNode.classList.remove('focused');
            }
        });
        
        input.addEventListener('input', () => {
            if (input.value) {
                input.parentNode.classList.add('has-value');
            } else {
                input.parentNode.classList.remove('has-value');
            }
        });
    });
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initializeAdvancedAnimations();
        initializeSectionReveals();
        enhanceMusicPlayerAnimations();
        enhanceContactFormAnimations();
    }, 100);
});

// Export functions for use in main.js
window.initializeAdvancedAnimations = initializeAdvancedAnimations;