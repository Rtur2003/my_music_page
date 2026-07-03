/**
 * Accessibility Enhancer - Lighthouse A11y Fixes
 * Fixes buttons, links, and form accessibility issues
 */

class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready and music data to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.enhanceAccessibility();
            });
        } else {
            this.enhanceAccessibility();
        }

        // Also run after music data loads
        setTimeout(() => {
            this.enhanceAccessibility();
        }, 2000);

        // Run periodically to catch dynamically added content
        setInterval(() => {
            this.enhanceAccessibility();
        }, 5000);
    }

    enhanceAccessibility() {
        this.fixButtonAccessibility();
        this.fixLinkAccessibility();
        this.fixFormLabels();
        this.improveColorContrast();
        this.addSkipNavigation();
        this.enhanceFocusManagement();
    }

    // Fix button accessibility issues
    fixButtonAccessibility() {
        // Fix play buttons on music cards
        const playButtons = document.querySelectorAll('.card-play-btn');
        playButtons.forEach((button) => {
            if (!button.hasAttribute('aria-label')) {
                // Try to get track title from parent card
                const musicCard = button.closest('.music-card');
                let trackTitle = 'Track';

                if (musicCard) {
                    const titleElement = musicCard.querySelector('.music-card-title');
                    if (titleElement) {
                        trackTitle = titleElement.textContent.trim();
                    }
                }

                button.setAttribute('aria-label', `Play ${trackTitle}`);
                button.setAttribute('title', `Play ${trackTitle}`);

                // Add screen reader text
                if (!button.querySelector('.sr-only')) {
                    const srText = document.createElement('span');
                    srText.className = 'sr-only';
                    srText.textContent = `Play ${trackTitle}`;
                    button.appendChild(srText);
                }
            }
        });

        // Fix main play button
        const mainPlayBtn = document.getElementById('mainPlayBtn');
        if (mainPlayBtn && !mainPlayBtn.hasAttribute('aria-label')) {
            mainPlayBtn.setAttribute('aria-label', 'Play/Pause current track');
            mainPlayBtn.setAttribute('title', 'Play/Pause current track');
        }

        // Fix theme toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle && !themeToggle.hasAttribute('aria-label')) {
            themeToggle.setAttribute('aria-label', 'Toggle dark/light theme');
            themeToggle.setAttribute('title', 'Toggle theme');
        }

        // Fix floating action buttons
        const fabButtons = document.querySelectorAll('.fab');
        fabButtons.forEach(fab => {
            if (!fab.hasAttribute('aria-label')) {
                const tooltip = fab.getAttribute('data-tooltip');
                if (tooltip) {
                    fab.setAttribute('aria-label', tooltip);
                    fab.setAttribute('title', tooltip);
                }
            }
        });

        // Fix language buttons
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            if (!btn.hasAttribute('aria-label')) {
                const lang = btn.getAttribute('data-lang');
                const langName = lang === 'en' ? 'English' : 'Türkçe';
                btn.setAttribute('aria-label', `Switch to ${langName}`);
                btn.setAttribute('title', `Switch to ${langName}`);
            }
        });

        // Fix submit buttons
        const submitButtons = document.querySelectorAll('button[type="submit"]');
        submitButtons.forEach(btn => {
            if (!btn.hasAttribute('aria-label')) {
                const text = btn.textContent.trim() || 'Submit form';
                btn.setAttribute('aria-label', text);
                btn.setAttribute('title', text);
            }
        });

        // Fix support banner close button
        const supportCloseBtn = document.querySelector('.support-close');
        if (supportCloseBtn && !supportCloseBtn.hasAttribute('aria-label')) {
            supportCloseBtn.setAttribute('aria-label', 'Close support banner');
            supportCloseBtn.setAttribute('title', 'Close support banner');
        }

        // Fix other close buttons
        const closeButtons = document.querySelectorAll('button:not([aria-label])');
        closeButtons.forEach(btn => {
            const text = btn.textContent.trim();
            if (text.includes('×') || text.includes('close') || text.includes('Close') || btn.className.includes('close')) {
                btn.setAttribute('aria-label', 'Close');
                btn.setAttribute('title', 'Close');
            }
        });
    }

    // Fix link accessibility issues
    fixLinkAccessibility() {
        // Fix platform links
        const platformLinks = document.querySelectorAll('.card-platform-link');
        platformLinks.forEach(link => {
            if (!link.hasAttribute('aria-label')) {
                // Determine platform from class
                let platform = 'Platform';
                if (link.classList.contains('youtube')) {platform = 'YouTube';}
                else if (link.classList.contains('spotify')) {platform = 'Spotify';}
                else if (link.classList.contains('apple')) {platform = 'Apple Music';}
                else if (link.classList.contains('soundcloud')) {platform = 'SoundCloud';}

                // Get track title from parent card
                const musicCard = link.closest('.music-card');
                let trackTitle = 'Track';

                if (musicCard) {
                    const titleElement = musicCard.querySelector('.music-card-title');
                    if (titleElement) {
                        trackTitle = titleElement.textContent.trim();
                    }
                }

                const ariaLabel = `Listen to ${trackTitle} on ${platform}`;
                link.setAttribute('aria-label', ariaLabel);
                link.setAttribute('title', ariaLabel);

                // Add screen reader text if no visible text
                if (!link.textContent.trim()) {
                    const srText = document.createElement('span');
                    srText.className = 'sr-only';
                    srText.textContent = ariaLabel;
                    link.appendChild(srText);
                }
            }
        });

        // Fix main platform links
        const mainPlatformLinks = document.querySelectorAll('.platform-link');
        mainPlatformLinks.forEach(link => {
            if (!link.hasAttribute('aria-label')) {
                let platform = 'Platform';
                if (link.classList.contains('spotify-link')) {platform = 'Spotify';}
                else if (link.classList.contains('youtube-link')) {platform = 'YouTube';}
                else if (link.classList.contains('apple-link')) {platform = 'Apple Music';}
                else if (link.classList.contains('soundcloud-link')) {platform = 'SoundCloud';}

                const ariaLabel = `Listen on ${platform}`;
                link.setAttribute('aria-label', ariaLabel);
                link.setAttribute('title', ariaLabel);
            }
        });

        // Fix social links
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            if (!link.hasAttribute('aria-label')) {
                let platform = 'Social platform';
                const href = link.getAttribute('href') || '';

                let hostname = '';
                let pathname = '';
                if (href) {
                    try {
                        const url = new URL(href, document.baseURI);
                        hostname = (url.hostname || '').toLowerCase();
                        pathname = (url.pathname || '').toLowerCase();
                    } catch (e) {
                        // If URL parsing fails, do not attempt substring-based hostname detection
                        // to avoid misclassifying arbitrary URLs as social platforms.
                    }
                }

                if (hostname === 'instagram.com' || hostname.endsWith('.instagram.com')) {
                    platform = 'Instagram';
                }
                else if (hostname === 'linkedin.com' || hostname.endsWith('.linkedin.com')) {
                    platform = 'LinkedIn';
                }
                else if (hostname === 'github.com' || hostname.endsWith('.github.com')) {
                    platform = 'GitHub';
                }
                else if (hostname === 'youtube.com' || hostname.endsWith('.youtube.com')) {
                    platform = 'YouTube';
                }
                else if (hostname === 'tiktok.com' || hostname.endsWith('.tiktok.com')) {
                    platform = 'TikTok';
                }
                else if (hostname === 'spotify.com' || hostname.endsWith('.spotify.com')) {
                    platform = 'Spotify';
                }
                // Host-based detection for X (Twitter)
                else if (
                    hostname === 'twitter.com' || hostname.endsWith('.twitter.com') ||
                    hostname === 'x.com' || hostname.endsWith('.x.com')
                ) {
                    platform = 'X (Twitter)';
                }

                const ariaLabel = `Visit my ${platform} profile`;
                link.setAttribute('aria-label', ariaLabel);
                link.setAttribute('title', ariaLabel);
            }
        });

        // Fix generic links without proper text
        const genericLinks = document.querySelectorAll('a:not([aria-label])');
        genericLinks.forEach(link => {
            const text = link.textContent.trim();
            const href = link.getAttribute('href');

            if (!text && href) {
                let description = 'Link';
                if (href.includes('#')) {
                    const section = href.replace('#', '');
                    description = `Navigate to ${section} section`;
                } else if (href.startsWith('mailto:')) {
                    description = 'Send email';
                } else if (href.startsWith('tel:')) {
                    description = 'Call phone number';
                }

                link.setAttribute('aria-label', description);
                link.setAttribute('title', description);
            }
        });
    }

    // Fix form label issues
    fixFormLabels() {
        // Fix volume slider
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider && !volumeSlider.hasAttribute('aria-label')) {
            volumeSlider.setAttribute('aria-label', 'Volume control');
            volumeSlider.setAttribute('title', 'Adjust volume');

            // Add proper label element
            let label = document.querySelector('label[for="volumeSlider"]');
            if (!label) {
                label = document.createElement('label');
                label.setAttribute('for', 'volumeSlider');
                label.className = 'sr-only';
                label.textContent = 'Volume control';
                volumeSlider.parentNode.insertBefore(label, volumeSlider);
            }
        }

        // Fix other form inputs
        const formInputs = document.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            const id = input.getAttribute('id');
            const name = input.getAttribute('name');
            const placeholder = input.getAttribute('placeholder');

            if (id && !document.querySelector(`label[for="${id}"]`) && !input.hasAttribute('aria-label')) {
                // Create screen reader label
                const label = document.createElement('label');
                label.setAttribute('for', id);
                label.className = 'sr-only';
                label.textContent = placeholder || name || id;
                input.parentNode.insertBefore(label, input);
            }
        });
    }

    // Improve color contrast
    improveColorContrast() {
        // Create enhanced contrast styles
        const contrastStyle = document.createElement('style');
        contrastStyle.textContent = `
            /* Enhanced contrast for accessibility */
            .lang-btn {
                background: rgba(212, 176, 120, 0.1) !important;
                color: rgba(255, 255, 255, 0.95) !important;
                border: 1px solid rgba(212, 176, 120, 0.3) !important;
            }

            .lang-btn.active {
                background: rgba(212, 176, 120, 0.8) !important;
                color: rgba(0, 0, 0, 0.9) !important;
            }

            .shows-all-btn,
            .merch-shop-btn {
                color: rgba(255, 255, 255, 0.9) !important;
                background: rgba(212, 176, 120, 0.1) !important;
                border: 1px solid rgba(212, 176, 120, 0.3) !important;
            }

            .btn-primary {
                background: linear-gradient(135deg, #d4b078, #f4d03f) !important;
                color: rgba(0, 0, 0, 0.9) !important;
                border: none !important;
            }

            /* Screen reader only text */
            .sr-only {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border: 0 !important;
            }

            /* Focus indicators */
            button:focus,
            a:focus,
            input:focus,
            textarea:focus,
            select:focus {
                outline: 3px solid #d4b078 !important;
                outline-offset: 2px !important;
            }

            /* High contrast mode support */
            @media (prefers-contrast: high) {
                * {
                    color: #ffffff !important;
                    background: #000000 !important;
                    border-color: #ffffff !important;
                }

                .sonic-btn.primary {
                    background: #ffffff !important;
                    color: #000000 !important;
                }
            }
        `;

        // Only add if not already present
        if (!document.querySelector('#accessibility-contrast-styles')) {
            contrastStyle.id = 'accessibility-contrast-styles';
            document.head.appendChild(contrastStyle);
        }
    }

    // Add skip navigation
    addSkipNavigation() {
        if (!document.querySelector('.skip-nav')) {
            const skipNav = document.createElement('a');
            skipNav.className = 'skip-nav sr-only';
            skipNav.href = '#main-content';
            skipNav.textContent = 'Skip to main content';
            skipNav.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                z-index: 10000;
                background: #d4b078;
                color: #000;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                transition: top 0.3s ease;
            `;

            skipNav.addEventListener('focus', () => {
                skipNav.style.top = '6px';
            });

            skipNav.addEventListener('blur', () => {
                skipNav.style.top = '-40px';
            });

            document.body.insertBefore(skipNav, document.body.firstChild);
        }

        // Add main content landmark
        const mainContent = document.querySelector('main') || document.querySelector('.sonic-hero');
        if (mainContent && !mainContent.hasAttribute('id')) {
            mainContent.setAttribute('id', 'main-content');
        }
    }

    // Enhance focus management
    enhanceFocusManagement() {
        // Ensure all interactive elements are focusable
        const interactiveElements = document.querySelectorAll('button, a, input, textarea, select');
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('tabindex') && element.style.display !== 'none') {
                element.setAttribute('tabindex', '0');
            }
        });

        // Add keyboard navigation support
        document.addEventListener('keydown', (e) => {
            // Escape key to close modals/overlays
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    activeModal.classList.remove('active');
                }
            }

            // Enter key for buttons that don't have onclick
            if (e.key === 'Enter' && e.target.tagName === 'BUTTON') {
                e.target.click();
            }
        });
    }

    // Add ARIA live regions for dynamic content
    addLiveRegions() {
        if (!document.querySelector('#aria-live-polite')) {
            const livePolite = document.createElement('div');
            livePolite.id = 'aria-live-polite';
            livePolite.setAttribute('aria-live', 'polite');
            livePolite.className = 'sr-only';
            document.body.appendChild(livePolite);
        }

        if (!document.querySelector('#aria-live-assertive')) {
            const liveAssertive = document.createElement('div');
            liveAssertive.id = 'aria-live-assertive';
            liveAssertive.setAttribute('aria-live', 'assertive');
            liveAssertive.className = 'sr-only';
            document.body.appendChild(liveAssertive);
        }
    }

    // Announce dynamic content changes
    announce(message, priority = 'polite') {
        const liveRegion = document.querySelector(`#aria-live-${priority}`);
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
}

// Initialize accessibility enhancer
document.addEventListener('DOMContentLoaded', () => {
    const enhancer = new AccessibilityEnhancer();

    // Make it globally available for other scripts
    window.accessibilityEnhancer = enhancer;

    // Re-run when music data loads
    document.addEventListener('musicDataLoaded', () => {
        setTimeout(() => {
            enhancer.enhanceAccessibility();
        }, 500);
    });
});

// Export for potential use in other scripts
window.AccessibilityEnhancer = AccessibilityEnhancer;