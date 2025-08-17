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
                
                // Initialize admin panel if logged in
                setTimeout(() => {
                    if (!window.adminPanelInstance) {
                        window.adminPanelInstance = new AdminPanel();
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
        
        const password = passwordInput.value.trim();
        
        console.log('Login attempt with password:', password); // Debug
        
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
        
        console.log('Verifying password:', password === 'H1a2s3a4n5+'); // Debug
        
        if (this.verifyPassword(password)) {
            console.log('Password correct, logging in...'); // Debug
            this.loginSuccess();
        } else {
            console.log('Password incorrect'); // Debug
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
        
        // Initialize admin panel after successful login
        setTimeout(() => {
            if (!window.adminPanelInstance) {
                window.adminPanelInstance = new AdminPanel();
            }
            // Initialize content editor
            this.initContentEditor();
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
        console.log('Showing admin panel...'); // Debug
        
        const loginScreen = document.getElementById('loginScreen');
        const adminPanel = document.getElementById('adminPanel');
        
        console.log('Login screen element:', loginScreen); // Debug
        console.log('Admin panel element:', adminPanel); // Debug
        
        if (loginScreen) {
            loginScreen.style.display = 'none';
            console.log('Login screen hidden'); // Debug
        }
        
        if (adminPanel) {
            adminPanel.style.display = 'block';
            console.log('Admin panel shown'); // Debug
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
            console.log('🔧 Corrupted stats detected, resetting...');
            this.resetStats();
        }
        
        this.bindEvents();
        this.loadContent();
        
        // Load uploaded content FIRST, then update stats
        // Add delay to ensure DOM is ready
        setTimeout(() => {
            console.log('⏰ Starting delayed content loading...');
            this.loadUploadedContent();
            
            // Update stats after content is loaded
            setTimeout(() => {
                this.updateStats();
            }, 200);
        }, 500);
        
        console.log('🔧 Admin panel başarıyla yüklendi!');
    }
    
    bindEvents() {
        const navLinks = document.querySelectorAll('.nav-item a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
                this.updateActiveNav(link.parentElement);
            });
        });
        
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }
        
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        const addMusicBtn = document.getElementById('addMusicBtn');
        if (addMusicBtn) {
            addMusicBtn.addEventListener('click', () => this.openUploadModal('music'));
        }
        
        const addImageBtn = document.getElementById('addImageBtn');
        if (addImageBtn) {
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
        const closeBtn = modal.querySelector('.modal-close');
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        closeBtn.addEventListener('click', () => {
            this.closeUploadModal();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeUploadModal();
            }
        });
        
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
        
        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });
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
        
        const formData = new FormData();
        formData.append('file', file);
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 100) progress = 100;
            
            const totalProgress = ((index * 100) + progress) / total;
            progressFill.style.width = totalProgress + '%';
            progressText.textContent = `Yükleniyor... ${Math.round(totalProgress)}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                
                if (index === total - 1) {
                    setTimeout(() => {
                        this.showNotification('Dosyalar başarıyla yüklendi!', 'success');
                        this.closeUploadModal();
                        this.addFileToList(file);
                        this.updateStats();
                    }, 500);
                }
            }
        }, 100);
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
        console.log('🎵 Starting to add music file:', file.name);
        
        // Check if file with same name already exists
        const uploadedMusic = JSON.parse(localStorage.getItem('uploadedMusic') || '[]');
        const existingMusic = uploadedMusic.find(music => music.title === file.name.replace(/\.[^/.]+$/, ""));
        if (existingMusic) {
            console.log('⚠️ Music file already uploaded:', file.name);
            this.showNotification('Bu müzik dosyası zaten yüklü!', 'warning');
            return;
        }
        
        const musicList = document.querySelector('.music-list');
        console.log('🔍 Looking for .music-list container for upload:', musicList);
        
        if (!musicList) {
            console.error('❌ .music-list container not found! Cannot add music file');
            this.showNotification('Error: Music container not found!', 'error');
            return;
        }
        
        const musicItem = document.createElement('div');
        musicItem.className = 'music-item';
        
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        const fileSize = this.formatFileSize(file.size);
        const fileUrl = URL.createObjectURL(file);
        const albumCover = 'assets/images/album-cover-1.jpg'; // Default cover
        
        // Create unique ID for this music item
        const musicId = 'music_' + Date.now();
        musicItem.dataset.musicId = musicId;
        
        console.log('🎵 Creating music item with ID:', musicId);
        
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
        
        console.log('💾 Saving music data to localStorage:', musicData);
        this.saveMusicData(musicData);
        
        this.bindItemEvents(musicItem);
        musicList.appendChild(musicItem);
        console.log('✅ Music item added to admin panel DOM');
        
        // Add to main site immediately
        this.addMusicToMainSite(musicData);
        
        musicItem.style.opacity = '0';
        musicItem.style.transform = 'translateY(20px)';
        setTimeout(() => {
            musicItem.style.transition = 'all 0.3s ease';
            musicItem.style.opacity = '1';
            musicItem.style.transform = 'translateY(0)';
        }, 100);
        
        console.log('🎉 Music upload process completed for:', fileName);
    }
    
    addImageToList(file) {
        // Check if file with same name already exists
        const uploadedGallery = JSON.parse(localStorage.getItem('uploadedGallery') || '[]');
        const existingImage = uploadedGallery.find(img => img.title === file.name.replace(/\.[^/.]+$/, ""));
        if (existingImage) {
            console.log('⚠️ Image file already uploaded:', file.name);
            this.showNotification('Bu resim dosyası zaten yüklü!', 'warning');
            return;
        }
        
        const galleryGrid = document.querySelector('.gallery-grid');
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-admin-item';
        
        // Create unique ID for this gallery item
        const galleryId = 'gallery_' + Date.now();
        galleryItem.dataset.galleryId = galleryId;
        
        const reader = new FileReader();
        reader.onload = (e) => {
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
        };
        reader.readAsDataURL(file);
    }
    
    bindItemEvents(item) {
        const editBtn = item.querySelector('.edit');
        const deleteBtn = item.querySelector('.delete');
        
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (item.classList.contains('music-item')) {
                    editMusicItem(editBtn);
                } else if (item.classList.contains('gallery-admin-item')) {
                    editGalleryItem(editBtn);
                }
            });
        }
        
        if (deleteBtn) {
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
                item.remove();
                this.updateStats();
                this.showNotification('Öğe başarıyla silindi!', 'success');
            }, 300);
        }
    }
    
    removeMusicFromStorage(musicId) {
        let musicList = JSON.parse(localStorage.getItem('uploaded_music') || '[]');
        musicList = musicList.filter(music => music.id !== musicId);
        localStorage.setItem('uploaded_music', JSON.stringify(musicList));
        console.log('🗑️ Music removed from localStorage:', musicId);
    }
    
    removeGalleryFromStorage(galleryId) {
        let galleryList = JSON.parse(localStorage.getItem('uploaded_gallery') || '[]');
        galleryList = galleryList.filter(gallery => gallery.id !== galleryId);
        localStorage.setItem('uploaded_gallery', JSON.stringify(galleryList));
        console.log('🗑️ Gallery item removed from localStorage:', galleryId);
    }
    
    initializeFileHandling() {
        const existingItems = document.querySelectorAll('.music-item, .gallery-admin-item');
        existingItems.forEach(item => {
            this.bindItemEvents(item);
        });
    }
    
    bindFormEvents() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showNotification('Ayarlar başarıyla kaydedildi!', 'success');
            });
        });
        
        const saveButtons = document.querySelectorAll('.btn-secondary');
        saveButtons.forEach(btn => {
            if (btn.querySelector('i.fa-save')) {
                btn.addEventListener('click', () => {
                    this.showNotification('İçerik başarıyla kaydedildi!', 'success');
                });
            }
        });
        
        const backupBtn = document.querySelector('[data-action="backup"]');
        if (backupBtn) {
            backupBtn.addEventListener('click', () => {
                this.createBackup();
            });
        }
        
        const backupFile = document.getElementById('backupFile');
        if (backupFile) {
            backupFile.addEventListener('change', (e) => {
                this.restoreBackup(e.target.files[0]);
            });
        }
    }
    
    updateStats() {
        // Get counts from localStorage + DOM elements
        const savedMusicList = JSON.parse(localStorage.getItem('uploaded_music') || '[]');
        const savedGalleryList = JSON.parse(localStorage.getItem('uploaded_gallery') || '[]');
        
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
        
        this.showNotification('Yedek dosyası başarıyla oluşturuldu!', 'success');
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
                this.showNotification('Yedek başarıyla geri yüklendi!', 'success');
            } catch (error) {
                this.showNotification('Yedek dosyası geçersiz!', 'error');
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
    
    showNotification(message, type = 'info') {
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
        
        this.showNotification('Rapor başarıyla oluşturuldu!', 'success');
    }
    
    // LocalStorage Management Functions
    saveMusicData(musicData) {
        let musicList = JSON.parse(localStorage.getItem('uploaded_music') || '[]');
        musicList.push(musicData);
        localStorage.setItem('uploaded_music', JSON.stringify(musicList));
        console.log('🎵 Music saved to localStorage:', musicData.title);
    }
    
    saveGalleryData(galleryData) {
        let galleryList = JSON.parse(localStorage.getItem('uploaded_gallery') || '[]');
        galleryList.push(galleryData);
        localStorage.setItem('uploaded_gallery', JSON.stringify(galleryList));
        console.log('🖼️ Gallery image saved to localStorage:', galleryData.title);
    }
    
    loadUploadedContent() {
        console.log('🔄 Loading uploaded content from localStorage...');
        
        // Load uploaded music
        const musicList = JSON.parse(localStorage.getItem('uploaded_music') || '[]');
        console.log('🎵 Found music in localStorage:', musicList);
        
        musicList.forEach((musicData, index) => {
            console.log(`🎵 Recreating music item ${index + 1}:`, musicData.title);
            this.recreateMusicItem(musicData);
            this.addMusicToMainSite(musicData);
        });
        
        // Load uploaded gallery
        const galleryList = JSON.parse(localStorage.getItem('uploaded_gallery') || '[]');
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

document.addEventListener('DOMContentLoaded', function() {
    window.adminPanel = new AdminPanel();
    
    window.addEventListener('beforeunload', () => {
        if (window.adminPanel) {
            window.adminPanel.saveData();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            window.adminPanel.showNotification('Otomatik kayıt aktif!', 'info');
        }
    });
});

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
    
    showNotification('About text saved and applied to main site!', 'success');
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
    
    showNotification('Hero content saved and applied to main site!', 'success');
    console.log('📝 Hero content saved and applied');
}

function showNotification(message, type = 'info') {
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
    showNotification('Contact information saved!', 'success');
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
    
    showNotification('Site settings saved!', 'success');
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
    showNotification('Social media links saved!', 'success');
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

// Initialize authentication system
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing auth...'); // Debug
    
    // Check if elements exist
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
    
    console.log('Login screen exists:', !!loginScreen); // Debug
    console.log('Admin panel exists:', !!adminPanel); // Debug
    
    if (loginScreen && adminPanel) {
        new AdminAuth();
        
        // Load saved content when admin panel is ready
        setTimeout(() => {
            loadContentFromLocalStorage();
        }, 500);
    } else {
        console.error('Required elements not found!');
        
        // Fallback: try to find admin panel after 1 second
        setTimeout(() => {
            const retryLoginScreen = document.getElementById('loginScreen');
            const retryAdminPanel = document.getElementById('adminPanel');
            
            if (retryLoginScreen && retryAdminPanel) {
                console.log('Found elements on retry, initializing auth...');
                new AdminAuth();
                
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
        showNotification(`"${title}" successfully updated!`, 'success');
        
        // Update stats if needed
        if (window.adminPanelInstance) {
            window.adminPanelInstance.updateStats();
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
        showNotification(`"${title}" gallery item updated!`, 'success');
        
        // Update stats if needed
        if (window.adminPanelInstance) {
            window.adminPanelInstance.updateStats();
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
function openMusicEditModal() {
    const modal = document.getElementById('musicEditModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeMusicEditModal() {
    const modal = document.getElementById('musicEditModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

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
    
    adminPanel.showNotification('Müzik başarıyla güncellendi!', 'success');
    closeMusicEditModal();
    
    // Sync to main site
    adminPanel.syncToMainSite();
}

function openGalleryEditModal() {
    const modal = document.getElementById('galleryEditModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeGalleryEditModal() {
    const modal = document.getElementById('galleryEditModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function saveGalleryEdit() {
    if (!currentEditingGalleryItem) return;
    
    const title = document.getElementById('galleryTitle').value;
    const description = document.getElementById('galleryDescription').value;
    const category = document.getElementById('galleryCategory').value;
    const date = document.getElementById('galleryDate').value;
    const location = document.getElementById('galleryLocation').value;
    
    // Update item in DOM
    const titleEl = currentEditingGalleryItem.querySelector('h5');
    const descEl = currentEditingGalleryItem.querySelector('p');
    
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = description;
    
    // Update localStorage
    const galleryId = currentEditingGalleryItem.dataset.galleryId;
    if (galleryId) {
        const uploadedGallery = JSON.parse(localStorage.getItem('uploadedGallery') || '[]');
        const galleryIndex = uploadedGallery.findIndex(g => g.id === galleryId);
        if (galleryIndex !== -1) {
            uploadedGallery[galleryIndex] = {
                ...uploadedGallery[galleryIndex],
                title: title,
                description: description,
                category: category,
                date: date,
                location: location
            };
            localStorage.setItem('uploadedGallery', JSON.stringify(uploadedGallery));
        }
    }
    
    adminPanel.showNotification('Galeri öğesi başarıyla güncellendi!', 'success');
    closeGalleryEditModal();
    
    // Sync to main site
    adminPanel.syncToMainSite();
}

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
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
        adminPanel.showNotification('Müzik başarıyla silindi!', 'success');
        
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
        adminPanel.showNotification('Resim başarıyla silindi!', 'success');
        
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
        const performanceMonitor = dashboard.querySelector('.performance-monitor');
        if (performanceMonitor) {
            performanceMonitor.parentNode.insertBefore(analyticsSection, performanceMonitor.nextSibling);
        }
        
        this.updateAnalytics();
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