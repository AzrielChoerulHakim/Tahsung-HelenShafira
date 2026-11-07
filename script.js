(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const button = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.nav');
  const links = [...document.querySelectorAll('.nav a')];
  const heroPhoto = document.querySelector('.hero-image');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function closeMenu() {
    navigation.classList.remove('open');
    document.body.classList.remove('menu-open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Buka navigasi');
  }

  button?.addEventListener('click', () => {
    const opening = !navigation.classList.contains('open');
    navigation.classList.toggle('open', opening);
    document.body.classList.toggle('menu-open', opening);
    button.setAttribute('aria-expanded', String(opening));
    button.setAttribute('aria-label', opening ? 'Tutup navigasi' : 'Buka navigasi');
  });

  links.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 880) closeMenu();
  });

  let framePending = false;
  function updateScrollEffects() {
    const scroll = Math.max(0, window.scrollY);
    const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.width = (scroll / scrollable * 100).toFixed(2) + '%';
    header.classList.toggle('scrolled', scroll > 35);

    if (!reduceMotion && heroPhoto && scroll < window.innerHeight * 1.5) {
      heroPhoto.style.setProperty('--photo-shift', Math.min(17, scroll * 0.025).toFixed(2) + 'px');
    }
    framePending = false;
  }
  function requestScrollEffects() {
    if (!framePending) {
      framePending = true;
      window.requestAnimationFrame(updateScrollEffects);
    }
  }
  window.addEventListener('scroll', requestScrollEffects, { passive: true });
  updateScrollEffects();

  const revealElements = [...document.querySelectorAll('.reveal')];
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -35px 0px', threshold: 0.09 });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  const chapterIds = ['profil', 'arah', 'struktur', 'berita', 'galeri'];
  const chapters = chapterIds.map(id => document.getElementById(id)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const chapterObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-25% 0px -55% 0px', threshold: 0 });
    chapters.forEach(chapter => chapterObserver.observe(chapter));
  }
})();