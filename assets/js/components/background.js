// Dynamic Background Effects
class BackgroundEffects {
    constructor() {
        this.particles = [];
        this.particleCount = 15;
        this.isAnimating = true;
        
        this.init();
    }
    
    init() {
        this.createParticleSystem();
        this.setupIntersectionObserver();
        this.bindEvents();
    }
    
    createParticleSystem() {
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        const particleContainer = document.createElement('div');
        particleContainer.className = 'bg-particles';
        particleContainer.setAttribute('aria-hidden', 'true');
        
        for (let i = 0; i < this.particleCount; i++) {
            const particle = this.createParticle(i);
            particleContainer.appendChild(particle);
            this.particles.push(particle);
        }
        
        document.body.appendChild(particleContainer);
        console.log('✨ Particle system initialized');
    }
    
    createParticle(index) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 6 + 2; // 2-8px
        const delay = Math.random() * 20; // 0-20s delay
        const duration = Math.random() * 10 + 15; // 15-25s duration
        const opacity = Math.random() * 0.4 + 0.1; // 0.1-0.5 opacity
        const hue = Math.random() * 60 + 30; // 30-90 hue (yellow to green)
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            background: hsla(${hue}, 60%, 70%, ${opacity});
            animation-delay: -${delay}s;
            animation-duration: ${duration}s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            animation-name: float;
        `;
        
        return particle;
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.addSectionEffect(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }
    
    addSectionEffect(section) {
        if (section.dataset.effectAdded) return;
        
        section.dataset.effectAdded = 'true';
        
        // Add subtle pulse effect
        section.style.animation = 'sectionPulse 0.6s ease-out';
        
        // Remove animation after completion
        setTimeout(() => {
            section.style.animation = '';
        }, 600);
    }
    
    bindEvents() {
        // Performance monitoring
        let isLowPerf = false;
        
        // Check performance
        const checkPerformance = () => {
            const now = performance.now();
            const fps = 1000 / (now - this.lastFrame || now);
            this.lastFrame = now;
            
            if (fps < 30) {
                isLowPerf = true;
                this.reducedMotion();
            }
            
            if (this.isAnimating) {
                requestAnimationFrame(checkPerformance);
            }
        };
        
        requestAnimationFrame(checkPerformance);
        
        // Pause animations when not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
        
        // Responsive behavior
        window.addEventListener('resize', PerformanceUtils.debounce(() => {
            this.handleResize();
        }, 250));
    }
    
    reducedMotion() {
        console.log('⚡ Reducing motion for performance');
        
        this.particles.forEach(particle => {
            particle.style.animationDuration = '30s';
            particle.style.opacity = '0.1';
        });
        
        document.body.style.animationDuration = '30s';
    }
    
    pauseAnimations() {
        this.particles.forEach(particle => {
            particle.style.animationPlayState = 'paused';
        });
        
        document.body.style.animationPlayState = 'paused';
    }
    
    resumeAnimations() {
        this.particles.forEach(particle => {
            particle.style.animationPlayState = 'running';
        });
        
        document.body.style.animationPlayState = 'running';
    }
    
    handleResize() {
        // Recalculate particle positions for mobile
        if (window.innerWidth < 768) {
            this.particles.forEach(particle => {
                particle.style.animationDuration = '12s';
            });
        } else {
            this.particles.forEach(particle => {
                const duration = Math.random() * 10 + 15;
                particle.style.animationDuration = `${duration}s`;
            });
        }
    }
    
    // Method to change background theme
    setTheme(theme) {
        const body = document.body;
        body.classList.remove('bg-pattern', 'bg-glass');
        
        switch (theme) {
            case 'gradient':
                // Default animated gradient (already applied)
                break;
            case 'pattern':
                body.classList.add('bg-pattern');
                break;
            case 'glass':
                body.classList.add('bg-glass');
                break;
            case 'minimal':
                body.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
                break;
        }
        
        console.log(`🎨 Background theme changed to: ${theme}`);
    }
    
    // Method to add custom particles
    addMusicNotes() {
        const noteContainer = document.createElement('div');
        noteContainer.className = 'music-notes-container';
        noteContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        const notes = ['♪', '♫', '♬', '♩', '♭', '♯'];
        
        for (let i = 0; i < 8; i++) {
            const note = document.createElement('div');
            note.textContent = notes[Math.floor(Math.random() * notes.length)];
            note.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: 100%;
                font-size: ${Math.random() * 20 + 15}px;
                color: rgba(201, 169, 110, 0.3);
                animation: musicFloat ${Math.random() * 10 + 15}s infinite linear;
                animation-delay: -${Math.random() * 20}s;
            `;
            
            noteContainer.appendChild(note);
        }
        
        document.body.appendChild(noteContainer);
        
        // Add keyframes for music notes
        const musicStyle = document.createElement('style');
        musicStyle.textContent = `
            @keyframes musicFloat {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        
        document.head.appendChild(musicStyle);
        
        console.log('🎵 Music notes animation added');
    }
    
    destroy() {
        this.isAnimating = false;
        const particleContainer = document.querySelector('.bg-particles');
        if (particleContainer) {
            particleContainer.remove();
        }
        
        const musicContainer = document.querySelector('.music-notes-container');
        if (musicContainer) {
            musicContainer.remove();
        }
    }
}

// Additional CSS animations
const additionalStyles = `
    @keyframes sectionPulse {
        0% {
            transform: scale(1);
            opacity: 0.8;
        }
        50% {
            transform: scale(1.01);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize background effects
document.addEventListener('DOMContentLoaded', () => {
    const backgroundEffects = new BackgroundEffects();
    
    // Add music notes on music section
    setTimeout(() => {
        backgroundEffects.addMusicNotes();
    }, 2000);
    
    // Make available globally
    window.backgroundEffects = backgroundEffects;
    
    // Theme switching (for admin panel)
    window.setBackgroundTheme = (theme) => {
        backgroundEffects.setTheme(theme);
    };
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackgroundEffects;
}