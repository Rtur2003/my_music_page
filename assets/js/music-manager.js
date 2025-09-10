// ===============================================
// HASAN ARTHUR MUSIC MANAGER
// Advanced music portfolio management system
// ===============================================

class MusicManager {
    constructor() {
        this.tracks = [];
        this.currentTrack = null;
        this.currentIndex = 0;
        this.audioPlayer = null;
        this.isPlaying = false;
        
        // Hasan Arthur's complete album catalog from all platforms
        this.albums = [
            {
                id: 'echoes-of-the-threshold',
                title: 'Echoes of the Threshold',
                type: 'EP',
                trackCount: 4,
                year: '2024',
                artwork: 'assets/images/logo-main.png',
                platforms: {
                    spotify: 'https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef',
                    apple: 'https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368',
                    youtube: 'https://www.youtube.com/@HasanArthurAltuntaş'
                }
            },
            {
                id: 'lumenoria',
                title: 'Lumenoria',
                type: 'EP',
                trackCount: 5,
                year: '2024',
                artwork: 'assets/images/logo-main.png',
                platforms: {
                    spotify: 'https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef',
                    apple: 'https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368',
                    youtube: 'https://www.youtube.com/@HasanArthurAltuntaş'
                }
            },
            {
                id: 'palgtron',
                title: 'Palgtron',
                type: 'EP',
                trackCount: 3,
                year: '2025',
                artwork: 'assets/images/logo-main.png',
                platforms: {
                    spotify: 'https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef',
                    apple: 'https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368',
                    youtube: 'https://www.youtube.com/@HasanArthurAltuntaş'
                }
            },
            {
                id: 'echomara',
                title: 'Echomara',
                type: 'EP',
                trackCount: 2,
                year: '2024',
                artwork: 'assets/images/logo-main.png',
                platforms: {
                    spotify: 'https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef',
                    apple: 'https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368',
                    youtube: 'https://www.youtube.com/@HasanArthurAltuntaş'
                }
            },
            {
                id: 'morbideum',
                title: 'Morbideum',
                type: 'EP',
                trackCount: 2,
                year: '2024',
                artwork: 'assets/images/logo-main.png',
                platforms: {
                    spotify: 'https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef',
                    apple: 'https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368',
                    youtube: 'https://www.youtube.com/@HasanArthurAltuntaş'
                }
            },
            {
                id: 'whanau',
                title: 'WhaNau',
                type: 'EP',
                trackCount: 2,
                year: '2024',
                artwork: 'assets/images/logo-main.png',
                platforms: {
                    spotify: 'https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef',
                    apple: 'https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368',
                    youtube: 'https://www.youtube.com/@HasanArthurAltuntaş'
                }
            }
        ];
        
        // Hasan Arthur's complete single catalog from all platforms
        this.defaultTracks = [
            {
                id: 1,
                title: "LIAR",
                artist: "Hasan Arthur Altuntaş",
                genre: "Electronic",
                duration: "2:56",
                year: "2025",
                description: "Latest single - A dramatic electronic composition exploring themes of deception and truth.",
                artwork: "assets/images/logo-main.png",
                audioFile: "https://www.soundjay.com/misc/sounds-1039.mp3",
                platforms: {
                    spotify: "https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef",
                    youtube: "https://www.youtube.com/@HasanArthurAltuntaş",
                    apple: "https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368",
                    soundcloud: ""
                }
            },
            {
                id: 2,
                title: "Maimeyst",
                artist: "Hasan Arthur Altuntaş",
                genre: "Ambient",
                duration: "3:21",
                year: "2025",
                description: "Atmospheric ambient piece with mysterious and ethereal qualities.",
                artwork: "assets/images/covers/maimeyst-cover.jpg",
                platforms: {
                    spotify: "https://open.spotify.com/artist/6D5NDnftFDOelT5ssMe0ef",
                    youtube: "https://music.youtube.com/channel/UCA7E1X_uGUqtSJeIxvBeTQA",
                    apple: "https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368",
                    soundcloud: ""
                }
            },
            {
                id: 3,
                title: "Umbralthorne",
                artist: "Hasan Arthur Altuntaş",
                genre: "Dark Ambient",
                duration: "4:15",
                year: "2025",
                description: "Dark ambient exploration with haunting melodies and atmospheric textures.",
                artwork: "assets/images/covers/umbralthorne-cover.jpg",
                platforms: {
                    spotify: "https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef",
                    youtube: "https://www.youtube.com/@HasanArthurAltuntaş",
                    apple: "https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368",
                    soundcloud: ""
                }
            },
            {
                id: 4,
                title: "Solitude",
                artist: "Hasan Arthur Altuntaş",
                genre: "Piano",
                duration: "3:47",
                year: "2025",
                description: "Introspective piano composition capturing the beauty of peaceful isolation.",
                artwork: "assets/images/covers/solitude-cover.jpg",
                platforms: {
                    spotify: "https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef",
                    youtube: "https://www.youtube.com/@HasanArthurAltuntaş",
                    apple: "https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368",
                    soundcloud: ""
                }
            },
            {
                id: 5,
                title: "Nocturnal Reverie",
                artist: "Hasan Arthur Altuntaş",
                genre: "Ambient",
                duration: "4:02",
                year: "2025",
                description: "Contemplative nighttime journey through sound and emotion.",
                artwork: "assets/images/covers/nocturnal-reverie-cover.jpg",
                platforms: {
                    spotify: "https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef",
                    youtube: "https://www.youtube.com/@HasanArthurAltuntaş",
                    apple: "https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368",
                    soundcloud: ""
                }
            },
            {
                id: 6,
                title: "Amalux",
                artist: "Hasan Arthur Altuntaş",
                genre: "Ambient",
                duration: "4:12",
                year: "2024",
                description: "Popular ambient composition with 12,853+ plays, featuring ethereal soundscapes.",
                artwork: "assets/images/covers/amalux-cover.jpg",
                platforms: {
                    spotify: "https://open.spotify.com/artist/6D5NDnftFDOelT5ssMe0ef",
                    youtube: "https://music.youtube.com/channel/UCA7E1X_uGUqtSJeIxvBeTQA",
                    apple: "https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368",
                    soundcloud: ""
                }
            },
            {
                id: 7,
                title: "Oppenheimer But My Version",
                artist: "Hasan Arthur Altuntaş",
                genre: "Film Score",
                duration: "5:23",
                year: "2024",
                description: "Powerful reimagining of the iconic Oppenheimer theme with unique artistic vision.",
                artwork: "assets/images/covers/oppenheimer-cover.jpg",
                platforms: {
                    spotify: "https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef",
                    youtube: "https://www.youtube.com/@HasanArthurAltuntaş",
                    apple: "https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368",
                    soundcloud: ""
                }
            },
            {
                id: 8,
                title: "Interstellar But My Version",
                artist: "Hasan Arthur Altuntaş",
                genre: "Cinematic",
                duration: "4:58",
                year: "2024",
                description: "Cosmic journey reimagining Hans Zimmer's masterpiece with personal interpretation.",
                artwork: "assets/images/covers/interstellar-cover.jpg",
                platforms: {
                    spotify: "https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef",
                    youtube: "https://www.youtube.com/@HasanArthurAltuntaş",
                    apple: "https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368",
                    soundcloud: ""
                }
            },
            {
                id: 9,
                title: "Are You From Earth",
                artist: "Hasan Arthur Altuntaş",
                genre: "Experimental",
                duration: "3:45",
                year: "2024",
                description: "Experimental composition questioning our cosmic origins through sound.",
                artwork: "assets/images/covers/are-you-from-earth-cover.jpg",
                platforms: {
                    spotify: "https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef",
                    youtube: "https://www.youtube.com/@HasanArthurAltuntaş",
                    apple: "https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368",
                    soundcloud: ""
                }
            },
            {
                id: 10,
                title: "Ethereal Nexus",
                artist: "Hasan Arthur Altuntaş",
                genre: "Ambient",
                duration: "4:31",
                year: "2024",
                description: "Connection between ethereal realms through atmospheric musical textures.",
                artwork: "assets/images/covers/ethereal-nexus-cover.jpg",
                platforms: {
                    spotify: "https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef",
                    youtube: "https://www.youtube.com/@HasanArthurAltuntaş",
                    apple: "https://music.apple.com/tr/artist/hasan-arthur-altunta%C5%9F/1758593368",
                    soundcloud: ""
                }
            }
        ];
        
        this.init();
    }
    
    init() {
        this.loadTracks();
        this.setupPlayer();
        this.setupUI();
        this.renderMusicGrid();
        
        console.log('🎵 Music Manager Initialized with', this.tracks.length, 'tracks');
    }
    
    loadTracks() {
        // Always use fresh defaults to ensure latest tracks
        this.tracks = [...this.defaultTracks];
        
        // Remove any duplicates based on title (in case of data corruption)
        this.tracks = this.tracks.filter((track, index, arr) => 
            arr.findIndex(t => t.title === track.title) === index
        );
        
        console.log(`🎵 Loaded ${this.tracks.length} unique tracks`);
    }
    
    saveTracks() {
        localStorage.setItem('hasan_arthur_tracks', JSON.stringify(this.tracks));
    }
    
    setupPlayer() {
        this.audioPlayer = document.getElementById('audioPlayer');
        if (!this.audioPlayer) return;
        
        // Setup audio player events
        this.audioPlayer.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });
        
        this.audioPlayer.addEventListener('timeupdate', () => {
            this.updateProgress();
        });
        
        this.audioPlayer.addEventListener('ended', () => {
            this.nextTrack();
        });
        
        this.audioPlayer.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButtons();
        });
        
        this.audioPlayer.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButtons();
        });
    }
    
    setupUI() {
        // Main play button
        const mainPlayBtn = document.getElementById('mainPlayBtn');
        if (mainPlayBtn) {
            mainPlayBtn.addEventListener('click', () => this.togglePlayPause());
        }
        
        // Control buttons
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }
        
        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousTrack());
        }
        
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextTrack());
        }
        
        // Progress bar
        const progressTrack = document.getElementById('progressTrack');
        if (progressTrack) {
            progressTrack.addEventListener('click', (e) => this.seekTo(e));
        }
        
        // Volume control
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                if (this.audioPlayer) {
                    this.audioPlayer.volume = e.target.value / 100;
                }
            });
        }
    }
    
    renderMusicGrid() {
        const musicGrid = document.getElementById('musicGrid');
        if (!musicGrid) return;
        
        const albumsHTML = this.albums.length > 0 ? `
            <div class="albums-section">
                <h3 class="section-title">Albums & EPs</h3>
                <div class="albums-grid">
                    ${this.albums.map(album => `
                        <div class="album-card" data-album-id="${album.id}">
                            <div class="album-artwork">
                                <img src="${album.artwork}" alt="${album.title}" loading="lazy">
                                <div class="album-play-overlay">
                                    <button class="album-play-btn" onclick="musicManager.playAlbum('${album.id}')">
                                        <i class="fas fa-play"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="album-info">
                                <h4>${album.title}</h4>
                                <p>${album.type} • ${album.trackCount} tracks • ${album.year}</p>
                                <div class="album-platforms">
                                    ${this.renderAlbumPlatformLinks(album)}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';
        
        const tracksHTML = this.tracks.length > 0 ? `
            <div class="singles-section">
                <h3 class="section-title">Latest Singles</h3>
                <div class="tracks-grid">
                    ${this.tracks.map((track, index) => `
                        <div class="music-card" data-track-id="${track.id}">
                            <div class="music-card-header">
                                <img src="${this.getArtworkUrl(track)}" alt="${track.title}" class="music-card-artwork" loading="lazy">
                                <div class="music-card-info">
                                    <h4>${track.title}</h4>
                                    <p>${track.artist}</p>
                                    <span class="music-card-genre">${track.genre} • ${track.year}</span>
                                </div>
                            </div>
                            <div class="music-card-actions">
                                <button class="play-track-btn" onclick="musicManager.playTrack(${index})">
                                    <i class="fas fa-play"></i> Play
                                </button>
                                <div class="track-platforms">
                                    ${this.renderPlatformLinks(track)}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';
        
        if (this.albums.length === 0 && this.tracks.length === 0) {
            musicGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-music"></i>
                    <h3>No music available yet</h3>
                    <p>Albums and tracks will appear here once added</p>
                </div>
            `;
            return;
        }
        
        musicGrid.innerHTML = albumsHTML + tracksHTML;
    }
    
    renderPlatformLinks(track) {
        const platforms = [
            { key: 'spotify', icon: 'fab fa-spotify', color: '#1db954', name: 'Spotify' },
            { key: 'youtube', icon: 'fab fa-youtube', color: '#ff0000', name: 'YouTube' },
            { key: 'apple', icon: 'fab fa-apple', color: '#000000', name: 'Apple Music' },
            { key: 'soundcloud', icon: 'fab fa-soundcloud', color: '#ff7700', name: 'SoundCloud' }
        ];
        
        return platforms
            .filter(platform => track.platforms[platform.key])
            .map(platform => `
                <a href="${track.platforms[platform.key]}" 
                   class="track-platform-link" 
                   style="background: ${platform.color}"
                   target="_blank" 
                   rel="noopener"
                   title="Listen on ${platform.name}">
                    <i class="${platform.icon}"></i>
                </a>
            `).join('');
    }
    
    renderAlbumPlatformLinks(album) {
        const platforms = [
            { key: 'spotify', icon: 'fab fa-spotify', color: '#1db954', name: 'Spotify' },
            { key: 'youtube', icon: 'fab fa-youtube', color: '#ff0000', name: 'YouTube' },
            { key: 'apple', icon: 'fab fa-apple', color: '#000000', name: 'Apple Music' }
        ];
        
        return platforms
            .filter(platform => album.platforms[platform.key])
            .map(platform => `
                <a href="${album.platforms[platform.key]}" 
                   class="album-platform-link" 
                   style="background: ${platform.color}"
                   target="_blank" 
                   rel="noopener"
                   title="Listen on ${platform.name}">
                    <i class="${platform.icon}"></i>
                </a>
            `).join('');
    }
    
    getArtworkUrl(track) {
        // Use Spotify artwork if available, fallback to logo
        return track.artwork || 'assets/images/logo-main.png';
    }
    
    playTrack(index) {
        if (index >= 0 && index < this.tracks.length) {
            this.currentIndex = index;
            this.currentTrack = this.tracks[index];
            
            // Load audio if available
            if (this.audioPlayer && this.currentTrack.audioFile) {
                this.audioPlayer.src = this.currentTrack.audioFile;
                this.audioPlayer.load();
                
                // Auto play if supported
                this.audioPlayer.play().catch(error => {
                    console.log('Auto-play prevented:', error.message);
                });
            }
            
            this.updatePlayerUI();
            
            // Show visual feedback that track is selected
            this.highlightCurrentTrack();
            
            console.log('🎵 Now playing:', this.currentTrack.title);
            
            // Update UI to show current track
            this.updatePlayButtons();
        }
    }
    
    playAlbum(albumId) {
        const album = this.albums.find(a => a.id === albumId);
        if (album) {
            // Show visual feedback that album is selected
            this.highlightCurrentAlbum(albumId);
            
            // Update player with album info
            this.currentAlbum = album;
            this.updatePlayerWithAlbum(album);
            
            console.log('🎵 Now playing album:', album.title);
        }
    }
    
    highlightCurrentTrack() {
        // Remove previous highlights
        document.querySelectorAll('.music-card, .album-card').forEach(card => {
            card.classList.remove('now-playing');
        });
        
        // Highlight current track
        if (this.currentTrack) {
            const currentCard = document.querySelector(`[data-track-id="${this.currentTrack.id}"]`);
            if (currentCard) {
                currentCard.classList.add('now-playing');
            }
        }
    }
    
    highlightCurrentAlbum(albumId) {
        // Remove previous highlights
        document.querySelectorAll('.music-card, .album-card').forEach(card => {
            card.classList.remove('now-playing');
        });
        
        // Highlight current album
        const currentAlbum = document.querySelector(`[data-album-id="${albumId}"]`);
        if (currentAlbum) {
            currentAlbum.classList.add('now-playing');
        }
    }
    
    togglePlayPause() {
        if (!this.audioPlayer || !this.currentTrack) {
            if (this.tracks.length > 0) {
                this.playTrack(0);
            }
            return;
        }
        
        if (this.isPlaying) {
            this.audioPlayer.pause();
        } else {
            this.audioPlayer.play();
        }
    }
    
    previousTrack() {
        if (this.currentIndex > 0) {
            this.playTrack(this.currentIndex - 1);
        } else {
            this.playTrack(this.tracks.length - 1);
        }
    }
    
    nextTrack() {
        if (this.currentIndex < this.tracks.length - 1) {
            this.playTrack(this.currentIndex + 1);
        } else {
            this.playTrack(0);
        }
    }
    
    updatePlayerUI() {
        if (!this.currentTrack && !this.currentAlbum) return;
        
        const item = this.currentTrack || this.currentAlbum;
        
        // Update track/album title and artist
        const trackTitle = document.getElementById('modernTrackTitle');
        const trackArtist = document.getElementById('modernTrackArtist');
        const trackGenre = document.getElementById('trackGenre');
        const trackDuration = document.getElementById('trackDuration');
        const currentArtwork = document.getElementById('currentArtwork');
        
        if (trackTitle) trackTitle.textContent = item.title;
        if (trackArtist) trackArtist.textContent = item.artist || 'Hasan Arthur Altuntaş';
        if (trackGenre) {
            if (this.currentAlbum) {
                trackGenre.textContent = `${this.currentAlbum.type} • ${this.currentAlbum.trackCount} tracks`;
            } else {
                trackGenre.textContent = this.currentTrack.genre;
            }
        }
        if (trackDuration) {
            trackDuration.textContent = this.currentTrack ? this.currentTrack.duration : this.currentAlbum.year;
        }
        if (currentArtwork) {
            currentArtwork.src = item.artwork || this.getArtworkUrl(item);
            currentArtwork.alt = item.title;
        }
        
        // Update platform links
        this.updatePlatformLinks();
    }
    
    updatePlayerWithAlbum(album) {
        this.currentTrack = null; // Clear current track when playing album
        this.currentAlbum = album;
        this.updatePlayerUI();
        this.updatePlayButtons();
    }
    
    updatePlatformLinks() {
        if (!this.currentTrack) return;
        
        const spotifyLink = document.getElementById('spotifyLink');
        const youtubeLink = document.getElementById('youtubeLink');
        const appleLink = document.getElementById('appleLink');
        const soundcloudLink = document.getElementById('soundcloudLink');
        
        if (spotifyLink && this.currentTrack.platforms.spotify) {
            spotifyLink.href = this.currentTrack.platforms.spotify;
            spotifyLink.style.display = 'flex';
        }
        
        if (youtubeLink && this.currentTrack.platforms.youtube) {
            youtubeLink.href = this.currentTrack.platforms.youtube;
            youtubeLink.style.display = 'flex';
        } else if (youtubeLink) {
            youtubeLink.style.display = 'none';
        }
        
        if (appleLink && this.currentTrack.platforms.apple) {
            appleLink.href = this.currentTrack.platforms.apple;
            appleLink.style.display = 'flex';
        } else if (appleLink) {
            appleLink.style.display = 'none';
        }
        
        if (soundcloudLink && this.currentTrack.platforms.soundcloud) {
            soundcloudLink.href = this.currentTrack.platforms.soundcloud;
            soundcloudLink.style.display = 'flex';
        } else if (soundcloudLink) {
            soundcloudLink.style.display = 'none';
        }
    }
    
    updatePlayButtons() {
        const mainPlayIcon = document.getElementById('mainPlayIcon');
        const playPauseIcon = document.getElementById('playPauseIcon');
        
        const icon = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        
        if (mainPlayIcon) {
            mainPlayIcon.className = icon;
        }
        
        if (playPauseIcon) {
            playPauseIcon.className = icon;
        }
    }
    
    updateProgress() {
        if (!this.audioPlayer) return;
        
        const progressFill = document.getElementById('progressFill');
        const currentTimeEl = document.getElementById('currentTime');
        
        if (progressFill && this.audioPlayer.duration) {
            const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
            progressFill.style.width = progress + '%';
        }
        
        if (currentTimeEl) {
            currentTimeEl.textContent = this.formatTime(this.audioPlayer.currentTime);
        }
    }
    
    updateDuration() {
        if (!this.audioPlayer) return;
        
        const totalTimeEl = document.getElementById('totalTime');
        if (totalTimeEl) {
            totalTimeEl.textContent = this.formatTime(this.audioPlayer.duration);
        }
    }
    
    seekTo(event) {
        if (!this.audioPlayer || !this.audioPlayer.duration) return;
        
        const progressTrack = event.currentTarget;
        const rect = progressTrack.getBoundingClientRect();
        const percentage = (event.clientX - rect.left) / rect.width;
        const seekTime = percentage * this.audioPlayer.duration;
        
        this.audioPlayer.currentTime = seekTime;
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Utility functions
    refreshTracks() {
        // Force refresh from defaults (no admin needed)
        this.tracks = [...this.defaultTracks];
        this.saveTracks();
        this.renderMusicGrid();
        console.log('🔄 Track catalog refreshed with latest releases');
    }
}

// Initialize when DOM is loaded
let musicManager;
document.addEventListener('DOMContentLoaded', () => {
    musicManager = new MusicManager();
});

// Export for admin panel
if (typeof window !== 'undefined') {
    window.MusicManager = MusicManager;
    window.musicManager = musicManager;
}