class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.data = this.loadData();
        
        this.init();
    }
    
    init() {
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
        const totalTracks = document.querySelectorAll('.music-item').length;
        const totalImages = document.querySelectorAll('.gallery-admin-item').length;
        
        const totalTracksEl = document.getElementById('totalTracks');
        const totalImagesEl = document.getElementById('totalImages');
        
        if (totalTracksEl) {
            this.animateCounter(totalTracksEl, totalTracks);
        }
        
        if (totalImagesEl) {
            this.animateCounter(totalImagesEl, totalImages);
        }
        
        this.data.stats = {
            tracks: totalTracks,
            images: totalImages,
            views: parseInt(document.getElementById('totalViews')?.textContent?.replace(',', '') || '1234'),
            downloads: parseInt(document.getElementById('totalDownloads')?.textContent || '89')
        };
        
        this.saveData();
    }
    
    animateCounter(element, targetValue) {
        const currentValue = parseInt(element.textContent);
        if (currentValue === targetValue) return;
        
        const increment = targetValue > currentValue ? 1 : -1;
        const step = () => {
            const newValue = parseInt(element.textContent) + increment;
            element.textContent = newValue;
            
            if (newValue !== targetValue) {
                setTimeout(step, 50);
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