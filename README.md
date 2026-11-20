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
- Layout desktop dibuat di kanvas 1536px dan diskalakan dengan variabel CSS `--u` (satu piksel desain), sehingga header, kotak pencarian, dan bar kategori selalu pas di atas gambar `assets/hero-bg.webp`. Di bawah 1100px layout berubah menjadi susunan mengalir untuk ponsel/tablet.
- `css/reference.css` memuat header, hero, bar kategori, dan Featured Games (class berawalan `ref-`). Dimuat setelah `css/style.css`.
- Judul, pita, teks sambutan, Piko, dan pemandangan sudah menyatu di `hero-bg.webp`; yang interaktif (nav, pencarian, kategori) tetap elemen HTML asli. `<h1>` disembunyikan secara visual (`.sr-only`) untuk SEO dan pembaca layar.
- Aset lain: `assets/logo-piko.png` (logo header), `assets/icons/` (ikon kategori dan navigasi), `assets/piko/piko-community.png` (kartu komunitas), `favicon-64.png`, `apple-touch-icon.png`, `social-avatar-512.png`.
- Kategori di bar atas dipetakan dari genre dan mood tiap game (lihat `bucketPatterns` di `js/app.js`).
- Pose dan ekspresi Piko ada di `assets/piko/` (`piko-sit`, `piko-welcome`, `piko-explore`, dan `piko-face-*`). Aset sosial ada di `assets/social/` (banner 1500×500 dan `og-image-1200x630.png`). Untuk pratinjau link, tambahkan `<meta property="og:image">` dengan URL absolut ke gambar OG setelah domain final diketahui.
- Loading screen (`#splash`) memakai pose menjelajah dan hilang otomatis setelah daftar game termuat.
