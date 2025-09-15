// Final Clean Music System
class MusicSystem {
    constructor() {
        this.tracks = [
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
            }
        ];

        this.albums = [
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

        this.currentTrack = null;
        this.currentIndex = 0;
        this.isPlaying = false;
        this.progressInterval = null;

        this.init();
    }

    init() {
        this.renderMusic();
        this.setupPlayer();
        console.log('🎵 Music System Ready');
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

                    <!-- Orta: Şarkı Bilgileri + Kontroller -->
                    <div class="track-main">
                        <div class="track-info">
                            <h3 class="track-name">${track.title}</h3>
                            <p class="artist-name">${track.artist}</p>
                        </div>

                        <div class="player-controls">
                            <button class="ctrl-btn" onclick="musicSystem.prevTrack()" title="Önceki Şarkı" data-translate-title="music.controls.previous">
                                <svg viewBox="0 0 24 24" fill="currentColor" class="control-icon">
                                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                                </svg>
                            </button>
                            <button class="ctrl-btn play-btn-main" onclick="musicSystem.togglePlayCard(${index})" title="Oynat/Durdur" data-translate-title="music.controls.playPause">
                                <svg viewBox="0 0 24 24" fill="currentColor" class="play-icon" id="playIcon-${track.id}">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </button>
                            <button class="ctrl-btn" onclick="musicSystem.nextTrack()" title="Sonraki Şarkı" data-translate-title="music.controls.next">
                                <svg viewBox="0 0 24 24" fill="currentColor" class="control-icon">
                                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                                </svg>
                            </button>

                            <div class="volume-section">
                                <svg viewBox="0 0 24 24" fill="currentColor" class="volume-icon" onclick="musicSystem.toggleMute(${index})" title="Ses Kontrolü" data-translate-title="music.controls.volume">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                </svg>
                                <input type="range" id="volume-${track.id}" min="0" max="100" value="75" class="volume-bar" onchange="musicSystem.setVolume(${index}, this.value)">
                            </div>
                        </div>
                    </div>

                    <!-- Sağ: Platform Linkleri + Video İzle -->
                    <div class="track-actions">
                        <div class="platform-links">
                            <a href="${track.spotify}" target="_blank" class="platform-link spotify" title="Spotify'da Dinle" data-translate-title="music.platforms.spotify">
                                <svg viewBox="0 0 24 24" fill="currentColor" class="platform-icon">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                                </svg>
                            </a>
                            <a href="${track.apple}" target="_blank" class="platform-link apple" title="Apple Music'te Dinle" data-translate-title="music.platforms.apple">
                                <svg viewBox="0 0 24 24" fill="currentColor" class="platform-icon">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                </svg>
                            </a>
                        </div>

                        <button class="watch-video-btn" onclick="musicSystem.openVideoModal('${track.youtube}', '${track.title}')" title="Video İzle" data-translate="music.watchVideo">
                            <svg viewBox="0 0 24 24" fill="currentColor" class="youtube-icon">
                                <path d="M23.498 6.186a2.999 2.999 0 0 0-2.111-2.135C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.387.505A2.999 2.999 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.999 2.999 0 0 0 2.111 2.135c1.882.505 9.387.505 9.387.505s7.505 0 9.387-.505a2.999 2.999 0 0 0 2.111-2.135C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            <span data-translate="music.watchVideo">Video İzle</span>
                        </button>
                    </div>
                </div>

                <!-- Hidden YouTube Player for Audio -->
                <div id="youtube-player-${track.id}" style="display: none;"></div>
            `;
            container.appendChild(card);
        });
    }

    renderAlbums() {
        const container = document.getElementById('albums-container');
        if (!container) return;

        container.innerHTML = '';

        this.albums.forEach((album, index) => {
            const card = document.createElement('div');
            card.className = 'modern-album-card';
            card.innerHTML = `
                <div class="album-card-content">
                    <!-- Album Artwork -->
                    <div class="album-artwork-section">
                        <div class="album-cover">
                            <img src="${album.artwork}" alt="${album.title}" loading="lazy">
                            <div class="album-overlay">
                                <button class="album-play-btn" onclick="musicSystem.playAlbum(${index})" title="Albümü Çal" data-translate-title="music.albums.play">
                                    <svg viewBox="0 0 24 24" fill="currentColor" class="album-play-icon">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Album Info -->
                    <div class="album-info-section">
                        <h3 class="album-title">${album.title}</h3>
                        <p class="album-artist">${album.artist}</p>
                        <div class="album-meta">
                            <span class="album-year">2024</span>
                            <span class="album-separator">•</span>
                            <span class="album-type" data-translate="music.albums.type">Album</span>
                        </div>
                    </div>

                    <!-- Album Actions -->
                    <div class="album-actions">
                        <div class="album-controls">
                            <button class="album-ctrl-btn" onclick="musicSystem.playAlbum(${index})" title="Albümü Çal" data-translate-title="music.albums.play">
                                <svg viewBox="0 0 24 24" fill="currentColor" class="album-control-icon">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </button>
                            <button class="album-ctrl-btn" onclick="musicSystem.shuffleAlbum(${index})" title="Karışık Çal" data-translate-title="music.albums.shuffle">
                                <svg viewBox="0 0 24 24" fill="currentColor" class="album-control-icon">
                                    <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
                                </svg>
                            </button>
                        </div>

                        <div class="album-links">
                            <a href="${album.youtube}" target="_blank" class="album-link youtube" title="YouTube'da İzle" data-translate-title="music.albums.youtube">
                                <svg viewBox="0 0 24 24" fill="currentColor" class="album-link-icon">
                                    <path d="M23.498 6.186a2.999 2.999 0 0 0-2.111-2.135C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.387.505A2.999 2.999 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.999 2.999 0 0 0 2.111 2.135c1.882.505 9.387.505 9.387.505s7.505 0 9.387-.505a2.999 2.999 0 0 0 2.111-2.135C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </a>
                            <button class="album-link details" onclick="musicSystem.showAlbumDetails(${index})" title="Detayları Gör" data-translate-title="music.albums.details">
                                <svg viewBox="0 0 24 24" fill="currentColor" class="album-link-icon">
                                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    playInCard(index) {
        this.currentIndex = index;
        this.currentTrack = this.tracks[index];

        // Stop all other players
        this.tracks.forEach((track, i) => {
            const playIcon = document.getElementById(`playIcon-${track.id}`);
            const playerContainer = document.getElementById(`youtube-player-${track.id}`);

            if (i !== index) {
                if (playIcon) {
                    playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
                }
                if (playerContainer) playerContainer.innerHTML = '';
            }
        });

        const playIcon = document.getElementById(`playIcon-${this.currentTrack.id}`);
        const playerContainer = document.getElementById(`youtube-player-${this.currentTrack.id}`);

        if (!playerContainer) return;

        if (this.isPlaying && this.currentIndex === index) {
            // Pause current
            this.isPlaying = false;
            if (playIcon) {
                playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
            }
            playerContainer.innerHTML = '';
        } else {
            // Play new track
            this.isPlaying = true;
            if (playIcon) {
                playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
            }

            const videoId = this.extractYouTubeId(this.currentTrack.youtube);
            if (videoId) {
                // Create hidden YouTube player for audio
                playerContainer.innerHTML = `
                    <iframe
                        width="1"
                        height="1"
                        src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&rel=0&showinfo=0"
                        frameborder="0"
                        allow="autoplay; encrypted-media"
                        style="opacity: 0; position: absolute; left: -9999px;">
                    </iframe>
                `;
                console.log('🎵 Playing:', this.currentTrack.title);
            }
        }
    }

    extractYouTubeId(url) {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    loadYouTubePlayerInCard(trackId, videoId) {
        const playerArea = document.getElementById(`player-${trackId}`);
        if (!playerArea) return;

        // Create YouTube iframe for audio only
        const iframe = document.createElement('iframe');
        iframe.style.cssText = `
            width: 100%;
            height: 80px;
            border: none;
            border-radius: 8px;
        `;

        // Load video with autoplay, audio only
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&controls=1&modestbranding=1`;

        playerArea.appendChild(iframe);

        console.log('🎵 Loading YouTube player in card:', videoId);
    }

    updateMainPlayer() {
        if (!this.currentTrack) return;

        // Update player info
        const titleEl = document.querySelector('.track-info h3');
        const artistEl = document.querySelector('.track-info p');
        const artworkEl = document.querySelector('#playerArtwork');

        if (titleEl) titleEl.textContent = this.currentTrack.title;
        if (artistEl) artistEl.textContent = this.currentTrack.artist;
        if (artworkEl) artworkEl.src = this.currentTrack.artwork;

        // Update platform buttons
        const youtubeBtn = document.querySelector('#youtubeBtn');
        const spotifyBtn = document.querySelector('#spotifyBtn');
        const appleBtn = document.querySelector('#appleBtn');

        if (youtubeBtn) {
            youtubeBtn.href = this.currentTrack.youtube;
            youtubeBtn.onclick = (e) => {
                e.preventDefault();
                const videoId = this.extractYouTubeId(this.currentTrack.youtube);
                if (videoId) {
                    this.loadYouTubePlayer(videoId);
                }
            };
        }

        if (spotifyBtn) {
            spotifyBtn.href = this.currentTrack.spotify;
            spotifyBtn.onclick = (e) => {
                e.preventDefault();
                window.open(this.currentTrack.spotify, '_blank');
            };
        }

        if (appleBtn) {
            appleBtn.href = this.currentTrack.apple;
            appleBtn.onclick = (e) => {
                e.preventDefault();
                window.open(this.currentTrack.apple, '_blank');
            };
        }

        // Update duration
        const totalTimeEls = document.querySelectorAll('.total-time, #totalTime');
        totalTimeEls.forEach(el => {
            if (el) el.textContent = this.currentTrack.duration;
        });
    }

    setupPlayer() {
        // Play/Pause buttons
        const playPauseBtn = document.getElementById('playPauseBtn');
        const mainPlayBtn = document.getElementById('mainPlayBtn');

        if (playPauseBtn) {
            playPauseBtn.onclick = () => this.togglePlay();
        }

        if (mainPlayBtn) {
            mainPlayBtn.onclick = () => this.togglePlay();
        }

        // Next/Previous buttons
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');

        if (nextBtn) {
            nextBtn.onclick = () => this.nextTrack();
        }

        if (prevBtn) {
            prevBtn.onclick = () => this.prevTrack();
        }
    }

    togglePlay() {
        if (!this.currentTrack) {
            // İlk şarkıyı çal
            this.playTrack(0);
            return;
        }

        this.isPlaying = !this.isPlaying;
        this.updatePlayButton();

        // YouTube iframe kontrolü
        const iframe = document.getElementById('youtubePlayerIframe');
        if (iframe) {
            // YouTube player API kullan
            if (this.isPlaying) {
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                this.startProgress();
            } else {
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                this.stopProgress();
            }
        } else {
            if (this.isPlaying) {
                this.startProgress();
            } else {
                this.stopProgress();
            }
        }
    }

    nextTrack() {
        this.currentIndex = (this.currentIndex + 1) % this.tracks.length;
        this.playInCard(this.currentIndex);
    }

    prevTrack() {
        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.tracks.length - 1;
        this.playInCard(this.currentIndex);
    }

    updatePlayButton() {
        const icon = this.isPlaying ? 'fa-pause' : 'fa-play';

        const playPauseBtn = document.getElementById('playPauseBtn');
        const mainPlayBtn = document.getElementById('mainPlayBtn');

        if (playPauseBtn) {
            playPauseBtn.innerHTML = `<i class="fas ${icon}"></i>`;
        }

        if (mainPlayBtn) {
            const iconEl = mainPlayBtn.querySelector('i');
            if (iconEl) {
                iconEl.className = `fas ${icon}`;
            }
        }
    }

    startProgress() {
        if (this.progressInterval) clearInterval(this.progressInterval);

        let currentSeconds = 0;
        const totalSeconds = this.parseDuration(this.currentTrack?.duration || '3:00');

        this.progressInterval = setInterval(() => {
            if (!this.isPlaying) return;

            currentSeconds++;
            const progress = (currentSeconds / totalSeconds) * 100;

            // Update progress bars
            const progressFills = document.querySelectorAll('.progress-fill');
            progressFills.forEach(fill => {
                if (fill) fill.style.width = `${Math.min(progress, 100)}%`;
            });

            // Update current time
            const currentTimeEls = document.querySelectorAll('.current-time');
            const formattedTime = this.formatTime(currentSeconds);
            currentTimeEls.forEach(timeEl => {
                if (timeEl) timeEl.textContent = formattedTime;
            });

            if (currentSeconds >= totalSeconds) {
                clearInterval(this.progressInterval);
                this.nextTrack();
            }
        }, 1000);
    }

    stopProgress() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
    }

    parseDuration(duration) {
        const parts = duration.split(':');
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Additional control methods for track cards
    togglePlayCard(index) {
        this.playInCard(index);
    }

    shuffleTrack(index) {
        console.log('🔀 Shuffle mode toggled for track:', this.tracks[index].title);
    }

    repeatTrack(index) {
        console.log('🔁 Repeat mode toggled for track:', this.tracks[index].title);
    }

    toggleMute(index) {
        const volumeSlider = document.getElementById(`volume-${this.tracks[index].id}`);
        if (volumeSlider) {
            if (volumeSlider.value === '0') {
                volumeSlider.value = '75';
            } else {
                volumeSlider.value = '0';
            }
            this.setVolume(index, volumeSlider.value);
        }
    }

    setVolume(index, volume) {
        // For YouTube iframe, volume control is limited
        // This is a visual feedback for now
        console.log('🔊 Volume set to:', volume, 'for track:', this.tracks[index].title);
    }

    openVideoModal(youtubeUrl, title) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'video-modal-overlay';
        modal.innerHTML = `
            <div class="video-modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal" onclick="this.closest('.video-modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="video-container">
                    <iframe
                        src="${youtubeUrl.replace('watch?v=', 'embed/')}"
                        frameborder="0"
                        allowfullscreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
                    </iframe>
                </div>
            </div>
        `;

        // Add to body
        document.body.appendChild(modal);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        console.log('🎬 Video modal opened for:', title);
    }

    // Album functions
    playAlbum(albumIndex) {
        const album = this.albums[albumIndex];
        if (album && album.youtube) {
            window.open(album.youtube, '_blank');
            console.log('🎵 Opening album playlist:', album.title);
        }
    }

    shuffleAlbum(albumIndex) {
        const album = this.albums[albumIndex];
        if (album && album.youtube) {
            // Add shuffle parameter to YouTube playlist
            const shuffleUrl = album.youtube + '&shuffle=1';
            window.open(shuffleUrl, '_blank');
            console.log('🔀 Opening shuffled album:', album.title);
        }
    }

    showAlbumDetails(albumIndex) {
        const album = this.albums[albumIndex];
        if (!album) return;

        // Create album details modal
        const modal = document.createElement('div');
        modal.className = 'album-details-modal-overlay';
        modal.innerHTML = `
            <div class="album-details-modal">
                <div class="album-modal-header">
                    <div class="album-modal-info">
                        <img src="${album.artwork}" alt="${album.title}" class="album-modal-cover">
                        <div class="album-modal-text">
                            <h2>${album.title}</h2>
                            <p>${album.artist}</p>
                            <span class="album-modal-year">2024 • Album</span>
                        </div>
                    </div>
                    <button class="close-album-modal" onclick="this.closest('.album-details-modal-overlay').remove()">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>

                <div class="album-modal-content">
                    <div class="album-actions-bar">
                        <button class="album-action-btn primary" onclick="musicSystem.playAlbum(${albumIndex})">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                            <span data-translate="music.albums.playAll">Tümünü Çal</span>
                        </button>
                        <button class="album-action-btn" onclick="musicSystem.shuffleAlbum(${albumIndex})">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
                            </svg>
                            <span data-translate="music.albums.shuffle">Karışık Çal</span>
                        </button>
                    </div>

                    <div class="album-description">
                        <p data-translate="music.albums.description">Bu albüm, sinematik müzik ve film score yorumlarından oluşan özel bir koleksiyon. Her parça dikkatle seçilmiş ve atmosferik bir deneyim sunmak için düzenlenmiş.</p>
                    </div>
                </div>
            </div>
        `;

        // Add to body
        document.body.appendChild(modal);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        console.log('📖 Album details opened for:', album.title);
    }

    // Update subscription function
    subscribeToUpdates() {
        // Create subscription modal
        const modal = document.createElement('div');
        modal.className = 'subscription-modal-overlay';
        modal.innerHTML = `
            <div class="subscription-modal">
                <div class="subscription-header">
                    <h3 data-translate="gallery.notify.title">Get Notified About Updates</h3>
                    <button class="close-subscription-modal" onclick="this.closest('.subscription-modal-overlay').remove()">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>

                <div class="subscription-content">
                    <p data-translate="gallery.notify.description">I'll send you updates about new gallery content, music releases, and software projects. No spam, just the good stuff!</p>

                    <div class="notification-options">
                        <div class="notification-item">
                            <svg viewBox="0 0 24 24" fill="currentColor" class="notification-icon">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            <span data-translate="gallery.notify.gallery">Gallery Updates</span>
                        </div>
                        <div class="notification-item">
                            <svg viewBox="0 0 24 24" fill="currentColor" class="notification-icon">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            <span data-translate="gallery.notify.music">New Music Releases</span>
                        </div>
                        <div class="notification-item">
                            <svg viewBox="0 0 24 24" fill="currentColor" class="notification-icon">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            <span data-translate="gallery.notify.projects">Software Projects</span>
                        </div>
                    </div>

                    <div class="social-follow">
                        <p data-translate="gallery.notify.social">Follow me on social media for instant updates:</p>
                        <div class="social-buttons">
                            <a href="https://www.instagram.com/rthur_hsn" target="_blank" class="social-btn instagram">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.017 11.986c0 2.178-1.765 3.943-3.944 3.943-2.178 0-3.943-1.765-3.943-3.943 0-2.178 1.765-3.943 3.943-3.943 2.179 0 3.944 1.765 3.944 3.943zm1.693-8.986c1.325 0 2.4 1.075 2.4 2.4v13.2c0 1.325-1.075 2.4-2.4 2.4h-3.4c-1.325 0-2.4-1.075-2.4-2.4v-13.2c0-1.325 1.075-2.4 2.4-2.4h3.4zm-1.7 2.4c-.331 0-.6.269-.6.6s.269.6.6.6.6-.269.6-.6-.269-.6-.6-.6zm-6.017 7.586c0-3.313 2.687-6 6-6s6 2.687 6 6-2.687 6-6 6-6-2.687-6-6z"/>
                                </svg>
                                <span>Instagram</span>
                            </a>
                            <a href="https://github.com/hasanarthuraltuntas" target="_blank" class="social-btn github">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                <span>GitHub</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add to body
        document.body.appendChild(modal);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        console.log('🔔 Subscription modal opened');
    }
}

// Initialize system
let musicSystem;
document.addEventListener('DOMContentLoaded', () => {
    musicSystem = new MusicSystem();
});