# 🎵 HASAN ARTHUR ALTUNTAŞ MUSIC PORTFOLIO
# Güvenli .gitignore - Sadece gereksiz dosyalar ignore edilir

# Node.js Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json

# Environment Variables - GÜVENLİK
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
config.local.json
secrets.json

# IDE/Editor - Kişisel Ayarlar
.vscode/settings.json
.vscode/launch.json
.idea/
*.swp
*.swo
*~
.spyderproject
.spyproject

# OS Generated Files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
desktop.ini

# Temporary Files
*.tmp
*.temp
.cache/
.sass-cache/
.parcel-cache/

# Log Files - DEBUG
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime Data
pids/
*.pid
*.seed
*.pid.lock

# Coverage Reports
coverage/
.nyc_output/
.c8_output/

# Dependency Directories
jspm_packages/
bower_components/

# Optional npm cache
.npm
.eslintcache

# Build Outputs - SADECE GEÇİCİ BUILD'LER
.next/
.nuxt/
dist-temp/
build-temp/

# Local Development
.netlify/
.local/
dev-temp/

# Test Files - SADECE GEÇİCİ TEST ÇIKITILARI
test-results-temp/
screenshots-temp/
.playwright/

# Database - SADECE LOCAL
*.sqlite
*.sqlite3
*.db.local

# Security - KEYLERİ SAKLA
*.key
*.pem
*.crt
*.csr
private/
secrets/

# ❌ BUNLARI IGNORE ETME - PRODUCTION DOSYALARI:
# 
# index.html
# admin.html
# assets/css/*
# assets/js/*  
# assets/images/*
# robots.txt
# sitemap.xml
# schema.json
# .htaccess
# favicon.ico
# *.md files
#
# ❌ Bu dosyalar web sitesi için HAYATI ÖNEMDEdir!