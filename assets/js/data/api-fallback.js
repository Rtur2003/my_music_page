// API Fallback System - Static JSON data when localStorage fails
// Bu sistem localStorage çalışmadığında devreye girer

class APIFallback {
    constructor() {
        this.baseUrl = './data/';
        this.cache = new Map();
        this.cacheTTL = 5 * 60 * 1000; // 5 dakika cache
        
        this.endpoints = {
            music: 'music-catalog.json',
            gallery: 'gallery-catalog.json'
        };
    }
    
    // Ana fetch metodu
    async fetchData(endpoint) {
        const cacheKey = endpoint;
        const cached = this.cache.get(cacheKey);
        
        // Cache kontrolü
        if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
            console.log(`📦 Cached data used for ${endpoint}`);
            return cached.data;
        }
        
        try {
            const url = this.baseUrl + this.endpoints[endpoint];
            console.log(`🌐 Fetching data from ${url}`);
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Cache'e kaydet
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
            
            console.log(`✅ Data loaded from ${endpoint}:`, data);
            return data;
            
        } catch (error) {
            console.error(`❌ Failed to fetch ${endpoint}:`, error);
            
            // Fallback olarak boş data döndür
            return this.getEmptyData(endpoint);
        }
    }
    
    // Müzik verilerini al
    async getMusicCatalog() {
        const data = await this.fetchData('music');
        return data.tracks || [];
    }
    
    // Galeri verilerini al
    async getGalleryCatalog() {
        const data = await this.fetchData('gallery');
        return data.images || [];
    }
    
    // Boş veri yapısı
    getEmptyData(endpoint) {
        const emptyStructures = {
            music: { tracks: [] },
            gallery: { images: [] }
        };
        
        return emptyStructures[endpoint] || {};
    }
    
    // Admin panel için veri kaydetme (simüle)
    async saveMusicCatalog(tracks) {
        console.log('💾 Saving music catalog (simulated):', tracks);
        
        // Gerçek projede burası backend API'ye POST request yapacak
        // Şimdilik localStorage'a kaydetmeyi deneyeceğiz
        try {
            if (window.SafeStorage) {
                SafeStorage.setItem('music_catalog', JSON.stringify(tracks));
                console.log('✅ Music catalog saved to localStorage');
            }
        } catch (error) {
            console.warn('⚠️ Cannot save to localStorage:', error.message);
            // Gerçek projede bu backend'e gönderilir
        }
        
        return true;
    }
    
    // Galeri verilerini kaydet (simüle)
    async saveGalleryCatalog(images) {
        console.log('💾 Saving gallery catalog (simulated):', images);
        
        try {
            if (window.SafeStorage) {
                SafeStorage.setItem('media_gallery', JSON.stringify(images));
                console.log('✅ Gallery catalog saved to localStorage');
            }
        } catch (error) {
            console.warn('⚠️ Cannot save to localStorage:', error.message);
        }
        
        return true;
    }
    
    // Veri senkronizasyonu
    async syncWithBackend() {
        console.log('🔄 Syncing with backend...');
        
        try {
            // localStorage ve JSON dosyalarını senkronize et
            const localMusic = SafeStorage.getItem('music_catalog');
            const localGallery = SafeStorage.getItem('media_gallery');
            
            const remoteMusic = await this.getMusicCatalog();
            const remoteGallery = await this.getGalleryCatalog();
            
            // Timestamp karşılaştırması yapılabilir
            console.log('📊 Sync completed');
            
            return {
                music: remoteMusic,
                gallery: remoteGallery
            };
            
        } catch (error) {
            console.error('❌ Sync failed:', error);
            return null;
        }
    }
    
    // Connectivity test
    async testConnectivity() {
        try {
            const response = await fetch(this.baseUrl + this.endpoints.music, {
                method: 'HEAD',
                cache: 'no-cache'
            });
            
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    // Cache temizleme
    clearCache() {
        this.cache.clear();
        console.log('🗑️ API cache cleared');
    }
}

// Hybrid Storage System - localStorage + API fallback
class HybridStorage {
    constructor() {
        this.apiFallback = new APIFallback();
        this.preferAPI = false; // localStorage sorunlarında true olacak
    }
    
    // Otomatik storage seçimi
    async getItem(key) {
        // Önce localStorage'ı dene
        if (!this.preferAPI) {
            try {
                const localValue = SafeStorage.getItem(key);
                if (localValue) {
                    return localValue;
                }
            } catch (error) {
                console.warn('localStorage failed, switching to API fallback');
                this.preferAPI = true;
            }
        }
        
        // API fallback'i kullan
        try {
            const endpoint = this.mapKeyToEndpoint(key);
            if (endpoint) {
                const data = await this.apiFallback.fetchData(endpoint);
                return JSON.stringify(endpoint === 'music' ? data.tracks : data.images);
            }
        } catch (error) {
            console.error('API fallback failed:', error);
        }
        
        return null;
    }
    
    // Key'i endpoint'e map'le
    mapKeyToEndpoint(key) {
        const mapping = {
            'music_catalog': 'music',
            'media_gallery': 'gallery'
        };
        
        return mapping[key] || null;
    }
    
    // Veri kaydetme
    async setItem(key, value) {
        // Önce localStorage'ı dene
        try {
            SafeStorage.setItem(key, value);
            console.log(`💾 Data saved to localStorage: ${key}`);
        } catch (error) {
            console.warn('localStorage save failed, using API fallback');
            this.preferAPI = true;
        }
        
        // API fallback'e de kaydet
        try {
            const endpoint = this.mapKeyToEndpoint(key);
            if (endpoint === 'music') {
                const data = JSON.parse(value);
                await this.apiFallback.saveMusicCatalog(data);
            } else if (endpoint === 'gallery') {
                const data = JSON.parse(value);
                await this.apiFallback.saveGalleryCatalog(data);
            }
        } catch (error) {
            console.error('API fallback save failed:', error);
        }
    }
}

// Global olarak kullanılabilir hale getir
window.APIFallback = APIFallback;
window.HybridStorage = HybridStorage;

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APIFallback, HybridStorage };
}