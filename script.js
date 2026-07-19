/* ==========================================================================
   Huslee AI Studio — script.js
   Handles: theme toggle, mobile nav, smooth scroll + scrollspy, reveal
   animations, hero waveform/progress, counters, portfolio filter,
   testimonial slider, pricing toggle, FAQ accordion, contact form.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------
     1. THEME TOGGLE (dark/light, persisted in localStorage)
  --------------------------------------------------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const THEME_KEY = 'huslee-theme';

  function applyTheme(theme){
    root.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-pressed', theme === 'light');
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(savedTheme || (prefersLight ? 'light' : 'dark'));

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  /* ---------------------------------------------------------------------
     2. MOBILE NAV TOGGLE
  --------------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu after clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------------------
     3. STICKY NAV BACKGROUND ON SCROLL + BACK-TO-TOP BUTTON
  --------------------------------------------------------------------- */
  const navWrap = document.getElementById('navWrap');
  const backToTop = document.getElementById('backToTop');

  function handleScrollUI(){
    const scrolled = window.scrollY > 30;
    navWrap.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('show', window.scrollY > 500);
  }
  window.addEventListener('scroll', handleScrollUI, { passive: true });
  handleScrollUI();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------------------
     4. SCROLLSPY — highlight active nav link based on section in view
  --------------------------------------------------------------------- */
  const sections = ['home','services','portfolio','pricing','about','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navAnchors = document.querySelectorAll('[data-nav]');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        navAnchors.forEach(a => a.classList.remove('active'));
        const match = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if(match) match.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => spyObserver.observe(sec));

  /* ---------------------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  --------------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------------------
     6. HERO — animated waveform bars + render progress
  --------------------------------------------------------------------- */
  const waveform = document.getElementById('waveform');
  if(waveform){
    const barCount = 40;
    for(let i = 0; i < barCount; i++){
      const bar = document.createElement('span');
      const height = 8 + Math.random() * 38; // px
      bar.style.height = `${height}px`;
      bar.style.animationDelay = `${(Math.random() * 1.4).toFixed(2)}s`;
      waveform.appendChild(bar);
    }
  }

  const progressFill = document.getElementById('progressFill');
  const renderPct = document.getElementById('renderPct');
  if(progressFill && renderPct){
    let pct = 0;
    progressFill.style.width = '0%';
    // Kick off after a short delay so the transition is visible on load
    setTimeout(() => { progressFill.style.width = '98%'; }, 400);

    const pctInterval = setInterval(() => {
      pct += Math.ceil(Math.random() * 6) + 2;
      if(pct >= 98){
        pct = 98;
        clearInterval(pctInterval);
      }
      renderPct.textContent = `${pct}%`;
    }, 160);
  }

  /* ---------------------------------------------------------------------
     7. ANIMATED STAT / METRIC COUNTERS
  --------------------------------------------------------------------- */
  function animateCounter(el){
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const startTime = performance.now();

    function tick(now){
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.floor(eased * target);
      el.textContent = `${value}${suffix}`;
      if(progress < 1) requestAnimationFrame(tick);
      else el.textContent = `${target}${suffix}`;
    }
    requestAnimationFrame(tick);
  }

  const counterEls = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counterEls.forEach(el => counterObserver.observe(el));

  /* ---------------------------------------------------------------------
     8. PORTFOLIO — generate gallery items (CSS/SVG placeholders,
        no external images) + category filter
  --------------------------------------------------------------------- */
  const portfolioItems = [
    { cat: 'edit',  title: 'Weekly Vlog Recut',        tag: 'Video Editing',   c1:'#4f6ef7', c2:'#9b5cf6' },
    { cat: 'short', title: 'Podcast Highlight Clip',   tag: 'Shorts & Reels',  c1:'#9b5cf6', c2:'#ec5ec0' },
    { cat: 'thumb', title: 'Tech Review Thumbnail',    tag: 'Thumbnail Design',c1:'#ec5ec0', c2:'#4f6ef7' },
    { cat: 'image', title: 'Product Hero Render',      tag: 'Image Generation',c1:'#4f6ef7', c2:'#35d399' },
    { cat: 'edit',  title: 'Documentary Color Grade',  tag: 'Video Editing',   c1:'#35d399', c2:'#4f6ef7' },
    { cat: 'short', title: 'Gaming Rage Moment Cut',   tag: 'Shorts & Reels',  c1:'#9b5cf6', c2:'#4f6ef7' },
    { cat: 'thumb', title: 'Finance Explainer Cover',  tag: 'Thumbnail Design',c1:'#4f6ef7', c2:'#9b5cf6' },
    { cat: 'image', title: 'Fantasy Concept Art',       tag: 'Image Generation',c1:'#ec5ec0', c2:'#9b5cf6' },
    { cat: 'edit',  title: 'Brand Sponsorship Edit',    tag: 'Video Editing',   c1:'#4f6ef7', c2:'#ec5ec0' },
  ];

  const portfolioGrid = document.getElementById('portfolioGrid');
  if(portfolioGrid){
    portfolioItems.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'portfolio-item';
      el.setAttribute('data-cat', item.cat);
      el.setAttribute('data-reveal', '');
      el.innerHTML = `
        <div class="portfolio-thumb" style="background:linear-gradient(135deg, ${item.c1}33, ${item.c2}33)">
          <svg viewBox="0 0 24 24" fill="none" stroke="${item.c1}" stroke-width="1.4">
            <rect x="3" y="5" width="18" height="14" rx="2"/>
            <path d="M9 9.5v5l5-2.5z" fill="${item.c1}" stroke="none"/>
          </svg>
        </div>
        <div class="portfolio-overlay">
          <strong>${item.title}</strong>
          <span>${item.tag}</span>
        </div>
      `;
      portfolioGrid.appendChild(el);
      revealObserver.observe(el);
    });
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      document.querySelectorAll('.portfolio-item').forEach(item => {
        const match = filter === 'all' || item.getAttribute('data-cat') === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  });

  /* ---------------------------------------------------------------------
     9. TESTIMONIAL SLIDER
  --------------------------------------------------------------------- */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');

  if(track){
    const slides = track.children.length;
    let current = 0;
    let autoTimer;

    for(let i = 0; i < slides; i++){
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }

    function goTo(index){
      current = (index + slides) % slides;
      track.style.transform = `translateX(-${current * 100}%)`;
      [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function startAuto(){
      autoTimer = setInterval(() => goTo(current + 1), 6000);
    }
    function resetAuto(){
      clearInterval(autoTimer);
      startAuto();
    }

    prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    startAuto();
  }

  /* ---------------------------------------------------------------------
     10. PRICING — monthly / yearly billing toggle
  --------------------------------------------------------------------- */
  const billingSwitch = document.getElementById('billingSwitch');
  const labelMonthly = document.getElementById('labelMonthly');
  const labelYearly = document.getElementById('labelYearly');
  const amounts = document.querySelectorAll('.amount');
  const periods = document.querySelectorAll('.period');

  if(billingSwitch){
    billingSwitch.addEventListener('click', () => {
      const isYearly = billingSwitch.getAttribute('aria-checked') !== 'true';
      billingSwitch.setAttribute('aria-checked', isYearly);
      labelMonthly.classList.toggle('active', !isYearly);
      labelYearly.classList.toggle('active', isYearly);

      amounts.forEach(el => {
        const value = isYearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
        el.textContent = value;
      });
      periods.forEach(el => { el.textContent = isYearly ? '/mo, billed yearly' : '/mo'; });
    });
  }

  /* ---------------------------------------------------------------------
     11. FAQ ACCORDION
  --------------------------------------------------------------------- */
  document.querySelectorAll('.accordion-item').forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      // Close all others (single-open accordion)
      item.parentElement.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });

  /* ---------------------------------------------------------------------
     12. CONTACT FORM — client-side validation + fake submit
  --------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if(contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const fields = [
        { id: 'fullName', message: 'Please enter your name.' },
        { id: 'email', message: 'Please enter a valid email address.', isEmail: true },
        { id: 'service', message: 'Please select a service.' },
        { id: 'message', message: 'Tell us a bit about your project.' },
      ];

      fields.forEach(field => {
        const input = document.getElementById(field.id);
        const group = input.closest('.form-group');
        const errorSpan = contactForm.querySelector(`[data-error-for="${field.id}"]`);
        let fieldValid = input.value.trim().length > 0;

        if(fieldValid && field.isEmail){
          fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        }

        group.classList.toggle('invalid', !fieldValid);
        if(errorSpan) errorSpan.textContent = fieldValid ? '' : field.message;
        if(!fieldValid) valid = false;
      });

      if(!valid) return;

      // Simulate a network request (no backend wired up — front-end only demo)
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Sending…';

      setTimeout(() => {
        formSuccess.classList.add('show');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Send Message';

        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      }, 900);
    });

    // Clear individual field errors as the user types
    contactForm.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('invalid');
      });
    });
  }

  /* ---------------------------------------------------------------------
     13. NEWSLETTER FORM (footer) — lightweight fake subscribe
  --------------------------------------------------------------------- */
  const newsletterForm = document.getElementById('newsletterForm');
  if(newsletterForm){
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const button = newsletterForm.querySelector('button');
      if(!input.value.trim()) return;
      button.textContent = '✓';
      input.value = '';
      setTimeout(() => { button.textContent = '→'; }, 2000);
    });
  }

  /* ---------------------------------------------------------------------
     14. FOOTER YEAR
  --------------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

});
