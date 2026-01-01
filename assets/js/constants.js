// ===============================================
// GLOBAL CONSTANTS & CONFIGURATION
// ===============================================

/**
 * Application-wide constants for paths, URLs, and configuration values
 */
export const CONSTANTS = {
    // Asset Paths
    PATHS: {
        DEFAULT_ARTWORK: 'assets/images/logo-main.png',
        LOGO_MAIN: 'assets/images/logo-main.png',
        LOGO_TRANSPARENT: 'assets/images/logo-transparent.png',
        MUSIC_DATA: 'assets/data/music-links.json',
        CONFIG: 'config/site.json'
    },

    // API Endpoints
    API: {
        NETLIFY_MUSIC_CATALOG: '/.netlify/functions/music-catalog',
        YOUTUBE_API: 'https://www.googleapis.com/youtube/v3',
        SPOTIFY_API: 'https://api.spotify.com/v1'
    },

    // Cache Configuration
    CACHE: {
        MUSIC_CATALOG_KEY: 'musicCatalogCache',
        MUSIC_CATALOG_TTL: 6 * 60 * 60 * 1000, // 6 hours
        THEME_KEY: 'theme',
        LANGUAGE_KEY: 'siteLanguage'
    },

    // Timing & Limits
    TIMING: {
        ANIMATION_DELAY: 100,
        DEBOUNCE_DELAY: 300,
        MESSAGE_AUTO_HIDE: 5000,
        PERFORMANCE_WARN_THRESHOLD: 3000,
        MEMORY_CHECK_INTERVAL: 30000
    },

    LIMITS: {
        MAX_REMOTE_TRACKS: 12,
        MAX_ERROR_LOG: 50,
        MAX_GALLERY_ITEMS: 100
    },

    // Theme Values
    THEMES: {
        DARK: 'dark',
        LIGHT: 'light'
    },

    // Language Values
    LANGUAGES: {
        ENGLISH: 'en',
        TURKISH: 'tr'
    },

    // Artist Information
    ARTIST: {
        NAME: 'Hasan Arthur Altuntaş',
        SHORT_NAME: 'Hasan Arthur',
        LOCATION: 'Sakarya, Turkey'
    },

    // Social Media & Links
    SOCIAL: {
        SPOTIFY: 'https://open.spotify.com/intl-tr/artist/6D5NDnftFDOelT5ssMe0ef',
        YOUTUBE: 'https://www.youtube.com/channel/UCA7E1X_uGUqtSJeIxvBeTQA',
        GITHUB: 'https://github.com/Rtur2003',
        LINKEDIN: 'https://tr.linkedin.com/in/hasan-arthur-altuntas',
        INSTAGRAM: 'https://www.instagram.com/rthur_hsn',
        TWITTER: 'https://x.com/Rthur__1',
        TIKTOK: 'https://www.tiktok.com/@hasnarthur_piano'
    },

    // Status Messages
    MESSAGES: {
        SUCCESS: {
            FORM_SUBMIT: 'Message sent successfully! I\'ll get back to you soon.',
            DATA_LOADED: 'Data loaded successfully',
            CACHED_DATA: 'Using cached data'
        },
        ERROR: {
            FORM_SUBMIT: 'Failed to send message. Please try again.',
            NETWORK: 'Network error occurred. Please check your connection.',
            GENERIC: 'An error occurred. Please try again later.',
            STORAGE_UNAVAILABLE: 'Storage not available'
        },
        INFO: {
            LOADING: 'Loading...',
            PROCESSING: 'Processing...'
        }
    },

    // Development
    DEV: {
        LOCALHOST: ['localhost', '127.0.0.1', '']
    }
};

// Add helper method after object is created to avoid circular reference
CONSTANTS.DEV.isLocalhost = () => {
    return CONSTANTS.DEV.LOCALHOST.includes(window.location.hostname);
};

// Freeze the constants object to prevent modifications
Object.freeze(CONSTANTS);
Object.freeze(CONSTANTS.PATHS);
Object.freeze(CONSTANTS.API);
Object.freeze(CONSTANTS.CACHE);
Object.freeze(CONSTANTS.TIMING);
Object.freeze(CONSTANTS.LIMITS);
Object.freeze(CONSTANTS.THEMES);
Object.freeze(CONSTANTS.LANGUAGES);
Object.freeze(CONSTANTS.ARTIST);
Object.freeze(CONSTANTS.SOCIAL);
Object.freeze(CONSTANTS.MESSAGES);
Object.freeze(CONSTANTS.DEV);

// Make available globally for non-module scripts
if (typeof window !== 'undefined') {
    window.CONSTANTS = CONSTANTS;
}
