/**
 * ROSHNI P R - DEVELOPER PORTFOLIO
 * Vanilla JavaScript for Interactive UI, Modals, Form Validation, and Scroll Effects
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const sections = document.querySelectorAll('section[id]');
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastMessage = document.getElementById('toast-message');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const contactForm = document.getElementById('contact-form');
  const backToTopBtn = document.getElementById('back-to-top');
  const currentYearSpan = document.getElementById('current-year');
  const resumeButtons = document.querySelectorAll('.resume-trigger-btn');
  const resumeModal = document.getElementById('modal-resume');
  const printResumeBtn = document.getElementById('print-resume-btn');
  const projectModalButtons = document.querySelectorAll('.btn-view-project');
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const modalCloseButtons = document.querySelectorAll('.modal-close-btn');

  // Set current copyright year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     1. SCROLL PROGRESS BAR & NAVBAR SCROLLED STATE
     -------------------------------------------------------------------------- */
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;

    if (scrollProgress) {
      scrollProgress.style.width = `${scrollPercent}%`;
    }

    if (navbar) {
      if (scrollTop > 50) {
        navbar.parentElement.classList.add('navbar-scrolled');
      } else {
        navbar.parentElement.classList.remove('navbar-scrolled');
      }
    }
  });

  /* --------------------------------------------------------------------------
     2. ACTIVE SECTION HIGHLIGHTING (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  const sectionObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, sectionObserverOptions);

  sections.forEach((sec) => sectionObserver.observe(sec));

  /* --------------------------------------------------------------------------
     3. SCROLL REVEAL ANIMATIONS
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  /* --------------------------------------------------------------------------
     4. MOBILE DRAWER NAVIGATION
     -------------------------------------------------------------------------- */
  if (mobileToggle && mobileDrawer) {
    const toggleMobileMenu = () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      } else {
        mobileDrawer.classList.add('open');
        mobileToggle.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    };

    mobileToggle.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('open')) {
          toggleMobileMenu();
        }
      });
    });

    // Close when clicking outside content
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        toggleMobileMenu();
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. MODAL SYSTEM (PROJECTS & RESUME)
     -------------------------------------------------------------------------- */
  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const closeAllModals = () => {
    modalOverlays.forEach((modal) => {
      closeModal(modal);
    });
  };

  // Open Project Modals
  projectModalButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        openModal(targetModal);
      }
    });
  });

  // Open Resume Modal
  resumeButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('open');
      }
      openModal(resumeModal);
    });
  });

  // Close buttons
  modalCloseButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const parentModal = btn.closest('.modal-overlay');
      closeModal(parentModal);
    });
  });

  // Close on backdrop click
  modalOverlays.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  // Print / Save Resume
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  /* --------------------------------------------------------------------------
     6. TOAST NOTIFICATION SYSTEM
     -------------------------------------------------------------------------- */
  let toastTimeout = null;

  const showToast = (title, message, duration = 3500) => {
    if (!toast) return;

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    toast.classList.add('show');

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  /* --------------------------------------------------------------------------
     7. COPY EMAIL TO CLIPBOARD
     -------------------------------------------------------------------------- */
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'roshni.pr.ece@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast('Copied to Clipboard!', `${email} is copied.`);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Copied!', `${email} is copied.`);
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. CONTACT FORM VALIDATION & SUBMISSION
     -------------------------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const messageInput = document.getElementById('form-message');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        nameInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        emailInput.closest('.form-group').classList.remove('has-error');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      } else {
        messageInput.closest('.form-group').classList.remove('has-error');
      }

      if (isValid) {
        const submitBtn = contactForm.querySelector('#submit-btn');
        const originalContent = submitBtn.innerHTML;

        // Feedback state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalContent;
          showToast('Message Sent!', 'Thank you, Roshni will get back to you soon.');
          contactForm.reset();
        }, 1200);
      }
    });

    // Clear error on user input
    ['form-name', 'form-email', 'form-message'].forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('input', () => {
          field.closest('.form-group').classList.remove('has-error');
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     9. BACK TO TOP BUTTON
     -------------------------------------------------------------------------- */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     10. INTERACTIVE MOUSE SPOTLIGHT ON GLASS CARDS
     -------------------------------------------------------------------------- */
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
});
