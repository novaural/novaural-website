# Changelog

All notable changes to the Novaural website are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Added
- **README.md** — Full project documentation (tech stack, structure, development, deployment)
- **CHANGELOG.md** — This file
- **Maintenance docs** — `docs/adding-a-page.md` and `docs/adding-a-language.md`

---

## [2026-04-04] — Infrastructure Audit: Phase 3 (Final)

### Changed
- **Inline style migration (complete)** — Migrated all refactorable inline styles to CSS utility classes:
  - `how-it-works.html`: 16 blocks → classes (`hero--hiw`, `callout-body`, `advisory-note`, etc.)
  - `index.html`: 4 blocks → classes (`chart-title`, `chart-subtitle`, `chart-bars--index`, `btn-sm`)
  - `collaborate.html`: 6 blocks → classes (`section-title--hero`, `section-title--md`, `subtitle-centered`, `pt-16`)
  - `beyond-clinical.html`: 7 blocks → classes (`anim-fade-0/01/02`, `chart-visual`, `chart-bars`, `chart-label`, `clinical-link-note`, `text-teal`)
- **Section markers** — Standardised `how-it-works.css` section comments to match `style.css` format (`─── Name ───`)

### Fixed
- 13 intentional inline styles documented and verified (data-driven bar heights, honeypot, JS-toggled state)

---

## [2026-04-03] — Infrastructure Audit: Phase 2

### Added
- **CSS utility class system** — 40+ reusable classes in `style.css` (layout, spacing, typography, component helpers)
- **Frequency bar chart components** — Dedicated CSS classes for both index and beyond-clinical chart variants
- **Animation utility classes** — `anim-fade-0`, `anim-fade-01`, `anim-fade-02` for staggered hero animations

### Changed
- **Light theme** — Refined cool-gray palette for medical/professional feel
- **Scroll-to-top button** — Proper fixed positioning and theme-aware styling
- **Footer** — Added privacy policy link, company registration details

---

## [2026-04-02] — Infrastructure Audit: Phase 1

### Added
- **Content Security Policy** — Strict CSP `<meta>` tag on all 6 pages
- **Critical CSS build system** — `scripts/inject-critical-css.py` with minification
- **Pre-commit hook** — Auto-runs CSS injection on any `css/*.css` change
- **Light/dark theme system** — Full token-based theming with smooth transitions
- **`css/critical.css`** — Extracted above-the-fold CSS for inline injection

### Changed
- **CSS loading** — Switched from render-blocking `<link>` to async preload pattern
- **Font loading** — Non-render-blocking with print media swap technique
- **`<noscript>` fallbacks** — Added for both CSS and animation visibility

### Security
- CSP restricts script, style, font, image, connect, and form-action sources
- `frame-src: 'none'` and `object-src: 'none'` prevent embedding attacks

---

## [2026-04-01] — Page Buildout: How It Works

### Added
- **`how-it-works.html`** — Full clinical workflow page with:
  - Workflow timeline with highlighted ReFittingLab step
  - Before/after comparison table
  - 8 detailed clinical steps
  - Algorithm pipeline diagram
  - 5 safety layer cards
  - Algorithm depth features (NFM, multi-factor formula)
  - Better outcomes section (NHS/Private)
  - Equipment requirements with calibration guide
  - Compatibility matrix
- **`css/how-it-works.css`** — Page-specific component styles
- **`css/animations.css`** — Scroll-triggered animation system (`fade-in`, `fade-in-left`, `slide-up`, etc.)

---

## [2026-03-28] — Page Buildout: Beyond Clinical & Collaborate

### Added
- **`beyond-clinical.html`** — Consumer audio market page
- **`collaborate.html`** — Partnership enquiry page with Formspree form
- **`privacy.html`** — GDPR/UK GDPR privacy policy
- **`404.html`** — Custom error page matching site design
- **Form handling** — Formspree integration with honeypot, validation, success state

---

## [2026-03-27] — Foundation

### Added
- **`index.html`** — Home page with hero, about, challenge, product, HiW preview, stage, benefits, contact
- **`css/style.css`** — Design system (tokens, layout, components, responsive breakpoints)
- **`js/main.js`** — Core interactions (navbar, scroll, theme toggle, animations)
- **`js/i18n.js`** — Internationalisation engine
- **Language packs** — EN, ES, DE, FR, IT, NL
- **SEO** — Structured data (JSON-LD), meta tags, sitemap, robots.txt
- **Logo** — SVG icon and brand wordmark system
