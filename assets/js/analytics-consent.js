(() => {
  "use strict";

  const consentStorageKey = "visualiseInfo.analyticsConsent";
  const acceptedConsent = "accepted";
  const rejectedConsent = "rejected";
  let analyticsLoaded = false;
  let consentBanner = null;
  let preferencesButton = null;

  function readConsent() {
    try {
      const storedConsent = window.localStorage.getItem(consentStorageKey);
      return [acceptedConsent, rejectedConsent].includes(storedConsent) ? storedConsent : null;
    } catch {
      return null;
    }
  }

  function writeConsent(consent) {
    try {
      window.localStorage.setItem(consentStorageKey, consent);
    } catch {
      // If storage is unavailable, the choice applies only to the current page.
    }
  }

  function loadAnalytics() {
    if (analyticsLoaded) return;

    analyticsLoaded = true;
    window.hj = window.hj || function () {
      (window.hj.q = window.hj.q || []).push(arguments);
    };
    window._hjSettings = { hjid: 3904011, hjsv: 6 };

    const analyticsScript = document.createElement("script");
    analyticsScript.async = true;
    analyticsScript.src = "https://static.hotjar.com/c/hotjar-"
      + window._hjSettings.hjid
      + ".js?sv="
      + window._hjSettings.hjsv;
    analyticsScript.dataset.optionalAnalytics = "true";
    document.head.appendChild(analyticsScript);
  }

  function closeConsentBanner() {
    consentBanner?.remove();
    consentBanner = null;
    preferencesButton.hidden = false;
  }

  function applyConsent(consent) {
    const previousConsent = readConsent();
    writeConsent(consent);

    if (consent === acceptedConsent) {
      loadAnalytics();
      closeConsentBanner();
      return;
    }

    if (previousConsent === acceptedConsent && analyticsLoaded) {
      window.location.reload();
      return;
    }

    closeConsentBanner();
  }

  function showConsentBanner() {
    if (consentBanner) return;

    const existingConsent = readConsent();
    preferencesButton.hidden = true;
    consentBanner = document.createElement("section");
    consentBanner.className = "site-consent-banner";
    consentBanner.setAttribute("role", "region");
    consentBanner.setAttribute("aria-labelledby", "site-consent-title");
    consentBanner.innerHTML = [
      '<div class="site-consent-banner__content">',
      '<strong id="site-consent-title">Privacy choices</strong>',
      '<p>We use optional analytics to understand how our website is used. These technologies only load if you accept them. ',
      '<a href="/privacy-policy.html#website-technologies">Read our Website Privacy Policy</a>.</p>',
      '</div>',
      '<div class="site-consent-banner__actions">',
      '<button class="site-consent-button site-consent-button--secondary" type="button" data-analytics-consent="rejected">Reject analytics</button>',
      '<button class="site-consent-button site-consent-button--primary" type="button" data-analytics-consent="accepted">Accept analytics</button>',
      '</div>',
      '<button class="site-consent-banner__close" type="button" aria-label="Close privacy choices"',
      existingConsent ? '>' : ' hidden>',
      '<i class="bi bi-x-lg" aria-hidden="true"></i>',
      '</button>'
    ].join("");

    consentBanner.querySelectorAll("[data-analytics-consent]").forEach((button) => {
      button.addEventListener("click", () => applyConsent(button.dataset.analyticsConsent));
    });
    consentBanner.querySelector(".site-consent-banner__close")?.addEventListener("click", closeConsentBanner);
    document.body.appendChild(consentBanner);
    consentBanner.querySelector("[data-analytics-consent]")?.focus();
  }

  function initialiseConsent() {
    preferencesButton = document.createElement("button");
    preferencesButton.className = "site-privacy-settings";
    preferencesButton.type = "button";
    preferencesButton.textContent = "Privacy choices";
    preferencesButton.addEventListener("click", showConsentBanner);
    document.body.appendChild(preferencesButton);

    const consent = readConsent();
    if (consent === acceptedConsent) {
      loadAnalytics();
      return;
    }

    if (consent === null) showConsentBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseConsent, { once: true });
  } else {
    initialiseConsent();
  }
})();
