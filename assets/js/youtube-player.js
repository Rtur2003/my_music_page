// ===============================================
// YOUTUBE AUDIO PLAYER - BACKGROUND PLAYBACK
// ===============================================

class YouTubeAudioPlayer {
    constructor() {
        this.player = null;
        this.isReady = false;
        this.currentVideoId = null;
        this.currentTrack = null;
        this.isPlaying = false;
        this.volume = 75;
        this.tracks = [];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.loadYouTubeAPI();
        this.setupEventListeners();
        console.log('🎵 YouTube Audio Player initialized');
    }

    // Load YouTube IFrame API
    loadYouTubeAPI() {
        if (window.YT && window.YT.Player) {
            this.onYouTubeIframeAPIReady();
            return;
        }

        // Create script tag for YouTube API
        if (!document.getElementById('youtube-api')) {
            const tag = document.createElement('script');
            tag.id = 'youtube-api';
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        // Set global callback
        window.onYouTubeIframeAPIReady = () => this.onYouTubeIframeAPIReady();
    }

    // Initialize player when API is ready
    onYouTubeIframeAPIReady() {
        // Create hidden player container
        if (!document.getElementById('youtube-player-container')) {
            const container = document.createElement('div');
            container.id = 'youtube-player-container';
            container.style.cssText = `
                position: absolute;
                top: -9999px;
                left: -9999px;
                width: 1px;
                height: 1px;
                opacity: 0;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }

        this.player = new YT.Player('youtube-player-container', {
            height: '1',
            width: '1',
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                iv_load_policy: 3,
                modestbranding: 1,
                playsinline: 1,
                rel: 0,
                showinfo: 0
            },
            events: {
                onReady: () => this.onPlayerReady(),
                onStateChange: (event) => this.onPlayerStateChange(event),
                onError: (event) => this.onPlayerError(event)
            }
        });
    }

    // Player ready callback
    onPlayerReady() {
        this.isReady = true;
        this.player.setVolume(this.volume);
        console.log('🎵 YouTube player ready');
        
        // Load tracks from music data
        this.loadTracksFromMusicData();
    }

    // Load tracks from music manager
    loadTracksFromMusicData() {
        try {
            const musicData = JSON.parse(localStorage.getItem('music_data_live') || '{}');
            if (musicData.tracks) {
                this.tracks = musicData.tracks.filter(track => 
                    track.platforms && track.platforms.youtube
                );
                console.log('🎵 Loaded', this.tracks.length, 'YouTube tracks');
                
                if (this.tracks.length > 0 && !this.currentTrack) {
                    this.setCurrentTrack(0);
                }
            }
        } catch (error) {
            console.warn('Failed to load music data:', error);
        }
    }

    // Player state change
    onPlayerStateChange(event) {
        switch (event.data) {
            case YT.PlayerState.PLAYING:
                this.isPlaying = true;
                this.updatePlayerUI();
                break;
            case YT.PlayerState.PAUSED:
                this.isPlaying = false;
                this.updatePlayerUI();
                break;
            case YT.PlayerState.ENDED:
                this.nextTrack();
                break;
        }
    }

    // Player error
    onPlayerError(event) {
        console.error('YouTube player error:', event.data);
        this.showNotification('error', 'Playback error. Skipping to next track.');
        setTimeout(() => this.nextTrack(), 1000);
    }

    // Setup event listeners
    setupEventListeners() {
        // Main play button - use class selector for modern player
        const mainPlayBtn = document.querySelector('.main-play-button');
        if (mainPlayBtn) {
            mainPlayBtn.addEventListener('click', () => {
                console.log('🎵 Main play button clicked');
                this.togglePlay();
            });
            console.log('✅ Main play button listener attached');
        } else {
            console.warn('❌ Main play button not found during setup');
            // Try again after 1 second
            setTimeout(() => {
                const retryBtn = document.querySelector('.main-play-button');
                if (retryBtn) {
                    retryBtn.addEventListener('click', () => {
                        console.log('🎵 Main play button clicked (retry)');
                        this.togglePlay();
                    });
                    console.log('✅ Main play button listener attached (retry)');
                }
            }, 1000);
        }

        // Next/Previous buttons
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextTrack());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevTrack());

        // Volume control
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        }

        // Platform links - add redirect warnings
        document.addEventListener('click', (e) => {
            const platformLink = e.target.closest('.platform-link');
            if (platformLink && platformLink.href) {
                e.preventDefault();
                this.showPlatformRedirect(platformLink.href, this.getPlatformName(platformLink));
            }
        });

        // Listen for music data updates
        window.addEventListener('musicDataUpdated', () => {
            this.loadTracksFromMusicData();
        });
        
        window.addEventListener('storage', (e) => {
            if (e.key === 'music_data_live') {
                this.loadTracksFromMusicData();
            }
        });
    }

    // Get platform name from link class
    getPlatformName(link) {
        if (link.classList.contains('spotify-link')) return 'Spotify';
        if (link.classList.contains('apple-link')) return 'Apple Music';
        if (link.classList.contains('youtube-link')) return 'YouTube';
        if (link.classList.contains('soundcloud-link')) return 'SoundCloud';
        return 'Music Platform';
    }

    // Show platform redirect warning
    showPlatformRedirect(url, platform) {
        const modal = document.createElement('div');
        modal.className = 'redirect-modal';
        modal.innerHTML = `
            <div class="redirect-content">
                <div class="redirect-header">
                    <h3>🎵 Platform Redirect</h3>
                </div>
                <div class="redirect-body">
                    <p>Bu şarkıyı <strong>${platform}</strong> platformunda dinlemek üzere yönlendiriliyorsunuz.</p>
                    <p class="redirect-note">Platform'da oturum açmanız gerekebilir.</p>
                </div>
                <div class="redirect-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.redirect-modal').remove()">
                        İptal
                    </button>
                    <button class="btn btn-primary" onclick="window.open('${url}', '_blank'); this.closest('.redirect-modal').remove();">
                        <i class="fas fa-external-link-alt"></i>
                        ${platform}'a Git
                    </button>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(modal);

        // Auto close after 10 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 10000);
    }

    // Toggle play/pause
    togglePlay() {
        console.log('🎵 Toggle play called - Ready:', this.isReady, 'Has track:', !!this.currentTrack);

        if (!this.isReady) {
            this.showNotification('info', 'Player is loading, please wait...');
            return;
        }

        if (!this.currentTrack) {
            this.showNotification('info', 'Please select a track first');
            return;
        }

        if (this.isPlaying) {
            console.log('🎵 Pausing...');
            this.pause();
        } else {
            console.log('🎵 Playing...');
            this.play();
        }
    }

    // Play current track
    play() {
        if (!this.isReady) {
            console.warn('❌ Player not ready');
            return;
        }

        if (this.currentVideoId) {
            console.log('🎵 Playing existing video:', this.currentVideoId);
            this.player.playVideo();
        } else if (this.currentTrack && this.currentTrack.links && this.currentTrack.links.youtube) {
            const videoId = this.extractYouTubeId(this.currentTrack.links.youtube);
            if (videoId) {
                console.log('🎵 Loading new video:', videoId);
                this.currentVideoId = videoId;
                this.player.loadVideoById(videoId);
            } else {
                console.error('❌ Could not extract video ID from:', this.currentTrack.links.youtube);
            }
        } else {
            console.error('❌ No video available to play');
        }
    }

    // Pause playback
    pause() {
        if (this.isReady) {
            this.player.pauseVideo();
        }
    }

    // Extract YouTube video ID from URL
    extractYouTubeId(url) {
        if (!url) return null;
        
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /youtube\.com\/watch\?.*v=([^&\n?#]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        
        return null;
    }

    // Set current track
    setCurrentTrack(index) {
        if (index < 0 || index >= this.tracks.length) return;
        
        this.currentIndex = index;
        this.currentTrack = this.tracks[index];
        this.currentVideoId = null;
        
        this.updatePlayerUI();
        console.log('🎵 Track set:', this.currentTrack.title);
    }

    // Next track
    nextTrack() {
        if (this.tracks.length === 0) return;
        
        const nextIndex = (this.currentIndex + 1) % this.tracks.length;
        this.setCurrentTrack(nextIndex);
        
        if (this.isPlaying) {
            setTimeout(() => this.play(), 100);
        }
    }

    // Previous track
    prevTrack() {
        if (this.tracks.length === 0) return;
        
        const prevIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.tracks.length - 1;
        this.setCurrentTrack(prevIndex);
        
        if (this.isPlaying) {
            setTimeout(() => this.play(), 100);
        }
    }

    // Set volume
    setVolume(volume) {
        this.volume = volume;
        if (this.isReady) {
            this.player.setVolume(volume);
        }
    }

    // Update player UI
    updatePlayerUI() {
        console.log('🎨 YouTube Player updating UI');

        // Update play button
        const playBtn = document.querySelector('.main-play-button');
        if (playBtn) {
            const icon = playBtn.querySelector('i');
            if (icon) {
                icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
                console.log('✅ Play button updated:', this.isPlaying ? 'PAUSE' : 'PLAY');
            }
        } else {
            console.warn('❌ Main play button not found');
        }

        console.log('🎨 YouTube Player UI update complete');
    }

    updatePlatformLinks() {
        if (!this.currentTrack || !this.currentTrack.links) return;

        const spotifyLink = document.getElementById('spotifyLink');
        const youtubeLink = document.getElementById('youtubeLink');
        const appleLink = document.getElementById('appleLink');
        const soundcloudLink = document.getElementById('soundcloudLink');

        // Update Spotify link
        if (spotifyLink) {
            if (this.currentTrack.links.spotify) {
                spotifyLink.href = this.currentTrack.links.spotify;
                spotifyLink.style.opacity = '1';
                spotifyLink.style.pointerEvents = 'auto';
            } else {
                spotifyLink.href = '#';
                spotifyLink.style.opacity = '0.3';
                spotifyLink.style.pointerEvents = 'none';
            }
        }

        // Update YouTube link
        if (youtubeLink) {
            if (this.currentTrack.links.youtube) {
                youtubeLink.href = this.currentTrack.links.youtube;
                youtubeLink.style.opacity = '1';
                youtubeLink.style.pointerEvents = 'auto';
            } else {
                youtubeLink.href = '#';
                youtubeLink.style.opacity = '0.3';
                youtubeLink.style.pointerEvents = 'none';
            }
        }

        // Update Apple Music link
        if (appleLink) {
            if (this.currentTrack.links.apple) {
                appleLink.href = this.currentTrack.links.apple;
                appleLink.style.opacity = '1';
                appleLink.style.pointerEvents = 'auto';
            } else {
                appleLink.href = '#';
                appleLink.style.opacity = '0.3';
                appleLink.style.pointerEvents = 'none';
            }
        }

        // Update SoundCloud link (if exists)
        if (soundcloudLink) {
            if (this.currentTrack.links.soundcloud) {
                soundcloudLink.href = this.currentTrack.links.soundcloud;
                soundcloudLink.style.opacity = '1';
                soundcloudLink.style.pointerEvents = 'auto';
            } else {
                soundcloudLink.href = '#';
                soundcloudLink.style.opacity = '0.3';
                soundcloudLink.style.pointerEvents = 'none';
            }
        }
    }

    // Show notification
    showNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `player-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            ${message}
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Public method to play specific track
    playTrack(trackId) {
        const trackIndex = this.tracks.findIndex(t => t.id === trackId);
        if (trackIndex !== -1) {
            this.setCurrentTrack(trackIndex);
            this.play();
        }
    }

    // Method to load video directly with ID
    loadVideo(videoId) {
        if (!this.isReady) {
            setTimeout(() => this.loadVideo(videoId), 500);
            return;
        }

        this.currentVideoId = videoId;
        this.player.loadVideoById(videoId);

        // Auto play after loading
        setTimeout(() => {
            this.player.playVideo();
        }, 1000);

        console.log('🎵 Loading and playing video:', videoId);
    }

    // Get current status
    getStatus() {
        return {
            isReady: this.isReady,
            isPlaying: this.isPlaying,
            currentTrack: this.currentTrack?.title || null,
            tracksLoaded: this.tracks.length,
            volume: this.volume
        };
    }
}

// Add CSS for notifications and redirect modal
const playerStyles = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.redirect-content {
    background: var(--card-gradient);
    border-radius: 15px;
    max-width: 400px;
    width: 90%;
    border: 1px solid rgba(212, 176, 120, 0.2);
    overflow: hidden;
}

.redirect-header {
    padding: 1.5rem 1.5rem 0;
    text-align: center;
}

.redirect-header h3 {
    color: var(--text-primary);
    margin: 0;
}

.redirect-body {
    padding: 1rem 1.5rem;
    text-align: center;
}

.redirect-body p {
    color: var(--text-secondary);
    margin: 0.5rem 0;
}

.redirect-note {
    font-size: 0.9rem;
    opacity: 0.8;
}

.redirect-actions {
    display: flex;
    gap: 1rem;
    padding: 1rem 1.5rem;
    justify-content: center;
}

.redirect-actions .btn {
    flex: 1;
    max-width: 120px;
}
`;

// Inject player styles
const styleSheet = document.createElement('style');
styleSheet.textContent = playerStyles;
document.head.appendChild(styleSheet);

// Initialize YouTube Audio Player
let youtubePlayer;

// Initialize with delay to ensure all DOM is ready
function initializeYouTubePlayer() {
    try {
        youtubePlayer = new YouTubeAudioPlayer();
        window.youtubePlayer = youtubePlayer;
        console.log('✅ YouTube player initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize YouTube player:', error);
        // Retry after 2 seconds
        setTimeout(initializeYouTubePlayer, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Add delay to ensure all other scripts are loaded
    setTimeout(initializeYouTubePlayer, 1000);
});

// Export removed for vanilla JS compatibility
// export default YouTubeAudioPlayer;