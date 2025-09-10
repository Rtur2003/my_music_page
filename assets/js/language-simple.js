// ===============================================
// SIMPLE LANGUAGE SYSTEM
// ===============================================

class SimpleLanguageSystem {
    constructor() {
        this.currentLang = localStorage.getItem('siteLanguage') || 'en';
        this.translations = {
            en: {
                'nav.home': 'Home',
                'nav.about': 'About',
                'nav.music': 'Music',
                'nav.software': 'Software',
                'nav.gallery': 'Gallery',
                'nav.contact': 'Contact',
                'hero.title': 'HASAN ARTHUR',
                'hero.subtitle': 'Cinematic Music Producer',
                'about.title': 'About Me',
                'about.subtitle': 'Musical Journey & Vision',
                'music.title': 'My Music',
                'software.title': 'Software',
                'gallery.title': 'Gallery',
                'contact.title': 'Contact',
                'contact.send': 'Send Message'
            },
            tr: {
                'nav.home': 'Ana Sayfa',
                'nav.about': 'Hakkımda',
                'nav.music': 'Müzik',
                'nav.software': 'Yazılım',
                'nav.gallery': 'Galeri',
                'nav.contact': 'İletişim',
                'hero.title': 'HASAN ARTHUR',
                'hero.subtitle': 'Sinematik Müzik Prodüktörü',
                'about.title': 'Hakkımda',
                'about.subtitle': 'Müzikal Yolculuk ve Vizyon',
                'music.title': 'Müziklerim',
                'software.title': 'Yazılım',
                'gallery.title': 'Galeri',
                'contact.title': 'İletişim',
                'contact.send': 'Mesaj Gönder'
            }
        };
        
        this.init();
    }
    
    init() {
        this.createLanguageToggle();
        this.applyTranslations();
    }
    
    createLanguageToggle() {
        // Language toggle zaten HTML'de var, sadece event listener ekle
        const toggle = document.querySelector('.language-toggle');
        if (toggle) {
            // Mevcut duruma göre aktif buton'u ayarla
            const buttons = toggle.querySelectorAll('.lang-btn');
            buttons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
            });
            
            // Event listeners ekle
            toggle.addEventListener('click', (e) => {
                const btn = e.target.closest('.lang-btn');
                if (btn && btn.dataset.lang !== this.currentLang) {
                    this.switchLanguage(btn.dataset.lang);
                }
            });
        }
    }
    
    switchLanguage(newLang) {
        this.currentLang = newLang;
        localStorage.setItem('siteLanguage', newLang);
        
        // Button states güncelle
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === newLang);
        });
        
        this.applyTranslations();
    }
    
    applyTranslations() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            if (this.translations[this.currentLang] && this.translations[this.currentLang][key]) {
                el.textContent = this.translations[this.currentLang][key];
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SimpleLanguageSystem();
});