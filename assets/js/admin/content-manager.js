// Admin Content Manager - Kalıcı Veri Sistemi
// Gerçek projede bu veritabanı ile entegre edilmelidir

class ContentManager {
    constructor() {
        this.storageKeys = {
            music: 'music_catalog',
            gallery: 'media_gallery',
            hero: 'hero_content',
            about: 'about_content'
        };
        
        // Hybrid storage system - localStorage + API fallback
        this.storage = null;
        
        this.init();
    }
    
    async init() {
        // Initialize hybrid storage
        await this.initializeStorage();
        
        this.setupMessageListener();
        this.loadInitialContent();
    }
    
    async initializeStorage() {
        try {
            // HybridStorage sistem yüklenene kadar bekle
            if (typeof HybridStorage !== 'undefined') {
                this.storage = new HybridStorage();
                console.log('✅ Hybrid storage initialized');
            } else {
                // Fallback olarak SafeStorage kullan
                this.storage = window.SafeStorage;
                console.log('⚠️ Using SafeStorage fallback');
            }
        } catch (error) {
            console.error('❌ Storage initialization failed:', error);
            this.storage = window.SafeStorage;
        }
    }
    
    // Admin panel'den mesajları dinle
    setupMessageListener() {
        window.addEventListener('message', (event) => {
            if (event.data.type === 'ADMIN_DATA_UPDATED') {
                this.loadInitialContent();
                console.log('✅ İçerik admin panel\'den güncellendi');
            }
        });
    }
    
    // İlk içerik yükleme
    async loadInitialContent() {
        await this.loadMusicContent();
        await this.loadGalleryContent();
        this.loadHeroContent();
        this.loadAboutContent();
    }
    
    // Müzik içeriğini yükle
    async loadMusicContent() {
        try {
            let musicData;
            
            if (this.storage && typeof this.storage.getItem === 'function') {
                musicData = await this.storage.getItem(this.storageKeys.music);
            } else {
                musicData = SafeStorage.getItem(this.storageKeys.music);
            }
            
            const tracks = musicData ? JSON.parse(musicData) : [];
            
            console.log(`🎵 ${tracks.length} müzik parçası yüklendi`);
            
            this.displayMusicTracks(tracks);
            this.updateMusicPlayer(tracks);
            
        } catch (error) {
            console.error('Müzik içeriği yüklenemedi:', error);
            this.displayEmptyMusicState();
        }
    }
    
    // Müzik parçalarını görüntüle
    displayMusicTracks(tracks) {
        const musicGrid = document.getElementById('musicGrid');
        if (!musicGrid) return;
        
        if (tracks.length === 0) {
            this.displayEmptyMusicState();
            return;
        }
        
        const musicCards = tracks.map((track, index) => {
            const coverImage = this.selectBestCover(track);
            const platformLinks = this.generatePlatformLinks(track);
            
            return `
                <div class="music-card animate-on-scroll" data-track-index="${index}">
                    <div class="music-card-image">
                        <img src="${coverImage}" alt="${track.title}" loading="lazy" onerror="this.src='assets/images/logo-main.png'">
                        <div class="music-card-overlay">
                            <button class="play-btn" onclick="contentManager.playTrack(${index})" aria-label="Play ${track.title}">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    </div>
                    <div class="music-card-info">
                        <h3 class="music-card-title">${track.title}</h3>
                        <p class="music-card-artist">${track.artist || 'Hasan Arthur Altuntaş'}</p>
                        <div class="track-metadata">
                            <span class="track-genre">${track.genre || 'Cinematic'}</span>
                            <span class="track-duration">${track.duration || '3:45'}</span>
                        </div>
                        ${track.description ? `<p class="track-description">${track.description}</p>` : ''}
                        ${platformLinks.length > 0 ? `
                            <div class="platform-links">
                                ${platformLinks.join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        musicGrid.innerHTML = musicCards;
        
        // Animasyonları tetikle
        if (window.animationController) {
            window.animationController.setupScrollAnimations();
        }
    }
    
    // En iyi kapak resmini seç
    selectBestCover(track) {
        // Öncelik sırası: custom cover -> platform covers -> default
        if (track.coverImage && track.coverImage !== 'assets/images/logo-main.png') {
            return track.coverImage;
        }
        
        // Platform kapak resimlerini kontrol et
        const platformCovers = [
            track.spotifyCover,
            track.youtubeCover,
            track.appleCover,
            track.soundcloudCover
        ].filter(cover => cover && cover !== 'assets/images/logo-main.png');
        
        return platformCovers.length > 0 ? platformCovers[0] : 'assets/images/logo-main.png';
    }
    
    // Platform linklerini oluştur
    generatePlatformLinks(track) {
        const platforms = [
            { key: 'spotifyUrl', icon: 'fab fa-spotify', class: 'spotify-link', name: 'Spotify' },
            { key: 'youtubeUrl', icon: 'fab fa-youtube', class: 'youtube-link', name: 'YouTube' },
            { key: 'appleUrl', icon: 'fab fa-apple', class: 'apple-link', name: 'Apple Music' },
            { key: 'soundcloudUrl', icon: 'fab fa-soundcloud', class: 'soundcloud-link', name: 'SoundCloud' }
        ];
        
        return platforms
            .filter(platform => track[platform.key])
            .map(platform => `
                <a href="${track[platform.key]}" target="_blank" rel="noopener" 
                   class="platform-link ${platform.class}" 
                   title="${platform.name}'da dinle"
                   aria-label="Listen on ${platform.name}">
                    <i class="${platform.icon}"></i>
                </a>
            `);
    }
    
    // Boş müzik durumunu göster
    displayEmptyMusicState() {
        const musicGrid = document.getElementById('musicGrid');
        if (musicGrid) {
            musicGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-music"></i>
                    <h3 data-translate="music.loading">No music has been added yet</h3>
                    <p>Check back soon for new releases!</p>
                </div>
            `;
        }
    }
    
    // Müzik çaları güncelle
    updateMusicPlayer(tracks) {
        if (tracks.length === 0) return;
        
        const firstTrack = tracks[0];
        const titleEl = document.getElementById('modernTrackTitle');
        const artistEl = document.getElementById('modernTrackArtist');
        const artworkEl = document.getElementById('currentArtwork');
        const genreEl = document.getElementById('trackGenre');
        const durationEl = document.getElementById('trackDuration');
        
        if (titleEl) titleEl.textContent = firstTrack.title;
        if (artistEl) artistEl.textContent = firstTrack.artist || 'Hasan Arthur Altuntaş';
        if (genreEl) genreEl.textContent = firstTrack.genre || 'Cinematic';
        if (durationEl) durationEl.textContent = firstTrack.duration || '3:45';
        
        if (artworkEl) {
            const cover = this.selectBestCover(firstTrack);
            artworkEl.src = cover;
            artworkEl.alt = firstTrack.title;
        }
        
        // Platform linklerini güncelle
        this.updatePlatformLinks(firstTrack);
    }
    
    // Platform linklerini güncelle
    updatePlatformLinks(track) {
        const linkMap = {
            spotifyLink: track.spotifyUrl,
            youtubeLink: track.youtubeUrl,
            appleLink: track.appleUrl,
            soundcloudLink: track.soundcloudUrl
        };
        
        Object.entries(linkMap).forEach(([elementId, url]) => {
            const element = document.getElementById(elementId);
            if (element) {
                if (url) {
                    element.href = url;
                    element.style.display = 'flex';
                } else {
                    element.style.display = 'none';
                }
            }
        });
    }
    
    // Parça çal
    async playTrack(index) {
        let musicData;
        
        if (this.storage && typeof this.storage.getItem === 'function') {
            musicData = await this.storage.getItem(this.storageKeys.music);
        } else {
            musicData = SafeStorage.getItem(this.storageKeys.music);
        }
        
        const tracks = musicData ? JSON.parse(musicData) : [];
        
        if (tracks[index]) {
            const track = tracks[index];
            this.updateMusicPlayer([track, ...tracks.slice(0, index), ...tracks.slice(index + 1)]);
            
            // Müzik çalar modülü ile entegrasyon
            if (window.musicPlayer) {
                window.musicPlayer.loadTrack(track);
            }
            
            console.log(`🎵 Çalınıyor: ${track.title} - ${track.artist}`);
        }
    }
    
    // Galeri içeriğini yükle
    async loadGalleryContent() {
        try {
            let galleryData;
            
            if (this.storage && typeof this.storage.getItem === 'function') {
                galleryData = await this.storage.getItem(this.storageKeys.gallery);
            } else {
                galleryData = SafeStorage.getItem(this.storageKeys.gallery);
            }
            
            const items = galleryData ? JSON.parse(galleryData) : [];
            
            console.log(`🖼️ ${items.length} galeri öğesi yüklendi`);
            this.displayGalleryItems(items);
            
        } catch (error) {
            console.error('Galeri içeriği yüklenemedi:', error);
            this.displayEmptyGalleryState();
        }
    }
    
    // Galeri öğelerini görüntüle
    displayGalleryItems(items) {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;
        
        if (items.length === 0) {
            this.displayEmptyGalleryState();
            return;
        }
        
        const galleryCards = items.map(item => `
            <div class="gallery-item animate-on-scroll" data-category="${item.category}">
                <img src="${item.url}" alt="${item.title}" loading="lazy">
                <div class="gallery-overlay">
                    <button class="view-btn" onclick="contentManager.openImage('${item.url}', '${item.title}')" aria-label="View ${item.title}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <div class="gallery-info">
                        <h3>${item.title}</h3>
                        <p>${item.description || ''}</p>
                        <span class="category-tag">${item.category}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        galleryGrid.innerHTML = galleryCards;
        
        // Galeri filtrelerini güncelle
        this.updateGalleryFilters(items);
    }
    
    // Galeri filtrelerini güncelle
    updateGalleryFilters(items) {
        const categories = [...new Set(items.map(item => item.category))];
        const filterContainer = document.querySelector('.gallery-filter');
        
        if (filterContainer && categories.length > 0) {
            const filterButtons = [
                '<button class="filter-btn active" data-filter="all" data-translate="gallery.all">All</button>',
                ...categories.map(cat => `
                    <button class="filter-btn" data-filter="${cat}">
                        ${this.getCategoryDisplayName(cat)}
                    </button>
                `)
            ].join('');
            
            filterContainer.innerHTML = filterButtons;
            
            // Filter event listeners
            filterContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    this.filterGallery(e.target.dataset.filter);
                    
                    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                }
            });
        }
    }
    
    // Kategori görünen adını al
    getCategoryDisplayName(category) {
        const categoryMap = {
            'studio': 'Studio Work',
            'live': 'Live Performance', 
            'behind-scenes': 'Behind Scenes',
            'portrait': 'Portrait'
        };
        
        return categoryMap[category] || category;
    }
    
    // Galeri filtreleme
    filterGallery(filter) {
        const items = document.querySelectorAll('.gallery-item');
        
        items.forEach(item => {
            const category = item.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            item.style.display = shouldShow ? 'block' : 'none';
            
            if (shouldShow) {
                item.classList.add('fade-in');
            }
        });
    }
    
    // Boş galeri durumunu göster
    displayEmptyGalleryState() {
        const galleryGrid = document.getElementById('galleryGrid');
        if (galleryGrid) {
            galleryGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-images"></i>
                    <h3 data-translate="gallery.loading">No images have been added yet</h3>
                    <p>Gallery will be updated with behind-the-scenes content soon!</p>
                </div>
            `;
        }
    }
    
    // Resim aç
    openImage(imageUrl, title) {
        if (window.portfolio && window.portfolio.openImageModal) {
            window.portfolio.openImageModal(imageUrl, title);
        }
    }
    
    // Hero içeriğini yükle
    loadHeroContent() {
        const heroData = SafeStorage.getItem(this.storageKeys.hero);
        if (heroData) {
            const content = JSON.parse(heroData);
            
            const titleEl = document.querySelector('[data-translate="hero.title"]');
            const subtitleEl = document.querySelector('[data-translate="hero.subtitle"]');
            const descriptionEl = document.querySelector('[data-translate="hero.description"]');
            
            if (titleEl && content.title) titleEl.textContent = content.title;
            if (subtitleEl && content.subtitle) subtitleEl.textContent = content.subtitle;
            if (descriptionEl && content.description) descriptionEl.textContent = content.description;
        }
    }
    
    // About içeriğini yükle
    loadAboutContent() {
        const aboutData = SafeStorage.getItem(this.storageKeys.about);
        if (aboutData) {
            const content = JSON.parse(aboutData);
            
            const textEl = document.querySelector('[data-translate="about.text"]');
            if (textEl && content.text) {
                textEl.textContent = content.text;
            }
        }
    }
    
    // İçerik güncelleme (admin panel için)
    updateContent(type, data) {
        try {
            const key = this.storageKeys[type];
            if (key) {
                SafeStorage.setItem(key, JSON.stringify(data));
                
                // İlgili içeriği yeniden yükle
                switch (type) {
                    case 'music':
                        this.loadMusicContent();
                        break;
                    case 'gallery':
                        this.loadGalleryContent();
                        break;
                    case 'hero':
                        this.loadHeroContent();
                        break;
                    case 'about':
                        this.loadAboutContent();
                        break;
                }
                
                console.log(`✅ ${type} içeriği güncellendi`);
                return true;
            }
        } catch (error) {
            console.error(`❌ ${type} içeriği güncellenemedi:`, error);
            return false;
        }
    }
}

// Global olarak kullanılabilir hale getir
window.ContentManager = ContentManager;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.contentManager = new ContentManager();
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentManager;
}