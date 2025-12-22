// Final Clean Music System - YouTube MP3 & Modal Video
class MusicSystem {
    constructor() {
        this.defaultArtwork = "assets/images/logo-main.png";
        this.defaultArtist = "Hasan Arthur AltuntaY";
        this.catalogUrl = "assets/data/music-links.json";
        this.configUrl = "config/site.json";
        this.catalogCacheKey = "musicCatalogCache";
        this.catalogCacheTtlMs = 6 * 60 * 60 * 1000;
        this.maxRemoteTracks = 12;
        this.youtubeApiInjected = false;
        this.pendingCatalog = null;

        this.defaultTracks = [
            {
                id: 1,
                title: "LIAR",
                artist: "Hasan Arthur Altuntaş",
                duration: "2:57",
                artwork: "assets/images/logo-main.png",
                youtube: "https://www.youtube.com/watch?v=u3malJJSGds",
                spotify: "https://open.spotify.com/intl-tr/track/2VhpoqJKPMTz2cHYcaAX2j",
                apple: "https://music.apple.com/tr/song/liar/1833771404"
            },
            {
                id: 2,
                title: "Interstellar But My Version",
                artist: "Hasan Arthur Altuntaş",
                duration: "2:32",
                artwork: "assets/images/logo-main.png",
                youtube: "https://www.youtube.com/watch?v=4vDvuFldYiM",
                spotify: "https://open.spotify.com/intl-tr/track/5fwzfwMJtVANQotGtmdv3C",
                apple: "https://music.apple.com/tr/song/interstellar-but-my-version/1773902252"
            },
            {
                id: 3,
                title: "Oppenheimer But My Version",
                artist: "Hasan Arthur Altuntaş",
                duration: "2:44",
                artwork: "assets/images/logo-main.png",
                youtube: "https://youtu.be/ZnOMJ9E0LmA",
                spotify: "https://open.spotify.com/intl-tr/track/27q14aJw81Qr5XBGV4JlNp",
                apple: "https://music.apple.com/tr/song/oppenheimer-but-my-version/1776487184"
            },
            {
                id: 5,
                title: "Alicia But My Version",
                artist: "Hasan Arthur Altuntaş",
                duration: "1:57",
                artwork: "assets/images/logo-main.png",
                youtube: "https://youtu.be/x8lcJsuDR8A",
                spotify: "https://open.spotify.com/intl-tr/track/4vLu7LEv9KE5wPp4h1ldc8?si=c0491e04580140eb",
                apple: "https://music.apple.com/tr/song/alicia-version3/1841276639"
                },
                {
                id: 6,
                title: "Clair Obscur  Expedition 33  But My Version",
                artist: "Hasan Arthur Altuntaş",
                duration: "2:44",
                artwork: "assets/images/logo-main.png",
                youtube: "https://youtu.be/AINP-Y82LsA",
                spotify: "https://open.spotify.com/intl-tr/track/3uYE4LHqPv3vA7MzLW99ij?si=800c32542d254e7e",
                apple: "https://music.apple.com/tr/song/lumiere-and-alicia-piano/1841276636"
                }
                ,
                {
                id: 7,
                title: "Une Vie à Peindre - Clair Obscur Expedition 33(Cover)",
                artist: "Hasan Arthur Altuntaş",
                duration: "1:32",
                artwork: "assets/images/logo-main.png",
                youtube: "https://www.youtube.com/watch?v=gCuVMsRgqWI&list=OLAK5uy_m7d_zBzSRcJtMt1Xw7yzZtKbNfJ4Zmb5U",
                spotify: "https://open.spotify.com/intl-tr/track/5dT1GEBSXVVPtxxqtaWzLn?si=54db5d2fa0704893",
                apple: "https://music.apple.com/tr/song/une-vie-%C3%A0-peindre-clair-obscur-expedition-33-cover/1848749673"
                },
                {
                id: 8,
                title: "Feel, S Z I, Run, Shakra, TODASI, Yassaite",
                artist: "Hasan Arthur Altuntaş",
                duration: "11:51",
                artwork: "assets/images/logo-main.png",
                youtube: "https://www.youtube.com/watch?v=vQGDk2ItC2o",
                spotify: "",
                apple: ""
                }
                
        ];

        this.defaultAlbums = [
            {
                id: 1,
                title: "My Compositions",
                artist: "Hasan Arthur Altuntaş",
                artwork: "assets/images/logo-main.png",
                youtube: "https://www.youtube.com/playlist?list=PLuQhIRvxCsFxFF8wW3UWcSbXA0b6fGWim"
            },
            {
                id: 2,
                title: "Film Composition Covers",
                artist: "Hasan Arthur Altuntaş",
                artwork: "assets/images/logo-main.png",
                youtube: "https://www.youtube.com/playlist?list=PLuQhIRvxCsFxyR4zeWWhVheUeUHJY5MLq"
            }
        ];

        this.tracks = this.normalizeTracks(this.defaultTracks);
        this.albums = this.normalizeAlbums(this.defaultAlbums);

        this.currentTrack = null;
        this.isPlaying = false;
        this.youtubePlayers = new Map();

        this.init();
    }

    init() {
        this.renderMusic();
        this.setupEventListeners();
        this.deferCatalogLoad();
        console.log('🎵 Music System Ready - YouTube API Version');
    }

    loadYouTubeAPI() {
        if (window.YT) {
            console.log('YouTube API already loaded');
            return;
        }

        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    renderMusic() {
        this.renderTracks();
        this.renderAlbums();
    }

    renderTracks() {
        const container = document.getElementById('tracks-container');
        if (!container) return;

        container.innerHTML = '';

        this.tracks.forEach((track, index) => {
            const card = document.createElement('div');
            card.className = 'modern-music-card';
            card.innerHTML = `
                <div class="card-content">
                    <!-- Sol: Albüm Kapağı -->
                    <div class="track-artwork">
                        <img src="${track.artwork}" alt="${track.title}" loading="lazy">
                        <div class="duration-badge">${track.duration}</div>
                    </div>

                    <!-- Orta: Şarkı Bilgileri -->
                    <div class="track-main">
                        <div class="track-info">
                            <h3 class="track-name">${track.title}</h3>
                            <p class="artist-name">${track.artist}</p>
                        </div>
                    </div>

                    <!-- Sağ: Sabit Kontroller -->
                    <div class="track-controls-fixed">
                        <button class="play-pause-btn" data-track-index="${index}" title="Çal/Durdur">
                            <svg viewBox="0 0 24 24" fill="currentColor" class="play-icon" id="playIcon-${track.id}">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </button>
                        <a href="${track.spotify}" target="_blank" class="platform-link spotify" title="Spotify'da Dinle">
                            <svg viewBox="0 0 24 24" fill="currentColor" class="platform-icon">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                            </svg>
                        </a>
                        <a href="${track.apple}" target="_blank" class="platform-link apple" title="Apple Music'te Dinle">
                            <svg viewBox="0 0 24 24" fill="currentColor" class="platform-icon">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                        </a>
                        <a href="${track.youtube}" target="_blank" class="platform-link youtube" title="YouTube'da İzle">
                            <svg viewBox="0 0 24 24" fill="currentColor" class="platform-icon">
                                <path d="M23.498 6.186a2.999 2.999 0 0 0-2.111-2.135C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.387.505A2.999 2.999 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.999 2.999 0 0 0 2.111 2.135c1.882.505 9.387.505 9.387.505s7.505 0 9.387-.505a2.999 2.999 0 0 0 2.111-2.135C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <!-- YouTube Audio Player (Gizli) -->
                <div id="youtube-audio-${track.id}" style="display: none;"></div>
            `;
            container.appendChild(card);
        });
    }

    renderAlbums() {
        const container = document.getElementById('albums-container');
        if (!container) return;

        container.innerHTML = '';

        this.albums.forEach((album) => {
            const card = document.createElement('div');
            card.className = 'modern-album-card';
            card.innerHTML = `
                <div class="album-card-wrapper">
                    <a href="${album.youtube}" target="_blank" class="album-link">
                        <div class="album-cover">
                            <img src="${album.artwork}" alt="${album.title}" loading="lazy">
                            <div class="album-overlay">
                                <div class="album-icons">
                                    <svg viewBox="0 0 24 24" fill="currentColor" class="album-play-icon">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                    <i class="fab fa-youtube album-youtube-icon"></i>
                                </div>
                            </div>
                        </div>
                        <div class="album-info">
                            <h4 class="album-title">${album.title}</h4>
                            <p class="album-artist">${album.artist}</p>
                            <span class="album-type">2024 • Playlist</span>
                        </div>
                    </a>
                </div>
            `;
            container.appendChild(card);
        });
    }

    setupEventListeners() {
        // Play/Pause butonları için event delegation
        document.addEventListener('click', (e) => {
            const playBtn = e.target.closest('.play-pause-btn');

            if (playBtn) {
                const trackIndex = playBtn.dataset.trackIndex;
                this.togglePlay(parseInt(trackIndex));
            }
        });
    }

    async togglePlay(index) {
        const track = this.tracks[index];
        const playIcon = document.getElementById(`playIcon-${track.id}`);

        // Eğer aynı şarkı çalınıyorsa, duraklat/devam ettir
        if (this.currentTrack?.id === track.id) {
            if (this.isPlaying) {
                this.pauseCurrentTrack();
            } else {
                this.resumeCurrentTrack();
            }
            return;
        }

        // Farklı şarkıya geçiş
        this.stopCurrentTrack();
        await this.playYouTubeAudio(track, playIcon);
    }

    async playYouTubeAudio(track, playIcon) {
        const videoId = this.extractYouTubeId(track.youtube);
        if (!videoId) return;

        this.currentTrack = track;

        // Player yoksa oluştur
        if (!this.youtubePlayers.has(track.id)) {
            await this.createYouTubePlayer(track.id, videoId);
        }

        const player = this.youtubePlayers.get(track.id);

        // Play icon'unu güncelle
        if (playIcon) {
            playIcon.innerHTML = '<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>';
        }

        // Çalmaya başla
        player.playVideo();
        this.isPlaying = true;
    }

    async createYouTubePlayer(trackId, videoId) {
        return new Promise((resolve) => {
            // YouTube API hazır değilse bekleyelim
            if (!window.YT || !window.YT.Player) {
                const checkInterval = setInterval(() => {
                    if (window.YT && window.YT.Player) {
                        clearInterval(checkInterval);
                        this.initializePlayer(trackId, videoId, resolve);
                    }
                }, 100);
                return;
            }

            this.initializePlayer(trackId, videoId, resolve);
        });
    }

    initializePlayer(trackId, videoId, resolve) {
        const playerDiv = document.getElementById(`youtube-audio-${trackId}`);
        if (!playerDiv) return resolve(null);

        const player = new YT.Player(playerDiv, {
            height: '0',
            width: '0',
            videoId: videoId,
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                iv_load_policy: 3,
                modestbranding: 1,
                rel: 0,
                enablejsapi: 1
            },
            events: {
                'onReady': (event) => {
                    console.log('Player ready for track:', trackId);
                    this.youtubePlayers.set(trackId, event.target);
                    resolve(event.target);
                },
                'onStateChange': (event) => {
                    this.handlePlayerStateChange(event, trackId);
                },
                'onError': (error) => {
                    console.error('YouTube Player Error:', error);
                    resolve(null);
                }
            }
        });
    }

    handlePlayerStateChange(event, trackId) {
        switch (event.data) {
            case YT.PlayerState.PLAYING:
                this.isPlaying = true;
                this.updateAllPlayIcons();
                console.log('▶️ Playing:', this.currentTrack.title);
                break;

            case YT.PlayerState.PAUSED:
                this.isPlaying = false;
                this.updateAllPlayIcons();
                console.log('⏸️ Paused:', this.currentTrack.title);
                break;

            case YT.PlayerState.ENDED:
                this.isPlaying = false;
                this.updateAllPlayIcons();
                console.log('⏹️ Ended:', this.currentTrack.title);
                break;
        }
    }

    pauseCurrentTrack() {
        if (this.currentTrack && this.youtubePlayers.has(this.currentTrack.id)) {
            const player = this.youtubePlayers.get(this.currentTrack.id);
            player.pauseVideo();
            this.isPlaying = false;
        }
    }

    resumeCurrentTrack() {
        if (this.currentTrack && this.youtubePlayers.has(this.currentTrack.id)) {
            const player = this.youtubePlayers.get(this.currentTrack.id);
            player.playVideo();
            this.isPlaying = true;
        }
    }

    stopCurrentTrack() {
        if (this.currentTrack && this.youtubePlayers.has(this.currentTrack.id)) {
            const player = this.youtubePlayers.get(this.currentTrack.id);
            player.stopVideo();
        }
        this.isPlaying = false;
        this.updateAllPlayIcons();
    }

    updateAllPlayIcons() {
        // Tüm play icon'larını güncelle
        this.tracks.forEach(track => {
            const playIcon = document.getElementById(`playIcon-${track.id}`);
            if (playIcon) {
                if (this.isPlaying && this.currentTrack?.id === track.id) {
                    playIcon.innerHTML = '<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>'; // Pause
                } else {
                    playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; // Play
                }
            }
        });
    }



    extractYouTubeId(url) {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
}

// Global functions
function closeVideoModal() {
    const modal = document.querySelector('.video-modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// YouTube API callback
window.onYouTubeIframeAPIReady = function() {
    console.log('YouTube IFrame API Ready');
    if (window.musicSystem && window.musicSystem.onYouTubeIframeAPIReady) {
        window.musicSystem.onYouTubeIframeAPIReady();
    }
};

// Initialize system
let musicSystem;
document.addEventListener('DOMContentLoaded', () => {
    musicSystem = new MusicSystem();
    window.musicSystem = musicSystem; // Global access
});

// ESC tuşu ile modal'ı kapat
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeVideoModal();
    }
});

// Sayfa kapatılırken player'ları temizle
window.addEventListener('beforeunload', () => {
    if (window.musicSystem) {
        window.musicSystem.stopCurrentTrack();
    }
});
