// Professional Language System for Music Portfolio
// Default: English | Secondary: Turkish

class LanguageSystem {
    constructor() {
        this.currentLang = 'en'; // Default to English
        this.supportedLangs = ['en', 'tr'];
        this.translations = {};
        this.storageKey = 'hasan_arthur_language';
        
        this.initializeTranslations();
        this.loadSavedLanguage();
        this.createLanguageToggle();
        this.applyTranslations();
    }

    initializeTranslations() {
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
                'hero.title': 'HASAN ARTHUR ALTUNTAŞ',
                'hero.subtitle': 'Professional Musician & Producer',
                'hero.description': 'Crafting cinematic and instrumental music that tells stories through universal language of sound. Each note carries emotion, every melody holds a memory.',
                'hero.listen': 'Listen to Music',
                'hero.contact': 'Get in Touch',
                
                // About Section
                'about.title': 'About Me',
                'about.subtitle': 'Musical Journey & Vision',
                'about.text': 'I tell stories in the universal language of music. Every note is an emotion, every melody is a memory. In the world of cinematic and instrumental music, I express myself while taking listeners on an emotional journey.',
                'about.years': 'Years Experience',
                'about.tracks': 'Original Tracks',
                'about.projects': 'Completed Projects',
                
                // Skills
                'skills.composition': 'Music Composition',
                'skills.production': 'Music Production',
                'skills.mixing': 'Mixing & Mastering',
                'skills.instruments': 'Multi-Instrumentalist',
                'skills.software': 'Software Development',
                'skills.sound': 'Sound Design',
                
                // Music Section
                'music.title': 'My Music',
                'music.subtitle': 'Listen to my latest compositions',
                'music.player.select': 'Select a track',
                'music.player.artist': 'Hasan Arthur Altuntaş',
                'music.player.genre': 'Cinematic',
                'music.player.duration': '3:45',
                'music.player.spotify': 'Listen on Spotify',
                'music.player.youtube': 'Watch on YouTube',
                'music.player.apple': 'Listen on Apple Music',
                'music.player.soundcloud': 'Listen on SoundCloud',
                'music.loading': 'No music has been added yet',
                
                // Software Section
                'software.title': 'Software Projects',
                'software.subtitle': 'Where creativity meets technology',
                'software.description': 'As a musician and developer, I create innovative software solutions for the music industry. From audio processing tools to music production applications.',
                'software.projects': 'Active Projects',
                'software.technologies': 'Technologies Used',
                'software.downloads': 'Total Downloads',
                'software.github': 'View on GitHub',
                'software.demo': 'Live Demo',
                'software.download': 'Download',
                
                // Gallery Section
                'gallery.title': 'Gallery',
                'gallery.subtitle': 'Behind the scenes & live performances',
                'gallery.all': 'All',
                'gallery.studio': 'Studio Work',
                'gallery.live': 'Live Performance',
                'gallery.behind': 'Behind Scenes',
                'gallery.portrait': 'Portrait',
                'gallery.loading': 'No images have been added yet',
                
                // Contact Section
                'contact.title': 'Get in Touch',
                'contact.subtitle': 'Let\'s create something amazing together',
                'contact.description': 'Ready to collaborate on your next project? Whether it\'s music production, composition, or software development, I\'d love to hear from you.',
                'contact.name': 'Your Name',
                'contact.email': 'Your Email',
                'contact.subject': 'Subject',
                'contact.message': 'Your Message',
                'contact.send': 'Send Message',
                'contact.sending': 'Sending...',
                'contact.success': 'Message sent successfully!',
                'contact.error': 'Failed to send message. Please try again.',
                
                // Footer
                'footer.tagline': 'Creating musical experiences that resonate with the soul',
                'footer.links': 'Quick Links',
                'footer.social': 'Follow Me',
                'footer.contact_info': 'Contact Info',
                'footer.rights': '© 2024 Hasan Arthur Altuntaş. All rights reserved.',
                
                // Loading & UI
                'loading.music': 'Music loading...',
                'loading.portfolio': 'Music portfolio loading...',
                'ui.close': 'Close',
                'ui.view': 'View',
                'ui.play': 'Play',
                'ui.pause': 'Pause',
                'ui.next': 'Next',
                'ui.previous': 'Previous',
                'ui.volume': 'Volume',
                'ui.scroll': 'Scroll down',
                
                // Maintenance
                'maintenance.title': 'Under Maintenance',
                'maintenance.description': 'We are updating our music portfolio to bring you a better experience. We will be back soon with enhanced features and new music.',
                'maintenance.progress': 'Update Progress',
                'maintenance.time': 'Estimated time: A few hours',
                'maintenance.hint': 'Enter access code for testing'
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
                'hero.title': 'HASAN ARTHUR ALTUNTAŞ',
                'hero.subtitle': 'Profesyonel Müzisyen ve Prodüktör',
                'hero.description': 'Evrensel müzik dili ile hikayeler anlatan sinematik ve enstrümantal müzikler yaratıyorum. Her nota bir duygu, her melodi bir anı taşır.',
                'hero.listen': 'Müzikleri Dinle',
                'hero.contact': 'İletişime Geç',
                
                // About Section
                'about.title': 'Hakkımda',
                'about.subtitle': 'Müzikal Yolculuk ve Vizyon',
                'about.text': 'Müziğin evrensel dilinde hikayeler anlatıyorum. Her nota bir duygu, her melodi bir anı. Sinematik ve enstrümantal müzik dünyasında kendimi ifade ederken, dinleyicileri duygusal bir yolculuğa çıkarıyorum.',
                'about.years': 'Yıl Deneyim',
                'about.tracks': 'Özgün Eser',
                'about.projects': 'Tamamlanan Proje',
                
                // Skills
                'skills.composition': 'Müzik Kompozisyonu',
                'skills.production': 'Müzik Prodüksiyonu',
                'skills.mixing': 'Miksaj & Mastering',
                'skills.instruments': 'Çoklu Enstrüman',
                'skills.software': 'Yazılım Geliştirme',
                'skills.sound': 'Ses Tasarımı',
                
                // Music Section
                'music.title': 'Müziklerim',
                'music.subtitle': 'En son kompozisyonlarımı dinleyin',
                'music.player.select': 'Bir şarkı seçin',
                'music.player.artist': 'Hasan Arthur Altuntaş',
                'music.player.genre': 'Sinematik',
                'music.player.duration': '3:45',
                'music.player.spotify': 'Spotify\'da Dinle',
                'music.player.youtube': 'YouTube\'da İzle',
                'music.player.apple': 'Apple Music\'te Dinle',
                'music.player.soundcloud': 'SoundCloud\'da Dinle',
                'music.loading': 'Henüz müzik eklenmemiş',
                
                // Software Section
                'software.title': 'Yazılım Projeleri',
                'software.subtitle': 'Yaratıcılığın teknoloji ile buluştuğu yer',
                'software.description': 'Müzisyen ve geliştirici olarak, müzik endüstrisi için yenilikçi yazılım çözümleri yaratıyorum. Ses işleme araçlarından müzik prodüksiyon uygulamalarına kadar.',
                'software.projects': 'Aktif Proje',
                'software.technologies': 'Kullanılan Teknoloji',
                'software.downloads': 'Toplam İndirme',
                'software.github': 'GitHub\'da Görüntüle',
                'software.demo': 'Canlı Demo',
                'software.download': 'İndir',
                
                // Gallery Section
                'gallery.title': 'Galeri',
                'gallery.subtitle': 'Sahne arkası ve canlı performanslar',
                'gallery.all': 'Tümü',
                'gallery.studio': 'Stüdyo Çalışması',
                'gallery.live': 'Canlı Performans',
                'gallery.behind': 'Sahne Arkası',
                'gallery.portrait': 'Portre',
                'gallery.loading': 'Henüz görsel eklenmemiş',
                
                // Contact Section
                'contact.title': 'İletişime Geçin',
                'contact.subtitle': 'Birlikte harika şeyler yaratın',
                'contact.description': 'Bir sonraki projenizde işbirliği yapmaya hazır mısınız? Müzik prodüksiyonu, kompozisyon veya yazılım geliştirme olsun, sizden haber almayı çok isterim.',
                'contact.name': 'Adınız',
                'contact.email': 'E-posta Adresiniz',
                'contact.subject': 'Konu',
                'contact.message': 'Mesajınız',
                'contact.send': 'Mesaj Gönder',
                'contact.sending': 'Gönderiliyor...',
                'contact.success': 'Mesaj başarıyla gönderildi!',
                'contact.error': 'Mesaj gönderilemedi. Lütfen tekrar deneyin.',
                
                // Footer
                'footer.tagline': 'Ruha dokunan müzikal deneyimler yaratıyorum',
                'footer.links': 'Hızlı Bağlantılar',
                'footer.social': 'Beni Takip Edin',
                'footer.contact_info': 'İletişim Bilgileri',
                'footer.rights': '© 2024 Hasan Arthur Altuntaş. Tüm hakları saklıdır.',
                
                // Loading & UI
                'loading.music': 'Müzik yükleniyor...',
                'loading.portfolio': 'Müzik portföyü yükleniyor...',
                'ui.close': 'Kapat',
                'ui.view': 'Görüntüle',
                'ui.play': 'Oynat',
                'ui.pause': 'Duraklat',
                'ui.next': 'Sonraki',
                'ui.previous': 'Önceki',
                'ui.volume': 'Ses',
                'ui.scroll': 'Aşağı kaydır',
                
                // Maintenance
                'maintenance.title': 'Bakım Modu',
                'maintenance.description': 'Müzik portföyümüzü sizler için daha iyi bir deneyim sunmak amacıyla güncelliyoruz. Kısa sürede gelişmiş özellikler ve yeni müziklerle geri döneceğiz.',
                'maintenance.progress': 'Güncelleme İlerliği',
                'maintenance.time': 'Tahmini süre: Birkaç saat',
                'maintenance.hint': 'Test erişimi için kod girin'
            }
        };
    }

    loadSavedLanguage() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved && this.supportedLangs.includes(saved)) {
                this.currentLang = saved;
            }
        } catch (e) {
            console.log('Language preference not accessible, using default');
        }
    }

    saveLanguage() {
        try {
            localStorage.setItem(this.storageKey, this.currentLang);
        } catch (e) {
            console.log('Cannot save language preference');
        }
    }

    createLanguageToggle() {
        const toggle = document.createElement('div');
        toggle.className = 'language-toggle';
        toggle.innerHTML = `
            <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">
                <span class="flag">🇺🇸</span>
                <span class="lang-text">EN</span>
            </button>
            <button class="lang-btn ${this.currentLang === 'tr' ? 'active' : ''}" data-lang="tr">
                <span class="flag">🇹🇷</span>
                <span class="lang-text">TR</span>
            </button>
        `;
        
        // Add to navigation
        const navbar = document.querySelector('.nav-container');
        if (navbar) {
            navbar.appendChild(toggle);
        }
        
        // Add event listeners
        toggle.addEventListener('click', (e) => {
            const btn = e.target.closest('.lang-btn');
            if (btn) {
                const newLang = btn.dataset.lang;
                if (newLang !== this.currentLang) {
                    this.switchLanguage(newLang);
                }
            }
        });
    }

    switchLanguage(newLang) {
        if (!this.supportedLangs.includes(newLang)) return;
        
        this.currentLang = newLang;
        this.saveLanguage();
        this.applyTranslations();
        this.updateToggleButtons();
        
        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: newLang } 
        }));
    }

    updateToggleButtons() {
        const buttons = document.querySelectorAll('.lang-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });
    }

    translate(key) {
        return this.translations[this.currentLang][key] || this.translations.en[key] || key;
    }

    applyTranslations() {
        // Apply translations to all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            const translation = this.translate(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else if (element.hasAttribute('title') || element.hasAttribute('aria-label')) {
                if (element.hasAttribute('title')) element.title = translation;
                if (element.hasAttribute('aria-label')) element.setAttribute('aria-label', translation);
            } else {
                element.textContent = translation;
            }
        });

        // Update document lang attribute
        document.documentElement.lang = this.currentLang;
        
        // Update page title if needed
        if (this.currentLang === 'tr') {
            document.title = 'Hasan Arthur Altuntaş - Müzik Portföyü';
        } else {
            document.title = 'Hasan Arthur Altuntaş - Music Portfolio';
        }
    }

    // Helper method for dynamic content
    t(key) {
        return this.translate(key);
    }
}

// Initialize language system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.languageSystem = new LanguageSystem();
});

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSystem;
}