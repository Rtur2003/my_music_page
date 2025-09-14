/* ===============================================
   DYNAMIC EFFECTS & INTERACTIVE ANIMATIONS
   =============================================== */

document.addEventListener('DOMContentLoaded', function() {

    // Initialize all dynamic effects
    initializeParticleSystem();
    initializeScrollEffects();
    initializeFloatingActions();
    initializeMusicWaveAnimation();
    initializePageTransitions();
    initializeNavScrollIndicator();

    // console.log('🎨 Dynamic Effects Initialized'); // Disabled for production
});

/* ===============================================
   PARTICLE BACKGROUND SYSTEM
   =============================================== */
function initializeParticleSystem() {
    // Create particle container
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    const particleContainer = document.createElement('div');
    particleContainer.className = 'hero-particles';

    // Create 15 particles for better visual effect
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random positioning and sizing
        const size = Math.random() * 4 + 1; // 1-5px
        const left = Math.random() * 100; // 0-100%
        const top = Math.random() * 100; // 0-100%
        const animationDelay = Math.random() * 6; // 0-6s
        const animationDuration = Math.random() * 4 + 4; // 4-8s

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            top: ${top}%;
            animation-delay: ${animationDelay}s;
            animation-duration: ${animationDuration}s;
        `;

        particleContainer.appendChild(particle);
    }

    document.body.appendChild(particleContainer);
}

/* ===============================================
   SCROLL EFFECTS & PROGRESS BAR
   =============================================== */
function initializeScrollEffects() {
    // Create scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);

    const progressFill = progressBar.querySelector('.scroll-progress-bar');
    if (!progressFill) return;

    // Update progress on scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        progressFill.style.width = scrollPercent + '%';

        // Show/hide scroll-to-top based on scroll position
        const scrollToTop = document.querySelector('.scroll-to-top');
        if (scrollToTop) {
            if (scrollTop > 300) {
                scrollToTop.style.opacity = '1';
                scrollToTop.style.visibility = 'visible';
            } else {
                scrollToTop.style.opacity = '0';
                scrollToTop.style.visibility = 'hidden';
            }
        }
    });

    // Smooth scroll to top functionality
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/* ===============================================
   FLOATING ACTION BUTTONS
   =============================================== */
function initializeFloatingActions() {
    const fabContainer = document.createElement('div');
    fabContainer.className = 'floating-actions';

    // Create scroll-to-top FAB
    const scrollToTopFab = document.createElement('a');
    scrollToTopFab.href = '#top';
    scrollToTopFab.className = 'fab scroll-to-top tooltip';
    scrollToTopFab.setAttribute('data-tooltip', 'Yukarı Çık');
    scrollToTopFab.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopFab.style.cssText = 'opacity: 0; visibility: hidden; transition: all 0.3s;';

    // Create theme toggle FAB
    const themeToggleFab = document.createElement('button');
    themeToggleFab.className = 'fab theme-toggle tooltip';
    themeToggleFab.setAttribute('data-tooltip', 'Tema Değiştir');
    themeToggleFab.innerHTML = '<i class="fas fa-moon"></i>';

    // Add click handler for theme toggle
    themeToggleFab.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Update icon
        const icon = this.querySelector('i');
        if (newTheme === 'light') {
            icon.className = 'fas fa-sun';
            this.setAttribute('data-tooltip', 'Karanlık Mod');
        } else {
            icon.className = 'fas fa-moon';
            this.setAttribute('data-tooltip', 'Aydınlık Mod');
        }
    });

    // Add to container
    fabContainer.appendChild(scrollToTopFab);
    fabContainer.appendChild(themeToggleFab);
    document.body.appendChild(fabContainer);

    // Set initial theme icon
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        themeToggleFab.querySelector('i').className = 'fas fa-sun';
        themeToggleFab.setAttribute('data-tooltip', 'Karanlık Mod');
    }
}

/* ===============================================
   MUSIC WAVE ANIMATION
   =============================================== */
function initializeMusicWaveAnimation() {
    // Add music wave to player section
    const playerSection = document.querySelector('.modern-player-card .modern-track-title');
    if (!playerSection) return;

    const waveContainer = document.createElement('div');
    waveContainer.className = 'music-wave';

    // Create 8 wave bars
    for (let i = 0; i < 8; i++) {
        const waveBar = document.createElement('div');
        waveBar.className = 'wave-bar';
        waveContainer.appendChild(waveBar);
    }

    // Insert after track title
    if (playerSection) {
        playerSection.insertAdjacentElement('afterend', waveContainer);
    }

    // Animate waves when music is playing
    const playButton = document.querySelector('.main-play-button');
    if (playButton) {
        playButton.addEventListener('click', function() {
            const waves = document.querySelectorAll('.wave-bar');
            waves.forEach((wave, index) => {
                // Add random heights for more dynamic effect
                const randomHeight = Math.random() * 20 + 10;
                wave.style.animationDelay = (index * 0.1) + 's';
                wave.style.setProperty('--max-height', randomHeight + 'px');
            });
        });
    }
}

/* ===============================================
   PAGE TRANSITIONS
   =============================================== */
function initializePageTransitions() {
    // Add transition class to main sections
    const sections = document.querySelectorAll('section, .modern-player-card, .music-card, .footer-section');

    sections.forEach(section => {
        section.classList.add('page-transition');
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Load first section immediately
    const firstSection = document.querySelector('.page-transition');
    if (firstSection) {
        setTimeout(() => {
            firstSection.classList.add('loaded');
        }, 100);
    }
}

/* ===============================================
   NAVIGATION SCROLL INDICATOR
   =============================================== */
function initializeNavScrollIndicator() {
    const nav = document.querySelector('.sonic-nav');
    if (!nav) return;

    const indicator = document.createElement('div');
    indicator.className = 'nav-scroll-indicator';
    nav.appendChild(indicator);

    // Update indicator based on active section
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    window.addEventListener('scroll', function() {
        let currentSection = '';
        const scrollPos = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update active nav link and indicator position
        navLinks.forEach((link, index) => {
            link.classList.remove('active');

            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');

                // Update indicator position and width
                const linkWidth = link.offsetWidth;
                const linkLeft = link.offsetLeft;

                indicator.style.width = linkWidth + 'px';
                indicator.style.left = linkLeft + 'px';
            }
        });
    });
}

/* ===============================================
   ENHANCED CARD INTERACTIONS
   =============================================== */
function enhanceCardInteractions() {
    const musicCards = document.querySelectorAll('.music-card');

    musicCards.forEach(card => {
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.classList.add('ripple-effect');

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(212, 176, 120, 0.6);
                transform: translate(-50%, -50%);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 10;
            `;

            this.appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        // Add tilt effect on mouse move
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Add CSS for ripple effect
const rippleCSS = `
    @keyframes ripple {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }

    .music-card {
        position: relative;
        overflow: hidden;
    }
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize card interactions
document.addEventListener('DOMContentLoaded', enhanceCardInteractions);

/* ===============================================
   UTILITY FUNCTIONS
   =============================================== */

// Debounce function for performance
function debounce(func, wait) {
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

// Throttle function for scroll events
function throttle(func, limit) {
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
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // Optimized scroll handling
}, 16)); // ~60fps

/* ===============================================
   ACCESSIBILITY FEATURES
   =============================================== */

// Respect user's motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable particle system
    const particleContainer = document.querySelector('.hero-particles');
    if (particleContainer) {
        particleContainer.style.display = 'none';
    }

    // Reduce animation intensity
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
}

// High contrast mode support
if (window.matchMedia('(prefers-contrast: high)').matches) {
    document.documentElement.classList.add('high-contrast');
}