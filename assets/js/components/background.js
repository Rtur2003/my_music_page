// Elegant Musical Background Effects
class MusicalBackgroundEffects {
    constructor() {
        this.musicNotes = [];
        this.noteCount = 12;
        this.isAnimating = true;
        this.scrollY = 0;
        
        this.init();
    }
    
    init() {
        this.createFloatingNotes();
        this.setupWavePattern();
        this.setupScrollEffects();
        this.setupIntersectionObserver();
        this.bindEvents();
    }
    
    createFloatingNotes() {
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        const notesContainer = document.createElement('div');
        notesContainer.className = 'floating-notes';
        notesContainer.setAttribute('aria-hidden', 'true');
        
        const noteTypes = ['note-1', 'note-2', 'note-3', 'note-4', 'note-5'];
        
        for (let i = 0; i < this.noteCount; i++) {
            const note = this.createMusicNote(i, noteTypes);
            notesContainer.appendChild(note);
            this.musicNotes.push(note);
        }
        
        document.body.appendChild(notesContainer);
        console.log('🎵 Musical notes background initialized');
    }
    
    createMusicNote(index, noteTypes) {
        const note = document.createElement('div');
        const noteType = noteTypes[Math.floor(Math.random() * noteTypes.length)];
        note.className = `music-note ${noteType}`;
        
        // Random properties for natural movement
        const leftPos = Math.random() * 100;
        const size = Math.random() * 12 + 18; // 18-30px
        const duration = Math.random() * 15 + 20; // 20-35s
        const delay = Math.random() * 25; // 0-25s delay
        const opacity = Math.random() * 0.05 + 0.05; // 0.05-0.1 opacity
        
        note.style.cssText = `
            left: ${leftPos}%;
            font-size: ${size}px;
            animation-duration: ${duration}s;
            animation-delay: -${delay}s;
            color: rgba(201, 169, 110, ${opacity});
        `;
        
        return note;
    }
    
    setupWavePattern() {
        const wavePattern = document.createElement('div');
        wavePattern.className = 'wave-pattern';
        wavePattern.setAttribute('aria-hidden', 'true');
        document.body.appendChild(wavePattern);
    }
    
    setupScrollEffects() {
        // Create parallax background elements
        const parallaxBg = document.createElement('div');
        parallaxBg.className = 'parallax-bg';
        parallaxBg.setAttribute('aria-hidden', 'true');
        document.body.appendChild(parallaxBg);
        
        // Add section-specific backgrounds
        this.addSectionBackgrounds();
    }
    
    addSectionBackgrounds() {
        const musicSection = document.querySelector('.music');
        const aboutSection = document.querySelector('.about');
        
        if (musicSection && !musicSection.classList.contains('music-bg')) {
            musicSection.classList.add('music-bg');
        }
        
        if (aboutSection && !aboutSection.classList.contains('about-bg')) {
            aboutSection.classList.add('about-bg');
        }
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerSectionAnimation(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe sections with animate-on-enter class
        document.querySelectorAll('.animate-on-enter').forEach(element => {
            observer.observe(element);
        });
        
        // Observe main sections
        document.querySelectorAll('section').forEach(section => {
            if (!section.classList.contains('hero')) {
                section.classList.add('animate-on-enter');
                observer.observe(section);
            }
        });
    }
    
    triggerSectionAnimation(element) {
        if (element.classList.contains('in-view')) return;
        
        element.classList.add('in-view');
        
        // Add special effects for music section
        if (element.classList.contains('music')) {
            this.addMusicSectionEffect(element);
        }
    }
    
    addMusicSectionEffect(element) {
        // Create temporary music notes around the section
        const tempNotes = [];
        for (let i = 0; i < 5; i++) {
            const note = document.createElement('div');
            note.className = 'music-note note-' + (Math.floor(Math.random() * 5) + 1);
            note.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                font-size: ${Math.random() * 10 + 20}px;
                color: rgba(201, 169, 110, 0.3);
                animation: specialFloat 3s ease-out forwards;
                pointer-events: none;
                z-index: 10;
            `;
            element.style.position = 'relative';
            element.appendChild(note);
            tempNotes.push(note);
        }
        
        // Remove temporary notes after animation
        setTimeout(() => {
            tempNotes.forEach(note => note.remove());
        }, 3000);
    }
    
    bindEvents() {
        // Handle scroll for parallax effect
        let ticking = false;
        
        const updateScrollEffects = () => {
            this.scrollY = window.pageYOffset;
            const parallaxBg = document.querySelector('.parallax-bg');
            
            if (parallaxBg) {
                const scrolled = this.scrollY * 0.3;
                parallaxBg.style.setProperty('--scroll-y', `${scrolled}px`);
            }
            
            ticking = false;
        };
        
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
        
        // Visibility handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
        
        // Responsive behavior
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }
    
    setupPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const checkPerformance = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
                
                if (fps < 30) {
                    this.enablePerformanceMode();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            if (this.isAnimating) {
                requestAnimationFrame(checkPerformance);
            }
        };
        
        requestAnimationFrame(checkPerformance);
    }
    
    enablePerformanceMode() {
        console.log('⚡ Enabling performance mode');
        
        // Reduce note count
        const notesToRemove = Math.floor(this.musicNotes.length / 2);
        for (let i = 0; i < notesToRemove; i++) {
            const note = this.musicNotes.pop();
            if (note && note.parentNode) {
                note.parentNode.removeChild(note);
            }
        }
        
        // Slow down remaining animations
        this.musicNotes.forEach(note => {
            note.style.animationDuration = '40s';
        });
        
        // Disable wave animation
        const wavePattern = document.querySelector('.wave-pattern');
        if (wavePattern) {
            wavePattern.style.animationPlayState = 'paused';
        }
    }
    
    pauseAnimations() {
        this.musicNotes.forEach(note => {
            note.style.animationPlayState = 'paused';
        });
        
        const wavePattern = document.querySelector('.wave-pattern');
        if (wavePattern) {
            wavePattern.style.animationPlayState = 'paused';
        }
    }
    
    resumeAnimations() {
        this.musicNotes.forEach(note => {
            note.style.animationPlayState = 'running';
        });
        
        const wavePattern = document.querySelector('.wave-pattern');
        if (wavePattern) {
            wavePattern.style.animationPlayState = 'running';
        }
    }
    
    handleResize() {
        const isMobile = window.innerWidth < 768;
        
        this.musicNotes.forEach(note => {
            if (isMobile) {
                note.style.animationDuration = '20s';
                note.style.fontSize = '16px';
            } else {
                const duration = Math.random() * 15 + 20;
                const size = Math.random() * 12 + 18;
                note.style.animationDuration = `${duration}s`;
                note.style.fontSize = `${size}px`;
            }
        });
    }
    
    // Utility function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    destroy() {
        this.isAnimating = false;
        
        const floatingNotes = document.querySelector('.floating-notes');
        if (floatingNotes) {
            floatingNotes.remove();
        }
        
        const wavePattern = document.querySelector('.wave-pattern');
        if (wavePattern) {
            wavePattern.remove();
        }
        
        const parallaxBg = document.querySelector('.parallax-bg');
        if (parallaxBg) {
            parallaxBg.remove();
        }
    }
}

// Add special animation keyframes
const specialAnimationCSS = `
    @keyframes specialFloat {
        0% {
            transform: translateY(0) scale(0.5) rotate(0deg);
            opacity: 0;
        }
        50% {
            transform: translateY(-30px) scale(1.2) rotate(180deg);
            opacity: 0.6;
        }
        100% {
            transform: translateY(-60px) scale(0.8) rotate(360deg);
            opacity: 0;
        }
    }
    
    .will-change-transform {
        will-change: transform;
    }
    
    .section.in-view {
        animation: sectionReveal 0.8s ease-out forwards;
    }
    
    @keyframes sectionReveal {
        0% {
            opacity: 0;
            transform: translateY(30px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const styleElement = document.createElement('style');
styleElement.textContent = specialAnimationCSS;
document.head.appendChild(styleElement);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const musicalBg = new MusicalBackgroundEffects();
    
    // Make available globally
    window.musicalBackground = musicalBg;
    
    console.log('🎼 Musical background system initialized');
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicalBackgroundEffects;
}