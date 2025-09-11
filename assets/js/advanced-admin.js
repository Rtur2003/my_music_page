// ===============================================
// ADVANCED ADMIN SYSTEM - SIMPLIFIED & POWERFUL
// ===============================================

class AdvancedAdminSystem {
    constructor() {
        this.isAuthenticated = false;
        this.metadataFetcher = new MetadataFetcher();
        this.currentData = {
            albums: [],
            tracks: []
        };
        this.init();
    }

    init() {
        this.loadPersistedData();
        this.checkAuthStatus();
        this.setupEventListeners();
        this.renderContent();
        console.log('🎵 Advanced Admin System initialized');
    }

    // Load persisted data from localStorage/IndexedDB
    loadPersistedData() {
        try {
            const savedAlbums = localStorage.getItem('hasan_arthur_albums');
            const savedTracks = localStorage.getItem('hasan_arthur_tracks');
            
            this.currentData.albums = savedAlbums ? JSON.parse(savedAlbums) : this.getDefaultAlbums();
            this.currentData.tracks = savedTracks ? JSON.parse(savedTracks) : [];
            
            console.log('📚 Loaded data:', {
                albums: this.currentData.albums.length,
                tracks: this.currentData.tracks.length
            });
        } catch (error) {
            console.warn('Failed to load persisted data:', error);
            this.currentData.albums = this.getDefaultAlbums();
            this.currentData.tracks = [];
        }
    }

    // Get default albums
    getDefaultAlbums() {
        return [
            {
                id: 'echoes-threshold',
                title: 'Echoes of the Threshold',
                year: '2024',
                type: 'EP',
                artwork: 'assets/images/logo-main.png',
                trackCount: 0
            },
            {
                id: 'lumenoria',
                title: 'Lumenoria',
                year: '2024', 
                type: 'EP',
                artwork: 'assets/images/logo-main.png',
                trackCount: 0
            },
            {
                id: 'palgtron',
                title: 'Palgtron',
                year: '2025',
                type: 'EP',
                artwork: 'assets/images/logo-main.png',
                trackCount: 0
            }
        ];
    }

    // Persist data to storage
    persistData() {
        try {
            localStorage.setItem('hasan_arthur_albums', JSON.stringify(this.currentData.albums));
            localStorage.setItem('hasan_arthur_tracks', JSON.stringify(this.currentData.tracks));
            
            // Also sync to main site
            this.syncToMainSite();
            
            console.log('💾 Data persisted successfully');
        } catch (error) {
            console.error('Failed to persist data:', error);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Quick track form (3 URLs only)
        const quickForm = document.getElementById('quickTrackForm');
        if (quickForm) {
            quickForm.addEventListener('submit', (e) => this.handleQuickTrackAdd(e));
        }

        // Album creation form
        const albumForm = document.getElementById('albumForm');
        if (albumForm) {
            albumForm.addEventListener('submit', (e) => this.handleAlbumCreate(e));
        }

        // Sync button
        const syncBtn = document.getElementById('syncNow');
        if (syncBtn) {
            syncBtn.addEventListener('click', () => this.syncToMainSite());
        }
    }

    // Handle admin login
    async handleLogin(e) {
        e.preventDefault();
        
        const keyInput = document.getElementById('adminKey');
        const messageDiv = document.getElementById('loginMessage');
        const enteredKey = keyInput.value.trim();

        if (!enteredKey) {
            this.showLoginMessage('error', 'Please enter admin key');
            return;
        }

        // Check admin key (multiple methods for reliability)
        const isValid = this.validateAdminKey(enteredKey);
        
        if (isValid) {
            this.isAuthenticated = true;
            try {
                sessionStorage.setItem('admin_authenticated', 'true');
            } catch (error) {
                console.log('SessionStorage not available');
            }
            
            this.showDashboard();
            this.showLoginMessage('success', 'Welcome to Admin Panel!');
        } else {
            this.showLoginMessage('error', 'Invalid admin key. Please try again.');
            keyInput.value = '';
            keyInput.focus();
        }
    }

    // Validate admin key
    validateAdminKey(enteredKey) {
        // Primary validation - direct key check
        const validKeys = [
            'MusicPage123',
            'HasanArthur2024',
            'AdminAccess123'
        ];
        
        return validKeys.includes(enteredKey);
    }

    // Show dashboard
    showDashboard() {
        const loginSection = document.getElementById('adminLogin');
        const dashboardSection = document.getElementById('adminDashboard');
        
        if (loginSection) loginSection.style.display = 'none';
        if (dashboardSection) dashboardSection.style.display = 'block';
        
        // Initialize dashboard content
        this.renderContent();
    }

    // Handle logout
    handleLogout() {
        this.isAuthenticated = false;
        try {
            sessionStorage.removeItem('admin_authenticated');
        } catch (error) {
            console.log('SessionStorage not available');
        }
        
        const loginSection = document.getElementById('adminLogin');
        const dashboardSection = document.getElementById('adminDashboard');
        
        if (loginSection) loginSection.style.display = 'block';
        if (dashboardSection) dashboardSection.style.display = 'none';
        
        // Clear login form
        const keyInput = document.getElementById('adminKey');
        if (keyInput) keyInput.value = '';
        
        this.showLoginMessage('info', 'Logged out successfully');
    }

    // Show login message
    showLoginMessage(type, message) {
        const messageDiv = document.getElementById('loginMessage');
        if (!messageDiv) return;

        messageDiv.className = `status-message status-${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;
        messageDiv.style.display = 'block';

        if (type !== 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
    }

    // Handle quick track addition (3 URLs only)
    async handleQuickTrackAdd(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const urls = [
            formData.get('url1')?.trim(),
            formData.get('url2')?.trim(), 
            formData.get('url3')?.trim()
        ].filter(Boolean);

        const albumId = formData.get('albumSelect');
        
        if (urls.length === 0) {
            this.showMessage('error', 'En az bir URL girmelisiniz!');
            return;
        }

        // Show loading
        this.showMessage('info', '🔄 Metadata çekiliyor...');
        
        try {
            // Fetch metadata from URLs
            const metadata = await this.metadataFetcher.fetchTrackMetadata(urls);
            
            // Create track object
            const track = {
                id: this.generateId(),
                albumId: albumId,
                title: metadata.title || 'New Track',
                artist: 'Hasan Arthur Altuntaş',
                duration: metadata.duration || '',
                artwork: metadata.artwork || 'assets/images/logo-main.png',
                platforms: metadata.platforms,
                dateAdded: new Date().toISOString(),
                metadata: metadata.metadata
            };

            // Add to tracks array
            this.currentData.tracks.push(track);
            
            // Update album track count
            const album = this.currentData.albums.find(a => a.id === albumId);
            if (album) {
                album.trackCount = this.currentData.tracks.filter(t => t.albumId === albumId).length;
            }

            // Persist and render
            this.persistData();
            this.renderContent();
            
            this.showMessage('success', `✅ "${track.title}" başarıyla eklendi!`);
            e.target.reset();
            
        } catch (error) {
            console.error('Track add failed:', error);
            this.showMessage('error', '❌ Şarkı eklenirken hata oluştu: ' + error.message);
        }
    }

    // Handle album creation
    handleAlbumCreate(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const album = {
            id: this.generateId(),
            title: formData.get('albumTitle'),
            year: formData.get('albumYear') || new Date().getFullYear().toString(),
            type: formData.get('albumType') || 'EP',
            artwork: formData.get('albumArtwork') || 'assets/images/logo-main.png',
            trackCount: 0
        };

        this.currentData.albums.push(album);
        this.persistData();
        this.renderContent();
        
        this.showMessage('success', `📀 "${album.title}" albümü oluşturuldu!`);
        e.target.reset();
    }

    // Render admin content
    renderContent() {
        this.renderAlbumSelect();
        this.renderTrackList();
        this.renderAlbumList();
        this.updateStats();
    }

    // Render album select dropdown
    renderAlbumSelect() {
        const select = document.getElementById('albumSelect');
        if (!select) return;

        select.innerHTML = '<option value="">Albüm seçin...</option>';
        
        this.currentData.albums.forEach(album => {
            const option = document.createElement('option');
            option.value = album.id;
            option.textContent = `${album.title} (${album.year}) - ${album.trackCount} tracks`;
            select.appendChild(option);
        });
    }

    // Render track list
    renderTrackList() {
        const container = document.getElementById('trackList');
        if (!container) return;

        if (this.currentData.tracks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>Henüz şarkı eklenmedi</p>
                    <p class="text-secondary">Yukarıdaki formu kullanarak şarkı ekleyin</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.currentData.tracks.map(track => {
            const album = this.currentData.albums.find(a => a.id === track.albumId);
            const platformLinks = Object.entries(track.platforms)
                .map(([platform, url]) => `
                    <a href="${url}" target="_blank" class="platform-badge ${platform}">
                        <i class="${this.metadataFetcher.getPlatformIcon(platform)}"></i>
                        ${platform}
                    </a>
                `).join('');

            return `
                <div class="track-card" data-track-id="${track.id}">
                    <div class="track-info">
                        <div class="track-artwork">
                            <img src="${track.artwork}" alt="${track.title}" loading="lazy">
                        </div>
                        <div class="track-details">
                            <h4>${track.title}</h4>
                            <p class="track-artist">${track.artist}</p>
                            <p class="track-album">${album ? album.title : 'Unknown Album'}</p>
                            ${track.duration ? `<p class="track-duration">${track.duration}</p>` : ''}
                            <div class="platform-links">
                                ${platformLinks}
                            </div>
                        </div>
                    </div>
                    <div class="track-actions">
                        <button class="btn-icon edit" onclick="advancedAdmin.editTrack('${track.id}')" title="Düzenle">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="advancedAdmin.deleteTrack('${track.id}')" title="Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render album list with modal functionality
    renderAlbumList() {
        const container = document.getElementById('albumList');
        if (!container) return;

        container.innerHTML = this.currentData.albums.map(album => {
            const tracks = this.currentData.tracks.filter(t => t.albumId === album.id);
            
            return `
                <div class="album-card" data-album-id="${album.id}">
                    <div class="album-artwork">
                        <img src="${album.artwork}" alt="${album.title}" loading="lazy">
                        <div class="album-overlay">
                            <button class="btn-play" onclick="advancedAdmin.showAlbumModal('${album.id}')">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    </div>
                    <div class="album-info">
                        <h4>${album.title}</h4>
                        <p>${album.type} • ${album.year}</p>
                        <p class="track-count">${tracks.length} tracks</p>
                    </div>
                    <div class="album-actions">
                        <button class="btn-icon edit" onclick="advancedAdmin.editAlbum('${album.id}')" title="Düzenle">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="advancedAdmin.deleteAlbum('${album.id}')" title="Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Show album modal with tracks
    showAlbumModal(albumId) {
        const album = this.currentData.albums.find(a => a.id === albumId);
        const tracks = this.currentData.tracks.filter(t => t.albumId === albumId);
        
        if (!album) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content album-modal">
                <div class="modal-header">
                    <h3>${album.title}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="album-details">
                        <img src="${album.artwork}" alt="${album.title}" class="album-cover">
                        <div class="album-meta">
                            <p><strong>Type:</strong> ${album.type}</p>
                            <p><strong>Year:</strong> ${album.year}</p>
                            <p><strong>Tracks:</strong> ${tracks.length}</p>
                        </div>
                    </div>
                    <div class="track-listing">
                        <h4>Tracks</h4>
                        ${tracks.length === 0 ? 
                            '<p class="empty-state">Bu albümde henüz şarkı yok</p>' :
                            tracks.map((track, index) => `
                                <div class="track-item">
                                    <span class="track-number">${index + 1}</span>
                                    <span class="track-title">${track.title}</span>
                                    <span class="track-duration">${track.duration || '--:--'}</span>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Update statistics
    updateStats() {
        const totalTracksEl = document.getElementById('totalTracks');
        const totalAlbumsEl = document.getElementById('totalAlbums');
        
        if (totalTracksEl) {
            totalTracksEl.textContent = this.currentData.tracks.length;
        }
        if (totalAlbumsEl) {
            totalAlbumsEl.textContent = this.currentData.albums.length;
        }
    }

    // Sync to main site
    syncToMainSite() {
        try {
            // Save to localStorage for main site to pick up
            localStorage.setItem('music_data_live', JSON.stringify({
                albums: this.currentData.albums,
                tracks: this.currentData.tracks,
                lastUpdate: new Date().toISOString()
            }));

            // Dispatch custom event for real-time updates
            window.dispatchEvent(new CustomEvent('musicDataUpdated', {
                detail: this.currentData
            }));

            this.showMessage('success', '🔄 Ana siteye senkronize edildi!');
            console.log('🔄 Data synced to main site');
        } catch (error) {
            console.error('Sync failed:', error);
            this.showMessage('error', 'Senkronizasyon hatası: ' + error.message);
        }
    }

    // Utility functions
    generateId() {
        return 'track_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    showMessage(type, message) {
        const messageContainer = document.getElementById('adminMessage') || document.getElementById('musicMessage');
        if (!messageContainer) return;

        messageContainer.className = `status-message status-${type}`;
        messageContainer.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;
        messageContainer.style.display = 'block';

        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    }

    // Delete functions
    deleteTrack(trackId) {
        if (confirm('Bu şarkıyı silmek istediğinizden emin misiniz?')) {
            this.currentData.tracks = this.currentData.tracks.filter(t => t.id !== trackId);
            
            // Update album track counts
            this.currentData.albums.forEach(album => {
                album.trackCount = this.currentData.tracks.filter(t => t.albumId === album.id).length;
            });
            
            this.persistData();
            this.renderContent();
            this.showMessage('success', '✅ Şarkı silindi');
        }
    }

    deleteAlbum(albumId) {
        const album = this.currentData.albums.find(a => a.id === albumId);
        const trackCount = this.currentData.tracks.filter(t => t.albumId === albumId).length;
        
        if (trackCount > 0) {
            if (!confirm(`"${album.title}" albümünde ${trackCount} şarkı var. Albümü ve tüm şarkıları silmek istediğinizden emin misiniz?`)) {
                return;
            }
            // Delete all tracks in this album
            this.currentData.tracks = this.currentData.tracks.filter(t => t.albumId !== albumId);
        }
        
        // Delete album
        this.currentData.albums = this.currentData.albums.filter(a => a.id !== albumId);
        
        this.persistData();
        this.renderContent();
        this.showMessage('success', '✅ Albüm silindi');
    }

    // Auth check
    checkAuthStatus() {
        try {
            const adminSession = sessionStorage.getItem('admin_authenticated');
            this.isAuthenticated = adminSession === 'true';
        } catch (error) {
            this.isAuthenticated = false;
        }
    }
}

// Initialize when DOM is ready
let advancedAdmin;
document.addEventListener('DOMContentLoaded', () => {
    if (typeof MetadataFetcher !== 'undefined') {
        advancedAdmin = new AdvancedAdminSystem();
        window.advancedAdmin = advancedAdmin;
    } else {
        console.error('MetadataFetcher not found. Please ensure metadata-fetcher.js is loaded first.');
    }
});

export default AdvancedAdminSystem;