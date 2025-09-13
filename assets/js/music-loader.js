class MusicLoader {
    constructor() {
        this.musicData = null;
        this.currentLanguage = localStorage.getItem('language') || 'tr';
        this.init();
    }

    async init() {
        try {
            await this.loadMusicData();
            this.renderTracks();
            this.renderAlbums();
        } catch (error) {
            console.error('Music loading error:', error);
        }
    }

    async loadMusicData() {
        try {
            const response = await fetch('./assets/data/music-links.json');
            this.musicData = await response.json();
        } catch (error) {
            console.error('Failed to load music data:', error);
            // Fallback data
            this.musicData = { tracks: [], albums: [] };
        }
    }

    renderTracks() {
        const tracksContainer = document.getElementById('tracks-container');
        if (!tracksContainer) return;

        if (!this.musicData.tracks || this.musicData.tracks.length === 0) {
            tracksContainer.innerHTML = `
                <div class="empty-music-state">
                    <i class="fas fa-music"></i>
                    <h4>Şarkılar Yükleniyor...</h4>
                    <p>Admin panelden yeni şarkılar ekleyebilirsiniz</p>
                </div>
            `;
            return;
        }

        tracksContainer.innerHTML = '';

        this.musicData.tracks.forEach(track => {
            const trackElement = this.createTrackElement(track);
            tracksContainer.appendChild(trackElement);
        });
    }

    renderAlbums() {
        const albumsContainer = document.getElementById('albums-container');
        if (!albumsContainer) return;

        if (!this.musicData.albums || this.musicData.albums.length === 0) {
            albumsContainer.innerHTML = `
                <div class="empty-music-state">
                    <i class="fas fa-compact-disc"></i>
                    <h4>Albümler Yükleniyor...</h4>
                    <p>Admin panelden yeni albümler ekleyebilirsiniz</p>
                </div>
            `;
            return;
        }

        albumsContainer.innerHTML = '';

        this.musicData.albums.forEach(album => {
            const albumElement = this.createAlbumElement(album);
            albumsContainer.appendChild(albumElement);
        });
    }

    createTrackElement(track) {
        const trackDiv = document.createElement('div');
        trackDiv.className = 'music-card track-card';
        trackDiv.innerHTML = `
            <div class="music-artwork">
                <img src="${track.artwork}" alt="${track.title}" loading="lazy">
                <div class="play-overlay">
                    <button class="card-play-btn" onclick="musicLoader.playTrack('${track.links.youtube}')">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <div class="music-card-content">
                <div class="music-card-header">
                    <h3 class="music-card-title">${track.title}</h3>
                    <p class="music-card-artist">${track.artist}</p>
                </div>
                <div class="music-card-info">
                    <span class="music-card-genre">Single</span>
                    <span class="music-card-date">2024</span>
                </div>
                <div class="music-card-platforms">
                    ${track.links.youtube ? `<a href="${track.links.youtube}" class="card-platform-link youtube" target="_blank" rel="noopener"><i class="fab fa-youtube"></i></a>` : ''}
                    ${track.links.spotify ? `<a href="${track.links.spotify}" class="card-platform-link spotify" target="_blank" rel="noopener"><i class="fab fa-spotify"></i></a>` : ''}
                    ${track.links.apple ? `<a href="${track.links.apple}" class="card-platform-link apple" target="_blank" rel="noopener"><i class="fab fa-apple"></i></a>` : ''}
                </div>
            </div>
        `;
        return trackDiv;
    }

    createAlbumElement(album) {
        const albumDiv = document.createElement('div');
        albumDiv.className = 'music-card album-card';
        albumDiv.innerHTML = `
            <div class="music-artwork">
                <img src="${album.artwork}" alt="${album.title}" loading="lazy">
                <div class="play-overlay">
                    <button class="card-play-btn" onclick="musicLoader.playAlbum('${album.links.youtube}')">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <div class="music-card-content">
                <div class="music-card-header">
                    <h3 class="music-card-title">${album.title}</h3>
                    <p class="music-card-artist">${album.artist}</p>
                </div>
                <div class="music-card-info">
                    <span class="music-card-genre">Album</span>
                    <span class="music-card-date">${album.release_date}</span>
                </div>
                <div class="music-card-platforms">
                    ${album.links.youtube ? `<a href="${album.links.youtube}" class="card-platform-link youtube" target="_blank" rel="noopener"><i class="fab fa-youtube"></i></a>` : ''}
                    ${album.links.spotify ? `<a href="${album.links.spotify}" class="card-platform-link spotify" target="_blank" rel="noopener"><i class="fab fa-spotify"></i></a>` : ''}
                    ${album.links.apple ? `<a href="${album.links.apple}" class="card-platform-link apple" target="_blank" rel="noopener"><i class="fab fa-apple"></i></a>` : ''}
                </div>
            </div>
        `;
        return albumDiv;
    }

    playTrack(youtubeUrl) {
        if (window.youtubePlayer && window.youtubePlayer.loadVideo) {
            const videoId = this.extractVideoId(youtubeUrl);
            if (videoId) {
                window.youtubePlayer.loadVideo(videoId);
            }
        }
    }

    playAlbum(youtubeUrl) {
        // Album play functionality - same as track for now
        this.playTrack(youtubeUrl);
    }

    extractVideoId(url) {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    // Language change handler
    updateLanguage(newLanguage) {
        this.currentLanguage = newLanguage;
        this.renderTracks();
        this.renderAlbums();
    }
}

// Initialize music loader
let musicLoader;
document.addEventListener('DOMContentLoaded', () => {
    musicLoader = new MusicLoader();
});

// Listen for language changes
document.addEventListener('languageChanged', (e) => {
    if (musicLoader) {
        musicLoader.updateLanguage(e.detail.language);
    }
});