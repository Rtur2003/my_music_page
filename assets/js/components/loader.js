// Page Loader Component
class PageLoader {
    constructor() {
        this.loader = document.querySelector('.page-loader');
        this.progressBar = document.querySelector('.progress-bar');
        this.loadingText = document.querySelector('.loader-subtitle');
        this.isLoaded = false;
        
        this.init();
    }
    
    init() {
        this.checkMaintenanceMode();
        this.simulateProgress();
    }
    
    checkMaintenanceMode() {
        const bypassCode = SafeStorage.getItem('maintenance_bypass');
        const bypassTimestamp = SafeStorage.getItem('maintenance_bypass_timestamp');
        
        if (bypassCode === 'true' && bypassTimestamp) {
            const currentTime = Date.now();
            const bypassTime = parseInt(bypassTimestamp);
            const twentyFourHours = 24 * 60 * 60 * 1000;
            
            if (currentTime - bypassTime > twentyFourHours) {
                SafeStorage.removeItem('maintenance_bypass');
                SafeStorage.removeItem('maintenance_bypass_timestamp');
            }
        }
        
        // Check if we should redirect to maintenance
        const isMaintenanceMode = false; // Set this based on your logic
        if (isMaintenanceMode && bypassCode !== 'true') {
            window.location.href = 'maintenance.html';
            return;
        }
    }
    
    simulateProgress() {
        let progress = 0;
        const steps = [
            { percent: 20, text: 'Loading assets...', delay: 300 },
            { percent: 45, text: 'Initializing components...', delay: 200 },
            { percent: 70, text: 'Setting up interface...', delay: 150 },
            { percent: 90, text: 'Finalizing...', delay: 100 },
            { percent: 100, text: 'Ready!', delay: 200 }
        ];
        
        const updateProgress = (stepIndex = 0) => {
            if (stepIndex >= steps.length) {
                this.hideLoader();
                return;
            }
            
            const step = steps[stepIndex];
            progress = step.percent;
            
            if (this.progressBar) {
                this.progressBar.style.width = `${progress}%`;
            }
            
            if (this.loadingText) {
                this.loadingText.textContent = step.text;
            }
            
            setTimeout(() => updateProgress(stepIndex + 1), step.delay);
        };
        
        // Start progress simulation
        setTimeout(() => updateProgress(), 500);
    }
    
    hideLoader() {
        if (!this.loader || this.isLoaded) return;
        
        this.isLoaded = true;
        
        // Simple fade out
        setTimeout(() => {
            if (this.loader) {
                this.loader.classList.add('hidden');
                
                // Remove loader from DOM after transition
                setTimeout(() => {
                    if (this.loader && this.loader.parentNode) {
                        this.loader.parentNode.removeChild(this.loader);
                    }
                }, 800);
            }
        }, 800);
    }
    
    // Public method to force hide loader
    forceHide() {
        this.hideLoader();
    }
}

// Initialize loader immediately
const pageLoader = new PageLoader();

// Also export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageLoader;
} else if (typeof window !== 'undefined') {
    window.PageLoader = PageLoader;
    window.pageLoader = pageLoader;
}