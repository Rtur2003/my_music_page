class MusicLoader {
    constructor() {
        this.musicData = null;
        this.currentLanguage = this.getLanguageSafely() || 'tr';
        this.init();
    }

    // Safe localStorage access
    getLanguageSafely() {
        try {
            return localStorage.getItem('language');
        } catch (error) {
            console.warn('localStorage access denied, using default language');
            return 'tr';
        }
    }

    async init() {
        try {
            console.log('🎵 Music loader initializing...');
            await this.loadMusicData();

            // Mobil için gecikme ekle
            if (window.innerWidth <= 768) {
                console.log('📱 Mobile detected, adding delay for DOM readiness');
                setTimeout(() => {
                    this.renderTracks();
                    this.renderAlbums();
                }, 500);
            } else {
                this.renderTracks();
                this.renderAlbums();
            }
        } catch (error) {
            console.error('Music loading error:', error);
            // Hata durumunda retry
            setTimeout(() => {
                console.log('🔄 Retrying music load...');
                this.renderTracks();
                this.renderAlbums();
            }, 1000);
        }
    }

    async loadMusicData() {
        console.log('🎵 Loading music data...');

        // LocalStorage'a erişim deneyimi
        try {
            const savedData = localStorage.getItem('music_data_live');
            if (savedData) {
                console.log('📁 Found saved music data in localStorage');
                this.musicData = JSON.parse(savedData);
                return;
            }
        } catch (storageError) {
            console.warn('⚠️ localStorage access denied, using hardcoded data:', storageError.message);
        }

        // Hardcoded data as fallback - always works
        console.log('📁 Using hardcoded music data');
        this.musicData = {
                "tracks": [
                    {
                        "id": 1,
                        "title": "LIAR",
                        "artist": "Hasan Arthur Altuntaş",
                        "artwork": "assets/images/logo-main.png",
                        "links": {
                            "youtube": "https://www.youtube.com/watch?v=u3malJJSGds&list=OLAK5uy_le5DM9PMUqTnB4_whDwAxc-rMD54mVctQ",
                            "spotify": "https://open.spotify.com/intl-tr/track/2VhpoqJKPMTz2cHYcaAX2j?si=184e6e2589f3423b",
                            "apple": "https://music.apple.com/tr/song/liar/1833771404"
                        }
                    },
                    {
                        "id": 3,
                        "title": "Interstellar But My Version",
                        "artist": "Hasan Arthur Altuntaş",
                        "artwork": "assets/images/logo-main.png",
                        "links": {
                            "youtube": "https://www.youtube.com/watch?v=4vDvuFldYiM&list=OLAK5uy_lassw25Z8Ch3EqP-H9jC6gjGeMbe4PCGs",
                            "spotify": "https://open.spotify.com/intl-tr/track/5fwzfwMJtVANQotGtmdv3C?si=ebc8d8228c644263",
                            "apple": "https://music.apple.com/tr/song/interstellar-but-my-version/1773902252"
                        }
                    },
                    {
                        "id": 4,
                        "title": "Oppenheimer But My Version",
                        "artist": "Hasan Arthur Altuntaş",
                        "artwork": "assets/images/logo-main.png",
                        "links": {
                            "youtube": "https://youtu.be/ZnOMJ9E0LmA?si=p9FkzGERc_zh6RuR",
                            "spotify": "https://open.spotify.com/intl-tr/track/27q14aJw81Qr5XBGV4JlNp?si=e5aa51c4051d45ba",
                            "apple": "https://music.apple.com/tr/song/oppenheimer-but-my-version/1776487184"
                        }
                    }
                ],
                "albums": [
                    {
                        "id": 1,
                        "title": "My Compositions",
                        "artist": "Hasan Arthur Altuntaş",
                        "artwork": "assets/images/logo-main.png",
                        "release_date": "2024",
                        "links": {
                            "youtube": "https://www.youtube.com/watch?v=F0XzcRB1a94&list=PLuQhIRvxCsFxFF8wW3UWcSbXA0b6fGWim"
                        }
                    },
                    {
                        "id": 2,
                        "title": "Film Composition Covers",
                        "artist": "Hasan Arthur Altuntaş",
                        "artwork": "assets/images/logo-main.png",
                        "release_date": "2024",
                        "links": {
                            "youtube": "https://www.youtube.com/watch?v=RormIa0YaJI&list=PLuQhIRvxCsFxyR4zeWWhVheUeUHJY5MLq"
                        }
                    }
                ]
        };

        console.log('✅ Music data loaded:', this.musicData.tracks.length, 'tracks');
    }

    renderTracks() {
        try {
            const tracksContainer = document.getElementById('tracks-container');
            console.log('🎵 Rendering tracks, container found:', !!tracksContainer);
            if (!tracksContainer) {
                console.warn('❌ tracks-container element not found, retrying...');
                // Retry after short delay
                setTimeout(() => this.renderTracks(), 500);
                return;
            }

            console.log('🎵 Music data tracks:', this.musicData?.tracks?.length || 0);
            if (!this.musicData || !this.musicData.tracks || this.musicData.tracks.length === 0) {
                console.log('🔄 No tracks data, showing loading state');
                tracksContainer.innerHTML = `
                    <div class="empty-music-state">
                        <i class="fas fa-music"></i>
                        <h4>Şarkılar Yükleniyor...</h4>
                        <p>Müzik verileri yükleniyor, lütfen bekleyin...</p>
                    </div>
                `;

                // Retry loading after delay
                setTimeout(() => {
                    if (this.musicData && this.musicData.tracks && this.musicData.tracks.length > 0) {
                        this.renderTracks();
                    }
                }, 1000);
                return;
            }

            tracksContainer.innerHTML = '';
            console.log('🎵 Rendering', this.musicData.tracks.length, 'tracks');

            this.musicData.tracks.forEach((track, index) => {
                try {
                    const trackElement = this.createTrackElement(track);
                    tracksContainer.appendChild(trackElement);
                    console.log('✅ Track rendered:', track.title);
                } catch (trackError) {
                    console.warn('❌ Error rendering track:', track?.title, trackError);
                }
            });

            console.log('✅ All tracks rendered successfully');
        } catch (error) {
            console.error('❌ Error in renderTracks:', error);
        }
    }

    renderAlbums() {
        const albumsContainer = document.getElementById('albums-container');
        console.log('🎵 Rendering albums, container found:', !!albumsContainer);
        if (!albumsContainer) {
            console.warn('❌ albums-container element not found');
            return;
        }

        console.log('🎵 Music data albums:', this.musicData?.albums?.length || 0);
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
        trackDiv.className = 'music-card track-card clickable-card';
        trackDiv.innerHTML = `
            <div class="music-artwork">
                <img src="${track.artwork}" alt="${track.title}" loading="lazy">
                <div class="play-overlay">
                    <button class="card-play-btn" onclick="window.musicLoader.playTrack('${track.links.youtube}')">
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

        // Track kartına tıklanınca otomatik olarak seçsin ve üste gelsin
        trackDiv.addEventListener('click', (e) => {
            // Platform linklerine tıklanırsa track'i seçme
            if (e.target.closest('.card-platform-link')) {
                return;
            }

            // Track'i ana player'da seç
            this.selectTrack(track);
        });

        return trackDiv;
    }

    createAlbumElement(album) {
        const albumDiv = document.createElement('div');
        albumDiv.className = 'music-card album-card clickable-card';
        albumDiv.innerHTML = `
            <div class="music-artwork">
                <img src="${album.artwork}" alt="${album.title}" loading="lazy">
                <div class="play-overlay">
                    <button class="card-play-btn" onclick="window.musicLoader.playAlbum('${album.links.youtube}')">
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

        // Album kartına tıklanınca otomatik olarak seçsin ve üste gelsin
        albumDiv.addEventListener('click', (e) => {
            // Platform linklerine tıklanırsa albümü seçme
            if (e.target.closest('.card-platform-link')) {
                return;
            }

            // Albümü seçmek yerine album'ün ilk track'ini seç
            this.selectAlbumAsTrack(album);
        });

        return albumDiv;
    }

    playTrack(youtubeUrl) {
        console.log('🎵 Playing track:', youtubeUrl);

        // Mevcut track'i bul
        const track = this.musicData.tracks.find(t => t.links.youtube === youtubeUrl);

        if (track) {
            console.log('🎵 Track found:', track.title);

            // Player UI'sini güncelle - track bilgileri ile
            this.updateMainPlayerUI(track);

            // Ana player'a track bilgisini gönder
            if (window.youtubePlayer) {
                // Track bilgilerini player'a set et
                window.youtubePlayer.currentTrack = track;
                console.log('🎵 Setting current track to YouTube player:', track.title);

                // Video ID'sini çıkar ve oynat
                const videoId = this.extractVideoId(youtubeUrl);
                if (videoId) {
                    window.youtubePlayer.loadVideo(videoId);
                    console.log('🎵 Loading video ID:', videoId);

                    // Scroll to player
                    const musicSection = document.getElementById('music');
                    if (musicSection) {
                        musicSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                } else {
                    console.warn('❌ Could not extract video ID from:', youtubeUrl);
                    window.open(youtubeUrl, '_blank');
                }
            } else {
                console.warn('⏳ YouTube player not ready yet, retrying...');

                // Retry with exponential backoff
                let retryCount = 0;
                const maxRetries = 10;

                const retryPlayTrack = () => {
                    if (window.youtubePlayer) {
                        console.log('✅ YouTube player ready, playing track');
                        this.playTrack(youtubeUrl);
                    } else if (retryCount < maxRetries) {
                        retryCount++;
                        const delay = Math.min(1000 * Math.pow(2, retryCount), 5000); // Max 5 second delay
                        console.log(`⏳ Retry ${retryCount}/${maxRetries} in ${delay}ms`);
                        setTimeout(retryPlayTrack, delay);
                    } else {
                        console.error('❌ YouTube player failed to initialize after', maxRetries, 'attempts');
                        // Fallback to opening in new window
                        window.open(youtubeUrl, '_blank');
                    }
                };

                setTimeout(retryPlayTrack, 1000);
            }
        } else {
            console.error('❌ Track not found for URL:', youtubeUrl);
            window.open(youtubeUrl, '_blank');
        }
    }

    updateMainPlayerUI(track) {
        console.log('🎨 Updating main player UI with track:', track.title);

        // Modern player elements - these are the actual IDs in HTML
        const trackTitleEl = document.querySelector('.modern-track-title');
        const trackArtistEl = document.querySelector('.modern-track-artist');
        const artworkEl = document.querySelector('.artwork-image');

        // Update title
        if (trackTitleEl) {
            trackTitleEl.textContent = track.title;
            console.log('✅ Updated title element');
        } else {
            console.warn('❌ Title element not found');
        }

        // Update artist
        if (trackArtistEl) {
            trackArtistEl.textContent = track.artist;
            console.log('✅ Updated artist element');
        } else {
            console.warn('❌ Artist element not found');
        }

        // Update artwork
        if (artworkEl) {
            artworkEl.src = track.artwork;
            artworkEl.alt = track.title;
            console.log('✅ Updated artwork element');
        } else {
            console.warn('❌ Artwork element not found');
        }

        // Update platform links
        this.updateMainPlayerPlatformLinks(track.links);

        // Update genre and duration if elements exist
        const genreEl = document.querySelector('.track-genre');
        const durationEl = document.querySelector('.track-duration');

        if (genreEl) genreEl.textContent = 'SINGLE';
        if (durationEl) durationEl.textContent = '3:45';

        console.log('🎨 Main player UI updated successfully');
    }

    updateMainPlayerPlatformLinks(links) {
        // Platform link'leri güncelle
        const spotifyLink = document.querySelector('.platform-links .spotify-link');
        const youtubeLink = document.querySelector('.platform-links .youtube-link');
        const appleLink = document.querySelector('.platform-links .apple-link');

        if (spotifyLink && links.spotify) {
            spotifyLink.href = links.spotify;
            spotifyLink.style.opacity = '1';
            spotifyLink.style.pointerEvents = 'auto';
        }

        if (youtubeLink && links.youtube) {
            youtubeLink.href = links.youtube;
            youtubeLink.style.opacity = '1';
            youtubeLink.style.pointerEvents = 'auto';
        }

        if (appleLink && links.apple) {
            appleLink.href = links.apple;
            appleLink.style.opacity = '1';
            appleLink.style.pointerEvents = 'auto';
        }

        console.log('🔗 Platform links updated');
    }

    playAlbum(youtubeUrl) {
        // Album play functionality - same as track for now
        this.playTrack(youtubeUrl);
    }

    // Track seçme fonksiyonu - kartlara tıklanınca çalışır
    selectTrack(track) {
        console.log('🎵 Track selected from card:', track.title);

        // Ana player UI'sini güncelle
        this.updateMainPlayerUI(track);

        // Ana player'a scroll yap
        const musicSection = document.getElementById('music');
        if (musicSection) {
            musicSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Seçilen kartı highlight et
        this.highlightSelectedCard(track.id, 'track');

        console.log('✅ Track selected and UI updated');
    }

    // Album'ü track gibi seçme fonksiyonu
    selectAlbumAsTrack(album) {
        console.log('🎵 Album selected as track:', album.title);

        // Album'ü track formatına çevir
        const albumAsTrack = {
            title: album.title,
            artist: album.artist,
            artwork: album.artwork,
            links: album.links,
            id: album.id
        };

        // Ana player UI'sini güncelle
        this.updateMainPlayerUI(albumAsTrack);

        // Ana player'a scroll yap
        const musicSection = document.getElementById('music');
        if (musicSection) {
            musicSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Seçilen kartı highlight et
        this.highlightSelectedCard(album.id, 'album');

        console.log('✅ Album selected as track and UI updated');
    }

    // Seçilen kartı highlight etme fonksiyonu
    highlightSelectedCard(itemId, type) {
        // Önce tüm kartlardan seçim işaretini kaldır
        document.querySelectorAll('.music-card').forEach(card => {
            card.classList.remove('selected-card');
        });

        // Seçilen kartı highlight et
        const cardSelector = type === 'track' ? '.track-card' : '.album-card';
        document.querySelectorAll(cardSelector).forEach(card => {
            const titleElement = card.querySelector('.music-card-title');
            if (titleElement) {
                // ID yerine title ile eşleştir (daha güvenilir)
                const cardTitle = titleElement.textContent.trim();
                const itemTitle = type === 'track'
                    ? this.musicData.tracks.find(t => t.id === itemId)?.title
                    : this.musicData.albums.find(a => a.id === itemId)?.title;

                if (cardTitle === itemTitle) {
                    card.classList.add('selected-card');
                }
            }
        });
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
window.musicLoader = null;

function initializeMusicLoader() {
    try {
        console.log('🎵 Attempting to initialize music loader...');
        window.musicLoader = new MusicLoader();
        console.log('✅ Music loader initialized globally:', window.musicLoader);
    } catch (error) {
        console.warn('❌ Music loader initialization failed:', error.message);

        // Create hardcoded fallback music loader that doesn't use localStorage
        window.musicLoader = createFallbackMusicLoader();

        // Render fallback data immediately
        setTimeout(() => {
            if (window.musicLoader && window.musicLoader.renderTracks) {
                window.musicLoader.renderTracks();
                window.musicLoader.renderAlbums();
                console.log('🎵 Fallback music data rendered');
            }
        }, 100);

        // Retry after delay only if it's not a localStorage security error
        if (!error.message.includes('localStorage') && !error.message.includes('SecurityError')) {
            setTimeout(() => {
                console.log('🔄 Retrying music loader initialization...');
                try {
                    window.musicLoader = new MusicLoader();
                    console.log('✅ Music loader retry successful');
                } catch (retryError) {
                    console.warn('❌ Music loader retry failed:', retryError.message);
                }
            }, 2000);
        }
    }
}

function createFallbackMusicLoader() {
    console.log('🔄 Creating fallback music loader with hardcoded data');

    const hardcodedData = {
        "tracks": [
            {
                "id": 1,
                "title": "LIAR",
                "artist": "Hasan Arthur Altuntaş",
                "artwork": "assets/images/logo-main.png",
                "links": {
                    "youtube": "https://www.youtube.com/watch?v=u3malJJSGds&list=OLAK5uy_le5DM9PMUqTnB4_whDwAxc-rMD54mVctQ",
                    "spotify": "https://open.spotify.com/intl-tr/track/2VhpoqJKPMTz2cHYcaAX2j?si=184e6e2589f3423b",
                    "apple": "https://music.apple.com/tr/song/liar/1833771404"
                }
            },
            {
                "id": 3,
                "title": "Interstellar But My Version",
                "artist": "Hasan Arthur Altuntaş",
                "artwork": "assets/images/logo-main.png",
                "links": {
                    "youtube": "https://www.youtube.com/watch?v=4vDvuFldYiM&list=OLAK5uy_lassw25Z8Ch3EqP-H9jC6gjGeMbe4PCGs",
                    "spotify": "https://open.spotify.com/intl-tr/track/5fwzfwMJtVANQotGtmdv3C?si=ebc8d8228c644263",
                    "apple": "https://music.apple.com/tr/song/interstellar-but-my-version/1773902252"
                }
            },
            {
                "id": 4,
                "title": "Oppenheimer But My Version",
                "artist": "Hasan Arthur Altuntaş",
                "artwork": "assets/images/logo-main.png",
                "links": {
                    "youtube": "https://youtu.be/ZnOMJ9E0LmA?si=p9FkzGERc_zh6RuR",
                    "spotify": "https://open.spotify.com/intl-tr/track/27q14aJw81Qr5XBGV4JlNp?si=e5aa51c4051d45ba",
                    "apple": "https://music.apple.com/tr/song/oppenheimer-but-my-version/1776487184"
                }
            }
        ],
        "albums": [
            {
                "id": 1,
                "title": "My Compositions",
                "artist": "Hasan Arthur Altuntaş",
                "artwork": "assets/images/logo-main.png",
                "release_date": "2024",
                "links": {
                    "youtube": "https://www.youtube.com/watch?v=F0XzcRB1a94&list=PLuQhIRvxCsFxFF8wW3UWcSbXA0b6fGWim"
                }
            },
            {
                "id": 2,
                "title": "Film Composition Covers",
                "artist": "Hasan Arthur Altuntaş",
                "artwork": "assets/images/logo-main.png",
                "release_date": "2024",
                "links": {
                    "youtube": "https://www.youtube.com/watch?v=RormIa0YaJI&list=PLuQhIRvxCsFxyR4zeWWhVheUeUHJY5MLq"
                }
            }
        ]
    };

    return {
        musicData: hardcodedData,
        currentLanguage: 'tr',
        loadMusicData: () => {
            console.log('🔄 Fallback loadMusicData called');
            return Promise.resolve();
        },
        renderTracks: () => {
            console.log('🔄 Fallback renderTracks called');
            const tracksContainer = document.getElementById('tracks-container');
            if (tracksContainer) {
                tracksContainer.innerHTML = '';
                hardcodedData.tracks.forEach(track => {
                    const trackElement = createFallbackTrackElement(track);
                    tracksContainer.appendChild(trackElement);
                });
                console.log('✅ Fallback tracks rendered');
            }
        },
        renderAlbums: () => {
            console.log('🔄 Fallback renderAlbums called');
            const albumsContainer = document.getElementById('albums-container');
            if (albumsContainer) {
                albumsContainer.innerHTML = '';
                hardcodedData.albums.forEach(album => {
                    const albumElement = createFallbackAlbumElement(album);
                    albumsContainer.appendChild(albumElement);
                });
                console.log('✅ Fallback albums rendered');
            }
        },
        updateLanguage: () => {
            console.log('🔄 Fallback updateLanguage called');
        },
        selectTrack: () => {
            console.log('🔄 Fallback selectTrack called');
        },
        selectAlbumAsTrack: () => {
            console.log('🔄 Fallback selectAlbumAsTrack called');
        }
    };
}

function createFallbackTrackElement(track) {
    const trackDiv = document.createElement('div');
    trackDiv.className = 'music-card track-card clickable-card';
    trackDiv.innerHTML = `
        <div class="music-artwork">
            <img src="${track.artwork}" alt="${track.title}" loading="lazy">
            <div class="play-overlay">
                <button class="card-play-btn" onclick="window.open('${track.links.youtube}', '_blank')">
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

function createFallbackAlbumElement(album) {
    const albumDiv = document.createElement('div');
    albumDiv.className = 'music-card album-card clickable-card';
    albumDiv.innerHTML = `
        <div class="music-artwork">
            <img src="${album.artwork}" alt="${album.title}" loading="lazy">
            <div class="play-overlay">
                <button class="card-play-btn" onclick="window.open('${album.links.youtube}', '_blank')">
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

// Multiple initialization attempts for better reliability
document.addEventListener('DOMContentLoaded', initializeMusicLoader);

// Backup initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMusicLoader);
} else {
    // DOM already loaded
    setTimeout(initializeMusicLoader, 100);
}

// Final fallback for slow connections
setTimeout(() => {
    if (!window.musicLoader || !window.musicLoader.musicData) {
        console.log('🔄 Final fallback music loader initialization...');
        initializeMusicLoader();
    } else {
        // Force render if music loader exists but tracks not visible
        const tracksContainer = document.getElementById('tracks-container');
        const albumsContainer = document.getElementById('albums-container');

        if (tracksContainer && tracksContainer.children.length === 0) {
            console.log('🔄 Force rendering tracks - container empty');
            if (window.musicLoader.renderTracks) {
                window.musicLoader.renderTracks();
            }
        }

        if (albumsContainer && albumsContainer.children.length === 0) {
            console.log('🔄 Force rendering albums - container empty');
            if (window.musicLoader.renderAlbums) {
                window.musicLoader.renderAlbums();
            }
        }
    }
}, 3000);

// Additional failsafe for live site - multiple checks
setTimeout(() => {
    console.log('🔄 First failsafe check (1s)...');
    const tracksContainer = document.getElementById('tracks-container');
    if (tracksContainer && tracksContainer.children.length === 0) {
        console.log('⚠️ No tracks found, forcing hardcoded render');
        forceRenderHardcodedMusic();
    }
}, 1000);

setTimeout(() => {
    console.log('🔄 Second failsafe check (3s)...');
    const tracksContainer = document.getElementById('tracks-container');
    if (tracksContainer && tracksContainer.children.length === 0) {
        console.log('⚠️ No tracks found, forcing hardcoded render');
        forceRenderHardcodedMusic();
    }
}, 3000);

setTimeout(() => {
    console.log('🔄 Final failsafe check (5s)...');
    const tracksContainer = document.getElementById('tracks-container');
    if (tracksContainer && tracksContainer.children.length === 0) {
        console.log('⚠️ No tracks found, forcing hardcoded render');
        forceRenderHardcodedMusic();
    }
}, 5000);

// Also check on window load
window.addEventListener('load', () => {
    setTimeout(() => {
        console.log('🔄 Window load check...');
        const tracksContainer = document.getElementById('tracks-container');
        if (tracksContainer && tracksContainer.children.length === 0) {
            console.log('⚠️ No tracks found after window load, forcing hardcoded render');
            forceRenderHardcodedMusic();
        }
    }, 500);
});

function forceRenderHardcodedMusic() {
    const tracksContainer = document.getElementById('tracks-container');
    const albumsContainer = document.getElementById('albums-container');

    if (tracksContainer) {
        tracksContainer.innerHTML = `
            <div class="music-card track-card">
                <div class="music-artwork">
                    <img src="assets/images/logo-main.png" alt="LIAR" loading="lazy">
                    <div class="play-overlay">
                        <button class="card-play-btn" onclick="window.open('https://www.youtube.com/watch?v=u3malJJSGds', '_blank')">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <div class="music-card-content">
                    <div class="music-card-header">
                        <h3 class="music-card-title">LIAR</h3>
                        <p class="music-card-artist">Hasan Arthur Altuntaş</p>
                    </div>
                    <div class="music-card-info">
                        <span class="music-card-genre">Single</span>
                        <span class="music-card-date">2024</span>
                    </div>
                    <div class="music-card-platforms">
                        <a href="https://www.youtube.com/watch?v=u3malJJSGds" class="card-platform-link youtube" target="_blank" rel="noopener"><i class="fab fa-youtube"></i></a>
                        <a href="https://open.spotify.com/track/2VhpoqJKPMTz2cHYcaAX2j" class="card-platform-link spotify" target="_blank" rel="noopener"><i class="fab fa-spotify"></i></a>
                        <a href="https://music.apple.com/song/liar/1833771404" class="card-platform-link apple" target="_blank" rel="noopener"><i class="fab fa-apple"></i></a>
                    </div>
                </div>
            </div>
            <div class="music-card track-card">
                <div class="music-artwork">
                    <img src="assets/images/logo-main.png" alt="Interstellar But My Version" loading="lazy">
                    <div class="play-overlay">
                        <button class="card-play-btn" onclick="window.open('https://www.youtube.com/watch?v=4vDvuFldYiM', '_blank')">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <div class="music-card-content">
                    <div class="music-card-header">
                        <h3 class="music-card-title">Interstellar But My Version</h3>
                        <p class="music-card-artist">Hasan Arthur Altuntaş</p>
                    </div>
                    <div class="music-card-info">
                        <span class="music-card-genre">Single</span>
                        <span class="music-card-date">2024</span>
                    </div>
                    <div class="music-card-platforms">
                        <a href="https://www.youtube.com/watch?v=4vDvuFldYiM" class="card-platform-link youtube" target="_blank" rel="noopener"><i class="fab fa-youtube"></i></a>
                        <a href="https://open.spotify.com/track/5fwzfwMJtVANQotGtmdv3C" class="card-platform-link spotify" target="_blank" rel="noopener"><i class="fab fa-spotify"></i></a>
                        <a href="https://music.apple.com/song/interstellar-but-my-version/1773902252" class="card-platform-link apple" target="_blank" rel="noopener"><i class="fab fa-apple"></i></a>
                    </div>
                </div>
            </div>
            <div class="music-card track-card">
                <div class="music-artwork">
                    <img src="assets/images/logo-main.png" alt="Oppenheimer But My Version" loading="lazy">
                    <div class="play-overlay">
                        <button class="card-play-btn" onclick="window.open('https://youtu.be/ZnOMJ9E0LmA', '_blank')">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <div class="music-card-content">
                    <div class="music-card-header">
                        <h3 class="music-card-title">Oppenheimer But My Version</h3>
                        <p class="music-card-artist">Hasan Arthur Altuntaş</p>
                    </div>
                    <div class="music-card-info">
                        <span class="music-card-genre">Single</span>
                        <span class="music-card-date">2024</span>
                    </div>
                    <div class="music-card-platforms">
                        <a href="https://youtu.be/ZnOMJ9E0LmA" class="card-platform-link youtube" target="_blank" rel="noopener"><i class="fab fa-youtube"></i></a>
                        <a href="https://open.spotify.com/track/27q14aJw81Qr5XBGV4JlNp" class="card-platform-link spotify" target="_blank" rel="noopener"><i class="fab fa-spotify"></i></a>
                        <a href="https://music.apple.com/song/oppenheimer-but-my-version/1776487184" class="card-platform-link apple" target="_blank" rel="noopener"><i class="fab fa-apple"></i></a>
                    </div>
                </div>
            </div>
        `;
        console.log('✅ Hardcoded tracks rendered');
    }

    if (albumsContainer) {
        albumsContainer.innerHTML = `
            <div class="music-card album-card">
                <div class="music-artwork">
                    <img src="assets/images/logo-main.png" alt="My Compositions" loading="lazy">
                    <div class="play-overlay">
                        <button class="card-play-btn" onclick="window.open('https://www.youtube.com/playlist?list=PLuQhIRvxCsFxFF8wW3UWcSbXA0b6fGWim', '_blank')">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <div class="music-card-content">
                    <div class="music-card-header">
                        <h3 class="music-card-title">My Compositions</h3>
                        <p class="music-card-artist">Hasan Arthur Altuntaş</p>
                    </div>
                    <div class="music-card-info">
                        <span class="music-card-genre">Album</span>
                        <span class="music-card-date">2024</span>
                    </div>
                    <div class="music-card-platforms">
                        <a href="https://www.youtube.com/playlist?list=PLuQhIRvxCsFxFF8wW3UWcSbXA0b6fGWim" class="card-platform-link youtube" target="_blank" rel="noopener"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>
            <div class="music-card album-card">
                <div class="music-artwork">
                    <img src="assets/images/logo-main.png" alt="Film Composition Covers" loading="lazy">
                    <div class="play-overlay">
                        <button class="card-play-btn" onclick="window.open('https://www.youtube.com/playlist?list=PLuQhIRvxCsFxyR4zeWWhVheUeUHJY5MLq', '_blank')">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <div class="music-card-content">
                    <div class="music-card-header">
                        <h3 class="music-card-title">Film Composition Covers</h3>
                        <p class="music-card-artist">Hasan Arthur Altuntaş</p>
                    </div>
                    <div class="music-card-info">
                        <span class="music-card-genre">Album</span>
                        <span class="music-card-date">2024</span>
                    </div>
                    <div class="music-card-platforms">
                        <a href="https://www.youtube.com/playlist?list=PLuQhIRvxCsFxyR4zeWWhVheUeUHJY5MLq" class="card-platform-link youtube" target="_blank" rel="noopener"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>
        `;
        console.log('✅ Hardcoded albums rendered');
    }
}

// Listen for language changes
document.addEventListener('languageChanged', (e) => {
    if (musicLoader) {
        musicLoader.updateLanguage(e.detail.language);
    }
});