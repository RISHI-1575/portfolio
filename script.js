/* ============================================================
   RISHI SHASHIKANTH — PORTFOLIO 2
   script.js
   ============================================================ */

/* ---------- Theme toggle ---------- */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = themeToggle ? themeToggle.querySelector('.theme-icon') : null;

function applyTheme(dark) {
  document.body.setAttribute('data-theme', dark ? 'dark' : 'light');
  const icon = document.querySelector('#theme-toggle .theme-icon');
  if (icon) icon.textContent = dark ? '☽' : '☀';
  try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch(e) {}
}

window._toggleTheme = function() {
  applyTheme(document.body.getAttribute('data-theme') !== 'dark');
};

(function initTheme() {
  let saved;
  try { saved = localStorage.getItem('theme'); } catch(e) {}
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved ? saved === 'dark' : prefersDark);
})();

if (themeToggle) {
  themeToggle.addEventListener('click', window._toggleTheme);
}

/* ---------- Navbar scroll ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ---------- Hamburger / mobile menu ---------- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ---------- Active nav on scroll ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a, .mobile-menu a');

const navObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)
      );
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => navObs.observe(s));

/* ---------- Reduced motion preference ---------- */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Typewriter ---------- */
const roles = [
  'AI/ML Engineer',
  'LLM Systems Builder',
  'Automation Architect',
  'Generative AI Developer',
  'Tech Founder',
];
let rIdx = 0, cIdx = 0, isDeleting = false;
const tw = document.getElementById('typewriter');

if (prefersReducedMotion) {
  tw.textContent = roles[0]; // static text, no animation
} else {
  function typeLoop() {
    const current = roles[rIdx];
    if (!isDeleting && cIdx <= current.length) {
      tw.textContent = current.slice(0, cIdx++);
      setTimeout(typeLoop, 72);
    } else if (!isDeleting) {
      isDeleting = true;
      setTimeout(typeLoop, 1800);
    } else if (isDeleting && cIdx > 0) {
      tw.textContent = current.slice(0, --cIdx);
      setTimeout(typeLoop, 34);
    } else {
      isDeleting = false;
      rIdx = (rIdx + 1) % roles.length;
      setTimeout(typeLoop, 240);
    }
  }
  typeLoop();
}

/* ---------- Scroll reveal (fade-in) ---------- */
if (prefersReducedMotion) {
  document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
} else {
  const fadeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => fadeObs.observe(el));
}

/* ---------- Copy email on click ---------- */
const emailCC  = document.getElementById('email-cc');
const copyArr  = document.getElementById('copy-arr');
if (emailCC) {
  emailCC.addEventListener('click', () => {
    navigator.clipboard.writeText('rishi.s1575@gmail.com').then(() => {
      copyArr.textContent   = '✓';
      copyArr.style.color   = '#059669';
      copyArr.style.fontWeight = '700';
      setTimeout(() => {
        copyArr.textContent   = '↗';
        copyArr.style.color   = '';
        copyArr.style.fontWeight = '';
      }, 2000);
    });
  });
}

/* ---------- 3D tilt on cards and photo ---------- */
if (!prefersReducedMotion) {
  function attachTilt(selector, maxDeg) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${x * maxDeg * 2}deg) rotateX(${-y * maxDeg}deg) translateY(-4px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }
  attachTilt('.proj-card', 6);
  attachTilt('.hero-photo-wrap', 8);
}

/* ---------- Smooth scroll for anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
});
