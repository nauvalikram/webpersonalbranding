/* =============================================
   PORTFOLIO NAUVAL IKRAM WICAKSONO
   JavaScript - Animasi & Interaksi
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---- PRELOADER ----
  const preloader = document.getElementById('preloader');
  
  setTimeout(() => {
    preloader.classList.add('hidden');
    // Hapus preloader dari DOM setelah animasi selesai
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }, 2700);

  // ---- NAVBAR SCROLL ----
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar background
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });

    sidebarLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- MOBILE MENU ----
  const hamburger = document.getElementById('hamburger');
  const navSidebar = document.getElementById('navSidebar');
  const navOverlay = document.getElementById('navOverlay');

  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navSidebar.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navSidebar.classList.contains('active') ? 'hidden' : '';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    navSidebar.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMobileMenu);
  navOverlay.addEventListener('click', closeMobileMenu);

  // Close menu on link click
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
      
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });
  });

  // Smooth scroll for nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- SCROLL REVEAL ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay');
        if (delay) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, parseFloat(delay) * 1000);
        } else {
          entry.target.classList.add('revealed');
        }
        // Stop observing after reveal
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '-60px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- SKILL BARS ANIMATION ----
  const skillItems = document.querySelectorAll('.skill-item');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const percent = entry.target.getAttribute('data-percent');
        const fill = entry.target.querySelector('.skill-bar-fill');
        const percentText = entry.target.querySelector('.skill-percent');

        // Staggered delay based on index
        const index = Array.from(skillItems).indexOf(entry.target);
        const delay = index * 200;

        setTimeout(() => {
          if (fill) {
            fill.style.width = percent + '%';
          }
          if (percentText) {
            percentText.style.opacity = '1';
          }
        }, delay + 300);

        skillObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-60px'
  });

  skillItems.forEach(item => {
    const percentText = item.querySelector('.skill-percent');
    if (percentText) {
      percentText.style.opacity = '0';
      percentText.style.transition = 'opacity 0.4s ease';
    }
    skillObserver.observe(item);
  });

  // ---- NAVBAR INITIAL STATE (hide during preloader) ----
  navbar.style.opacity = '0';
  navbar.style.transform = 'translateY(-80px)';
  navbar.style.transition = 'opacity 0.6s ease, transform 0.6s ease, background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease';

  setTimeout(() => {
    navbar.style.opacity = '1';
    navbar.style.transform = 'translateY(0)';
  }, 2800);

});

// ---- HOBBY TABS ----
document.addEventListener('DOMContentLoaded', () => {
  const triggers = document.querySelectorAll('.hobby-trigger');
  const details = document.querySelectorAll('.hobby-detail');

  if (!triggers.length) return;

  function activate(hobby) {
    triggers.forEach(t => t.classList.toggle('active', t.dataset.hobby === hobby));
    details.forEach(d => d.classList.toggle('active', d.dataset.hobby === hobby));
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', () => activate(trigger.dataset.hobby));
    trigger.addEventListener('click', () => activate(trigger.dataset.hobby));
  });
});

// ---- PORTFOLIO TABS ----
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.porto-tab');
  const panels = document.querySelectorAll('.porto-panel');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`.porto-panel[data-panel="${target}"]`).classList.add('active');
    });
  });
});
