# URL Güncelleme Rehberi

## 🎯 Sitenizin URL'i
GitHub Pages aktif olduktan sonra siteniz şu adreste yayında olacak:
**https://rtur2003.github.io/MYPAGE/**

## 📝 Güncellenecek Dosyalar

### 1. index.html - Meta Tags
Şu satırları bulun ve değiştirin:

```html
<!-- MEVCUT -->
<meta property="og:url" content="https://www.muzikportfoyu.com/">
<meta property="og:image" content="https://www.muzikportfoyu.com/assets/images/og-image.jpg">
<meta name="twitter:image" content="https://www.muzikportfoyu.com/assets/images/og-image.jpg">
<link rel="canonical" href="https://www.muzikportfoyu.com/">

<!-- YENİ - DEĞİŞTİRİN -->
<meta property="og:url" content="https://rtur2003.github.io/MYPAGE/">
<meta property="og:image" content="https://rtur2003.github.io/MYPAGE/assets/images/og-image.jpg">
<meta name="twitter:image" content="https://rtur2003.github.io/MYPAGE/assets/images/og-image.jpg">
<link rel="canonical" href="https://rtur2003.github.io/MYPAGE/">
```

### 2. sitemap.xml - Tüm URL'ler
Dosyada tüm URL'leri değiştirin:

```xml
<!-- MEVCUT -->
<loc>https://www.muzikportfoyu.com/</loc>

<!-- YENİ -->
<loc>https://rtur2003.github.io/MYPAGE/</loc>
```

### 3. Kişisel Bilgilerinizi Ekleyin

#### İletişim Bilgileri (index.html)
```html
<!-- Güncelleyin -->
<p><i class="fas fa-envelope"></i> your-email@gmail.com</p>
<p><i class="fas fa-phone"></i> +90 5XX XXX XX XX</p>
```

#### Sosyal Medya Linkleri
```html
<!-- Gerçek linklerinizi ekleyin -->
<a href="https://open.spotify.com/artist/yourartist" class="social-link">
<a href="https://www.youtube.com/channel/yourchannel" class="social-link">
<a href="https://www.instagram.com/yourusername" class="social-link">
```

## 🎵 Müzik ve Resim Ekleme

### Müzik Dosyaları
`assets/music/` klasörüne MP3 dosyalarınızı ekleyin:
- Maksimum 10MB per dosya (GitHub limiti)
- MP3 format önerili

### Resimler
`assets/images/` klasörüne ekleyin:
- hero-musician.jpg (ana sayfa fotoğrafınız)
- about-me.jpg (hakkımda fotoğrafınız)
- gallery-1.jpg, gallery-2.jpg... (galeri fotoğrafları)
- album-cover-1.jpg... (albüm kapakları)

## 📱 Test Listesi
Yükleme tamamlandıktan sonra test edin:

✅ Ana sayfa açılıyor mu?
✅ Müzik çalar çalışıyor mu?
✅ Galeri filtreleri çalışıyor mu?
✅ Admin panel açılıyor mu?
✅ İletişim formu çalışıyor mu?
✅ Mobilde doğru görünüyor mu?