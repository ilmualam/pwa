# Ilmu Alam · PWA assets

Web app manifest, icons and service worker that make **[www.ilmualam.com](https://www.ilmualam.com/)** installable as an app ("Add to Home screen"). The blog runs on Blogger, which can't host these files, so GitHub Pages serves them from **`https://ilmualam.github.io/pwa/`** and the Blogger theme links to them.

Sister project: **[quran.ilmualam.com](https://quran.ilmualam.com/)**, the Al-Quran Online reader ([ilmualam/quran](https://github.com/ilmualam/quran)).

---

## Files

| File | Purpose | Used by |
|---|---|---|
| `manifest.json` | PWA manifest: name, colours, `start_url`, icons, shortcuts | Blogger theme `<link rel="manifest">` |
| `assets/site.webmanifest` | Same content as `manifest.json`, kept for themes that use the RealFaviconGenerator path | Blogger theme (if linked) |
| `assets/favicon.svg` | Favicon for browsers that support SVG (4.8 KB) | Modern browsers |
| `assets/favicon.ico` | 16/32/48 px favicon | Legacy browsers, `/favicon.ico` requests |
| `assets/favicon-96x96.png` | PNG favicon; Google Search uses a multiple of 48 px | Search results, browsers |
| `assets/apple-touch-icon.png` | 180 px iOS home-screen icon | iPhone / iPad |
| `assets/icon-192x192.png`, `assets/icon-512x512.png` | App icons (`purpose: any`) | Android install, splash screen |
| `assets/maskable-512x512.png` | Full-bleed icon with the logo inside the 80% safe zone (`purpose: maskable`) | Android adaptive icons |
| `sw.js`, `offline.html`, `index.html`, `styles.css` | Demo page + service worker for `ilmualam.github.io/pwa/` itself | This GitHub Pages site only |

## Install on Blogger

In **Theme → Edit HTML**, paste inside `<head>`, replacing any older favicon or manifest tags:

```html
<link rel='manifest' href='https://ilmualam.github.io/pwa/manifest.json'/>
<link rel='icon' href='https://ilmualam.github.io/pwa/assets/favicon.ico' sizes='48x48'/>
<link rel='icon' href='https://ilmualam.github.io/pwa/assets/favicon.svg' type='image/svg+xml'/>
<link rel='icon' href='https://ilmualam.github.io/pwa/assets/favicon-96x96.png' type='image/png' sizes='96x96'/>
<link rel='apple-touch-icon' href='https://ilmualam.github.io/pwa/assets/apple-touch-icon.png'/>
<meta name='theme-color' content='#249749'/>
<meta name='apple-mobile-web-app-title' content='Ilmu Alam'/>
```

Then check it in Chrome DevTools → **Application → Manifest**. You should see the name, three icons and no errors.

## Known limitation: no offline mode on Blogger

A service worker must be served from the **same origin** as the page it controls. Blogger can't serve one from `www.ilmualam.com`, so `sw.js` here only controls `ilmualam.github.io/pwa/`. The blog is still installable, because current Chrome and Edge no longer require a service worker. It just won't work offline. If you need offline reading, use [quran.ilmualam.com](https://quran.ilmualam.com/), which has a full service worker.

## Updating icons

1. Start from one square, transparent, high-resolution logo (≥ 512 px).
2. Export `icon-192x192.png` and `icon-512x512.png` at those sizes, `apple-touch-icon.png` at 180 px on white, and `favicon-96x96.png` at 96 px.
3. For `maskable-512x512.png`, put the logo at about 60% of the canvas on a solid background, then preview it at [maskable.app](https://maskable.app/).
4. Keep file names unchanged, so the Blogger theme and installed apps keep working.
5. Bump `CACHE_NAME` in `sw.js` (for example `ilmualam-cache-v3`) whenever cached files change.

## Local testing

Service workers need HTTPS or `localhost`, and this site expects to live under `/pwa/`:

```bash
mkdir site && git clone https://github.com/ilmualam/pwa.git site/pwa
cd site && python3 -m http.server 8080   # open http://localhost:8080/pwa/
```

## License

[MIT](LICENSE). The Ilmu Alam name and logo belong to The Ilmu Alam and are not covered by the code license.

---

© 2025–2026 [The Ilmu Alam](https://www.ilmualam.com/)
