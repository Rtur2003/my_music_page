// Main JavaScript - Modular Architecture
// Hasan Arthur Altuntaş Music Portfolio

// Import utility modules (these would be loaded via script tags in HTML)
// Utils: SafeStorage, PerformanceUtils
// Components: NavigationHandler, PageLoader, AnimationController

// Main Application Controller
class MusicPortfolio {
    constructor() {
        this.isInitialized = false;
        this.components = {};
        this.musicCatalog = [];
        this.galleryItems = [];
        
        this.init();
    }
    
    async init() {
        try {
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initialize());
            } else {
                this.initialize();
            }
        } catch (error) {
            console.error('🚨 Portfolio initialization error:', error);
        }
    }
    
    initialize() {
        console.log('🎵 Music Portfolio Loading...');
        
        // Load saved data
        this.loadSavedData();
        
        // Initialize components
        this.initializeComponents();
        
        // Setup event handlers
        this.bindGlobalEvents();
        
        // Load content
        this.loadContent();
        
        this.isInitialized = true;
        console.log('✅ Music Portfolio Initialized');
        
        // Dispatch ready event
        window.dispatchEvent(new CustomEvent('portfolioReady'));
    }
    
    loadSavedData() {
        try {
            // Load music catalog
            const savedMusic = SafeStorage.getItem('music_catalog');
            this.musicCatalog = savedMusic ? JSON.parse(savedMusic) : [];
            
            // Load gallery items
            const savedGallery = SafeStorage.getItem('media_gallery');
            this.galleryItems = savedGallery ? JSON.parse(savedGallery) : [];
            
            console.log(`📀 Loaded ${this.musicCatalog.length} music tracks`);
            console.log(`🖼️ Loaded ${this.galleryItems.length} gallery items`);
        } catch (error) {
            console.error('⚠️ Error loading saved data:', error);
            this.musicCatalog = [];
            this.galleryItems = [];
        }
    }
    
    initializeComponents() {
        // Music player is handled separately in music-player.js
        this.setupMusicSection();
        this.setupGallerySection();
        this.setupContactForm();
        this.setupSoftwareSection();
    }
    
    setupMusicSection() {
        this.displayMusicCatalog();
        this.updatePlayerInterface();
    }
    
    displayMusicCatalog() {
        const musicGrid = document.getElementById('musicGrid');
        if (!musicGrid) return;
        
        if (this.musicCatalog.length === 0) {
            musicGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-music"></i>
                    <h3 data-translate="music.loading">No music has been added yet</h3>
                    <p>Check back soon for new releases!</p>
                </div>
            `;
            return;
        }
        
        const musicCards = this.musicCatalog.map(track => this.createMusicCard(track)).join('');
        musicGrid.innerHTML = musicCards;
        
        // Apply language translations if language system is available
        if (window.languageSystem) {
            window.languageSystem.applyTranslations();
        }
    }
    
    createMusicCard(track) {
        const coverImage = this.selectBestCover(track);
        
        return `
            <div class="music-card" data-track-id="${track.id}">
                <div class="music-card-image">
                    <img src="${coverImage}" alt="${track.title}" loading="lazy">
                    <div class="music-card-overlay">
                        <button class="play-btn" onclick="musicPlayer.playTrack('${track.id}')">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <div class="music-card-info">
                    <h3 class="music-card-title">${track.title}</h3>
                    <p class="music-card-artist">${track.artist || 'Hasan Arthur Altuntaş'}</p>
                    <p class="music-card-genre">${track.genre || 'Cinematic'}</p>
                </div>
            </div>
        `;
    }
    
    selectBestCover(track) {
        // Smart cover selection logic
        if (track.coverImage && track.coverImage !== 'assets/images/logo-main.png') {
            return track.coverImage;
        }
        
        // Try to get cover from platform links
        const platforms = ['spotify', 'youtube', 'apple', 'soundcloud'];
        for (const platform of platforms) {
            if (track[`${platform}Url`] && track[`${platform}Cover`]) {
                return track[`${platform}Cover`];
            }
        }
        
        // Fallback to default
        return 'assets/images/logo-main.png';
    }
    
    updatePlayerInterface() {
        const trackTitle = document.getElementById('modernTrackTitle');
        const trackArtist = document.getElementById('modernTrackArtist');
        
        if (trackTitle && this.musicCatalog.length > 0) {
            trackTitle.textContent = this.musicCatalog[0].title;
        }
        
        if (trackArtist) {
            trackArtist.textContent = 'Hasan Arthur Altuntaş';
        }
    }
    
    setupGallerySection() {
        this.displayGalleryItems();
        this.setupGalleryFilters();
    }
    
    displayGalleryItems() {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;
        
        if (this.galleryItems.length === 0) {
            galleryGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-images"></i>
                    <h3 data-translate="gallery.loading">No images have been added yet</h3>
                    <p>Gallery will be updated soon with behind-the-scenes content!</p>
                </div>
            `;
            return;
        }
        
        const galleryCards = this.galleryItems.map(item => this.createGalleryCard(item)).join('');
        galleryGrid.innerHTML = galleryCards;
        
        // Apply language translations
        if (window.languageSystem) {
            window.languageSystem.applyTranslations();
        }
    }
    
    createGalleryCard(item) {
        return `
            <div class="gallery-item" data-category="${item.category}">
                <img src="${item.url}" alt="${item.title}" loading="lazy">
                <div class="gallery-overlay">
                    <button class="view-btn" onclick="portfolio.openImageModal('${item.url}', '${item.title}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    setupGalleryFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.filterGallery(filter);
                
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
    
    filterGallery(filter) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            const category = item.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            item.style.display = shouldShow ? 'block' : 'none';
            
            if (shouldShow) {
                item.classList.add('fade-in');
            }
        });
    }
    
    openImageModal(imageUrl, title) {
        const modal = document.getElementById('imageModal');
        const modalImage = modal.querySelector('.modal-image');
        const modalTitle = modal.querySelector('.modal-title');
        
        if (modal && modalImage) {
            modalImage.src = imageUrl;
            modalImage.alt = title;
            
            if (modalTitle) {
                modalTitle.textContent = title;
            }
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmission(contactForm);
        });
    }
    
    setupSoftwareSection() {
        // Update software stats if needed
        this.updateSoftwareStats();
    }
    
    updateSoftwareStats() {
        // This would be updated based on actual project data
        const stats = {
            projects: 5,
            technologies: 8,
            downloads: 1200
        };
        
        // Update DOM elements if they exist
        Object.entries(stats).forEach(([key, value]) => {
            const element = document.querySelector(`[data-stat="${key}"]`);
            if (element) {
                this.animateCounter(element, 0, value, 2000);
            }
        });
    }
    
    animateCounter(element, start, end, duration) {
        const increment = (end - start) / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= end) {
                element.textContent = end;
                clearInterval(timer);
            }
        }, 16);
    }
    
    handleContactSubmission(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span data-translate="contact.sending">Sending...</span>';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            // Reset form
            form.reset();
            
            // Show success message
            this.showNotification('Message sent successfully!', 'success');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
    
    bindGlobalEvents() {
        // Close modal handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') || e.target.classList.contains('modal-close')) {
                this.closeModal();
            }
        });
        
        // Keyboard handlers
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
        
        // Window resize handler
        window.addEventListener('resize', PerformanceUtils.debounce(() => {
            this.handleResize();
        }, 250));
    }
    
    closeModal() {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    handleResize() {
        // Handle responsive adjustments if needed
        console.log('🔄 Window resized');
    }
}

// Initialize the portfolio
const portfolio = new MusicPortfolio();

// Make it globally available
window.portfolio = portfolio;

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicPortfolio;
}