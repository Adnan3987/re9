# Društvene Mreže Ikonice - Setup

## Koraci za dodavanje logo slika za društvene mreže

Trebam da dodam **PNG slike** logotipa društvenih mreža u folder:
```
static/img/social/
```

### Slike koje trebam:

1. **youtube.png** - YouTube logo
2. **twitter.png** - Twitter / X logo
3. **facebook.png** - Facebook logo
4. **instagram.png** - Instagram logo
5. **tiktok.png** - TikTok logo (sa magenta/pink i cyan bojama)

### Specifikacije slika:

- **Format**: PNG sa transparentnom pozadinom
- **Veličina**: Preporučuje se 128x128px ili 256x256px
- **Boja**: Bijela ili originalna (aplikacija će je konvertovati u bijelu)
- **TikTok**: Trebalo bi da ima karakterističnu muskarac/ženu ili notu - s magentom i cyan bojama

### Struktura foldera:

```
static/
└── img/
    ├── logo/
    │   └── requiem-logo.png
    ├── platforms/
    │   ├── ps5.png
    │   ├── xbox.png
    │   ├── steam.png
    │   ├── switch.png
    │   ├── epic.png
    │   └── geforce.png
    └── social/
        ├── youtube.png
        ├── twitter.png
        ├── facebook.png
        ├── instagram.png
        └── tiktok.png
```

### CSS Klase (ako trebaju posebna podešavanja):

- `.social-link` - Container za ikonicu
- `.social-img` - Sama slika (80x80px)
- `.social-link:hover` - Efekt na hover-u

## Gdje nabaviti logotipe?

- **YouTube, Twitter, Facebook, Instagram, TikTok**: Službene stranice ili njihove media kits
- Alternativa: Ikonični paketi na dribbble.com ili flaticon.com sa transparentnom pozadinom

### Sve ikonice su sada:

✅ **Identične veličine**: 80x80px
✅ **Simetrične**: Sa 8px padding-om u 96x96px klikabilnom polju
✅ **Bijele boje**: Filter efekt konvertuje bilo koju boju u bijelu
✅ **Hover efekt**: Povećavaju se (scale 1.2x) i postaju sive

---

**Status**: Čekam PNG slike za društvene mreže
