document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    hidePageLoader();
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeContactForm();
    initializeImageModal();
    initializeScrollToTop();
    
    console.log('🎵 Müzik portföyü başarıyla yüklendi!');
}

function hidePageLoader() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1500);
    }
}

function initializeNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            const lines = navToggle.querySelectorAll('.hamburger-line');
            lines.forEach((line, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) line.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) line.style.opacity = '0';
                    if (index === 2) line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    line.style.transform = '';
                    line.style.opacity = '';
                }
            });
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    const lines = navToggle.querySelectorAll('.hamburger-line');
                    lines.forEach(line => {
                        line.style.transform = '';
                        line.style.opacity = '';
                    });
                }
            }
        });
    });
    
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroTitle = heroSection.querySelector('.hero-title');
        const heroDescription = heroSection.querySelector('.hero-description');
        const heroButtons = heroSection.querySelector('.hero-buttons');
        const heroImage = heroSection.querySelector('.hero-image');
        
        if (heroTitle) {
            heroTitle.classList.add('animate-on-scroll');
            setTimeout(() => heroTitle.classList.add('animated'), 500);
        }
        if (heroDescription) {
            heroDescription.classList.add('animate-on-scroll');
            setTimeout(() => heroDescription.classList.add('animated'), 700);
        }
        if (heroButtons) {
            heroButtons.classList.add('animate-on-scroll');
            setTimeout(() => heroButtons.classList.add('animated'), 900);
        }
        if (heroImage) {
            heroImage.classList.add('animate-on-scroll');
            setTimeout(() => heroImage.classList.add('animated'), 1100);
        }
    }
}

function initializeAnimations() {
    const cards = document.querySelectorAll('.music-card, .gallery-item, .skill-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = '';
        });
    });
}

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            if (!name || !email || !subject || !message) {
                showNotification('Lütfen tüm alanları doldurun.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Lütfen geçerli bir e-posta adresi girin.', 'error');
                return;
            }
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.', 'success');
                contactForm.reset();
                
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00cec9' : type === 'error' ? '#e74c3c' : '#6c5ce7'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

function initializeImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.modal-close');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('h4').textContent;
            const description = item.querySelector('p').textContent;
            
            modal.style.display = 'block';
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modalCaption.innerHTML = `<h4>${title}</h4><p>${description}</p>`;
            
            document.body.style.overflow = 'hidden';
        });
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function initializeScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function createParticleEffect(element, particleCount = 10) {
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            animation: particleFloat 2s ease-out forwards;
        `;
        
        const rect = element.getBoundingClientRect();
        particle.style.left = rect.left + Math.random() * rect.width + 'px';
        particle.style.top = rect.top + Math.random() * rect.height + 'px';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 2000);
    }
}

const particleAnimationCSS = `
@keyframes particleFloat {
    0% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    100% {
        opacity: 0;
        transform: translateY(-100px) scale(0);
    }
}
`;

if (!document.querySelector('#particle-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'particle-animation-styles';
    style.textContent = particleAnimationCSS;
    document.head.appendChild(style);
}

function addRippleEffect(element) {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    });
}

const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = rippleCSS;
    document.head.appendChild(style);
}

document.querySelectorAll('.btn, .control-btn, .social-link').forEach(addRippleEffect);

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelectorAll('.parallax');
    
    parallax.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

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

const debouncedScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

lazyLoadImages();

window.addEventListener('resize', debounce(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}, 250));

const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

// Software Stats Counter Animation
function animateCounter(element, target, duration = 2000) {
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = Math.floor(current);
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Intersection Observer for Software Stats
function initSoftwareStats() {
    const statsSection = document.querySelector('.software-stats');
    if (!statsSection) return;
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                
                statNumbers.forEach(stat => {
                    const targetValue = parseInt(stat.dataset.count);
                    animateCounter(stat, targetValue);
                });
                
                // Only animate once
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });
    
    statsObserver.observe(statsSection);
}

// Real Analytics Tracking
class RealAnalytics {
    constructor() {
        this.sessionStart = Date.now();
        this.trackPageView();
        this.bindTrackingEvents();
    }
    
    trackPageView() {
        const views = parseInt(localStorage.getItem('page_views') || '0') + 1;
        localStorage.setItem('page_views', views.toString());
        localStorage.setItem('last_visit', new Date().toISOString());
    }
    
    trackMusicPlay(trackName) {
        const plays = parseInt(localStorage.getItem('music_plays') || '0') + 1;
        localStorage.setItem('music_plays', plays.toString());
        
        // Store individual track data
        const trackPlays = JSON.parse(localStorage.getItem('track_analytics') || '{}');
        trackPlays[trackName] = (trackPlays[trackName] || 0) + 1;
        localStorage.setItem('track_analytics', JSON.stringify(trackPlays));
    }
    
    trackGalleryInteraction(category) {
        const clicks = parseInt(localStorage.getItem('gallery_clicks') || '0') + 1;
        localStorage.setItem('gallery_clicks', clicks.toString());
        
        // Store category data
        const categoryClicks = JSON.parse(localStorage.getItem('gallery_analytics') || '{}');
        categoryClicks[category] = (categoryClicks[category] || 0) + 1;
        localStorage.setItem('gallery_analytics', JSON.stringify(categoryClicks));
    }
    
    trackSocialClick(platform) {
        const clicks = parseInt(localStorage.getItem('social_clicks') || '0') + 1;
        localStorage.setItem('social_clicks', clicks.toString());
        
        // Store platform data
        const platformClicks = JSON.parse(localStorage.getItem('social_analytics') || '{}');
        platformClicks[platform] = (platformClicks[platform] || 0) + 1;
        localStorage.setItem('social_analytics', JSON.stringify(platformClicks));
    }
    
    trackTimeSpent() {
        const timeSpent = Math.floor((Date.now() - this.sessionStart) / 1000);
        const totalTime = parseInt(localStorage.getItem('total_time_spent') || '0') + timeSpent;
        localStorage.setItem('total_time_spent', totalTime.toString());
    }
    
    bindTrackingEvents() {
        // Track music plays
        document.addEventListener('click', (e) => {
            if (e.target.closest('.music-card') || e.target.closest('.play-btn')) {
                const musicCard = e.target.closest('.music-card');
                const trackName = musicCard?.querySelector('h4')?.textContent || 'Unknown Track';
                this.trackMusicPlay(trackName);
            }
            
            // Track gallery clicks
            if (e.target.closest('.gallery-item')) {
                const galleryItem = e.target.closest('.gallery-item');
                const category = galleryItem?.dataset.category || 'general';
                this.trackGalleryInteraction(category);
            }
            
            // Track social clicks
            if (e.target.closest('.link-card')) {
                const linkCard = e.target.closest('.link-card');
                const platform = linkCard.classList.contains('github-card') ? 'github' :
                               linkCard.classList.contains('linkedin-card') ? 'linkedin' :
                               linkCard.classList.contains('email-card') ? 'email' : 'other';
                this.trackSocialClick(platform);
            }
        });
        
        // Track page leave
        window.addEventListener('beforeunload', () => {
            this.trackTimeSpent();
        });
        
        // Track visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackTimeSpent();
                this.sessionStart = Date.now(); // Reset for next visible session
            }
        });
    }
}

// Initialize analytics
const analytics = new RealAnalytics();

// Initialize stats animation
document.addEventListener('DOMContentLoaded', () => {
    initSoftwareStats();
});

// Version and Cache Management
class CacheManager {
    constructor() {
        this.version = '1.2.0';
        this.checkVersion();
    }
    
    checkVersion() {
        const storedVersion = localStorage.getItem('site_version');
        const currentVersion = document.querySelector('meta[name="version"]')?.content || this.version;
        
        if (storedVersion && storedVersion !== currentVersion) {
            console.log(`🔄 Version updated: ${storedVersion} → ${currentVersion}`);
            this.clearOldCache();
        }
        
        localStorage.setItem('site_version', currentVersion);
        console.log(`📦 Current version: ${currentVersion}`);
    }
    
    clearOldCache() {
        // Clear localStorage except user settings
        const keepKeys = ['admin_session', 'admin_last_activity', 'user_preferences'];
        const allKeys = Object.keys(localStorage);
        
        allKeys.forEach(key => {
            if (!keepKeys.includes(key)) {
                localStorage.removeItem(key);
            }
        });
        
        console.log('🧹 Old cache cleared due to version update');
    }
}

// Initialize cache manager
const cacheManager = new CacheManager();

console.log('%c🎵 Müzik Portföyü', 'color: #6c5ce7; font-size: 20px; font-weight: bold;');
console.log('%cTüm sistemler aktif ve hazır!', 'color: #00cec9; font-size: 14px;');