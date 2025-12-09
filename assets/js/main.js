/**
 * BERKAHN - Main JavaScript
 * Menu, Scroll, and Animation Controllers
 */

(function() {
  'use strict';

  // =====================================================
  // DOM Elements
  // =====================================================

  const elements = {
    header: document.querySelector('.header'),
    menuToggle: document.querySelector('.menu-toggle'),
    closeMenu: document.querySelector('.close-menu'),
    sidebar: document.querySelector('.sidebar'),
    overlay: document.querySelector('.overlay'),
    sidebarLinks: document.querySelectorAll('.sidebar-nav a'),
    revealElements: document.querySelectorAll('.reveal')
  };

  // =====================================================
  // Mobile Menu Controller
  // =====================================================

  const MenuController = {
    isOpen: false,

    init() {
      if (!elements.menuToggle || !elements.sidebar) return;

      // Toggle menu on hamburger click
      elements.menuToggle.addEventListener('click', () => this.toggle());

      // Close menu on X button click
      if (elements.closeMenu) {
        elements.closeMenu.addEventListener('click', () => this.close());
      }

      // Close menu on overlay click
      if (elements.overlay) {
        elements.overlay.addEventListener('click', () => this.close());
      }

      // Close menu on link click
      elements.sidebarLinks.forEach(link => {
        link.addEventListener('click', () => this.close());
      });

      // Close menu on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Handle resize - close menu if window gets too wide
      window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && this.isOpen) {
          this.close();
        }
      });
    },

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },

    open() {
      this.isOpen = true;
      elements.sidebar.classList.add('open');
      if (elements.overlay) {
        elements.overlay.classList.add('visible');
      }
      document.body.classList.add('menu-open');

      // Focus management for accessibility
      if (elements.closeMenu) {
        setTimeout(() => elements.closeMenu.focus(), 100);
      }
    },

    close() {
      this.isOpen = false;
      elements.sidebar.classList.remove('open');
      if (elements.overlay) {
        elements.overlay.classList.remove('visible');
      }
      document.body.classList.remove('menu-open');

      // Return focus to menu toggle
      if (elements.menuToggle) {
        elements.menuToggle.focus();
      }
    }
  };

  // =====================================================
  // Header Scroll Controller
  // =====================================================

  const HeaderController = {
    lastScrollY: 0,
    ticking: false,

    init() {
      if (!elements.header) return;

      window.addEventListener('scroll', () => {
        this.lastScrollY = window.scrollY;
        if (!this.ticking) {
          window.requestAnimationFrame(() => {
            this.update();
            this.ticking = false;
          });
          this.ticking = true;
        }
      });

      // Initial check
      this.update();
    },

    update() {
      if (this.lastScrollY > 50) {
        elements.header.classList.add('scrolled');
      } else {
        elements.header.classList.remove('scrolled');
      }
    }
  };

  // =====================================================
  // Scroll Reveal Controller
  // =====================================================

  const RevealController = {
    init() {
      if (!elements.revealElements.length) return;

      // Check if IntersectionObserver is supported
      if (!('IntersectionObserver' in window)) {
        // Fallback: show all elements
        elements.revealElements.forEach(el => el.classList.add('visible'));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.1
        }
      );

      elements.revealElements.forEach(el => observer.observe(el));
    }
  };

  // =====================================================
  // Active Link Controller
  // =====================================================

  const ActiveLinkController = {
    init() {
      const currentPath = window.location.pathname;
      const links = document.querySelectorAll('.sidebar-nav a, .footer-links a');

      links.forEach(link => {
        const href = link.getAttribute('href');

        // Handle both absolute and relative paths
        if (href === currentPath ||
            href === currentPath.replace(/\/$/, '') ||
            (currentPath === '/' && href === '/') ||
            (currentPath.endsWith('index.html') && href === '/')) {
          link.classList.add('active');
        }
      });
    }
  };

  // =====================================================
  // Form Controller
  // =====================================================

  const FormController = {
    init() {
      const forms = document.querySelectorAll('form[data-ajax]');

      forms.forEach(form => {
        form.addEventListener('submit', (e) => this.handleSubmit(e, form));
      });
    },

    handleSubmit(e, form) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
        // Success state
        submitBtn.textContent = 'Enviado!';
        form.reset();

        // Reset button after delay
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 3000);
      }, 1500);
    }
  };

  // =====================================================
  // Smooth Scroll for Anchor Links
  // =====================================================

  const SmoothScrollController = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');

          if (targetId === '#') return;

          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            e.preventDefault();

            const headerHeight = elements.header ? elements.header.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  };

  // =====================================================
  // Image Lazy Loading
  // =====================================================

  const LazyLoadController = {
    init() {
      const lazyImages = document.querySelectorAll('img[data-src]');

      if (!lazyImages.length) return;

      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
      } else {
        // Fallback: load all images
        lazyImages.forEach(img => {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        });
      }
    }
  };

  // =====================================================
  // Initialize All Controllers
  // =====================================================

  function init() {
    MenuController.init();
    HeaderController.init();
    RevealController.init();
    ActiveLinkController.init();
    FormController.init();
    SmoothScrollController.init();
    LazyLoadController.init();
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
