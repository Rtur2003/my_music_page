# Canlıya Alma Öncesi Kontrol Listesi

## ✅ Zorunlu Güncellemeler

### 1. Domain Adreslerini Güncelleyin
`index.html` dosyasında şu yerleri gerçek domain'inizle değiştirin:

```html
<!-- Şu satırları bulun ve değiştirin: -->
<meta property="og:url" content="https://www.muzikportfoyu.com/">
<meta property="og:image" content="https://www.muzikportfoyu.com/assets/images/og-image.jpg">
<meta name="twitter:image" content="https://www.muzikportfoyu.com/assets/images/og-image.jpg">
<link rel="canonical" href="https://www.muzikportfoyu.com/">

<!-- GERÇEK domain'inizle değiştirin: -->
<meta property="og:url" content="https://your-site.netlify.app/">
```

### 2. Sitemap.xml Güncelleyin
`sitemap.xml` dosyasında tüm URL'leri değiştirin:
```xml
<!-- https://www.muzikportfoyu.com/ yerine gerçek domain -->
<loc>https://your-site.netlify.app/</loc>
```

### 3. Kendi İçeriklerinizi Ekleyin

#### Resimler
`assets/images/` klasörüne ekleyin:
- `hero-musician.jpg` - Ana sayfa resminiz
- `about-me.jpg` - Hakkımda fotoğrafınız  
- `gallery-1.jpg` ile `gallery-6.jpg` - Galeri fotoğrafları
- `album-cover-1.jpg` ile `album-cover-4.jpg` - Albüm kapakları

#### Müzikler
`assets/music/` klasörüne ekleyin:
- `sample-track.mp3` - İlk şarkınız
- `sample-track-2.mp3` - İkinci şarkınız
- vb.

### 4. Kişisel Bilgilerinizi Güncelleyin
`index.html` dosyasında şunları değiştirin:

```html
<!-- İletişim bilgileri -->
<p><i class="fas fa-envelope"></i> info@muzikportfoyu.com</p>
<p><i class="fas fa-phone"></i> +90 555 123 45 67</p>

<!-- Sosyal medya linkleri -->
<a href="#" class="social-link"> <!-- Gerçek linkler ekleyin -->

<!-- Şarkı adları ve bilgileri -->
<h4>Rüya Gibi</h4> <!-- Kendi şarkı adlarınız -->
```

## 🎵 Müzik Dosyası Formatları

Desteklenen formatlar:
- ✅ MP3 (en uyumlu)
- ✅ WAV
- ✅ OGG
- ❌ FLAC (dosya boyutu çok büyük)

## 📱 Test Edin

Canlıya almadan önce test edin:
1. `index.html` dosyasını tarayıcıda açın
2. Tüm linkler çalışıyor mu?
3. Müzik çalar çalışıyor mu?
4. Galeri açılıyor mu?
5. İletişim formu çalışıyor mu?
6. Mobilde nasıl görünüyor?

## 🔍 SEO İçin

- Google Search Console hesabı açın
- Sitenizi ekleyin ve sitemap gönderin
- Google Analytics ekleyin (opsiyonel)

## 🚀 Canlıya Alma Sonrası

1. **SSL kontrolü:** https:// ile erişilebildiğinden emin olun
2. **Hız testi:** [PageSpeed Insights](https://pagespeed.web.dev/) ile test edin
3. **Sosyal medya testi:** Facebook/Twitter'da link paylaştığınızda preview doğru görünüyor mu?
4. **Mobile test:** Mobil cihazlardan test edin