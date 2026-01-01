// ===============================================
// GALLERY MANAGER
// ===============================================

class GalleryManager {
    constructor() {
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupFilterButtons();
        this.setupGalleryItems();
        console.log('🖼️ Gallery Manager initialized');
    }

    setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setActiveFilter(filter);
                this.filterGallery(filter);
            });
        });
    }

    setupGalleryItems() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            // Add animation delay
            item.style.animationDelay = `${index * 0.1}s`;
            
            // Add click handler for lightbox effect
            item.addEventListener('click', () => {
                this.showLightbox(item);
            });
        });
    }

    setActiveFilter(filter) {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to clicked button
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        this.currentFilter = filter;
    }

    filterGallery(filter) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach((item, index) => {
            const itemCategory = item.dataset.category;
            const shouldShow = filter === 'all' || itemCategory === filter;
            
            if (shouldShow) {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                // Animate in with delay
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        console.log(`🖼️ Filtered gallery to show: ${filter}`);
    }

    showLightbox(item) {
        const img = item.querySelector('img');
        const info = item.querySelector('.gallery-info');
        
        if (!img) {return;}

        // Create lightbox overlay
        const lightbox = document.createElement('div');
        lightbox.className = 'gallery-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay">
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                    <img src="${img.src}" alt="${img.alt}" class="lightbox-image">
                    <div class="lightbox-info">
                        <h3>${info?.querySelector('h4')?.textContent || 'Gallery Image'}</h3>
                        <p>${info?.querySelector('p')?.textContent || 'Music portfolio gallery'}</p>
                    </div>
                </div>
            </div>
        `;

        // Add to page
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Setup close functionality
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const overlay = lightbox.querySelector('.lightbox-overlay');

        closeBtn.addEventListener('click', () => this.closeLightbox(lightbox));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {this.closeLightbox(lightbox);}
        });

        // Keyboard controls
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox(lightbox);
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);

        // Animate in
        setTimeout(() => {
            lightbox.classList.add('active');
        }, 10);

        console.log('🖼️ Opened lightbox for:', img.alt);
    }

    closeLightbox(lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            if (lightbox.parentNode) {
                lightbox.parentNode.removeChild(lightbox);
            }
        }, 300);

        console.log('🖼️ Closed lightbox');
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const galleryManager = new GalleryManager();
    
    // Export to window for admin panel integration
    window.galleryManager = galleryManager;
});
