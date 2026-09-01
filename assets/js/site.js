(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector(".site-header");
  const mobileToggle = document.querySelector("[data-nav-toggle]");
  const submenuToggles = document.querySelectorAll("[data-submenu-toggle]");
  const backToTop = document.querySelector(".back-to-top");

  function setHeaderState() {
    header?.classList.toggle("is-scrolled", window.scrollY > 80);
    backToTop?.classList.toggle("is-visible", window.scrollY > 320);
  }

  function setSubmenuState(toggle, isOpen) {
    const item = toggle.closest(".site-navigation__item");
    item?.classList.toggle("is-submenu-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  }

  function closeSubmenus(except = null) {
    submenuToggles.forEach((toggle) => {
      if (toggle !== except) {
        setSubmenuState(toggle, false);
      }
    });
  }

  function setMobileNavigationState(isOpen) {
    body.classList.toggle("site-nav-open", isOpen);

    if (!mobileToggle) return;

    mobileToggle.setAttribute("aria-expanded", String(isOpen));
    mobileToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    mobileToggle.classList.toggle("bi-list", !isOpen);
    mobileToggle.classList.toggle("bi-x", isOpen);

    if (!isOpen) closeSubmenus();
  }

  mobileToggle?.addEventListener("click", () => {
    setMobileNavigationState(!body.classList.contains("site-nav-open"));
  });

  submenuToggles.forEach((toggle) => {
    const item = toggle.closest(".site-navigation__item");
    const submenu = document.getElementById(toggle.getAttribute("aria-controls"));

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      const nextState = !item?.classList.contains("is-submenu-open");
      closeSubmenus(toggle);
      setSubmenuState(toggle, nextState);
    });

    toggle.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        closeSubmenus(toggle);
        setSubmenuState(toggle, true);
        submenu?.querySelector("a")?.focus();
      }
    });

    item?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSubmenuState(toggle, false);
        toggle.focus();
      }
    });

    item?.addEventListener("pointerenter", () => {
      if (!window.matchMedia("(min-width: 1200px)").matches) return;
      closeSubmenus(toggle);
      setSubmenuState(toggle, true);
    });

    item?.addEventListener("pointerleave", () => {
      if (window.matchMedia("(min-width: 1200px)").matches) {
        setSubmenuState(toggle, false);
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-navigation__item")) closeSubmenus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !body.classList.contains("site-nav-open")) return;

    event.preventDefault();
    setMobileNavigationState(false);
    mobileToggle?.focus();
  });

  document.querySelectorAll(".site-navigation a").forEach((link) => {
    link.addEventListener("click", () => setMobileNavigationState(false));
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 1200px)").matches) {
      setMobileNavigationState(false);
    }
  });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function initialiseReveals() {
    const items = document.querySelectorAll(
      ".section:not(.home-hero):not(.helios-hero):not(.graphql-hero) > .container"
    );
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!items.length || reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

    items.forEach((item) => {
      item.classList.add("reveal-item");
      observer.observe(item);
    });
  }

  function updateSectionNavigation() {
    const links = [...document.querySelectorAll('.site-navigation__link[href^="#"]')];
    if (!links.length) return;

    let current = null;
    const position = window.scrollY + 180;

    links.forEach((link) => {
      const section = document.querySelector(link.hash);
      if (section && position >= section.offsetTop && position < section.offsetTop + section.offsetHeight) {
        current = link;
      }
    });

    links.forEach((link) => link.classList.toggle("active", link === current));
  }

  function alignHashTarget() {
    if (!window.location.hash) return;

    const target = document.querySelector(window.location.hash);
    if (!target) return;

    const scrollMargin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - scrollMargin,
      behavior: "auto"
    });
  }

  function initialiseContactForm() {
    const contactForm = document.querySelector("#contact-form");
    if (!contactForm) return;

    const submitButton = contactForm.querySelector("#contact-submit");
    const submitLabel = submitButton.querySelector(".contact-submit-label");
    const submitSpinner = submitButton.querySelector(".spinner-border");
    const statusMessage = contactForm.querySelector("#contact-form-status");
    const errorMessage = contactForm.querySelector("#contact-form-error");
    const defaultSubmitLabel = submitLabel.textContent;

    function clearMessages() {
      statusMessage.textContent = "";
      statusMessage.classList.remove("is-success");
      errorMessage.textContent = "";
      errorMessage.hidden = true;
    }

    function resetCaptcha() {
      if (typeof window.hcaptcha !== "undefined") window.hcaptcha.reset();
    }

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearMessages();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        contactForm.querySelector(":invalid")?.focus();
        return;
      }

      const captchaResponse = contactForm.querySelector('[name="h-captcha-response"]');

      if (!captchaResponse) {
        errorMessage.textContent = "The spam check is still loading. Please wait a moment and try again.";
        errorMessage.hidden = false;
        errorMessage.focus();
        return;
      }

      if (!captchaResponse.value) {
        errorMessage.textContent = "Please complete the hCaptcha check before sending your message.";
        errorMessage.hidden = false;
        const captchaFrame = contactForm.querySelector(".h-captcha iframe");
        if (captchaFrame) captchaFrame.focus();
        else errorMessage.focus();
        return;
      }

      submitButton.disabled = true;
      contactForm.setAttribute("aria-busy", "true");
      submitLabel.textContent = "Sending…";
      submitSpinner.hidden = false;
      statusMessage.textContent = "Sending your message…";

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
        });
        const result = await response.json().catch(() => null);

        if (!response.ok || !result?.success) {
          throw new Error(result?.message || "Submission failed");
        }

        contactForm.reset();
        resetCaptcha();
        statusMessage.classList.add("is-success");
        statusMessage.textContent = "Thank you. Your message has been sent successfully.";
      } catch (error) {
        console.error("Web3Forms submission failed:", error);
        resetCaptcha();
        errorMessage.textContent = "We could not send your message. Your details have been kept; please complete the hCaptcha check and try again.";
        errorMessage.hidden = false;
        errorMessage.focus();
      } finally {
        submitButton.disabled = false;
        contactForm.removeAttribute("aria-busy");
        submitLabel.textContent = defaultSubmitLabel;
        submitSpinner.hidden = true;
      }
    });
  }

  initialiseReveals();
  initialiseContactForm();
  setHeaderState();
  updateSectionNavigation();

  window.addEventListener("scroll", () => {
    setHeaderState();
    updateSectionNavigation();
  }, { passive: true });

  window.addEventListener("load", () => {
    [100, 600, 1400].forEach((delay) => window.setTimeout(alignHashTarget, delay));
  });
})();
