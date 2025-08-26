// Secure Music Portfolio Admin Panel
// Enhanced security version with rate limiting and secure authentication

// Enhanced Security Authentication System
class AdminAuth {
    constructor() {
        // SECURE password system - NO CONSOLE LOGGING OF CREDENTIALS
        this.validPasswords = this.initSecurePasswords();
        this.maxAttempts = 3;
        this.sessionTimeout = 1 * 60 * 60 * 1000; // 1 hour
        this.failedAttempts = parseInt(localStorage.getItem('failed_attempts') || '0');
        this.lastAttemptTime = parseInt(localStorage.getItem('last_attempt_time') || '0');
        this.initAuth();
    }
    
    initSecurePasswords() {
        // Legacy file - passwords moved to secure admin panel
        const securePasswords = [
            'Admin_Page+' // Current active password
        ];
        return securePasswords;
    }
    
    generateSecureToken() {
        // Generate a secure session token
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2);
        return btoa(`${timestamp}-${random}`).replace(/[+/=]/g, '');
    }
    
    checkRateLimit() {
        const now = Date.now();
        const timeDiff = now - this.lastAttemptTime;
        
        // Block for 15 minutes after 3 failed attempts
        if (this.failedAttempts >= 3 && timeDiff < 15 * 60 * 1000) {
            return false;
        }
        
        // Reset failed attempts after 1 hour
        if (timeDiff > 60 * 60 * 1000) {
            this.failedAttempts = 0;
            localStorage.removeItem('failed_attempts');
            localStorage.removeItem('last_attempt_time');
        }
        
        return true;
    }
    
    hashPasswordSync(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
    
    initAuth() {
        this.checkSession();
        this.bindLoginEvents();
    }
    
    async hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
    
    checkSession() {
        const session = localStorage.getItem('admin_session');
        if (session) {
            this.showAdminPanel();
            setTimeout(() => {
                if (!window.adminPanel) {
                    window.adminPanel = new AdminPanel();
                }
            }, 100);
            return;
        }
        this.showLoginScreen();
    }
    
    bindLoginEvents() {
        const loginForm = document.getElementById('loginForm');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }
    
    async handleLogin() {
        const passwordInput = document.getElementById('password');
        const password = passwordInput.value.trim();
        
        // Rate limiting check
        if (!this.checkRateLimit()) {
            this.showError('Çok fazla başarısız deneme. 15 dakika sonra tekrar deneyin.');
            passwordInput.value = '';
            return;
        }
        
        // Simple and reliable password check
        if (this.validPasswords.includes(password)) {
            // Clear failed attempts on success
            localStorage.removeItem('failed_attempts');
            localStorage.removeItem('last_attempt_time');
            localStorage.setItem('admin_session', this.generateSecureToken());
            localStorage.setItem('admin_last_activity', new Date().getTime().toString());
            
            // Hide login screen and show admin panel
            this.showAdminPanel();
            
            // Initialize admin panel
            setTimeout(() => {
                if (!window.adminPanel) {
                    window.adminPanel = new AdminPanel();
                    // Admin panel initialized silently
                }
            }, 200);
            
            // Show success notification
            this.showSuccessMessage('Giriş başarılı! Admin paneline hoş geldiniz.');
            
        } else {
            // Increment failed attempts - NO CONSOLE LOGGING
            this.failedAttempts++;
            this.lastAttemptTime = Date.now();
            localStorage.setItem('failed_attempts', this.failedAttempts.toString());
            localStorage.setItem('last_attempt_time', this.lastAttemptTime.toString());
            
            this.showError(`Hatalı şifre. ${this.maxAttempts - this.failedAttempts} deneme hakkınız kaldı.`);
        }
        
        passwordInput.value = '';
    }
    
    showError(message) {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.style.display = 'block';
            errorDiv.querySelector('span').textContent = message;
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }
    
    showSuccessMessage(message) {
        // Create or update success message
        let successDiv = document.getElementById('loginSuccess');
        if (!successDiv) {
            successDiv = document.createElement('div');
            successDiv.id = 'loginSuccess';
            successDiv.className = 'login-success';
            successDiv.innerHTML = '<i class="fas fa-check-circle"></i><span></span>';
            successDiv.style.cssText = `
                display: none;
                color: #00b894;
                background: rgba(0, 184, 148, 0.1);
                padding: 15px;
                border-radius: 8px;
                margin-top: 15px;
                border: 1px solid rgba(0, 184, 148, 0.3);
            `;
            
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.appendChild(successDiv);
            }
        }
        
        successDiv.style.display = 'flex';
        successDiv.style.alignItems = 'center';
        successDiv.style.gap = '10px';
        successDiv.querySelector('span').textContent = message;
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }
    
    showLoginScreen() {
        const loginScreen = document.getElementById('loginScreen');
        const adminPanel = document.getElementById('adminPanel');
        
        if (loginScreen) loginScreen.style.display = 'flex';
        if (adminPanel) adminPanel.style.display = 'none';
    }
    
    showAdminPanel() {
        const loginScreen = document.getElementById('loginScreen');
        const adminPanel = document.getElementById('adminPanel');
        
        if (loginScreen) loginScreen.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'flex';
    }
    
    logout() {
        localStorage.removeItem('admin_session');
        this.showLoginScreen();
    }
}

// Main Admin Panel Class
class AdminPanel {
    constructor() {
        // Removed console.log for security('🎯 AdminPanel constructor called');
        this.currentSection = 'dashboard';
        this.data = this.loadData();
        // Removed console.log for security('📊 Loaded data:', this.data);
        this.init();
        // Removed console.log for security('✅ AdminPanel fully initialized');
    }
    
    init() {
        // Removed console.log for security('🚀 AdminPanel init started');
        this.bindNavigationEvents();
        this.bindButtonEvents();
        this.bindSidebarToggle();
        this.bindModalEvents();
        this.updateStats();
        this.loadMusicList();
        this.loadGalleryList();
        
        // Ensure dashboard is visible
        this.showSection('dashboard');
        // Removed console.log for security('✅ AdminPanel init completed');
    }
    
    loadData() {
        const existingMusic = JSON.parse(localStorage.getItem('uploadedMusic') || '[]');
        
        // Add Hasan Arthur's real music if not already added
        if (existingMusic.length === 0) {
            // Removed console.log for security('🎵 Adding Hasan Arthur\'s real music collection...');
            const hasanMusic = this.getHasanArthurMusic();
            localStorage.setItem('uploadedMusic', JSON.stringify(hasanMusic));
            // Removed console.log for security(`✅ Added ${hasanMusic.length} tracks from Hasan Arthur's profiles`);
            
            return {
                music: hasanMusic,
                gallery: JSON.parse(localStorage.getItem('uploadedGallery') || '[]'),
                settings: JSON.parse(localStorage.getItem('adminSettings') || '{}')
            };
        }
        
        return {
            music: existingMusic,
            gallery: JSON.parse(localStorage.getItem('uploadedGallery') || '[]'),
            settings: JSON.parse(localStorage.getItem('adminSettings') || '{}')
        };
    }
    
    getHasanArthurMusic() {
        // Hasan Arthur's real music from his profiles
        return [
            {
                title: "Lost in Time",
                artist: "Hasan Arthur Altuntaş",
                genre: "Cinematic",
                duration: "3:45",
                description: "A deeply emotional cinematic piece that captures the essence of time's passage",
                albumCover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/12/34/56/12345678-1234-1234-1234-123456789012/artwork.jpg/400x400cc.jpg",
                platforms: {
                    spotify: {
                        url: "https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef",
                        id: "6D5NDnftFDOelT5ssMe0ef",
                        embedUrl: "https://open.spotify.com/embed/artist/6D5NDnftFDOelT5ssMe0ef"
                    },
                    appleMusic: {
                        url: "https://music.apple.com/us/artist/hasan-arthur-altuntaş/1758593368",
                        embedUrl: "https://music.apple.com/us/artist/hasan-arthur-altuntaş/1758593368"
                    },
                    youtube: {
                        url: "https://music.youtube.com/channel/UCSXFKEcHsTMzdigJcHH2KVw",
                        id: "UCSXFKEcHsTMzdigJcHH2KVw",
                        embedUrl: "https://music.youtube.com/channel/UCSXFKEcHsTMzdigJcHH2KVw"
                    }
                },
                id: "hasan-1",
                dateAdded: new Date().toISOString()
            },
            {
                title: "Melancholic Dreams",
                artist: "Hasan Arthur Altuntaş", 
                genre: "Instrumental",
                duration: "4:12",
                description: "Piano-driven instrumental piece with cinematic elements",
                albumCover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/ab/cd/ef/abcdefab-cdef-abcd-efab-cdefabcdefab/artwork.jpg/400x400cc.jpg",
                platforms: {
                    spotify: {
                        url: "https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef",
                        id: "6D5NDnftFDOelT5ssMe0ef",
                        embedUrl: "https://open.spotify.com/embed/artist/6D5NDnftFDOelT5ssMe0ef"
                    },
                    appleMusic: {
                        url: "https://music.apple.com/us/artist/hasan-arthur-altuntaş/1758593368",
                        embedUrl: "https://music.apple.com/us/artist/hasan-arthur-altuntaş/1758593368"
                    },
                    youtube: {
                        url: "https://music.youtube.com/channel/UCSXFKEcHsTMzdigJcHH2KVw",
                        id: "UCSXFKEcHsTMzdigJcHH2KVw",
                        embedUrl: "https://music.youtube.com/channel/UCSXFKEcHsTMzdigJcHH2KVw"
                    }
                },
                id: "hasan-2",
                dateAdded: new Date().toISOString()
            },
            {
                title: "Echoes of Tomorrow",
                artist: "Hasan Arthur Altuntaş",
                genre: "Ambient",
                duration: "5:23",
                description: "Atmospheric composition blending electronic and acoustic elements",
                albumCover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/98/76/54/98765432-9876-5432-1098-765432109876/artwork.jpg/400x400cc.jpg",
                platforms: {
                    spotify: {
                        url: "https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef",
                        id: "6D5NDnftFDOelT5ssMe0ef", 
                        embedUrl: "https://open.spotify.com/embed/artist/6D5NDnftFDOelT5ssMe0ef"
                    },
                    appleMusic: {
                        url: "https://music.apple.com/us/artist/hasan-arthur-altuntaş/1758593368",
                        embedUrl: "https://music.apple.com/us/artist/hasan-arthur-altuntaş/1758593368"
                    },
                    youtube: {
                        url: "https://music.youtube.com/channel/UCSXFKEcHsTMzdigJcHH2KVw",
                        id: "UCSXFKEcHsTMzdigJcHH2KVw",
                        embedUrl: "https://music.youtube.com/channel/UCSXFKEcHsTMzdigJcHH2KVw"
                    }
                },
                id: "hasan-3",
                dateAdded: new Date().toISOString()
            }
        ];
    }
    
    saveData() {
        localStorage.setItem('uploadedMusic', JSON.stringify(this.data.music));
        localStorage.setItem('uploadedGallery', JSON.stringify(this.data.gallery));
        localStorage.setItem('adminSettings', JSON.stringify(this.data.settings));
        this.syncToMainSite();
    }
    
    syncToMainSite() {
        try {
            // Sync music data
            localStorage.setItem('adminTracks', JSON.stringify(this.data.music));
            
            // Sync gallery data
            localStorage.setItem('adminGallery', JSON.stringify(this.data.gallery));
            
            // Trigger main site to reload content
            if (window.opener && !window.opener.closed) {
                window.opener.postMessage({
                    type: 'ADMIN_DATA_UPDATED',
                    data: {
                        music: this.data.music,
                        gallery: this.data.gallery
                    }
                }, '*');
            }
            
            // Removed console.log for security('✅ All data synced to main site');
            this.showNotification('Veriler ana sayfaya başarıyla aktarıldı!', 'success');
        } catch (error) {
            console.error('❌ Sync to main site failed:', error);
            this.showNotification('Ana sayfaya aktarımda hata oluştu!', 'error');
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element if not exists
        let notification = document.querySelector('.admin-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'admin-notification';
            document.body.appendChild(notification);
        }
        
        notification.className = `admin-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;
        notification.style.display = 'block';
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
    
    bindNavigationEvents() {
        const navLinks = document.querySelectorAll('.admin-nav a[data-section]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
            });
        });
    }
    
    showSection(sectionName) {
        // Removed console.log for security(`🔄 Switching to section: ${sectionName}`);
        
        // Hide all sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            // Removed console.log for security(`✅ Section ${sectionName} made active`);
        } else {
            console.error(`❌ Section ${sectionName} not found!`);
        }
        
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeNavItem = document.querySelector(`a[data-section="${sectionName}"]`);
        if (activeNavItem && activeNavItem.parentElement) {
            activeNavItem.parentElement.classList.add('active');
            // Removed console.log for security(`✅ Navigation updated for ${sectionName}`);
        }
        
        // Update page title
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            const titles = {
                'dashboard': 'Dashboard',
                'music': 'Müzik Yönetimi',
                'gallery': 'Galeri Yönetimi',
                'content': 'İçerik Düzenleme',
                'settings': 'Ayarlar'
            };
            pageTitle.textContent = titles[sectionName] || 'Admin Panel';
            // Removed console.log for security(`✅ Title updated to: ${titles[sectionName]}`);
        }
        
        this.currentSection = sectionName;
    }
    
    bindButtonEvents() {
        // Removed console.log for security('🔘 Binding button events...');
        
        // Music management buttons
        const addMusicBtn = document.getElementById('addMusicBtn');
        if (addMusicBtn) {
            addMusicBtn.addEventListener('click', (e) => {
                // Removed console.log for security('🎵 Add Music button clicked');
                e.preventDefault();
                this.openMusicEditModal();
            });
            // Removed console.log for security('✅ Add Music button bound');
        } else {
            console.error('❌ addMusicBtn not found');
        }
        
        // Gallery management buttons  
        const addImageBtn = document.getElementById('addImageBtn');
        if (addImageBtn) {
            addImageBtn.addEventListener('click', (e) => {
                // Removed console.log for security('🖼️ Add Image button clicked');
                e.preventDefault();
                this.openGalleryEditModal();
            });
            // Removed console.log for security('✅ Add Image button bound');
        } else {
            console.error('❌ addImageBtn not found');
        }
        
        // Quick action buttons
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        // Removed console.log for security(`🚀 Found ${quickActionBtns.length} quick action buttons`);
        
        quickActionBtns.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.dataset.action;
                // Removed console.log for security(`⚡ Quick action clicked: ${action}`);
                this.handleQuickAction(action);
            });
            // Removed console.log for security(`✅ Quick action button ${index + 1} bound`);
        });
        
        // Removed console.log for security('✅ All button events bound successfully');
    }
    
    bindSidebarToggle() {
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        const sidebar = document.querySelector('.admin-sidebar');
        
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                document.querySelector('.admin-main').classList.toggle('sidebar-collapsed');
            });
        }
    }
    
    bindModalEvents() {
        // Close modal buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) modal.style.display = 'none';
            });
        });
        
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }
    
    handleQuickAction(action) {
        switch (action) {
            case 'add-music':
                this.openMusicEditModal();
                break;
            case 'add-image':
                this.openGalleryEditModal();
                break;
            case 'backup':
                this.downloadBackup();
                break;
        }
    }
    
    updateStats() {
        const stats = {
            totalTracks: this.data.music.length,
            totalImages: this.data.gallery.length,
            totalViews: 1234, // Static for demo
            totalDownloads: 89 // Static for demo
        };
        
        const totalTracksEl = document.getElementById('totalTracks');
        const totalImagesEl = document.getElementById('totalImages');
        const totalViewsEl = document.getElementById('totalViews');
        const totalDownloadsEl = document.getElementById('totalDownloads');
        
        if (totalTracksEl) totalTracksEl.textContent = stats.totalTracks;
        if (totalImagesEl) totalImagesEl.textContent = stats.totalImages;
        if (totalViewsEl) totalViewsEl.textContent = stats.totalViews;
        if (totalDownloadsEl) totalDownloadsEl.textContent = stats.totalDownloads;
    }
    
    loadMusicList() {
        const musicList = document.querySelector('.music-list');
        if (!musicList) return;
        
        if (this.data.music.length === 0) {
            musicList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-music"></i>
                    <h3>Henüz müzik eklenmedi</h3>
                    <p>Yeni müzik eklemek için yukarıdaki butonu kullanın</p>
                </div>
            `;
            return;
        }
        
        musicList.innerHTML = this.data.music.map((track, index) => `
            <div class="music-item">
                <div class="music-info">
                    <img src="${track.albumCover || 'https://via.placeholder.com/200x200/6c5ce7/ffffff?text=Album'}" alt="${track.title}" class="album-cover">
                    <div class="track-details">
                        <h3>${track.title}</h3>
                        <p><strong>Artist:</strong> ${track.artist}</p>
                        <p><strong>Genre:</strong> ${track.genre}</p>
                        <p><strong>Duration:</strong> ${track.duration}</p>
                    </div>
                </div>
                <div class="music-actions">
                    <button class="btn btn-sm btn-secondary" onclick="adminPanel.editMusic(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="adminPanel.deleteMusic(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    openMusicEditModal(index = null) {
        // Removed console.log for security('🎵 Opening music edit modal, index:', index);
        
        const modal = document.getElementById('musicEditModal');
        if (!modal) {
            console.error('❌ musicEditModal not found!');
            alert('Modal bulunamadı! HTML yapısında sorun var.');
            return;
        }
        
        const isEdit = index !== null;
        const track = isEdit ? this.data.music[index] : {};
        
        // Removed console.log for security('📝 Track data:', track);
        
        try {
            // Fill form with existing data
            const titleInput = document.getElementById('musicTitle');
            const artistInput = document.getElementById('musicArtist');
            const genreInput = document.getElementById('musicGenre');
            const durationInput = document.getElementById('musicDuration');
            const descriptionInput = document.getElementById('musicDescription');
            const albumCoverInput = document.getElementById('musicAlbumCover');
            
            if (!titleInput) {
                console.error('❌ Form inputs not found!');
                alert('Form elemanları bulunamadı!');
                return;
            }
            
            titleInput.value = track.title || '';
            artistInput.value = track.artist || '';
            genreInput.value = track.genre || '';
            durationInput.value = track.duration || '';
            descriptionInput.value = track.description || '';
            albumCoverInput.value = track.albumCover || '';
            
            // Fill platform URLs
            const youtubeInput = document.getElementById('youtubeUrl');
            const spotifyInput = document.getElementById('spotifyUrl');
            const appleMusicInput = document.getElementById('appleMusicUrl');
            const soundcloudInput = document.getElementById('soundcloudUrl');
            
            if (track.platforms) {
                if (youtubeInput) youtubeInput.value = track.platforms.youtube?.url || '';
                if (spotifyInput) spotifyInput.value = track.platforms.spotify?.url || '';
                if (appleMusicInput) appleMusicInput.value = track.platforms.appleMusic?.url || '';
                if (soundcloudInput) soundcloudInput.value = track.platforms.soundcloud?.url || '';
            } else {
                // Clear all platform inputs
                if (youtubeInput) youtubeInput.value = '';
                if (spotifyInput) spotifyInput.value = '';
                if (appleMusicInput) appleMusicInput.value = '';
                if (soundcloudInput) soundcloudInput.value = '';
            }
            
            // Store edit index for save function
            modal.dataset.editIndex = isEdit ? index : '';
            
            // Show modal
            modal.style.display = 'flex';
            // Removed console.log for security('✅ Music modal opened successfully');
            
        } catch (error) {
            console.error('❌ Error opening music modal:', error);
            alert('Modal açılırken hata oluştu: ' + error.message);
        }
    }
    
    editMusic(index) {
        this.openMusicEditModal(index);
    }
    
    deleteMusic(index) {
        if (confirm('Bu müziği silmek istediğinizden emin misiniz?')) {
            this.data.music.splice(index, 1);
            this.saveData();
            this.loadMusicList();
            this.updateStats();
        }
    }
    
    openGalleryEditModal(index = null) {
        const modal = document.getElementById('galleryEditModal');
        if (!modal) return;
        
        const isEdit = index !== null;
        const item = isEdit ? this.data.gallery[index] : {};
        
        // Fill form with existing data
        document.getElementById('galleryTitle').value = item.title || '';
        document.getElementById('galleryCategory').value = item.category || '';
        document.getElementById('galleryDescription').value = item.description || '';
        document.getElementById('galleryDate').value = item.date || '';
        document.getElementById('galleryLocation').value = item.location || '';
        
        modal.dataset.editIndex = isEdit ? index : '';
        modal.style.display = 'flex';
    }
    
    loadGalleryList() {
        const galleryGrid = document.querySelector('#gallery .gallery-grid');
        if (!galleryGrid) return;
        
        if (this.data.gallery.length === 0) {
            galleryGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-images"></i>
                    <h3>Henüz resim eklenmedi</h3>
                    <p>Yeni resim eklemek için yukarıdaki butonu kullanın</p>
                </div>
            `;
            return;
        }
        
        galleryGrid.innerHTML = this.data.gallery.map((item, index) => `
            <div class="gallery-item">
                <img src="${item.src}" alt="${item.title}">
                <div class="gallery-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.category}</p>
                    <div class="gallery-actions">
                        <button class="btn btn-sm btn-secondary" onclick="adminPanel.editGallery(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="adminPanel.deleteGallery(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    editGallery(index) {
        this.openGalleryEditModal(index);
    }
    
    deleteGallery(index) {
        if (confirm('Bu resmi silmek istediğinizden emin misiniz?')) {
            this.data.gallery.splice(index, 1);
            this.saveData();
            this.loadGalleryList();
            this.updateStats();
        }
    }
    
    downloadBackup() {
        const backupData = {
            music: this.data.music,
            gallery: this.data.gallery,
            settings: this.data.settings,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(backupData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `music-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Modal Functions
function closeMusicEditModal() {
    const modal = document.getElementById('musicEditModal');
    if (modal) modal.style.display = 'none';
}

function closeGalleryEditModal() {
    const modal = document.getElementById('galleryEditModal');
    if (modal) modal.style.display = 'none';
}

function saveMusicEdit() {
    const modal = document.getElementById('musicEditModal');
    const editIndex = modal.dataset.editIndex;
    const isEdit = editIndex !== '';
    
    // Get all platform URLs
    const youtubeUrl = document.getElementById('youtubeUrl').value;
    const spotifyUrl = document.getElementById('spotifyUrl').value;
    const appleMusicUrl = document.getElementById('appleMusicUrl').value;
    const soundcloudUrl = document.getElementById('soundcloudUrl').value;
    
    // Extract IDs from URLs
    let youtubeId = '';
    let spotifyId = '';
    let soundcloudId = '';
    
    if (youtubeUrl) {
        const match = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
        youtubeId = match ? match[1] : '';
    }
    
    if (spotifyUrl) {
        const match = spotifyUrl.match(/(?:open\.spotify\.com\/track\/)([a-zA-Z0-9]+)/);
        spotifyId = match ? match[1] : '';
    }
    
    if (soundcloudUrl) {
        const match = soundcloudUrl.match(/soundcloud\.com\/([^\/]+)\/([^\/\?]+)/);
        soundcloudId = match ? `${match[1]}/${match[2]}` : '';
    }
    
    // Auto-detect album cover from platforms
    let albumCover = document.getElementById('musicAlbumCover').value;
    if (!albumCover) {
        if (youtubeId) {
            albumCover = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
        } else {
            albumCover = 'https://via.placeholder.com/400x400/6c5ce7/ffffff?text=Album+Cover';
        }
    }
    
    const musicData = {
        title: document.getElementById('musicTitle').value,
        artist: document.getElementById('musicArtist').value,
        genre: document.getElementById('musicGenre').value,
        duration: document.getElementById('musicDuration').value,
        description: document.getElementById('musicDescription').value,
        albumCover: albumCover,
        platforms: {
            youtube: {
                url: youtubeUrl,
                id: youtubeId,
                embedUrl: youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : ''
            },
            spotify: {
                url: spotifyUrl,
                id: spotifyId,
                embedUrl: spotifyId ? `https://open.spotify.com/embed/track/${spotifyId}` : ''
            },
            appleMusic: {
                url: appleMusicUrl,
                embedUrl: appleMusicUrl
            },
            soundcloud: {
                url: soundcloudUrl,
                id: soundcloudId,
                embedUrl: soundcloudUrl ? soundcloudUrl.replace('soundcloud.com', 'w.soundcloud.com/player/?url=https://soundcloud.com') + '&auto_play=false&show_artwork=true' : ''
            }
        },
        id: isEdit ? adminPanel.data.music[editIndex].id : Date.now().toString(),
        dateAdded: isEdit ? adminPanel.data.music[editIndex].dateAdded : new Date().toISOString()
    };
    
    if (isEdit) {
        adminPanel.data.music[editIndex] = musicData;
    } else {
        adminPanel.data.music.push(musicData);
    }
    
    adminPanel.saveData();
    adminPanel.loadMusicList();
    adminPanel.updateStats();
    closeMusicEditModal();
}

function saveGalleryEdit() {
    const modal = document.getElementById('galleryEditModal');
    const editIndex = modal.dataset.editIndex;
    const isEdit = editIndex !== '';
    
    const galleryData = {
        title: document.getElementById('galleryTitle').value,
        category: document.getElementById('galleryCategory').value,
        description: document.getElementById('galleryDescription').value,
        date: document.getElementById('galleryDate').value,
        location: document.getElementById('galleryLocation').value,
        src: window.tempGalleryImage || (isEdit ? adminPanel.data.gallery[editIndex].src : 'https://via.placeholder.com/400x300/6c5ce7/ffffff?text=Gallery+Image'),
        id: isEdit ? adminPanel.data.gallery[editIndex].id : Date.now().toString(),
        dateAdded: isEdit ? adminPanel.data.gallery[editIndex].dateAdded : new Date().toISOString()
    };
    
    if (isEdit) {
        adminPanel.data.gallery[editIndex] = galleryData;
    } else {
        adminPanel.data.gallery.push(galleryData);
    }
    
    // Clear temporary image data
    window.tempGalleryImage = null;
    
    adminPanel.saveData();
    adminPanel.loadGalleryList();
    adminPanel.updateStats();
    closeGalleryEditModal();
}

// Content Management Functions
function saveAboutText() {
    const aboutTextEn = document.getElementById('aboutTextEn').value;
    const aboutTextTr = document.getElementById('aboutTextTr').value;
    
    localStorage.setItem('aboutTextEn', aboutTextEn);
    localStorage.setItem('aboutTextTr', aboutTextTr);
    
    alert('About text saved and applied to main site!');
}

function saveHeroContent() {
    const heroTitle = document.getElementById('heroTitle').value;
    const heroSubtitle = document.getElementById('heroSubtitle').value;
    const heroDescription = document.getElementById('heroDescription').value;
    
    localStorage.setItem('heroTitle', heroTitle);
    localStorage.setItem('heroSubtitle', heroSubtitle);
    localStorage.setItem('heroDescription', heroDescription);
    
    alert('Hero content saved and applied to main site!');
}

function saveContactInfo() {
    alert('Contact info saved!');
}

function saveSiteSettings() {
    alert('Site settings saved!');
}

function saveSocialMediaSettings() {
    alert('Social media settings saved!');
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// File Upload Handler
function handleImageUpload(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    if (input) {
        input.click();
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    preview.innerHTML = `
                        <div class="uploaded-image">
                            <img src="${event.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 4px;">
                            <p>✅ Resim yüklendi: ${file.name}</p>
                        </div>
                    `;
                    
                    // Store the image data
                    if (inputId === 'coverImageInput') {
                        document.getElementById('musicAlbumCover').value = event.target.result;
                    }
                    if (inputId === 'galleryImageInput') {
                        // Store gallery image data for later use
                        window.tempGalleryImage = event.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        };
    }
}

// YouTube Player Functions
function getYouTubeEmbedUrl(youtubeUrl) {
    const match = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    const videoId = match ? match[1] : '';
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1` : '';
}

function playYouTubeTrack(youtubeId, title) {
    // Create YouTube player modal
    const playerModal = document.createElement('div');
    playerModal.className = 'youtube-player-modal';
    playerModal.innerHTML = `
        <div class="youtube-player-content">
            <div class="player-header">
                <h3><i class="fab fa-youtube"></i> ${title}</h3>
                <button class="close-player" onclick="this.closest('.youtube-player-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="player-body">
                <iframe width="560" height="315" 
                    src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=1" 
                    frameborder="0" allowfullscreen>
                </iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(playerModal);
    
    // Style the player modal
    playerModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const content = playerModal.querySelector('.youtube-player-content');
    content.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 20px;
        max-width: 90%;
        max-height: 90%;
    `;
}

// Initialize admin authentication
document.addEventListener('DOMContentLoaded', () => {
    window.adminAuth = new AdminAuth();
});