/* ============================================================
   YANKI KUMPANYA – Main JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Loader ---------- */
  const loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', () => setTimeout(() => loader.classList.add('hidden'), 400));
    setTimeout(() => loader.classList.add('hidden'), 2500);
  }

  /* ---------- Sticky header ---------- */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ---------- Mobile menu ---------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn = document.querySelector('.mobile-nav .close-btn');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
    closeBtn?.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  /* ---------- Scroll-to-top ---------- */
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Fade-in on scroll ---------- */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

  new MutationObserver((mutations) => {
    mutations.forEach(m => {
      m.addedNodes.forEach(n => {
        if (n.nodeType === 1) {
          if (n.classList.contains('fade-in')) fadeObserver.observe(n);
          n.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
        }
      });
    });
  }).observe(document.body, { childList: true, subtree: true });

  /* ---------- Active nav link ---------- */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---------- Gallery Lightbox ---------- */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const prevBtn = lightbox?.querySelector('.prev');
  const nextBtn = lightbox?.querySelector('.next');
  const closeBtnLb = lightbox?.querySelector('.close');
  let galleryImages = [];
  let currentIndex = 0;

  if (lightbox) {
    document.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (item) {
        const allItems = Array.from(document.querySelectorAll('.gallery-item'));
        galleryImages = allItems.map(el => el.querySelector('img').src);
        currentIndex = allItems.indexOf(item);
        if (currentIndex !== -1) openLightbox(galleryImages[currentIndex]);
      }
    });

    closeBtnLb?.addEventListener('click', () => lightbox.classList.remove('active'));
    prevBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      lightboxImg.src = galleryImages[currentIndex];
    });
    nextBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      lightboxImg.src = galleryImages[currentIndex];
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') lightbox.classList.remove('active');
      if (e.key === 'ArrowLeft') prevBtn?.click();
      if (e.key === 'ArrowRight') nextBtn?.click();
    });
  }

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
  }

  /* ---------- Contact Form ---------- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button');
      const origText = btn.textContent;
      btn.textContent = 'Gönderiliyor...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Gönderildi!';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = origText;
          btn.disabled = false;
        }, 2000);
      }, 1200);
    });
  }
});
