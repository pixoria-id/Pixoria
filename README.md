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
