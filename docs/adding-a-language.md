# Adding a New Language

Step-by-step guide for adding a new language to the Novaural website.

---

## How the i18n System Works

1. **HTML elements** use `data-i18n="key"` (text) or `data-i18n-html="key"` (rich HTML) attributes
2. **`js/i18n.js`** loads the appropriate JSON file from `lang/` based on user preference
3. **Language selection** is stored in `localStorage` and persisted across page loads
4. **Fallback** — If a key is missing in a language file, the English value is used

---

## Step 1: Create the Language File

Copy `lang/en.json` to `lang/xx.json` (where `xx` is the [ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)):

```bash
cp lang/en.json lang/pt.json   # Example: Portuguese
```

---

## Step 2: Translate All Values

Open `lang/xx.json` and translate every **value** while keeping all **keys** unchanged.

```json
{
  "nav_about": "Sobre",
  "nav_challenge": "El Desafío",
  "hero_title_1": "Verificación Objetiva de"
}
```

### Important rules:
- **Keys must remain in English** — they are identifiers, not content
- **HTML in `data-i18n-html` values** — preserve all HTML tags (`<strong>`, `<br>`, `<a>`, etc.)
- **Placeholders** — some keys contain `£250`, `47`, or other numerical values; adjust currency symbols if needed but keep the numbers consistent
- **Do not remove keys** — even if two languages share the same text, the key must exist in every file

---

## Step 3: Register the Language

Open `js/i18n.js` and find the `SUPPORTED_LANGS` array (near the top of the file). Add your language:

```javascript
const SUPPORTED_LANGS = ['en', 'es', 'de', 'fr', 'it', 'nl', 'pt'];  // ← Add 'pt'
```

Also add a display name in the `LANG_NAMES` object:

```javascript
const LANG_NAMES = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
  nl: 'Nederlands',
  pt: 'Português',     // ← Add entry
};
```

---

## Step 4: Test

1. Open the site locally
2. Click the language selector in the navbar
3. Verify the new language appears and loads correctly
4. Navigate to all pages — check that all text updates
5. Switch back to English to confirm fallback works

### Common issues:
- **"key_name" displayed instead of text** → Missing key in the JSON file
- **Raw HTML showing as text** → Use `data-i18n-html` instead of `data-i18n` for that element
- **Language not appearing in selector** → Check `SUPPORTED_LANGS` and `LANG_NAMES` in `i18n.js`

---

## Step 5: Verify Completeness

Run a quick key-count check to ensure no keys are missing:

```bash
# Count keys in each language file (should all be equal)
python -c "import json, glob; [print(f'{f}: {len(json.load(open(f)))} keys') for f in sorted(glob.glob('lang/*.json'))]"
```

All files should report the same number of keys.

---

## File Reference

| File | Purpose |
|------|---------|
| `lang/en.json` | English (primary — source of truth for all keys) |
| `lang/es.json` | Spanish |
| `lang/de.json` | German |
| `lang/fr.json` | French |
| `lang/it.json` | Italian |
| `lang/nl.json` | Dutch |
| `js/i18n.js` | Translation engine + language registry |
