(() => {
  const containerId = 'GTM-TPXPZN28';
  const storageKey = 'br_analytics_consent_v1';
  const privacySignal = navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });
  window.gtag('set', 'ads_data_redaction', true);
  window.gtag('set', 'allow_google_signals', false);
  window.gtag('set', 'allow_ad_personalization_signals', false);

  let consent = privacySignal ? 'denied' : localStorage.getItem(storageKey);
  let tagManagerLoaded = false;

  const loadTagManager = () => {
    if (tagManagerLoaded || consent !== 'granted' || privacySignal) return;
    tagManagerLoaded = true;
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const firstScript = document.getElementsByTagName('script')[0];
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
    firstScript.parentNode.insertBefore(script, firstScript);
  };

  const updateConsent = (choice) => {
    consent = privacySignal ? 'denied' : choice;
    localStorage.setItem(storageKey, consent);
    window.gtag('consent', 'update', {
      analytics_storage: consent === 'granted' ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    document.getElementById('br-analytics-consent')?.remove();
    if (consent === 'granted') loadTagManager();
  };

  const showConsent = () => {
    if (privacySignal || consent === 'granted' || consent === 'denied' || document.getElementById('br-analytics-consent')) return;
    const style = document.createElement('style');
    style.textContent = `
      #br-analytics-consent{position:fixed;z-index:10000;left:1rem;right:1rem;bottom:1rem;max-width:760px;margin:auto;padding:1rem 1.1rem;border:1px solid rgba(255,255,255,.15);border-radius:18px;background:#12161f;color:#fff;box-shadow:0 18px 60px rgba(0,0,0,.45);font:14px/1.5 Satoshi,system-ui,sans-serif}
      #br-analytics-consent p{margin:0;color:rgba(255,255,255,.72)}
      #br-analytics-consent strong{display:block;margin-bottom:.3rem;font-size:15px}
      #br-analytics-consent a{color:#76c6ff;text-decoration:underline}
      #br-analytics-consent .br-consent-actions{display:flex;flex-wrap:wrap;gap:.65rem;margin-top:.85rem}
      #br-analytics-consent button{min-height:42px;padding:.65rem 1rem;border-radius:999px;border:1px solid rgba(255,255,255,.22);font-weight:700;cursor:pointer}
      #br-consent-essential{background:transparent;color:#fff}
      #br-consent-allow{background:#2aa5ff;color:#06101e;border-color:#2aa5ff}
    `;
    document.head.appendChild(style);
    const banner = document.createElement('section');
    banner.id = 'br-analytics-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Analytics privacy choices');
    banner.innerHTML = `
      <strong>Your privacy choice</strong>
      <p>BR Lawn Care uses essential site features by default. Optional Google Analytics helps us understand site use only if you allow it. Form entries are never sent to analytics. Read the <a href="/privacy">privacy notice</a>.</p>
      <div class="br-consent-actions">
        <button id="br-consent-essential" type="button">Essential only</button>
        <button id="br-consent-allow" type="button">Allow analytics</button>
      </div>
    `;
    document.body.appendChild(banner);
    document.getElementById('br-consent-essential').addEventListener('click', () => updateConsent('denied'));
    document.getElementById('br-consent-allow').addEventListener('click', () => updateConsent('granted'));
  };

  const track = (event, parameters = {}) => {
    if (consent !== 'granted' || privacySignal) return false;
    window.dataLayer.push({ event, page_path: window.location.pathname, ...parameters });
    return true;
  };

  window.brAnalyticsConsent = {
    isGranted: () => consent === 'granted' && !privacySignal,
    reset: () => {
      localStorage.removeItem(storageKey);
      consent = privacySignal ? 'denied' : null;
      if (!privacySignal) showConsent();
    },
    track,
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (href.startsWith('tel:')) track('phone_click', { link_location: link.closest('header') ? 'header' : link.closest('footer') ? 'footer' : 'content' });
    if (href === '/contact' || href.startsWith('/contact?')) track('estimate_request_click', { link_location: link.closest('header') ? 'header' : link.closest('footer') ? 'footer' : 'content' });
  }, true);

  document.querySelectorAll('[data-analytics-consent-reset]').forEach((button) => button.addEventListener('click', () => window.brAnalyticsConsent.reset()));

  if (consent === 'granted' && !privacySignal) {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    loadTagManager();
  } else if (!consent && !privacySignal) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showConsent, { once: true });
    else showConsent();
  }
})();
