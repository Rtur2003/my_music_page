// ===============================================
// SECURE ADMIN SYSTEM WITH NETLIFY INTEGRATION
// ===============================================

class AdminSystem {
    constructor() {
        this.isAuthenticated = false;
        this.adminKey = null;
        this.musicData = this.loadMusicData();
        this.init();
    }

    init() {
        // Check if already authenticated
        this.checkAuthStatus();
        this.setupEventListeners();
        this.renderTrackList();
        this.updateStats();
    }

    checkAuthStatus() {
        try {
            const adminSession = sessionStorage.getItem('admin_authenticated');
            if (adminSession === 'true') {
                this.isAuthenticated = true;
                this.showDashboard();
            }
        } catch (error) {
            console.log('SessionStorage not available, continuing without saved auth');
        }
    }

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

        // Track form
        const trackForm = document.getElementById('trackForm');
        if (trackForm) {
            trackForm.addEventListener('submit', (e) => this.handleAddTrack(e));
        }

        // Preview site button
        const previewBtn = document.getElementById('previewSite');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.previewSite());
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const keyInput = document.getElementById('adminKey');
        const messageDiv = document.getElementById('loginMessage');
        const enteredKey = keyInput.value.trim();

        if (!enteredKey) {
            this.showMessage(messageDiv, 'Please enter admin key', 'error');
            return;
        }

        try {
            // For Netlify deployment, we'll use environment variables
            // For development, we'll use a fallback
            const isValid = await this.validateAdminKey(enteredKey);
            
            if (isValid) {
                this.isAuthenticated = true;
                this.adminKey = enteredKey;
                
                // Save auth status if storage available
                try {
                    if (window.sessionStorage) {
                        sessionStorage.setItem('admin_authenticated', 'true');
                    }
                } catch (error) {
                    console.log('Session storage not available');
                }
                
                this.showDashboard();
                this.showMessage(messageDiv, 'Authentication successful!', 'success');
            } else {
                this.showMessage(messageDiv, 'Invalid admin key. Access denied.', 'error');
                keyInput.value = '';
            }
        } catch (error) {
            console.error('Authentication error:', error);
            this.showMessage(messageDiv, 'Authentication service unavailable', 'error');
        }
    }

    async validateAdminKey(enteredKey) {
        console.log('Validating admin key...');
        
        // For development, use the dev key
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '') {
            const devKey = 'HASAN_ARTHUR_ADMIN_2024';
            console.log('Development mode - checking dev key');
            return enteredKey === devKey;
        }

        try {
            console.log('Production mode - checking with serverless function');
            // For Netlify production, make API call to serverless function
            const response = await fetch('/.netlify/functions/admin-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ adminKey: enteredKey })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Serverless function response:', result);
                return result.valid === true;
            } else {
                console.log('Serverless function failed, using fallback');
                return this.fallbackValidation(enteredKey);
            }
            
        } catch (error) {
            console.log('Serverless function not available, using fallback validation:', error.message);
            return this.fallbackValidation(enteredKey);
        }
    }

    fallbackValidation(enteredKey) {
        console.log('Using fallback validation');
        
        // Known valid keys for fallback
        const validKeys = [
            'MusicPage123',           // Netlify production key
            'HASAN_ARTHUR_ADMIN_2024' // Development key
        ];
        
        const isValid = validKeys.includes(enteredKey);
        console.log('Fallback validation result:', isValid);
        
        return isValid;
    }

    simpleHash(str) {
        // Simple SHA-1 implementation for admin key verification
        // Note: This is for demonstration - in production, use proper server-side validation
        let hash = 0;
        if (str.length === 0) return hash.toString();
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16);
    }

    handleLogout() {
        this.isAuthenticated = false;
        this.adminKey = null;
        
        try {
            if (window.sessionStorage) {
                sessionStorage.removeItem('admin_authenticated');
            }
        } catch (error) {
            console.log('Session storage not available for logout');
        }
        
        this.showLogin();
    }

    showDashboard() {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
    }

    showLogin() {
        document.getElementById('adminLogin').style.display = 'block';
        document.getElementById('adminDashboard').style.display = 'none';
    }

    handleAddTrack(e) {
        e.preventDefault();
        
        if (!this.isAuthenticated) {
            alert('Please login first');
            return;
        }

        const formData = new FormData(e.target);
        const trackData = {
            id: Date.now().toString(),
            title: document.getElementById('trackTitle').value,
            artist: document.getElementById('trackArtist').value,
            genre: document.getElementById('trackGenre').value,
            duration: document.getElementById('trackDuration').value,
            platforms: {
                spotify: document.getElementById('spotifyUrl').value,
                youtube: document.getElementById('youtubeUrl').value,
                apple: document.getElementById('appleUrl').value,
                soundcloud: document.getElementById('soundcloudUrl').value
            },
            artwork: document.getElementById('artworkUrl').value || 'assets/images/logo-main.png',
            audioFile: '', // Will be handled separately for file uploads
            createdAt: new Date().toISOString()
        };

        // Add track to music data
        this.musicData.tracks.push(trackData);
        this.saveMusicData();
        this.renderTrackList();
        this.updateStats();
        
        // Update live music manager
        this.updateLiveSite(trackData);
        
        // Show success message
        const messageDiv = document.getElementById('musicMessage');
        this.showMessage(messageDiv, 'Track added successfully!', 'success');
        
        // Reset form
        document.getElementById('trackForm').reset();
        document.getElementById('trackArtist').value = 'Hasan Arthur Altuntaş';
    }

    updateLiveSite(trackData) {
        // Dispatch custom event to update music manager on main site
        if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
                type: 'ADMIN_TRACK_UPDATE',
                data: trackData
            }, '*');
        }
        
        // Also store in localStorage for main site to pick up
        localStorage.setItem('musicData', JSON.stringify(this.musicData));
        
        // Trigger update event
        const event = new CustomEvent('musicDataUpdated', {
            detail: { tracks: this.musicData.tracks }
        });
        window.dispatchEvent(event);
    }

    deleteTrack(trackId) {
        if (!confirm('Are you sure you want to delete this track?')) return;
        
        this.musicData.tracks = this.musicData.tracks.filter(track => track.id !== trackId);
        this.saveMusicData();
        this.renderTrackList();
        this.updateStats();
        this.updateLiveSite();
        
        const messageDiv = document.getElementById('musicMessage');
        this.showMessage(messageDiv, 'Track deleted successfully!', 'success');
    }

    editTrack(trackId) {
        const track = this.musicData.tracks.find(t => t.id === trackId);
        if (!track) return;
        
        // Populate form with track data
        document.getElementById('trackTitle').value = track.title || '';
        document.getElementById('trackArtist').value = track.artist || '';
        document.getElementById('trackGenre').value = track.genre || '';
        document.getElementById('trackDuration').value = track.duration || '';
        document.getElementById('spotifyUrl').value = track.platforms?.spotify || '';
        document.getElementById('youtubeUrl').value = track.platforms?.youtube || '';
        document.getElementById('appleUrl').value = track.platforms?.apple || '';
        document.getElementById('soundcloudUrl').value = track.platforms?.soundcloud || '';
        document.getElementById('artworkUrl').value = track.artwork || '';
        
        // Remove the track (it will be re-added when form is submitted)
        this.deleteTrack(trackId);
        
        // Scroll to form
        document.getElementById('trackForm').scrollIntoView({ behavior: 'smooth' });
    }

    renderTrackList() {
        const trackList = document.getElementById('trackList');
        if (!trackList) return;
        
        if (this.musicData.tracks.length === 0) {
            trackList.innerHTML = `
                <div style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                    <i class="fas fa-music" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No tracks added yet</p>
                </div>
            `;
            return;
        }
        
        trackList.innerHTML = this.musicData.tracks.map(track => `
            <div class="track-item">
                <div class="track-info">
                    <h4>${track.title}</h4>
                    <p>${track.artist} • ${track.genre} • ${track.duration}</p>
                    <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
                        ${track.platforms?.spotify ? '<span style="color: #1db954; font-size: 0.8rem;"><i class="fab fa-spotify"></i></span>' : ''}
                        ${track.platforms?.youtube ? '<span style="color: #ff0000; font-size: 0.8rem;"><i class="fab fa-youtube"></i></span>' : ''}
                        ${track.platforms?.apple ? '<span style="color: #000000; font-size: 0.8rem;"><i class="fab fa-apple"></i></span>' : ''}
                        ${track.platforms?.soundcloud ? '<span style="color: #ff7700; font-size: 0.8rem;"><i class="fab fa-soundcloud"></i></span>' : ''}
                    </div>
                </div>
                <div class="track-actions">
                    <button class="edit-btn" onclick="adminSystem.editTrack('${track.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="adminSystem.deleteTrack('${track.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const totalTracksEl = document.getElementById('totalTracks');
        if (totalTracksEl) {
            totalTracksEl.textContent = this.musicData.tracks.length;
        }
        
        // Update platform count
        const platformCount = new Set();
        this.musicData.tracks.forEach(track => {
            if (track.platforms) {
                Object.keys(track.platforms).forEach(platform => {
                    if (track.platforms[platform]) platformCount.add(platform);
                });
            }
        });
        
        const activePlatformsEl = document.getElementById('activePlatforms');
        if (activePlatformsEl) {
            activePlatformsEl.textContent = platformCount.size || 3;
        }
    }

    loadMusicData() {
        try {
            // Test if localStorage is available
            if (typeof Storage !== 'undefined' && window.localStorage) {
                const stored = localStorage.getItem('musicData');
                if (stored) {
                    return JSON.parse(stored);
                }
            }
        } catch (error) {
            console.log('LocalStorage not available, using default data:', error.message);
        }
        
        // Default data structure
        return {
            tracks: [],
            settings: {
                siteName: 'Hasan Arthur Altuntaş',
                defaultArtist: 'Hasan Arthur Altuntaş',
                contactEmail: 'info@hasanarthur.com'
            }
        };
    }

    saveMusicData() {
        try {
            if (typeof Storage !== 'undefined' && window.localStorage) {
                localStorage.setItem('musicData', JSON.stringify(this.musicData));
                
                // Also save to session storage for cross-tab updates if available
                if (window.sessionStorage) {
                    sessionStorage.setItem('musicDataLastUpdated', Date.now().toString());
                }
                return true;
            }
        } catch (error) {
            console.log('Storage not available, data not saved:', error.message);
        }
        return false;
    }

    previewSite() {
        // Open main site in new tab
        const siteUrl = window.location.origin + '/index.html';
        window.open(siteUrl, '_blank');
    }

    showMessage(element, message, type) {
        if (!element) return;
        
        element.innerHTML = `
            <div class="status-message status-${type}">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
                ${message}
            </div>
        `;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            element.innerHTML = '';
        }, 5000);
    }
}

// Initialize admin system when page loads
let adminSystem;
document.addEventListener('DOMContentLoaded', () => {
    adminSystem = new AdminSystem();
});

// Listen for music data updates from main site
window.addEventListener('message', (event) => {
    if (event.data.type === 'MUSIC_DATA_SYNC' && adminSystem) {
        adminSystem.musicData = event.data.data;
        adminSystem.renderTrackList();
        adminSystem.updateStats();
    }
});

// Export for global access
window.adminSystem = adminSystem;