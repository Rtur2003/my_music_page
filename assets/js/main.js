// Safe Storage Helper - Multi-level fallback system
const SafeStorage = {
    memoryStorage: new Map(),
    
    // Try to get data with fallback chain
    getItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            try {
                return sessionStorage.getItem(key);
            } catch (e2) {
                return this.memoryStorage.get(key) || null;
            }
        }
    },
    
    // Try to set data with fallback chain
    setItem(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            try {
                sessionStorage.setItem(key, value);
                return true;
            } catch (e2) {
                this.memoryStorage.set(key, value);
                return true;
            }
        }
    },
    
    // Try to remove data with fallback chain
    removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            try {
                sessionStorage.removeItem(key);
            } catch (e2) {
                this.memoryStorage.delete(key);
            }
        }
    }
};

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
    loadDynamicContent();
    initializeAdvancedAnimations();
    
    console.log('🎵 Müzik portföyü başarıyla yüklendi!');
}

function hidePageLoader() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        // Wait for critical resources to load
        Promise.all([
            // Wait for fonts
            document.fonts.ready,
            // Wait for critical images
            new Promise(resolve => {
                const criticalImages = document.querySelectorAll('img[loading="eager"]');
                if (criticalImages.length === 0) {
                    resolve();
                    return;
                }
                let loadedCount = 0;
                criticalImages.forEach(img => {
                    if (img.complete) {
                        loadedCount++;
                    } else {
                        img.addEventListener('load', () => {
                            loadedCount++;
                            if (loadedCount === criticalImages.length) resolve();
                        });
                        img.addEventListener('error', () => {
                            loadedCount++;
                            if (loadedCount === criticalImages.length) resolve();
                        });
                    }
                });
                if (loadedCount === criticalImages.length) resolve();
            })
        ]).then(() => {
            // Add minimum loading time for smooth UX
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 300); // Reduced from 1500ms to 300ms
        }).catch(() => {
            // Fallback: hide after maximum wait time
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 800); // Maximum 800ms wait
        });
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
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetSection.offsetTop - headerHeight - 20; // Extra offset
                
                // Use both smooth scroll methods for better compatibility
                try {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } catch (error) {
                    // Fallback for older browsers
                    const start = window.pageYOffset;
                    const distance = targetPosition - start;
                    const duration = 800;
                    let startTime = null;
                    
                    function animation(currentTime) {
                        if (startTime === null) startTime = currentTime;
                        const timeElapsed = currentTime - startTime;
                        const run = ease(timeElapsed, start, distance, duration);
                        window.scrollTo(0, run);
                        if (timeElapsed < duration) requestAnimationFrame(animation);
                    }
                    
                    function ease(t, b, c, d) {
                        t /= d / 2;
                        if (t < 1) return c / 2 * t * t + b;
                        t--;
                        return -c / 2 * (t * (t - 2) - 1) + b;
                    }
                    
                    requestAnimationFrame(animation);
                }
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (navToggle) navToggle.classList.remove('active');
                    const lines = navToggle ? navToggle.querySelectorAll('.hamburger-line') : [];
                    lines.forEach(line => {
                        line.style.transform = '';
                        line.style.opacity = '';
                    });
                }
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Update URL hash without jumping
                history.replaceState(null, null, targetId);
            } else {
                console.warn('Target section not found:', targetId);
            }
        });
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
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right');
    animatedElements.forEach(el => observer.observe(el));
    
    // Page views tracking
    const views = parseInt(SafeStorage.getItem('page_views') || '0') + 1;
    SafeStorage.setItem('page_views', views.toString());
    SafeStorage.setItem('last_visit', new Date().toISOString());
}

function initializeAnimations() {
    // Counter animations with better performance
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count')) || 0;
                let current = 0;
                const duration = 2000; // 2 seconds
                const step = target / (duration / 16); // 60fps
                
                const updateCounter = () => {
                    if (current < target) {
                        current += step;
                        const displayValue = Math.floor(current);
                        counter.textContent = displayValue;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                // Add number formatting for larger numbers
                const formatNumber = (num) => {
                    if (num >= 1000) {
                        return (num / 1000).toFixed(1) + 'K';
                    }
                    return num.toString();
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });
    
    counters.forEach(counter => {
        if (counter) {
            counterObserver.observe(counter);
        }
    });
    
    // Music card animations
    const musicCards = document.querySelectorAll('.music-card');
    musicCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.addEventListener('click', function() {
            const plays = parseInt(SafeStorage.getItem('music_plays') || '0') + 1;
            SafeStorage.setItem('music_plays', plays.toString());
            
            const trackTitle = this.querySelector('h4').textContent;
            const trackPlays = JSON.parse(SafeStorage.getItem('track_analytics') || '{}');
            trackPlays[trackTitle] = (trackPlays[trackTitle] || 0) + 1;
            SafeStorage.setItem('track_analytics', JSON.stringify(trackPlays));
        });
    });
    
    // Gallery animations
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.15}s`;
        
        item.addEventListener('click', function() {
            const clicks = parseInt(SafeStorage.getItem('gallery_clicks') || '0') + 1;
            SafeStorage.setItem('gallery_clicks', clicks.toString());
            
            const category = this.getAttribute('data-category');
            const categoryClicks = JSON.parse(SafeStorage.getItem('gallery_analytics') || '{}');
            categoryClicks[category] = (categoryClicks[category] || 0) + 1;
            SafeStorage.setItem('gallery_analytics', JSON.stringify(categoryClicks));
        });
    });
}

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name')?.trim();
            const email = formData.get('email')?.trim();
            const subject = formData.get('subject')?.trim();
            const message = formData.get('message')?.trim();
            
            // Clear previous errors
            clearAllErrors();
            
            let isValid = true;
            
            // Validate name
            if (!name || name.length < 2) {
                showFieldError('name', 'Ad soyad en az 2 karakter olmalıdır');
                isValid = false;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                showFieldError('email', 'Geçerli bir e-posta adresi girin');
                isValid = false;
            }
            
            // Validate subject
            if (!subject || subject.length < 3) {
                showFieldError('subject', 'Konu en az 3 karakter olmalıdır');
                isValid = false;
            }
            
            // Validate message
            if (!message || message.length < 10) {
                showFieldError('message', 'Mesaj en az 10 karakter olmalıdır');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
                submitBtn.disabled = true;
                
                // Simulate form submission with delay
                setTimeout(() => {
                    showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.', 'success');
                    this.reset();
                    
                    // Track form submissions
                    const submissions = parseInt(SafeStorage.getItem('form_submissions') || '0') + 1;
                    SafeStorage.setItem('form_submissions', submissions.toString());
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            } else {
                showNotification('Lütfen form hatalarını düzeltin.', 'error');
            }
        });
    }
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        switch (field.name) {
            case 'name':
                if (!value || value.length < 2) {
                    showFieldError(field.name, 'Ad soyad en az 2 karakter olmalıdır');
                } else {
                    clearFieldError(field.name);
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value || !emailRegex.test(value)) {
                    showFieldError(field.name, 'Geçerli bir e-posta adresi girin');
                } else {
                    clearFieldError(field.name);
                }
                break;
            case 'subject':
                if (!value || value.length < 3) {
                    showFieldError(field.name, 'Konu en az 3 karakter olmalıdır');
                } else {
                    clearFieldError(field.name);
                }
                break;
            case 'message':
                if (!value || value.length < 10) {
                    showFieldError(field.name, 'Mesaj en az 10 karakter olmalıdır');
                } else {
                    clearFieldError(field.name);
                }
                break;
        }
    }
    
    function showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (field) {
            field.classList.add('error');
            let errorElement = field.parentNode.querySelector('.field-error');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = message;
        }
    }
    
    function clearFieldError(fieldName) {
        const field = typeof fieldName === 'string' ? document.getElementById(fieldName) : fieldName.target;
        if (field) {
            field.classList.remove('error');
            const errorElement = field.parentNode.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }
    
    function clearAllErrors() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
            form.querySelectorAll('.field-error').forEach(error => error.remove());
        }
    }
    
    // Social media link tracking
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const clicks = parseInt(SafeStorage.getItem('social_clicks') || '0') + 1;
            SafeStorage.setItem('social_clicks', clicks.toString());
            
            const platform = this.href.includes('spotify') ? 'spotify' : 
                           this.href.includes('youtube') ? 'youtube' : 
                           this.href.includes('instagram') ? 'instagram' : 'other';
            
            const platformClicks = JSON.parse(SafeStorage.getItem('social_analytics') || '{}');
            platformClicks[platform] = (platformClicks[platform] || 0) + 1;
            SafeStorage.setItem('social_analytics', JSON.stringify(platformClicks));
        });
    });
}

function initializeImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = modal.querySelector('.modal-close');
    
    const galleryImages = document.querySelectorAll('.gallery-item img, .gallery-item .view-btn');
    galleryImages.forEach(element => {
        element.addEventListener('click', function() {
            const galleryItem = this.closest('.gallery-item');
            const img = galleryItem.querySelector('img');
            const title = galleryItem.querySelector('h4').textContent;
            
            modalImage.src = img.src;
            modalImage.alt = title;
            modalCaption.textContent = title;
            modal.style.display = 'flex';
            
            // Add fade in animation
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        });
    });
    
    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
}

function initializeScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
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

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Performance tracking
let startTime = Date.now();
window.addEventListener('load', function() {
    const loadTime = Date.now() - startTime;
    SafeStorage.setItem('last_load_time', loadTime.toString());
});

// Time tracking
let timeSpent = 0;
let lastActive = Date.now();

setInterval(() => {
    if (document.visibilityState === 'visible') {
        timeSpent += Date.now() - lastActive;
        lastActive = Date.now();
    }
}, 1000);

window.addEventListener('beforeunload', function() {
    const totalTime = parseInt(SafeStorage.getItem('total_time_spent') || '0') + timeSpent;
    SafeStorage.setItem('total_time_spent', totalTime.toString());
});

// Version check and cache management
const currentVersion = '1.2.0';
function checkVersion() {
    const storedVersion = SafeStorage.getItem('site_version');
    if (storedVersion !== currentVersion) {
        SafeStorage.setItem('site_version', currentVersion);
        
        if (storedVersion) {
            console.log('🔄 Site updated to version ' + currentVersion);
        }
    }
}

// Clear old cache data
function clearOldCache() {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const lastClear = SafeStorage.getItem('last_cache_clear');
    
    if (!lastClear || parseInt(lastClear) < oneWeekAgo) {
        // Clear localStorage except user settings
        const allKeys = Object.keys(localStorage);
        const keepKeys = ['site_version', 'user_preferences', 'form_submissions', 'uploadedMusic', 'uploadedGallery'];
        
        allKeys.forEach(key => {
            if (!keepKeys.includes(key)) {
                localStorage.removeItem(key);
            }
        });
        
        SafeStorage.setItem('last_cache_clear', Date.now().toString());
        console.log('🧹 Cache cleared');
    }
}

// Content management functions
function updateContentFromAdmin() {
    const englishText = SafeStorage.getItem('about_text_en');
    const heroTitle = SafeStorage.getItem('hero_title');
    const heroDescription = SafeStorage.getItem('hero_description');
    const email = SafeStorage.getItem('contact_email');
    const phone = SafeStorage.getItem('contact_phone');
    const location = SafeStorage.getItem('contact_location');
    const spotify = SafeStorage.getItem('social_spotify');
    const youtube = SafeStorage.getItem('social_youtube');
    const instagram = SafeStorage.getItem('social_instagram');
    const siteTitle = SafeStorage.getItem('site_title');
    const siteDescription = SafeStorage.getItem('site_description');
    
    if (englishText) {
        const aboutTexts = document.querySelectorAll('.about-text');
        aboutTexts.forEach(text => {
            text.innerHTML = englishText.replace(/\n/g, '<br>');
        });
    }
    
    if (heroTitle) {
        const heroTitles = document.querySelectorAll('.hero-title');
        heroTitles.forEach(title => title.textContent = heroTitle);
    }
    
    if (heroDescription) {
        const heroDescs = document.querySelectorAll('.hero-description');
        heroDescs.forEach(desc => desc.textContent = heroDescription);
    }
    
    if (siteTitle) {
        document.title = siteTitle;
        const titleElements = document.querySelectorAll('.site-title');
        titleElements.forEach(el => el.textContent = siteTitle);
    }
}

// Add music to main site from admin
function addMusicToMainSite(musicData) {
    const musicGrid = document.querySelector('.music-grid');
    if (!musicGrid) return;
    
    const musicCard = document.createElement('div');
    musicCard.className = 'music-card uploaded-music';
    musicCard.dataset.src = musicData.audioUrl || '#';
    
    musicCard.innerHTML = `
        <div class="card-image">
            <img src="${musicData.albumCover || 'https://via.placeholder.com/300x300/6c5ce7/ffffff?text=Album+Cover'}" alt="${musicData.title}">
            <div class="play-overlay">
                <i class="fas fa-play"></i>
            </div>
        </div>
        <div class="card-content">
            <h4>${musicData.title}</h4>
            <p>${musicData.genre || 'Unknown'} • ${musicData.artist || 'Artist'}</p>
            <div class="card-duration">${musicData.duration || '0:00'}</div>
        </div>
    `;
    
    // Add event listeners
    const playOverlay = musicCard.querySelector('.play-overlay');
    if (playOverlay) {
        playOverlay.addEventListener('click', () => {
            if (window.musicPlayer && musicData.audioUrl) {
                window.musicPlayer.loadTrack(musicData.audioUrl, musicData.title);
            }
        });
    }
    
    musicGrid.appendChild(musicCard);
    console.log('✅ Music added to main site:', musicData.title);
}

// Add gallery item to main site from admin
function addImageToMainSite(galleryData) {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item uploaded-gallery';
    galleryItem.dataset.category = galleryData.category || 'general';
    
    galleryItem.innerHTML = `
        <img src="${galleryData.imageUrl}" alt="${galleryData.title}">
        <div class="gallery-overlay">
            <h4>${galleryData.title}</h4>
            <p>${galleryData.description}</p>
            <button class="view-btn">
                <i class="fas fa-eye"></i>
            </button>
        </div>
    `;
    
    // Add event listeners
    const viewBtn = galleryItem.querySelector('.view-btn');
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            openImageModal(galleryData.imageUrl, galleryData.title);
        });
    }
    
    galleryGrid.appendChild(galleryItem);
    console.log('✅ Image added to main site:', galleryData.title);
}

// Load admin panel uploaded content to main site
function loadDynamicContent() {
    try {
        loadUploadedMusic();
        loadUploadedGallery();
        loadContentFromAdmin();
        checkVersion();
        clearOldCache();
        console.log('🔄 Dynamic content loaded from admin panel');
    } catch (error) {
        console.error('Error loading dynamic content:', error);
    }
}

function loadUploadedMusic() {
    try {
        // Load music from both old and new admin panel using safe storage
        const uploadedMusic = [
            ...JSON.parse(SafeStorage.getItem('uploadedMusic') || '[]'),
            ...JSON.parse(SafeStorage.getItem('music_catalog') || '[]')
        ];
        const musicGrid = document.querySelector('.music-grid');
        
        if (!musicGrid || uploadedMusic.length === 0) return;
        
        uploadedMusic.forEach(music => {
            const musicCard = document.createElement('div');
            musicCard.className = 'music-card uploaded-music';
            musicCard.dataset.src = music.audioUrl || '#';
            
            musicCard.innerHTML = `
                <div class="card-image">
                    <img src="${music.albumCover || 'https://via.placeholder.com/300x300/6c5ce7/ffffff?text=Album+Cover'}" alt="${music.title}">
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="card-content">
                    <h4>${music.title}</h4>
                    <p>${music.genre || 'Bilinmeyen'} • ${music.artist || 'Sanatçı'}</p>
                    <div class="card-duration">${music.duration || '0:00'}</div>
                </div>
            `;
            
            // Add event listeners for play functionality
            const playOverlay = musicCard.querySelector('.play-overlay');
            if (playOverlay) {
                playOverlay.addEventListener('click', () => {
                    // Trigger music player if available
                    if (window.musicPlayer && music.audioUrl) {
                        window.musicPlayer.loadTrack(music.audioUrl, music.title);
                    }
                });
            }
            
            musicGrid.appendChild(musicCard);
        });
        
        console.log(`✅ Loaded ${uploadedMusic.length} uploaded music tracks`);
    } catch (error) {
        console.error('Error loading uploaded music:', error);
    }
}

function loadUploadedGallery() {
    try {
        // Load gallery from both old and new admin panel
        const uploadedGallery = [
            ...JSON.parse(SafeStorage.getItem('uploadedGallery') || '[]'),
            ...JSON.parse(SafeStorage.getItem('media_gallery') || '[]')
        ];
        const galleryGrid = document.querySelector('.gallery-grid');
        
        if (!galleryGrid || uploadedGallery.length === 0) return;
        
        uploadedGallery.forEach(gallery => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item uploaded-gallery';
            galleryItem.dataset.category = gallery.category || 'general';
            
            galleryItem.innerHTML = `
                <img src="${gallery.imageUrl}" alt="${gallery.title}">
                <div class="gallery-overlay">
                    <h4>${gallery.title}</h4>
                    <p>${gallery.description}</p>
                    <button class="view-btn">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            `;
            
            // Add event listeners for view functionality
            const viewBtn = galleryItem.querySelector('.view-btn');
            if (viewBtn) {
                viewBtn.addEventListener('click', () => {
                    openImageModal(gallery.imageUrl, gallery.title);
                });
            }
            
            galleryGrid.appendChild(galleryItem);
        });
        
        console.log(`✅ Loaded ${uploadedGallery.length} uploaded gallery items`);
    } catch (error) {
        console.error('Error loading uploaded gallery:', error);
    }
}

function loadContentFromAdmin() {
    try {
        // Load about text
        const aboutTextEn = SafeStorage.getItem('about_text_en');
        const aboutTextTr = SafeStorage.getItem('about_text_tr');
        
        if (aboutTextEn) {
            const aboutSection = document.querySelector('#about .about-text');
            if (aboutSection) {
                aboutSection.innerHTML = `<p>${aboutTextEn}</p>`;
            }
        }
        
        // Load hero content
        const heroTitle = SafeStorage.getItem('hero_title');
        const heroSubtitle = SafeStorage.getItem('hero_subtitle');
        const heroDescription = SafeStorage.getItem('hero_description');
        
        if (heroTitle) {
            const titleElement = document.querySelector('.hero-title');
            if (titleElement) titleElement.textContent = heroTitle;
        }
        
        if (heroSubtitle) {
            const subtitleElement = document.querySelector('.hero-subtitle');
            if (subtitleElement) subtitleElement.textContent = heroSubtitle;
        }
        
        if (heroDescription) {
            const descElement = document.querySelector('.hero-description');
            if (descElement) descElement.textContent = heroDescription;
        }
        
        // Load contact info
        const email = SafeStorage.getItem('contact_email');
        const phone = SafeStorage.getItem('contact_phone');
        const location = SafeStorage.getItem('contact_location');
        
        if (email) {
            const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
            emailLinks.forEach(link => link.href = `mailto:${email}`);
        }
        
        // Load social media links
        const spotify = SafeStorage.getItem('social_spotify');
        const youtube = SafeStorage.getItem('social_youtube');
        const instagram = SafeStorage.getItem('social_instagram');
        
        if (spotify) {
            const spotifyLinks = document.querySelectorAll('.social-link[href*="spotify"]');
            spotifyLinks.forEach(link => link.href = spotify);
        }
        
        if (youtube) {
            const youtubeLinks = document.querySelectorAll('.social-link[href*="youtube"]');
            youtubeLinks.forEach(link => link.href = youtube);
        }
        
        if (instagram) {
            const instagramLinks = document.querySelectorAll('.social-link[href*="instagram"]');
            instagramLinks.forEach(link => link.href = instagram);
        }
        
        console.log('✅ Content loaded from admin panel');
    } catch (error) {
        console.error('Error loading content from admin:', error);
    }
}

function openImageModal(imageSrc, title) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    if (modal && modalImage) {
        modalImage.src = imageSrc;
        modalImage.alt = title;
        if (modalCaption) modalCaption.textContent = title;
        modal.style.display = 'flex';
        
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}

console.log('%c🎵 Müzik Portföyü', 'color: #6c5ce7; font-size: 20px; font-weight: bold;');
console.log('%cTüm sistemler aktif ve hazır!', 'color: #00cec9; font-size: 14px;');
console.log('%c🔄 Admin panel senkronizasyonu aktif!', 'color: #fdcb6e; font-size: 12px;');