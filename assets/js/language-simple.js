// ===============================================
// SIMPLE LANGUAGE SYSTEM
// ===============================================

class SimpleLanguageSystem {
    constructor() {
        this.currentLang = this.getStoredLanguage() || 'en';
        this.translations = {
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.about': 'About',
                'nav.music': 'Music',
                'nav.software': 'Software',
                'nav.gallery': 'Gallery',
                'nav.contact': 'Contact',
                
                // Hero Section
                'hero.title': 'HASAN ARTHUR',
                'hero.subtitle': 'Cinematic Music Producer',
                'hero.description': 'Creating emotional soundscapes and cinematic experiences through music',
                'hero.listen': 'Listen to Music',
                'hero.about': 'About Me',
                
                // Stats
                'stats.albums': 'Albums',
                'stats.tracks': 'Tracks',
                'stats.platforms': 'Platforms',
                
                // Music Section
                'music.title': 'My Music',
                'music.subtitle': 'Latest releases and compositions',
                'music.player.ready': 'Music player ready for streaming from platforms.',
                'music.player.spotify': 'Listen on Spotify',
                'music.player.youtube': 'Watch on YouTube',
                'music.player.apple': 'Listen on Apple Music',
                'music.player.soundcloud': 'Listen on SoundCloud',
                
                // About Section
                'about.title': 'About Me',
                'about.subtitle': 'Musical Journey & Vision',
                'about.text': 'Passionate music producer creating cinematic and emotional soundscapes. Each composition tells a story through the universal language of music.',
                
                // Software Section
                'software.title': 'Software',
                'software.subtitle': 'Creative coding & development',
                
                // Gallery Section
                'gallery.title': 'Gallery',
                'gallery.subtitle': 'Behind the scenes & live performances',
                'gallery.all': 'All',
                'gallery.live': 'Live Performance',
                'gallery.studio': 'Studio Work',
                'gallery.behind': 'Behind Scenes',
                
                // Contact Section
                'contact.title': 'Contact',
                'contact.subtitle': 'Get in touch for collaborations',
                'contact.name': 'Your Name',
                'contact.email': 'Your Email',
                'contact.subject': 'Subject',
                'contact.message': 'Your Message',
                'contact.send': 'Send Message',
                
                // Footer
                'footer.rights': 'All rights reserved.',
                'footer.made': 'Made with'
            },
            tr: {
                // Navigation
                'nav.home': 'Ana Sayfa',
                'nav.about': 'Hakkımda',
                'nav.music': 'Müzik',
                'nav.software': 'Yazılım',
                'nav.gallery': 'Galeri',
                'nav.contact': 'İletişim',
                
                // Hero Section
                'hero.title': 'HASAN ARTHUR',
                'hero.subtitle': 'Sinematik Müzik Prodüktörü',
                'hero.description': 'Müzik aracılığıyla duygusal manzaralar ve sinematik deneyimler yaratıyorum',
                'hero.listen': 'Müzikleri Dinle',
                'hero.about': 'Hakkımda',
                
                // Stats
                'stats.albums': 'Albüm',
                'stats.tracks': 'Şarkı',
                'stats.platforms': 'Platform',
                
                // Music Section
                'music.title': 'Müziklerim',
                'music.subtitle': 'En son çıkan eserleri ve kompozisyonları',
                'music.player.ready': 'Müzik çalar platformlardan akış için hazır.',
                'music.player.spotify': 'Spotify\'da Dinle',
                'music.player.youtube': 'YouTube\'da İzle',
                'music.player.apple': 'Apple Music\'te Dinle',
                'music.player.soundcloud': 'SoundCloud\'da Dinle',
                
                // About Section
                'about.title': 'Hakkımda',
                'about.subtitle': 'Müzikal Yolculuk ve Vizyon',
                'about.text': 'Sinematik ve duygusal ses manzaraları yaratan tutkulu müzik prodüktörü. Her kompozisyon müziğin evrensel dili aracılığıyla bir hikaye anlatır.',
                
                // Software Section
                'software.title': 'Yazılım',
                'software.subtitle': 'Yaratıcı kodlama ve geliştirme',
                
                // Gallery Section
                'gallery.title': 'Galeri',
                'gallery.subtitle': 'Sahne arkası ve canlı performanslar',
                'gallery.all': 'Hepsi',
                'gallery.live': 'Canlı Performans',
                'gallery.studio': 'Stüdyo Çalışması',
                'gallery.behind': 'Sahne Arkası',
                
                // Contact Section
                'contact.title': 'İletişim',
                'contact.subtitle': 'İşbirliği için iletişime geçin',
                'contact.name': 'Adınız',
                'contact.email': 'E-posta Adresiniz',
                'contact.subject': 'Konu',
                'contact.message': 'Mesajınız',
                'contact.send': 'Mesaj Gönder',
                
                // Footer
                'footer.rights': 'Tüm hakları saklıdır.',
                'footer.made': 'İle yapıldı'
            }
        };
        
        this.init();
    }
    
    getStoredLanguage() {
        try {
            if (typeof Storage !== 'undefined' && window.localStorage) {
                return localStorage.getItem('siteLanguage');
            }
        } catch (error) {
            console.log('Language storage not available');
        }
        return null;
    }
    
    saveLanguage(lang) {
        try {
            if (typeof Storage !== 'undefined' && window.localStorage) {
                localStorage.setItem('siteLanguage', lang);
            }
        } catch (error) {
            console.log('Cannot save language preference');
        }
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
        this.saveLanguage(newLang);
        
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