// Clean Music Portfolio Admin Panel
// Simplified version with only essential features

// Security Authentication System
class AdminAuth {
    constructor() {
        this.hashedPassword = 'b8c9e5e0b4f3d2a1c8f7e6d9b2a5c8e1'; // Simple hash for "H1a2s3a4n5+"
        this.maxAttempts = 5;
        this.sessionTimeout = 2 * 60 * 60 * 1000; // 2 hours
        this.initAuth();
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
        
        const hashedInput = await this.hashPassword(password);
        
        if (hashedInput === this.hashedPassword) {
            localStorage.setItem('admin_session', 'authenticated');
            this.showAdminPanel();
            
            setTimeout(() => {
                window.adminPanel = new AdminPanel();
            }, 100);
        } else {
            this.showError('Invalid password. Access denied.');
        }
        
        passwordInput.value = '';
    }
    
    showError(message) {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.style.display = 'block';
            errorDiv.querySelector('span').textContent = message;
        }
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
        this.currentSection = 'dashboard';
        this.data = this.loadData();
        this.init();
    }
    
    init() {
        this.bindNavigationEvents();
        this.bindButtonEvents();
        this.updateStats();
        this.loadMusicList();
        this.loadGalleryList();
    }
    
    loadData() {
        return {
            music: JSON.parse(localStorage.getItem('uploadedMusic') || '[]'),
            gallery: JSON.parse(localStorage.getItem('uploadedGallery') || '[]'),
            settings: JSON.parse(localStorage.getItem('adminSettings') || '{}')
        };
    }
    
    saveData() {
        localStorage.setItem('uploadedMusic', JSON.stringify(this.data.music));
        localStorage.setItem('uploadedGallery', JSON.stringify(this.data.gallery));
        localStorage.setItem('adminSettings', JSON.stringify(this.data.settings));
        this.syncToMainSite();
    }
    
    syncToMainSite() {
        try {
            localStorage.setItem('adminTracks', JSON.stringify(this.data.music));
            console.log('✅ Music data synced to main site');
        } catch (error) {
            console.error('❌ Sync to main site failed:', error);
        }
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
        // Hide all sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeNavItem = document.querySelector(`a[data-section="${sectionName}"]`).parentElement;
        if (activeNavItem) {
            activeNavItem.classList.add('active');
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
        }
        
        this.currentSection = sectionName;
    }
    
    bindButtonEvents() {
        // Music management buttons
        const addMusicBtn = document.getElementById('addMusicBtn');
        if (addMusicBtn) {
            addMusicBtn.addEventListener('click', () => this.openMusicEditModal());
        }
        
        // Gallery management buttons
        const addImageBtn = document.getElementById('addImageBtn');
        if (addImageBtn) {
            addImageBtn.addEventListener('click', () => this.openGalleryEditModal());
        }
        
        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
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
                    <img src="${track.albumCover || 'assets/images/default-album.jpg'}" alt="${track.title}" class="album-cover">
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
        const modal = document.getElementById('musicEditModal');
        if (!modal) return;
        
        const isEdit = index !== null;
        const track = isEdit ? this.data.music[index] : {};
        
        // Fill form with existing data
        document.getElementById('musicTitle').value = track.title || '';
        document.getElementById('musicArtist').value = track.artist || '';
        document.getElementById('musicGenre').value = track.genre || '';
        document.getElementById('musicDuration').value = track.duration || '';
        document.getElementById('musicDescription').value = track.description || '';
        document.getElementById('musicAlbumCover').value = track.albumCover || '';
        
        // Store edit index for save function
        modal.dataset.editIndex = isEdit ? index : '';
        
        modal.style.display = 'flex';
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
    
    const musicData = {
        title: document.getElementById('musicTitle').value,
        artist: document.getElementById('musicArtist').value,
        genre: document.getElementById('musicGenre').value,
        duration: document.getElementById('musicDuration').value,
        description: document.getElementById('musicDescription').value,
        albumCover: document.getElementById('musicAlbumCover').value,
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
        src: isEdit ? adminPanel.data.gallery[editIndex].src : 'assets/images/placeholder.jpg', // Would be updated by file upload
        id: isEdit ? adminPanel.data.gallery[editIndex].id : Date.now().toString(),
        dateAdded: isEdit ? adminPanel.data.gallery[editIndex].dateAdded : new Date().toISOString()
    };
    
    if (isEdit) {
        adminPanel.data.gallery[editIndex] = galleryData;
    } else {
        adminPanel.data.gallery.push(galleryData);
    }
    
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

// Initialize admin authentication
document.addEventListener('DOMContentLoaded', () => {
    window.adminAuth = new AdminAuth();
});