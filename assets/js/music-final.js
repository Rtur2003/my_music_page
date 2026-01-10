// Final Clean Music System - YouTube MP3 & Modal Video
class MusicSystem {
    constructor() {
        this.defaultArtwork = 'assets/images/logo-main.png';
        this.catalogUrl = 'assets/data/music-links.json';
        this.configUrl = 'config/site.json';
        this.catalogCacheKey = 'musicCatalogCache';
        this.catalogCacheTtlMs = 6 * 60 * 60 * 1000;
        this.catalogFunctionUrl = '/.netlify/functions/music-catalog';
        this.maxRemoteTracks = 12;
        this.youtubeApiInjected = false;
        this.pendingCatalog = null;

        this.defaultTracks = [
            {
                id: 1,
                title: 'LIAR',
                artist: 'Hasan Arthur Altuntaş',
                duration: '2:57',
                artwork: 'assets/images/logo-main.png',
                youtube: 'https://www.youtube.com/watch?v=u3malJJSGds',
                spotify: 'https://open.spotify.com/intl-tr/track/2VhpoqJKPMTz2cHYcaAX2j',
                apple: 'https://music.apple.com/tr/song/liar/1833771404'
            },
            {
                id: 2,
                title: 'Interstellar But My Version',
                artist: 'Hasan Arthur Altuntaş',
                duration: '2:32',
                artwork: 'assets/images/logo-main.png',
                youtube: 'https://www.youtube.com/watch?v=4vDvuFldYiM',
                spotify: 'https://open.spotify.com/intl-tr/track/5fwzfwMJtVANQotGtmdv3C',
                apple: 'https://music.apple.com/tr/song/interstellar-but-my-version/1773902252'
            },
            {
                id: 3,
                title: 'Oppenheimer But My Version',
                artist: 'Hasan Arthur Altuntaş',
                duration: '2:44',
                artwork: 'assets/images/logo-main.png',
                youtube: 'https://youtu.be/ZnOMJ9E0LmA',
                spotify: 'https://open.spotify.com/intl-tr/track/27q14aJw81Qr5XBGV4JlNp',
                apple: 'https://music.apple.com/tr/song/oppenheimer-but-my-version/1776487184'
            },
            {
                id: 5,
                title: 'Alicia But My Version',
                artist: 'Hasan Arthur Altuntaş',
                duration: '1:57',
                artwork: 'assets/images/logo-main.png',
                youtube: 'https://youtu.be/x8lcJsuDR8A',
                spotify: 'https://open.spotify.com/intl-tr/track/4vLu7LEv9KE5wPp4h1ldc8?si=c0491e04580140eb',
                apple: 'https://music.apple.com/tr/song/alicia-version3/1841276639'
            },
            {
                id: 6,
                title: 'Clair Obscur  Expedition 33  But My Version',
                artist: 'Hasan Arthur Altuntaş',
                duration: '2:44',
                artwork: 'assets/images/logo-main.png',
                youtube: 'https://youtu.be/AINP-Y82LsA',
                spotify: 'https://open.spotify.com/intl-tr/track/3uYE4LHqPv3vA7MzLW99ij?si=800c32542d254e7e',
                apple: 'https://music.apple.com/tr/song/lumiere-and-alicia-piano/1841276636'
            },
            {
                id: 7,
                title: 'Une Vie à Peindre - Clair Obscur Expedition 33(Cover)',
                artist: 'Hasan Arthur Altuntaş',
                duration: '1:32',
                artwork: 'assets/images/logo-main.png',
                youtube: 'https://www.youtube.com/watch?v=gCuVMsRgqWI&list=OLAK5uy_m7d_zBzSRcJtMt1Xw7yzZtKbNfJ4Zmb5U',
                spotify: 'https://open.spotify.com/intl-tr/track/5dT1GEBSXVVPtxxqtaWzLn?si=54db5d2fa0704893',
                apple: 'https://music.apple.com/tr/song/une-vie-%C3%A0-peindre-clair-obscur-expedition-33-cover/1848749673'
            },
            {
                id: 8,
                title: 'Feel, S Z I, Run, Shakra, TODASI, Yassaite',
                artist: 'Hasan Arthur Altuntaş',
                duration: '11:51',
                artwork: 'assets/images/logo-main.png',
                youtube: 'https://www.youtube.com/watch?v=vQGDk2ItC2o',
                spotify: '',
                apple: ''
            }
        ];
        this.defaultArtist = this.defaultTracks[0]?.artist || 'Hasan Arthur Altuntas';

        this.defaultAlbums = [
            {
                id: 1,
                title: 'My Compositions',
                artist: 'Hasan Arthur Altuntaş',
                artwork: 'assets/images/logo-main.png',
                youtube: 'https://www.youtube.com/playlist?list=PLuQhIRvxCsFxFF8wW3UWcSbXA0b6fGWim'
            },
            {
                id: 2,
                title: 'Film Composition Covers',
                artist: 'Hasan Arthur Altuntaş',
                artwork: 'assets/images/logo-main.png',
                youtube: 'https://www.youtube.com/playlist?list=PLuQhIRvxCsFxyR4zeWWhVheUeUHJY5MLq'
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
        if (window.YT || this.youtubeApiInjected) {
            if (window.YT) {
                console.log('YouTube API already loaded');
            }
            return;
        }

        this.youtubeApiInjected = true;
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.onerror = () => {
            this.youtubeApiInjected = false;
            console.warn('YouTube API failed to load');
        };
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    deferCatalogLoad() {
        const startLoad = () => this.loadCatalog();

        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => startLoad(), { timeout: 1500 });
            return;
        }

        setTimeout(startLoad, 300);
    }

    async loadCatalog() {
        const config = await this.fetchSiteConfig();
        const channelId = this.getYouTubeChannelId(config);
        const spotifyArtistId = this.getSpotifyArtistId(config);
        const spotifyMarket = this.getSpotifyMarket(config);

        const cachedTracks = this.readCatalogCache(channelId);
        const localCatalog = await this.fetchLocalCatalog();
        const baseTracks = localCatalog?.tracks?.length ? localCatalog.tracks : this.tracks;
        const baseAlbums = localCatalog?.albums?.length ? localCatalog.albums : this.albums;

        if (localCatalog) {
            this.applyCatalog({
                tracks: baseTracks,
                albums: baseAlbums
            });
        }

        if (cachedTracks && cachedTracks.length) {
            const cachedList = this.normalizeTracks(cachedTracks);
            const mergedCached = this.buildTrackList(baseTracks, cachedList, []);
            this.applyCatalog({
                tracks: mergedCached,
                albums: baseAlbums
            });
        }

        const remoteCatalog = await this.fetchRemoteCatalog(channelId, spotifyArtistId, spotifyMarket);
        if (remoteCatalog) {
            const mergedTracks = this.buildTrackList(
                baseTracks,
                remoteCatalog.tracks || [],
                remoteCatalog.spotifyTracks || []
            );
            this.applyCatalog({
                tracks: mergedTracks,
                albums: baseAlbums
            });
        }
    }

    async fetchSiteConfig() {
        try {
            const response = await fetch(this.configUrl, { cache: 'force-cache' });
            if (!response.ok) {
                throw new Error('Config not found');
            }
            return await response.json();
        } catch (error) {
            console.warn('Site config unavailable:', error);
            return null;
        }
    }

    getYouTubeChannelId(config) {
        const explicitChannelId = config?.music?.youtubeChannelId;
        if (explicitChannelId) {
            return explicitChannelId;
        }

        const youtubeUrl = config?.social?.youtube || '';
        const match = youtubeUrl.match(/channel\/([a-zA-Z0-9_-]+)/);
        return match ? match[1] : '';
    }

    getSpotifyArtistId(config) {
        const explicitArtistId = config?.music?.spotifyArtistId;
        if (explicitArtistId) {
            return explicitArtistId;
        }

        const spotifyUrl = config?.social?.spotify || '';
        const match = spotifyUrl.match(/artist\/([a-zA-Z0-9]+)/);
        return match ? match[1] : '';
    }

    getSpotifyMarket(config) {
        const market = config?.music?.spotifyMarket;
        if (typeof market === 'string' && market.trim()) {
            return market.trim().toUpperCase();
        }

        return 'TR';
    }

    readCatalogCache(channelId) {
        if (!channelId) {
            return null;
        }

        try {
            const raw = localStorage.getItem(this.catalogCacheKey);
            if (!raw) {
                return null;
            }

            const cached = JSON.parse(raw);
            if (!cached || cached.channelId !== channelId) {
                return null;
            }

            if (Date.now() - cached.timestamp > this.catalogCacheTtlMs) {
                return null;
            }

            return Array.isArray(cached.tracks) ? cached.tracks : null;
        } catch {
            return null;
        }
    }

    writeCatalogCache(channelId, tracks) {
        if (!channelId || !Array.isArray(tracks)) {
            return;
        }

        try {
            const payload = {
                channelId: channelId,
                timestamp: Date.now(),
                tracks: tracks
            };
            localStorage.setItem(this.catalogCacheKey, JSON.stringify(payload));
        } catch {
            return;
        }
    }

    async fetchRemoteCatalog(channelId, spotifyArtistId, spotifyMarket) {
        const functionCatalog = await this.fetchFunctionCatalog(channelId, spotifyArtistId, spotifyMarket);
        if (functionCatalog) {
            if (functionCatalog.tracks?.length && channelId) {
                this.writeCatalogCache(channelId, functionCatalog.tracks);
            }
            return functionCatalog;
        }

        const youtubeCatalog = await this.fetchYouTubeCatalog(channelId);
        if (!youtubeCatalog) {
            return null;
        }

        return {
            tracks: youtubeCatalog.tracks,
            spotifyTracks: []
        };
    }

    async fetchFunctionCatalog(channelId, spotifyArtistId, spotifyMarket) {
        if (!channelId && !spotifyArtistId) {
            return null;
        }

        const params = new URLSearchParams();
        if (channelId) {
            params.set('channelId', channelId);
        }
        if (spotifyArtistId) {
            params.set('spotifyArtistId', spotifyArtistId);
        }
        if (spotifyMarket) {
            params.set('market', spotifyMarket);
        }
        params.set('max', String(this.maxRemoteTracks));

        const url = `${this.catalogFunctionUrl}?${params.toString()}`;

        try {
            const response = await fetch(url, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('Function catalog request failed');
            }

            const data = await response.json();
            const tracks = this.normalizeTracks(data.tracks || data.youtube?.tracks || []);
            const spotifyTracks = this.normalizeTracks(data.spotifyTracks || data.spotify?.tracks || []);

            if (!tracks.length && !spotifyTracks.length) {
                return null;
            }

            return {
                tracks: tracks,
                spotifyTracks: spotifyTracks
            };
        } catch (error) {
            console.warn('Function catalog unavailable, using fallback data:', error);
            return null;
        }
    }

    async fetchYouTubeCatalog(channelId) {
        if (!channelId) {
            return null;
        }

        const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

        try {
            const response = await fetch(feedUrl);
            if (!response.ok) {
                throw new Error('YouTube feed request failed');
            }

            const feedText = await response.text();
            const feedTracks = this.parseYouTubeFeed(feedText);
            if (!feedTracks.length) {
                return null;
            }

            this.writeCatalogCache(channelId, feedTracks);

            return {
                tracks: this.normalizeTracks(feedTracks)
            };
        } catch (error) {
            console.warn('YouTube feed error, using fallback data:', error);
            return null;
        }
    }

    parseYouTubeFeed(feedText) {
        if (!feedText) {
            return [];
        }

        const parser = new DOMParser();
        const xml = parser.parseFromString(feedText, 'text/xml');
        const entries = Array.from(xml.getElementsByTagName('entry'));

        if (!entries.length) {
            return [];
        }

        return entries.slice(0, this.maxRemoteTracks).map((entry, index) => {
            const titleNode = entry.getElementsByTagName('title')[0];
            const title = titleNode ? titleNode.textContent.trim() : 'Untitled';

            const authorNode = entry.getElementsByTagName('name')[0];
            const artist = authorNode ? authorNode.textContent.trim() : this.defaultArtist;

            const videoIdNode = entry.getElementsByTagName('yt:videoId')[0];
            const videoId = videoIdNode ? videoIdNode.textContent.trim() : '';

            let link = '';
            const linkNodes = entry.getElementsByTagName('link');
            for (let i = 0; i < linkNodes.length; i += 1) {
                const rel = linkNodes[i].getAttribute('rel');
                if (!rel || rel === 'alternate') {
                    link = linkNodes[i].getAttribute('href') || '';
                    if (link) {
                        break;
                    }
                }
            }

            const thumbNode = entry.getElementsByTagName('media:thumbnail')[0];
            const artwork = thumbNode ? thumbNode.getAttribute('url') : '';

            let durationSeconds = 0;
            const durationNode = entry.getElementsByTagName('yt:duration')[0];
            if (durationNode) {
                durationSeconds = parseInt(durationNode.getAttribute('seconds'), 10);
            }
            if (!durationSeconds) {
                const mediaContent = entry.getElementsByTagName('media:content')[0];
                if (mediaContent) {
                    durationSeconds = parseInt(mediaContent.getAttribute('duration'), 10);
                }
            }

            return {
                id: videoId || `yt-${index + 1}`,
                title: title,
                artist: artist,
                duration: durationSeconds ? this.formatDuration(durationSeconds) : '--:--',
                artwork: artwork,
                youtube: link || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : '')
            };
        });
    }

    async fetchLocalCatalog() {
        try {
            const response = await fetch(this.catalogUrl, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('Catalog not found');
            }

            const data = await response.json();
            const tracks = this.normalizeTracks(data.tracks || []);
            const albums = this.normalizeAlbums(data.albums || []);

            if (!tracks.length && !albums.length) {
                return null;
            }

            return {
                tracks: tracks,
                albums: albums
            };
        } catch (error) {
            console.warn('Local catalog unavailable, using fallback data:', error);
            return null;
        }
    }

    applyCatalog(catalog) {
        if (!catalog || !Array.isArray(catalog.tracks) || !catalog.tracks.length) {
            return;
        }

        if (this.isPlaying) {
            this.pendingCatalog = catalog;
            return;
        }

        this.tracks = catalog.tracks;
        if (Array.isArray(catalog.albums) && catalog.albums.length) {
            this.albums = catalog.albums;
        }

        this.currentTrack = null;
        this.youtubePlayers.clear();
        this.renderMusic();
    }

    applyPendingCatalogIfIdle() {
        if (!this.isPlaying && this.pendingCatalog) {
            const pending = this.pendingCatalog;
            this.pendingCatalog = null;
            this.applyCatalog(pending);
        }
    }

    normalizeTracks(rawTracks) {
        if (!Array.isArray(rawTracks)) {
            return [];
        }

        return rawTracks.map((track, index) => {
            const title = typeof track.title === 'string' && track.title.trim() ? track.title.trim() : 'Untitled';
            const artist = typeof track.artist === 'string' && track.artist.trim() ? track.artist.trim() : this.defaultArtist;
            let duration = '--:--';
            if (typeof track.duration === 'number' && Number.isFinite(track.duration)) {
                const seconds = track.duration > 1000 ? Math.round(track.duration / 1000) : Math.round(track.duration);
                duration = this.formatDuration(seconds);
            } else if (typeof track.duration === 'string' && track.duration.trim()) {
                duration = track.duration.trim();
            }
            const links = track.links || {};
            const youtube = this.safeUrl(track.youtube || links.youtube || '');
            const spotify = this.safeUrl(track.spotify || links.spotify || '');
            const apple = this.safeUrl(track.apple || links.apple || '');
            const artwork = this.resolveArtwork({
                artwork: track.artwork,
                youtube: youtube,
                spotify: spotify,
                apple: apple
            });
            const id = track.id || `track-${index + 1}`;
            const domId = this.normalizeDomId(id, `track-${index + 1}`);

            return {
                id: id,
                domId: domId,
                title: title,
                artist: artist,
                duration: duration,
                artwork: artwork,
                youtube: youtube,
                spotify: spotify,
                apple: apple
            };
        });
    }

    mergeTracks(baseTracks, remoteTracks) {
        const baseList = Array.isArray(baseTracks) ? baseTracks : [];
        const remoteList = Array.isArray(remoteTracks) ? remoteTracks : [];

        if (!remoteList.length) {
            return baseList;
        }

        if (!baseList.length) {
            return remoteList;
        }

        const merged = baseList.map((track) => ({ ...track }));
        const indexByYouTubeId = new Map();
        const indexByTitle = new Map();

        merged.forEach((track, index) => {
            const youtubeId = this.extractYouTubeId(track.youtube || '');
            if (youtubeId) {
                indexByYouTubeId.set(youtubeId, index);
            }

            const titleKey = this.normalizeTitleKey(track.title || '');
            if (titleKey && !indexByTitle.has(titleKey)) {
                indexByTitle.set(titleKey, index);
            }
        });

        remoteList.forEach((remoteTrack) => {
            const youtubeId = this.extractYouTubeId(remoteTrack.youtube || '');
            const titleKey = this.normalizeTitleKey(remoteTrack.title || '');
            if (youtubeId && indexByYouTubeId.has(youtubeId)) {
                const target = merged[indexByYouTubeId.get(youtubeId)];

                if (remoteTrack.title && remoteTrack.title !== 'Untitled' && target.title === 'Untitled') {
                    target.title = remoteTrack.title;
                }

                if (remoteTrack.duration && remoteTrack.duration !== '--:--') {
                    target.duration = remoteTrack.duration;
                }

                if (remoteTrack.artwork && remoteTrack.artwork !== this.defaultArtwork) {
                    target.artwork = remoteTrack.artwork;
                }

                if (remoteTrack.spotify && !target.spotify) {
                    target.spotify = remoteTrack.spotify;
                }

                if (remoteTrack.apple && !target.apple) {
                    target.apple = remoteTrack.apple;
                }

                return;
            }

            if (titleKey && indexByTitle.has(titleKey)) {
                const target = merged[indexByTitle.get(titleKey)];

                if (remoteTrack.duration && remoteTrack.duration !== '--:--') {
                    target.duration = remoteTrack.duration;
                }

                if (remoteTrack.artwork && remoteTrack.artwork !== this.defaultArtwork) {
                    target.artwork = remoteTrack.artwork;
                }

                if (remoteTrack.spotify && !target.spotify) {
                    target.spotify = remoteTrack.spotify;
                }

                if (remoteTrack.apple && !target.apple) {
                    target.apple = remoteTrack.apple;
                }

                return;
            }

            if (remoteTrack.youtube) {
                merged.push(remoteTrack);
            }
        });

        return this.normalizeTracks(merged);
    }

    buildTrackList(baseTracks, remoteTracks, spotifyTracks) {
        // First merge base with remote (YouTube) tracks
        let merged = this.mergeTracks(baseTracks, remoteTracks);

        // Then merge with Spotify tracks for additional metadata
        if (Array.isArray(spotifyTracks) && spotifyTracks.length) {
            merged = this.mergeTracks(merged, spotifyTracks);
        }

        return merged;
    }

    normalizeTitleKey(title) {
        if (!title || typeof title !== 'string') {
            return '';
        }

        return title
            .toLowerCase()
            .replace(/\([^)]*\)/g, ' ')
            .replace(/\[[^\]]*\]/g, ' ')
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();
    }

    normalizeAlbums(rawAlbums) {
        if (!Array.isArray(rawAlbums)) {
            return [];
        }

        return rawAlbums.map((album, index) => {
            const title = typeof album.title === 'string' && album.title.trim() ? album.title.trim() : 'Untitled';
            const artist = typeof album.artist === 'string' && album.artist.trim() ? album.artist.trim() : this.defaultArtist;
            const links = album.links || {};
            const youtube = this.safeUrl(album.youtube || links.youtube || '');
            const artwork = this.safeUrl(album.artwork) || this.defaultArtwork;
            const id = album.id || `album-${index + 1}`;
            const domId = this.normalizeDomId(id, `album-${index + 1}`);

            return {
                id: id,
                domId: domId,
                title: title,
                artist: artist,
                artwork: artwork,
                youtube: youtube,
                release_date: album.release_date || ''
            };
        });
    }

    resolveArtwork(track) {
        const provided = this.safeUrl(track.artwork);
        if (provided && provided !== this.defaultArtwork) {
            return provided;
        }

        const youtubeThumb = this.getYouTubeThumbnail(track.youtube);
        if (youtubeThumb) {
            return youtubeThumb;
        }

        return this.defaultArtwork;
    }

    getYouTubeThumbnail(url) {
        const videoId = this.extractYouTubeId(url || '');
        if (!videoId) {
            return '';
        }

        return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    }

    formatDuration(totalSeconds) {
        if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
            return '--:--';
        }

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    safeUrl(url) {
        if (!url || typeof url !== 'string') {
            return '';
        }

        const trimmed = url.trim();
        if (!trimmed) {
            return '';
        }

        const lowered = trimmed.toLowerCase();
        if (
            lowered.startsWith('javascript:') ||
            lowered.startsWith('data:') ||
            lowered.startsWith('vbscript:')
        ) {
            return '';
        }

        return trimmed;
    }

    escapeHtml(value) {
        if (value === null || value === undefined) {
            return '';
        }

        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    normalizeDomId(value, fallback) {
        const base = value ? String(value) : String(fallback);
        const sanitized = base.replace(/[^a-zA-Z0-9_-]/g, '');
        return sanitized || String(fallback);
    }

    renderMusic() {
        this.renderTracks();
        this.renderAlbums();
    }

    renderTracks() {
        const container = document.getElementById('tracks-container');
        if (!container) {
            console.warn('MusicSystem: Track container not found (#tracks-container)');
            return;
        }

        container.innerHTML = '';

        this.tracks.forEach((track, index) => {
            const card = document.createElement('div');
            card.className = 'modern-music-card music-card';

            const domId = track.domId || this.normalizeDomId(track.id, `track-${index + 1}`);
            track.domId = domId;

            const titleText = this.escapeHtml(track.title);
            const artistText = this.escapeHtml(track.artist);
            const durationText = this.escapeHtml(track.duration || '--:--');
            const artworkUrl = this.safeUrl(track.artwork) || this.defaultArtwork;
            const youtubeUrl = this.safeUrl(track.youtube);
            const spotifyUrl = this.safeUrl(track.spotify);
            const appleUrl = this.safeUrl(track.apple);
            const playDisabled = !youtubeUrl;

            const spotifyLink = spotifyUrl ? `
                        <a href="${spotifyUrl}" target="_blank" rel="noopener noreferrer" class="platform-link spotify" title="Listen on Spotify">
                            <svg viewBox="0 0 24 24" fill="currentColor" class="platform-icon">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                            </svg>
                        </a>` : '';

            const appleLink = appleUrl ? `
                        <a href="${appleUrl}" target="_blank" rel="noopener noreferrer" class="platform-link apple" title="Listen on Apple Music">
                            <svg viewBox="0 0 24 24" fill="currentColor" class="platform-icon">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                        </a>` : '';

            const youtubeLink = youtubeUrl ? `
                        <a href="${youtubeUrl}" target="_blank" rel="noopener noreferrer" class="platform-link youtube" title="Watch on YouTube">
                            <svg viewBox="0 0 24 24" fill="currentColor" class="platform-icon">
                                <path d="M23.498 6.186a2.999 2.999 0 0 0-2.111-2.135C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.387.505A2.999 2.999 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.999 2.999 0 0 0 2.111 2.135c1.882.505 9.387.505 9.387.505s7.505 0 9.387-.505a2.999 2.999 0 0 0 2.111-2.135C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        </a>` : '';

            card.innerHTML = `
                <div class="card-content">
                    <!-- Left: Album Art -->
                    <div class="track-artwork">
                        <img src="${artworkUrl}" alt="${titleText}" loading="lazy" decoding="async">
                        <div class="duration-badge">${durationText}</div>
                    </div>

                    <!-- Center: Track Info -->
                    <div class="track-main">
                        <div class="track-info">
                            <h3 class="track-name" title="${titleText}">${titleText}</h3>
                            <p class="artist-name" title="${artistText}">${artistText}</p>
                        </div>
                    </div>

                    <!-- Right: Controls -->
                    <div class="track-controls-fixed">
                        <button class="play-pause-btn" data-track-index="${index}" ${playDisabled ? 'disabled aria-disabled="true"' : ''} title="Play/Pause">
                            <svg viewBox="0 0 24 24" fill="currentColor" class="play-icon" id="playIcon-${domId}">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </button>
                        ${spotifyLink}
                        ${appleLink}
                        ${youtubeLink}
                    </div>
                </div>

                <!-- YouTube Audio Player (Gizli) -->
                <div id="youtube-audio-${domId}" style="display: none;"></div>
            `;
            container.appendChild(card);
        });
    }

    renderAlbums() {
        const container = document.getElementById('albums-container');
        if (!container) {
            console.warn('MusicSystem: Album container not found (#albums-container)');
            return;
        }

        container.innerHTML = '';

        this.albums.forEach((album, index) => {
            const card = document.createElement('div');
            card.className = 'modern-album-card music-card';

            const domId = album.domId || this.normalizeDomId(album.id, `album-${index + 1}`);
            album.domId = domId;

            const titleText = this.escapeHtml(album.title);
            const artistText = this.escapeHtml(album.artist);
            const artworkUrl = this.safeUrl(album.artwork) || this.defaultArtwork;
            const youtubeUrl = this.safeUrl(album.youtube);
            const albumHref = youtubeUrl || '#';
            const albumDisabled = youtubeUrl ? '' : 'aria-disabled="true"';

            card.innerHTML = `
                <div class="album-card-wrapper">
                    <a href="${albumHref}" target="_blank" rel="noopener noreferrer" class="album-link" ${albumDisabled}>
                        <div class="album-cover">
                            <img src="${artworkUrl}" alt="${titleText}" loading="lazy" decoding="async">
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
                            <h4 class="album-title" title="${titleText}">${titleText}</h4>
                            <p class="album-artist" title="${artistText}">${artistText}</p>
                            <span class="album-type">2024 Playlist</span>
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
        if (!track) {return;}

        const youtubeUrl = this.safeUrl(track.youtube);
        if (!youtubeUrl) {return;}

        const domId = track.domId || this.normalizeDomId(track.id, `track-${index + 1}`);
        track.domId = domId;

        const playIcon = document.getElementById(`playIcon-${domId}`);

        // If the same track is playing, toggle pause/resume
        if (this.currentTrack?.domId === domId) {
            if (this.isPlaying) {
                this.pauseCurrentTrack();
            } else {
                this.resumeCurrentTrack();
            }
            return;
        }

        // Switch to a new track
        this.stopCurrentTrack();
        this.loadYouTubeAPI();
        await this.playYouTubeAudio(track, playIcon);
    }

    async playYouTubeAudio(track, playIcon) {
        const videoId = this.extractYouTubeId(track.youtube);
        if (!videoId) {return;}

        this.currentTrack = track;

        const domId = track.domId || this.normalizeDomId(track.id, track.id);
        track.domId = domId;

        // Create player if missing
        if (!this.youtubePlayers.has(domId)) {
            await this.createYouTubePlayer(domId, videoId);
        }

        const player = this.youtubePlayers.get(domId);

        // Update play icon
        if (playIcon) {
            playIcon.innerHTML = '<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>';
        }

        // Start playback
        if (player) {
            player.playVideo();
            this.isPlaying = true;
        }
    }

    async createYouTubePlayer(trackId, videoId) {
        return new Promise((resolve) => {
            // Wait for YouTube API if not ready
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
        if (!playerDiv) {
            return resolve(null);
        }

        new YT.Player(playerDiv, {
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

    handlePlayerStateChange(event) {
        switch (event.data) {
        case YT.PlayerState.PLAYING:
            this.isPlaying = true;
            this.updateAllPlayIcons();
            console.log('Playing:', this.currentTrack.title);
            break;

        case YT.PlayerState.PAUSED:
            this.isPlaying = false;
            this.updateAllPlayIcons();
            console.log('Paused:', this.currentTrack.title);
            break;

        case YT.PlayerState.ENDED:
            this.isPlaying = false;
            this.updateAllPlayIcons();
            console.log('Ended:', this.currentTrack.title);
            this.applyPendingCatalogIfIdle();
            break;
        }
    }

    pauseCurrentTrack() {
        if (this.currentTrack && this.youtubePlayers.has(this.currentTrack.domId)) {
            const player = this.youtubePlayers.get(this.currentTrack.domId);
            player.pauseVideo();
            this.isPlaying = false;
        }
    }

    resumeCurrentTrack() {
        if (this.currentTrack && this.youtubePlayers.has(this.currentTrack.domId)) {
            const player = this.youtubePlayers.get(this.currentTrack.domId);
            player.playVideo();
            this.isPlaying = true;
        }
    }

    stopCurrentTrack() {
        if (this.currentTrack && this.youtubePlayers.has(this.currentTrack.domId)) {
            const player = this.youtubePlayers.get(this.currentTrack.domId);
            player.stopVideo();
        }
        this.isPlaying = false;
        this.updateAllPlayIcons();
        this.applyPendingCatalogIfIdle();
    }

    updateAllPlayIcons() {
        // Update all play icons
        this.tracks.forEach(track => {
            const domId = track.domId || this.normalizeDomId(track.id, track.id);
            track.domId = domId;
            const playIcon = document.getElementById(`playIcon-${domId}`);
            if (playIcon) {
                if (this.isPlaying && this.currentTrack?.domId === domId) {
                    playIcon.innerHTML = '<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>'; // Pause
                } else {
                    playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; // Play
                }
            }
        });
    }

    extractYouTubeId(url) {
        const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([^&\n?#]+)/;
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
