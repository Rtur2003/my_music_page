# 🚨 GIT DOSYA KURTARMA REHBERİ
## Yanlışlıkla Silinen Dosyaları Geri Getir

---

## ⚡ ACİL KURTARMA KOMUTLARI

### **1. Son Commit'ten Geri Getir**
```bash
# Tüm silinen dosyaları geri getir
git checkout HEAD -- .

# Belirli dosyayı geri getir
git checkout HEAD -- index.html
git checkout HEAD -- admin.html
git checkout HEAD -- assets/css/style.css
```

### **2. Staging Area'dan Geri Getir**
```bash
# Staged değişiklikleri unstage et
git reset HEAD .

# Working directory'yi temizle
git checkout -- .
```

### **3. Belirli Commit'ten Geri Getir**
```bash
# Commit geçmişini görüntüle
git log --oneline

# Belirli commit'ten dosya geri getir
git checkout COMMIT_HASH -- dosya_adi.html
```

---

## 🛡️ HAYATI ÖNEM TAŞIYAN DOSYALAR

### **❌ ASLA .gitignore'a EKLEMEYİN:**

#### **🏠 Ana Site Dosyaları:**
```
index.html           # Ana sayfa - MUTLAKa gerekli
admin.html           # Admin paneli - MUTLAKa gerekli
.htaccess           # HTTPS yönlendirme - MUTLAKa gerekli
favicon.ico         # Site ikonu - MUTLAKa gerekli
```

#### **🎨 Asset Dosyaları:**
```
assets/css/style.css         # Ana stiller - MUTLAKa gerekli
assets/css/animations.css    # Animasyonlar - MUTLAKa gerekli
assets/css/admin.css        # Admin stilleri - MUTLAKa gerekli
assets/js/main.js           # Ana JavaScript - MUTLAKa gerekli
assets/js/admin-secure.js   # Güvenli admin - MUTLAKa gerekli
assets/js/music-player.js   # Müzik player - MUTLAKa gerekli
```

#### **🖼️ Görsel Dosyaları:**
```
assets/images/           # Tüm görseller - MUTLAKa gerekli
assets/images/*.jpg      # JPEG dosyalar - MUTLAKa gerekli
assets/images/*.png      # PNG dosyalar - MUTLAKa gerekli
assets/images/*.svg      # SVG dosylar - MUTLAKa gerekli
```

#### **🔍 SEO ve Meta Dosyaları:**
```
robots.txt              # Arama motoru rehberi - MUTLAKa gerekli
sitemap.xml            # Site haritası - MUTLAKa gerekli
schema.json            # Structured data - MUTLAKa gerekli
manifest.json          # PWA manifest - MUTLAKa gerekli
```

#### **📋 Dokümantasyon:**
```
*.md dosyaları          # README, rehberler - MUTLAKa gerekli
KULLANIM-REHBERI.md    # Kullanım rehberi - MUTLAKa gerekli
SEO-ROADMAP.md         # SEO stratejisi - MUTLAKa gerekli
```

---

## ✅ GÜVENLİ IGNORE EDİLEBİLECEKLER

### **🗑️ Bu dosyalar ignore edilebilir:**
```
# Development
node_modules/          # NPM paketleri
.env                   # Çevre değişkenleri  
.vscode/settings.json  # Editor ayarları
logs/                  # Log dosyaları
*.log                  # Debug logları

# Temporary
*.tmp                  # Geçici dosyalar
.cache/               # Cache dosyaları
.DS_Store             # Mac sistem dosyaları
Thumbs.db             # Windows önizleme

# Build (sadece geçici)
dist-temp/            # Geçici build çıktıları
build-temp/           # Geçici yapılar
```

---

## 🔄 DOSYA KURTARMA ADIM ADIM

### **Senaryo 1: Tüm dosyalar silindi**
```bash
# 1. Repository durumunu kontrol et
git status

# 2. Tüm değişiklikleri iptal et
git reset --hard HEAD

# 3. Temiz working directory
git clean -fd

# 4. Dosyaları kontrol et
ls -la
```

### **Senaryo 2: Belirli dosyalar kayıp**
```bash
# 1. Hangi dosyaların kayıp olduğunu görü
git status

# 2. Kayıp dosyaları geri getir
git checkout HEAD -- index.html
git checkout HEAD -- admin.html
git checkout HEAD -- assets/

# 3. Doğrula
git status
```

### **Senaryo 3: Commit yapıldı, sonra fark edildi**
```bash
# 1. Son commit'i geri al (dosyalar kalır)
git reset --soft HEAD~1

# 2. Veya son commit'i tamamen sil
git reset --hard HEAD~1

# 3. Force push (DİKKATLİ!)
git push --force-with-lease origin main
```

---

## 🛠️ GİT REPOSITORY TEMİZLİĞİ

### **Repository'yi Düzenle:**
```bash
# 1. Untracked dosyaları göster
git clean -n

# 2. Untracked dosyaları sil (DİKKAT!)
git clean -f

# 3. Dizinleri de sil
git clean -fd

# 4. Ignored dosyaları da sil
git clean -fX
```

### **Büyük Dosyaları Bul ve Temizle:**
```bash
# 1. Büyük dosyaları bul
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sed -n 's/^blob //p' | sort --numeric-sort --key=2 | tail -10

# 2. Git history'den dosya sil
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch assets/large-file.mp4' \
  --prune-empty --tag-name-filter cat -- --all
```

---

## 📋 GÜNLÜK GIT WORKFLOW

### **Güvenli Git Kullanımı:**
```bash
# 1. Durum kontrolü (her zaman)
git status

# 2. Değişiklikleri görüntüle
git diff

# 3. Seçici add (tümünü değil)
git add index.html admin.html

# 4. Commit mesajı ile
git commit -m "feat: admin paneli güvenlik güncellemesi"

# 5. Push etmeden önce kontrol
git log --oneline -5

# 6. Push
git push origin main
```

---

## 🚨 ACİL DURUMLAR

### **Repository Bozulduysa:**
```bash
# 1. Klonu kontrol et
git fsck

# 2. Corrupted nesneleri temizle
git gc --prune=now

# 3. Remote'tan temiz çek
git fetch origin
git reset --hard origin/main
```

### **Merge Conflict:**
```bash
# 1. Conflict'leri görüntüle
git status

# 2. Manuel çözüm
# Dosyaları edit et, <<<< ==== >>>> kısımları temizle

# 3. Conflict çözümünü mark et
git add conflicted_file.html

# 4. Merge'i tamamla
git commit -m "resolve: merge conflict fix"
```

---

## ✅ KONTROL LİSTESİ

### **Push Etmeden Önce Kontrol Et:**
- [ ] `index.html` var mı?
- [ ] `admin.html` var mı?
- [ ] `assets/css/style.css` var mı?
- [ ] `assets/js/` klasörü tam mı?
- [ ] `.htaccess` var mı?
- [ ] `robots.txt` var mı?
- [ ] `sitemap.xml` var mı?

### **Repository Temizliği:**
- [ ] `.gitignore` güvenli mi?
- [ ] Büyük dosyalar ignore edilmiş mi?
- [ ] Şifreler/keyler ignore edilmiş mi?
- [ ] Temp dosyalar ignore edilmiş mi?

---

**🎯 ÖNEMLİ: Yukarıdaki .gitignore dosyası güvenli! Sadece gereksiz dosyalar ignore ediliyor, production dosyaların tümü korunuyor! 🛡️**