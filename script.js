/* ─── Smooth scroll (CSS scroll-behavior handles in-page anchors;
   this also corrects for the fixed header offset) ─────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = document.getElementById('header').offsetHeight;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ─── Header: glassmorphism class on scroll ──────────────────── */
const header   = document.getElementById('header');
const goTopBtn = document.getElementById('go-to-top');

window.addEventListener('scroll', onScroll, { passive: true });

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 20);
  goTopBtn.classList.toggle('show', y > 400);
  updateActiveNav(y);
}

/* ─── Go-to-top ──────────────────────────────────────────────── */
goTopBtn.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);

/* ─── Active nav link — guarded to skip redundant DOM writes ─── */
const sections = Array.from(document.querySelectorAll('main [id]'));
const navLinks = document.querySelectorAll('.nav-links a');
let lastActive  = '';

function updateActiveNav(y = window.scrollY) {
  const offset = header.offsetHeight + 20;
  let current = '';
  for (const sec of sections) {
    if (y >= sec.offsetTop - offset) current = sec.id;
  }
  if (current === lastActive) return;
  lastActive = current;
  navLinks.forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`)
  );
}

/* ─── Scroll reveal ──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    obs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .stagger-children').forEach(el =>
  revealObserver.observe(el)
);

/* ─── Mobile menu ────────────────────────────────────────────── */
const menuToggle = document.getElementById('menuToggle');
const navList    = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  const open = navList.classList.toggle('active');
  menuToggle.classList.toggle('active', open);
  menuToggle.setAttribute('aria-expanded', String(open));
});

navList.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navList.classList.remove('active');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ─── Init ───────────────────────────────────────────────────── */
updateActiveNav();
