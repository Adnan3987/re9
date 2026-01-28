# PWA Aplikacija Setup 📱

## Šta je kreirano:

### 1. **manifest.json** (`static/manifest.json`)
- Konfiguracioni fajl za PWA
- Definiše ime, boju, ikone aplikacije
- Omogućava "Add to Home Screen"

### 2. **Service Worker** (`static/sw.js`)
- Omogućava offline rad aplikacije
- Cache-uje CSS, JS i slike
- Brži load vremena

---

## Kako instalirati aplikaciju:

### **Na Android telefonu:**
1. Otvori stranicu u Chrome browseru
2. Klikni na meni (tri tačke)
3. "Add to Home screen" ili "Install app"
4. Aplikacija će se pojaviti kao ikona na home screenu

### **Na iPhone:**
1. Otvori stranicu u Safari
2. Klikni Share dugme (kvadrat sa strelicom)
3. "Add to Home Screen"
4. Aplikacija će se pojaviti kao ikona

---

## Ikone koje trebaš kreirati:

### **Obavezne veličine:**
- `static/img/logo/icon-192.png` (192x192 pixels)
- `static/img/logo/icon-512.png` (512x512 pixels)

### **Opciono:**
- `static/img/logo/screenshot.png` (1080x1920 pixels)

**Koristi tvoj logo sliku i resize-uj je na ove dimenzije.**

---

## Dodaj u base.html:

U `<head>` sekciju dodaj:
```html
<!-- PWA Manifest -->
<link rel="manifest" href="/static/manifest.json">
<meta name="theme-color" content="#8B0000">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="RE9">
<link rel="apple-touch-icon" href="/static/img/logo/icon-192.png">
```

Pre zatvaranja `</body>` taga dodaj:
```html
<!-- Service Worker Registration -->
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/static/sw.js')
      .then(reg => console.log('Service Worker registrovan'))
      .catch(err => console.log('Service Worker greška:', err));
  });
}
</script>
```

---

## Test:

1. Pokreni aplikaciju: `python app.py`
2. Otvori u Chrome: `http://localhost:5000`
3. Otvori Developer Tools (F12)
4. Idi na **Application** tab
5. Proveri:
   - **Manifest** (levo meni) - treba biti zelena kvačica
   - **Service Workers** - treba biti aktiviran

---

## Deployment (nakon kreiranja ikona):

Kada deployuješ na Render/Railway/Heroku:
- PWA će automatski raditi
- Korisnici mogu instalirati app
- Offline cache će raditi

---

## Prednosti PWA:

✅ Instalabilna kao prava aplikacija  
✅ Radi offline (osnovna funkcionalnost)  
✅ Brži load  
✅ Push notifikacije (opciono)  
✅ Nema potrebe za Google Play / App Store  
✅ Isti kod za web i mobilnu app  

---

## Napomene:

- iOS Safari ima ograničenja (cache limit, push notifikacije ne rade)
- Android Chrome ima punu podršku
- Za pravu native aplikaciju koristi Capacitor (složenije)
