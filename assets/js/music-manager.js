// ===============================================
// MUSIC MANAGER - LIVE SYNC & PLAYER INTEGRATION
// ===============================================

class MusicManager {
    constructor() {
        this.musicData = {
            albums: [],
            tracks: []
        };
        this.currentTrack = null;
        this.currentIndex = 0;
        this.isPlaying = false;
        this.init();
    }

    init() {
        this.loadMusicData();
        this.setupEventListeners();
        this.renderMusicPlayer();
        this.renderMusicLibrary();
        console.log('🎵 Live Music Sync initialized');
    }

    // Load music data from admin system
    loadMusicData() {
        try {
            const savedData = localStorage.getItem('music_data_live');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.musicData = data;
                console.log('📚 Loaded live music data:', {
                    albums: this.musicData.albums?.length || 0,
                    tracks: this.musicData.tracks?.length || 0
                });
            } else {
                // Load default/fallback data
                this.musicData = this.getDefaultMusicData();
            }
        } catch (error) {
            console.warn('Failed to load music data:', error);
            this.musicData = this.getDefaultMusicData();
        }
    }

    // Get default music data (fallback)
    getDefaultMusicData() {
        return {
            albums: [
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
            ],
            tracks: []
        };
    }

    // Setup event listeners for real-time updates
    setupEventListeners() {
        // Listen for admin updates
        window.addEventListener('musicDataUpdated', (event) => {
            this.musicData = event.detail;
            this.renderMusicPlayer();
            this.renderMusicLibrary();
            console.log('🔄 Music data updated from admin');
        });

        // Listen for storage changes (cross-tab sync)
        window.addEventListener('storage', (event) => {
            if (event.key === 'music_data_live') {
                this.loadMusicData();
                this.renderMusicPlayer();
                this.renderMusicLibrary();
                console.log('🔄 Music data synced from storage');
            }
        });

        // Setup music player controls
        this.setupPlayerControls();
    }

    // Setup music player controls
    setupPlayerControls() {
        const playBtn = document.getElementById('mainPlayBtn') || document.getElementById('playPauseBtn');
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const shuffleBtn = document.getElementById('shuffleBtn');
        const repeatBtn = document.getElementById('repeatBtn');

        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlay());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextTrack());
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevTrack());
        }
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        }
        if (repeatBtn) {
            repeatBtn.addEventListener('click', () => this.toggleRepeat());
        }
    }

    // Render music player with live data
    renderMusicPlayer() {
        const trackTitleEl = document.getElementById('trackTitle');
        const trackArtistEl = document.getElementById('trackArtist');
        const trackArtworkEl = document.getElementById('trackArtwork');
        const platformLinksEl = document.getElementById('platformLinks');

        if (this.musicData.tracks?.length > 0) {
            // Use first track as current if none selected
            if (!this.currentTrack && this.musicData.tracks.length > 0) {
                this.currentTrack = this.musicData.tracks[0];
                this.currentIndex = 0;
            }

            if (this.currentTrack) {
                if (trackTitleEl) trackTitleEl.textContent = this.currentTrack.title || 'Unknown Track';
                if (trackArtistEl) trackArtistEl.textContent = this.currentTrack.artist || 'Hasan Arthur Altuntaş';
                
                if (trackArtworkEl) {
                    trackArtworkEl.src = this.currentTrack.artwork || 'assets/images/logo-main.png';
                    trackArtworkEl.alt = this.currentTrack.title || 'Track Artwork';
                }

                // Update platform links
                if (platformLinksEl && this.currentTrack.platforms) {
                    this.updatePlatformLinks(this.currentTrack.platforms);
                }
            }
        } else {
            // Show default/placeholder content
            if (trackTitleEl) trackTitleEl.textContent = 'No tracks available';
            if (trackArtistEl) trackArtistEl.textContent = 'Hasan Arthur Altuntaş';
            if (trackArtworkEl) {
                trackArtworkEl.src = 'assets/images/logo-main.png';
                trackArtworkEl.alt = 'Hasan Arthur Altuntaş';
            }
            if (platformLinksEl) {
                this.updatePlatformLinks({
                    spotify: 'https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef',
                    apple: 'https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368',
                    youtube: 'https://www.youtube.com/@HasanArthurAltuntaş'
                });
            }
        }
    }

    // Update platform links
    updatePlatformLinks(platforms) {
        const platformLinksEl = document.getElementById('platformLinks');
        if (!platformLinksEl) return;

        const platformConfig = {
            spotify: { 
                icon: 'fab fa-spotify', 
                label: 'Spotify',
                color: '#1db954'
            },
            youtube: { 
                icon: 'fab fa-youtube', 
                label: 'YouTube',
                color: '#ff0000'
            },
            apple: { 
                icon: 'fab fa-apple', 
                label: 'Apple Music',
                color: '#000000'
            },
            soundcloud: { 
                icon: 'fab fa-soundcloud', 
                label: 'SoundCloud',
                color: '#ff7700'
            }
        };

        platformLinksEl.innerHTML = Object.entries(platforms)
            .filter(([platform, url]) => url && platformConfig[platform])
            .map(([platform, url]) => {
                const config = platformConfig[platform];
                return `
                    <a href="${url}" 
                       class="platform-link ${platform}-link" 
                       target="_blank" 
                       rel="noopener" 
                       title="Listen on ${config.label}">
                        <i class="${config.icon}"></i>
                        <span class="sr-only">${config.label}</span>
                    </a>
                `;
            }).join('');
    }

    // Render music library (if there's a library section)
    renderMusicLibrary() {
        const libraryContainer = document.getElementById('musicLibrary');
        if (!libraryContainer) return;

        if (this.musicData.tracks?.length === 0) {
            libraryContainer.innerHTML = `
                <div class="empty-library">
                    <p>🎵 Music library is being updated...</p>
                    <p class="text-secondary">New tracks will appear here automatically</p>
                </div>
            `;
            return;
        }

        // Group tracks by album
        const albumGroups = {};
        this.musicData.tracks.forEach(track => {
            const album = this.musicData.albums.find(a => a.id === track.albumId);
            const albumKey = album ? album.id : 'unknown';
            if (!albumGroups[albumKey]) {
                albumGroups[albumKey] = {
                    album: album || { title: 'Unknown Album' },
                    tracks: []
                };
            }
            albumGroups[albumKey].tracks.push(track);
        });

        libraryContainer.innerHTML = Object.values(albumGroups)
            .map(group => `
                <div class="album-section">
                    <div class="album-header">
                        <img src="${group.album.artwork || 'assets/images/logo-main.png'}" 
                             alt="${group.album.title}" 
                             class="album-thumbnail">
                        <div class="album-info">
                            <h4>${group.album.title}</h4>
                            <p>${group.album.type || 'Album'} • ${group.album.year || '2024'}</p>
                            <p class="track-count">${group.tracks.length} tracks</p>
                        </div>
                    </div>
                    <div class="track-list">
                        ${group.tracks.map((track, index) => `
                            <div class="track-item" data-track-id="${track.id}">
                                <span class="track-number">${index + 1}</span>
                                <div class="track-info">
                                    <span class="track-title">${track.title}</span>
                                    <span class="track-duration">${track.duration || '--:--'}</span>
                                </div>
                                <button class="play-track-btn" onclick="liveMusicSync.playTrack('${track.id}')">
                                    <i class="fas fa-play"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
    }

    // Player control methods
    togglePlay() {
        this.isPlaying = !this.isPlaying;
        const playBtn = document.getElementById('mainPlayBtn') || document.getElementById('playPauseBtn');
        
        if (playBtn) {
            const icon = playBtn.querySelector('i');
            if (icon) {
                icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
            }
        }

        // Update platform links based on current track
        if (this.currentTrack && this.currentTrack.platforms) {
            this.updatePlatformLinks(this.currentTrack.platforms);
        }

        console.log('🎵 Player', this.isPlaying ? 'playing' : 'paused');
    }

    nextTrack() {
        if (this.musicData.tracks?.length > 0) {
            this.currentIndex = (this.currentIndex + 1) % this.musicData.tracks.length;
            this.currentTrack = this.musicData.tracks[this.currentIndex];
            this.renderMusicPlayer();
            console.log('⏭️ Next track:', this.currentTrack.title);
        }
    }

    prevTrack() {
        if (this.musicData.tracks?.length > 0) {
            this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.musicData.tracks.length - 1;
            this.currentTrack = this.musicData.tracks[this.currentIndex];
            this.renderMusicPlayer();
            console.log('⏮️ Previous track:', this.currentTrack.title);
        }
    }

    playTrack(trackId) {
        const track = this.musicData.tracks.find(t => t.id === trackId);
        if (track) {
            this.currentTrack = track;
            this.currentIndex = this.musicData.tracks.indexOf(track);
            this.isPlaying = true;
            this.renderMusicPlayer();
            
            // Update play button
            const playBtn = document.getElementById('mainPlayBtn') || document.getElementById('playPauseBtn');
            if (playBtn) {
                const icon = playBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-pause';
            }

            console.log('🎵 Playing track:', track.title);
        }
    }

    toggleShuffle() {
        // Shuffle implementation
        console.log('🔀 Shuffle toggled');
    }

    toggleRepeat() {
        // Repeat implementation  
        console.log('🔁 Repeat toggled');
    }

    // Public method to force refresh
    refreshData() {
        this.loadMusicData();
        this.renderMusicPlayer();
        this.renderMusicLibrary();
        console.log('🔄 Music data manually refreshed');
    }

    // Get current music statistics
    getStats() {
        return {
            albums: this.musicData.albums?.length || 0,
            tracks: this.musicData.tracks?.length || 0,
            currentTrack: this.currentTrack?.title || null,
            isPlaying: this.isPlaying
        };
    }
}

// Initialize music manager
let musicManager;
document.addEventListener('DOMContentLoaded', () => {
    musicManager = new MusicManager();
    window.musicManager = musicManager;
    // Backward compatibility
    window.liveMusicSync = musicManager;
});

// Auto-refresh every 30 seconds
setInterval(() => {
    if (musicManager) {
        musicManager.loadMusicData();
    }
}, 30000);

export default MusicManager;