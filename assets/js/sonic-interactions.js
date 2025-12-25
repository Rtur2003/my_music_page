// ===============================================
// HASAN ARTHUR INTERACTIONS
// Professional music portfolio interactions
// ===============================================

// Admin access removed - portfolio is now fully automated

// ===============================================
// HASAN ARTHUR INTERACTIONS
// Advanced UI/UX interactions for music portfolio
// ===============================================

class SonicInteractions {
    constructor() {
        this.nav = document.getElementById('sonicNav');
        this.visualizerBars = document.querySelectorAll('.visualizer-bar');
        this.musicNotes = document.querySelectorAll('.music-note');
        this.waveLayers = document.querySelectorAll('.wave-layer');
        
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupVisualizers();
        this.setupScrollEffects();
        this.setupAudioReactivity();
        this.setupPerformanceOptimizations();
        
        console.log('🎵 Sonic Interactions Initialized');
    }
    
    // ===============================================
    // PERFORMANCE OPTIMIZED INTERACTIONS
    // ===============================================
    
    // ===============================================
    // NAVIGATION EFFECTS
    // ===============================================
    setupNavigation() {
        if (!this.nav) {return;}
        
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolled class for backdrop effect
            if (scrollTop > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
            
            // Hide nav on scroll down, show on scroll up
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                this.nav.style.transform = 'translateY(-100%)';
            } else {
                this.nav.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
        
        // Smooth scroll for navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update active state
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
    }
    
    // ===============================================
    // AUDIO VISUALIZER EFFECTS
    // ===============================================
    setupVisualizers() {
        // Visualizers removed for clean design
        return;
    }
    
    // ===============================================
    // SCROLL-BASED EFFECTS
    // ===============================================
    setupScrollEffects() {
        // Clean design - no scroll animations
        return;
    }
    
    // ===============================================
    // SECTION-SPECIFIC EFFECTS
    // ===============================================
    triggerSectionEffects(section) {
        const sectionId = section.id;
        
        switch(sectionId) {
        case 'home':
            this.animateHeroElements();
            break;
        case 'music':
            this.animateMusicPlayer();
            break;
        case 'about':
            this.animateSkillBars();
            break;
        default:
            this.genericSectionAnimation(section);
        }
    }
    
    animateHeroElements() {
        // Stagger animation for hero buttons
        const heroButtons = document.querySelectorAll('.sonic-btn');
        heroButtons.forEach((btn, index) => {
            setTimeout(() => {
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    animateMusicPlayer() {
        // Add pulse effect to music elements
        const musicCards = document.querySelectorAll('.music-card');
        musicCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('pulse-animation');
            }, index * 100);
        });
    }
    
    animateSkillBars() {
        // Animate progress bars or skill indicators
        const skillElements = document.querySelectorAll('.skill-item');
        skillElements.forEach((skill, index) => {
            setTimeout(() => {
                skill.style.opacity = '1';
                skill.style.transform = 'translateX(0)';
            }, index * 150);
        });
    }
    
    genericSectionAnimation(section) {
        // Generic fade-in animation for other sections
        const children = section.children;
        Array.from(children).forEach((child, index) => {
            setTimeout(() => {
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // ===============================================
    // AUDIO REACTIVITY
    // ===============================================
    setupAudioReactivity() {
        // Listen for audio events if music player exists
        const audioPlayer = document.getElementById('audioPlayer');
        if (audioPlayer) {
            audioPlayer.addEventListener('play', () => {
                this.startAudioVisualization();
            });
            
            audioPlayer.addEventListener('pause', () => {
                this.stopAudioVisualization();
            });
        }
        
        // Simulate audio reactivity for demo
        this.simulateAudioReactivity();
    }
    
    startAudioVisualization() {
        document.body.classList.add('audio-playing');
        
        // Enhance visualizer animation when music plays
        this.visualizerBars.forEach(bar => {
            bar.style.animationDuration = '0.1s';
        });
    }
    
    stopAudioVisualization() {
        document.body.classList.remove('audio-playing');
        
        // Return to normal animation
        this.visualizerBars.forEach(bar => {
            bar.style.animationDuration = '2s';
        });
    }
    
    simulateAudioReactivity() {
        // Create reactive effects based on mouse movement
        document.addEventListener('mousemove', (e) => {
            const intensity = Math.abs(e.movementX + e.movementY) / 20;
            
            // React visualizer to mouse movement
            this.visualizerBars.forEach((bar) => {
                const reaction = intensity * (Math.random() * 2);
                bar.style.transform = `scaleY(${1 + reaction})`;
            });
            
            // React wave layers to mouse movement
            this.waveLayers.forEach((layer, index) => {
                const speed = intensity * (index + 1);
                layer.style.filter = `hue-rotate(${speed * 10}deg)`;
            });
        });
    }
    
    // ===============================================
    // PERFORMANCE OPTIMIZATIONS
    // ===============================================
    setupPerformanceOptimizations() {
        // Throttle resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
        
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }
        
        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }
    
    handleResize() {
        // Adjust cursor visibility
        if (window.innerWidth <= 768) {
            if (this.cursor) {
                this.cursor.style.display = 'none';
            }
        } else {
            if (this.cursor) {
                this.cursor.style.display = 'block';
            }
        }
        
        // Recalculate animations
        this.visualizerBars.forEach(bar => {
            bar.style.animationDuration = '2s';
        });
    }
    
    pauseAnimations() {
        document.body.classList.add('animations-paused');
    }
    
    resumeAnimations() {
        document.body.classList.remove('animations-paused');
    }
}

// ===============================================
// MAINTENANCE MODE CONTROLLER
// ===============================================
const MaintenanceMode = {
    isEnabled: false, // Set to true to enable maintenance mode
    
    checkBypass() {
        if (!this.isEnabled) {return true;}
        
        const bypass = localStorage.getItem('maintenance_bypass');
        const timestamp = localStorage.getItem('bypass_timestamp');
        
        if (bypass === 'true' && timestamp) {
            const now = Date.now();
            const bypassTime = parseInt(timestamp);
            const hoursPassed = (now - bypassTime) / (1000 * 60 * 60);
            
            if (hoursPassed < 24) {
                console.log('🔓 Maintenance bypass active');
                return true;
            } else {
                localStorage.removeItem('maintenance_bypass');
                localStorage.removeItem('bypass_timestamp');
            }
        }
        
        return false;
    },
    
    redirect() {
        console.log('🔧 Redirecting to maintenance page');
        window.location.href = 'maintenance.html';
    }
};

// ===============================================
// PAGE LOADER CONTROLLER
// ===============================================
class PageLoader {
    constructor() {
        this.loader = document.getElementById('pageLoader');
        this.init();
    }
    
    init() {
        // Check maintenance mode first
        if (!MaintenanceMode.checkBypass()) {
            MaintenanceMode.redirect();
            return;
        }
        
        // Show loader for 3 seconds
        setTimeout(() => {
            this.hide();
        }, 3000);
    }
    
    hide() {
        if (this.loader) {
            this.loader.classList.add('hide');
            setTimeout(() => {
                this.loader.style.display = 'none';
            }, 1000);
        }
    }
}

// ===============================================
// INITIALIZATION
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize page loader
    new PageLoader();
    
    // Initialize sonic interactions
    new SonicInteractions();
    
    // Add initial styles for animations
    const style = document.createElement('style');
    style.textContent = `
        .sonic-btn {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .skill-item {
            opacity: 0;
            transform: translateX(-30px);
            transition: all 0.5s ease;
        }
        
        .animations-paused * {
            animation-play-state: paused !important;
        }
        
        .reduced-motion * {
            animation: none !important;
            transition: none !important;
        }
        
        .pulse-animation {
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(style);
});