// ===============================================
// THEME SWITCHING & MOBILE NAVIGATION
// ===============================================

/**
 * Manages theme switching and mobile navigation functionality
 * @class ThemeAndNavigationManager
 */
class ThemeAndNavigationManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'dark';
        this.init();
    }
    
    /**
     * Retrieves stored theme preference from localStorage
     * @returns {string|null} Stored theme or null
     */
    getStoredTheme() {
        if (window.StorageUtils) {
            return window.StorageUtils.getItem('theme');
        }
        // Fallback for when utils not loaded
        try {
            if (typeof Storage !== 'undefined' && window.localStorage) {
                return localStorage.getItem('theme');
            }
        } catch {
            console.log('Theme storage not available');
        }
        return null;
    }
    
    /**
     * Saves theme preference to localStorage
     * @param {string} theme - Theme to save
     */
    saveTheme(theme) {
        if (window.StorageUtils) {
            window.StorageUtils.setItem('theme', theme);
        } else {
            // Fallback for when utils not loaded
            try {
                if (typeof Storage !== 'undefined' && window.localStorage) {
                    localStorage.setItem('theme', theme);
                }
            } catch {
                console.log('Cannot save theme preference');
            }
        }
    }

    /**
     * Initializes theme and navigation components
     */
    init() {
        this.setupThemeToggle();
        this.setupMobileNavigation();
        this.applyTheme(this.currentTheme);
        console.log('🎨 Theme and Navigation Manager initialized');
    }

    /**
     * Sets up theme toggle button event listener
     */
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    /**
     * Sets up mobile navigation menu functionality
     */
    setupMobileNavigation() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileMenuToggle && navMenu) {
            // Toggle menu on button click
            mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                this.toggleMobileMenu(navMenu, mobileMenuToggle);
            });

            // Close mobile menu when clicking on links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu(navMenu, mobileMenuToggle);
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && 
                    !mobileMenuToggle.contains(e.target) && 
                    navMenu.classList.contains('active')) {
                    this.closeMobileMenu(navMenu, mobileMenuToggle);
                }
            });
        }
    }

    /**
     * Toggles mobile menu open/closed
     * @param {Element} navMenu - Navigation menu element
     * @param {Element} toggleButton - Toggle button element
     */
    toggleMobileMenu(navMenu, toggleButton) {
        navMenu.classList.toggle('active');
        const icon = toggleButton.querySelector('i');
        
        if (navMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    }

    /**
     * Closes mobile menu
     * @param {Element} navMenu - Navigation menu element
     * @param {Element} toggleButton - Toggle button element
     */
    closeMobileMenu(navMenu, toggleButton) {
        navMenu.classList.remove('active');
        const icon = toggleButton.querySelector('i');
        icon.className = 'fas fa-bars';
    }

    /**
     * Toggles between light and dark themes
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        this.saveTheme(this.currentTheme);
        console.log(`🎨 Theme switched to: ${this.currentTheme}`);
    }

    /**
     * Applies theme to the document
     * @param {string} theme - Theme name ('dark' or 'light')
     */
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

        // Dispatch theme change event for other components
        this.updateThemeComponents(theme);

        console.log(`🎨 Theme applied: ${theme}`);
    }

    /**
     * Notifies other components of theme change
     * @param {string} theme - New theme name
     */
    updateThemeComponents(theme) {
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));
    }
}

/**
 * Sets up smooth scrolling for navigation links
 */
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    const NAV_OFFSET = 80; // Fixed navigation height
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - NAV_OFFSET;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(navLinks, link);
            }
        });
    });
    
    // Setup scroll-based active link updates
    setupScrollBasedNavigation(navLinks);
}

/**
 * Updates active navigation link
 * @param {NodeList} navLinks - All navigation links
 * @param {Element} activeLink - Link to set as active
 */
function updateActiveNavLink(navLinks, activeLink) {
    navLinks.forEach(nl => nl.classList.remove('active'));
    activeLink.classList.add('active');
}

/**
 * Sets up scroll-based navigation highlighting
 * @param {NodeList} navLinks - All navigation links
 */
function setupScrollBasedNavigation(navLinks) {
    const SCROLL_OFFSET = 100;
    
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - SCROLL_OFFSET;
            if (window.scrollY >= sectionTop) {
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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    window.themeManager = new ThemeAndNavigationManager();
    
    // Setup smooth scrolling for navigation
    setupSmoothScrolling();
});