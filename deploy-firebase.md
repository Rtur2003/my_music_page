# Firebase Hosting ile Canlıya Alma Rehberi

## Adım 1: Firebase Projesi Oluşturun
1. [console.firebase.google.com](https://console.firebase.google.com) gidin
2. "Create a project" tıklayın
3. Proje adı girin: "music-portfolio"
4. Analytics'i devre dışı bırakabilirsiniz
5. "Create project" tıklayın

## Adım 2: Firebase CLI Kurun
```bash
# Node.js gerekli - nodejs.org'dan indirin
npm install -g firebase-tools
```

## Adım 3: Firebase'e Giriş Yapın
```bash
firebase login
```

## Adım 4: Projeyi Başlatın
```bash
# MyPage klasörünün içinde terminal açın
cd C:\Users\MONSTER\Desktop\MyPage
firebase init hosting
```

Sorulara şu şekilde cevap verin:
- Use an existing project: YES
- Select project: music-portfolio
- Public directory: "." (nokta)
- Configure as SPA: NO
- Set up automatic builds: NO
- Overwrite index.html: NO

## Adım 5: Deploy Edin
```bash
firebase deploy
```

## Sonuç
Siteniz şu adreste yayında olacak:
`https://PROJECT-ID.web.app/`

### Özel Domain
1. Firebase Console > Hosting
2. "Add custom domain"
3. Domain'inizi girin ve doğrulayın