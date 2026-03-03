/**
 * Joshua Rodgers Mwakipesile — Portfolio JavaScript
 * ===================================================
 * Handles: Theme toggle, navbar, typing effect,
 * scroll reveal, skill bars, project filter,
 * contact form validation, back-to-top.
 */

'use strict';

/* ── Utility ────────────────────────────────────────────── */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

/* ============================================================
   1. THEME TOGGLE
   ============================================================ */
const initTheme = () => {
  const btn = $('#theme-toggle');
  const root = document.documentElement;
  const stored = localStorage.getItem('theme') || 'dark';

  const apply = (t) => {
    root.dataset.theme = t;
    localStorage.setItem('theme', t);
    btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    btn.innerHTML = t === 'dark'
      ? `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
      : `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  };

  apply(stored);
  btn.addEventListener('click', () => {
    apply(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
};

/* ============================================================
   2. NAVBAR — scroll & active section
   ============================================================ */
const initNavbar = () => {
  const nav = $('#navbar');
  const links = $$('.nav-links a, .mobile-menu a');
  const sections = $$('section[id]');

  // Scroll effect
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);

    // Active link highlighting
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobile-menu');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close menu on link click
  $$('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
};

/* ============================================================
   3. TYPING EFFECT
   ============================================================ */
const initTyping = () => {
  const el = $('#typed-text');
  if (!el) return;

  const roles = [
    'Backend Developer',
    'Spring Boot Developer',
    'REST API Engineer',
    'Software Eng. Student',
    'Problem Solver',
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let delay = 120;

  const type = () => {
    const word = roles[roleIdx];

    if (!deleting) {
      el.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) {
        deleting = true;
        delay = 2200; // Pause before deleting
      } else {
        delay = 100;
      }
    } else {
      el.textContent = word.slice(0, --charIdx);
      delay = 55;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        delay = 380;
      }
    }

    setTimeout(type, delay);
  };

  type();
};

/* ============================================================
   4. SCROLL REVEAL
   ============================================================ */
const initReveal = () => {
  const revealEls = $$('.reveal, .reveal-left, .reveal-right');

  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => observer.observe(el));
};

/* ============================================================
   5. SKILL BARS ANIMATION
   ============================================================ */
const initSkillBars = () => {
  const bars = $$('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const target = bar.dataset.pct || '0';
        // slight delay for cascade effect
        setTimeout(() => { bar.style.width = target + '%'; }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
};

/* ============================================================
   6. PROJECT FILTERING
   ============================================================ */
const initProjectFilter = () => {
  const filterBtns = $$('.filter-btn');
  const cards = $$('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;
        card.classList.toggle('hidden', !show);
        // Smooth re-appear
        if (show) {
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = 'fadeInUp 0.4s ease forwards';
          });
        }
      });
    });
  });
};

/* ============================================================
   7. CONTACT FORM VALIDATION
   ============================================================ */
const initContactForm = () => {
  const form = $('#contact-form');
  if (!form) return;

  const showErr = (field, msg) => {
    field.classList.add('error');
    const err = field.parentElement.querySelector('.form-error');
    if (err) { err.textContent = msg; err.classList.add('show'); }
  };

  const clearErr = (field) => {
    field.classList.remove('error');
    const err = field.parentElement.querySelector('.form-error');
    if (err) err.classList.remove('show');
  };

  // Live validation
  $$('.form-input, .form-textarea', form).forEach(f => {
    f.addEventListener('input', () => clearErr(f));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = $('#f-name');
    const email = $('#f-email');
    const subject = $('#f-subject');
    const message = $('#f-message');

    if (!name.value.trim()) { showErr(name, 'Name is required.'); valid = false; }
    if (!email.value.trim()) {
      showErr(email, 'Email is required.'); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showErr(email, 'Please enter a valid email.'); valid = false;
    }
    if (!subject.value.trim()) { showErr(subject, 'Subject is required.'); valid = false; }
    if (!message.value.trim() || message.value.trim().length < 15) {
      showErr(message, 'Message must be at least 15 characters.'); valid = false;
    }

    if (valid) {
      // Show success (in production, replace with real submission)
      const success = $('#form-success');
      success.classList.add('show');
      form.reset();
      setTimeout(() => success.classList.remove('show'), 5000);
    }
  });
};

/* ============================================================
   8. BACK TO TOP
   ============================================================ */
const initBackTop = () => {
  const btn = $('#back-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

/* ============================================================
   9. SMOOTH SECTION ANCHORS (already handled by CSS scroll-behavior)
   but we enhance for nav link clicks with a tiny offset correction.
   ============================================================ */
const initSmoothScroll = () => {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = $(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
};

/* ============================================================
   10. TIMELINE ANIMATION
   ============================================================ */
const initTimeline = () => {
  const items = $$('.timeline-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, i * 150);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });
};

/* ============================================================
   11. FADE-IN ANIMATION KEYFRAME (inject into <head>)
   ============================================================ */
const injectKeyframes = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
};

/* ── Boot ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  injectKeyframes();
  initTheme();
  initNavbar();
  initTyping();
  initReveal();
  initSkillBars();
  initProjectFilter();
  initContactForm();
  initBackTop();
  initSmoothScroll();
  initTimeline();
  console.log('%c🚀 Portfolio loaded — Joshua Rodgers Mwakipesile', 'color:#7c6af0;font-weight:bold;font-size:13px;');
});