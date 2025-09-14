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
                'hero.subtitle': 'Music Producer & Developer',
                'hero.description': 'Hey there! I create cinematic music that tells stories and build cool AI projects. Every track I make has a piece of my soul in it, and every line of code solves a real problem.',
                'hero.listen': 'Check Out My Music',
                'hero.about': 'Get to Know Me',
                
                // Stats
                'stats.albums': 'Albums',
                'stats.tracks': 'Tracks',
                'stats.platforms': 'Platforms',
                
                // Music Section
                'music.title': 'My Music',
                'music.subtitle': 'Cinematic Compositions & Film Score Reimaginings',
                'music.tracks.title': 'Singles',
                'music.albums.title': 'Albums',
                'music.player.ready': 'Music player ready for streaming from platforms.',
                'music.player.select': 'Select a track',
                'music.player.artist': 'Hasan Arthur Altuntaş',
                'music.player.spotify': 'Listen on Spotify',
                'music.player.youtube': 'Watch on YouTube',
                'music.player.apple': 'Listen on Apple Music',
                'music.player.soundcloud': 'Listen on SoundCloud',
                
                // About Section
                'about.title': 'Who Am I?',
                'about.subtitle': 'Music, Code & Everything In Between',
                'about.text': 'Born in 2003, I\'m that guy who codes by day and makes beats by night! I study Computer Science and love creating atmospheric music that makes you feel something. Whether I\'m training AI models or composing the next "Interstellar but my version" 😄, I pour my heart into everything I do.',
                
                // Software Section
                'software.title': 'My Code Adventures',
                'software.subtitle': 'Where creativity meets algorithms',
                'software.description': 'I\'m a Computer Science student who loves building AI tools and web apps. From YouTube comment generators to computer vision projects, I create stuff that actually solves problems (and sometimes just for fun 😅).',
                'software.technologies': 'My Toolbox',
                'software.details': 'See All My Projects',
                
                // Gallery Section
                'gallery.title': 'Gallery',
                'gallery.subtitle': 'Behind the scenes & live performances',
                'gallery.all': 'All',
                'gallery.live': 'Live Performance',
                'gallery.studio': 'Studio Work',
                'gallery.behind': 'Behind Scenes',
                'gallery.coming.title': 'Photos Coming Soon',
                'gallery.coming.desc': 'I\'m currently working on capturing some great photos from my studio sessions and live performances. Stay tuned for the gallery update!',
                'gallery.coming.button': 'See Current Photos',
                
                // Contact Section
                'contact.title': 'Let\'s Connect!',
                'contact.subtitle': 'Got a cool project idea? Let\'s make it happen!',
                'contact.name': 'Your Name',
                'contact.email': 'E-posta',
                'contact.phone': 'Phone',
                'contact.location': 'Location',
                'contact.subject': 'What\'s up?',
                'contact.message': 'Tell me your idea...',
                'contact.send': 'Send It!',
                
                // Skills
                'skills.instruments': 'Multi-Instrumentalist',
                'skills.production': 'Music Production',
                'skills.composition': 'Music Composition',
                'skills.mixing': 'Mixing & Mastering',
                
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
                'hero.subtitle': 'Müzik Prodüktörü & Yazılımcı',
                'hero.description': 'Merhaba! Hikaye anlatan sinematik müzikler yapıyorum ve havalı AI projeleri geliştiriyorum. Yaptığım her parçada ruhumdan bir parça var, yazdığım her kod gerçek problemleri çözüyor.',
                'hero.listen': 'Müziklerimi Keşfet',
                'hero.about': 'Beni Tanı',
                
                // Stats
                'stats.albums': 'Albüm',
                'stats.tracks': 'Şarkı',
                'stats.platforms': 'Platform',
                
                // Music Section
                'music.title': 'Müziklerim',
                'music.subtitle': 'Sinematik Kompozisyonlar ve Film Müziği Yorumları',
                'music.tracks.title': 'Tekli Şarkılar',
                'music.albums.title': 'Albümler',
                'music.player.ready': 'Müzik çalar platformlardan akış için hazır.',
                'music.player.select': 'Bir şarkı seçin',
                'music.player.artist': 'Hasan Arthur Altuntaş',
                'music.player.spotify': 'Spotify\'da Dinle',
                'music.player.youtube': 'YouTube\'da İzle',
                'music.player.apple': 'Apple Music\'te Dinle',
                'music.player.soundcloud': 'SoundCloud\'da Dinle',
                
                // About Section
                'about.title': 'Ben Kimim?',
                'about.subtitle': 'Müzik, Kod ve Aradaki Her Şey',
                'about.text': '2003 doğumluyum, gündüz kod yazan gece beat yapan tipim! Bilgisayar Mühendisliği okuyorum ve insanı hissettiren atmosferik müzikler yapmayı seviyorum. AI modellerini eğitirken de olsa, "Interstellar but my version" gibi parçalar bestelerken de 😄, yaptığım her şeye kalbimi koyuyorum.',
                
                // Software Section
                'software.title': 'Kod Maceraları',
                'software.subtitle': 'Yaratıcılığın algoritmayla buluştuğu yer',
                'software.description': 'Bilgisayar Mühendisliği öğrencisiyim ve AI araçları ile web uygulamaları yapmayı seviyorum. YouTube yorum üreticilerinden bilgisayar görüsü projelerine kadar, gerçek problemleri çözen şeyler yapıyorum (bazen de sadece eğlence için 😅).',
                'software.technologies': 'Araç Çantam',
                'software.details': 'Tüm Projelerime Bak',
                
                // Gallery Section
                'gallery.title': 'Galeri',
                'gallery.subtitle': 'Sahne arkası ve canlı performanslar',
                'gallery.all': 'Hepsi',
                'gallery.live': 'Canlı Performans',
                'gallery.studio': 'Stüdyo Çalışması',
                'gallery.behind': 'Sahne Arkası',
                'gallery.coming.title': 'Fotoğraflar Çok Yakında',
                'gallery.coming.desc': 'Şu anda stüdyo seanslarım ve canlı performanslarımdan güzel fotoğraflar çekmeye odaklanıyorum. Galeri güncellemesi için takipte kalın!',
                'gallery.coming.button': 'Mevcut Fotoğrafları Gör',
                
                // Contact Section
                'contact.title': 'Hadi Konuşalım!',
                'contact.subtitle': 'Havalı bir proje fikrin var mı? Beraber gerçekleştirelim!',
                'contact.name': 'İsmin',
                'contact.email': 'E-posta',
                'contact.phone': 'Telefon', 
                'contact.location': 'Konum',
                'contact.subject': 'Konu nedir?',
                'contact.message': 'Fikrini anlat...',
                'contact.send': 'Gönder Gitsin!',
                
                // Skills
                'skills.instruments': 'Çok Enstrümanlı',
                'skills.production': 'Müzik Prodüksiyonu',
                'skills.composition': 'Müzik Kompozisyonu', 
                'skills.mixing': 'Mix & Master',
                
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