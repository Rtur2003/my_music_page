// ===============================================
// THEME SWITCHING & MOBILE NAVIGATION
// ===============================================

class ThemeAndNavigationManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupMobileNavigation();
        this.applyTheme(this.currentTheme);
        console.log('🎨 Theme and Navigation Manager initialized');
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    setupMobileNavigation() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                const icon = mobileMenuToggle.querySelector('i');
                
                if (navMenu.classList.contains('active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            });

            // Close mobile menu when clicking on links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.className = 'fas fa-bars';
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.className = 'fas fa-bars';
                }
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        console.log(`🎨 Theme switched to: ${this.currentTheme}`);
    }

    applyTheme(theme) {
        const root = document.documentElement;
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle?.querySelector('i');

        if (theme === 'light') {
            // Light theme variables
            root.style.setProperty('--primary-black', '#ffffff');
            root.style.setProperty('--royal-black', '#f5f5f5');
            root.style.setProperty('--deep-charcoal', '#e0e0e0');
            root.style.setProperty('--dark-surface', '#f9f9f9');
            root.style.setProperty('--darker-surface', '#ffffff');
            root.style.setProperty('--text-primary', '#2a2a2a');
            root.style.setProperty('--text-secondary', '#666666');
            
            // Update gradients for light mode
            root.style.setProperty('--hero-gradient', 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)');
            root.style.setProperty('--section-gradient', 'linear-gradient(135deg, #f9f9f9 0%, #f5f5f5 100%)');
            root.style.setProperty('--dark-gradient', 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)');
            root.style.setProperty('--card-gradient', 'linear-gradient(135deg, #e0e0e0 0%, #f9f9f9 100%)');
            
            if (icon) icon.className = 'fas fa-moon';
            
        } else {
            // Dark theme variables (original)
            root.style.setProperty('--primary-black', '#0a0a0a');
            root.style.setProperty('--royal-black', '#111111');
            root.style.setProperty('--deep-charcoal', '#1a1a1a');
            root.style.setProperty('--dark-surface', '#161616');
            root.style.setProperty('--darker-surface', '#0f0f0f');
            root.style.setProperty('--text-primary', '#e0e0e0');
            root.style.setProperty('--text-secondary', '#b0b0b0');
            
            // Original gradients
            root.style.setProperty('--hero-gradient', 'linear-gradient(135deg, #111111 0%, #0a0a0a 100%)');
            root.style.setProperty('--section-gradient', 'linear-gradient(135deg, #161616 0%, #111111 100%)');
            root.style.setProperty('--dark-gradient', 'linear-gradient(135deg, #0f0f0f 0%, #0a0a0a 100%)');
            root.style.setProperty('--card-gradient', 'linear-gradient(135deg, #1a1a1a 0%, #161616 100%)');
            
            if (icon) icon.className = 'fas fa-sun';
        }

        // Update navigation background opacity
        const nav = document.querySelector('.sonic-nav');
        if (nav) {
            if (theme === 'light') {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
            } else {
                nav.style.background = 'rgba(10, 10, 10, 0.95)';
            }
        }

        // Trigger custom event for other components
        const event = new CustomEvent('themeChanged', {
            detail: { theme: theme }
        });
        window.dispatchEvent(event);
    }

    // Responsive navigation improvements
    handleResize() {
        const navMenu = document.querySelector('.nav-menu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (window.innerWidth > 768) {
            navMenu?.classList.remove('active');
            const icon = mobileMenuToggle?.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const manager = new ThemeAndNavigationManager();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        manager.handleResize();
    });
    
    // Export for global access
    window.themeAndNavigationManager = manager;
});

// Additional mobile optimizations
const mobileOptimizations = `
/* Additional mobile styles */
@media (max-width: 480px) {
    .nav-container {
        padding: 0 1rem;
    }
    
    .hero-profile {
        width: 250px !important;
        height: 250px !important;
    }
    
    .hero-title {
        font-size: 2rem !important;
    }
    
    .hero-stats {
        flex-direction: column;
        gap: 1rem;
    }
    
    .stat-item {
        min-width: 120px;
        text-align: center;
    }
    
    .gallery-grid {
        grid-template-columns: 1fr !important;
    }
    
    .software-intro {
        grid-template-columns: 1fr !important;
    }
    
    .tech-icons {
        grid-template-columns: repeat(2, 1fr) !important;
    }
    
    .contact-content {
        grid-template-columns: 1fr !important;
    }
    
    .container {
        padding: 0 1rem;
    }
    
    .glass-container {
        padding: 1.5rem;
    }
    
    .section {
        padding: 3rem 0;
    }
}

/* Very small screens */
@media (max-width: 320px) {
    .nav-container {
        padding: 0 0.5rem;
    }
    
    .hero-profile {
        width: 200px !important;
        height: 200px !important;
    }
    
    .lang-btn {
        padding: 0.3rem 0.6rem !important;
        font-size: 0.7rem !important;
    }
    
    .theme-toggle,
    .mobile-menu-toggle {
        width: 36px !important;
        height: 36px !important;
    }
}
`;

// Inject mobile optimizations
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileOptimizations;
document.head.appendChild(styleSheet);