/**
 * BERKAHN - Main JavaScript
 * Menu, Scroll, Animation, and Page Load Controllers
 * Updated: Pure Black/White Design System
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
    sidebarNavItems: document.querySelectorAll('.sidebar-nav li'),
    revealElements: document.querySelectorAll('.reveal'),
    logo: document.querySelector('.logo'),
    headerCta: document.querySelector('.header-cta')
  };

  // =====================================================
  // Page Load Controller (NEW)
  // =====================================================

  const PageLoadController = {
    init() {
      // Wait for fonts to be ready for smooth text rendering
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => this.animatePageLoad());
      } else {
        // Fallback for browsers without Font Loading API
        window.addEventListener('load', () => this.animatePageLoad());
      }
    },

    animatePageLoad() {
      // Add page-loaded class to body for CSS animations
      document.body.classList.add('page-loaded');

      // Stagger animate header elements
      const headerElements = [
        elements.menuToggle,
        elements.logo,
        elements.headerCta
      ].filter(Boolean);

      headerElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('animate-in');
        }, 100 + (index * 100));
      });

      // Animate hero content if present
      const heroContent = document.querySelector('.hero-content');
      if (heroContent) {
        setTimeout(() => {
          heroContent.classList.add('animate-in');
        }, 400);
      }
    }
  };

  // =====================================================
  // Mobile Menu Controller (ENHANCED)
  // =====================================================

  const MenuController = {
    isOpen: false,

    init() {
      if (!elements.menuToggle || !elements.sidebar) return;

      // Toggle menu on hamburger click
      elements.menuToggle.addEventListener('click', () => this.toggle());

      // Close menu on X button click (if exists)
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

      // Add active class to hamburger for X animation
      elements.menuToggle.classList.add('active');
      elements.menuToggle.setAttribute('aria-expanded', 'true');

      // Reset menu items opacity for re-animation
      elements.sidebarNavItems.forEach(item => {
        item.style.opacity = '0';
      });

      elements.sidebar.classList.add('open');

      if (elements.overlay) {
        elements.overlay.classList.add('visible');
      }

      document.body.classList.add('menu-open');

      // Trigger stagger animation after sidebar opens
      setTimeout(() => {
        elements.sidebarNavItems.forEach(item => {
          item.style.opacity = '';
        });
      }, 50);

      // Focus management for accessibility
      const firstLink = elements.sidebar.querySelector('.sidebar-nav a');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 300);
      }
    },

    close() {
      this.isOpen = false;

      // Remove active class from hamburger
      elements.menuToggle.classList.remove('active');
      elements.menuToggle.setAttribute('aria-expanded', 'false');

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
  // Parallax Controller - Minimal Luxury
  // =====================================================

  const ParallaxController = {
    lastScrollY: 0,
    ticking: false,
    parallaxElements: [],

    init() {
      this.parallaxElements = document.querySelectorAll('[data-parallax]');

      if (!this.parallaxElements.length) return;

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

      // Initial update
      this.update();
    },

    update() {
      this.parallaxElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
        const offset = this.lastScrollY * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }
  };

  // =====================================================
  // Text Reveal Controller - Word by Word
  // =====================================================

  const TextRevealController = {
    revealElements: [],

    init() {
      this.revealElements = document.querySelectorAll('[data-text-reveal]');

      if (!this.revealElements.length) return;

      this.revealElements.forEach(el => {
        this.splitText(el);
      });

      // Observe text reveal elements
      if ('IntersectionObserver' in window) {
        const textObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                this.animateText(entry.target);
                textObserver.unobserve(entry.target);
              }
            });
          },
          {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
          }
        );

        this.revealElements.forEach(el => textObserver.observe(el));
      } else {
        // Fallback: animate all immediately
        this.revealElements.forEach(el => this.animateText(el));
      }
    },

    splitText(el) {
      const text = el.innerText;
      const words = text.split(' ');

      el.innerHTML = words
        .map(word => `<span class="reveal-word">${word}</span>`)
        .join(' ');
    },

    animateText(el) {
      const words = el.querySelectorAll('.reveal-word');
      let delay = 0;

      words.forEach(word => {
        word.style.animationDelay = `${delay}ms`;
        word.classList.add('animate-reveal-word');
        delay += 50;
      });
    }
  };

  // =====================================================
  // Count Up Controller - Stats Animation
  // =====================================================

  const CountUpController = {
    statsElements: [],

    init() {
      this.statsElements = document.querySelectorAll('[data-count]');

      if (!this.statsElements.length) return;

      if ('IntersectionObserver' in window) {
        const countObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                this.countUp(entry.target);
                countObserver.unobserve(entry.target);
              }
            });
          },
          {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
          }
        );

        this.statsElements.forEach(el => countObserver.observe(el));
      } else {
        // Fallback: show final values immediately
        this.statsElements.forEach(el => {
          el.textContent = el.getAttribute('data-count');
        });
      }
    },

    countUp(el) {
      const target = parseFloat(el.getAttribute('data-count'));
      const isPercentage = el.textContent.includes('%');
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = target / steps;
      let current = 0;

      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(counter);
        }
        el.textContent = isPercentage
          ? Math.floor(current) + '%'
          : Math.floor(current);
      }, duration / steps);
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
    PageLoadController.init();
    MenuController.init();
    HeaderController.init();
    ParallaxController.init();
    TextRevealController.init();
    CountUpController.init();
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
