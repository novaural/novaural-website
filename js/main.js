/* =============================================
   NOVAURAL — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Logo subtitle alignment ──────────────────
  // Dynamically compute letter-spacing so MEDICAL·DEEP-TECH
  // fills the exact width of NOVAURAL above it
  const alignLogoSubtitle = () => {
    const brand = document.querySelector('.nav-logo-brand');
    const sub = document.querySelector('.nav-logo-sub');
    if (!brand || !sub) return;
    const brandW = brand.offsetWidth;
    // Measure natural width with no extra spacing
    sub.style.letterSpacing = '0px';
    const subW = sub.scrollWidth;
    // Count visual characters (text + dot span treated as 1 char)
    const charCount = sub.textContent.length + 1; // +1 for the dot span
    if (charCount > 1 && brandW > subW) {
      sub.style.letterSpacing = ((brandW - subW) / charCount) + 'px';
    }
  };
  alignLogoSubtitle();
  window.addEventListener('resize', alignLogoSubtitle);

  // ─── Navbar scroll effect ─────────────────────
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initial check

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
    '.outcome-col', '.why-card', '.detail-step', '.wf-step', '.gap-callout'
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
    window.addEventListener('scroll', updateTimeline, { passive: true });
    updateTimeline();
  }

  // ─── Active nav link on scroll ────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const highlightNav = () => {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinksAll.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--teal-400)';
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ─── Subtle parallax on hero ──────────────────
  const heroContent = document.querySelector('.hero-content');

  if (heroContent) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
        heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
      }
    }, { passive: true });
  }

  // ─── Scroll progress bar (inside navbar) ───────
  const progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    const updateProgress = () => {
      const st = window.scrollY;
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (st / dh * 100) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

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

});
