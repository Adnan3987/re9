# Logo Resident Evil: Requiem - SETUP

## Instrukcije

### 1. Generiši logo preko ChatGPT-a
Koristi ChatGPT ili Midjourney da generiši logo za **"Resident Evil: Requiem"**
- Trebalo bi da bude **crno-bijelo** sa distressed efektom
- Veličina: **minimum 600x200px**
- Format: **PNG sa transparentnom pozadinom**

### 2. Spremi logo datoteku
Spremi генerisvanu sliku kao: `static/img/logo/requiem-logo.png`

### 3. Aktiviraj logo u aplikaciji

U datoteku: `templates/frontend/index.html`

Na kraju `{% block scripts %}` sekcije, dodaj:

```html
<script>
    // Učitaj logo kada je stranisa gotova
    document.addEventListener('DOMContentLoaded', function() {
        loadGameLogo("{{ url_for('static', filename='img/logo/requiem-logo.png') }}");
    });
</script>
```

## Struktura

```
static/
├── img/
│   └── logo/
│       └── requiem-logo.png  ← Spremi logo ovde
```

## CSS Klase (ako trebaš prilagoditi)

- `.hero-logo` - Container za logo
- `.hero-logo img` - Sama slika (max-width: 100%, max-height: 200px)
- `.title` - Tekst koji se krije kada je logo prisutan

## Responsive

Logo je već responsive - automatski se prilagođava mobilnoj verziji.

---

**Status:** Spreman za upload logoa
