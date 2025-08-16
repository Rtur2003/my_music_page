class Gallery {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.modal = document.getElementById('imageModal');
        this.modalImg = document.getElementById('modalImage');
        this.modalCaption = document.getElementById('modalCaption');
        this.closeBtn = document.querySelector('.modal-close');
        
        this.currentFilter = 'all';
        this.currentImageIndex = 0;
        this.filteredImages = [...this.galleryItems];
        
        this.init();
    }
    
    init() {
        this.bindFilterEvents();
        this.bindGalleryEvents();
        this.bindModalEvents();
        this.bindKeyboardEvents();
        this.initializeLazyLoading();
        this.initializeAnimations();
        
        console.log('🖼️ Galeri başarıyla yüklendi!');
    }
    
    bindFilterEvents() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const filter = button.dataset.filter;
                this.setActiveFilter(button);
                this.filterGallery(filter);
                
                this.createFilterNotification(`${this.getFilterName(filter)} gösteriliyor`);
            });
        });
    }
    
    bindGalleryEvents() {
        this.galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openModal(index);
            });
            
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openModal(index);
                }
            });
            
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', 'Resmi büyütmek için tıklayın');
        });
    }
    
    bindModalEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }
        
        const prevBtn = this.createNavigationButton('prev', '❮');
        const nextBtn = this.createNavigationButton('next', '❯');
        
        if (this.modal) {
            const modalContent = this.modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.appendChild(prevBtn);
                modalContent.appendChild(nextBtn);
            }
        }
    }
    
    createNavigationButton(direction, symbol) {
        const button = document.createElement('button');
        button.className = `modal-nav modal-${direction}`;
        button.innerHTML = symbol;
        button.setAttribute('aria-label', direction === 'prev' ? 'Önceki resim' : 'Sonraki resim');
        
        button.style.cssText = `
            position: absolute;
            top: 50%;
            ${direction === 'prev' ? 'left: 20px' : 'right: 20px'};
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 24px;
            cursor: pointer;
            z-index: 2002;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.background = 'rgba(108, 92, 231, 0.8)';
            button.style.transform = 'translateY(-50%) scale(1.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = 'rgba(0, 0, 0, 0.7)';
            button.style.transform = 'translateY(-50%) scale(1)';
        });
        
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            if (direction === 'prev') {
                this.showPreviousImage();
            } else {
                this.showNextImage();
            }
        });
        
        return button;
    }
    
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (this.modal.style.display === 'block') {
                switch (e.key) {
                    case 'Escape':
                        this.closeModal();
                        break;
                    case 'ArrowLeft':
                        this.showPreviousImage();
                        break;
                    case 'ArrowRight':
                        this.showNextImage();
                        break;
                }
            }
        });
    }
    
    initializeLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target.querySelector('img');
                    if (img && img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(entry.target);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        this.galleryItems.forEach(item => {
            imageObserver.observe(item);
        });
    }
    
    initializeAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('.gallery-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0) scale(1)';
                        }, index * 100);
                    });
                }
            });
        }, { threshold: 0.2 });
        
        const galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid) {
            observer.observe(galleryGrid);
            
            this.galleryItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px) scale(0.9)';
                item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        }
    }
    
    setActiveFilter(activeButton) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }
    
    filterGallery(filter) {
        this.currentFilter = filter;
        
        this.galleryItems.forEach((item, index) => {
            const category = item.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                setTimeout(() => {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px) scale(0.9)';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                }, index * 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px) scale(0.9)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        this.updateFilteredImages();
    }
    
    updateFilteredImages() {
        this.filteredImages = Array.from(this.galleryItems).filter(item => {
            const category = item.dataset.category;
            return this.currentFilter === 'all' || category === this.currentFilter;
        });
    }
    
    openModal(index) {
        const visibleItems = this.getVisibleItems();
        const item = visibleItems[index];
        
        if (!item) return;
        
        this.currentImageIndex = index;
        
        const img = item.querySelector('img');
        const title = item.querySelector('h4')?.textContent || 'Başlık yok';
        const description = item.querySelector('p')?.textContent || 'Açıklama yok';
        
        if (this.modal && this.modalImg && this.modalCaption) {
            this.modal.style.display = 'block';
            this.modalImg.src = img.src;
            this.modalImg.alt = img.alt;
            this.modalCaption.innerHTML = `
                <h4>${title}</h4>
                <p>${description}</p>
                <span class="image-counter">${index + 1} / ${visibleItems.length}</span>
            `;
            
            document.body.style.overflow = 'hidden';
            
            this.modalImg.style.opacity = '0';
            this.modalImg.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                this.modalImg.style.transition = 'all 0.3s ease';
                this.modalImg.style.opacity = '1';
                this.modalImg.style.transform = 'scale(1)';
            }, 50);
        }
        
        this.preloadAdjacentImages(index, visibleItems);
    }
    
    closeModal() {
        if (this.modal) {
            this.modalImg.style.transition = 'all 0.3s ease';
            this.modalImg.style.opacity = '0';
            this.modalImg.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                this.modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }
    
    showPreviousImage() {
        const visibleItems = this.getVisibleItems();
        this.currentImageIndex = this.currentImageIndex > 0 ? 
            this.currentImageIndex - 1 : visibleItems.length - 1;
        this.updateModalImage();
    }
    
    showNextImage() {
        const visibleItems = this.getVisibleItems();
        this.currentImageIndex = this.currentImageIndex < visibleItems.length - 1 ? 
            this.currentImageIndex + 1 : 0;
        this.updateModalImage();
    }
    
    updateModalImage() {
        const visibleItems = this.getVisibleItems();
        const item = visibleItems[this.currentImageIndex];
        
        if (!item) return;
        
        const img = item.querySelector('img');
        const title = item.querySelector('h4')?.textContent || 'Başlık yok';
        const description = item.querySelector('p')?.textContent || 'Açıklama yok';
        
        this.modalImg.style.opacity = '0';
        this.modalImg.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            this.modalImg.src = img.src;
            this.modalImg.alt = img.alt;
            this.modalCaption.innerHTML = `
                <h4>${title}</h4>
                <p>${description}</p>
                <span class="image-counter">${this.currentImageIndex + 1} / ${visibleItems.length}</span>
            `;
            
            this.modalImg.style.opacity = '1';
            this.modalImg.style.transform = 'scale(1)';
        }, 150);
        
        this.preloadAdjacentImages(this.currentImageIndex, visibleItems);
    }
    
    preloadAdjacentImages(currentIndex, items) {
        const preloadIndexes = [
            currentIndex - 1 >= 0 ? currentIndex - 1 : items.length - 1,
            currentIndex + 1 < items.length ? currentIndex + 1 : 0
        ];
        
        preloadIndexes.forEach(index => {
            const item = items[index];
            if (item) {
                const img = new Image();
                const srcImg = item.querySelector('img');
                if (srcImg) {
                    img.src = srcImg.src;
                }
            }
        });
    }
    
    getVisibleItems() {
        return Array.from(this.galleryItems).filter(item => {
            return window.getComputedStyle(item).display !== 'none';
        });
    }
    
    getFilterName(filter) {
        const filterNames = {
            'all': 'Tüm resimler',
            'concerts': 'Konser resimleri',
            'studio': 'Stüdyo resimleri',
            'behind-scenes': 'Sahne arkası resimleri'
        };
        return filterNames[filter] || 'Bilinmeyen kategori';
    }
    
    createFilterNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'gallery-notification';
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(108, 92, 231, 0.95);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            font-size: 1rem;
            z-index: 1500;
            backdrop-filter: blur(10px);
            opacity: 0;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translate(-50%, -50%) scale(1.05)';
        }, 50);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translate(-50%, -50%) scale(0.95)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 1500);
    }
    
    addImageToGallery(src, title, description, category) {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;
        
        const newItem = document.createElement('div');
        newItem.className = 'gallery-item';
        newItem.dataset.category = category;
        
        newItem.innerHTML = `
            <img src="${src}" alt="${title}">
            <div class="gallery-overlay">
                <h4>${title}</h4>
                <p>${description}</p>
                <button class="view-btn">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        `;
        
        galleryGrid.appendChild(newItem);
        
        newItem.addEventListener('click', () => {
            this.openModal(Array.from(this.galleryItems).indexOf(newItem));
        });
        
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.updateFilteredImages();
        
        newItem.style.opacity = '0';
        newItem.style.transform = 'translateY(30px) scale(0.9)';
        
        setTimeout(() => {
            newItem.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            newItem.style.opacity = '1';
            newItem.style.transform = 'translateY(0) scale(1)';
        }, 100);
    }
    
    removeImageFromGallery(index) {
        const item = this.galleryItems[index];
        if (!item) return;
        
        item.style.transition = 'all 0.3s ease';
        item.style.opacity = '0';
        item.style.transform = 'translateY(-30px) scale(0.9)';
        
        setTimeout(() => {
            if (item.parentNode) {
                item.parentNode.removeChild(item);
            }
            this.galleryItems = document.querySelectorAll('.gallery-item');
            this.updateFilteredImages();
        }, 300);
    }
    
    getGalleryStats() {
        const stats = {
            total: this.galleryItems.length,
            byCategory: {}
        };
        
        this.galleryItems.forEach(item => {
            const category = item.dataset.category;
            stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
        });
        
        return stats;
    }
}

const imageCounterCSS = `
.image-counter {
    display: inline-block;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.9rem;
    margin-top: 1rem;
    backdrop-filter: blur(10px);
}

.modal-content h4 {
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
}

.modal-content p {
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.8);
}
`;

if (!document.querySelector('#gallery-styles')) {
    const style = document.createElement('style');
    style.id = 'gallery-styles';
    style.textContent = imageCounterCSS;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', function() {
    window.gallery = new Gallery();
    
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('📸 Galeri bölümü görünümde!');
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(gallerySection);
    }
});