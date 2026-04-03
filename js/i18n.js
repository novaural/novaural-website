/**
 * Novaural i18n — Lightweight internationalisation engine
 * Loads JSON translation files and applies to DOM via data-i18n attributes.
 */
(function () {
  'use strict';

  const SUPPORTED_LANGS = ['en', 'es', 'de', 'fr', 'it', 'nl'];
  const DEFAULT_LANG = 'en';

  /* ── UI toggle ──────────────────────────────────────── */
  /* Set to true when ready to expose the language selector to users. */
  /* All i18n infrastructure (JSON files, data-i18n attributes, engine) */
  /* remains fully functional — flip this flag to enable multi-language. */
  const SHOW_SELECTOR = false;

  const LANG_LABELS = {
    en: '🇬🇧 English',
    es: '🇪🇸 Español',
    de: '🇩🇪 Deutsch',
    fr: '🇫🇷 Français',
    it: '🇮🇹 Italiano',
    nl: '🇳🇱 Nederlands'
  };
  const LANG_FLAGS = { en: '🇬🇧', es: '🇪🇸', de: '🇩🇪', fr: '🇫🇷', it: '🇮🇹', nl: '🇳🇱' };

  let currentLang = DEFAULT_LANG;
  if (SHOW_SELECTOR) {
    try { currentLang = localStorage.getItem('novaural_lang') || detectBrowserLang(); } catch (e) { currentLang = detectBrowserLang(); }
  }
  let translations = {};

  function detectBrowserLang() {
    const browserLang = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
    return SUPPORTED_LANGS.includes(browserLang) ? browserLang : DEFAULT_LANG;
  }

  /* ── helpers ─────────────────────────────────────────── */
  const _basePath = (() => {
    // Detect whether we are at root or in a subdir (cached — path won't change).
    const scripts = document.querySelectorAll('script[src*="i18n"]');
    if (scripts.length) {
      const src = scripts[0].getAttribute('src');
      return src.replace('js/i18n.js', '');
    }
    return '';
  })();

  async function loadTranslation(lang) {
    try {
      const res = await fetch(_basePath + 'lang/' + lang + '.json?v=' + Date.now());
      if (!res.ok) throw new Error(res.status);
      return await res.json();
    } catch (e) {
      // Silently fall back to default language
      if (lang !== DEFAULT_LANG) {
        return loadTranslation(DEFAULT_LANG);
      }
      return {};
    }
  }

  /* ── apply translations ─────────────────────────────── */
  function apply(dict) {
    translations = dict;

    // data-i18n  → textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    // data-i18n-html → innerHTML  (for bold/links inside)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    // data-i18n-placeholder → placeholder attr
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
    });

    // data-i18n-value → value text (for <option> etc.)
    document.querySelectorAll('[data-i18n-value]').forEach(el => {
      const key = el.getAttribute('data-i18n-value');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    // data-i18n-meta → meta content attribute (title, description, og tags)
    document.querySelectorAll('[data-i18n-meta]').forEach(el => {
      const key = el.getAttribute('data-i18n-meta');
      if (dict[key] !== undefined) {
        if (el.tagName === 'TITLE') {
          el.textContent = dict[key];
        } else {
          el.setAttribute('content', dict[key]);
        }
      }
    });

    // Update html lang attribute
    document.documentElement.lang = currentLang;

    // Update selector display
    updateSelectorDisplay();
  }

  /* ── language selector ──────────────────────────────── */
  function createSelector() {
    // Find all .lang-selector-container elements (one per page)
    const containers = document.querySelectorAll('.lang-selector-container');
    containers.forEach(container => {
      container.innerHTML = '';

      const wrapper = document.createElement('div');
      wrapper.className = 'lang-selector';

      const btn = document.createElement('button');
      btn.className = 'lang-btn';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Select language');
      btn.innerHTML = LANG_FLAGS[currentLang] + ' <span class="lang-code">' + currentLang.toUpperCase() + '</span>';

      const dropdown = document.createElement('div');
      dropdown.className = 'lang-dropdown';

      SUPPORTED_LANGS.forEach(lang => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'lang-option' + (lang === currentLang ? ' active' : '');
        item.setAttribute('data-lang', lang);
        item.textContent = LANG_LABELS[lang];
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          switchLang(lang);
          dropdown.classList.remove('open');
        });
        dropdown.appendChild(item);
      });

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });

      wrapper.appendChild(btn);
      wrapper.appendChild(dropdown);
      container.appendChild(wrapper);
    });

    // Single document-level handler to close all dropdowns on outside click
    document.addEventListener('click', () => {
      document.querySelectorAll('.lang-dropdown.open').forEach(dd => dd.classList.remove('open'));
    });
  }

  function updateSelectorDisplay() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.innerHTML = LANG_FLAGS[currentLang] + ' <span class="lang-code">' + currentLang.toUpperCase() + '</span>';
    });
    document.querySelectorAll('.lang-option').forEach(opt => {
      opt.classList.toggle('active', opt.getAttribute('data-lang') === currentLang);
    });
  }

  /* ── switch language ────────────────────────────────── */
  async function switchLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
    currentLang = lang;
    try { localStorage.setItem('novaural_lang', lang); } catch (e) { /* private browsing */ }
    const dict = await loadTranslation(lang);
    apply(dict);
  }

  /* ── init ────────────────────────────────────────────── */
  async function init() {
    if (SHOW_SELECTOR) createSelector();
    const dict = await loadTranslation(currentLang);
    apply(dict);
  }

  // Run on DOMContentLoaded or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for external use
  window.novauralI18n = {
    switchLang,
    getCurrentLang: () => currentLang,
    t: (key, fallback) => (translations[key] !== undefined ? translations[key] : (fallback || key))
  };
})();
