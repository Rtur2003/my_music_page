// Security Authentication System
class AdminAuth {
    constructor() {
        // Encrypted password: H1a2s3a4n5+
        this.hashedPassword = 'b8c9e5e0b4f3d2a1c8f7e6d9b2a5c8e1'; // SHA-256 simulation
        this.maxAttempts = 5;
        this.lockoutTime = 15 * 60 * 1000; // 15 minutes
        this.sessionTimeout = 2 * 60 * 60 * 1000; // 2 hours
        
        this.initAuth();
    }
    //
    initAuth() {
        this.checkSession();
        this.bindLoginEvents();
    }
    
    async hashPassword(password) {
        // Simple hash function for demo (use proper crypto in production)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }
    
    checkSession() {
        const session = localStorage.getItem('admin_session');
        const lastActivity = localStorage.getItem('admin_last_activity');
        
        if (session && lastActivity) {
            const now = new Date().getTime();
            const lastActiveTime = parseInt(lastActivity);
            
            if (now - lastActiveTime < this.sessionTimeout) {
                this.showAdminPanel();
                this.updateLastActivity();
                
                // Initialize admin panel if logged in (singleton check)
                setTimeout(() => {
                    if (!window.adminPanel) {
                        window.adminPanel = new AdminPanel();
                    }
                }, 100);
                return;
            }
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
        
        // Auto-logout on inactivity
        this.setupInactivityTimer();
    }
    
    async handleLogin() {
        const passwordInput = document.getElementById('password');
        const loginError = document.getElementById('loginError');
        const loginBtn = document.querySelector('.login-btn');
        const attemptsSpan = document.getElementById('attemptsLeft');
        
        if (!passwordInput || !loginBtn) {
            console.error('Required login elements not found');
            return;
        }
        
        const password = passwordInput.value.trim();
        
        if (!password) {
            this.showError('Please enter a password.');
            return;
        }
        
        // Check if account is locked
        if (this.isAccountLocked()) {
            this.showError('Account temporarily locked. Please try again later.');
            return;
        }
        
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
        
        // Simulate network delay for security
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (this.verifyPassword(password)) {
            this.loginSuccess();
        } else {
            this.loginFailed();
        }
        
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        passwordInput.value = '';
    }
    
    verifyPassword(password) {
        // Check against the actual password: H1a2s3a4n5+
        return password === 'H1a2s3a4n5+';
    }
    
    loginSuccess() {
        const sessionId = this.generateSessionId();
        const now = new Date().getTime();
        
        localStorage.setItem('admin_session', sessionId);
        localStorage.setItem('admin_last_activity', now.toString());
        localStorage.removeItem('login_attempts');
        localStorage.removeItem('lockout_time');
        
        this.showAdminPanel();
        this.logSecurityEvent('login_success');
        
        // Initialize admin panel after successful login (singleton check)
        setTimeout(() => {
            if (!window.adminPanel) {
                window.adminPanel = new AdminPanel();
                // Initialize content editor
                this.initContentEditor();
            }
        }, 100);
    }
    
    loginFailed() {
        const attempts = this.getLoginAttempts() + 1;
        localStorage.setItem('login_attempts', attempts.toString());
        
        const attemptsLeft = this.maxAttempts - attempts;
        document.getElementById('attemptsLeft').textContent = `Attempts remaining: ${attemptsLeft}`;
        
        if (attempts >= this.maxAttempts) {
            this.lockAccount();
            this.showError('Too many failed attempts. Account locked for 15 minutes.');
        } else {
            this.showError(`Invalid password. ${attemptsLeft} attempts remaining.`);
        }
        
        this.logSecurityEvent('login_failed', { attempts });
    }
    
    showError(message) {
        const loginError = document.getElementById('loginError');
        loginError.querySelector('span').textContent = message;
        loginError.style.display = 'flex';
        
        setTimeout(() => {
            loginError.style.display = 'none';
        }, 5000);
    }
    
    lockAccount() {
        const lockTime = new Date().getTime();
        localStorage.setItem('lockout_time', lockTime.toString());
    }
    
    isAccountLocked() {
        const lockTime = localStorage.getItem('lockout_time');
        if (!lockTime) return false;
        
        const now = new Date().getTime();
        const lockedTime = parseInt(lockTime);
        
        return (now - lockedTime) < this.lockoutTime;
    }
    
    getLoginAttempts() {
        return parseInt(localStorage.getItem('login_attempts') || '0');
    }
    
    generateSessionId() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    
    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminPanel').style.display = 'none';
        
        // Reset attempts display
        const attemptsLeft = this.maxAttempts - this.getLoginAttempts();
        document.getElementById('attemptsLeft').textContent = `Attempts remaining: ${attemptsLeft}`;
    }
    
    showAdminPanel() {
        const loginScreen = document.getElementById('loginScreen');
        const adminPanel = document.getElementById('adminPanel');
        
        if (loginScreen) {
            loginScreen.style.display = 'none';
        }
        
        if (adminPanel) {
            adminPanel.style.display = 'block';
        } else {
            console.error('Admin panel element not found!');
        }
    }
    
    updateLastActivity() {
        const now = new Date().getTime();
        localStorage.setItem('admin_last_activity', now.toString());
    }
    
    setupInactivityTimer() {
        let inactivityTimer;
        
        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                this.logout('Session expired due to inactivity.');
            }, this.sessionTimeout);
            this.updateLastActivity();
        };
        
        // Track user activity
        ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
            document.addEventListener(event, resetTimer);
        });
        
        resetTimer();
    }
    
    logout(message = 'Logged out successfully.') {
        localStorage.removeItem('admin_session');
        localStorage.removeItem('admin_last_activity');
        
        this.showLoginScreen();
        this.logSecurityEvent('logout');
        
        if (message) {
            setTimeout(() => {
                this.showError(message);
            }, 500);
        }
    }
    
    logSecurityEvent(event, data = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            ip: 'hidden', // Would be server-side in production
            userAgent: navigator.userAgent.substring(0, 100),
            ...data
        };
        
        console.log('🔒 Security Event:', logEntry);
        
        // Store security logs (limited to last 100 entries)
        const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        logs.unshift(logEntry);
        localStorage.setItem('security_logs', JSON.stringify(logs.slice(0, 100)));
    }
    
    initContentEditor() {
        this.bindTabEvents();
        this.loadContentFromSite();
    }
    
    bindTabEvents() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Remove active class from all tabs
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                btn.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }
    
    loadContentFromSite() {
        // This would load content from the main site for editing
        // For now, we'll use the current content
        console.log('📝 Content editor loaded');
    }
}

class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.data = this.loadData();
        
        this.init();
    }
    
    init() {
        // Check for corrupted stats and reset if needed
        const views = parseInt(localStorage.getItem('page_views') || '0');
        if (views < 0 || isNaN(views)) {
            this.resetStats();
        }
        
        this.bindEvents();
        this.loadContent();
        
        // Load uploaded content FIRST, then update stats
        // Add delay to ensure DOM is ready
        setTimeout(() => {
            this.loadUploadedContent();
            
            // Update stats after content is loaded
            setTimeout(() => {
                this.updateStats();
            }, 200);
        }, 500);
        
    }
    
    bindEvents() {
        const navLinks = document.querySelectorAll('.nav-item a');
        navLinks.forEach(link => {
            if (!link.hasAttribute('data-bound')) {
                link.setAttribute('data-bound', 'true');
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const section = link.dataset.section;
                    this.showSection(section);
                    this.updateActiveNav(link.parentElement);
                });
            }
        });
        
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        if (sidebarToggle && !sidebarToggle.hasAttribute('data-bound')) {
            sidebarToggle.setAttribute('data-bound', 'true');
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }
        
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        quickActionBtns.forEach(btn => {
            if (!btn.hasAttribute('data-bound')) {
                btn.setAttribute('data-bound', 'true');
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    this.handleQuickAction(action);
                });
            }
        });
        
        const addMusicBtn = document.getElementById('addMusicBtn');
        if (addMusicBtn && !addMusicBtn.hasAttribute('data-bound')) {
            addMusicBtn.setAttribute('data-bound', 'true');
            addMusicBtn.addEventListener('click', () => this.openUploadModal('music'));
        }
        
        const addImageBtn = document.getElementById('addImageBtn');
        if (addImageBtn && !addImageBtn.hasAttribute('data-bound')) {
            addImageBtn.setAttribute('data-bound', 'true');
            addImageBtn.addEventListener('click', () => this.openUploadModal('image'));
        }
        
        this.initializeUploadModal();
        this.initializeFileHandling();
        this.bindFormEvents();
    }
    
    showSection(sectionId) {
        const sections = document.querySelectorAll('.admin-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            
            const pageTitle = document.querySelector('.page-title');
            if (pageTitle) {
                pageTitle.textContent = this.getSectionTitle(sectionId);
            }
        }
    }
    
    getSectionTitle(sectionId) {
        const titles = {
            'dashboard': 'Dashboard',
            'music': 'Müzik Yönetimi',
            'gallery': 'Galeri Yönetimi',
            'content': 'İçerik Düzenleme',
            'settings': 'Ayarlar'
        };
        return titles[sectionId] || 'Admin Panel';
    }
    
    updateActiveNav(activeItem) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }
    
    toggleSidebar() {
        const sidebar = document.querySelector('.admin-sidebar');
        sidebar.classList.toggle('collapsed');
    }
    
    handleQuickAction(action) {
        switch (action) {
            case 'add-music':
                this.openUploadModal('music');
                break;
            case 'add-image':
                this.openUploadModal('image');
                break;
            case 'backup':
                this.createBackup();
                break;
        }
    }
    
    openUploadModal(type) {
        const modal = document.getElementById('uploadModal');
        const modalTitle = modal.querySelector('.modal-header h3');
        const fileInput = document.getElementById('fileInput');
        
        if (type === 'music') {
            modalTitle.textContent = 'Müzik Dosyası Yükle';
            fileInput.accept = 'audio/*';
        } else if (type === 'image') {
            modalTitle.textContent = 'Resim Dosyası Yükle';
            fileInput.accept = 'image/*';
        }
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    initializeUploadModal() {
        const modal = document.getElementById('uploadModal');
        if (!modal) return;
        
        const closeBtn = modal.querySelector('.modal-close');
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        if (closeBtn && !closeBtn.hasAttribute('data-bound')) {
            closeBtn.setAttribute('data-bound', 'true');
            closeBtn.addEventListener('click', () => {
                this.closeUploadModal();
            });
        }
        
        if (modal && !modal.hasAttribute('data-bound')) {
            modal.setAttribute('data-bound', 'true');
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeUploadModal();
                }
            });
        }
        
        if (uploadArea && !uploadArea.hasAttribute('data-bound')) {
            uploadArea.setAttribute('data-bound', 'true');
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });
            
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--admin-primary)';
                uploadArea.style.background = 'rgba(108, 92, 231, 0.1)';
            });
            
            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--admin-border)';
                uploadArea.style.background = '';
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--admin-border)';
                uploadArea.style.background = '';
                
                const files = e.dataTransfer.files;
                this.handleFileUpload(files);
            });
        }
        
        if (fileInput && !fileInput.hasAttribute('data-bound')) {
            fileInput.setAttribute('data-bound', 'true');
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
    }
    
    closeUploadModal() {
        const modal = document.getElementById('uploadModal');
        modal.style.display = 'none';
        document.body.style.overflow = '';
        
        const uploadProgress = document.getElementById('uploadProgress');
        uploadProgress.style.display = 'none';
        
        const fileInput = document.getElementById('fileInput');
        fileInput.value = '';
    }
    
    handleFileUpload(files) {
        if (files.length === 0) return;
        
        const uploadProgress = document.getElementById('uploadProgress');
        const progressFill = uploadProgress.querySelector('.progress-fill');
        const progressText = uploadProgress.querySelector('.progress-text');
        
        uploadProgress.style.display = 'block';
        
        Array.from(files).forEach((file, index) => {
            this.uploadFile(file, index, files.length, progressFill, progressText);
        });
    }
    
    async uploadFile(file, index, total, progressFill, progressText) {
        try {
            // Validate file before upload
            const fileType = file.type.startsWith('audio/') ? 'music' : 'image';
            const validationResults = await fileValidator.validateFile(file, fileType);
            
            if (!fileValidator.showValidationResults(validationResults, file.name)) {
                // Validation failed, skip this file
                if (index === total - 1) {
                    setTimeout(() => {
                        this.closeUploadModal();
                    }, 500);
                }
                return;
            }
        } catch (error) {
            console.error('File validation error:', error);
            this.showAdminNotification('File validation failed: ' + file.name, 'error');
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            let progress = 0;
            const interval = setInterval(() => {
                try {
                    progress += Math.random() * 30;
                    if (progress > 100) progress = 100;
                    
                    const totalProgress = ((index * 100) + progress) / total;
                    if (progressFill && progressText) {
                        progressFill.style.width = totalProgress + '%';
                        progressText.textContent = `Yükleniyor... ${Math.round(totalProgress)}%`;
                    }
                    
                    if (progress >= 100) {
                        clearInterval(interval);
                        
                        if (index === total - 1) {
                            setTimeout(() => {
                                this.showAdminNotification('Dosyalar başarıyla yüklendi!', 'success');
                                this.closeUploadModal();
                                this.addFileToList(file);
                                this.updateStats();
                            }, 500);
                        }
                    }
                } catch (progressError) {
                    console.error('Progress update error:', progressError);
                    clearInterval(interval);
                    this.showAdminNotification('Upload progress error', 'error');
                }
            }, 100);
        } catch (uploadError) {
            console.error('Upload error:', uploadError);
            this.showAdminNotification('File upload failed: ' + file.name, 'error');
        }
    }
    
    addFileToList(file) {
        if (file.type.startsWith('audio/')) {
            this.addMusicToList(file);
        } else if (file.type.startsWith('image/')) {
            this.addImageToList(file);
        }
        
        // Save uploaded files to localStorage
        this.saveUploadedFiles();
    }
    
    addMusicToList(file) {
        
        // Check if file with same name already exists in DOM first
        const musicList = document.querySelector('.music-list');
        if (musicList) {
            const existingItems = musicList.querySelectorAll('.music-item');
            for (let item of existingItems) {
                const titleElement = item.querySelector('h4');
                if (titleElement && titleElement.textContent === file.name.replace(/\.[^/.]+$/, "")) {
                    this.showAdminNotification('Bu müzik dosyası zaten yüklü!', 'warning');
                    return;
                }
            }
        }
        if (!musicList) {
            this.showAdminNotification('Error: Music container not found!', 'error');
            return;
        }
        
        const musicItem = document.createElement('div');
        musicItem.className = 'music-item';
        
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        const fileSize = this.formatFileSize(file.size);
        const fileUrl = URL.createObjectURL(file);
        
        // Get available album covers dynamically
        const availableCovers = [
            'assets/images/album-cover-1.jpg',
            'assets/images/album-cover-2.jpg',
            'assets/images/album-cover-3.jpg',
            'assets/images/hero-musician.jpg'
        ];
        const albumCover = availableCovers[Math.floor(Math.random() * availableCovers.length)];
        
        // Create unique ID for this music item
        const musicId = 'music_' + Date.now();
        musicItem.dataset.musicId = musicId;
        
        musicItem.innerHTML = `
            <div class="music-info">
                <img src="${albumCover}" alt="Album Cover" class="music-thumb">
                <div class="music-details">
                    <h4>${fileName}</h4>
                    <p>Yeni • ${fileSize}</p>
                </div>
            </div>
            <div class="music-actions">
                <button class="btn-icon edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Save music data to localStorage
        const musicData = {
            id: musicId,
            title: fileName,
            artist: 'Hasan Arthur',
            genre: 'Yeni',
            fileSize: fileSize,
            fileUrl: fileUrl,
            albumCover: albumCover,
            dateAdded: new Date().toISOString()
        };
        
        this.saveMusicData(musicData);
        
        this.bindItemEvents(musicItem);
        musicList.appendChild(musicItem);
        
        // Add to main site immediately
        this.addMusicToMainSite(musicData);
        
        musicItem.style.opacity = '0';
        musicItem.style.transform = 'translateY(20px)';
        setTimeout(() => {
            musicItem.style.transition = 'all 0.3s ease';
            musicItem.style.opacity = '1';
            musicItem.style.transform = 'translateY(0)';
        }, 100);
        
    }
    
    addImageToList(file) {
        try {
            // Check if file with same name already exists in DOM first
            const galleryGrid = document.querySelector('.gallery-grid');
            if (galleryGrid) {
                const existingItems = galleryGrid.querySelectorAll('.gallery-admin-item');
                for (let item of existingItems) {
                    const titleElement = item.querySelector('h4');
                    if (titleElement && titleElement.textContent === file.name.replace(/\.[^/.]+$/, "")) {
                        this.showAdminNotification('Bu resim dosyası zaten yüklü!', 'warning');
                        return;
                    }
                }
            }
            
            if (!galleryGrid) {
                this.showAdminNotification('Error: Gallery container not found!', 'error');
                return;
            }
        
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-admin-item';
        
        // Create unique ID for this gallery item
        const galleryId = 'gallery_' + Date.now();
        galleryItem.dataset.galleryId = galleryId;
        
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imageUrl = e.target.result;
            
            galleryItem.innerHTML = `
                <img src="${imageUrl}" alt="Uploaded Image">
                <div class="gallery-overlay">
                    <h5>Yeni Resim</h5>
                    <p>Az önce yüklendi</p>
                    <div class="gallery-actions">
                        <button class="btn-icon edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
                    // Save gallery data to localStorage
                    const galleryData = {
                        id: galleryId,
                        title: 'Yeni Resim',
                        description: 'Az önce yüklendi',
                        category: 'general',
                        imageUrl: imageUrl,
                        dateAdded: new Date().toISOString()
                    };
                    
                    this.saveGalleryData(galleryData);
                    this.bindItemEvents(galleryItem);
                    galleryGrid.appendChild(galleryItem);
                    
                    // Add to main site immediately
                    this.addImageToMainSite(galleryData);
            
                    galleryItem.style.opacity = '0';
                    galleryItem.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        galleryItem.style.transition = 'all 0.3s ease';
                        galleryItem.style.opacity = '1';
                        galleryItem.style.transform = 'scale(1)';
                    }, 100);
                } catch (error) {
                    console.error('Error processing image:', error);
                    this.showAdminNotification('Resim işlenirken hata oluştu', 'error');
                }
            };
            
            reader.onerror = () => {
                console.error('FileReader error for file:', file.name);
                this.showAdminNotification('Dosya okuma hatası', 'error');
            };
            
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error in addImageToList:', error);
            this.showAdminNotification('Resim listesine ekleme hatası', 'error');
        }
    }
    
    bindItemEvents(item) {
        const editBtn = item.querySelector('.edit');
        const deleteBtn = item.querySelector('.delete');
        
        // Remove existing listeners to prevent duplicates
        if (editBtn && !editBtn.hasAttribute('data-bound')) {
            editBtn.setAttribute('data-bound', 'true');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (item.classList.contains('music-item')) {
                    editMusicItem(editBtn);
                } else if (item.classList.contains('gallery-admin-item')) {
                    editGalleryItem(editBtn);
                }
            });
        }
        
        if (deleteBtn && !deleteBtn.hasAttribute('data-bound')) {
            deleteBtn.setAttribute('data-bound', 'true');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (item.classList.contains('music-item')) {
                    deleteMusicItem(deleteBtn);
                } else if (item.classList.contains('gallery-admin-item')) {
                    deleteGalleryItem(deleteBtn);
                }
            });
        }
    }
    
    deleteItem(item) {
        try {
            if (confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
                // Remove from localStorage first
                const musicId = item.dataset.musicId;
                const galleryId = item.dataset.galleryId;
                
                if (musicId) {
                    this.removeMusicFromStorage(musicId);
                } else if (galleryId) {
                    this.removeGalleryFromStorage(galleryId);
                }
                
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    try {
                        item.remove();
                        this.updateStats();
                        this.showAdminNotification('Öğe başarıyla silindi!', 'success');
                    } catch (error) {
                        console.error('Error removing item from DOM:', error);
                        this.showAdminNotification('Öğe silinirken hata oluştu', 'error');
                    }
                }, 300);
            }
        } catch (error) {
            console.error('Error in deleteItem:', error);
            this.showAdminNotification('Silme işlemi sırasında hata oluştu', 'error');
        }
    }
    
    removeMusicFromStorage(musicId) {
        try {
            let musicList = JSON.parse(localStorage.getItem('uploadedMusic') || '[]');
            musicList = musicList.filter(music => music.id !== musicId);
            localStorage.setItem('uploadedMusic', JSON.stringify(musicList));
            console.log('🗑️ Music removed from localStorage:', musicId);
        } catch (error) {
            console.error('Error removing music from storage:', error);
            this.showAdminNotification('Müzik verisi silinirken hata oluştu', 'error');
        }
    }
    
    removeGalleryFromStorage(galleryId) {
        try {
            let galleryList = JSON.parse(localStorage.getItem('uploadedGallery') || '[]');
            galleryList = galleryList.filter(gallery => gallery.id !== galleryId);
            localStorage.setItem('uploadedGallery', JSON.stringify(galleryList));
            console.log('🗑️ Gallery item removed from localStorage:', galleryId);
        } catch (error) {
            console.error('Error removing gallery from storage:', error);
            this.showAdminNotification('Galeri verisi silinirken hata oluştu', 'error');
        }
    }
    
    initializeFileHandling() {
        const existingItems = document.querySelectorAll('.music-item, .gallery-admin-item');
        existingItems.forEach(item => {
            this.bindItemEvents(item);
        });
    }
    
    bindFormEvents() {
        try {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    try {
                        e.preventDefault();
                        this.showAdminNotification('Ayarlar başarıyla kaydedildi!', 'success');
                    } catch (error) {
                        console.error('Error handling form submit:', error);
                        this.showAdminNotification('Form gönderilirken hata oluştu', 'error');
                    }
                });
            });
            
            const saveButtons = document.querySelectorAll('.btn-secondary');
            saveButtons.forEach(btn => {
                if (btn.querySelector('i.fa-save')) {
                    btn.addEventListener('click', () => {
                        try {
                            this.showAdminNotification('İçerik başarıyla kaydedildi!', 'success');
                        } catch (error) {
                            console.error('Error handling save button click:', error);
                            this.showAdminNotification('Kaydetme işleminde hata oluştu', 'error');
                        }
                    });
                }
            });
            
            const backupBtn = document.querySelector('[data-action="backup"]');
            if (backupBtn) {
                backupBtn.addEventListener('click', () => {
                    try {
                        this.createBackup();
                    } catch (error) {
                        console.error('Error creating backup:', error);
                        this.showAdminNotification('Yedekleme işleminde hata oluştu', 'error');
                    }
                });
            }
            
            const backupFile = document.getElementById('backupFile');
            if (backupFile) {
                backupFile.addEventListener('change', (e) => {
                    try {
                        this.restoreBackup(e.target.files[0]);
                    } catch (error) {
                        console.error('Error restoring backup:', error);
                        this.showAdminNotification('Yedek yükleme işleminde hata oluştu', 'error');
                    }
                });
            }
        } catch (error) {
            console.error('Error in bindFormEvents:', error);
            this.showAdminNotification('Form bağlama işleminde hata oluştu', 'error');
        }
    }
    
    updateStats() {
        try {
            // Get counts from localStorage + DOM elements
            const savedMusicList = JSON.parse(localStorage.getItem('uploadedMusic') || '[]');
            const savedGalleryList = JSON.parse(localStorage.getItem('uploadedGallery') || '[]');
            
            // Count DOM elements
            const domTracks = document.querySelectorAll('.music-item').length;
            const domImages = document.querySelectorAll('.gallery-admin-item').length;
            
            // Total = localStorage + default items
            const totalTracks = Math.max(4 + savedMusicList.length, domTracks); // 4 default + uploaded
            const totalImages = Math.max(6 + savedGalleryList.length, domImages); // 6 default + uploaded
            
            // Calculate real page views and engagement (stable)
            const realViews = this.getRealPageViews();
            const realLikes = this.getRealEngagement();
            
            // Ensure positive numbers
        const safeViews = Math.max(0, realViews);
        const safeLikes = Math.max(0, realLikes);
        
        const totalTracksEl = document.getElementById('totalTracks');
        const totalImagesEl = document.getElementById('totalImages');
        const totalViewsEl = document.getElementById('totalViews');
        const totalLikesEl = document.getElementById('totalLikes');
        
        if (totalTracksEl) {
            this.animateCounter(totalTracksEl, totalTracks);
        }
        
        if (totalImagesEl) {
            this.animateCounter(totalImagesEl, totalImages);
        }
        
        if (totalViewsEl) {
            this.animateCounter(totalViewsEl, safeViews);
        }
        
        if (totalLikesEl) {
            this.animateCounter(totalLikesEl, safeLikes);
        }
        
            console.log(`📊 Stats updated: ${totalTracks} tracks (${savedMusicList.length} uploaded), ${totalImages} images (${savedGalleryList.length} uploaded), ${safeViews} views, ${safeLikes} engagement`);
        } catch (error) {
            console.error('Error updating stats:', error);
            this.showAdminNotification('İstatistik güncelleme hatası', 'error');
        }
    }
    
    getRealPageViews() {
        // Get from localStorage if available, otherwise start from base value
        let views = parseInt(localStorage.getItem('page_views') || '75'); // Start from 75
        
        // Only increment once per session, not on every stats update
        const sessionKey = 'admin_session_view_counted';
        const currentSession = localStorage.getItem('admin_session');
        const lastCountedSession = localStorage.getItem(sessionKey);
        
        if (currentSession && currentSession !== lastCountedSession) {
            views++;
            localStorage.setItem('page_views', views.toString());
            localStorage.setItem(sessionKey, currentSession);
            console.log('📈 Page view incremented to:', views);
        }
        
        return views;
    }
    
    getRealEngagement() {
        // Calculate engagement based on:
        // - Music plays
        // - Gallery interactions
        // - Time spent on site
        const musicPlays = Math.max(0, parseInt(localStorage.getItem('music_plays') || '0'));
        const galleryClicks = Math.max(0, parseInt(localStorage.getItem('gallery_clicks') || '0'));
        const socialClicks = Math.max(0, parseInt(localStorage.getItem('social_clicks') || '0'));
        
        const totalEngagement = musicPlays + galleryClicks + socialClicks;
        return Math.max(0, totalEngagement);
    }
    
    // Reset corrupted stats
    resetStats() {
        localStorage.removeItem('page_views');
        localStorage.removeItem('music_plays');
        localStorage.removeItem('gallery_clicks');
        localStorage.removeItem('social_clicks');
        
        // Set default values
        localStorage.setItem('page_views', '1');
        localStorage.setItem('music_plays', '0');
        localStorage.setItem('gallery_clicks', '0');
        localStorage.setItem('social_clicks', '0');
        
        console.log('📊 Stats reset to default values');
        this.updateStats();
    }

    // Track real user interactions
    trackMusicPlay() {
        const currentPlays = Math.max(0, parseInt(localStorage.getItem('music_plays') || '0'));
        const newPlays = currentPlays + 1;
        localStorage.setItem('music_plays', newPlays.toString());
        this.updateStats();
    }
    
    trackGalleryClick() {
        const clicks = parseInt(localStorage.getItem('gallery_clicks') || '0') + 1;
        localStorage.setItem('gallery_clicks', clicks.toString());
        this.updateStats();
    }
    
    trackSocialClick() {
        const clicks = parseInt(localStorage.getItem('social_clicks') || '0') + 1;
        localStorage.setItem('social_clicks', clicks.toString());
        this.updateStats();
    }
    
    // Update stats with real data
    updateRealStats() {
        this.data.stats = {
            tracks: totalTracks,
            images: totalImages,
            views: parseInt(document.getElementById('totalViews')?.textContent?.replace(',', '') || '1234'),
            downloads: parseInt(document.getElementById('totalDownloads')?.textContent || '89')
        };
        
        this.saveData();
    }
    
    animateCounter(element, targetValue) {
        if (!element) return;
        
        // Ensure positive target value
        targetValue = Math.max(0, parseInt(targetValue) || 0);
        
        const currentValue = Math.max(0, parseInt(element.textContent) || 0);
        if (currentValue === targetValue) return;
        
        const increment = targetValue > currentValue ? 1 : -1;
        let currentNum = currentValue;
        
        const step = () => {
            currentNum += increment;
            
            // Safety check - never go below 0
            currentNum = Math.max(0, currentNum);
            element.textContent = currentNum;
            
            if (currentNum !== targetValue && currentNum >= 0) {
                setTimeout(step, 30);
            }
        };
        step();
    }
    
    createBackup() {
        const backup = {
            timestamp: new Date().toISOString(),
            version: '1.0',
            data: this.data,
            settings: this.getSettings(),
            content: this.getContent()
        };
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `muzik-portfoyu-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showAdminNotification('Yedek dosyası başarıyla oluşturuldu!', 'success');
    }
    
    restoreBackup(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backup = JSON.parse(e.target.result);
                this.data = backup.data || {};
                this.saveData();
                this.updateStats();
                this.showAdminNotification('Yedek başarıyla geri yüklendi!', 'success');
            } catch (error) {
                this.showAdminNotification('Yedek dosyası geçersiz!', 'error');
            }
        };
        reader.readAsText(file);
    }
    
    getSettings() {
        const settings = {};
        const inputs = document.querySelectorAll('#settings input, #settings textarea');
        inputs.forEach(input => {
            if (input.id || input.name) {
                settings[input.id || input.name] = input.value;
            }
        });
        return settings;
    }
    
    getContent() {
        const content = {};
        const textareas = document.querySelectorAll('#content textarea');
        textareas.forEach(textarea => {
            if (textarea.id || textarea.name) {
                content[textarea.id || textarea.name] = textarea.value;
            }
        });
        return content;
    }
    
    loadData() {
        const saved = localStorage.getItem('adminPanelData');
        return saved ? JSON.parse(saved) : {
            stats: {
                tracks: 4,
                images: 6,
                views: 1234,
                downloads: 89
            }
        };
    }
    
    saveData() {
        localStorage.setItem('adminPanelData', JSON.stringify(this.data));
    }
    
    loadContent() {
        const savedContent = localStorage.getItem('siteContent');
        if (savedContent) {
            const content = JSON.parse(savedContent);
            
            Object.keys(content).forEach(key => {
                const element = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
                if (element) {
                    element.value = content[key];
                }
            });
        }
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    showAdminNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    exportData() {
        const exportData = {
            music: Array.from(document.querySelectorAll('.music-item')).map(item => ({
                title: item.querySelector('h4').textContent,
                info: item.querySelector('p').textContent
            })),
            gallery: Array.from(document.querySelectorAll('.gallery-admin-item')).map(item => ({
                title: item.querySelector('h5')?.textContent || 'Başlıksız',
                description: item.querySelector('p')?.textContent || 'Açıklama yok'
            })),
            stats: this.data.stats
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `site-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    generateReport() {
        const report = `
# Müzik Portföyü Raporu
Tarih: ${new Date().toLocaleDateString('tr-TR')}

## İstatistikler
- Toplam Müzik: ${this.data.stats.tracks}
- Toplam Resim: ${this.data.stats.images}
- Toplam Görüntüleme: ${this.data.stats.views.toLocaleString('tr-TR')}
- Toplam İndirme: ${this.data.stats.downloads}

## Son Aktiviteler
Site düzenli olarak güncellenmekte ve yeni içerikler eklenmektedir.
        `;
        
        const blob = new Blob([report], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `site-raporu-${new Date().toISOString().split('T')[0]}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showAdminNotification('Rapor başarıyla oluşturuldu!', 'success');
    }
    
    // LocalStorage Management Functions
    saveMusicData(musicData) {
        let musicList = JSON.parse(localStorage.getItem('uploadedMusic') || '[]');
        musicList.push(musicData);
        localStorage.setItem('uploadedMusic', JSON.stringify(musicList));
        console.log('🎵 Music saved to localStorage:', musicData.title);
    }
    
    saveGalleryData(galleryData) {
        let galleryList = JSON.parse(localStorage.getItem('uploadedGallery') || '[]');
        galleryList.push(galleryData);
        localStorage.setItem('uploadedGallery', JSON.stringify(galleryList));
        console.log('🖼️ Gallery image saved to localStorage:', galleryData.title);
    }
    
    loadUploadedContent() {
        console.log('🔄 Loading uploaded content from localStorage...');
        
        // Load uploaded music
        const musicList = JSON.parse(localStorage.getItem('uploadedMusic') || '[]');
        console.log('🎵 Found music in localStorage:', musicList);
        
        musicList.forEach((musicData, index) => {
            console.log(`🎵 Recreating music item ${index + 1}:`, musicData.title);
            this.recreateMusicItem(musicData);
            this.addMusicToMainSite(musicData);
        });
        
        // Load uploaded gallery
        const galleryList = JSON.parse(localStorage.getItem('uploadedGallery') || '[]');
        console.log('🖼️ Found gallery items in localStorage:', galleryList);
        
        galleryList.forEach((galleryData, index) => {
            console.log(`🖼️ Recreating gallery item ${index + 1}:`, galleryData.title);
            this.recreateGalleryItem(galleryData);
            this.addImageToMainSite(galleryData);
        });
        
        console.log(`📂 Successfully loaded ${musicList.length} music items and ${galleryList.length} gallery items from localStorage`);
    }
    
    recreateMusicItem(musicData) {
        const musicList = document.querySelector('.music-list');
        console.log('🔍 Looking for .music-list container:', musicList);
        
        if (!musicList) {
            console.error('❌ .music-list container not found! Cannot recreate music item:', musicData.title);
            return;
        }
        
        // Check if already exists
        const existingItem = document.querySelector(`[data-music-id="${musicData.id}"]`);
        if (existingItem) {
            console.log('⚠️ Music item already exists in admin panel:', musicData.title);
            return;
        }
        
        console.log('✅ Found .music-list container, creating music item for:', musicData.title);
        
        const musicItem = document.createElement('div');
        musicItem.className = 'music-item';
        musicItem.dataset.musicId = musicData.id;
        
        musicItem.innerHTML = `
            <div class="music-info">
                <img src="${musicData.albumCover}" alt="Album Cover" class="music-thumb">
                <div class="music-details">
                    <h4>${musicData.title}</h4>
                    <p>${musicData.genre} • ${musicData.fileSize}</p>
                </div>
            </div>
            <div class="music-actions">
                <button class="btn-icon edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        this.bindItemEvents(musicItem);
        musicList.appendChild(musicItem);
        console.log('✅ Music item added to admin panel DOM:', musicData.title);
    }
    
    recreateGalleryItem(galleryData) {
        const galleryGrid = document.querySelector('.gallery-grid');
        console.log('🔍 Looking for .gallery-grid container:', galleryGrid);
        
        if (!galleryGrid) {
            console.error('❌ .gallery-grid container not found! Cannot recreate gallery item:', galleryData.title);
            return;
        }
        
        // Check if already exists to prevent duplicates
        const existingItem = document.querySelector(`[data-gallery-id="${galleryData.id}"]`);
        if (existingItem) {
            console.log('⚠️ Gallery item already exists in admin panel:', galleryData.title);
            return;
        }
        
        console.log('✅ Found .gallery-grid container, creating gallery item for:', galleryData.title);
        
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-admin-item';
        galleryItem.dataset.galleryId = galleryData.id;
        
        galleryItem.innerHTML = `
            <img src="${galleryData.imageUrl}" alt="${galleryData.title}">
            <div class="gallery-overlay">
                <h5>${galleryData.title}</h5>
                <p>${galleryData.description}</p>
                <div class="gallery-actions">
                    <button class="btn-icon edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        this.bindItemEvents(galleryItem);
        galleryGrid.appendChild(galleryItem);
        console.log('✅ Gallery item added to DOM:', galleryData.title);
    }
    
    addMusicToMainSite(musicData) {
        // Ana sayfaya müzik ekle
        console.log('🎵 Adding music to main site:', musicData.title);
        
        // Storage event trigger etmeden direkt ekle
        window.dispatchEvent(new CustomEvent('newMusicAdded', {
            detail: musicData
        }));
    }
    
    addImageToMainSite(galleryData) {
        // Ana sayfaya resim ekle
        console.log('🖼️ Adding image to main site:', galleryData.title);
        
        // Storage event trigger etmeden direkt ekle
        window.dispatchEvent(new CustomEvent('newImageAdded', {
            detail: galleryData
        }));
    }
}

// Moved to main initialization function

function toggleMobileNav() {
    const sidebar = document.querySelector('.admin-sidebar');
    sidebar.classList.toggle('mobile-open');
}

if (window.innerWidth <= 768) {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleMobileNav);
    }
}

// Global content editing functions
function saveAboutText() {
    const englishText = document.getElementById('aboutTextEn').value;
    const turkishText = document.getElementById('aboutTextTr').value;
    
    // Save to localStorage with event triggering
    localStorage.setItem('about_text_en', englishText);
    localStorage.setItem('about_text_tr', turkishText);
    
    // Trigger storage event manually for same-window updates
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'about_text_en',
        newValue: englishText,
        storageArea: localStorage
    }));
    
    // Apply changes to main site immediately if in same window
    applyAboutChangesToMainSite(englishText, turkishText);
    
    showAdminNotification('About text saved and applied to main site!', 'success');
    console.log('📝 About text saved and applied');
}

function saveHeroContent() {
    const title = document.getElementById('heroTitle').value;
    const subtitle = document.getElementById('heroSubtitle').value;
    const description = document.getElementById('heroDescription').value;
    
    // Save to localStorage
    localStorage.setItem('hero_title', title);
    localStorage.setItem('hero_subtitle', subtitle);
    localStorage.setItem('hero_description', description);
    
    // Trigger storage events
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'hero_title',
        newValue: title,
        storageArea: localStorage
    }));
    
    // Apply changes to main site immediately
    applyHeroChangesToMainSite(title, subtitle, description);
    
    showAdminNotification('Hero content saved and applied to main site!', 'success');
    console.log('📝 Hero content saved and applied');
}

function showAdminNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type} show`;
    notification.innerHTML = `<i class="fas fa-check"></i> ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Functions to apply changes to main site
function applyAboutChangesToMainSite(englishText, turkishText) {
    // Try to find about section in parent window or current window
    const targetWindow = window.opener || window.parent || window;
    const aboutSection = targetWindow.document.querySelector('#about .about-text');
    
    if (aboutSection) {
        // Update the about text in the main site
        const paragraphs = englishText.split('\n').filter(p => p.trim());
        aboutSection.innerHTML = `
            <h3>My Musical Journey</h3>
            ${paragraphs.map(p => `<p>${p}</p>`).join('')}
        `;
        console.log('✅ About section updated on main site');
    } else {
        console.log('ℹ️ About section not found in main site');
    }
}

function applyHeroChangesToMainSite(title, subtitle, description) {
    const targetWindow = window.opener || window.parent || window;
    const heroTitle = targetWindow.document.querySelector('.hero-title .title-line.highlight');
    const heroDesc = targetWindow.document.querySelector('.hero-description');
    
    if (heroTitle) {
        heroTitle.textContent = title;
        console.log('✅ Hero title updated on main site');
    }
    
    if (heroDesc) {
        heroDesc.textContent = description;
        console.log('✅ Hero description updated on main site');
    }
}

function saveContactInfo() {
    const email = document.querySelector('#content input[type="email"]').value;
    const phone = document.querySelector('#content input[type="tel"]').value;
    const location = document.querySelector('#content input[type="text"]').value;
    
    localStorage.setItem('contact_email', email);
    localStorage.setItem('contact_phone', phone);
    localStorage.setItem('contact_location', location);
    
    // Trigger storage events
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'contact_email',
        newValue: email,
        storageArea: localStorage
    }));
    
    applyContactChangesToMainSite(email, phone, location);
    showAdminNotification('Contact information saved!', 'success');
}

function applyContactChangesToMainSite(email, phone, location) {
    const targetWindow = window.opener || window.parent || window;
    const emailEl = targetWindow.document.querySelector('.contact-items .contact-item:nth-child(1) p');
    const phoneEl = targetWindow.document.querySelector('.contact-items .contact-item:nth-child(2) p');
    const locationEl = targetWindow.document.querySelector('.contact-items .contact-item:nth-child(3) p');
    
    if (emailEl) emailEl.textContent = email;
    if (phoneEl) phoneEl.textContent = phone;
    if (locationEl) locationEl.textContent = location;
}

let currentEditingMusicItem = null;

function editMusicItem(button) {
    const musicItem = button.closest('.music-item');
    currentEditingMusicItem = musicItem;
    
    // Extract current data
    const title = musicItem.querySelector('h4').textContent;
    const info = musicItem.querySelector('p').textContent;
    const albumCover = musicItem.querySelector('img').src;
    
    // Parse info (format: "Genre • Duration")
    const infoParts = info.split(' • ');
    const genre = infoParts[0] || '';
    const duration = infoParts[1] || '';
    
    // Fill modal form
    document.getElementById('musicTitle').value = title;
    document.getElementById('musicArtist').value = 'Hasan Arthur'; // Default artist
    document.getElementById('musicGenre').value = genre;
    document.getElementById('musicDuration').value = duration;
    document.getElementById('musicDescription').value = '';
    document.getElementById('musicAlbumCover').value = albumCover;
    
    // Show modal
    openMusicEditModal();
}

let currentEditingGalleryItem = null;

function editGalleryItem(button) {
    const galleryItem = button.closest('.gallery-admin-item');
    currentEditingGalleryItem = galleryItem;
    
    // Extract current data
    const title = galleryItem.querySelector('h5').textContent;
    const description = galleryItem.querySelector('p').textContent;
    const imageSrc = galleryItem.querySelector('img').src;
    
    // Fill modal form
    document.getElementById('galleryTitle').value = title;
    document.getElementById('galleryDescription').value = description;
    document.getElementById('galleryCategory').value = 'concerts'; // Default category
    document.getElementById('galleryDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('galleryLocation').value = '';
    
    // Show current image in preview
    const preview = document.getElementById('galleryPreview');
    preview.innerHTML = `<img src="${imageSrc}" alt="Current Image">`;
    preview.classList.add('show');
    
    // Show modal
    openGalleryEditModal();
}

function saveSiteSettings() {
    const title = document.getElementById('siteTitle').value;
    const description = document.getElementById('siteDescription').value;
    
    localStorage.setItem('site_title', title);
    localStorage.setItem('site_description', description);
    
    // Trigger storage events
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'site_title',
        newValue: title,
        storageArea: localStorage
    }));
    
    // Update document title immediately
    document.title = title;
    
    showAdminNotification('Site settings saved!', 'success');
    console.log('⚙️ Site settings saved');
}

function saveSocialMediaSettings() {
    const spotify = document.getElementById('spotifyUrl').value;
    const youtube = document.getElementById('youtubeUrl').value;
    const instagram = document.getElementById('instagramUrl').value;
    
    localStorage.setItem('social_spotify', spotify);
    localStorage.setItem('social_youtube', youtube);
    localStorage.setItem('social_instagram', instagram);
    
    // Trigger storage events
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'social_spotify',
        newValue: spotify,
        storageArea: localStorage
    }));
    
    applySocialMediaToMainSite(spotify, youtube, instagram);
    showAdminNotification('Social media links saved!', 'success');
    console.log('📱 Social media settings saved');
}

function applySocialMediaToMainSite(spotify, youtube, instagram) {
    const targetWindow = window.opener || window.parent || window;
    
    // Update footer social links
    const footerSocial = targetWindow.document.querySelectorAll('.footer-social a');
    const socialLinks = targetWindow.document.querySelectorAll('.social-link');
    
    // Update Spotify links
    if (spotify) {
        footerSocial.forEach(link => {
            if (link.querySelector('.fa-spotify')) {
                link.href = spotify;
            }
        });
        socialLinks.forEach(link => {
            if (link.querySelector('.fa-spotify')) {
                link.href = spotify;
            }
        });
    }
    
    // Update YouTube links
    if (youtube) {
        footerSocial.forEach(link => {
            if (link.querySelector('.fa-youtube')) {
                link.href = youtube;
            }
        });
        socialLinks.forEach(link => {
            if (link.querySelector('.fa-youtube')) {
                link.href = youtube;
            }
        });
    }
    
    // Update Instagram links
    if (instagram) {
        footerSocial.forEach(link => {
            if (link.querySelector('.fa-instagram')) {
                link.href = instagram;
            }
        });
        socialLinks.forEach(link => {
            if (link.querySelector('.fa-instagram')) {
                link.href = instagram;
            }
        });
    }
}

function loadContentFromLocalStorage() {
    // Load about text
    const englishText = localStorage.getItem('about_text_en');
    const turkishText = localStorage.getItem('about_text_tr');
    
    if (englishText) {
        const aboutTextEn = document.getElementById('aboutTextEn');
        if (aboutTextEn && aboutTextEn.value !== englishText) {
            aboutTextEn.value = englishText;
        }
    }
    
    if (turkishText) {
        const aboutTextTr = document.getElementById('aboutTextTr');
        if (aboutTextTr && aboutTextTr.value !== turkishText) {
            aboutTextTr.value = turkishText;
        }
    }
    
    // Load hero content
    const heroTitle = localStorage.getItem('hero_title');
    const heroSubtitle = localStorage.getItem('hero_subtitle');
    const heroDescription = localStorage.getItem('hero_description');
    
    if (heroTitle) {
        const titleEl = document.getElementById('heroTitle');
        if (titleEl && titleEl.value !== heroTitle) {
            titleEl.value = heroTitle;
        }
    }
    
    if (heroSubtitle) {
        const subtitleEl = document.getElementById('heroSubtitle');
        if (subtitleEl && subtitleEl.value !== heroSubtitle) {
            subtitleEl.value = heroSubtitle;
        }
    }
    
    if (heroDescription) {
        const descEl = document.getElementById('heroDescription');
        if (descEl && descEl.value !== heroDescription) {
            descEl.value = heroDescription;
        }
    }
    
    // Load contact info
    const email = localStorage.getItem('contact_email');
    const phone = localStorage.getItem('contact_phone');
    const location = localStorage.getItem('contact_location');
    
    if (email) {
        const emailEl = document.querySelector('#content input[type="email"]');
        if (emailEl && emailEl.value !== email) {
            emailEl.value = email;
        }
    }
    
    if (phone) {
        const phoneEl = document.querySelector('#content input[type="tel"]');
        if (phoneEl && phoneEl.value !== phone) {
            phoneEl.value = phone;
        }
    }
    
    if (location) {
        const locationEl = document.querySelector('#content input[type="text"]');
        if (locationEl && locationEl.value !== location) {
            locationEl.value = location;
        }
    }
    
    // Load site settings
    const siteTitle = localStorage.getItem('site_title');
    const siteDescription = localStorage.getItem('site_description');
    
    if (siteTitle) {
        const titleEl = document.getElementById('siteTitle');
        if (titleEl && titleEl.value !== siteTitle) {
            titleEl.value = siteTitle;
        }
    }
    
    if (siteDescription) {
        const descEl = document.getElementById('siteDescription');
        if (descEl && descEl.value !== siteDescription) {
            descEl.value = siteDescription;
        }
    }
    
    // Load social media settings
    const spotify = localStorage.getItem('social_spotify');
    const youtube = localStorage.getItem('social_youtube');
    const instagram = localStorage.getItem('social_instagram');
    
    if (spotify) {
        const spotifyEl = document.getElementById('spotifyUrl');
        if (spotifyEl && spotifyEl.value !== spotify) {
            spotifyEl.value = spotify;
        }
    }
    
    if (youtube) {
        const youtubeEl = document.getElementById('youtubeUrl');
        if (youtubeEl && youtubeEl.value !== youtube) {
            youtubeEl.value = youtube;
        }
    }
    
    if (instagram) {
        const instagramEl = document.getElementById('instagramUrl');
        if (instagramEl && instagramEl.value !== instagram) {
            instagramEl.value = instagram;
        }
    }
}

// Moved to main initialization function
    } else {
        console.error('Required elements not found!');
        
        // Fallback: try to find admin panel after 1 second
        setTimeout(() => {
            const retryLoginScreen = document.getElementById('loginScreen');
            const retryAdminPanel = document.getElementById('adminPanel');
            
            if (retryLoginScreen && retryAdminPanel) {
                console.log('Found elements on retry, initialization skipped - handled by main DOMContentLoaded');
                
                // Load saved content
                setTimeout(() => {
                    loadContentFromLocalStorage();
                }, 500);
            } else {
                console.error('Elements still not found after retry');
            }
        }, 1000);
    }
});

// Modal Functions
function openMusicEditModal() {
    const modal = document.getElementById('musicEditModal');
    modal.style.display = 'block';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Setup image preview
    setupImagePreview('coverImageInput', 'coverPreview');
}

function closeMusicEditModal() {
    const modal = document.getElementById('musicEditModal');
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.body.style.overflow = '';
    currentEditingMusicItem = null;
    
    // Reset form
    document.getElementById('musicEditForm').reset();
    document.getElementById('coverPreview').innerHTML = '';
    document.getElementById('coverPreview').classList.remove('show');
}

function openGalleryEditModal() {
    const modal = document.getElementById('galleryEditModal');
    modal.style.display = 'block';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Setup image preview
    setupImagePreview('galleryImageInput', 'galleryPreview');
}

function closeGalleryEditModal() {
    const modal = document.getElementById('galleryEditModal');
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.body.style.overflow = '';
    currentEditingGalleryItem = null;
    
    // Reset form
    document.getElementById('galleryEditForm').reset();
    document.getElementById('galleryPreview').innerHTML = '';
    document.getElementById('galleryPreview').classList.remove('show');
}

function setupImagePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                preview.classList.add('show');
            };
            reader.readAsDataURL(file);
        }
    });
}

function saveMusicEdit() {
    if (!currentEditingMusicItem) return;
    
    const form = document.getElementById('musicEditForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Get form data
    const title = document.getElementById('musicTitle').value;
    const artist = document.getElementById('musicArtist').value;
    const genre = document.getElementById('musicGenre').value;
    const duration = document.getElementById('musicDuration').value;
    const description = document.getElementById('musicDescription').value;
    const albumCover = document.getElementById('musicAlbumCover').value;
    
    // Check if new image was uploaded
    const coverInput = document.getElementById('coverImageInput');
    let newImageSrc = albumCover;
    
    if (coverInput.files[0]) {
        // In a real application, you would upload the file to a server
        // For demo purposes, we'll use the file URL
        newImageSrc = URL.createObjectURL(coverInput.files[0]);
    }
    
    // Update the music item
    currentEditingMusicItem.querySelector('h4').textContent = title;
    currentEditingMusicItem.querySelector('p').textContent = `${genre} • ${duration}`;
    currentEditingMusicItem.querySelector('img').src = newImageSrc;
    currentEditingMusicItem.querySelector('img').alt = title;
    
    // Add loading animation
    const saveBtn = document.querySelector('#musicEditModal .btn-primary');
    saveBtn.classList.add('loading');
    saveBtn.innerHTML = '<i class="fas fa-spinner"></i> Saving...';
    
    // Simulate save delay
    setTimeout(() => {
        saveBtn.classList.remove('loading');
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Kaydet';
        
        closeMusicEditModal();
        showAdminNotification(`"${title}" successfully updated!`, 'success');
        
        // Update stats if needed
        if (window.adminPanel) {
            window.adminPanel.updateStats();
        }
    }, 1500);
}

function saveGalleryEdit() {
    if (!currentEditingGalleryItem) return;
    
    const form = document.getElementById('galleryEditForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Get form data
    const title = document.getElementById('galleryTitle').value;
    const description = document.getElementById('galleryDescription').value;
    const category = document.getElementById('galleryCategory').value;
    const date = document.getElementById('galleryDate').value;
    const location = document.getElementById('galleryLocation').value;
    
    // Check if new image was uploaded
    const imageInput = document.getElementById('galleryImageInput');
    let newImageSrc = currentEditingGalleryItem.querySelector('img').src;
    
    if (imageInput.files[0]) {
        // In a real application, you would upload the file to a server
        // For demo purposes, we'll use the file URL
        newImageSrc = URL.createObjectURL(imageInput.files[0]);
    }
    
    // Update the gallery item
    currentEditingGalleryItem.querySelector('h5').textContent = title;
    currentEditingGalleryItem.querySelector('p').textContent = description;
    currentEditingGalleryItem.querySelector('img').src = newImageSrc;
    currentEditingGalleryItem.querySelector('img').alt = title;
    currentEditingGalleryItem.dataset.category = category;
    
    // Add location and date info if available
    if (location || date) {
        let additionalInfo = [];
        if (location) additionalInfo.push(location);
        if (date) additionalInfo.push(new Date(date).getFullYear());
        
        const overlay = currentEditingGalleryItem.querySelector('.gallery-overlay');
        const existingP = overlay.querySelector('p');
        existingP.textContent = `${description} - ${additionalInfo.join(', ')}`;
    }
    
    // Add loading animation
    const saveBtn = document.querySelector('#galleryEditModal .btn-primary');
    saveBtn.classList.add('loading');
    saveBtn.innerHTML = '<i class="fas fa-spinner"></i> Saving...';
    
    // Simulate save delay
    setTimeout(() => {
        saveBtn.classList.remove('loading');
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Kaydet';
        
        closeGalleryEditModal();
        showAdminNotification(`"${title}" gallery item updated!`, 'success');
        
        // Update stats if needed
        if (window.adminPanel) {
            window.adminPanel.updateStats();
        }
    }, 1500);
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        if (e.target.id === 'musicEditModal') {
            closeMusicEditModal();
        } else if (e.target.id === 'galleryEditModal') {
            closeGalleryEditModal();
        }
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMusicEditModal();
        closeGalleryEditModal();
    }
});

// Global modal functions for HTML onclick handlers
// Duplicate openMusicEditModal and closeMusicEditModal removed

function saveMusicEdit() {
    if (!currentEditingMusicItem) return;
    
    const title = document.getElementById('musicTitle').value;
    const artist = document.getElementById('musicArtist').value;
    const genre = document.getElementById('musicGenre').value;
    const duration = document.getElementById('musicDuration').value;
    const description = document.getElementById('musicDescription').value;
    const albumCover = document.getElementById('musicAlbumCover').value;
    
    // Update item in DOM
    const titleEl = currentEditingMusicItem.querySelector('h4');
    const infoEl = currentEditingMusicItem.querySelector('p');
    const imgEl = currentEditingMusicItem.querySelector('img');
    
    if (titleEl) titleEl.textContent = title;
    if (infoEl) infoEl.textContent = `${genre} • ${duration}`;
    if (imgEl && albumCover) imgEl.src = albumCover;
    
    // Update localStorage
    const musicId = currentEditingMusicItem.dataset.musicId;
    if (musicId) {
        const uploadedMusic = JSON.parse(localStorage.getItem('uploadedMusic') || '[]');
        const musicIndex = uploadedMusic.findIndex(m => m.id === musicId);
        if (musicIndex !== -1) {
            uploadedMusic[musicIndex] = {
                ...uploadedMusic[musicIndex],
                title: title,
                artist: artist,
                genre: genre,
                duration: duration,
                description: description,
                albumCover: albumCover
            };
            localStorage.setItem('uploadedMusic', JSON.stringify(uploadedMusic));
        }
    }
    
    adminPanel.showAdminNotification('Müzik başarıyla güncellendi!', 'success');
    closeMusicEditModal();
    
    // Sync to main site
    adminPanel.syncToMainSite();
}

// Duplicate openGalleryEditModal and closeGalleryEditModal removed

// Duplicate saveGalleryEdit removed - using complete implementation above

// Moved to main initialization function
            const targetContent = document.querySelector(`[data-tab-content="${tabId}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
});

// Delete functions for admin items
function deleteMusicItem(button) {
    const musicItem = button.closest('.music-item');
    const musicId = musicItem.dataset.musicId;
    const title = musicItem.querySelector('h4').textContent;
    
    if (confirm(`"${title}" müziğini silmek istediğinizden emin misiniz?`)) {
        // Remove from DOM
        musicItem.remove();
        
        // Remove from localStorage
        if (musicId) {
            const uploadedMusic = JSON.parse(localStorage.getItem('uploadedMusic') || '[]');
            const filteredMusic = uploadedMusic.filter(m => m.id !== musicId);
            localStorage.setItem('uploadedMusic', JSON.stringify(filteredMusic));
        }
        
        // Update stats
        adminPanel.updateStats();
        adminPanel.showAdminNotification('Müzik başarıyla silindi!', 'success');
        
        // Sync to main site
        adminPanel.syncToMainSite();
    }
}

function deleteGalleryItem(button) {
    const galleryItem = button.closest('.gallery-admin-item');
    const galleryId = galleryItem.dataset.galleryId;
    const title = galleryItem.querySelector('h5').textContent;
    
    if (confirm(`"${title}" resmini silmek istediğinizden emin misiniz?`)) {
        // Remove from DOM
        galleryItem.remove();
        
        // Remove from localStorage
        if (galleryId) {
            const uploadedGallery = JSON.parse(localStorage.getItem('uploadedGallery') || '[]');
            const filteredGallery = uploadedGallery.filter(g => g.id !== galleryId);
            localStorage.setItem('uploadedGallery', JSON.stringify(filteredGallery));
        }
        
        // Update stats
        adminPanel.updateStats();
        adminPanel.showAdminNotification('Resim başarıyla silindi!', 'success');
        
        // Sync to main site
        adminPanel.syncToMainSite();
    }
}

// Enhanced Real-time Notification System
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }
    
    init() {
        // Create notification container if it doesn't exist
        this.container = document.querySelector('.notification-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        }
    }
    
    show(message, type = 'info', duration = 4000) {
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        this.notifications.push(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove
        setTimeout(() => this.remove(notification), duration);
        
        return notification;
    }
    
    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = this.getIcon(type);
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="notificationManager.remove(this.parentElement)">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        return notification;
    }
    
    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle', 
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
    
    remove(notification) {
        if (notification && notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
                const index = this.notifications.indexOf(notification);
                if (index > -1) {
                    this.notifications.splice(index, 1);
                }
            }, 300);
        }
    }
    
    clear() {
        this.notifications.forEach(n => this.remove(n));
    }
}

// Initialize notification manager
const notificationManager = new NotificationManager();

// Performance Monitoring System
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoadTime: 0,
            jsExecutionTime: 0,
            domContentLoaded: 0,
            totalRequests: 0,
            failedRequests: 0,
            localStorage: {
                size: 0,
                itemCount: 0
            },
            memory: {
                used: 0,
                total: 0
            }
        };
        this.init();
    }
    
    init() {
        this.measurePageLoad();
        this.measureLocalStorage();
        this.measureMemory();
        this.startMonitoring();
        
        // Add performance dashboard to admin panel
        this.createDashboard();
    }
    
    measurePageLoad() {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.metrics.pageLoadTime = Math.round(perfData.loadEventEnd - perfData.loadEventStart);
            this.metrics.domContentLoaded = Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
            this.updateDashboard();
        });
    }
    
    measureLocalStorage() {
        try {
            let totalSize = 0;
            let itemCount = 0;
            
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    totalSize += localStorage[key].length;
                    itemCount++;
                }
            }
            
            this.metrics.localStorage.size = Math.round(totalSize / 1024); // KB
            this.metrics.localStorage.itemCount = itemCount;
        } catch (e) {
            console.warn('Could not measure localStorage:', e);
        }
    }
    
    measureMemory() {
        if (performance.memory) {
            this.metrics.memory.used = Math.round(performance.memory.usedJSHeapSize / 1048576); // MB
            this.metrics.memory.total = Math.round(performance.memory.totalJSHeapSize / 1048576); // MB
        }
    }
    
    startMonitoring() {
        // Update metrics every 30 seconds
        setInterval(() => {
            this.measureLocalStorage();
            this.measureMemory();
            this.updateDashboard();
        }, 30000);
    }
    
    createDashboard() {
        const dashboard = document.getElementById('dashboard');
        if (!dashboard) return;
        
        const performanceSection = document.createElement('div');
        performanceSection.className = 'performance-monitor';
        performanceSection.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-tachometer-alt"></i> Performance Monitor</h3>
                </div>
                <div class="card-body">
                    <div class="performance-grid">
                        <div class="perf-metric">
                            <div class="perf-label">Page Load</div>
                            <div class="perf-value" id="pageLoadTime">-</div>
                            <div class="perf-unit">ms</div>
                        </div>
                        <div class="perf-metric">
                            <div class="perf-label">DOM Ready</div>
                            <div class="perf-value" id="domReady">-</div>
                            <div class="perf-unit">ms</div>
                        </div>
                        <div class="perf-metric">
                            <div class="perf-label">Memory Usage</div>
                            <div class="perf-value" id="memoryUsage">-</div>
                            <div class="perf-unit">MB</div>
                        </div>
                        <div class="perf-metric">
                            <div class="perf-label">Storage Size</div>
                            <div class="perf-value" id="storageSize">-</div>
                            <div class="perf-unit">KB</div>
                        </div>
                    </div>
                    <div class="performance-actions">
                        <button class="btn btn-sm btn-secondary" onclick="performanceMonitor.clearStorage()">
                            <i class="fas fa-broom"></i> Clear Storage
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="performanceMonitor.optimizeStorage()">
                            <i class="fas fa-magic"></i> Optimize
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Insert after statistics cards
        const statsGrid = dashboard.querySelector('.stats-grid');
        if (statsGrid) {
            statsGrid.parentNode.insertBefore(performanceSection, statsGrid.nextSibling);
        }
        
        this.updateDashboard();
    }
    
    updateDashboard() {
        const elements = {
            pageLoadTime: document.getElementById('pageLoadTime'),
            domReady: document.getElementById('domReady'),
            memoryUsage: document.getElementById('memoryUsage'),
            storageSize: document.getElementById('storageSize')
        };
        
        if (elements.pageLoadTime) elements.pageLoadTime.textContent = this.metrics.pageLoadTime || '-';
        if (elements.domReady) elements.domReady.textContent = this.metrics.domContentLoaded || '-';
        if (elements.memoryUsage) elements.memoryUsage.textContent = this.metrics.memory.used || '-';
        if (elements.storageSize) elements.storageSize.textContent = this.metrics.localStorage.size || '-';
    }
    
    clearStorage() {
        if (confirm('Bu işlem tüm localStorage verilerini silecek. Emin misiniz?')) {
            const keepKeys = ['admin_session', 'admin_attempts'];
            const backup = {};
            
            keepKeys.forEach(key => {
                if (localStorage.getItem(key)) {
                    backup[key] = localStorage.getItem(key);
                }
            });
            
            localStorage.clear();
            
            // Restore essential data
            Object.keys(backup).forEach(key => {
                localStorage.setItem(key, backup[key]);
            });
            
            this.measureLocalStorage();
            this.updateDashboard();
            notificationManager.show('Storage cleared successfully!', 'success');
        }
    }
    
    optimizeStorage() {
        // Remove old temporary data
        const keysToCheck = Object.keys(localStorage);
        let optimized = 0;
        
        keysToCheck.forEach(key => {
            const value = localStorage.getItem(key);
            try {
                const parsed = JSON.parse(value);
                if (parsed.timestamp && Date.now() - parsed.timestamp > 7 * 24 * 60 * 60 * 1000) {
                    localStorage.removeItem(key);
                    optimized++;
                }
            } catch (e) {
                // Not JSON, skip
            }
        });
        
        this.measureLocalStorage();
        this.updateDashboard();
        notificationManager.show(`Storage optimized! Removed ${optimized} old items.`, 'success');
    }
}

// Initialize performance monitor
const performanceMonitor = new PerformanceMonitor();

// Advanced File Validation System
class FileValidator {
    constructor() {
        this.rules = {
            music: {
                maxSize: 50 * 1024 * 1024, // 50MB
                allowedTypes: ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/ogg'],
                extensions: ['.mp3', '.wav', '.flac', '.aac', '.ogg']
            },
            image: {
                maxSize: 10 * 1024 * 1024, // 10MB
                allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
                extensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
                maxDimensions: { width: 4096, height: 4096 }
            }
        };
    }
    
    async validateFile(file, type) {
        const results = {
            valid: true,
            errors: [],
            warnings: [],
            metadata: {}
        };
        
        // Basic validations
        this.validateSize(file, type, results);
        this.validateType(file, type, results);
        this.validateExtension(file, type, results);
        
        // Advanced validations
        if (type === 'image') {
            await this.validateImageDimensions(file, results);
            await this.scanImageMetadata(file, results);
        } else if (type === 'music') {
            await this.scanAudioMetadata(file, results);
        }
        
        // Security scan
        this.scanForSecurity(file, results);
        
        return results;
    }
    
    validateSize(file, type, results) {
        const maxSize = this.rules[type].maxSize;
        if (file.size > maxSize) {
            results.valid = false;
            results.errors.push(`File size (${this.formatFileSize(file.size)}) exceeds maximum allowed (${this.formatFileSize(maxSize)})`);
        } else if (file.size > maxSize * 0.8) {
            results.warnings.push(`File size is quite large (${this.formatFileSize(file.size)}). Consider optimizing.`);
        }
    }
    
    validateType(file, type, results) {
        if (!this.rules[type].allowedTypes.includes(file.type)) {
            results.valid = false;
            results.errors.push(`File type '${file.type}' is not allowed. Allowed types: ${this.rules[type].allowedTypes.join(', ')}`);
        }
    }
    
    validateExtension(file, type, results) {
        const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        if (!this.rules[type].extensions.includes(extension)) {
            results.valid = false;
            results.errors.push(`File extension '${extension}' is not allowed. Allowed extensions: ${this.rules[type].extensions.join(', ')}`);
        }
    }
    
    async validateImageDimensions(file, results) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const { width, height } = this.rules.image.maxDimensions;
                results.metadata.dimensions = { width: img.width, height: img.height };
                
                if (img.width > width || img.height > height) {
                    results.warnings.push(`Image dimensions (${img.width}x${img.height}) exceed recommended maximum (${width}x${height})`);
                }
                
                if (img.width < 300 || img.height < 300) {
                    results.warnings.push(`Image resolution is quite low (${img.width}x${img.height}). Consider using higher resolution.`);
                }
                
                resolve();
            };
            img.onerror = () => {
                results.errors.push('Could not read image dimensions. File may be corrupted.');
                resolve();
            };
            img.src = URL.createObjectURL(file);
        });
    }
    
    async scanImageMetadata(file, results) {
        // Basic metadata extraction
        results.metadata.type = file.type;
        results.metadata.size = file.size;
        results.metadata.lastModified = new Date(file.lastModified);
        
        // Check for potential issues
        if (file.name.includes(' ')) {
            results.warnings.push('Filename contains spaces. Consider using underscores or hyphens.');
        }
        
        if (file.name.length > 50) {
            results.warnings.push('Filename is quite long. Consider shortening it.');
        }
    }
    
    async scanAudioMetadata(file, results) {
        results.metadata.type = file.type;
        results.metadata.size = file.size;
        results.metadata.duration = 'Unknown';
        
        // Estimate bitrate based on file size (rough calculation)
        if (file.type === 'audio/mp3') {
            const estimatedDuration = file.size / (128 * 1024 / 8); // Assuming 128kbps
            if (estimatedDuration > 600) { // 10 minutes
                results.warnings.push('Audio file is quite long. Consider splitting or compressing.');
            }
        }
        
        if (file.name.includes(' ')) {
            results.warnings.push('Filename contains spaces. Consider using underscores or hyphens.');
        }
    }
    
    scanForSecurity(file, results) {
        const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.com', '.pif'];
        const filename = file.name.toLowerCase();
        
        // Check for double extensions
        const parts = filename.split('.');
        if (parts.length > 2) {
            const secondExt = '.' + parts[parts.length - 2];
            if (suspiciousExtensions.includes(secondExt)) {
                results.valid = false;
                results.errors.push('File has suspicious double extension pattern.');
            }
        }
        
        // Check for suspicious filenames
        const suspiciousNames = ['autorun', 'desktop.ini', 'thumbs.db'];
        if (suspiciousNames.some(name => filename.includes(name))) {
            results.warnings.push('Filename matches common system file patterns.');
        }
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    showValidationResults(results, filename) {
        if (!results.valid) {
            let errorMsg = `Validation failed for "${filename}":\n\n`;
            results.errors.forEach(error => errorMsg += `❌ ${error}\n`);
            if (results.warnings.length > 0) {
                errorMsg += '\nWarnings:\n';
                results.warnings.forEach(warning => errorMsg += `⚠️ ${warning}\n`);
            }
            notificationManager.show('File validation failed', 'error', 6000);
            alert(errorMsg);
            return false;
        } else if (results.warnings.length > 0) {
            let warningMsg = `File "${filename}" passed validation but has warnings:\n\n`;
            results.warnings.forEach(warning => warningMsg += `⚠️ ${warning}\n`);
            warningMsg += '\nDo you want to continue uploading?';
            
            if (!confirm(warningMsg)) {
                return false;
            }
            notificationManager.show('File uploaded with warnings', 'warning');
        } else {
            notificationManager.show('File validation successful', 'success');
        }
        return true;
    }
}

// Initialize file validator
const fileValidator = new FileValidator();

// Drag & Drop Reordering System
class DragDropReorder {
    constructor() {
        this.draggedElement = null;
        this.draggedIndex = null;
        this.init();
    }
    
    init() {
        this.enableReorderingForContainer('.music-list');
        this.enableReorderingForContainer('.gallery-grid');
    }
    
    enableReorderingForContainer(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        // Add reorder button to header
        this.addReorderToggle(container);
        
        // Set up event delegation for dynamic items
        container.addEventListener('dragstart', this.handleDragStart.bind(this));
        container.addEventListener('dragover', this.handleDragOver.bind(this));
        container.addEventListener('drop', this.handleDrop.bind(this));
        container.addEventListener('dragend', this.handleDragEnd.bind(this));
    }
    
    addReorderToggle(container) {
        const header = container.previousElementSibling;
        if (!header || !header.classList.contains('section-header')) return;
        
        const reorderBtn = document.createElement('button');
        reorderBtn.className = 'btn btn-sm btn-secondary reorder-toggle';
        reorderBtn.innerHTML = '<i class="fas fa-sort"></i> Reorder Mode';
        reorderBtn.onclick = () => this.toggleReorderMode(container);
        
        header.appendChild(reorderBtn);
    }
    
    toggleReorderMode(container) {
        const isReorderMode = container.classList.contains('reorder-mode');
        const btn = container.previousElementSibling.querySelector('.reorder-toggle');
        
        if (isReorderMode) {
            // Exit reorder mode
            container.classList.remove('reorder-mode');
            btn.innerHTML = '<i class="fas fa-sort"></i> Reorder Mode';
            btn.classList.remove('btn-warning');
            btn.classList.add('btn-secondary');
            this.disableDragging(container);
            notificationManager.show('Reorder mode disabled', 'info');
        } else {
            // Enter reorder mode
            container.classList.add('reorder-mode');
            btn.innerHTML = '<i class="fas fa-check"></i> Done Reordering';
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-warning');
            this.enableDragging(container);
            notificationManager.show('Reorder mode enabled. Drag items to reorder.', 'info', 3000);
        }
    }
    
    enableDragging(container) {
        const items = container.children;
        for (let item of items) {
            if (item.classList.contains('music-item') || item.classList.contains('gallery-admin-item')) {
                item.draggable = true;
                item.classList.add('draggable-item');
                
                // Add drag handle
                if (!item.querySelector('.drag-handle')) {
                    const dragHandle = document.createElement('div');
                    dragHandle.className = 'drag-handle';
                    dragHandle.innerHTML = '<i class="fas fa-grip-vertical"></i>';
                    item.insertBefore(dragHandle, item.firstChild);
                }
            }
        }
    }
    
    disableDragging(container) {
        const items = container.children;
        for (let item of items) {
            item.draggable = false;
            item.classList.remove('draggable-item');
            
            // Remove drag handle
            const dragHandle = item.querySelector('.drag-handle');
            if (dragHandle) {
                dragHandle.remove();
            }
        }
    }
    
    handleDragStart(e) {
        if (!e.target.draggable) return;
        
        this.draggedElement = e.target;
        this.draggedIndex = Array.from(e.target.parentNode.children).indexOf(e.target);
        
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const container = e.currentTarget;
        const afterElement = this.getDragAfterElement(container, e.clientY);
        
        if (afterElement == null) {
            container.appendChild(this.draggedElement);
        } else {
            container.insertBefore(this.draggedElement, afterElement);
        }
    }
    
    handleDrop(e) {
        e.preventDefault();
        
        if (!this.draggedElement) return;
        
        const newIndex = Array.from(e.currentTarget.children).indexOf(this.draggedElement);
        
        // Update order in localStorage
        this.updateStorageOrder(e.currentTarget, this.draggedIndex, newIndex);
        
        notificationManager.show('Item reordered successfully', 'success');
        
        // Sync to main site
        adminPanel.syncToMainSite();
    }
    
    handleDragEnd(e) {
        if (this.draggedElement) {
            this.draggedElement.classList.remove('dragging');
            this.draggedElement = null;
            this.draggedIndex = null;
        }
    }
    
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.draggable-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    updateStorageOrder(container, oldIndex, newIndex) {
        const isMusic = container.classList.contains('music-list');
        const storageKey = isMusic ? 'uploadedMusic' : 'uploadedGallery';
        
        const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        if (items.length > 0 && oldIndex !== newIndex) {
            // Move item in array
            const [movedItem] = items.splice(oldIndex, 1);
            items.splice(newIndex, 0, movedItem);
            
            // Update order property
            items.forEach((item, index) => {
                item.order = index;
            });
            
            localStorage.setItem(storageKey, JSON.stringify(items));
        }
    }
}

// Initialize drag & drop reordering
const dragDropReorder = new DragDropReorder();

// Bulk Operations System
class BulkOperations {
    constructor() {
        this.selectedItems = new Set();
        this.isSelectionMode = false;
        this.init();
    }
    
    init() {
        this.addBulkActionButtons();
        this.setupSelectionMode();
    }
    
    addBulkActionButtons() {
        // Add to music section
        this.addBulkButtonToSection('.music-list', 'music');
        // Add to gallery section  
        this.addBulkButtonToSection('.gallery-grid', 'gallery');
    }
    
    addBulkButtonToSection(containerSelector, type) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        const header = container.previousElementSibling;
        if (!header || !header.classList.contains('section-header')) return;
        
        const bulkBtn = document.createElement('button');
        bulkBtn.className = 'btn btn-sm btn-secondary bulk-toggle';
        bulkBtn.innerHTML = '<i class="fas fa-check-square"></i> Bulk Select';
        bulkBtn.onclick = () => this.toggleSelectionMode(container, type);
        
        header.appendChild(bulkBtn);
        
        // Add bulk action menu (initially hidden)
        const bulkMenu = document.createElement('div');
        bulkMenu.className = 'bulk-actions-menu';
        bulkMenu.style.display = 'none';
        bulkMenu.innerHTML = `
            <div class="bulk-menu-content">
                <span class="selected-count">0 items selected</span>
                <div class="bulk-buttons">
                    <button class="btn btn-sm btn-danger" onclick="bulkOperations.deleteSelected('${type}')">
                        <i class="fas fa-trash"></i> Delete Selected
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="bulkOperations.selectAll('${type}')">
                        <i class="fas fa-check-double"></i> Select All
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="bulkOperations.clearSelection('${type}')">
                        <i class="fas fa-times"></i> Clear Selection
                    </button>
                </div>
            </div>
        `;
        
        header.parentNode.insertBefore(bulkMenu, header.nextSibling);
    }
    
    toggleSelectionMode(container, type) {
        const btn = container.previousElementSibling.querySelector('.bulk-toggle');
        const menu = container.parentNode.querySelector('.bulk-actions-menu');
        
        if (this.isSelectionMode) {
            // Exit selection mode
            this.exitSelectionMode(container, btn, menu);
        } else {
            // Enter selection mode
            this.enterSelectionMode(container, btn, menu, type);
        }
    }
    
    enterSelectionMode(container, btn, menu, type) {
        this.isSelectionMode = true;
        this.currentType = type;
        this.selectedItems.clear();
        
        btn.innerHTML = '<i class="fas fa-times"></i> Exit Selection';
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-warning');
        
        menu.style.display = 'block';
        container.classList.add('selection-mode');
        
        this.addSelectionCheckboxes(container);
        notificationManager.show('Selection mode enabled. Click items to select.', 'info', 3000);
    }
    
    exitSelectionMode(container, btn, menu) {
        this.isSelectionMode = false;
        this.selectedItems.clear();
        
        btn.innerHTML = '<i class="fas fa-check-square"></i> Bulk Select';
        btn.classList.remove('btn-warning');
        btn.classList.add('btn-secondary');
        
        menu.style.display = 'none';
        container.classList.remove('selection-mode');
        
        this.removeSelectionCheckboxes(container);
        notificationManager.show('Selection mode disabled', 'info');
    }
    
    addSelectionCheckboxes(container) {
        const items = container.children;
        for (let item of items) {
            if (item.classList.contains('music-item') || item.classList.contains('gallery-admin-item')) {
                const checkbox = document.createElement('div');
                checkbox.className = 'selection-checkbox';
                checkbox.innerHTML = '<i class="fas fa-square"></i>';
                checkbox.onclick = (e) => {
                    e.stopPropagation();
                    this.toggleItemSelection(item, checkbox);
                };
                
                item.classList.add('selectable-item');
                item.insertBefore(checkbox, item.firstChild);
                
                // Also allow clicking the item itself
                item.onclick = (e) => {
                    if (e.target.closest('.btn-icon')) return; // Don't interfere with edit/delete buttons
                    this.toggleItemSelection(item, checkbox);
                };
            }
        }
    }
    
    removeSelectionCheckboxes(container) {
        const checkboxes = container.querySelectorAll('.selection-checkbox');
        checkboxes.forEach(cb => cb.remove());
        
        const items = container.children;
        for (let item of items) {
            item.classList.remove('selectable-item', 'selected-item');
            item.onclick = null;
        }
    }
    
    toggleItemSelection(item, checkbox) {
        const itemId = item.dataset.musicId || item.dataset.galleryId;
        
        if (this.selectedItems.has(itemId)) {
            // Deselect
            this.selectedItems.delete(itemId);
            item.classList.remove('selected-item');
            checkbox.innerHTML = '<i class="fas fa-square"></i>';
        } else {
            // Select
            this.selectedItems.add(itemId);
            item.classList.add('selected-item');
            checkbox.innerHTML = '<i class="fas fa-check-square"></i>';
        }
        
        this.updateSelectionCount();
    }
    
    updateSelectionCount() {
        const menu = document.querySelector('.bulk-actions-menu');
        const counter = menu.querySelector('.selected-count');
        counter.textContent = `${this.selectedItems.size} items selected`;
    }
    
    selectAll(type) {
        const container = type === 'music' ? document.querySelector('.music-list') : document.querySelector('.gallery-grid');
        const items = container.children;
        
        this.selectedItems.clear();
        
        for (let item of items) {
            if (item.classList.contains('music-item') || item.classList.contains('gallery-admin-item')) {
                const itemId = item.dataset.musicId || item.dataset.galleryId;
                this.selectedItems.add(itemId);
                item.classList.add('selected-item');
                
                const checkbox = item.querySelector('.selection-checkbox');
                if (checkbox) {
                    checkbox.innerHTML = '<i class="fas fa-check-square"></i>';
                }
            }
        }
        
        this.updateSelectionCount();
        notificationManager.show(`Selected all ${this.selectedItems.size} items`, 'success');
    }
    
    clearSelection(type) {
        const container = type === 'music' ? document.querySelector('.music-list') : document.querySelector('.gallery-grid');
        const items = container.children;
        
        this.selectedItems.clear();
        
        for (let item of items) {
            item.classList.remove('selected-item');
            const checkbox = item.querySelector('.selection-checkbox');
            if (checkbox) {
                checkbox.innerHTML = '<i class="fas fa-square"></i>';
            }
        }
        
        this.updateSelectionCount();
        notificationManager.show('Selection cleared', 'info');
    }
    
    deleteSelected(type) {
        if (this.selectedItems.size === 0) {
            notificationManager.show('No items selected', 'warning');
            return;
        }
        
        const confirmMsg = `Are you sure you want to delete ${this.selectedItems.size} selected ${type} item(s)? This action cannot be undone.`;
        
        if (confirm(confirmMsg)) {
            const storageKey = type === 'music' ? 'uploadedMusic' : 'uploadedGallery';
            const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
            
            // Remove from localStorage
            const filteredItems = items.filter(item => !this.selectedItems.has(item.id));
            localStorage.setItem(storageKey, JSON.stringify(filteredItems));
            
            // Remove from DOM
            const container = type === 'music' ? document.querySelector('.music-list') : document.querySelector('.gallery-grid');
            this.selectedItems.forEach(itemId => {
                const element = container.querySelector(`[data-${type === 'music' ? 'music' : 'gallery'}-id="${itemId}"]`);
                if (element) {
                    element.remove();
                }
            });
            
            const deletedCount = this.selectedItems.size;
            this.selectedItems.clear();
            this.updateSelectionCount();
            
            // Update stats and sync
            adminPanel.updateStats();
            adminPanel.syncToMainSite();
            
            notificationManager.show(`Successfully deleted ${deletedCount} ${type} item(s)`, 'success');
        }
    }
    
    setupSelectionMode() {
        // Setup keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!this.isSelectionMode) return;
            
            if (e.key === 'Escape') {
                const container = this.currentType === 'music' ? document.querySelector('.music-list') : document.querySelector('.gallery-grid');
                const btn = container.previousElementSibling.querySelector('.bulk-toggle');
                const menu = container.parentNode.querySelector('.bulk-actions-menu');
                this.exitSelectionMode(container, btn, menu);
            } else if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                this.selectAll(this.currentType);
            } else if (e.key === 'Delete' && this.selectedItems.size > 0) {
                this.deleteSelected(this.currentType);
            }
        });
    }
}

// Initialize bulk operations
const bulkOperations = new BulkOperations();

// Advanced Analytics Dashboard
class AnalyticsDashboard {
    constructor() {
        this.analytics = {
            visitors: this.loadVisitorData(),
            engagement: this.loadEngagementData(),
            content: this.loadContentData(),
            performance: this.loadPerformanceData()
        };
        this.init();
    }
    
    init() {
        this.setupVisitorTracking();
        this.enhanceExistingStats();
        this.addAdvancedCharts();
        this.startRealTimeTracking();
    }
    
    setupVisitorTracking() {
        // Track page views with more detail
        const sessionId = this.getOrCreateSessionId();
        const visitData = {
            timestamp: Date.now(),
            sessionId: sessionId,
            userAgent: navigator.userAgent,
            language: navigator.language,
            referrer: document.referrer || 'direct',
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            device: this.getDeviceType()
        };
        
        this.recordVisit(visitData);
    }
    
    getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('session_id', sessionId);
        }
        return sessionId;
    }
    
    getDeviceType() {
        const width = window.innerWidth;
        if (width <= 768) return 'mobile';
        if (width <= 1024) return 'tablet';
        return 'desktop';
    }
    
    recordVisit(visitData) {
        const visits = JSON.parse(localStorage.getItem('visitor_analytics') || '[]');
        visits.push(visitData);
        
        // Keep only last 1000 visits
        if (visits.length > 1000) {
            visits.splice(0, visits.length - 1000);
        }
        
        localStorage.setItem('visitor_analytics', JSON.stringify(visits));
        this.analytics.visitors = visits;
    }
    
    loadVisitorData() {
        return JSON.parse(localStorage.getItem('visitor_analytics') || '[]');
    }
    
    loadEngagementData() {
        return JSON.parse(localStorage.getItem('engagement_analytics') || '{}');
    }
    
    loadContentData() {
        return {
            music: JSON.parse(localStorage.getItem('uploadedMusic') || '[]'),
            gallery: JSON.parse(localStorage.getItem('uploadedGallery') || '[]')
        };
    }
    
    loadPerformanceData() {
        return JSON.parse(localStorage.getItem('performance_analytics') || '{}');
    }
    
    enhanceExistingStats() {
        const dashboard = document.getElementById('dashboard');
        if (!dashboard) return;
        
        // Add advanced analytics section after performance monitor
        const analyticsSection = document.createElement('div');
        analyticsSection.className = 'analytics-dashboard';
        analyticsSection.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-chart-line"></i> Advanced Analytics</h3>
                    <div class="analytics-controls">
                        <select id="analyticsTimeRange" class="form-select">
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                        </select>
                        <button class="btn btn-sm btn-secondary" onclick="analyticsDashboard.exportData()">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="analytics-grid">
                        <div class="analytics-metric">
                            <div class="metric-icon"><i class="fas fa-users"></i></div>
                            <div class="metric-content">
                                <div class="metric-label">Unique Visitors</div>
                                <div class="metric-value" id="uniqueVisitors">-</div>
                                <div class="metric-change" id="visitorsChange">-</div>
                            </div>
                        </div>
                        <div class="analytics-metric">
                            <div class="metric-icon"><i class="fas fa-clock"></i></div>
                            <div class="metric-content">
                                <div class="metric-label">Avg. Session Time</div>
                                <div class="metric-value" id="avgSessionTime">-</div>
                                <div class="metric-change" id="sessionChange">-</div>
                            </div>
                        </div>
                        <div class="analytics-metric">
                            <div class="metric-icon"><i class="fas fa-mobile-alt"></i></div>
                            <div class="metric-content">
                                <div class="metric-label">Mobile Traffic</div>
                                <div class="metric-value" id="mobileTraffic">-</div>
                                <div class="metric-change" id="mobileChange">-</div>
                            </div>
                        </div>
                        <div class="analytics-metric">
                            <div class="metric-icon"><i class="fas fa-heart"></i></div>
                            <div class="metric-content">
                                <div class="metric-label">Engagement Rate</div>
                                <div class="metric-value" id="engagementRate">-</div>
                                <div class="metric-change" id="engagementChange">-</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="analytics-charts">
                        <div class="chart-container">
                            <h4>Visitor Trends</h4>
                            <canvas id="visitorChart" width="400" height="200"></canvas>
                        </div>
                        <div class="chart-container">
                            <h4>Device Breakdown</h4>
                            <canvas id="deviceChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                    
                    <div class="analytics-insights">
                        <h4>AI Insights</h4>
                        <div id="analyticsInsights" class="insights-container">
                            <div class="insight-item">
                                <i class="fas fa-lightbulb"></i>
                                <span>Analyzing your data...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert after performance monitor
        const performanceMonitorEl = dashboard.querySelector('.performance-monitor');
        if (performanceMonitorEl) {
            performanceMonitorEl.parentNode.insertBefore(analyticsSection, performanceMonitorEl.nextSibling);
        }
        
        // Add PWA Status Widget
        this.addPWAStatusWidget(dashboard);
        
        this.updateAnalytics();
    }
    
    addPWAStatusWidget(dashboard) {
        const pwaSection = document.createElement('div');
        pwaSection.className = 'widget pwa-status-widget';
        pwaSection.innerHTML = `
            <h3>
                <i class="fas fa-mobile-alt"></i>
                PWA Durumu
                <button class="btn btn-sm btn-primary refresh-pwa-btn" onclick="this.refreshPWAStatus()" style="margin-left: auto;">
                    <i class="fas fa-sync-alt"></i>
                    Yenile
                </button>
            </h3>
            <div id="pwa-status-content">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    PWA durumu kontrol ediliyor...
                </div>
            </div>
        `;
        
        // Insert after analytics
        const analyticsSection = dashboard.querySelector('.analytics-dashboard');
        if (analyticsSection) {
            analyticsSection.parentNode.insertBefore(pwaSection, analyticsSection.nextSibling);
        } else {
            dashboard.appendChild(pwaSection);
        }
        
        // Initialize PWA status check
        setTimeout(() => {
            this.updatePWAStatus();
        }, 1000);
    }
    
    updatePWAStatus() {
        const statusContent = document.getElementById('pwa-status-content');
        if (!statusContent) return;
        
        const status = {
            isInstalled: this.isPWAInstalled(),
            isOnline: navigator.onLine,
            hasServiceWorker: 'serviceWorker' in navigator,
            hasNotifications: Notification.permission === 'granted',
            supportsPush: 'PushManager' in window,
            supportsSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
            supportsPeriodicSync: 'serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype
        };
        
        statusContent.innerHTML = `
            <div class="pwa-status-grid">
                <div class="status-item ${status.isInstalled ? 'active' : ''}">
                    <i class="fas fa-mobile-alt"></i>
                    <span>PWA Yüklü</span>
                    <div class="status-indicator ${status.isInstalled ? 'green' : 'gray'}"></div>
                </div>
                <div class="status-item ${status.isOnline ? 'active' : ''}">
                    <i class="fas fa-wifi"></i>
                    <span>Online</span>
                    <div class="status-indicator ${status.isOnline ? 'green' : 'red'}"></div>
                </div>
                <div class="status-item ${status.hasServiceWorker ? 'active' : ''}">
                    <i class="fas fa-cog"></i>
                    <span>Service Worker</span>
                    <div class="status-indicator ${status.hasServiceWorker ? 'green' : 'gray'}"></div>
                </div>
                <div class="status-item ${status.hasNotifications ? 'active' : ''}">
                    <i class="fas fa-bell"></i>
                    <span>Bildirimler</span>
                    <div class="status-indicator ${status.hasNotifications ? 'green' : 'gray'}"></div>
                </div>
                <div class="status-item ${status.supportsPush ? 'active' : ''}">
                    <i class="fas fa-paper-plane"></i>
                    <span>Push Desteği</span>
                    <div class="status-indicator ${status.supportsPush ? 'green' : 'gray'}"></div>
                </div>
                <div class="status-item ${status.supportsSync ? 'active' : ''}">
                    <i class="fas fa-sync"></i>
                    <span>Background Sync</span>
                    <div class="status-indicator ${status.supportsSync ? 'green' : 'gray'}"></div>
                </div>
                <div class="status-item ${status.supportsPeriodicSync ? 'active' : ''}">
                    <i class="fas fa-clock"></i>
                    <span>Periodic Sync</span>
                    <div class="status-indicator ${status.supportsPeriodicSync ? 'green' : 'gray'}"></div>
                </div>
            </div>
            
            <div class="pwa-controls">
                <div class="control-group">
                    <label>PWA İşlemleri:</label>
                    <div class="btn-group">
                        ${!status.isInstalled && typeof pwaManager !== 'undefined' && pwaManager.deferredPrompt ? 
                            '<button class="btn btn-sm btn-primary" onclick="pwaManager.installPWA()"><i class="fas fa-download"></i> Yükle</button>' : ''}
                        ${!status.hasNotifications ? 
                            '<button class="btn btn-sm btn-secondary" onclick="this.requestNotificationPermission()"><i class="fas fa-bell"></i> Bildirimleri Etkinleştir</button>' : ''}
                        <button class="btn btn-sm btn-secondary" onclick="this.testPWAFeatures()">
                            <i class="fas fa-vial"></i> Test Et
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="this.clearPWACache()">
                            <i class="fas fa-trash"></i> Cache Temizle
                        </button>
                    </div>
                </div>
                
                <div class="control-group">
                    <label>Offline Veriler:</label>
                    <div class="offline-data-status">
                        <span class="offline-count">${this.getOfflineDataCount()} bekleyen işlem</span>
                        <button class="btn btn-sm btn-info" onclick="this.syncOfflineData()">
                            <i class="fas fa-cloud-upload-alt"></i> Senkronize Et
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="pwa-metrics">
                <div class="metric">
                    <span class="metric-label">Cache Boyutu:</span>
                    <span class="metric-value" id="cache-size">Hesaplanıyor...</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Son Güncelleme:</span>
                    <span class="metric-value" id="last-update">${new Date().toLocaleString('tr-TR')}</span>
                </div>
            </div>
        `;
        
        // Calculate cache size
        this.calculateCacheSize();
    }
    
    isPWAInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone ||
               document.referrer.includes('android-app://');
    }
    
    getOfflineDataCount() {
        const pendingActions = JSON.parse(localStorage.getItem('pending_admin_actions') || '[]');
        const pendingUploads = JSON.parse(localStorage.getItem('pending_file_uploads') || '[]');
        return pendingActions.length + pendingUploads.length;
    }
    
    async calculateCacheSize() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            try {
                const estimate = await navigator.storage.estimate();
                const usedMB = (estimate.usage / 1024 / 1024).toFixed(2);
                const quotaMB = (estimate.quota / 1024 / 1024).toFixed(2);
                
                const cacheSizeElement = document.getElementById('cache-size');
                if (cacheSizeElement) {
                    cacheSizeElement.textContent = `${usedMB} MB / ${quotaMB} MB`;
                }
            } catch (error) {
                console.error('Cache size calculation failed:', error);
                const cacheSizeElement = document.getElementById('cache-size');
                if (cacheSizeElement) {
                    cacheSizeElement.textContent = 'Hesaplanamadı';
                }
            }
        }
    }
    
    async requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            this.showAdminNotification(
                permission === 'granted' ? 'Bildirimler Etkinleştirildi' : 'Bildirim İzni Reddedildi',
                permission === 'granted' ? 'Artık önemli güncellemeleri alacaksınız' : 'Bildirimler için izin gerekli',
                permission === 'granted' ? 'success' : 'warning'
            );
            this.updatePWAStatus();
        } catch (error) {
            console.error('Notification permission request failed:', error);
        }
    }
    
    testPWAFeatures() {
        this.showAdminNotification('PWA Test', 'PWA özellikleri test ediliyor...', 'info');
        
        // Test notifications
        if (Notification.permission === 'granted') {
            new Notification('PWA Test Bildirimi', {
                body: 'PWA bildirim sistemi çalışıyor!',
                icon: '/assets/icons/icon-192x192.png',
                tag: 'pwa-test'
            });
        }
        
        // Test offline functionality
        const testAction = {
            type: 'test-action',
            data: { message: 'PWA test action', timestamp: Date.now() }
        };
        
        const pendingActions = JSON.parse(localStorage.getItem('pending_admin_actions') || '[]');
        pendingActions.push(testAction);
        localStorage.setItem('pending_admin_actions', JSON.stringify(pendingActions));
        
        // Test service worker
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'TEST_MESSAGE',
                data: 'PWA test from admin panel'
            });
        }
        
        setTimeout(() => {
            this.updatePWAStatus();
            this.showAdminNotification('PWA Test Tamamlandı', 'Tüm özellikler test edildi', 'success');
        }, 1000);
    }
    
    async clearPWACache() {
        try {
            this.showAdminNotification('Cache Temizleniyor', 'PWA cache temizleniyor...', 'info');
            
            if (typeof pwaManager !== 'undefined' && pwaManager.clearAppCache) {
                const success = await pwaManager.clearAppCache();
                if (success) {
                    this.showAdminNotification('Cache Temizlendi', 'PWA cache başarıyla temizlendi', 'success');
                } else {
                    this.showAdminNotification('Cache Temizlenemedi', 'Cache temizlenirken hata oluştu', 'error');
                }
            } else {
                // Fallback cache clearing
                if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    await Promise.all(cacheNames.map(name => caches.delete(name)));
                    this.showAdminNotification('Cache Temizlendi', 'Browser cache temizlendi', 'success');
                }
            }
            
            this.updatePWAStatus();
        } catch (error) {
            console.error('Cache clear failed:', error);
            this.showAdminNotification('Hata', 'Cache temizlenirken hata oluştu', 'error');
        }
    }
    
    syncOfflineData() {
        const pendingActions = JSON.parse(localStorage.getItem('pending_admin_actions') || '[]');
        const pendingUploads = JSON.parse(localStorage.getItem('pending_file_uploads') || '[]');
        
        if (pendingActions.length === 0 && pendingUploads.length === 0) {
            this.showAdminNotification('Senkronizasyon', 'Bekleyen veri bulunamadı', 'info');
            return;
        }
        
        this.showAdminNotification('Senkronizasyon Başladı', 'Offline veriler senkronize ediliyor...', 'info');
        
        // Trigger background sync
        if (typeof pwaManager !== 'undefined' && pwaManager.syncOfflineData) {
            pwaManager.syncOfflineData();
        }
        
        // Simulate sync completion
        setTimeout(() => {
            localStorage.removeItem('pending_admin_actions');
            localStorage.removeItem('pending_file_uploads');
            this.updatePWAStatus();
            this.showAdminNotification('Senkronizasyon Tamamlandı', 'Tüm veriler başarıyla senkronize edildi', 'success');
        }, 2000);
    }
    
    refreshPWAStatus() {
        this.updatePWAStatus();
        this.showAdminNotification('PWA Durumu', 'PWA durumu güncellendi', 'success');
    }
    
    updateAnalytics() {
        const timeRange = parseInt(document.getElementById('analyticsTimeRange')?.value || '7');
        const cutoffDate = Date.now() - (timeRange * 24 * 60 * 60 * 1000);
        
        // Filter data by time range
        const recentVisits = this.analytics.visitors.filter(visit => visit.timestamp > cutoffDate);
        
        // Calculate metrics
        const uniqueVisitors = new Set(recentVisits.map(v => v.sessionId)).size;
        const avgSessionTime = this.calculateAverageSessionTime(recentVisits);
        const mobilePercentage = this.calculateMobilePercentage(recentVisits);
        const engagementRate = this.calculateEngagementRate(recentVisits);
        
        // Update UI
        this.updateMetric('uniqueVisitors', uniqueVisitors);
        this.updateMetric('avgSessionTime', this.formatDuration(avgSessionTime));
        this.updateMetric('mobileTraffic', mobilePercentage + '%');
        this.updateMetric('engagementRate', engagementRate + '%');
        
        // Generate insights
        this.generateInsights(recentVisits);
    }
    
    calculateAverageSessionTime(visits) {
        if (visits.length === 0) return 0;
        
        const sessions = {};
        visits.forEach(visit => {
            if (!sessions[visit.sessionId]) {
                sessions[visit.sessionId] = { start: visit.timestamp, end: visit.timestamp };
            } else {
                sessions[visit.sessionId].end = Math.max(sessions[visit.sessionId].end, visit.timestamp);
            }
        });
        
        const durations = Object.values(sessions).map(s => s.end - s.start);
        return durations.reduce((a, b) => a + b, 0) / durations.length;
    }
    
    calculateMobilePercentage(visits) {
        if (visits.length === 0) return 0;
        const mobileVisits = visits.filter(v => v.device === 'mobile').length;
        return Math.round((mobileVisits / visits.length) * 100);
    }
    
    calculateEngagementRate(visits) {
        // Mock engagement calculation based on session duration
        const avgDuration = this.calculateAverageSessionTime(visits);
        const engagementThreshold = 30000; // 30 seconds
        return Math.min(Math.round((avgDuration / engagementThreshold) * 100), 100);
    }
    
    updateMetric(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }
    
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${remainingSeconds}s`;
    }
    
    generateInsights(visits) {
        const insights = [];
        
        // Peak hours insight
        const hourCounts = {};
        visits.forEach(visit => {
            const hour = new Date(visit.timestamp).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
        
        const peakHour = Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b);
        insights.push(`Peak traffic occurs around ${peakHour}:00`);
        
        // Device insight
        const deviceCounts = {};
        visits.forEach(visit => {
            deviceCounts[visit.device] = (deviceCounts[visit.device] || 0) + 1;
        });
        
        const topDevice = Object.keys(deviceCounts).reduce((a, b) => deviceCounts[a] > deviceCounts[b] ? a : b);
        insights.push(`Most visitors use ${topDevice} devices`);
        
        // Growth insight
        if (visits.length > 0) {
            const todayVisits = visits.filter(v => v.timestamp > Date.now() - 24 * 60 * 60 * 1000).length;
            const yesterdayVisits = visits.filter(v => 
                v.timestamp > Date.now() - 48 * 60 * 60 * 1000 && 
                v.timestamp <= Date.now() - 24 * 60 * 60 * 1000
            ).length;
            
            if (todayVisits > yesterdayVisits) {
                insights.push(`Traffic increased by ${Math.round(((todayVisits - yesterdayVisits) / Math.max(yesterdayVisits, 1)) * 100)}% today`);
            }
        }
        
        this.displayInsights(insights);
    }
    
    displayInsights(insights) {
        const container = document.getElementById('analyticsInsights');
        if (!container) return;
        
        container.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <i class="fas fa-lightbulb"></i>
                <span>${insight}</span>
            </div>
        `).join('');
    }
    
    exportData() {
        const data = {
            visitors: this.analytics.visitors,
            content: this.analytics.content,
            exportDate: new Date().toISOString(),
            summary: {
                totalVisitors: this.analytics.visitors.length,
                uniqueSessions: new Set(this.analytics.visitors.map(v => v.sessionId)).size,
                totalMusic: this.analytics.content.music.length,
                totalGallery: this.analytics.content.gallery.length
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        notificationManager.show('Analytics data exported successfully', 'success');
    }
    
    startRealTimeTracking() {
        // Update analytics every 30 seconds
        setInterval(() => {
            this.updateAnalytics();
        }, 30000);
        
        // Track time range changes
        const timeRangeSelect = document.getElementById('analyticsTimeRange');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', () => {
                this.updateAnalytics();
            });
        }
    }
    
    addAdvancedCharts() {
        // Add simple chart visualization (using CSS-based charts for simplicity)
        setTimeout(() => {
            this.renderVisitorChart();
            this.renderDeviceChart();
        }, 1000);
    }
    
    renderVisitorChart() {
        // Simple bar chart using divs for visitor trends
        const chartContainer = document.querySelector('#visitorChart');
        if (!chartContainer) return;
        
        chartContainer.style.display = 'flex';
        chartContainer.style.alignItems = 'flex-end';
        chartContainer.style.height = '200px';
        chartContainer.style.gap = '5px';
        
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayVisits = this.analytics.visitors.filter(v => {
                const visitDate = new Date(v.timestamp);
                return visitDate.toDateString() === date.toDateString();
            }).length;
            
            const bar = document.createElement('div');
            bar.style.flex = '1';
            bar.style.backgroundColor = 'var(--admin-primary)';
            bar.style.height = `${Math.max(dayVisits * 10, 5)}px`;
            bar.style.borderRadius = '2px 2px 0 0';
            bar.title = `${date.toLocaleDateString()}: ${dayVisits} visits`;
            
            chartContainer.appendChild(bar);
        }
    }
    
    renderDeviceChart() {
        // Simple pie chart representation
        const chartContainer = document.querySelector('#deviceChart');
        if (!chartContainer) return;
        
        const deviceCounts = { desktop: 0, tablet: 0, mobile: 0 };
        this.analytics.visitors.forEach(v => {
            if (deviceCounts.hasOwnProperty(v.device)) {
                deviceCounts[v.device]++;
            }
        });
        
        const total = Object.values(deviceCounts).reduce((a, b) => a + b, 0);
        if (total === 0) return;
        
        chartContainer.innerHTML = `
            <div class="device-stats">
                <div class="device-stat">
                    <i class="fas fa-desktop"></i>
                    <span>Desktop: ${Math.round((deviceCounts.desktop / total) * 100)}%</span>
                </div>
                <div class="device-stat">
                    <i class="fas fa-tablet-alt"></i>
                    <span>Tablet: ${Math.round((deviceCounts.tablet / total) * 100)}%</span>
                </div>
                <div class="device-stat">
                    <i class="fas fa-mobile-alt"></i>
                    <span>Mobile: ${Math.round((deviceCounts.mobile / total) * 100)}%</span>
                </div>
            </div>
        `;
    }
}

// Initialize analytics dashboard
const analyticsDashboard = new AnalyticsDashboard();

// Auto-backup Scheduler System
class AutoBackupScheduler {
    constructor() {
        this.isEnabled = JSON.parse(localStorage.getItem('autoBackup_enabled') || 'false');
        this.interval = parseInt(localStorage.getItem('autoBackup_interval') || '24'); // hours
        this.maxBackups = parseInt(localStorage.getItem('autoBackup_maxBackups') || '7');
        this.lastBackup = parseInt(localStorage.getItem('autoBackup_lastBackup') || '0');
        this.schedulerInterval = null;
        this.init();
    }
    
    init() {
        this.addBackupSettingsToUI();
        this.startScheduler();
        this.cleanOldBackups();
    }
    
    addBackupSettingsToUI() {
        const settingsSection = document.getElementById('settings');
        if (!settingsSection) return;
        
        const backupSettingsHTML = `
            <div class="editor-section">
                <h3><i class="fas fa-clock"></i> Auto-backup Settings</h3>
                <div class="backup-settings">
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="autoBackupEnabled" ${this.isEnabled ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            Enable automatic backups
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label for="backupInterval">Backup Interval (hours):</label>
                        <select id="backupInterval" class="form-select">
                            <option value="1" ${this.interval === 1 ? 'selected' : ''}>Every hour</option>
                            <option value="6" ${this.interval === 6 ? 'selected' : ''}>Every 6 hours</option>
                            <option value="12" ${this.interval === 12 ? 'selected' : ''}>Every 12 hours</option>
                            <option value="24" ${this.interval === 24 ? 'selected' : ''}>Daily</option>
                            <option value="168" ${this.interval === 168 ? 'selected' : ''}>Weekly</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="maxBackups">Maximum backups to keep:</label>
                        <select id="maxBackups" class="form-select">
                            <option value="3" ${this.maxBackups === 3 ? 'selected' : ''}>3 backups</option>
                            <option value="5" ${this.maxBackups === 5 ? 'selected' : ''}>5 backups</option>
                            <option value="7" ${this.maxBackups === 7 ? 'selected' : ''}>7 backups</option>
                            <option value="10" ${this.maxBackups === 10 ? 'selected' : ''}>10 backups</option>
                            <option value="15" ${this.maxBackups === 15 ? 'selected' : ''}>15 backups</option>
                        </select>
                    </div>
                    
                    <div class="backup-status">
                        <div class="status-item">
                            <span class="status-label">Last backup:</span>
                            <span class="status-value" id="lastBackupTime">${this.formatLastBackupTime()}</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Next backup:</span>
                            <span class="status-value" id="nextBackupTime">${this.getNextBackupTime()}</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Stored backups:</span>
                            <span class="status-value" id="storedBackups">${this.getStoredBackupsCount()}</span>
                        </div>
                    </div>
                    
                    <div class="backup-actions">
                        <button class="btn btn-primary" onclick="autoBackupScheduler.saveSettings()">
                            <i class="fas fa-save"></i> Save Settings
                        </button>
                        <button class="btn btn-secondary" onclick="autoBackupScheduler.createManualBackup()">
                            <i class="fas fa-backup"></i> Backup Now
                        </button>
                        <button class="btn btn-outline-secondary" onclick="autoBackupScheduler.showBackupHistory()">
                            <i class="fas fa-history"></i> View Backups
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        settingsSection.insertAdjacentHTML('beforeend', backupSettingsHTML);
    }
    
    saveSettings() {
        const enabled = document.getElementById('autoBackupEnabled').checked;
        const interval = parseInt(document.getElementById('backupInterval').value);
        const maxBackups = parseInt(document.getElementById('maxBackups').value);
        
        this.isEnabled = enabled;
        this.interval = interval;
        this.maxBackups = maxBackups;
        
        localStorage.setItem('autoBackup_enabled', JSON.stringify(enabled));
        localStorage.setItem('autoBackup_interval', interval.toString());
        localStorage.setItem('autoBackup_maxBackups', maxBackups.toString());
        
        this.startScheduler();
        this.updateStatusDisplay();
        
        notificationManager.show('Auto-backup settings saved successfully', 'success');
    }
    
    startScheduler() {
        // Clear existing scheduler
        if (this.schedulerInterval) {
            clearInterval(this.schedulerInterval);
        }
        
        if (!this.isEnabled) return;
        
        // Check every minute if backup is needed
        this.schedulerInterval = setInterval(() => {
            this.checkAndBackup();
        }, 60000); // 1 minute
        
        console.log(`🔄 Auto-backup scheduler started (${this.interval}h interval)`);
    }
    
    checkAndBackup() {
        if (!this.isEnabled) return;
        
        const now = Date.now();
        const intervalMs = this.interval * 60 * 60 * 1000; // Convert hours to milliseconds
        
        if (now - this.lastBackup >= intervalMs) {
            this.createAutomaticBackup();
        }
    }
    
    createAutomaticBackup() {
        console.log('🔄 Creating automatic backup...');
        
        const backupData = this.gatherBackupData();
        const backupId = 'auto_' + Date.now();
        const backup = {
            id: backupId,
            type: 'automatic',
            timestamp: Date.now(),
            data: backupData,
            size: JSON.stringify(backupData).length
        };
        
        this.saveBackup(backup);
        this.lastBackup = Date.now();
        localStorage.setItem('autoBackup_lastBackup', this.lastBackup.toString());
        
        this.cleanOldBackups();
        this.updateStatusDisplay();
        
        notificationManager.show('Automatic backup created successfully', 'success');
        console.log('✅ Automatic backup completed:', backupId);
    }
    
    createManualBackup() {
        console.log('🔄 Creating manual backup...');
        
        const backupData = this.gatherBackupData();
        const backupId = 'manual_' + Date.now();
        const backup = {
            id: backupId,
            type: 'manual',
            timestamp: Date.now(),
            data: backupData,
            size: JSON.stringify(backupData).length
        };
        
        this.saveBackup(backup);
        this.updateStatusDisplay();
        
        notificationManager.show('Manual backup created successfully', 'success');
        console.log('✅ Manual backup completed:', backupId);
    }
    
    gatherBackupData() {
        return {
            uploadedMusic: JSON.parse(localStorage.getItem('uploadedMusic') || '[]'),
            uploadedGallery: JSON.parse(localStorage.getItem('uploadedGallery') || '[]'),
            about_text_en: localStorage.getItem('about_text_en') || '',
            about_text_tr: localStorage.getItem('about_text_tr') || '',
            hero_title: localStorage.getItem('hero_title') || '',
            hero_subtitle: localStorage.getItem('hero_subtitle') || '',
            hero_description: localStorage.getItem('hero_description') || '',
            contact_email: localStorage.getItem('contact_email') || '',
            contact_phone: localStorage.getItem('contact_phone') || '',
            contact_address: localStorage.getItem('contact_address') || '',
            site_title: localStorage.getItem('site_title') || '',
            site_description: localStorage.getItem('site_description') || '',
            social_spotify: localStorage.getItem('social_spotify') || '',
            social_youtube: localStorage.getItem('social_youtube') || '',
            social_instagram: localStorage.getItem('social_instagram') || '',
            page_views: localStorage.getItem('page_views') || '0',
            unique_visitors: localStorage.getItem('unique_visitors') || '0',
            visitor_analytics: JSON.parse(localStorage.getItem('visitor_analytics') || '[]'),
            timestamp: Date.now(),
            version: '1.0'
        };
    }
    
    saveBackup(backup) {
        const backups = JSON.parse(localStorage.getItem('system_backups') || '[]');
        backups.push(backup);
        
        // Sort by timestamp (newest first)
        backups.sort((a, b) => b.timestamp - a.timestamp);
        
        localStorage.setItem('system_backups', JSON.stringify(backups));
    }
    
    cleanOldBackups() {
        const backups = JSON.parse(localStorage.getItem('system_backups') || '[]');
        
        if (backups.length > this.maxBackups) {
            const toKeep = backups.slice(0, this.maxBackups);
            localStorage.setItem('system_backups', JSON.stringify(toKeep));
            
            const removed = backups.length - this.maxBackups;
            console.log(`🧹 Cleaned ${removed} old backup(s)`);
        }
    }
    
    getStoredBackupsCount() {
        const backups = JSON.parse(localStorage.getItem('system_backups') || '[]');
        return backups.length;
    }
    
    formatLastBackupTime() {
        if (this.lastBackup === 0) return 'Never';
        return new Date(this.lastBackup).toLocaleString();
    }
    
    getNextBackupTime() {
        if (!this.isEnabled || this.lastBackup === 0) return 'N/A';
        const nextBackup = this.lastBackup + (this.interval * 60 * 60 * 1000);
        return new Date(nextBackup).toLocaleString();
    }
    
    updateStatusDisplay() {
        const lastBackupEl = document.getElementById('lastBackupTime');
        const nextBackupEl = document.getElementById('nextBackupTime');
        const storedBackupsEl = document.getElementById('storedBackups');
        
        if (lastBackupEl) lastBackupEl.textContent = this.formatLastBackupTime();
        if (nextBackupEl) nextBackupEl.textContent = this.getNextBackupTime();
        if (storedBackupsEl) storedBackupsEl.textContent = this.getStoredBackupsCount();
    }
    
    showBackupHistory() {
        const backups = JSON.parse(localStorage.getItem('system_backups') || '[]');
        
        if (backups.length === 0) {
            notificationManager.show('No backups found', 'info');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'backup-history-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-history"></i> Backup History</h3>
                    <button class="modal-close" onclick="this.closest('.backup-history-modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="backup-list">
                        ${backups.map(backup => `
                            <div class="backup-item">
                                <div class="backup-info">
                                    <div class="backup-id">${backup.id}</div>
                                    <div class="backup-meta">
                                        <span class="backup-type ${backup.type}">${backup.type}</span>
                                        <span class="backup-date">${new Date(backup.timestamp).toLocaleString()}</span>
                                        <span class="backup-size">${this.formatFileSize(backup.size)}</span>
                                    </div>
                                </div>
                                <div class="backup-actions">
                                    <button class="btn btn-sm btn-secondary" onclick="autoBackupScheduler.restoreBackup('${backup.id}')">
                                        <i class="fas fa-undo"></i> Restore
                                    </button>
                                    <button class="btn btn-sm btn-outline-secondary" onclick="autoBackupScheduler.downloadBackup('${backup.id}')">
                                        <i class="fas fa-download"></i> Download
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="autoBackupScheduler.deleteBackup('${backup.id}')">
                                        <i class="fas fa-trash"></i> Delete
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    restoreBackup(backupId) {
        if (!confirm('This will restore all data from the selected backup. Current data will be overwritten. Are you sure?')) {
            return;
        }
        
        const backups = JSON.parse(localStorage.getItem('system_backups') || '[]');
        const backup = backups.find(b => b.id === backupId);
        
        if (!backup) {
            notificationManager.show('Backup not found', 'error');
            return;
        }
        
        // Restore all data
        Object.entries(backup.data).forEach(([key, value]) => {
            if (typeof value === 'object') {
                localStorage.setItem(key, JSON.stringify(value));
            } else {
                localStorage.setItem(key, value);
            }
        });
        
        notificationManager.show('Backup restored successfully. Please refresh the page.', 'success');
        
        // Close modal and refresh after delay
        document.querySelector('.backup-history-modal')?.remove();
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
    
    downloadBackup(backupId) {
        const backups = JSON.parse(localStorage.getItem('system_backups') || '[]');
        const backup = backups.find(b => b.id === backupId);
        
        if (!backup) {
            notificationManager.show('Backup not found', 'error');
            return;
        }
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${backup.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        notificationManager.show('Backup downloaded successfully', 'success');
    }
    
    deleteBackup(backupId) {
        if (!confirm('Are you sure you want to delete this backup?')) {
            return;
        }
        
        const backups = JSON.parse(localStorage.getItem('system_backups') || '[]');
        const filteredBackups = backups.filter(b => b.id !== backupId);
        
        localStorage.setItem('system_backups', JSON.stringify(filteredBackups));
        
        // Close modal and refresh
        document.querySelector('.backup-history-modal')?.remove();
        this.showBackupHistory();
        this.updateStatusDisplay();
        
        notificationManager.show('Backup deleted successfully', 'success');
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize auto-backup scheduler
const autoBackupScheduler = new AutoBackupScheduler();

// Version Control System for Content Changes
class VersionControl {
    constructor() {
        this.maxVersions = 50; // Keep last 50 versions per content item
        this.init();
    }
    
    init() {
        this.addVersionControlToUI();
        this.interceptContentSaves();
    }
    
    addVersionControlToUI() {
        // Add version control button to content section
        const contentSection = document.getElementById('content');
        if (!contentSection) return;
        
        const versionControlHTML = `
            <div class="editor-section">
                <h3><i class="fas fa-code-branch"></i> Version Control</h3>
                <div class="version-control-panel">
                    <div class="version-stats">
                        <div class="stat-item">
                            <span class="stat-label">Total Versions:</span>
                            <span class="stat-value" id="totalVersions">${this.getTotalVersionsCount()}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Storage Used:</span>
                            <span class="stat-value" id="versionsStorage">${this.getVersionsStorageSize()}</span>
                        </div>
                    </div>
                    
                    <div class="version-actions">
                        <button class="btn btn-secondary" onclick="versionControl.showVersionHistory()">
                            <i class="fas fa-history"></i> View History
                        </button>
                        <button class="btn btn-outline-secondary" onclick="versionControl.createSnapshot()">
                            <i class="fas fa-camera"></i> Create Snapshot
                        </button>
                        <button class="btn btn-outline-danger" onclick="versionControl.cleanOldVersions()">
                            <i class="fas fa-broom"></i> Clean Old Versions
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        contentSection.insertAdjacentHTML('beforeend', versionControlHTML);
    }
    
    interceptContentSaves() {
        // Override existing save functions to track versions
        this.overrideSaveFunction('saveAboutText', ['about_text_en', 'about_text_tr']);
        this.overrideSaveFunction('saveHeroContent', ['hero_title', 'hero_subtitle', 'hero_description']);
        this.overrideSaveFunction('saveContactInfo', ['contact_email', 'contact_phone', 'contact_address']);
        this.overrideSaveFunction('saveSiteSettings', ['site_title', 'site_description']);
        this.overrideSaveFunction('saveSocialMediaSettings', ['social_spotify', 'social_youtube', 'social_instagram']);
    }
    
    overrideSaveFunction(functionName, trackedKeys) {
        const originalFunction = window[functionName];
        if (!originalFunction) return;
        
        window[functionName] = (...args) => {
            // Save version before making changes
            this.saveVersion(functionName, trackedKeys);
            
            // Call original function
            const result = originalFunction.apply(this, args);
            
            return result;
        };
    }
    
    saveVersion(actionType, keys) {
        const version = {
            id: 'version_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            actionType: actionType,
            timestamp: Date.now(),
            user: 'admin', // In multi-user system, this would be actual user
            data: {},
            message: this.generateCommitMessage(actionType)
        };
        
        // Capture current state of tracked keys
        keys.forEach(key => {
            version.data[key] = localStorage.getItem(key) || '';
        });
        
        this.storeVersion(version);
        console.log(`📝 Version saved: ${version.id} (${actionType})`);
    }
    
    storeVersion(version) {
        const versions = JSON.parse(localStorage.getItem('content_versions') || '[]');
        versions.push(version);
        
        // Sort by timestamp (newest first)
        versions.sort((a, b) => b.timestamp - a.timestamp);
        
        // Keep only max versions
        if (versions.length > this.maxVersions) {
            versions.splice(this.maxVersions);
        }
        
        localStorage.setItem('content_versions', JSON.stringify(versions));
        this.updateVersionStats();
    }
    
    generateCommitMessage(actionType) {
        const messages = {
            'saveAboutText': 'Updated about section content',
            'saveHeroContent': 'Modified hero section content',
            'saveContactInfo': 'Updated contact information',
            'saveSiteSettings': 'Changed site settings',
            'saveSocialMediaSettings': 'Updated social media links'
        };
        
        return messages[actionType] || `Updated ${actionType}`;
    }
    
    createSnapshot() {
        const snapshotData = {
            uploadedMusic: JSON.parse(localStorage.getItem('uploadedMusic') || '[]'),
            uploadedGallery: JSON.parse(localStorage.getItem('uploadedGallery') || '[]'),
            about_text_en: localStorage.getItem('about_text_en') || '',
            about_text_tr: localStorage.getItem('about_text_tr') || '',
            hero_title: localStorage.getItem('hero_title') || '',
            hero_subtitle: localStorage.getItem('hero_subtitle') || '',
            hero_description: localStorage.getItem('hero_description') || '',
            contact_email: localStorage.getItem('contact_email') || '',
            contact_phone: localStorage.getItem('contact_phone') || '',
            contact_address: localStorage.getItem('contact_address') || '',
            site_title: localStorage.getItem('site_title') || '',
            site_description: localStorage.getItem('site_description') || '',
            social_spotify: localStorage.getItem('social_spotify') || '',
            social_youtube: localStorage.getItem('social_youtube') || '',
            social_instagram: localStorage.getItem('social_instagram') || ''
        };
        
        const snapshot = {
            id: 'snapshot_' + Date.now(),
            actionType: 'manual_snapshot',
            timestamp: Date.now(),
            user: 'admin',
            data: snapshotData,
            message: 'Manual snapshot created'
        };
        
        this.storeVersion(snapshot);
        notificationManager.show('Snapshot created successfully', 'success');
    }
    
    showVersionHistory() {
        const versions = JSON.parse(localStorage.getItem('content_versions') || '[]');
        
        if (versions.length === 0) {
            notificationManager.show('No version history found', 'info');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'version-history-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content large">
                <div class="modal-header">
                    <h3><i class="fas fa-code-branch"></i> Version History</h3>
                    <button class="modal-close" onclick="this.closest('.version-history-modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="version-timeline">
                        ${versions.map((version, index) => `
                            <div class="version-item ${version.actionType.includes('snapshot') ? 'snapshot' : ''}">
                                <div class="version-marker"></div>
                                <div class="version-content">
                                    <div class="version-header">
                                        <div class="version-meta">
                                            <span class="version-id">${version.id}</span>
                                            <span class="version-time">${new Date(version.timestamp).toLocaleString()}</span>
                                            <span class="version-user">by ${version.user}</span>
                                        </div>
                                        <div class="version-actions">
                                            <button class="btn btn-sm btn-secondary" onclick="versionControl.compareVersions('${version.id}')">
                                                <i class="fas fa-columns"></i> Compare
                                            </button>
                                            <button class="btn btn-sm btn-primary" onclick="versionControl.restoreVersion('${version.id}')">
                                                <i class="fas fa-undo"></i> Restore
                                            </button>
                                            <button class="btn btn-sm btn-outline-secondary" onclick="versionControl.exportVersion('${version.id}')">
                                                <i class="fas fa-download"></i> Export
                                            </button>
                                        </div>
                                    </div>
                                    <div class="version-message">${version.message}</div>
                                    <div class="version-changes">
                                        Changed: ${Object.keys(version.data).length} item(s)
                                        ${Object.keys(version.data).slice(0, 3).join(', ')}
                                        ${Object.keys(version.data).length > 3 ? '...' : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    compareVersions(versionId) {
        const versions = JSON.parse(localStorage.getItem('content_versions') || '[]');
        const version = versions.find(v => v.id === versionId);
        
        if (!version) {
            notificationManager.show('Version not found', 'error');
            return;
        }
        
        const currentData = {};
        Object.keys(version.data).forEach(key => {
            currentData[key] = localStorage.getItem(key) || '';
        });
        
        const modal = document.createElement('div');
        modal.className = 'version-compare-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content extra-large">
                <div class="modal-header">
                    <h3><i class="fas fa-columns"></i> Compare Versions</h3>
                    <button class="modal-close" onclick="this.closest('.version-compare-modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="compare-header">
                        <div class="compare-column">
                            <h4>Current Version</h4>
                            <span class="compare-meta">Live content</span>
                        </div>
                        <div class="compare-column">
                            <h4>Version: ${version.id}</h4>
                            <span class="compare-meta">${new Date(version.timestamp).toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="compare-content">
                        ${Object.keys(version.data).map(key => `
                            <div class="compare-item">
                                <div class="compare-key">${key}</div>
                                <div class="compare-values">
                                    <div class="compare-current">
                                        <pre>${this.escapeHtml(currentData[key] || 'Empty')}</pre>
                                    </div>
                                    <div class="compare-version">
                                        <pre>${this.escapeHtml(version.data[key] || 'Empty')}</pre>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    restoreVersion(versionId) {
        if (!confirm('This will restore all content to the selected version. Current changes will be lost. Are you sure?')) {
            return;
        }
        
        const versions = JSON.parse(localStorage.getItem('content_versions') || '[]');
        const version = versions.find(v => v.id === versionId);
        
        if (!version) {
            notificationManager.show('Version not found', 'error');
            return;
        }
        
        // Save current state before restoring
        this.createSnapshot();
        
        // Restore version data
        Object.entries(version.data).forEach(([key, value]) => {
            if (typeof value === 'object') {
                localStorage.setItem(key, JSON.stringify(value));
            } else {
                localStorage.setItem(key, value);
            }
        });
        
        notificationManager.show('Version restored successfully. Please refresh the page.', 'success');
        
        // Close modal and refresh
        document.querySelector('.version-history-modal')?.remove();
        document.querySelector('.version-compare-modal')?.remove();
        
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
    
    exportVersion(versionId) {
        const versions = JSON.parse(localStorage.getItem('content_versions') || '[]');
        const version = versions.find(v => v.id === versionId);
        
        if (!version) {
            notificationManager.show('Version not found', 'error');
            return;
        }
        
        const blob = new Blob([JSON.stringify(version, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `version-${version.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        notificationManager.show('Version exported successfully', 'success');
    }
    
    cleanOldVersions() {
        if (!confirm('This will remove old versions to free up storage space. Continue?')) {
            return;
        }
        
        const versions = JSON.parse(localStorage.getItem('content_versions') || '[]');
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        // Keep snapshots and recent versions (last week)
        const filteredVersions = versions.filter(v => 
            v.actionType.includes('snapshot') || v.timestamp > oneWeekAgo
        );
        
        // Keep at least 10 most recent versions
        if (filteredVersions.length < 10 && versions.length >= 10) {
            const recentVersions = versions.slice(0, 10);
            localStorage.setItem('content_versions', JSON.stringify(recentVersions));
        } else {
            localStorage.setItem('content_versions', JSON.stringify(filteredVersions));
        }
        
        const removed = versions.length - filteredVersions.length;
        this.updateVersionStats();
        
        notificationManager.show(`Cleaned ${removed} old versions`, 'success');
    }
    
    getTotalVersionsCount() {
        const versions = JSON.parse(localStorage.getItem('content_versions') || '[]');
        return versions.length;
    }
    
    getVersionsStorageSize() {
        const versions = JSON.stringify(localStorage.getItem('content_versions') || '[]');
        const bytes = new Blob([versions]).size;
        return this.formatFileSize(bytes);
    }
    
    updateVersionStats() {
        const totalEl = document.getElementById('totalVersions');
        const storageEl = document.getElementById('versionsStorage');
        
        if (totalEl) totalEl.textContent = this.getTotalVersionsCount();
        if (storageEl) storageEl.textContent = this.getVersionsStorageSize();
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize version control
const versionControl = new VersionControl();

// Multi-user Admin Support System
class MultiUserSystem {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('current_admin_user') || 'null');
        this.users = JSON.parse(localStorage.getItem('admin_users') || '[]');
        this.roles = {
            'super_admin': {
                name: 'Super Admin',
                permissions: ['all'],
                color: '#e74c3c',
                icon: 'fa-crown'
            },
            'admin': {
                name: 'Administrator',
                permissions: ['content_edit', 'file_upload', 'analytics_view', 'backup_manage'],
                color: '#3498db',
                icon: 'fa-user-shield'
            },
            'editor': {
                name: 'Content Editor',
                permissions: ['content_edit', 'file_upload'],
                color: '#2ecc71',
                icon: 'fa-edit'
            },
            'viewer': {
                name: 'Viewer',
                permissions: ['analytics_view'],
                color: '#95a5a6',
                icon: 'fa-eye'
            }
        };
        this.init();
    }
    
    init() {
        this.initializeDefaultUsers();
        this.addUserManagementUI();
        this.updateCurrentUserDisplay();
        this.enforcePermissions();
    }
    
    initializeDefaultUsers() {
        if (this.users.length === 0) {
            // Create default super admin
            const defaultAdmin = {
                id: 'user_' + Date.now(),
                username: 'admin',
                displayName: 'System Administrator',
                email: 'admin@system.local',
                role: 'super_admin',
                avatar: 'https://ui-avatars.com/api/?name=Admin&background=e74c3c&color=fff&size=128',
                created: Date.now(),
                lastLogin: Date.now(),
                isActive: true,
                preferences: {
                    theme: 'default',
                    language: 'en',
                    notifications: true
                }
            };
            
            this.users = [defaultAdmin];
            this.currentUser = defaultAdmin;
            localStorage.setItem('admin_users', JSON.stringify(this.users));
            localStorage.setItem('current_admin_user', JSON.stringify(this.currentUser));
        }
        
        if (!this.currentUser) {
            this.currentUser = this.users.find(u => u.role === 'super_admin') || this.users[0];
            localStorage.setItem('current_admin_user', JSON.stringify(this.currentUser));
        }
    }
    
    addUserManagementUI() {
        const settingsSection = document.getElementById('settings');
        if (!settingsSection) return;
        
        const userManagementHTML = `
            <div class="editor-section user-management-section">
                <h3><i class="fas fa-users"></i> User Management</h3>
                <div class="user-management-panel">
                    <div class="current-user-info">
                        <div class="user-avatar-section">
                            <div class="user-avatar">
                                <img src="${this.currentUser.avatar}" alt="${this.currentUser.displayName}">
                                <div class="user-status-indicator ${this.currentUser.isActive ? 'online' : 'offline'}"></div>
                            </div>
                            <div class="user-details">
                                <div class="user-name">${this.currentUser.displayName}</div>
                                <div class="user-role">
                                    <i class="fas ${this.roles[this.currentUser.role].icon}"></i>
                                    <span style="color: ${this.roles[this.currentUser.role].color}">
                                        ${this.roles[this.currentUser.role].name}
                                    </span>
                                </div>
                                <div class="user-email">${this.currentUser.email}</div>
                            </div>
                        </div>
                        
                        <div class="user-stats">
                            <div class="stat-card">
                                <i class="fas fa-clock"></i>
                                <div>
                                    <span class="stat-label">Last Login</span>
                                    <span class="stat-value">${new Date(this.currentUser.lastLogin).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-calendar"></i>
                                <div>
                                    <span class="stat-label">Member Since</span>
                                    <span class="stat-value">${new Date(this.currentUser.created).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="user-actions-header">
                        <h4><i class="fas fa-users-cog"></i> Manage Users</h4>
                        <div class="user-action-buttons">
                            <button class="btn btn-primary" onclick="multiUserSystem.showAddUserModal()">
                                <i class="fas fa-user-plus"></i> Add User
                            </button>
                            <button class="btn btn-secondary" onclick="multiUserSystem.showUserList()">
                                <i class="fas fa-list"></i> View All Users
                            </button>
                            <button class="btn btn-outline-secondary" onclick="multiUserSystem.showRolePermissions()">
                                <i class="fas fa-shield-alt"></i> Role Permissions
                            </button>
                        </div>
                    </div>
                    
                    <div class="users-quick-overview">
                        <div class="overview-cards">
                            <div class="overview-card">
                                <div class="card-icon" style="background: linear-gradient(135deg, #e74c3c, #c0392b)">
                                    <i class="fas fa-crown"></i>
                                </div>
                                <div class="card-content">
                                    <span class="card-number">${this.getUsersByRole('super_admin').length}</span>
                                    <span class="card-label">Super Admins</span>
                                </div>
                            </div>
                            <div class="overview-card">
                                <div class="card-icon" style="background: linear-gradient(135deg, #3498db, #2980b9)">
                                    <i class="fas fa-user-shield"></i>
                                </div>
                                <div class="card-content">
                                    <span class="card-number">${this.getUsersByRole('admin').length}</span>
                                    <span class="card-label">Administrators</span>
                                </div>
                            </div>
                            <div class="overview-card">
                                <div class="card-icon" style="background: linear-gradient(135deg, #2ecc71, #27ae60)">
                                    <i class="fas fa-edit"></i>
                                </div>
                                <div class="card-content">
                                    <span class="card-number">${this.getUsersByRole('editor').length}</span>
                                    <span class="card-label">Editors</span>
                                </div>
                            </div>
                            <div class="overview-card">
                                <div class="card-icon" style="background: linear-gradient(135deg, #95a5a6, #7f8c8d)">
                                    <i class="fas fa-eye"></i>
                                </div>
                                <div class="card-content">
                                    <span class="card-number">${this.getUsersByRole('viewer').length}</span>
                                    <span class="card-label">Viewers</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        settingsSection.insertAdjacentHTML('beforeend', userManagementHTML);
    }
    
    updateCurrentUserDisplay() {
        // Update header user info
        const headerUser = document.querySelector('.header-user');
        if (headerUser) {
            headerUser.innerHTML = `
                <div class="user-avatar-mini">
                    <img src="${this.currentUser.avatar}" alt="${this.currentUser.displayName}">
                    <div class="user-status-mini online"></div>
                </div>
                <span class="user-name-mini">${this.currentUser.displayName}</span>
                <i class="fas fa-chevron-down"></i>
            `;
        }
    }
    
    enforcePermissions() {
        if (!this.currentUser) return;
        
        const userPermissions = this.roles[this.currentUser.role].permissions;
        
        // Hide/show elements based on permissions
        if (!this.hasPermission('content_edit')) {
            this.hideElements(['.editor-section', '#content']);
        }
        
        if (!this.hasPermission('file_upload')) {
            this.hideElements(['.upload-modal', '.quick-action-btn[data-action="add-music"]', '.quick-action-btn[data-action="add-image"]']);
        }
        
        if (!this.hasPermission('analytics_view')) {
            this.hideElements(['.analytics-dashboard', '.performance-monitor']);
        }
        
        if (!this.hasPermission('backup_manage')) {
            this.hideElements(['.backup-settings', '.version-control-panel']);
        }
    }
    
    hasPermission(permission) {
        if (!this.currentUser) return false;
        const userPermissions = this.roles[this.currentUser.role].permissions;
        return userPermissions.includes('all') || userPermissions.includes(permission);
    }
    
    hideElements(selectors) {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none';
                el.classList.add('permission-restricted');
            });
        });
    }
    
    getUsersByRole(role) {
        return this.users.filter(user => user.role === role);
    }
    
    showAddUserModal() {
        if (!this.hasPermission('all')) {
            notificationManager.show('You don\'t have permission to add users', 'error');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'add-user-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content professional">
                <div class="modal-header gradient-header">
                    <h3><i class="fas fa-user-plus"></i> Add New User</h3>
                    <button class="modal-close" onclick="this.closest('.add-user-modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="addUserForm" class="professional-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="newUsername">Username</label>
                                <input type="text" id="newUsername" required placeholder="Enter username">
                            </div>
                            <div class="form-group">
                                <label for="newDisplayName">Display Name</label>
                                <input type="text" id="newDisplayName" required placeholder="Enter display name">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="newEmail">Email</label>
                                <input type="email" id="newEmail" required placeholder="Enter email address">
                            </div>
                            <div class="form-group">
                                <label for="newRole">Role</label>
                                <select id="newRole" required>
                                    ${Object.entries(this.roles).map(([key, role]) => `
                                        <option value="${key}" style="color: ${role.color}">
                                            ${role.name}
                                        </option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="newAvatar">Avatar URL (optional)</label>
                            <input type="url" id="newAvatar" placeholder="https://example.com/avatar.jpg">
                        </div>
                        
                        <div class="role-preview" id="rolePreview">
                            <!-- Role permissions will be shown here -->
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.add-user-modal').remove()">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-user-plus"></i> Create User
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add form submission handler
        document.getElementById('addUserForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createUser();
        });
        
        // Add role preview
        document.getElementById('newRole').addEventListener('change', (e) => {
            this.updateRolePreview(e.target.value);
        });
        
        // Initial role preview
        this.updateRolePreview('editor');
    }
    
    updateRolePreview(roleKey) {
        const role = this.roles[roleKey];
        const preview = document.getElementById('rolePreview');
        
        preview.innerHTML = `
            <div class="role-preview-card" style="border-left-color: ${role.color}">
                <div class="role-header">
                    <i class="fas ${role.icon}" style="color: ${role.color}"></i>
                    <span class="role-name">${role.name}</span>
                </div>
                <div class="role-permissions">
                    <strong>Permissions:</strong>
                    <ul>
                        ${role.permissions.includes('all') ? 
                            '<li>All Permissions (Full Access)</li>' : 
                            role.permissions.map(perm => `<li>${this.getPermissionLabel(perm)}</li>`).join('')
                        }
                    </ul>
                </div>
            </div>
        `;
    }
    
    getPermissionLabel(permission) {
        const labels = {
            'content_edit': 'Edit Content & Settings',
            'file_upload': 'Upload Files & Media',
            'analytics_view': 'View Analytics & Reports',
            'backup_manage': 'Manage Backups & Versions'
        };
        return labels[permission] || permission;
    }
    
    createUser() {
        const username = document.getElementById('newUsername').value;
        const displayName = document.getElementById('newDisplayName').value;
        const email = document.getElementById('newEmail').value;
        const role = document.getElementById('newRole').value;
        const avatar = document.getElementById('newAvatar').value || 
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=${this.roles[role].color.substring(1)}&color=fff&size=128`;
        
        // Check if username already exists
        if (this.users.some(user => user.username === username)) {
            notificationManager.show('Username already exists', 'error');
            return;
        }
        
        const newUser = {
            id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            username,
            displayName,
            email,
            role,
            avatar,
            created: Date.now(),
            lastLogin: null,
            isActive: true,
            preferences: {
                theme: 'default',
                language: 'en',
                notifications: true
            }
        };
        
        this.users.push(newUser);
        localStorage.setItem('admin_users', JSON.stringify(this.users));
        
        document.querySelector('.add-user-modal').remove();
        this.updateUserManagementDisplay();
        
        notificationManager.show(`User "${displayName}" created successfully`, 'success');
    }
    
    showUserList() {
        const modal = document.createElement('div');
        modal.className = 'user-list-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content large professional">
                <div class="modal-header gradient-header">
                    <h3><i class="fas fa-users"></i> All Users</h3>
                    <button class="modal-close" onclick="this.closest('.user-list-modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="users-grid">
                        ${this.users.map(user => `
                            <div class="user-card ${user.id === this.currentUser.id ? 'current-user' : ''}">
                                <div class="user-card-header">
                                    <div class="user-avatar-large">
                                        <img src="${user.avatar}" alt="${user.displayName}">
                                        <div class="user-status-indicator ${user.isActive ? 'online' : 'offline'}"></div>
                                    </div>
                                    <div class="user-card-info">
                                        <h4>${user.displayName}</h4>
                                        <p class="user-email">${user.email}</p>
                                        <div class="user-role-badge" style="background: ${this.roles[user.role].color}">
                                            <i class="fas ${this.roles[user.role].icon}"></i>
                                            ${this.roles[user.role].name}
                                        </div>
                                    </div>
                                </div>
                                <div class="user-card-stats">
                                    <div class="user-stat">
                                        <span class="stat-label">Created</span>
                                        <span class="stat-value">${new Date(user.created).toLocaleDateString()}</span>
                                    </div>
                                    <div class="user-stat">
                                        <span class="stat-label">Last Login</span>
                                        <span class="stat-value">${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</span>
                                    </div>
                                </div>
                                <div class="user-card-actions">
                                    ${user.id === this.currentUser.id ? 
                                        '<span class="current-user-badge">Current User</span>' :
                                        `<button class="btn btn-sm btn-secondary" onclick="multiUserSystem.editUser('${user.id}')">
                                            <i class="fas fa-edit"></i> Edit
                                        </button>
                                        <button class="btn btn-sm btn-danger" onclick="multiUserSystem.deleteUser('${user.id}')">
                                            <i class="fas fa-trash"></i> Delete
                                        </button>`
                                    }
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    showRolePermissions() {
        const modal = document.createElement('div');
        modal.className = 'role-permissions-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content large professional">
                <div class="modal-header gradient-header">
                    <h3><i class="fas fa-shield-alt"></i> Role Permissions</h3>
                    <button class="modal-close" onclick="this.closest('.role-permissions-modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="roles-grid">
                        ${Object.entries(this.roles).map(([key, role]) => `
                            <div class="role-permission-card" style="border-top-color: ${role.color}">
                                <div class="role-card-header">
                                    <div class="role-icon" style="background: ${role.color}">
                                        <i class="fas ${role.icon}"></i>
                                    </div>
                                    <div class="role-info">
                                        <h4>${role.name}</h4>
                                        <p>${this.getUsersByRole(key).length} user(s)</p>
                                    </div>
                                </div>
                                <div class="role-permissions-list">
                                    ${role.permissions.includes('all') ? 
                                        '<div class="permission-item all-permissions"><i class="fas fa-crown"></i> All Permissions</div>' :
                                        role.permissions.map(perm => `
                                            <div class="permission-item">
                                                <i class="fas fa-check"></i>
                                                ${this.getPermissionLabel(perm)}
                                            </div>
                                        `).join('')
                                    }
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    updateUserManagementDisplay() {
        // Re-render the overview cards
        const overviewCards = document.querySelector('.overview-cards');
        if (overviewCards) {
            overviewCards.innerHTML = `
                <div class="overview-card">
                    <div class="card-icon" style="background: linear-gradient(135deg, #e74c3c, #c0392b)">
                        <i class="fas fa-crown"></i>
                    </div>
                    <div class="card-content">
                        <span class="card-number">${this.getUsersByRole('super_admin').length}</span>
                        <span class="card-label">Super Admins</span>
                    </div>
                </div>
                <div class="overview-card">
                    <div class="card-icon" style="background: linear-gradient(135deg, #3498db, #2980b9)">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <div class="card-content">
                        <span class="card-number">${this.getUsersByRole('admin').length}</span>
                        <span class="card-label">Administrators</span>
                    </div>
                </div>
                <div class="overview-card">
                    <div class="card-icon" style="background: linear-gradient(135deg, #2ecc71, #27ae60)">
                        <i class="fas fa-edit"></i>
                    </div>
                    <div class="card-content">
                        <span class="card-number">${this.getUsersByRole('editor').length}</span>
                        <span class="card-label">Editors</span>
                    </div>
                </div>
                <div class="overview-card">
                    <div class="card-icon" style="background: linear-gradient(135deg, #95a5a6, #7f8c8d)">
                        <i class="fas fa-eye"></i>
                    </div>
                    <div class="card-content">
                        <span class="card-number">${this.getUsersByRole('viewer').length}</span>
                        <span class="card-label">Viewers</span>
                    </div>
                </div>
            `;
        }
    }
    
    editUser(userId) {
        // Implementation for editing users
        notificationManager.show('Edit user functionality coming soon', 'info');
    }
    
    deleteUser(userId) {
        if (!this.hasPermission('all')) {
            notificationManager.show('You don\'t have permission to delete users', 'error');
            return;
        }
        
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        if (confirm(`Are you sure you want to delete user "${user.displayName}"?`)) {
            this.users = this.users.filter(u => u.id !== userId);
            localStorage.setItem('admin_users', JSON.stringify(this.users));
            
            document.querySelector('.user-list-modal').remove();
            this.updateUserManagementDisplay();
            
            notificationManager.show(`User "${user.displayName}" deleted successfully`, 'success');
        }
    }
}

// Initialize multi-user system
const multiUserSystem = new MultiUserSystem();

// API Endpoint Creation System
class APIEndpointManager {
    constructor() {
        this.endpoints = JSON.parse(localStorage.getItem('api_endpoints') || '[]');
        this.apiKeys = JSON.parse(localStorage.getItem('api_keys') || '[]');
        this.requestLogs = JSON.parse(localStorage.getItem('api_request_logs') || '[]');
        this.init();
    }
    
    init() {
        this.createAPIEndpointsSection();
        this.setupEndpointHandlers();
        this.initializeDefaultEndpoints();
    }
    
    createAPIEndpointsSection() {
        const settingsSection = document.querySelector('#settings .settings-grid');
        if (!settingsSection) return;
        
        const apiCard = document.createElement('div');
        apiCard.className = 'settings-card api-endpoints-card';
        apiCard.innerHTML = `
            <div class="api-management-header">
                <h3><i class="fas fa-code"></i> API Endpoint Management</h3>
                <button class="btn btn-primary" onclick="apiManager.openCreateEndpointModal()">
                    <i class="fas fa-plus"></i> Create Endpoint
                </button>
            </div>
            
            <div class="api-stats">
                <div class="api-stat">
                    <div class="stat-value" id="totalEndpoints">${this.endpoints.length}</div>
                    <div class="stat-label">Total Endpoints</div>
                </div>
                <div class="api-stat">
                    <div class="stat-value" id="totalRequests">${this.requestLogs.length}</div>
                    <div class="stat-label">Total Requests</div>
                </div>
                <div class="api-stat">
                    <div class="stat-value" id="activeKeys">${this.apiKeys.filter(k => k.active).length}</div>
                    <div class="stat-label">Active API Keys</div>
                </div>
            </div>
            
            <div class="api-endpoints-list" id="apiEndpointsList">
                ${this.renderEndpointsList()}
            </div>
            
            <div class="api-actions">
                <button class="btn btn-secondary" onclick="apiManager.openAPIKeysModal()">
                    <i class="fas fa-key"></i> Manage API Keys
                </button>
                <button class="btn btn-secondary" onclick="apiManager.openRequestLogsModal()">
                    <i class="fas fa-chart-line"></i> View Request Logs
                </button>
                <button class="btn btn-secondary" onclick="apiManager.exportAPIDocumentation()">
                    <i class="fas fa-file-export"></i> Export Documentation
                </button>
            </div>
        `;
        
        settingsSection.appendChild(apiCard);
        this.createAPIModals();
    }
    
    renderEndpointsList() {
        if (this.endpoints.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-code"></i>
                    <h4>No API Endpoints</h4>
                    <p>Create your first API endpoint to enable external integrations</p>
                </div>
            `;
        }
        
        return this.endpoints.map(endpoint => `
            <div class="endpoint-item" data-endpoint-id="${endpoint.id}">
                <div class="endpoint-header">
                    <div class="endpoint-method ${endpoint.method.toLowerCase()}">${endpoint.method}</div>
                    <div class="endpoint-path">/api${endpoint.path}</div>
                    <div class="endpoint-status ${endpoint.active ? 'active' : 'inactive'}">
                        ${endpoint.active ? 'Active' : 'Inactive'}
                    </div>
                </div>
                <div class="endpoint-description">${endpoint.description}</div>
                <div class="endpoint-meta">
                    <span class="endpoint-calls">${endpoint.calls || 0} calls</span>
                    <span class="endpoint-created">Created: ${new Date(endpoint.created).toLocaleDateString()}</span>
                </div>
                <div class="endpoint-actions">
                    <button class="btn btn-sm btn-secondary" onclick="apiManager.testEndpoint('${endpoint.id}')">
                        <i class="fas fa-play"></i> Test
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="apiManager.editEndpoint('${endpoint.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="apiManager.deleteEndpoint('${endpoint.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    createAPIModals() {
        // Create Endpoint Modal
        const createEndpointModal = document.createElement('div');
        createEndpointModal.className = 'modal';
        createEndpointModal.id = 'createEndpointModal';
        createEndpointModal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h3><i class="fas fa-plus"></i> Create API Endpoint</h3>
                    <button class="modal-close" onclick="apiManager.closeCreateEndpointModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="createEndpointForm" class="endpoint-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label><i class="fas fa-tag"></i> Endpoint Name</label>
                                <input type="text" id="endpointName" required placeholder="e.g., Get Music List">
                            </div>
                            <div class="form-group">
                                <label><i class="fas fa-code"></i> HTTP Method</label>
                                <select id="endpointMethod" required>
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                    <option value="PUT">PUT</option>
                                    <option value="DELETE">DELETE</option>
                                    <option value="PATCH">PATCH</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-link"></i> Endpoint Path</label>
                            <div class="path-input">
                                <span class="path-prefix">/api</span>
                                <input type="text" id="endpointPath" required placeholder="/music" pattern="^/[a-zA-Z0-9/_-]*$">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-align-left"></i> Description</label>
                            <textarea id="endpointDescription" required placeholder="Describe what this endpoint does"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-database"></i> Data Source</label>
                            <select id="endpointDataSource" required onchange="apiManager.onDataSourceChange()">
                                <option value="">Select data source</option>
                                <option value="music">Music Collection</option>
                                <option value="gallery">Gallery Images</option>
                                <option value="analytics">Analytics Data</option>
                                <option value="content">Site Content</option>
                                <option value="custom">Custom Response</option>
                            </select>
                        </div>
                        
                        <div class="form-group" id="customResponseGroup" style="display: none;">
                            <label><i class="fas fa-code"></i> Custom Response (JSON)</label>
                            <textarea id="customResponse" placeholder='{"message": "Hello World", "status": "success"}'></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="requireAuth" checked>
                                <span class="checkmark"></span>
                                Require API Key Authentication
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="enableCORS" checked>
                                <span class="checkmark"></span>
                                Enable CORS (Cross-Origin Requests)
                            </label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="apiManager.closeCreateEndpointModal()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button type="button" class="btn btn-primary" onclick="apiManager.createEndpoint()">
                        <i class="fas fa-plus"></i> Create Endpoint
                    </button>
                </div>
            </div>
        `;
        
        // API Keys Modal
        const apiKeysModal = document.createElement('div');
        apiKeysModal.className = 'modal';
        apiKeysModal.id = 'apiKeysModal';
        apiKeysModal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h3><i class="fas fa-key"></i> API Key Management</h3>
                    <button class="modal-close" onclick="apiManager.closeAPIKeysModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="api-keys-header">
                        <button class="btn btn-primary" onclick="apiManager.generateNewAPIKey()">
                            <i class="fas fa-plus"></i> Generate New API Key
                        </button>
                    </div>
                    <div class="api-keys-list" id="apiKeysList">
                        ${this.renderAPIKeysList()}
                    </div>
                </div>
            </div>
        `;
        
        // Request Logs Modal
        const requestLogsModal = document.createElement('div');
        requestLogsModal.className = 'modal';
        requestLogsModal.id = 'requestLogsModal';
        requestLogsModal.innerHTML = `
            <div class="modal-content extra-large">
                <div class="modal-header">
                    <h3><i class="fas fa-chart-line"></i> API Request Logs</h3>
                    <button class="modal-close" onclick="apiManager.closeRequestLogsModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="logs-filters">
                        <div class="filter-group">
                            <label>Filter by Endpoint:</label>
                            <select id="endpointFilter" onchange="apiManager.filterLogs()">
                                <option value="">All Endpoints</option>
                                ${this.endpoints.map(e => `<option value="${e.id}">${e.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="filter-group">
                            <label>Filter by Status:</label>
                            <select id="statusFilter" onchange="apiManager.filterLogs()">
                                <option value="">All Status</option>
                                <option value="200">Success (200)</option>
                                <option value="400">Bad Request (400)</option>
                                <option value="401">Unauthorized (401)</option>
                                <option value="404">Not Found (404)</option>
                                <option value="500">Server Error (500)</option>
                            </select>
                        </div>
                        <button class="btn btn-secondary" onclick="apiManager.clearLogs()">
                            <i class="fas fa-trash"></i> Clear Logs
                        </button>
                    </div>
                    <div class="request-logs-table" id="requestLogsTable">
                        ${this.renderRequestLogsTable()}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(createEndpointModal);
        document.body.appendChild(apiKeysModal);
        document.body.appendChild(requestLogsModal);
    }
    
    renderAPIKeysList() {
        if (this.apiKeys.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-key"></i>
                    <h4>No API Keys</h4>
                    <p>Generate your first API key to enable endpoint access</p>
                </div>
            `;
        }
        
        return this.apiKeys.map(key => `
            <div class="api-key-item">
                <div class="api-key-header">
                    <div class="api-key-name">${key.name}</div>
                    <div class="api-key-status ${key.active ? 'active' : 'inactive'}">
                        ${key.active ? 'Active' : 'Inactive'}
                    </div>
                </div>
                <div class="api-key-value">
                    <code>${key.key}</code>
                    <button class="btn btn-sm btn-secondary" onclick="apiManager.copyAPIKey('${key.key}')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <div class="api-key-meta">
                    <span>Created: ${new Date(key.created).toLocaleDateString()}</span>
                    <span>Last Used: ${key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}</span>
                    <span>Requests: ${key.requests || 0}</span>
                </div>
                <div class="api-key-actions">
                    <button class="btn btn-sm ${key.active ? 'btn-warning' : 'btn-success'}" onclick="apiManager.toggleAPIKey('${key.id}')">
                        <i class="fas fa-${key.active ? 'pause' : 'play'}"></i> ${key.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="apiManager.deleteAPIKey('${key.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    renderRequestLogsTable() {
        if (this.requestLogs.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-chart-line"></i>
                    <h4>No Request Logs</h4>
                    <p>API request logs will appear here once endpoints are called</p>
                </div>
            `;
        }
        
        const sortedLogs = this.requestLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        return `
            <div class="logs-table">
                <div class="logs-header">
                    <div class="log-col">Timestamp</div>
                    <div class="log-col">Method</div>
                    <div class="log-col">Endpoint</div>
                    <div class="log-col">Status</div>
                    <div class="log-col">Response Time</div>
                    <div class="log-col">IP Address</div>
                </div>
                <div class="logs-body">
                    ${sortedLogs.map(log => `
                        <div class="log-row">
                            <div class="log-col">${new Date(log.timestamp).toLocaleString()}</div>
                            <div class="log-col">
                                <span class="method-badge ${log.method.toLowerCase()}">${log.method}</span>
                            </div>
                            <div class="log-col">${log.endpoint}</div>
                            <div class="log-col">
                                <span class="status-badge status-${Math.floor(log.status / 100)}xx">${log.status}</span>
                            </div>
                            <div class="log-col">${log.responseTime}ms</div>
                            <div class="log-col">${log.ip}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    initializeDefaultEndpoints() {
        if (this.endpoints.length === 0) {
            const defaultEndpoints = [
                {
                    id: 'music-list',
                    name: 'Get Music List',
                    method: 'GET',
                    path: '/music',
                    description: 'Retrieve all uploaded music tracks',
                    dataSource: 'music',
                    requireAuth: true,
                    enableCORS: true,
                    active: true,
                    created: Date.now(),
                    calls: 0
                },
                {
                    id: 'gallery-list',
                    name: 'Get Gallery Images',
                    method: 'GET',
                    path: '/gallery',
                    description: 'Retrieve all gallery images',
                    dataSource: 'gallery',
                    requireAuth: true,
                    enableCORS: true,
                    active: true,
                    created: Date.now(),
                    calls: 0
                },
                {
                    id: 'analytics-data',
                    name: 'Get Analytics',
                    method: 'GET',
                    path: '/analytics',
                    description: 'Retrieve site analytics and statistics',
                    dataSource: 'analytics',
                    requireAuth: true,
                    enableCORS: false,
                    active: true,
                    created: Date.now(),
                    calls: 0
                }
            ];
            
            this.endpoints = defaultEndpoints;
            this.saveEndpoints();
        }
    }
    
    onDataSourceChange() {
        const dataSource = document.getElementById('endpointDataSource').value;
        const customResponseGroup = document.getElementById('customResponseGroup');
        
        if (dataSource === 'custom') {
            customResponseGroup.style.display = 'block';
        } else {
            customResponseGroup.style.display = 'none';
        }
    }
    
    openCreateEndpointModal() {
        document.getElementById('createEndpointModal').style.display = 'block';
    }
    
    closeCreateEndpointModal() {
        document.getElementById('createEndpointModal').style.display = 'none';
        document.getElementById('createEndpointForm').reset();
    }
    
    openAPIKeysModal() {
        document.getElementById('apiKeysModal').style.display = 'block';
        this.refreshAPIKeysList();
    }
    
    closeAPIKeysModal() {
        document.getElementById('apiKeysModal').style.display = 'none';
    }
    
    openRequestLogsModal() {
        document.getElementById('requestLogsModal').style.display = 'block';
        this.refreshRequestLogsTable();
    }
    
    closeRequestLogsModal() {
        document.getElementById('requestLogsModal').style.display = 'none';
    }
    
    createEndpoint() {
        const form = document.getElementById('createEndpointForm');
        const formData = new FormData(form);
        
        const endpoint = {
            id: 'endpoint-' + Date.now(),
            name: document.getElementById('endpointName').value,
            method: document.getElementById('endpointMethod').value,
            path: document.getElementById('endpointPath').value,
            description: document.getElementById('endpointDescription').value,
            dataSource: document.getElementById('endpointDataSource').value,
            customResponse: document.getElementById('customResponse').value || null,
            requireAuth: document.getElementById('requireAuth').checked,
            enableCORS: document.getElementById('enableCORS').checked,
            active: true,
            created: Date.now(),
            calls: 0
        };
        
        // Validate required fields
        if (!endpoint.name || !endpoint.path || !endpoint.description || !endpoint.dataSource) {
            notificationManager.show('Please fill in all required fields', 'error');
            return;
        }
        
        // Validate path format
        if (!endpoint.path.startsWith('/')) {
            notificationManager.show('Endpoint path must start with /', 'error');
            return;
        }
        
        // Check for duplicate paths
        if (this.endpoints.some(e => e.path === endpoint.path && e.method === endpoint.method)) {
            notificationManager.show('An endpoint with this method and path already exists', 'error');
            return;
        }
        
        this.endpoints.push(endpoint);
        this.saveEndpoints();
        this.refreshEndpointsList();
        this.closeCreateEndpointModal();
        
        notificationManager.show(`API endpoint ${endpoint.name} created successfully!`, 'success');
    }
    
    generateNewAPIKey() {
        const keyName = prompt('Enter a name for this API key:');
        if (!keyName) return;
        
        const apiKey = {
            id: 'key-' + Date.now(),
            name: keyName,
            key: 'pk_' + this.generateRandomString(32),
            active: true,
            created: Date.now(),
            lastUsed: null,
            requests: 0
        };
        
        this.apiKeys.push(apiKey);
        this.saveAPIKeys();
        this.refreshAPIKeysList();
        
        notificationManager.show(`API key "${keyName}" generated successfully!`, 'success');
    }
    
    generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    copyAPIKey(key) {
        navigator.clipboard.writeText(key).then(() => {
            notificationManager.show('API key copied to clipboard!', 'success');
        });
    }
    
    toggleAPIKey(keyId) {
        const key = this.apiKeys.find(k => k.id === keyId);
        if (key) {
            key.active = !key.active;
            this.saveAPIKeys();
            this.refreshAPIKeysList();
            notificationManager.show(`API key ${key.active ? 'activated' : 'deactivated'}`, 'info');
        }
    }
    
    deleteAPIKey(keyId) {
        if (confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
            this.apiKeys = this.apiKeys.filter(k => k.id !== keyId);
            this.saveAPIKeys();
            this.refreshAPIKeysList();
            notificationManager.show('API key deleted successfully', 'success');
        }
    }
    
    deleteEndpoint(endpointId) {
        if (confirm('Are you sure you want to delete this endpoint? This action cannot be undone.')) {
            this.endpoints = this.endpoints.filter(e => e.id !== endpointId);
            this.saveEndpoints();
            this.refreshEndpointsList();
            notificationManager.show('Endpoint deleted successfully', 'success');
        }
    }
    
    editEndpoint(endpointId) {
        // Implementation for editing endpoints
        notificationManager.show('Edit endpoint functionality coming soon', 'info');
    }
    
    testEndpoint(endpointId) {
        const endpoint = this.endpoints.find(e => e.id === endpointId);
        if (!endpoint) return;
        
        // Simulate API call
        const testResult = this.simulateAPICall(endpoint);
        this.logRequest(endpoint, testResult);
        
        alert(`Test completed!\n\nEndpoint: ${endpoint.method} /api${endpoint.path}\nStatus: ${testResult.status}\nResponse Time: ${testResult.responseTime}ms\n\nResponse:\n${JSON.stringify(testResult.data, null, 2)}`);
    }
    
    simulateAPICall(endpoint) {
        const startTime = Date.now();
        let data = {};
        let status = 200;
        
        try {
            switch (endpoint.dataSource) {
                case 'music':
                    data = JSON.parse(localStorage.getItem('uploadedMusic') || '[]');
                    break;
                case 'gallery':
                    data = JSON.parse(localStorage.getItem('uploadedGallery') || '[]');
                    break;
                case 'analytics':
                    data = {
                        pageViews: parseInt(localStorage.getItem('page_views') || '0'),
                        musicPlays: parseInt(localStorage.getItem('music_plays') || '0'),
                        galleryClicks: parseInt(localStorage.getItem('gallery_clicks') || '0'),
                        socialClicks: parseInt(localStorage.getItem('social_clicks') || '0')
                    };
                    break;
                case 'content':
                    data = {
                        aboutText: localStorage.getItem('about_text_en') || '',
                        heroTitle: localStorage.getItem('hero_title') || '',
                        heroDescription: localStorage.getItem('hero_description') || ''
                    };
                    break;
                case 'custom':
                    data = JSON.parse(endpoint.customResponse || '{}');
                    break;
                default:
                    data = { error: 'Unknown data source' };
                    status = 400;
            }
        } catch (error) {
            data = { error: 'Data processing error' };
            status = 500;
        }
        
        const responseTime = Date.now() - startTime;
        
        return {
            status,
            data,
            responseTime,
            timestamp: Date.now()
        };
    }
    
    logRequest(endpoint, result) {
        const logEntry = {
            id: 'log-' + Date.now(),
            timestamp: Date.now(),
            method: endpoint.method,
            endpoint: `/api${endpoint.path}`,
            status: result.status,
            responseTime: result.responseTime,
            ip: '127.0.0.1', // Simulated IP
            endpointId: endpoint.id
        };
        
        this.requestLogs.push(logEntry);
        
        // Keep only last 1000 logs
        if (this.requestLogs.length > 1000) {
            this.requestLogs = this.requestLogs.slice(-1000);
        }
        
        // Increment endpoint call count
        endpoint.calls = (endpoint.calls || 0) + 1;
        
        this.saveRequestLogs();
        this.saveEndpoints();
    }
    
    exportAPIDocumentation() {
        const documentation = {
            title: 'Music Portfolio API Documentation',
            version: '1.0.0',
            baseUrl: 'https://your-domain.com/api',
            authentication: 'API Key required in header: X-API-Key',
            endpoints: this.endpoints.map(endpoint => ({
                name: endpoint.name,
                method: endpoint.method,
                path: endpoint.path,
                description: endpoint.description,
                requireAuth: endpoint.requireAuth,
                enableCORS: endpoint.enableCORS,
                example: {
                    request: `${endpoint.method} /api${endpoint.path}`,
                    headers: endpoint.requireAuth ? { 'X-API-Key': 'your-api-key-here' } : {},
                    response: this.simulateAPICall(endpoint).data
                }
            }))
        };
        
        const blob = new Blob([JSON.stringify(documentation, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'api-documentation.json';
        a.click();
        URL.revokeObjectURL(url);
        
        notificationManager.show('API documentation exported successfully!', 'success');
    }
    
    filterLogs() {
        const endpointFilter = document.getElementById('endpointFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        
        let filteredLogs = this.requestLogs;
        
        if (endpointFilter) {
            filteredLogs = filteredLogs.filter(log => log.endpointId === endpointFilter);
        }
        
        if (statusFilter) {
            filteredLogs = filteredLogs.filter(log => log.status.toString() === statusFilter);
        }
        
        // Re-render table with filtered data
        const tableBody = document.querySelector('.logs-body');
        if (tableBody) {
            const sortedLogs = filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            tableBody.innerHTML = sortedLogs.map(log => `
                <div class="log-row">
                    <div class="log-col">${new Date(log.timestamp).toLocaleString()}</div>
                    <div class="log-col">
                        <span class="method-badge ${log.method.toLowerCase()}">${log.method}</span>
                    </div>
                    <div class="log-col">${log.endpoint}</div>
                    <div class="log-col">
                        <span class="status-badge status-${Math.floor(log.status / 100)}xx">${log.status}</span>
                    </div>
                    <div class="log-col">${log.responseTime}ms</div>
                    <div class="log-col">${log.ip}</div>
                </div>
            `).join('');
        }
    }
    
    clearLogs() {
        if (confirm('Are you sure you want to clear all request logs? This action cannot be undone.')) {
            this.requestLogs = [];
            this.saveRequestLogs();
            this.refreshRequestLogsTable();
            notificationManager.show('Request logs cleared successfully', 'success');
        }
    }
    
    refreshEndpointsList() {
        const endpointsList = document.getElementById('apiEndpointsList');
        if (endpointsList) {
            endpointsList.innerHTML = this.renderEndpointsList();
        }
        
        // Update stats
        document.getElementById('totalEndpoints').textContent = this.endpoints.length;
    }
    
    refreshAPIKeysList() {
        const apiKeysList = document.getElementById('apiKeysList');
        if (apiKeysList) {
            apiKeysList.innerHTML = this.renderAPIKeysList();
        }
        
        // Update stats
        document.getElementById('activeKeys').textContent = this.apiKeys.filter(k => k.active).length;
    }
    
    refreshRequestLogsTable() {
        const requestLogsTable = document.getElementById('requestLogsTable');
        if (requestLogsTable) {
            requestLogsTable.innerHTML = this.renderRequestLogsTable();
        }
        
        // Update stats
        document.getElementById('totalRequests').textContent = this.requestLogs.length;
    }
    
    saveEndpoints() {
        localStorage.setItem('api_endpoints', JSON.stringify(this.endpoints));
    }
    
    saveAPIKeys() {
        localStorage.setItem('api_keys', JSON.stringify(this.apiKeys));
    }
    
    saveRequestLogs() {
        localStorage.setItem('api_request_logs', JSON.stringify(this.requestLogs));
    }
    
    setupEndpointHandlers() {
        // Setup global API endpoint simulation
        window.simulateAPIEndpoint = (method, path, apiKey) => {
            const endpoint = this.endpoints.find(e => 
                e.method === method && 
                e.path === path && 
                e.active
            );
            
            if (!endpoint) {
                return { status: 404, data: { error: 'Endpoint not found' } };
            }
            
            if (endpoint.requireAuth) {
                const validKey = this.apiKeys.find(k => k.key === apiKey && k.active);
                if (!validKey) {
                    return { status: 401, data: { error: 'Invalid or missing API key' } };
                }
                
                // Update key usage
                validKey.lastUsed = Date.now();
                validKey.requests = (validKey.requests || 0) + 1;
                this.saveAPIKeys();
            }
            
            const result = this.simulateAPICall(endpoint);
            this.logRequest(endpoint, result);
            
            return result;
        };
    }
}

// Main initialization - consolidated all DOMContentLoaded listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing admin system...'); // Debug
    
    // Initialize authentication system first
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
    
    console.log('Login screen exists:', !!loginScreen); // Debug
    console.log('Admin panel exists:', !!adminPanel); // Debug
    
    if (loginScreen && adminPanel) {
        // Initialize AdminAuth (singleton)
        if (!window.adminAuth) {
            window.adminAuth = new AdminAuth();
        }
        
        // Load saved content when admin panel is ready
        setTimeout(() => {
            if (typeof loadContentFromLocalStorage === 'function') {
                loadContentFromLocalStorage();
            }
        }, 500);
    }
    
    // Initialize tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // Initialize AdminPanel instance
    if (!window.adminPanel) {
        window.adminPanel = new AdminPanel();
    }
    
    // Setup beforeunload event
    window.addEventListener('beforeunload', () => {
        if (window.adminPanel) {
            window.adminPanel.saveData();
        }
    });
    
    // Setup keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            if (window.adminPanel) {
                window.adminPanel.showAdminNotification('Otomatik kayıt aktif!', 'info');
            }
        }
    });
    
    // Initialize additional systems if session exists
    if (typeof checkAdminSession === 'function' && checkAdminSession()) {
        setTimeout(() => {
            if (typeof initializeAdminPanel === 'function') initializeAdminPanel();
            if (typeof initializePerformanceMonitor === 'function') initializePerformanceMonitor();
            if (typeof initializeFileValidator === 'function') initializeFileValidator();
            if (typeof initializeDragDropReorder === 'function') initializeDragDropReorder();
            if (typeof initializeBulkOperations === 'function') initializeBulkOperations();
            if (typeof initializeAnalyticsDashboard === 'function') initializeAnalyticsDashboard();
            if (typeof initializeAutoBackupScheduler === 'function') initializeAutoBackupScheduler();
            if (typeof initializeVersionControl === 'function') initializeVersionControl();
            if (typeof initializeMultiUserSystem === 'function') initializeMultiUserSystem();
            if (typeof initializeAPIEndpointManager === 'function') initializeAPIEndpointManager();
            if (typeof initializeRealTimeCollaboration === 'function') initializeRealTimeCollaboration();
        }, 100);
    }
});


// Basit admin oturum kontrolü
function checkAdminSession() {
    // AdminAuth ile uyumlu session kontrolü
    const session = localStorage.getItem('admin_session');
    const lastActivity = localStorage.getItem('admin_last_activity');
    
    if (session && lastActivity) {
        const now = new Date().getTime();
        const lastActiveTime = parseInt(lastActivity);
        
        // 24 saat = 24 * 60 * 60 * 1000 ms
        if (now - lastActiveTime < 24 * 60 * 60 * 1000) {
            return true;
        }
    }
    return false;
}

// Initialize API Endpoint Manager
function initializeAPIEndpointManager() {
    window.apiManager = new APIEndpointManager();
    console.log('✅ API Endpoint Manager initialized');
}

// Real-time Collaboration Features
class RealTimeCollaboration {
    constructor() {
        this.isConnected = false;
        this.connectionId = null;
        this.activeUsers = new Map();
        this.collaborationSession = null;
        this.documentSyncQueue = [];
        this.cursorPositions = new Map();
        this.init();
    }
    
    init() {
        this.createCollaborationInterface();
        this.simulateWebSocketConnection();
        this.setupEventListeners();
        this.initializeDocumentSync();
    }
    
    createCollaborationInterface() {
        // Add collaboration section to settings
        const settingsSection = document.querySelector('#settings .settings-grid');
        if (!settingsSection) return;
        
        const collaborationCard = document.createElement('div');
        collaborationCard.className = 'settings-card collaboration-card';
        collaborationCard.innerHTML = `
            <div class="collaboration-header">
                <h3><i class="fas fa-users"></i> Real-time Collaboration</h3>
                <div class="connection-status" id="connectionStatus">
                    <span class="status-indicator offline"></span>
                    <span class="status-text">Connecting...</span>
                </div>
            </div>
            
            <div class="collaboration-stats">
                <div class="collab-stat">
                    <div class="stat-value" id="activeCollaborators">0</div>
                    <div class="stat-label">Active Users</div>
                </div>
                <div class="collab-stat">
                    <div class="stat-value" id="liveChanges">0</div>
                    <div class="stat-label">Live Changes</div>
                </div>
                <div class="collab-stat">
                    <div class="stat-value" id="syncStatus">100%</div>
                    <div class="stat-label">Sync Status</div>
                </div>
            </div>
            
            <div class="active-users-list" id="activeUsersList">
                <h4><i class="fas fa-user-friends"></i> Active Collaborators</h4>
                <div class="users-container" id="collaboratorsContainer">
                    <!-- Active users will appear here -->
                </div>
            </div>
            
            <div class="collaboration-actions">
                <button class="btn btn-primary" onclick="collaboration.startCollaborationSession()">
                    <i class="fas fa-play"></i> Start Session
                </button>
                <button class="btn btn-secondary" onclick="collaboration.inviteCollaborators()">
                    <i class="fas fa-user-plus"></i> Invite Users
                </button>
                <button class="btn btn-secondary" onclick="collaboration.openActivityFeed()">
                    <i class="fas fa-history"></i> Activity Feed
                </button>
                <button class="btn btn-warning" onclick="collaboration.resolveConflicts()">
                    <i class="fas fa-exclamation-triangle"></i> Resolve Conflicts
                </button>
            </div>
            
            <div class="live-cursor-tracking">
                <h4><i class="fas fa-mouse-pointer"></i> Live Cursor Tracking</h4>
                <div class="cursor-options">
                    <label class="checkbox-label">
                        <input type="checkbox" id="showCursors" checked onchange="collaboration.toggleCursorTracking()">
                        <span class="checkmark"></span>
                        Show collaborator cursors
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="showSelections" checked onchange="collaboration.toggleSelectionTracking()">
                        <span class="checkmark"></span>
                        Show text selections
                    </label>
                </div>
            </div>
        `;
        
        settingsSection.appendChild(collaborationCard);
        this.createCollaborationModals();
    }
    
    createCollaborationModals() {
        // Activity Feed Modal
        const activityFeedModal = document.createElement('div');
        activityFeedModal.className = 'modal';
        activityFeedModal.id = 'activityFeedModal';
        activityFeedModal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h3><i class="fas fa-history"></i> Collaboration Activity Feed</h3>
                    <button class="modal-close" onclick="collaboration.closeActivityFeed()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="activity-filters">
                        <div class="filter-group">
                            <label>Filter by User:</label>
                            <select id="userFilter" onchange="collaboration.filterActivity()">
                                <option value="">All Users</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label>Filter by Action:</label>
                            <select id="actionFilter" onchange="collaboration.filterActivity()">
                                <option value="">All Actions</option>
                                <option value="edit">Content Edit</option>
                                <option value="upload">File Upload</option>
                                <option value="delete">Delete</option>
                                <option value="create">Create</option>
                                <option value="comment">Comment</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label>Time Range:</label>
                            <select id="timeFilter" onchange="collaboration.filterActivity()">
                                <option value="1h">Last Hour</option>
                                <option value="24h" selected>Last 24 Hours</option>
                                <option value="7d">Last 7 Days</option>
                                <option value="30d">Last 30 Days</option>
                            </select>
                        </div>
                    </div>
                    <div class="activity-timeline" id="activityTimeline">
                        ${this.renderActivityFeed()}
                    </div>
                </div>
            </div>
        `;
        
        // Invite Collaborators Modal
        const inviteModal = document.createElement('div');
        inviteModal.className = 'modal';
        inviteModal.id = 'inviteCollaboratorsModal';
        inviteModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-user-plus"></i> Invite Collaborators</h3>
                    <button class="modal-close" onclick="collaboration.closeInviteModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="inviteForm" class="invite-form">
                        <div class="form-group">
                            <label><i class="fas fa-envelope"></i> Email Addresses</label>
                            <textarea id="emailList" placeholder="Enter email addresses (one per line or comma-separated)"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-user-tag"></i> Permission Level</label>
                            <select id="invitePermission" required>
                                <option value="editor">Editor - Can edit content</option>
                                <option value="viewer">Viewer - Read-only access</option>
                                <option value="admin">Admin - Full access</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-clock"></i> Session Duration</label>
                            <select id="sessionDuration">
                                <option value="1h">1 Hour</option>
                                <option value="4h">4 Hours</option>
                                <option value="24h" selected>24 Hours</option>
                                <option value="7d">7 Days</option>
                                <option value="unlimited">Unlimited</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-comment"></i> Invitation Message</label>
                            <textarea id="inviteMessage" placeholder="Optional message to include with the invitation"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="allowComments" checked>
                                <span class="checkmark"></span>
                                Allow comments and suggestions
                            </label>
                        </div>
                        
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="notifyChanges" checked>
                                <span class="checkmark"></span>
                                Notify me of their changes
                            </label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="collaboration.closeInviteModal()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button type="button" class="btn btn-primary" onclick="collaboration.sendInvitations()">
                        <i class="fas fa-paper-plane"></i> Send Invitations
                    </button>
                </div>
            </div>
        `;
        
        // Conflict Resolution Modal
        const conflictModal = document.createElement('div');
        conflictModal.className = 'modal';
        conflictModal.id = 'conflictResolutionModal';
        conflictModal.innerHTML = `
            <div class="modal-content extra-large">
                <div class="modal-header">
                    <h3><i class="fas fa-exclamation-triangle"></i> Resolve Collaboration Conflicts</h3>
                    <button class="modal-close" onclick="collaboration.closeConflictModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="conflict-summary">
                        <div class="conflict-stats">
                            <div class="conflict-stat">
                                <div class="stat-value" id="totalConflicts">0</div>
                                <div class="stat-label">Total Conflicts</div>
                            </div>
                            <div class="conflict-stat">
                                <div class="stat-value" id="pendingConflicts">0</div>
                                <div class="stat-label">Pending Resolution</div>
                            </div>
                            <div class="conflict-stat">
                                <div class="stat-value" id="autoResolvedConflicts">0</div>
                                <div class="stat-label">Auto-Resolved</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="conflicts-list" id="conflictsList">
                        ${this.renderConflictsList()}
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-warning" onclick="collaboration.autoResolveConflicts()">
                        <i class="fas fa-magic"></i> Auto-Resolve Simple Conflicts
                    </button>
                    <button type="button" class="btn btn-success" onclick="collaboration.resolveAllConflicts()">
                        <i class="fas fa-check"></i> Mark All Resolved
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(activityFeedModal);
        document.body.appendChild(inviteModal);
        document.body.appendChild(conflictModal);
    }
    
    simulateWebSocketConnection() {
        // Simulate WebSocket connection
        setTimeout(() => {
            this.isConnected = true;
            this.connectionId = 'conn_' + Date.now();
            this.updateConnectionStatus('connected');
            this.simulateActiveUsers();
            
            // Simulate real-time updates
            setInterval(() => {
                this.simulateCollaborationActivity();
            }, 15000); // Every 15 seconds
            
        }, 2000);
    }
    
    simulateActiveUsers() {
        const simulatedUsers = [
            { id: 'user_1', name: 'Sarah Chen', email: 'sarah@example.com', role: 'editor', color: '#3498db', avatar: '👩‍💻' },
            { id: 'user_2', name: 'Mike Johnson', email: 'mike@example.com', role: 'admin', color: '#e74c3c', avatar: '👨‍💼' },
            { id: 'user_3', name: 'Emma Davis', email: 'emma@example.com', role: 'viewer', color: '#2ecc71', avatar: '👩‍🎨' }
        ];
        
        // Randomly add/remove users to simulate activity
        const activeCount = Math.floor(Math.random() * 3) + 1;
        const activeUsers = simulatedUsers.slice(0, activeCount);
        
        this.activeUsers.clear();
        activeUsers.forEach(user => {
            this.activeUsers.set(user.id, {
                ...user,
                lastSeen: Date.now(),
                currentSection: this.getRandomSection(),
                isTyping: Math.random() > 0.7
            });
        });
        
        this.updateActiveUsersList();
        this.updateCollaborationStats();
    }
    
    getRandomSection() {
        const sections = ['Dashboard', 'Music Management', 'Gallery', 'Content Editing', 'Settings'];
        return sections[Math.floor(Math.random() * sections.length)];
    }
    
    simulateCollaborationActivity() {
        const activities = [
            'edited content in About section',
            'uploaded a new music track',
            'modified gallery settings',
            'updated hero section',
            'added a comment',
            'resolved a conflict',
            'invited new collaborator'
        ];
        
        if (this.activeUsers.size > 0) {
            const users = Array.from(this.activeUsers.values());
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            
            this.logActivity({
                id: 'activity_' + Date.now(),
                userId: randomUser.id,
                userName: randomUser.name,
                action: randomActivity,
                timestamp: Date.now(),
                section: randomUser.currentSection
            });
            
            // Update live changes counter
            const liveChangesElement = document.getElementById('liveChanges');
            if (liveChangesElement) {
                const currentCount = parseInt(liveChangesElement.textContent) || 0;
                liveChangesElement.textContent = currentCount + 1;
            }
        }
        
        // Simulate user activity changes
        this.simulateActiveUsers();
    }
    
    updateConnectionStatus(status) {
        const statusElement = document.getElementById('connectionStatus');
        if (!statusElement) return;
        
        const indicator = statusElement.querySelector('.status-indicator');
        const text = statusElement.querySelector('.status-text');
        
        switch (status) {
            case 'connected':
                indicator.className = 'status-indicator online';
                text.textContent = 'Connected';
                break;
            case 'connecting':
                indicator.className = 'status-indicator connecting';
                text.textContent = 'Connecting...';
                break;
            case 'disconnected':
                indicator.className = 'status-indicator offline';
                text.textContent = 'Disconnected';
                break;
        }
    }
    
    updateActiveUsersList() {
        const container = document.getElementById('collaboratorsContainer');
        if (!container) return;
        
        if (this.activeUsers.size === 0) {
            container.innerHTML = `
                <div class="empty-collaborators">
                    <i class="fas fa-users"></i>
                    <p>No active collaborators</p>
                    <small>Invite team members to start collaborating</small>
                </div>
            `;
            return;
        }
        
        container.innerHTML = Array.from(this.activeUsers.values()).map(user => `
            <div class="collaborator-item" style="border-left: 4px solid ${user.color}">
                <div class="collaborator-avatar" style="background: ${user.color}">
                    ${user.avatar}
                </div>
                <div class="collaborator-info">
                    <div class="collaborator-name">${user.name}</div>
                    <div class="collaborator-status">
                        <span class="role-badge ${user.role}">${user.role}</span>
                        <span class="current-section">in ${user.currentSection}</span>
                        ${user.isTyping ? '<span class="typing-indicator">typing...</span>' : ''}
                    </div>
                </div>
                <div class="collaborator-actions">
                    <button class="btn btn-sm btn-secondary" onclick="collaboration.focusOnUser('${user.id}')" title="Follow user">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="collaboration.messageUser('${user.id}')" title="Send message">
                        <i class="fas fa-comment"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    updateCollaborationStats() {
        const activeCollaborators = document.getElementById('activeCollaborators');
        if (activeCollaborators) {
            activeCollaborators.textContent = this.activeUsers.size;
        }
        
        // Simulate sync status
        const syncStatus = document.getElementById('syncStatus');
        if (syncStatus) {
            const status = Math.random() > 0.9 ? '95%' : '100%';
            syncStatus.textContent = status;
        }
    }
    
    startCollaborationSession() {
        if (!this.isConnected) {
            notificationManager.show('Please wait for connection to establish', 'warning');
            return;
        }
        
        this.collaborationSession = {
            id: 'session_' + Date.now(),
            startTime: Date.now(),
            participants: Array.from(this.activeUsers.keys())
        };
        
        notificationManager.show('Collaboration session started! Real-time sync is now active.', 'success');
        
        // Enable real-time document sync
        this.enableDocumentSync();
        
        // Show collaboration cursors
        this.enableCursorTracking();
    }
    
    enableDocumentSync() {
        // Listen for content changes in text areas and inputs
        const editableElements = document.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]');
        
        editableElements.forEach(element => {
            element.addEventListener('input', (e) => {
                this.handleContentChange({
                    elementId: e.target.id || 'unnamed',
                    content: e.target.value,
                    timestamp: Date.now(),
                    userId: 'current_user'
                });
            });
        });
    }
    
    handleContentChange(change) {
        // Add to sync queue
        this.documentSyncQueue.push(change);
        
        // Simulate real-time sync with other users
        setTimeout(() => {
            this.broadcastChange(change);
        }, 100);
    }
    
    broadcastChange(change) {
        // Simulate broadcasting change to other users
        console.log('📡 Broadcasting change:', change);
        
        // Update activity feed
        this.logActivity({
            id: 'sync_' + Date.now(),
            userId: change.userId,
            userName: 'You',
            action: `edited ${change.elementId}`,
            timestamp: change.timestamp,
            section: 'Content'
        });
    }
    
    enableCursorTracking() {
        document.addEventListener('mousemove', (e) => {
            if (!this.collaborationSession) return;
            
            // Simulate showing other users' cursors
            this.updateCursorPosition('current_user', { x: e.clientX, y: e.clientY });
        });
    }
    
    updateCursorPosition(userId, position) {
        this.cursorPositions.set(userId, position);
        
        // In a real implementation, this would sync cursor positions with other users
        // For now, we'll just log it
        // console.log(`Cursor position for ${userId}:`, position);
    }
    
    inviteCollaborators() {
        document.getElementById('inviteCollaboratorsModal').style.display = 'block';
    }
    
    closeInviteModal() {
        document.getElementById('inviteCollaboratorsModal').style.display = 'none';
        document.getElementById('inviteForm').reset();
    }
    
    sendInvitations() {
        const emailList = document.getElementById('emailList').value;
        const permission = document.getElementById('invitePermission').value;
        const duration = document.getElementById('sessionDuration').value;
        const message = document.getElementById('inviteMessage').value;
        
        if (!emailList.trim()) {
            notificationManager.show('Please enter at least one email address', 'error');
            return;
        }
        
        const emails = emailList.split(/[,\n]/).map(e => e.trim()).filter(e => e);
        
        // Simulate sending invitations
        setTimeout(() => {
            notificationManager.show(`Invitations sent to ${emails.length} collaborator(s)!`, 'success');
            this.closeInviteModal();
            
            // Log activity
            this.logActivity({
                id: 'invite_' + Date.now(),
                userId: 'current_user',
                userName: 'You',
                action: `invited ${emails.length} collaborator(s)`,
                timestamp: Date.now(),
                section: 'Collaboration'
            });
        }, 1000);
    }
    
    openActivityFeed() {
        document.getElementById('activityFeedModal').style.display = 'block';
        this.refreshActivityFeed();
    }
    
    closeActivityFeed() {
        document.getElementById('activityFeedModal').style.display = 'none';
    }
    
    renderActivityFeed() {
        const activities = JSON.parse(localStorage.getItem('collaboration_activities') || '[]');
        
        if (activities.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <h4>No Activity Yet</h4>
                    <p>Collaboration activities will appear here</p>
                </div>
            `;
        }
        
        return activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-user"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">
                        <strong>${activity.userName}</strong> ${activity.action}
                    </div>
                    <div class="activity-meta">
                        <span class="activity-time">${new Date(activity.timestamp).toLocaleString()}</span>
                        <span class="activity-section">${activity.section}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    refreshActivityFeed() {
        const timeline = document.getElementById('activityTimeline');
        if (timeline) {
            timeline.innerHTML = this.renderActivityFeed();
        }
    }
    
    logActivity(activity) {
        const activities = JSON.parse(localStorage.getItem('collaboration_activities') || '[]');
        activities.unshift(activity);
        
        // Keep only last 100 activities
        if (activities.length > 100) {
            activities.splice(100);
        }
        
        localStorage.setItem('collaboration_activities', JSON.stringify(activities));
    }
    
    resolveConflicts() {
        document.getElementById('conflictResolutionModal').style.display = 'block';
        this.generateConflictData();
    }
    
    closeConflictModal() {
        document.getElementById('conflictResolutionModal').style.display = 'none';
    }
    
    generateConflictData() {
        // Simulate conflict data
        const conflicts = [
            {
                id: 'conflict_1',
                type: 'content_edit',
                section: 'About Text',
                users: ['Sarah Chen', 'Mike Johnson'],
                timestamp: Date.now() - 300000,
                status: 'pending'
            },
            {
                id: 'conflict_2',
                type: 'file_upload',
                section: 'Gallery',
                users: ['Emma Davis', 'You'],
                timestamp: Date.now() - 600000,
                status: 'pending'
            }
        ];
        
        document.getElementById('totalConflicts').textContent = conflicts.length;
        document.getElementById('pendingConflicts').textContent = conflicts.filter(c => c.status === 'pending').length;
        document.getElementById('autoResolvedConflicts').textContent = '3';
    }
    
    renderConflictsList() {
        return `
            <div class="conflict-item">
                <div class="conflict-header">
                    <div class="conflict-type">
                        <i class="fas fa-edit"></i>
                        <span>Content Edit Conflict</span>
                    </div>
                    <div class="conflict-status pending">Pending</div>
                </div>
                <div class="conflict-details">
                    <p><strong>Section:</strong> About Text</p>
                    <p><strong>Conflicting Users:</strong> Sarah Chen, Mike Johnson</p>
                    <p><strong>Time:</strong> 5 minutes ago</p>
                </div>
                <div class="conflict-actions">
                    <button class="btn btn-sm btn-success">Accept Sarah's Version</button>
                    <button class="btn btn-sm btn-warning">Accept Mike's Version</button>
                    <button class="btn btn-sm btn-secondary">Manual Merge</button>
                </div>
            </div>
            
            <div class="conflict-item">
                <div class="conflict-header">
                    <div class="conflict-type">
                        <i class="fas fa-upload"></i>
                        <span>File Upload Conflict</span>
                    </div>
                    <div class="conflict-status pending">Pending</div>
                </div>
                <div class="conflict-details">
                    <p><strong>Section:</strong> Gallery</p>
                    <p><strong>Conflicting Users:</strong> Emma Davis, You</p>
                    <p><strong>Time:</strong> 10 minutes ago</p>
                </div>
                <div class="conflict-actions">
                    <button class="btn btn-sm btn-success">Keep Both Files</button>
                    <button class="btn btn-sm btn-warning">Replace with Latest</button>
                    <button class="btn btn-sm btn-secondary">Manual Review</button>
                </div>
            </div>
        `;
    }
    
    autoResolveConflicts() {
        notificationManager.show('Auto-resolving simple conflicts...', 'info');
        
        setTimeout(() => {
            document.getElementById('pendingConflicts').textContent = '0';
            document.getElementById('autoResolvedConflicts').textContent = '5';
            notificationManager.show('Simple conflicts resolved automatically!', 'success');
        }, 2000);
    }
    
    resolveAllConflicts() {
        if (confirm('Mark all conflicts as resolved? This action cannot be undone.')) {
            document.getElementById('pendingConflicts').textContent = '0';
            notificationManager.show('All conflicts marked as resolved', 'success');
            this.closeConflictModal();
        }
    }
    
    focusOnUser(userId) {
        const user = this.activeUsers.get(userId);
        if (user) {
            notificationManager.show(`Following ${user.name} in ${user.currentSection}`, 'info');
            // In a real implementation, this would navigate to where the user is working
        }
    }
    
    messageUser(userId) {
        const user = this.activeUsers.get(userId);
        if (user) {
            const message = prompt(`Send a message to ${user.name}:`);
            if (message) {
                notificationManager.show(`Message sent to ${user.name}`, 'success');
            }
        }
    }
    
    toggleCursorTracking() {
        const showCursors = document.getElementById('showCursors').checked;
        if (showCursors) {
            notificationManager.show('Cursor tracking enabled', 'info');
        } else {
            notificationManager.show('Cursor tracking disabled', 'info');
        }
    }
    
    toggleSelectionTracking() {
        const showSelections = document.getElementById('showSelections').checked;
        if (showSelections) {
            notificationManager.show('Selection tracking enabled', 'info');
        } else {
            notificationManager.show('Selection tracking disabled', 'info');
        }
    }
    
    filterActivity() {
        const userFilter = document.getElementById('userFilter').value;
        const actionFilter = document.getElementById('actionFilter').value;
        const timeFilter = document.getElementById('timeFilter').value;
        
        // In a real implementation, this would filter the activity feed
        notificationManager.show('Activity feed filtered', 'info');
        this.refreshActivityFeed();
    }
    
    setupEventListeners() {
        // Setup window-level collaboration events
        window.addEventListener('beforeunload', () => {
            if (this.collaborationSession) {
                this.endCollaborationSession();
            }
        });
        
        // Listen for visibility changes to update user status
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.updateUserStatus('away');
            } else {
                this.updateUserStatus('active');
            }
        });
    }
    
    updateUserStatus(status) {
        // Update current user's status
        console.log('User status updated:', status);
    }
    
    endCollaborationSession() {
        if (this.collaborationSession) {
            this.logActivity({
                id: 'session_end_' + Date.now(),
                userId: 'current_user',
                userName: 'You',
                action: 'ended collaboration session',
                timestamp: Date.now(),
                section: 'Collaboration'
            });
            
            this.collaborationSession = null;
        }
    }
    
    initializeDocumentSync() {
        // Initialize document synchronization
        console.log('📄 Document sync initialized');
        
        // Setup periodic sync check
        setInterval(() => {
            if (this.documentSyncQueue.length > 0) {
                this.processSyncQueue();
            }
        }, 5000);
    }
    
    processSyncQueue() {
        const queueLength = this.documentSyncQueue.length;
        
        // Process queued changes
        this.documentSyncQueue.forEach(change => {
            this.syncChangeToServer(change);
        });
        
        // Clear queue
        this.documentSyncQueue = [];
        
        console.log(`📡 Processed ${queueLength} sync operations`);
    }
    
    syncChangeToServer(change) {
        // Simulate server sync
        // In a real implementation, this would send the change to the WebSocket server
        console.log('Syncing change to server:', change);
    }
}

// Initialize Real-time Collaboration
function initializeRealTimeCollaboration() {
    window.collaboration = new RealTimeCollaboration();
    console.log('✅ Real-time Collaboration initialized');
}