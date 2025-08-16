# GitHub Pages ile Canlıya Alma Rehberi

## Adım 1: GitHub Hesabı ve Repository Oluşturun

1. [github.com](https://github.com) hesabı açın
2. "New repository" butonuna tıklayın
3. Repository adı: `music-portfolio` veya `username.github.io`
4. Public olarak işaretleyin
5. "Create repository" tıklayın

## Adım 2: Dosyaları GitHub'a Yükleyin

### Yöntem A: GitHub Web Interface (Kolay)
1. Repository sayfasında "uploading an existing file" linkine tıklayın
2. MyPage klasöründeki tüm dosyaları sürükleyin
3. Commit message yazın: "Initial commit - Music portfolio website"
4. "Commit changes" tıklayın

### Yöntem B: Git ile (İleri seviye)
```bash
# Terminal/Command Prompt açın ve MyPage klasöründe:
git init
git add .
git commit -m "Initial commit - Music portfolio website"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY-NAME.git
git push -u origin main
```

## Adım 3: GitHub Pages Aktif Edin

1. Repository Settings > Pages bölümüne gidin
2. Source: "Deploy from a branch" seçin
3. Branch: "main" seçin
4. Folder: "/ (root)" seçin
5. "Save" tıklayın

## Sonuç
Siteniz şu adreste yayında olacak:
`https://USERNAME.github.io/REPOSITORY-NAME/`

Eğer repository adı `username.github.io` ise:
`https://USERNAME.github.io/`