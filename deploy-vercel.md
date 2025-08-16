# Vercel ile Canlıya Alma Rehberi

## Adım 1: Vercel Hesabı Açın
1. [vercel.com](https://vercel.com) gidin
2. "Sign Up" tıklayın
3. GitHub ile giriş yapın (önerilen)

## Adım 2: Proje Import Edin

### Yöntem A: Drag & Drop
1. Vercel dashboard'ında "Add New..." > "Project"
2. "Import Git Repository" yerine ZIP yükleyici kullanın
3. MyPage klasörünü ZIP yapın ve yükleyin

### Yöntem B: GitHub'dan Import
1. Önce GitHub'a yükleyin (GitHub rehberini takip edin)
2. Vercel'de "Import Git Repository"
3. GitHub repository'nizi seçin

## Adım 3: Deploy Ayarları
- Framework Preset: "Other"
- Root Directory: "./" (varsayılan)
- Build Command: boş bırakın
- Output Directory: boş bırakın

## Adım 4: Deploy
"Deploy" butonuna tıklayın!

## Sonuç
Siteniz otomatik olarak şu formatta bir URL alacak:
`https://project-name-username.vercel.app`

### Özel Domain Ekleme
1. Project Settings > Domains
2. Kendi domain'inizi ekleyin
3. DNS ayarlarını yapın