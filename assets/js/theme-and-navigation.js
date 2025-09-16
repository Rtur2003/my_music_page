// ===============================================
// THEME SWITCHING & MOBILE NAVIGATION
// ===============================================

class ThemeAndNavigationManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'dark';
        this.init();
    }
    
    getStoredTheme() {
        try {
            if (typeof Storage !== 'undefined' && window.localStorage) {
                return localStorage.getItem('theme');
            }
        } catch (error) {
            console.log('Theme storage not available');
        }
        return null;
    }
    
    saveTheme(theme) {
        try {
            if (typeof Storage !== 'undefined' && window.localStorage) {
                localStorage.setItem('theme', theme);
            }
        } catch (error) {
            console.log('Cannot save theme preference');
        }
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
            mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                console.log('Mobile menu toggle clicked');
                navMenu.classList.toggle('active');
                const icon = mobileMenuToggle.querySelector('i');

                if (navMenu.classList.contains('active')) {
                    console.log('Menu opened');
                    icon.className = 'fas fa-times';
                } else {
                    console.log('Menu closed');
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
                if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target) && navMenu.classList.contains('active')) {
                    console.log('Closing menu - clicked outside');
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
        this.saveTheme(this.currentTheme);
        console.log(`🎨 Theme switched to: ${this.currentTheme}`);
    }

    applyTheme(theme) {
        const root = document.documentElement;
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle?.querySelector('i');

        // Set data-theme attribute for CSS variables
        root.setAttribute('data-theme', theme);

        // Update theme toggle icon
        if (icon) {
            if (theme === 'light') {
                icon.className = 'fas fa-moon';
            } else {
                icon.className = 'fas fa-sun';
            }
        }

        console.log(`🎨 Theme applied: ${theme}`);
    }

    updateThemeComponents(theme) {
        // Dispatch theme change event for other components
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));
    }
}

// Initialize when DOM is ready - Combined initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    window.themeManager = new ThemeAndNavigationManager();
    
    // Setup smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                navLinks.forEach(nl => nl.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Setup scroll-based active link updates
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
});