/**
* Template Name: iLanding
* Template URL: https://bootstrapmade.com/ilanding-bootstrap-landing-page-template/
* Updated: Nov 12 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  initContactForm();

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  const navDropdownToggles = document.querySelectorAll('.navmenu .nav-dropdown-toggle');

  function setNavDropdownState(toggle, isOpen) {
    const dropdown = toggle.closest('.dropdown');
    const submenu = document.getElementById(toggle.getAttribute('aria-controls'));

    dropdown.classList.toggle('dropdown-open', isOpen);
    submenu.classList.toggle('dropdown-active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);

    if (isOpen) {
      dropdown.classList.remove('dropdown-focus-closed');
    }
  }

  function closeNavDropdowns(exceptToggle = null) {
    navDropdownToggles.forEach(toggle => {
      if (toggle !== exceptToggle) {
        setNavDropdownState(toggle, false);
      }
    });
  }

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
    const isOpen = document.querySelector('body').classList.contains('mobile-nav-active');
    mobileNavToggleBtn.setAttribute('aria-expanded', isOpen);
    mobileNavToggleBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');

    if (!isOpen) {
      closeNavDropdowns();
    }
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', (e) => {
      closeNavDropdowns();

      if (e.detail > 0) {
        navmenu.blur();
      }

      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle nav dropdowns
   */
  navDropdownToggles.forEach(toggle => {
    const dropdown = toggle.closest('.dropdown');
    const submenu = document.getElementById(toggle.getAttribute('aria-controls'));

    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      const isOpen = dropdown.classList.contains('dropdown-open');
      closeNavDropdowns(toggle);
      setNavDropdownState(toggle, !isOpen);

      if (e.detail > 0) {
        toggle.blur();
      }

      e.stopImmediatePropagation();
    });

    toggle.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        closeNavDropdowns(toggle);
        setNavDropdownState(toggle, true);
        submenu.querySelector('a')?.focus();
      }
    });

    dropdown.addEventListener('focusin', function() {
      if (window.matchMedia('(min-width: 1200px)').matches) {
        dropdown.classList.remove('dropdown-focus-closed');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });

    dropdown.addEventListener('focusout', function(e) {
      if (!dropdown.contains(e.relatedTarget) && !dropdown.classList.contains('dropdown-open')) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    dropdown.addEventListener('mouseenter', function() {
      if (window.matchMedia('(min-width: 1200px)').matches) {
        dropdown.classList.remove('dropdown-focus-closed');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });

    dropdown.addEventListener('mouseleave', function() {
      if (!dropdown.classList.contains('dropdown-open') && !dropdown.matches(':focus-within')) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    dropdown.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        toggle.focus();
        setNavDropdownState(toggle, false);
        dropdown.classList.add('dropdown-focus-closed');
      }
    });
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.navmenu .dropdown')) {
      closeNavDropdowns();
    }
  });

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Web3Forms contact form
   */
  function initContactForm() {
    const contactForm = document.querySelector('#contact-form');

    if (contactForm) {
      const submitButton = contactForm.querySelector('#contact-submit');
      const submitLabel = submitButton.querySelector('.contact-submit-label');
      const submitSpinner = submitButton.querySelector('.spinner-border');
      const statusMessage = contactForm.querySelector('#contact-form-status');
      const errorMessage = contactForm.querySelector('#contact-form-error');
      const defaultSubmitLabel = submitLabel.textContent;

      function clearContactMessages() {
        statusMessage.textContent = '';
        statusMessage.classList.remove('is-success');
        errorMessage.textContent = '';
        errorMessage.hidden = true;
      }

      function resetContactCaptcha() {
        if (typeof window.hcaptcha !== 'undefined') {
          window.hcaptcha.reset();
        }
      }

      contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        clearContactMessages();

        if (!contactForm.checkValidity()) {
          contactForm.reportValidity();
          contactForm.querySelector(':invalid')?.focus();
          return;
        }

        const captchaResponse = contactForm.querySelector('[name="h-captcha-response"]');

        if (!captchaResponse) {
          errorMessage.textContent = 'The spam check is still loading. Please wait a moment and try again.';
          errorMessage.hidden = false;
          errorMessage.focus();
          return;
        }

        if (!captchaResponse.value) {
          errorMessage.textContent = 'Please complete the hCaptcha check before sending your message.';
          errorMessage.hidden = false;
          const captchaFrame = contactForm.querySelector('.h-captcha iframe');
          captchaFrame ? captchaFrame.focus() : errorMessage.focus();
          return;
        }

        submitButton.disabled = true;
        contactForm.setAttribute('aria-busy', 'true');
        submitLabel.textContent = 'Sending…';
        submitSpinner.hidden = false;
        statusMessage.textContent = 'Sending your message…';

        try {
          const formData = new FormData(contactForm);
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
          });
          const result = await response.json().catch(() => null);

          if (!response.ok || !result?.success) {
            throw new Error(result?.message || 'Submission failed');
          }

          contactForm.reset();
          resetContactCaptcha();
          statusMessage.classList.add('is-success');
          statusMessage.textContent = 'Thank you. Your message has been sent successfully.';
        } catch (error) {
          console.error('Web3Forms submission failed:', error);
          resetContactCaptcha();
          errorMessage.textContent = 'We could not send your message. Your details have been kept; please complete the hCaptcha check and try again.';
          errorMessage.hidden = false;
          errorMessage.focus();
        } finally {
          submitButton.disabled = false;
          contactForm.removeAttribute('aria-busy');
          submitLabel.textContent = defaultSubmitLabel;
          submitSpinner.hidden = true;
        }
      });
    }
  }

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });

    navDropdownToggles.forEach(toggle => {
      const submenu = document.getElementById(toggle.getAttribute('aria-controls'));
      toggle.classList.toggle('active', Boolean(submenu.querySelector('a.active')));
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();
