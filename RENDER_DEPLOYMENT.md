# 🚀 Render.com Deployment Guide

## Koraci za deployment:

### 1. Priprema koda
✅ requirements.txt ažuriran sa Gunicorn
✅ render.yaml kreiran za automatsku konfiguraciju

### 2. Git setup (ako već nemaš repository)
```bash
git init
git add .
git commit -m "Ready for Render deployment"
```

### 3. Kreiraj GitHub repository
1. Idi na https://github.com/new
2. Kreiraj novi repository (public ili private)
3. Kopiraj URL i push-uj kod:
```bash
git remote add origin https://github.com/tvoj-username/re9.git
git branch -M main
git push -u origin main
```

### 4. Deploy na Render.com
1. Idi na https://render.com (sign up sa GitHub nalogom)
2. Klikni **New** → **Web Service**
3. Konektuj GitHub repository
4. Render će automatski detektovati **render.yaml** i koristiti te settings
5. Klikni **Create Web Service**

### 5. Čekaj deployment (5-10 minuta)
- Render će instalirati dependencies
- Startovati Gunicorn server
- Dobijaš URL kao: `https://re9-app.onrender.com`

### 6. Testiraj
- Otvori URL u browseru
- Testiraj na mobilnom (dodaj na Home Screen kao PWA)

## ⚠️ Napomena
Besplatni plan:
- App će "spavati" posle 15 minuta neaktivnosti
- Prvi request posle spavanja može trajati 30-60 sekundi (cold start)
- 750 sati mesečno besplatno

## 🔧 Troubleshooting
Ako nešto ne radi, proveri Logs u Render dashboardu.
