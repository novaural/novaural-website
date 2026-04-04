# Novaural Website

> Marketing website for Novaural Ltd — UK-registered medical deep-tech company developing patent-protected hearing aid verification software.

**Live url:** [novaural.com](https://novaural.com)  
**Hosting:** Cloudflare Pages (static deploy from `main` branch)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Structure** | HTML 5 (semantic, ARIA) |
| **Styling** | Vanilla CSS — utility-class system + component CSS |
| **Interactivity** | Vanilla JS (no frameworks) |
| **i18n** | Custom `js/i18n.js` with JSON language packs (`lang/`) |
| **Build** | Python script for critical-CSS injection |
| **Pre-commit** | Git hook auto-runs CSS injection on any CSS change |
| **Analytics** | Cloudflare Web Analytics (privacy-first, no cookies) |

---

## Project Structure

```
novaural-website/
├── index.html              # Home page
├── how-it-works.html       # Clinical workflow deep-dive
├── beyond-clinical.html    # Consumer audio market page
├── collaborate.html        # Partnership enquiry + form
├── privacy.html            # Privacy policy (GDPR/UK GDPR)
├── 404.html                # Custom 404 error page
├── css/
│   ├── critical.css        # Above-the-fold CSS (source)
│   ├── style.css           # Main stylesheet + utility classes
│   ├── animations.css      # Scroll-triggered & micro-animations
│   └── how-it-works.css    # HiW page-specific components
├── js/
│   ├── main.js             # Core interactions, scroll, nav, theme
│   └── i18n.js             # Internationalisation engine
├── lang/
│   ├── en.json             # English (primary)
│   ├── es.json             # Spanish
│   ├── de.json             # German
│   ├── fr.json             # French
│   ├── it.json             # Italian
│   └── nl.json             # Dutch
├── logo/                   # SVG logo assets
├── assets/images/          # Product mockups (WebP + PNG fallback)
├── scripts/
│   └── inject-critical-css.py  # Critical CSS build script
├── CNAME                   # Custom domain config (Cloudflare)
├── robots.txt              # Crawler directives
├── sitemap.xml             # XML sitemap
└── .gitignore
```

---

## Development

### Prerequisites

- Python 3.8+ (for the build script only)
- Git
- Any static file server for local preview

### Local Preview

```bash
# Option A — Python built-in server
python -m http.server 8000

# Option B — VS Code Live Server extension
#   Right-click index.html → "Open with Live Server"
```

### Build: Critical CSS Injection

The build script reads `css/critical.css`, minifies it, and injects it inline into all 6 HTML pages between `<!-- [CRITICAL-CSS-START] -->` and `<!-- [CRITICAL-CSS-END] -->` markers.

```bash
# Normal run — modifies HTML files in-place
python scripts/inject-critical-css.py

# Dry run — reports what would change, modifies nothing
python scripts/inject-critical-css.py --dry-run
```

> **Note:** The Git pre-commit hook automatically runs this script whenever any `css/*.css` file is staged. You rarely need to run it manually.

### Git Pre-Commit Hook

Located at `.git/hooks/pre-commit`. It:
1. Detects if any `css/*.css` files are staged
2. Runs `inject-critical-css.py` automatically
3. Re-stages all HTML files with the fresh critical CSS
4. Aborts the commit if the script fails

---

## CSS Architecture

### Design Tokens

All colours, spacing, shadows, and typography are defined as CSS custom properties in `:root` (dark theme) and `[data-theme="light"]` (light theme) within `style.css`.

### Utility Classes

A custom utility-class system (in `style.css`, lines 147–427) eliminates inline styles:

| Category | Examples |
|----------|---------|
| **Layout** | `.text-center`, `.subtitle-centered`, `.max-w-700`, `.max-w-820` |
| **Spacing** | `.mt-4` … `.mt-14`, `.mb-4` … `.mb-12`, `.pt-16` |
| **Typography** | `.text-teal`, `.body-text`, `.body-text-lg`, `.disclaimer` |
| **Components** | `.chart-title`, `.chart-subtitle`, `.chart-bars`, `.chart-label` |
| **Buttons** | `.btn-sm`, `.btn-lg` |
| **Sections** | `.hero--hiw`, `.section-title--hero`, `.section-title--md` |

### Intentional Inline Styles

Only 13 inline styles remain across the entire codebase, all intentional:
- **11 × `height: Xpx`** — Data-driven frequency bar heights (unique per element)
- **1 × `display:none`** — Anti-spam honeypot field
- **1 × `display:none`** — JS-toggled form success state

---

## Internationalisation (i18n)

The i18n system uses `data-i18n` and `data-i18n-html` attributes on HTML elements. Language packs are JSON files in `lang/`.

### Adding a New Language

1. Copy `lang/en.json` to `lang/xx.json` (where `xx` is the ISO 639-1 code)
2. Translate all values (keys must remain unchanged)
3. Add the language option in `js/i18n.js` — update the `SUPPORTED_LANGS` array
4. The language selector in the navbar auto-populates from this array

---

## Security

### Content Security Policy (CSP)

All 6 HTML pages include a strict CSP `<meta>` tag:

```
default-src 'self';
script-src 'self' https://static.cloudflareinsights.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src https://fonts.gstatic.com;
img-src 'self' data:;
connect-src 'self' https://formspree.io https://cloudflareinsights.com;
frame-src 'none';
object-src 'none';
base-uri 'self';
form-action https://formspree.io;
```

### Form Security

- Formspree.io handles form submissions (no server-side code)
- Honeypot field (`_gotcha`) for bot protection
- Client-side validation with ARIA-live feedback

---

## Performance

- **Critical CSS** inlined for instant FCP
- **Async CSS loading** for `style.css`, `animations.css`, `how-it-works.css`
- **Font preloading** with `<link rel="preload">` + print media swap
- **WebP images** with PNG fallback via `<picture>` elements
- **Lazy loading** on below-fold images (`loading="lazy"`)
- **`<noscript>` fallbacks** for CSS and animations

---

## Deployment

Push to `main` → Cloudflare Pages auto-builds and deploys.

No build step is required on the hosting side — Cloudflare serves the static files directly. The only build step (critical CSS injection) runs locally via the pre-commit hook before pushing.

---

## Licence

Proprietary. © 2026 Novaural Ltd. All rights reserved.
