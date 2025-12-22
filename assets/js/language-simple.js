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
                'nav.updates': 'Updates',
                'nav.contact': 'Contact',
                
                // Hero Section
                'hero.title': 'HASAN ARTHUR',
                'hero.subtitle': 'Pianist, Composer & Computer Engineer',
                'hero.description': 'I compose cinematic ambient music on piano and study Computer Engineering. From autonomous vehicle vision systems to open-source tools, I blend AI assistance with hands-on coding to create solutions that matter.',
                'hero.listen': 'Check Out My Music',
                'hero.about': 'Get to Know Me',
                
                // Stats
                'stats.albums': 'Albums',
                'stats.tracks': 'Tracks',
                'stats.plays': 'Total Plays',
                'stats.platforms': 'Platforms',
                
                // Music Section
                'music.title': 'My Music',
                'music.subtitle': 'Piano-driven Cinematic Ambient Compositions',
                'music.tracks.title': 'Singles',
                'music.albums.title': 'Albums',
                'music.player.ready': 'Music player ready for streaming from platforms.',
                'music.player.select': 'Select a track',
                'music.player.artist': 'Hasan Arthur Altuntaş',
                'music.player.spotify': 'Listen on Spotify',
                'music.player.youtube': 'Watch on YouTube',
                'music.player.apple': 'Listen on Apple Music',
                'music.player.soundcloud': 'Listen on SoundCloud',
                'music.watchVideo': 'Watch Video',
                'music.controls.previous': 'Previous Track',
                'music.controls.playPause': 'Play/Pause',
                'music.controls.next': 'Next Track',
                'music.controls.volume': 'Volume Control',
                'music.platforms.spotify': 'Listen on Spotify',
                'music.platforms.apple': 'Listen on Apple Music',
                'music.albums.play': 'Play Album',
                'music.albums.shuffle': 'Shuffle',
                'music.albums.youtube': 'Watch on YouTube',
                'music.albums.details': 'View Details',
                'music.albums.type': 'Album',
                'music.albums.playAll': 'Play All',
                'music.albums.description': 'This album is a special collection of cinematic music and film score interpretations. Each track is carefully selected and arranged to provide an atmospheric experience.',
                'gallery.update.badge': 'Latest Update',
                'gallery.features.studio': 'Studio Sessions',
                'gallery.features.live': 'Live Performances',
                'gallery.features.behind': 'Behind the Scenes',
                'gallery.progress.label': 'Progress',
                'gallery.notify.button': 'Get Notified',
                'gallery.update.time': 'Last updated: December 2024',

                // Social Updates Section
                'updates.title': '# Latest Updates',
                'updates.subtitle': 'Follow me across platforms',
                'updates.instagram.caption': 'New track "Cinematic Dreams" is live! 🎵',
                'updates.instagram.location': 'Recording Studio',
                'updates.twitter.text': 'Working on some epic orchestral arrangements tonight! Can\'t wait to share what I\'ve been cooking up 🎼✨',
                'updates.youtube.title': 'Behind the Scenes: Creating "Epic Journey"',
                'updates.youtube.views': '1.2K views',
                'updates.subscribe.title': 'Stay Updated',
                'updates.subscribe.text': 'Get notified about new releases and behind-the-scenes content',
                'updates.subscribe.placeholder': 'Enter your email',
                'updates.subscribe.button': 'Subscribe',

                // Panels
                'panels.title': 'Community Panels',
                'panels.subtitle': 'Quick links to socials and support',

                // About Section
                'about.title': 'Who Am I?',
                'about.subtitle': 'Music, Code & Everything In Between',
                'about.text': 'Born in 2003, I\'m a Computer Engineering student who plays piano and composes cinematic ambient music. I\'ve worked on autonomous vehicle computer vision, target detection models, and build web applications. I create open-source tools on GitHub, leveraging AI while keeping hands-on control over every project.',
                
                // Software Section
                'software.title': 'My Code Adventures',
                'software.subtitle': 'Where creativity meets algorithms',
                'software.description': 'Computer Engineering student specializing in autonomous vehicle vision systems and target detection models. I build full-stack web applications (Python, TypeScript, React, Angular) and create practical open-source tools. I use AI assistance strategically while maintaining hands-on development skills.',
                'software.technologies': 'My Toolbox',
                'software.details': 'See All My Projects',
                'software.stats.commits': 'GitHub Commits',
                'software.stats.repos': 'Public Repositories',
                'software.stats.languages': 'Programming Languages',
                'software.stats.years': 'Years Coding',
                
                // Gallery Section
                'gallery.title': 'Gallery',
                'gallery.subtitle': 'Behind the scenes & live performances',
                'gallery.all': 'All',
                'gallery.live': 'Live Performance',
                'gallery.studio': 'Studio Work',
                'gallery.behind': 'Behind Scenes',
                'gallery.coming.title': 'Photos Coming Soon',
                'gallery.coming.desc': 'I\'m currently working on capturing some great photos from my studio sessions and live performances. Stay tuned for the gallery update!',
                'gallery.coming.button': 'Get Notified',
                'gallery.status.working': 'Currently Working',
                'gallery.preview.studio': 'Studio Sessions',
                'gallery.preview.live': 'Live Performances',
                'gallery.preview.behind': 'Behind Scenes',
                'gallery.notify.subtitle': 'Follow for updates',
                'gallery.progress.complete': 'Complete',
                
                // Contact Section
                'contact.title': 'Let\'s Connect!',
                'contact.subtitle': 'Got a cool project idea? Let\'s make it happen!',
                'contact.description': 'Ready to collaborate on your next project? Whether it\'s music production, composition, or software development, I\'d love to hear from you.',
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
                'footer.tagline': 'Music Producer & AI Developer',
                'footer.social': 'Follow Me',
                'footer.rights': 'All rights reserved.',
                'footer.made': 'Made with',

                // Support
                'support.title': 'Support'
            },
            tr: {
                // Navigation
                'nav.home': 'Ana Sayfa',
                'nav.about': 'Hakkımda',
                'nav.music': 'Müzik',
                'nav.software': 'Yazılım',
                'nav.gallery': 'Galeri',
                'nav.updates': 'Güncellemeler',
                'nav.contact': 'İletişim',
                
                // Hero Section
                'hero.title': 'HASAN ARTHUR',
                'hero.subtitle': 'Piyanist, Besteci & Bilgisayar Mühendisi',
                'hero.description': 'Piyano ile sinematik ambient müzikler besteliyorum ve Bilgisayar Mühendisliği okuyorum. İnsansız araç görüntü sistemlerinden açık kaynak araçlara kadar, AI desteği ile hands-on kodlama birleştirerek anlamlı çözümler üretiyorum.',
                'hero.listen': 'Müziklerimi Keşfet',
                'hero.about': 'Beni Tanı',
                
                // Stats
                'stats.albums': 'Albüm',
                'stats.tracks': 'Şarkı',
                'stats.plays': 'Toplam Dinlenme',
                'stats.platforms': 'Platform',
                
                // Music Section
                'music.title': 'Müziklerim',
                'music.subtitle': 'Piyano Temelli Sinematik Ambient Kompozisyonlar',
                'music.tracks.title': 'Tekli Şarkılar',
                'music.albums.title': 'Albümler',
                'music.player.ready': 'Müzik çalar platformlardan akış için hazır.',
                'music.player.select': 'Bir şarkı seçin',
                'music.player.artist': 'Hasan Arthur Altuntaş',
                'music.player.spotify': 'Spotify\'da Dinle',
                'music.player.youtube': 'YouTube\'da İzle',
                'music.player.apple': 'Apple Music\'te Dinle',
                'music.player.soundcloud': 'SoundCloud\'da Dinle',
                'music.watchVideo': 'Video İzle',
                'music.controls.previous': 'Önceki Şarkı',
                'music.controls.playPause': 'Oynat/Durdur',
                'music.controls.next': 'Sonraki Şarkı',
                'music.controls.volume': 'Ses Kontrolü',
                'music.platforms.spotify': 'Spotify\'da Dinle',
                'music.platforms.apple': 'Apple Music\'te Dinle',
                'music.albums.play': 'Albümü Çal',
                'music.albums.shuffle': 'Karışık Çal',
                'music.albums.youtube': 'YouTube\'da İzle',
                'music.albums.details': 'Detayları Gör',
                'music.albums.type': 'Albüm',
                'music.albums.playAll': 'Tümünü Çal',
                'music.albums.description': 'Bu albüm, sinematik müzik ve film score yorumlarından oluşan özel bir koleksiyon. Her parça dikkatle seçilmiş ve atmosferik bir deneyim sunmak için düzenlenmiş.',
                'gallery.update.badge': 'Son Güncelleme',
                'gallery.features.studio': 'Stüdyo Seansları',
                'gallery.features.live': 'Canlı Performanslar',
                'gallery.features.behind': 'Sahne Arkası',
                'gallery.progress.label': 'İlerleme',
                'gallery.notify.button': 'Bildirim Al',
                'gallery.update.time': 'Son güncelleme: Aralık 2024',

                // Social Updates Section
                'updates.title': '# Son Güncellemeler',
                'updates.subtitle': 'Platformlarda beni takip et',
                'updates.instagram.caption': 'Yeni parçam "Cinematic Dreams" yayında! 🎵',
                'updates.instagram.location': 'Kayıt Stüdyosu',
                'updates.twitter.text': 'Bu gece epik orkestral düzenlemeler üzerinde çalışıyorum! Hazırladığım şeyleri paylaşmak için sabırsızlanıyorum 🎼✨',
                'updates.youtube.title': 'Sahne Arkası: "Epic Journey" Yaratmak',
                'updates.youtube.views': '1,2B görüntüleme',
                'updates.subscribe.title': 'Güncel Kal',
                'updates.subscribe.text': 'Yeni çıkanlar ve sahne arkası içeriklerden haberdar ol',
                'updates.subscribe.placeholder': 'E-posta adresin',
                'updates.subscribe.button': 'Abone Ol',

                // About Section
                'about.title': 'Ben Kimim?',
                'about.subtitle': 'Müzik, Kod ve Aradaki Her Şey',
                'about.text': '2003 doğumluyum, Bilgisayar Mühendisliği öğrencisiyim, piyano çalıyor ve sinematik ambient müzikler besteliyorum. İnsansız araç bilgisayar görüsü, hedef tespit modelleri üzerinde çalıştım ve web uygulamaları geliştiriyorum. GitHub\'da açık kaynak araçlar üretiyor, AI desteği alırken her projeyi elimle kontrol ediyorum.',
                
                // Software Section
                'software.title': 'Kod Maceraları',
                'software.subtitle': 'Yaratıcılığın algoritmayla buluştuğu yer',
                'software.description': 'Bilgisayar Mühendisliği öğrencisiyim, insansız araç görüntü sistemleri ve hedef tespit modelleri konusunda uzmanlaşıyorum. Full-stack web uygulamaları (Python, TypeScript, React, Angular) geliştiriyor ve pratik açık kaynak araçlar üretiyorum. AI desteğini stratejik kullanıp hands-on geliştirme becerilerimi koruyorum.',
                'software.technologies': 'Araç Çantam',
                'software.details': 'Tüm Projelerime Bak',
                'software.stats.commits': 'GitHub Commit',
                'software.stats.repos': 'Açık Repo',
                'software.stats.languages': 'Programlama Dili',
                'software.stats.years': 'Yıllık Deneyim',
                
                // Gallery Section
                'gallery.title': 'Galeri',
                'gallery.subtitle': 'Sahne arkası ve canlı performanslar',
                'gallery.all': 'Hepsi',
                'gallery.live': 'Canlı Performans',
                'gallery.studio': 'Stüdyo Çalışması',
                'gallery.behind': 'Sahne Arkası',
                'gallery.coming.title': 'Fotoğraflar Çok Yakında',
                'gallery.coming.desc': 'Şu anda stüdyo seanslarım ve canlı performanslarımdan güzel fotoğraflar çekmeye odaklanıyorum. Galeri güncellemesi için takipte kalın!',
                'gallery.coming.button': 'Bildirim Al',
                'gallery.status.working': 'Şu Anda Çalışıyorum',
                'gallery.preview.studio': 'Stüdyo Seansları',
                'gallery.preview.live': 'Canlı Performanslar',
                'gallery.preview.behind': 'Sahne Arkası',
                'gallery.notify.subtitle': 'Güncellemeler için takip et',
                'gallery.progress.complete': 'Tamamlandı',
                
                // Contact Section
                'contact.title': 'Hadi Konuşalım!',
                'contact.subtitle': 'Havalı bir proje fikrin var mı? Beraber gerçekleştirelim!',
                'contact.description': 'Bir sonraki projenizde işbirliği yapmaya hazır mısın? Müzik prodüksiyonu, kompozisyon veya yazılım geliştirme olsun, senden haber almayı çok isterim.',
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
                'footer.tagline': 'Müzik Prodüktörü & AI Geliştirici',
                'footer.social': 'Takip Et',
                'footer.rights': 'Tüm hakları saklıdır.',
                'footer.made': 'İle yapıldı',

                // Support
                'support.title': 'Destek Ol'
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
