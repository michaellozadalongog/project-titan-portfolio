
(() => {
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const progress = document.querySelector('.scroll-progress span');

  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 16);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    }
  };
  updateHeader();
  addEventListener('scroll', updateHeader, { passive: true });

  menuButton?.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    body.classList.toggle('menu-open', open);
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  }));

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Reveal-on-scroll, with a no-motion fallback.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('is-visible'));
  }

  // Count-up metrics
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const animateCounter = el => {
      const target = Number(el.dataset.count);
      const decimals = Number(el.dataset.decimals || 0);
      const suffix = el.dataset.suffix || '';
      const duration = 1100;
      const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const current = target * eased;
        el.textContent = `${current.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        })}${suffix}`;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .45 });
    counters.forEach(c => counterObserver.observe(c));
  }

  // FEA tabbed viewer
  const feaTabs = [...document.querySelectorAll('.fea-tab')];
  const feaImg = document.querySelector('#fea-main-image');
  const feaTitle = document.querySelector('#fea-main-title');
  const feaValue = document.querySelector('#fea-main-value');
  const feaCopy = document.querySelector('#fea-main-copy');
  const dynamicLightboxButton = document.querySelector('[data-dynamic-lightbox]');
  feaTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      feaTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      if (feaImg) {
        feaImg.style.opacity = '.25';
        setTimeout(() => {
          feaImg.src = tab.dataset.image;
          feaImg.alt = tab.dataset.alt;
          feaImg.style.opacity = '1';
        }, 130);
      }
      if (feaTitle) feaTitle.textContent = tab.dataset.title;
      if (feaValue) feaValue.textContent = tab.dataset.value;
      if (feaCopy) feaCopy.textContent = tab.dataset.copy;
      if (dynamicLightboxButton) {
        dynamicLightboxButton.dataset.lightbox = tab.dataset.image;
        dynamicLightboxButton.dataset.caption = `${tab.dataset.title}: ${tab.dataset.value}`;
      }
    });
  });

  // Accessible image lightbox
  const dialog = document.querySelector('[data-lightbox-dialog]');
  const dialogImage = dialog?.querySelector('img');
  const dialogCaption = dialog?.querySelector('figcaption');
  const closeButton = dialog?.querySelector('.lightbox-close');
  const prevButton = dialog?.querySelector('.lightbox-prev');
  const nextButton = dialog?.querySelector('.lightbox-next');
  let triggers = [];
  let currentIndex = 0;
  let lastFocused = null;

  const refreshTriggers = () => {
    triggers = [...document.querySelectorAll('[data-lightbox]')];
  };
  refreshTriggers();

  const openLightbox = (trigger) => {
    refreshTriggers();
    currentIndex = Math.max(0, triggers.indexOf(trigger));
    lastFocused = document.activeElement;
    showCurrent();
    dialog?.classList.add('is-open');
    dialog?.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
    closeButton?.focus();
  };
  const showCurrent = () => {
    const trigger = triggers[currentIndex];
    if (!trigger || !dialogImage) return;
    dialogImage.src = trigger.dataset.lightbox;
    dialogImage.alt = trigger.querySelector('img')?.alt || trigger.dataset.caption || 'Expanded project image';
    if (dialogCaption) dialogCaption.textContent = trigger.dataset.caption || '';
    const multiple = triggers.length > 1;
    if (prevButton) prevButton.hidden = !multiple;
    if (nextButton) nextButton.hidden = !multiple;
  };
  const closeLightbox = () => {
    dialog?.classList.remove('is-open');
    dialog?.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
    lastFocused?.focus();
  };
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-lightbox]');
    if (trigger) openLightbox(trigger);
  });
  closeButton?.addEventListener('click', closeLightbox);
  dialog?.addEventListener('click', e => {
    if (e.target === dialog) closeLightbox();
  });
  prevButton?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + triggers.length) % triggers.length;
    showCurrent();
  });
  nextButton?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % triggers.length;
    showCurrent();
  });
  addEventListener('keydown', e => {
    if (!dialog?.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevButton?.click();
    if (e.key === 'ArrowRight') nextButton?.click();
  });
})();
