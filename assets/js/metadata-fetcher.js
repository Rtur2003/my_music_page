// ===============================================
// METADATA FETCHER - PLATFORM INTEGRATION
// ===============================================

class MetadataFetcher {
    constructor() {
        this.apiKeys = {
            // Note: Bu API anahtarları production'da environment variables olarak saklanmalı
            lastfm: '8c921cb76b1c74a86ae5c9b0d7e5b9ae', // Örnek key
            musixmatch: 'example_key'
        };
        
        this.platforms = {
            spotify: {
                urlPattern: /spotify\.com\/(intl-)?[a-z]{2}\/track\/([a-zA-Z0-9]+)/,
                embedBase: 'https://open.spotify.com/embed/track/'
            },
            youtube: {
                urlPattern: /(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
                embedBase: 'https://www.youtube.com/embed/'
            },
            apple: {
                urlPattern: /music\.apple\.com\/[a-z]{2}\/album\/[^\/]+\/([0-9]+)/,
                embedBase: 'https://embed.music.apple.com/album/'
            },
            soundcloud: {
                urlPattern: /soundcloud\.com\/[^\/]+\/[^\/]+/,
                embedBase: 'https://w.soundcloud.com/player/?url='
            }
        };
    }

    // Ana metadata çekme fonksiyonu
    async fetchTrackMetadata(urls) {
        const results = {
            title: '',
            artist: 'Hasan Arthur Altuntaş',
            album: '',
            duration: '',
            artwork: 'assets/images/logo-main.png',
            platforms: {},
            metadata: {}
        };

        // URL'leri platform bazında ayır
        const platformUrls = this.categorizeUrls(urls);
        
        // Her platform için metadata çek
        for (const [platform, url] of Object.entries(platformUrls)) {
            if (url) {
                try {
                    const metadata = await this.fetchFromPlatform(platform, url);
                    results.platforms[platform] = url;
                    
                    // İlk gelen metadata'yı kullan
                    if (!results.title && metadata.title) {
                        results.title = metadata.title;
                    }
                    if (!results.album && metadata.album) {
                        results.album = metadata.album;
                    }
                    if (!results.duration && metadata.duration) {
                        results.duration = metadata.duration;
                    }
                    if (metadata.artwork && metadata.artwork !== 'assets/images/logo-main.png') {
                        results.artwork = metadata.artwork;
                    }
                    
                    results.metadata[platform] = metadata;
                } catch (error) {
                    console.warn(`${platform} metadata fetch failed:`, error);
                    results.platforms[platform] = url; // URL'yi yine de sakla
                }
            }
        }

        // Eğer hiç title bulunamadıysa, URL'den tahmin et
        if (!results.title) {
            results.title = this.guessTitle(platformUrls);
        }

        return results;
    }

    // URL'leri platform bazında kategorize et
    categorizeUrls(urls) {
        const result = {};
        
        urls.forEach(url => {
            if (!url) return;
            
            for (const [platform, config] of Object.entries(this.platforms)) {
                if (config.urlPattern.test(url)) {
                    result[platform] = url;
                    break;
                }
            }
        });
        
        return result;
    }

    // Platform bazında metadata çek
    async fetchFromPlatform(platform, url) {
        switch (platform) {
            case 'spotify':
                return await this.fetchSpotifyMetadata(url);
            case 'youtube':
                return await this.fetchYouTubeMetadata(url);
            case 'apple':
                return await this.fetchAppleMusicMetadata(url);
            case 'soundcloud':
                return await this.fetchSoundCloudMetadata(url);
            default:
                return {};
        }
    }

    // Spotify metadata çekme
    async fetchSpotifyMetadata(url) {
        try {
            // Spotify URL'den track ID'yi çıkar
            const match = url.match(this.platforms.spotify.urlPattern);
            if (!match) throw new Error('Invalid Spotify URL');
            
            const trackId = match[2];
            
            // Spotify Web API kullanılabilir ama token gerekir
            // Şimdilik URL parsing ile temel bilgi çıkarma
            return {
                title: this.extractTitleFromUrl(url),
                artist: 'Hasan Arthur Altuntaş',
                platform: 'spotify',
                trackId: trackId,
                embedUrl: `${this.platforms.spotify.embedBase}${trackId}`
            };
        } catch (error) {
            console.warn('Spotify metadata fetch failed:', error);
            return {};
        }
    }

    // YouTube metadata çekme
    async fetchYouTubeMetadata(url) {
        try {
            const match = url.match(this.platforms.youtube.urlPattern);
            if (!match) throw new Error('Invalid YouTube URL');
            
            const videoId = match[2];
            
            // YouTube Data API v3 kullanılabilir
            // Şimdilik temel parsing
            return {
                title: this.extractTitleFromUrl(url),
                artist: 'Hasan Arthur Altuntaş',
                platform: 'youtube',
                videoId: videoId,
                embedUrl: `${this.platforms.youtube.embedBase}${videoId}`,
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            };
        } catch (error) {
            console.warn('YouTube metadata fetch failed:', error);
            return {};
        }
    }

    // Apple Music metadata çekme
    async fetchAppleMusicMetadata(url) {
        try {
            const match = url.match(this.platforms.apple.urlPattern);
            if (!match) throw new Error('Invalid Apple Music URL');
            
            const albumId = match[1];
            
            return {
                title: this.extractTitleFromUrl(url),
                artist: 'Hasan Arthur Altuntaş',
                platform: 'apple',
                albumId: albumId
            };
        } catch (error) {
            console.warn('Apple Music metadata fetch failed:', error);
            return {};
        }
    }

    // SoundCloud metadata çekme
    async fetchSoundCloudMetadata(url) {
        try {
            // SoundCloud API kullanılabilir
            return {
                title: this.extractTitleFromUrl(url),
                artist: 'Hasan Arthur Altuntaş',
                platform: 'soundcloud',
                embedUrl: `${this.platforms.soundcloud.embedBase}${encodeURIComponent(url)}`
            };
        } catch (error) {
            console.warn('SoundCloud metadata fetch failed:', error);
            return {};
        }
    }

    // URL'den başlık tahmin etme
    extractTitleFromUrl(url) {
        try {
            // URL path'den başlık çıkarmaya çalış
            const path = new URL(url).pathname;
            const segments = path.split('/').filter(s => s);
            
            // Son segment'i al ve temizle
            let title = segments[segments.length - 1] || segments[segments.length - 2] || '';
            
            // URL encoding'i temizle
            title = decodeURIComponent(title);
            
            // Özel karakterleri temizle
            title = title.replace(/[-_]/g, ' ');
            title = title.replace(/\.(mp3|mp4|wav|flac)$/i, '');
            
            // Kelime başlarını büyük yap
            title = title.replace(/\b\w/g, l => l.toUpperCase());
            
            return title || 'Untitled Track';
        } catch (error) {
            return 'Untitled Track';
        }
    }

    // URL'lerden başlık tahmin etme
    guessTitle(platformUrls) {
        const urls = Object.values(platformUrls).filter(Boolean);
        if (urls.length === 0) return 'New Track';
        
        return this.extractTitleFromUrl(urls[0]);
    }

    // Format duration from seconds
    formatDuration(seconds) {
        if (!seconds) return '';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Validate URLs
    validateUrls(urls) {
        const errors = [];
        const validUrls = [];
        
        urls.forEach((url, index) => {
            if (!url) return;
            
            try {
                new URL(url);
                const isValid = Object.values(this.platforms).some(platform => 
                    platform.urlPattern.test(url)
                );
                
                if (isValid) {
                    validUrls.push(url);
                } else {
                    errors.push(`URL ${index + 1}: Unsupported platform`);
                }
            } catch (error) {
                errors.push(`URL ${index + 1}: Invalid URL format`);
            }
        });
        
        return { validUrls, errors };
    }

    // Get platform icon
    getPlatformIcon(platform) {
        const icons = {
            spotify: 'fab fa-spotify',
            youtube: 'fab fa-youtube',
            apple: 'fab fa-apple',
            soundcloud: 'fab fa-soundcloud'
        };
        return icons[platform] || 'fas fa-music';
    }

    // Get platform color
    getPlatformColor(platform) {
        const colors = {
            spotify: '#1db954',
            youtube: '#ff0000',
            apple: '#000000',
            soundcloud: '#ff7700'
        };
        return colors[platform] || '#d4b078';
    }
}

// Export for use in other modules
window.MetadataFetcher = MetadataFetcher;
export default MetadataFetcher;