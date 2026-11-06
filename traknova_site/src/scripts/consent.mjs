export const CONSENT_STORAGE_KEY = 'traknova-consent-v1';
export const CONSENT_VERSION = 1;

function safeStorage(win) {
  try {
    return win?.localStorage ?? null;
  } catch {
    return null;
  }
}

export function readConsent(storage) {
  if (!storage) return null;

  try {
    const raw = storage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const value = JSON.parse(raw);
    if (!value || value.version !== CONSENT_VERSION) return null;

    return {
      version: CONSENT_VERSION,
      necessary: true,
      advertising: value.advertising === true,
      timestamp: typeof value.timestamp === 'string' ? value.timestamp : null
    };
  } catch {
    return null;
  }
}

export function writeConsent(advertising, storage) {
  const value = {
    version: CONSENT_VERSION,
    necessary: true,
    advertising: Boolean(advertising),
    timestamp: new Date().toISOString()
  };

  if (storage) {
    try {
      storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Storage can be unavailable in private browsing; the choice still applies for this page.
    }
  }

  return value;
}

export function applyConsent(consent, win) {
  const granted = consent?.advertising === true;

  if (win && typeof win.gtag === 'function') {
    win.gtag('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied'
    });
  }

  if (win && typeof win.dispatchEvent === 'function' && typeof win.CustomEvent === 'function') {
    win.dispatchEvent(new win.CustomEvent('traknova:consent', { detail: consent }));
  }

  return consent;
}

export function initConsent(doc = document, win = window) {
  const banner = doc.querySelector('[data-consent-banner]');
  if (!banner) return null;

  const prefs = banner.querySelector('[data-consent-prefs]');
  const main = banner.querySelector('[data-consent-main]');
  const advertising = banner.querySelector('[data-consent-category="advertising"]');
  const storage = safeStorage(win);

  const setPanel = (open) => {
    if (!prefs) return;
    prefs.hidden = !open;
    if (main) main.hidden = open;

    if (open) {
      const stored = readConsent(storage);
      if (advertising) advertising.checked = stored?.advertising === true;
      prefs.querySelector('input:not([disabled]), button')?.focus();
    }
  };

  const show = (withPanel = false) => {
    banner.hidden = false;
    setPanel(withPanel);
    if (!withPanel) banner.querySelector('button')?.focus();
  };

  const hide = () => {
    banner.hidden = true;
    setPanel(false);
  };

  const save = (value) => {
    const consent = writeConsent(value, storage);
    applyConsent(consent, win);
    hide();
  };

  banner.querySelector('[data-consent-accept]')?.addEventListener('click', () => save(true));
  banner.querySelector('[data-consent-reject]')?.addEventListener('click', () => save(false));
  banner.querySelector('[data-consent-preferences]')?.addEventListener('click', () => setPanel(true));
  banner.querySelector('[data-consent-cancel]')?.addEventListener('click', () => setPanel(false));
  banner.querySelector('[data-consent-save]')?.addEventListener('click', () => save(advertising?.checked === true));

  doc.querySelectorAll('[data-consent-open]').forEach((el) => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      show(true);
    });
  });

  const stored = readConsent(storage);
  if (stored) {
    applyConsent(stored, win);
    banner.hidden = true;
  } else {
    banner.hidden = false;
  }

  const api = {
    get: () => readConsent(storage),
    open: () => show(true),
    close: hide
  };
  win.traknovaConsent = api;
  return api;
}
