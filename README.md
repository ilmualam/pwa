# Ilmu Alam — PWA (Progressive Web App)
A small repository containing the Progressive Web App (PWA) assets for Ilmu Alam — an Islamic motivation blog. This repo holds the web app manifest, service-worker code and supporting assets to enable offline access, add-to-home-screen, and a native-like experience.

Brief description (from manifest):
Perkongsian motivasi Islamik, hukum, kisah dan teladan membimbing diri, memujuk kecewa hati yang sedih terluka ke arah pahala dunia dan akhirat
(Sharing Islamic motivation, rulings, stories and lessons to guide oneself and soothe the heart toward worldly and hereafter reward.)

Features
- Web App Manifest (standalone display, theme/background colors, icons)
- Service Worker for offline caching and fast loading
- Lightweight, focused on giving Ilmu Alam an installable PWA shell
- Ready-to-configure icons and start_url

Quick links
- Manifest name: Ilmu Alam - Islamic Motivation Blog
- Short name: Ilmu Alam
- Start URL: https://www.ilmualam.com/?utm_source=pwa
- Theme color: #249749
- Icons (example URLs used in repo):
  - https://ilmualam.github.io/pwa/assets/icon-192x192.png (192x192)
  - https://ilmualam.github.io/pwa/assets/assets/icon-512.png (512x512)

Table of contents
- Installation
- Usage
- Service worker (registering, caching strategy)
- Manifest (what to edit)
- Local testing & debugging
- Deploying
- Contributing
- License

Installation (for beginners)
1. Clone the repo:
   git clone https://github.com/ilmualam/pwa.git
2. Serve the files over HTTP (PWAs require HTTPS or localhost). Simple options:
   - Using Node: npx http-server -c-1 -p 8080
   - Using Python 3: python3 -m http.server 8080
3. Open the site at http://localhost:8080 in Chrome/Edge/Firefox.

Usage — how the PWA integrates with a site
- The manifest (manifest.json) describes the app name, icons, theme and start_url. Place a link to it in your HTML head:
  <link rel="manifest" href="/manifest.json">
- Register the service worker (example snippet to include near the end of your HTML or in your JS entry file):
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('SW registered', reg))
        .catch(err => console.error('SW registration failed', err));
    });
  }

Service worker — recommended patterns
- Basic responsibilities:
  - Precache core assets (HTML, CSS, JS, icons)
  - Serve cached assets fast (cache-first) while using network-first for API requests
  - Keep updates simple: use skipWaiting() and clients.claim() for immediate activation when appropriate
- Example high-level approach:
  - install event: open cache, add pre-cache list
  - activate event: cleanup old caches
  - fetch event: respond with cache-first for assets, network-first for dynamic content
- Security: make sure the service worker is served from the origin you want it to control (scope is the folder where the SW is located).

Manifest — what to edit
- Keys in manifest.json you may want to update:
  - name / short_name — visible to users
  - description — short description of the app
  - start_url — where the app opens when launched from home screen; include UTM if you want analytics
  - display — "standalone" keeps the app-looking UI (no browser chrome)
  - background_color / theme_color — used during loading and by the OS
  - icons — provide properly sized PNGs, include maskable purpose if needed
- Example manifest excerpt (keeps values found in this repo):
  {
    "name": "Ilmu Alam - Islamic Motivation Blog",
    "short_name": "Ilmu Alam",
    "description": "Perkongsian motivasi Islamik, hukum, kisah dan teladan ...",
    "start_url": "https://www.ilmualam.com/?utm_source=pwa",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#249749",
    "icons": [
      { "src": "assets/icon-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
      { "src": "assets/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
    ]
  }

Local testing & debugging
- Lighthouse (Chrome DevTools) — run an audit to check PWA score and get actionable recommendations.
-