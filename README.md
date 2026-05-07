# Dcinformatik TEK — Site Web

Site vitrine pour Dcinformatik TEK, construit avec **React + Vite + CSS**.

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build
```

## 🎨 Palette de couleurs (Logo)

| Couleur | Variable CSS | Hex |
|---------|-------------|-----|
| Navy | `--navy` | `#0d1b2e` |
| Bleu | `--blue` | `#2b4fa8` |
| Cyan | `--cyan` | `#00c4d4` |
| Orange | `--orange` | `#f5a623` |
| Rouge | `--red` | `#c0392b` |

## 📁 Structure

```
src/
├── components/
│   ├── Navbar.jsx / .css
│   └── Footer.jsx / .css
├── pages/
│   ├── Home.jsx / .css       ← Landing page
│   ├── Products.jsx / .css   ← Catalogue + recherche + filtres
│   └── Contact.jsx / .css    ← Contact + à propos
├── App.jsx
├── main.jsx
└── index.css                 ← Variables globales
```

## 📄 Pages

- **`/`** — Landing page avec hero animé, catégories, produits vedettes, engagements
- **`/produits`** — Catalogue avec barre de recherche, filtres par catégorie, tri
- **`/contact`** — Formulaire de contact, infos entreprise, section À propos

## 🔤 Typographie

- **Rajdhani** — Titres / display
- **Exo 2** — Corps de texte
- **JetBrains Mono** — Labels, tags, badges
