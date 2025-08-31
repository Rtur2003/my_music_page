// Safe Storage Helper - Multi-level fallback system
const SafeStorage = {
    memoryStorage: new Map(),
    
    // Try to get data with fallback chain
    getItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            try {
                return sessionStorage.getItem(key);
            } catch (e2) {
                return this.memoryStorage.get(key) || null;
            }
        }
    },
    
    // Try to set data with fallback chain
    setItem(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            try {
                sessionStorage.setItem(key, value);
                return true;
            } catch (e2) {
                this.memoryStorage.set(key, value);
                return true;
            }
        }
    },
    
    // Try to remove data with fallback chain
    removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            try {
                sessionStorage.removeItem(key);
            } catch (e2) {
                this.memoryStorage.delete(key);
            }
        }
    }
};

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SafeStorage;
} else if (typeof window !== 'undefined') {
    window.SafeStorage = SafeStorage;
}