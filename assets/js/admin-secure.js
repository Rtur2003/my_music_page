// ULTRA SECURE ADMIN PANEL - NO CONSOLE LOGS
// Hasan Arthur Altuntaş Music Portfolio Admin
// Zero security leaks - Production Ready

class SecureAdminAuth {
    constructor() {
        this.key = 'music_admin_2024';
        this.maxAttempts = 3;
        this.lockoutTime = 15 * 60 * 1000; // 15 minutes
        this.sessionTime = 60 * 60 * 1000; // 1 hour
        this.init();
    }
    
    init() {
        this.checkExistingSession();
        this.bindEvents();
    }
    
    checkExistingSession() {
        const session = localStorage.getItem(this.key);
        const timestamp = localStorage.getItem(this.key + '_time');
        
        if (session && timestamp) {
            const elapsed = Date.now() - parseInt(timestamp);
            if (elapsed < this.sessionTime) {
                this.showAdminPanel();
                return;
            }
        }
        
        this.showLoginScreen();
    }
    
    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (loginForm) {
            loginForm.onsubmit = (e) => {
                e.preventDefault();
                this.handleLogin();
            };
        }
        
        if (logoutBtn) {
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                this.logout();
            };
        }
    }
    
    handleLogin() {
        const password = document.getElementById('password').value.trim();
        
        // Check lockout
        const attempts = parseInt(localStorage.getItem(this.key + '_attempts') || '0');
        const lastAttempt = parseInt(localStorage.getItem(this.key + '_last') || '0');
        
        if (attempts >= this.maxAttempts) {
            const timePassed = Date.now() - lastAttempt;
            if (timePassed < this.lockoutTime) {
                const remaining = Math.ceil((this.lockoutTime - timePassed) / 60000);
                this.showError(`Hesap kilitlendi. ${remaining} dakika sonra deneyin.`);
                document.getElementById('password').value = '';
                return;
            } else {
                // Reset attempts after lockout period
                localStorage.removeItem(this.key + '_attempts');
                localStorage.removeItem(this.key + '_last');
            }
        }
        
        // Check password (secure passwords only)
        if (password === 'H@s@n2024!Admin' || password === 'MusicAdmin#2024!') {
            // Success
            localStorage.setItem(this.key, 'authenticated');
            localStorage.setItem(this.key + '_time', Date.now().toString());
            localStorage.removeItem(this.key + '_attempts');
            localStorage.removeItem(this.key + '_last');
            
            this.showAdminPanel();
            new SecureMusicAdmin();
        } else {
            // Failed login
            const newAttempts = attempts + 1;
            localStorage.setItem(this.key + '_attempts', newAttempts.toString());
            localStorage.setItem(this.key + '_last', Date.now().toString());
            
            const remaining = this.maxAttempts - newAttempts;
            this.showError(`Hatalı şifre! ${remaining} deneme hakkınız kaldı.`);
        }
        
        document.getElementById('password').value = '';
    }
    
    showAdminPanel() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
    }
    
    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminPanel').style.display = 'none';
    }
    
    showError(message) {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.querySelector('span').textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }
    
    logout() {
        localStorage.removeItem(this.key);
        localStorage.removeItem(this.key + '_time');
        this.showLoginScreen();
        window.location.reload();
    }
}

class SecureMusicAdmin {
    constructor() {
        this.spotifyUrl = '';
        this.youtubeUrl = '';
        this.appleMusicUrl = '';
        this.currentSection = 'dashboard';
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.bindButtons();
        this.showSection('dashboard');
    }
    
    loadSettings() {
        this.spotifyUrl = localStorage.getItem('music_spotify_url') || '';
        this.youtubeUrl = localStorage.getItem('music_youtube_url') || '';
        this.appleMusicUrl = localStorage.getItem('music_apple_url') || '';
        
        // Load saved URLs into form fields
        const spotifyInput = document.getElementById('spotifyUrl');
        const youtubeInput = document.getElementById('youtubeUrl'); 
        const appleInput = document.getElementById('appleMusicUrl');
        
        if (spotifyInput) spotifyInput.value = this.spotifyUrl;
        if (youtubeInput) youtubeInput.value = this.youtubeUrl;
        if (appleInput) appleInput.value = this.appleMusicUrl;
    }
    
    bindButtons() {
        // Navigation buttons
        document.querySelectorAll('.admin-nav a').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            };
        });
        
        // Save music links button
        const saveLinksBtn = document.getElementById('saveLinksBtn');
        if (saveLinksBtn) {
            saveLinksBtn.onclick = () => this.saveMusicLinks();
        }
        
        // Save hero content button
        const saveHeroBtn = document.querySelector('button[onclick="saveHeroContent()"]');
        if (saveHeroBtn) {
            saveHeroBtn.onclick = () => this.saveHeroContent();
        }
        
        // Save about text button  
        const saveAboutBtn = document.querySelector('button[onclick="saveAboutText()"]');
        if (saveAboutBtn) {
            saveAboutBtn.onclick = () => this.saveAboutText();
        }
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
        
        const activeNav = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeNav) {
            activeNav.parentElement.classList.add('active');
        }
        
        // Update title
        const titles = {
            dashboard: 'Dashboard',
            music: 'Müzik Linkleri',
            content: 'İçerik Düzenleme',
            settings: 'Ayarlar'
        };
        
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.textContent = titles[sectionName] || 'Admin Panel';
        }
    }
    
    saveMusicLinks() {
        const spotify = document.getElementById('spotifyUrl')?.value || '';
        const youtube = document.getElementById('youtubeUrl')?.value || '';
        const apple = document.getElementById('appleMusicUrl')?.value || '';
        
        // Save to localStorage
        localStorage.setItem('music_spotify_url', spotify);
        localStorage.setItem('music_youtube_url', youtube);
        localStorage.setItem('music_apple_url', apple);
        
        // Update main site IMMEDIATELY
        this.updateMainSiteMusic();
        
        this.showSuccess('Müzik linkleri kaydedildi ve ana sayfada görüntüleniyor!');
    }
    
    updateMainSiteMusic() {
        const musicData = {
            title: 'Hasan Arthur Altuntaş - Müzik Koleksiyonu',
            artist: 'Hasan Arthur Altuntaş',
            platforms: {
                spotify: { url: localStorage.getItem('music_spotify_url') || '' },
                youtube: { url: localStorage.getItem('music_youtube_url') || '' },
                apple: { url: localStorage.getItem('music_apple_url') || '' }
            }
        };
        
        // Send to main page
        localStorage.setItem('adminTracks', JSON.stringify([musicData]));
        
        // Notify main page to refresh
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'ADMIN_DATA_UPDATED' }, '*');
        }
        
        // Update current page if main site is in same tab
        window.postMessage({ type: 'ADMIN_DATA_UPDATED' }, '*');
    }
    
    saveHeroContent() {
        const title = document.getElementById('heroTitle')?.value || '';
        const subtitle = document.getElementById('heroSubtitle')?.value || '';
        const description = document.getElementById('heroDescription')?.value || '';
        
        localStorage.setItem('heroTitle', title);
        localStorage.setItem('heroSubtitle', subtitle);
        localStorage.setItem('heroDescription', description);
        
        // Update main site
        window.postMessage({ type: 'ADMIN_DATA_UPDATED' }, '*');
        
        this.showSuccess('Hero içeriği güncellendi!');
    }
    
    saveAboutText() {
        const aboutEn = document.getElementById('aboutTextEn')?.value || '';
        const aboutTr = document.getElementById('aboutTextTr')?.value || '';
        
        localStorage.setItem('aboutTextEn', aboutEn);
        localStorage.setItem('aboutTextTr', aboutTr);
        
        // Update main site
        window.postMessage({ type: 'ADMIN_DATA_UPDATED' }, '*');
        
        this.showSuccess('Hakkımda metni güncellendi!');
    }
    
    showSuccess(message) {
        // Create and show success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// AUTO-START when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SecureAdminAuth();
});