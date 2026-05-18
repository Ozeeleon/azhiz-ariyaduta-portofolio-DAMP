/* ============================================================
   AZHIZ KRISHNA ARIYADUTA — PORTFOLIO  |  main.js
   ============================================================ */

'use strict';

/* ── LOADER ───────────────────────────────────────────────── */
const loader     = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
let progress = 0;

const interval = setInterval(() => {
  progress += Math.random() * 18;
  if (progress >= 100) {
    progress = 100;
    clearInterval(interval);
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      triggerReveal();
    }, 400);
  }
  loaderFill.style.width = progress + '%';
}, 80);

document.body.style.overflow = 'hidden';

/* ── CUSTOM CURSOR ────────────────────────────────────────── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animFollower);
})();

document.querySelectorAll('a, button, .chip, .filter-btn, .skill-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hovered');
    follower.classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hovered');
    follower.classList.remove('hovered');
  });
});

/* ── NAVBAR ────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── HAMBURGER MENU ───────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const overlay    = document.getElementById('menuOverlay');

function toggleMenu(open) {
  hamburger.classList.toggle('active', open);
  mobileMenu.classList.toggle('open', open);
  overlay.classList.toggle('visible', open);
  document.body.classList.toggle('no-scroll', open);
}

hamburger.addEventListener('click', () => toggleMenu(!mobileMenu.classList.contains('open')));
overlay.addEventListener('click', () => toggleMenu(false));

document.querySelectorAll('.mobile-menu__link').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

/* ── SMOOTH SCROLL ─────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ── TYPEWRITER ─────────────────────────────────────────────── */
const phrases = [
  'UI/UX Designer',
  'Frontend Developer',
  'Web Enthusiast',
  'Creative Coder',
];
let phraseIndex = 0, charIndex = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function type() {
  const current = phrases[phraseIndex];
  if (deleting) {
    typeEl.textContent = current.slice(0, --charIndex);
  } else {
    typeEl.textContent = current.slice(0, ++charIndex);
  }

  let delay = deleting ? 60 : 100;
  if (!deleting && charIndex === current.length) {
    delay = 2000; deleting = true;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 300;
  }
  setTimeout(type, delay);
}
type();

/* ── REVEAL ON SCROLL ─────────────────────────────────────── */
function triggerReveal() {
  const els = document.querySelectorAll('.reveal-up');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

/* Also observe section children on scroll */
document.querySelectorAll('.section__header, .about__grid, .skills__grid, .projects__grid, .contact__grid, .tools').forEach(el => {
  el.style.setProperty('--delay', '0s');
  el.classList.add('reveal-up');
});

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in-view'); sectionObserver.unobserve(e.target); }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-up').forEach(el => sectionObserver.observe(el));

/* ── SKILL BARS ANIMATION ─────────────────────────────────── */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar__fill').forEach(fill => {
        const level = fill.getAttribute('data-level');
        fill.style.width = level + '%';
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.skills__grid').forEach(el => barObserver.observe(el));

/* ── COUNTER ANIMATION ─────────────────────────────────────── */
function animateCounter(el, target) {
  const duration = 1600;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat__num').forEach(el => {
        animateCounter(el, parseInt(el.getAttribute('data-target')));
      });
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero__stats');
if (statsEl) counterObserver.observe(statsEl);

/* ── PROJECT FILTER ─────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const match = filter === 'all' || card.getAttribute('data-category') === filter;
      card.classList.toggle('hidden', !match);

      if (match) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        setTimeout(() => {
          card.style.transition = 'opacity .4s ease, transform .4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      }
    });
  });
});

/* ── TILT EFFECT on skill cards ─────────────────────────────── */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - .5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - .5) * -10;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── CONTACT FORM VALIDATION ─────────────────────────────────── */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess= document.getElementById('formSuccess');

function validateField(id, errorId, rule) {
  const el  = document.getElementById(id);
  const err = document.getElementById(errorId);
  const val = el.value.trim();
  const msg = rule(val);
  if (msg) {
    el.classList.add('error');
    err.textContent = msg;
    return false;
  }
  el.classList.remove('error');
  err.textContent = '';
  return true;
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const valid = [
    validateField('name',    'nameError',    v => !v ? 'Nama tidak boleh kosong.' : v.length < 2 ? 'Nama terlalu pendek.' : ''),
    validateField('email',   'emailError',   v => !v ? 'Email tidak boleh kosong.' : !/\S+@\S+\.\S+/.test(v) ? 'Format email tidak valid.' : ''),
    validateField('subject', 'subjectError', v => !v ? 'Subjek tidak boleh kosong.' : ''),
    validateField('message', 'messageError', v => !v ? 'Pesan tidak boleh kosong.' : v.length < 10 ? 'Pesan terlalu singkat.' : ''),
  ].every(Boolean);

  if (!valid) return;

  submitBtn.disabled = true;
  submitBtn.querySelector('.btn__text').textContent = 'Mengirim...';

  /* Simulate async submission */
  setTimeout(() => {
    form.reset();
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn__text').textContent = 'Kirim Pesan';
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1600);
});

/* Live validation */
['name','email','subject','message'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => {
    document.getElementById(id).classList.remove('error');
    document.getElementById(id + 'Error').textContent = '';
  });
});

/* ── ACTIVE NAV LINK on scroll ─────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => activeObserver.observe(s));
