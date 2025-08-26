# 🗑️ GIT REPOSITORY TEMİZLEME
## Git'e Gitmemesi Gereken Dosyaları Sil

---

## 🚨 SİLİNECEK DOSYALAR LİSTESİ

### **🔧 Development/Debug Dosyaları:**
```
.claude/settings.local.json     # Claude ayarları - LOCAL
MyPage.code-workspace          # VS Code workspace - LOCAL
config.json                    # Konfigürasyon - GÜVENLİK
deploy-netlify.md             # Deploy notları - LOCAL
duplicate_media_queries.txt   # Debug dosyası - LOCAL
```

### **💾 Backup Dosyaları:**
```
assets/css/admin.css.backup    # CSS backup - GEREKSIZ
assets/js/admin.js.backup      # JS backup - GEREKSIZ
assets/css/admin-bloated.css   # Eski CSS - GEREKSIZ
assets/js/admin-clean.js       # Eski JS - GEREKSIZ
assets/js/admin.js            # Eski admin JS - GEREKSIZ
```

### **🚫 Disabled Dosyaları:**
```
assets/js/logger.js.disabled   # Disabled logger - GEREKSIZ
assets/js/pwa-manager.js.disabled # Disabled PWA - GEREKSIZ
sw.js.disabled                # Disabled service worker - GEREKSIZ
```

---

## ⚡ HEMEN UYGULA - TEMİZLEME KOMUTLARI

### **1. Dosyaları Git'ten Sil (Ama Local'de Bırak):**
```bash
cd "C:\Users\MONSTER\Desktop\MyPage"

# Claude ayarları
git rm --cached .claude/settings.local.json

# Development dosyaları
git rm --cached MyPage.code-workspace
git rm --cached config.json
git rm --cached deploy-netlify.md
git rm --cached duplicate_media_queries.txt

# Backup dosyaları
git rm --cached assets/css/admin.css.backup
git rm --cached assets/js/admin.js.backup
git rm --cached assets/css/admin-bloated.css
git rm --cached assets/js/admin-clean.js
git rm --cached assets/js/admin.js

# Disabled dosyaları
git rm --cached assets/js/logger.js.disabled
git rm --cached assets/js/pwa-manager.js.disabled
git rm --cached sw.js.disabled
```

### **2. Commit et:**
```bash
git add .
git commit -m "cleanup: remove development and backup files from git tracking"
```

### **3. Push et:**
```bash
git push origin main
```

---

## 🛡️ KORUNAN DOSYALAR (Git'te KALACAK)

### **✅ Production Dosyaları:**
```
index.html                    # Ana sayfa
admin.html                   # Admin paneli
.htaccess                    # HTTPS ayarları
favicon.ico                  # Site ikonu
robots.txt                   # SEO
sitemap.xml                  # Site haritası
schema.json                  # Structured data
manifest.json                # PWA manifest
netlify.toml                 # Netlify config
_redirects                   # Netlify redirects
```

### **✅ Aktif CSS/JS:**
```
assets/css/style.css         # Ana CSS
assets/css/animations.css    # Animasyonlar
assets/css/admin.css         # Admin CSS
assets/css/compatibility.css # Uyumluluk
assets/js/main.js           # Ana JS
assets/js/admin-secure.js   # Güvenli admin (YENİ)
assets/js/advanced-animations.js # Animasyonlar
assets/js/music-player.js   # Müzik player
assets/js/gallery.js        # Galeri
```

### **✅ Görseller:**
```
assets/images/admin-avatar.svg # Admin avatar
```

### **✅ Dokümantasyon:**
```
README.md                    # Ana README
SECURITY.md                  # Güvenlik
KULLANIM-REHBERI.md         # Kullanım rehberi
SEO-ROADMAP.md              # SEO stratejisi
HTTPS-SORUN-ÇÖZÜMÜ.md       # HTTPS rehberi
GIT-DOSYA-KURTARMA.md       # Git rehberi
GIT-KURTARMA-REHBERİ.md     # Git kurtarma
.gitignore                  # Git ignore
```

---

## 🔥 TEK KOMUTLA TEMİZLE

### **Hepsini Bir Seferde Sil:**
```bash
cd "C:\Users\MONSTER\Desktop\MyPage"

# Tek komutta tümü
git rm --cached \
  .claude/settings.local.json \
  MyPage.code-workspace \
  config.json \
  deploy-netlify.md \
  duplicate_media_queries.txt \
  assets/css/admin.css.backup \
  assets/js/admin.js.backup \
  assets/css/admin-bloated.css \
  assets/js/admin-clean.js \
  assets/js/admin.js \
  assets/js/logger.js.disabled \
  assets/js/pwa-manager.js.disabled \
  sw.js.disabled

# Commit et
git commit -m "cleanup: remove dev/backup files from git"

# Push et
git push origin main
```

---

## 📊 ÖNCESİ/SONRASI

### **Öncesi (Tracked Files: 42):**
- Development dosyaları ✓ (Git'te)  
- Backup dosyaları ✓ (Git'te)
- Disabled dosyaları ✓ (Git'te)
- Production dosyaları ✓ (Git'te)

### **Sonrası (Tracked Files: ~30):**
- Development dosyaları ❌ (Git'te YOK, Local'de VAR)
- Backup dosyaları ❌ (Git'te YOK, Local'de VAR) 
- Disabled dosyaları ❌ (Git'te YOK, Local'de VAR)
- Production dosyaları ✅ (Git'te VAR)

---

## 🎯 SONUÇ

Bu temizleme sonrasında:
- 🏠 **Local dosyaların tümü duracak** (silinmeyecek)
- 🌐 **Git'te sadece production dosyalar kalacak**
- 📦 **Repository boyutu küçülecek**
- 🚀 **Clone/pull işlemleri hızlanacak**
- 🛡️ **Güvenlik artacak** (config.json git'te olmayacak)

**Hazır mısın? Komutları çalıştır! 🚀**