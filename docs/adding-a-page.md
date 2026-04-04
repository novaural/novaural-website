# Adding a New Page

Step-by-step guide for adding a new HTML page to the Novaural website.

---

## 1. Create the HTML File

Copy an existing page (e.g., `beyond-clinical.html`) as a template. Every page **must** include:

### Head Section

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title — Novaural</title>
  <meta name="description" content="...">

  <!-- CSP — MANDATORY on every page -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://formspree.io https://cloudflareinsights.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action https://formspree.io;">

  <!-- Structured data (JSON-LD) -->
  <script type="application/ld+json">...</script>

  <!-- Google Fonts: async load -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" media="print" onload="this.media='all'">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&display=swap" media="print" onload="this.media='all'">
  <noscript>
    <link rel="stylesheet" href="...Inter...">
    <link rel="stylesheet" href="...Montserrat...">
  </noscript>

  <!-- Critical CSS block — will be auto-injected by build script -->
  <!-- [CRITICAL-CSS-START] -->
  <!-- [CRITICAL-CSS-END] -->

  <!-- No-JS fallback for animations -->
  <noscript><style>
    .fade-in, .fade-in-left, .fade-in-right, .slide-up, ... {
      opacity: 1 !important; transform: none !important;
    }
  </style></noscript>
</head>
```

### Body Structure

```html
<body>
  <a href="#main-content" class="skip-link" data-i18n="skip_to_main">Skip to main content</a>

  <!-- Copy the <nav> block from any existing page — identical across all pages -->
  <nav class="navbar" id="navbar" aria-label="Main navigation">...</nav>

  <main id="main-content">
    <!-- Your page content here -->
  </main>

  <!-- Copy the <footer> block — identical across all pages -->
  <footer class="footer">...</footer>

  <script defer src="js/i18n.js"></script>
  <script defer src="js/main.js"></script>
  <!-- Cloudflare Web Analytics -->
  <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "..."}'>
  </script>
</body>
```

---

## 2. Register the Page in the Build System

Open `scripts/inject-critical-css.py` and add your filename to the `HTML_FILES` list:

```python
HTML_FILES = [
    "index.html",
    "how-it-works.html",
    "beyond-clinical.html",
    "collaborate.html",
    "privacy.html",
    "404.html",
    "your-new-page.html",  # ← Add here
]
```

Also update the pre-commit hook (`.git/hooks/pre-commit`) to stage the new file:

```bash
git add index.html how-it-works.html beyond-clinical.html collaborate.html privacy.html 404.html your-new-page.html
```

---

## 3. Add i18n Keys

1. Add all translatable text to `lang/en.json` with meaningful key names
2. Use the `data-i18n="key_name"` attribute on HTML elements
3. For HTML content (bold, links, etc.), use `data-i18n-html="key_name"` instead
4. Copy the new keys to all other language files (`es.json`, `de.json`, etc.)

---

## 4. Add Navigation Link

Add the page to the `<ul class="nav-links">` in all existing HTML files, and to the footer `.footer-links`.

---

## 5. Update Sitemap

Add the new URL to `sitemap.xml`:

```xml
<url>
  <loc>https://novaural.com/your-new-page.html</loc>
  <lastmod>2026-04-04</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 6. Run the Build

```bash
python scripts/inject-critical-css.py
```

This injects the critical CSS into your new page. Alternatively, just commit — the pre-commit hook handles it.

---

## 7. Checklist

- [ ] CSP `<meta>` tag present
- [ ] Skip link present
- [ ] Navbar and footer identical to other pages
- [ ] Critical CSS markers (`<!-- [CRITICAL-CSS-START] -->` / `END`) present
- [ ] `<noscript>` CSS fallback present
- [ ] `<noscript>` animation visibility fallback present
- [ ] `data-i18n` attributes on all user-facing text
- [ ] Language packs updated (all 6 files)
- [ ] Build script updated (`HTML_FILES` list)
- [ ] Pre-commit hook updated (`git add` line)
- [ ] `sitemap.xml` updated
- [ ] Navigation links added to all pages + footer
- [ ] Cloudflare Analytics script included
