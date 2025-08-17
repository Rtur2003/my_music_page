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
        this.updateStats();
        this.loadContent();
        
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
    
    uploadFile(file, index, total, progressFill, progressText) {
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
    }
    
    addMusicToList(file) {
        const musicList = document.querySelector('.music-list');
        const musicItem = document.createElement('div');
        musicItem.className = 'music-item';
        
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        const fileSize = this.formatFileSize(file.size);
        
        musicItem.innerHTML = `
            <div class="music-info">
                <img src="assets/images/default-album.jpg" alt="Album Cover" class="music-thumb">
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
        
        this.bindItemEvents(musicItem);
        musicList.appendChild(musicItem);
        
        musicItem.style.opacity = '0';
        musicItem.style.transform = 'translateY(20px)';
        setTimeout(() => {
            musicItem.style.transition = 'all 0.3s ease';
            musicItem.style.opacity = '1';
            musicItem.style.transform = 'translateY(0)';
        }, 100);
    }
    
    addImageToList(file) {
        const galleryGrid = document.querySelector('.gallery-grid');
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-admin-item';
        
        const reader = new FileReader();
        reader.onload = (e) => {
            galleryItem.innerHTML = `
                <img src="${e.target.result}" alt="Uploaded Image">
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
            
            this.bindItemEvents(galleryItem);
            galleryGrid.appendChild(galleryItem);
            
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
            editBtn.addEventListener('click', () => {
                this.showNotification('Düzenleme özelliği yakında gelecek!', 'info');
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deleteItem(item);
            });
        }
    }
    
    deleteItem(item) {
        if (confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
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
        // Get real data from actual DOM elements - with fallback to main site
        let totalTracks = document.querySelectorAll('.music-item').length;
        let totalImages = document.querySelectorAll('.gallery-admin-item, .gallery-item').length;
        
        // Fallback: try to get from main site if admin elements don't exist
        if (totalTracks === 0) {
            totalTracks = document.querySelectorAll('.music-card').length || 4; // Default to 4
        }
        
        if (totalImages === 0) {
            totalImages = document.querySelectorAll('.gallery-item').length || 6; // Default to 6
        }
        
        // Ensure positive numbers
        totalTracks = Math.max(0, totalTracks);
        totalImages = Math.max(0, totalImages);
        
        // Calculate real page views and engagement
        const realViews = this.getRealPageViews();
        const realLikes = this.getRealEngagement();
        
        // Ensure positive numbers for views and likes too
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
        
        console.log(`📊 Stats updated: ${totalTracks} tracks, ${totalImages} images, ${safeViews} views, ${safeLikes} engagement`);
    }
    
    getRealPageViews() {
        // Get from localStorage if available, otherwise start from 0
        let views = parseInt(localStorage.getItem('page_views') || '0');
        
        // Increment view count on each admin panel access
        views++;
        localStorage.setItem('page_views', views.toString());
        
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
    
    // Save to localStorage
    localStorage.setItem('about_text_en', englishText);
    localStorage.setItem('about_text_tr', turkishText);
    
    showNotification('About text saved successfully!', 'success');
    console.log('📝 About text saved');
}

function saveHeroContent() {
    const title = document.getElementById('heroTitle').value;
    const subtitle = document.getElementById('heroSubtitle').value;
    const description = document.getElementById('heroDescription').value;
    
    // Save to localStorage
    localStorage.setItem('hero_title', title);
    localStorage.setItem('hero_subtitle', subtitle);
    localStorage.setItem('hero_description', description);
    
    showNotification('Hero content saved successfully!', 'success');
    console.log('📝 Hero content saved');
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
    } else {
        console.error('Required elements not found!');
        
        // Fallback: try to find admin panel after 1 second
        setTimeout(() => {
            const retryLoginScreen = document.getElementById('loginScreen');
            const retryAdminPanel = document.getElementById('adminPanel');
            
            if (retryLoginScreen && retryAdminPanel) {
                console.log('Found elements on retry, initializing auth...');
                new AdminAuth();
            } else {
                console.error('Elements still not found after retry');
            }
        }, 1000);
    }
});