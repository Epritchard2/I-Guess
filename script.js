/**
 * I Guess — Guild Site
 */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ============================================================
// HEADER — scroll behavior
// ============================================================
(function initScrollHeader() {
  const header = $('#site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ============================================================
// MOBILE MENU
// ============================================================
(function initMobileMenu() {
  const btn = $('#mobile-menu-btn');
  const nav = $('#mobile-nav');
  if (!btn || !nav) return;

  const open = () => {
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close navigation menu');
    nav.classList.add('open');
    nav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open navigation menu');
    nav.classList.remove('open');
    nav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', () => {
    btn.classList.contains('open') ? close() : open();
  });
  $$('a', nav).forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.classList.contains('open')) { close(); btn.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (btn.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) close();
  });
})();

// ============================================================
// HERO + GENERAL SCROLL REVEAL
// ============================================================
(function initReveal() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supported = 'IntersectionObserver' in window;

  // reveal hero immediately
  $$('.hero [data-reveal]').forEach(el => el.classList.add('revealed'));

  const targets = $$('[data-reveal]:not(.revealed)');
  if (!targets.length) return;

  // If we can't animate safely, just show everything.
  if (reduce || !supported) {
    targets.forEach(el => el.classList.add('revealed'));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  targets.forEach(el => obs.observe(el));

  // Fail-safe: nothing should ever stay invisible.
  setTimeout(() => targets.forEach(el => el.classList.add('revealed')), 2500);
})();

// ============================================================
// STAGGERED CARD REVEAL
// ============================================================
(function initCardReveal() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return; // cards stay visible by default

  const groups = ['.feature-card', '.stat-list li', '.member-card'];
  const all = [];
  groups.forEach(sel => {
    const els = $$(sel);
    if (!els.length) return;
    els.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
      all.push(el);
    });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'none';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
  });

  // Fail-safe: reveal any card still hidden after a moment.
  setTimeout(() => all.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; }), 2500);
})();

// ============================================================
// ACTIVE NAV LINK
// ============================================================
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const isActive = href === path || (path === '' && href === 'index.html');
    link.classList.toggle('active', isActive);
  });
})();

// ============================================================
// FAQ ACCORDION
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  $$('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      $$('.faq-item').forEach(other => {
        other.classList.remove('open');
        const q = other.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
  });
});

// ============================================================
// APPLICATION FORM
// Validates, submits to Formspree, then reveals Discord invite.
// ============================================================
(function initApplicationForm() {
  const form = document.getElementById('application-form');
  if (!form) return;

  const successBox = document.getElementById('form-success');

  const setError = (input, errorId, msg) => {
    const errorEl = document.getElementById(errorId);
    if (input) input.classList.toggle('error', !!msg);
    if (errorEl) errorEl.textContent = msg || '';
  };
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  // required fields: id -> [errorId, label]
  const required = {
    'app-character': ['app-character-error', 'Character name is required.'],
    'app-email':     ['app-email-error', 'Email is required.'],
    'app-class':     ['app-class-error', 'Choose your class.'],
    'app-role':      ['app-role-error', 'Choose your role.'],
  };

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    let hasErrors = false;

    Object.entries(required).forEach(([id, [errId, msg]]) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (!el.value.trim()) { setError(el, errId, msg); hasErrors = true; }
      else setError(el, errId, '');
    });

    const emailEl = document.getElementById('app-email');
    if (emailEl && emailEl.value.trim() && !isValidEmail(emailEl.value)) {
      setError(emailEl, 'app-email-error', 'Enter a valid email address.');
      hasErrors = true;
    }

    if (hasErrors) {
      const firstErr = form.querySelector('.error');
      if (firstErr) firstErr.focus();
      return;
    }

    const submitBtn = form.querySelector('.form-submit');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

    // Submit to Formspree. If the form's action still has the placeholder,
    // skip the network call and just show the success state.
    const action = form.getAttribute('action') || '';
    const isConfigured = action && !action.includes('YOUR_FORM_ID');

    try {
      if (isConfigured) {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' },
        });
        if (!res.ok) throw new Error('Network response was not ok');
      }
      form.hidden = true;
      if (successBox) {
        successBox.hidden = false;
        successBox.focus();
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (err) {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit application'; }
      const formErr = document.getElementById('form-submit-error');
      if (formErr) formErr.textContent = 'Something went wrong sending your application. Try again, or reach us on Discord.';
    }
  });
})();
