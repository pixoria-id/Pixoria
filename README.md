# PIXORIA.ID

**Discover Your Little World.**

A cozy, editorial-style discovery catalogue for pixel-art games.

## Stack
- HTML, CSS, vanilla JavaScript
- Supabase database (public published games)
- LocalStorage wishlist (no account required yet)

## Run locally
Open `index.html` in a browser, or serve the repository root with any static web server.

## Deploy on Netlify
- Build command: leave blank
- Publish directory: `.` (repository root)

## Supabase
The frontend uses the project's publishable key, which is intended for browser use. Row Level Security must remain enabled. Never put a service-role or secret key in this repository.

The site falls back to a small starter catalogue if the database is empty or unavailable.

## Tampilan (reference layout)
- `css/reference.css` memuat layout header, hero, bar kategori, dan Featured Games (class berawalan `ref-`). Dimuat setelah `css/style.css`.
- Aset pixel art ada di `assets/`: `hero-world.png`, `piko-full.png`, `piko-head.png`, `pixoria-title.png`, `pixoria-wordmark.png`, `icons/`, serta `favicon-64.png`, `apple-touch-icon.png`, dan `social-avatar-512.png` untuk branding sosial.
- Kategori di bar atas dipetakan dari genre dan mood tiap game (lihat `bucketPatterns` di `js/app.js`).
- Pose dan ekspresi Piko ada di `assets/piko/` (`piko-sit`, `piko-welcome`, `piko-explore`, dan `piko-face-*`). Aset sosial ada di `assets/social/` (banner 1500×500 dan `og-image-1200x630.png`). Untuk pratinjau link, tambahkan `<meta property="og:image">` dengan URL absolut ke gambar OG setelah domain final diketahui.
- Loading screen (`#splash`) memakai pose menjelajah dan hilang otomatis setelah daftar game termuat.
