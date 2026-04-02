/* =============================================
   NOVAURAL — Main JavaScript
   ============================================= */

/* ─── Theme: FOUC prevention (runs before DOM paint) ─── */
(function() {
  const saved = localStorage.getItem('novaural-theme');
  const theme = saved || 'dark'; // default dark
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.add('no-transitions');
  window.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-transitions');
      });
    });
  });
})();

document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar scroll effect ─────────────────────
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // handleScroll is called from the unified scroll handler below
  handleScroll(); // initial check

  // ─── Active nav link scroll-spy ────────────────
  // Highlights the nav link corresponding to the currently visible section
  const navAnchors = navbar.querySelectorAll('.nav-links a[href^="#"]');
  const sectionIds = [];
  navAnchors.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    if (id && document.getElementById(id)) sectionIds.push(id);
  });

  if (sectionIds.length) {
    const setActiveNav = (activeId) => {
      navAnchors.forEach(a => {
        const linkId = a.getAttribute('href').slice(1);
        if (linkId === activeId) {
          a.classList.add('active');
        } else {
          a.classList.remove('active');
        }
      });
    };

    // Use IntersectionObserver to detect which section is most visible
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    }, {
      root: null,
      // Top offset = navbar height (~70px), trigger when section enters top 40% of viewport
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0
    });

    sectionIds.forEach(id => {
      spyObserver.observe(document.getElementById(id));
    });

    // Clear active state when at the very top (hero area)
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setActiveNav(''); // no section active in hero
        }
      }, { root: null, rootMargin: '0px', threshold: 0.5 });
      heroObserver.observe(heroSection);
    }
  }

  // ─── Page-level nav highlighting ───────────────
  // For links pointing to separate pages (not #anchors): highlight based on current URL
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage !== 'index.html') {
    navbar.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href && !href.startsWith('#') && href === currentPage) {
        a.classList.add('active');
      }
    });
  }

  // ─── Theme toggle button ──────────────────────
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.id = 'themeToggle';
  themeToggle.setAttribute('aria-label', 'Toggle dark/light theme');
  themeToggle.innerHTML = `
    <svg class="icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    <svg class="icon-moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  `;

  // Insert toggle beside the lang selector (or before nav toggle)
  const langContainer = navbar.querySelector('.lang-selector-container');
  const navToggleBtn = document.getElementById('navToggle');
  if (langContainer) {
    langContainer.parentNode.insertBefore(themeToggle, langContainer.nextSibling);
  } else if (navToggleBtn) {
    navToggleBtn.parentNode.insertBefore(themeToggle, navToggleBtn);
  } else {
    navbar.querySelector('.nav-content').appendChild(themeToggle);
  }

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('novaural-theme', next);
  });

  // ─── Inline SVG logo for theme-aware coloring ──
  // The main wave uses fill="currentColor", which only works when SVG is inline.
  // This replaces each <img> pointing to the SVG with the actual <svg> element.
  document.querySelectorAll('.nav-logo img[src*="novaural_wave_icon"]').forEach(img => {
    fetch(img.src)
      .then(r => r.text())
      .then(svgText => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = svgText.trim();
        const svg = wrapper.querySelector('svg');
        if (!svg) return;
        // Transfer relevant img attributes
        svg.setAttribute('width', img.getAttribute('width') || '40');
        svg.setAttribute('height', img.getAttribute('height') || '40');
        svg.setAttribute('aria-label', img.getAttribute('alt') || '');
        svg.setAttribute('role', 'img');
        svg.classList.add('nav-logo-svg');
        img.replaceWith(svg);
      })
      .catch(() => {}); // Graceful fallback: keep <img> if fetch fails
  });

  // ─── Mobile navigation toggle ─────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }

  // ─── Smooth scroll for anchor links ───────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ─── Scroll-triggered animations ──────────────
  // All animatable selectors — covers both original and HiW-enhanced classes
  const animSelectors = [
    '.fade-in', '.fade-in-left', '.fade-in-right',
    '.slide-up', '.slide-left', '.slide-right', '.scale-in', '.glow-in', '.draw-border',
    '.compare-col', '.pipe-node', '.pipe-arrow',
    '.safety-card', '.algo-feature', '.compat-card', '.about-card',
    '.outcome-col', '.why-card', '.detail-step', '.wf-step', '.gap-callout',
    '.freq-bars'
  ].join(', ');

  const animatedElements = document.querySelectorAll(animSelectors);

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add staggered delays to grouped elements
  const addStaggerDelays = (selector, baseDelay = 100) => {
    document.querySelectorAll(selector).forEach((group) => {
      const animChildren = group.querySelectorAll(animSelectors);
      animChildren.forEach((child, i) => {
        child.dataset.delay = i * baseDelay;
      });
    });
  };

  addStaggerDelays('.problem-cards', 150);
  addStaggerDelays('.steps', 120);
  addStaggerDelays('.product-features', 100);

  // HiW-specific stagger groups
  addStaggerDelays('.pipeline', 150);       // Pipeline nodes appear sequentially
  addStaggerDelays('.safety-grid', 120);    // Safety cards one by one
  addStaggerDelays('.algo-features', 60);   // Algorithm feature cards
  addStaggerDelays('.compat-grid', 80);     // Compatibility cards
  addStaggerDelays('.detail-steps', 60);    // Session detail steps
  addStaggerDelays('.why-partner-grid', 100);  // Why-it-matters cards
  addStaggerDelays('.outcomes-grid', 0);    // Outcome cols (delay built into CSS)

  // Freq bar chart: stagger each bar's grow animation
  document.querySelectorAll('.freq-bars').forEach(group => {
    group.querySelectorAll('.freq-bar').forEach((bar, i) => {
      bar.style.setProperty('--bar-delay', (i * 0.1) + 's');
    });
  });

  animatedElements.forEach(el => observer.observe(el));

  // ─── Workflow timeline: line draws on scroll ──
  const wfTimeline = document.querySelector('.workflow-timeline');
  if (wfTimeline) {
    const updateTimeline = () => {
      const rect = wfTimeline.getBoundingClientRect();
      const wh = window.innerHeight;
      const tlH = wfTimeline.offsetHeight;
      if (rect.top < wh && rect.bottom > 0) {
        const scrolled = Math.max(0, wh - rect.top);
        const pct = Math.min(100, (scrolled / (tlH + wh * 0.2)) * 100);
        wfTimeline.style.setProperty('--tl-progress', pct + '%');
      }
    };
    // updateTimeline is called from the unified scroll handler below
    updateTimeline();
  }

  // ─── Subtle parallax on hero ──────────────────
  const heroContent = document.querySelector('.hero-content');

  const updateHeroParallax = heroContent ? () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
      heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
    }
  } : null;

  // ─── Scroll progress bar (inside navbar) ───────
  const progressBar = document.getElementById('scrollProgress');

  const updateProgress = progressBar ? () => {
    const st = window.scrollY;
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (st / dh * 100) + '%';
  } : null;

  // ─── Counter animation (for numbers on page) ──
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        // Extract number, prefix and suffix
        const match = text.match(/([^0-9]*)(\d+)([^0-9]*)/);
        if (match) {
          const prefix = match[1];
          const target = parseInt(match[2]);
          const suffix = match[3];
          const duration = 1200;
          const start = performance.now();
          const update = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = prefix + Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  // Mark elements for counter animation
  document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

  // ─── Subtle 3D tilt on card hover (desktop) ───
  if (window.matchMedia('(min-width: 769px)').matches) {
    document.querySelectorAll('.algo-feature, .why-card, .compat-card, .about-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-3px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ─── Scroll-to-top button ─────────────────────
  const scrollBtn = document.createElement('button');
  scrollBtn.className = 'scroll-top';
  scrollBtn.id = 'scrollTopBtn';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  scrollBtn.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>';
  document.body.appendChild(scrollBtn);

  const toggleScrollBtn = () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  };

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── Unified scroll handler ───────────────────
  // Single listener instead of 6 separate ones — better performance
  const onScroll = () => {
    handleScroll();         // navbar scroll effect
    if (wfTimeline) updateTimeline();  // workflow timeline
    if (updateProgress) updateProgress();  // progress bar
    if (updateHeroParallax) updateHeroParallax(); // hero parallax
    toggleScrollBtn();      // scroll-to-top visibility
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial state

});
