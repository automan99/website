import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  applyConsent,
  readConsent,
  writeConsent
} from '../src/scripts/consent.mjs';

function createStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    dump: () => Object.fromEntries(map)
  };
}

function createWindow() {
  const calls = [];
  const events = [];
  class FakeCustomEvent {
    constructor(type, options = {}) {
      this.type = type;
      this.detail = options.detail;
    }
  }
  return {
    gtag: (...args) => calls.push(args),
    dispatchEvent: (event) => {
      events.push(event);
      return true;
    },
    CustomEvent: FakeCustomEvent,
    calls,
    events
  };
}

test('readConsent returns null when no preference is stored', () => {
  assert.equal(readConsent(createStorage()), null);
  assert.equal(readConsent(null), null);
});

test('readConsent rejects malformed or outdated preferences', () => {
  const malformed = createStorage({ [CONSENT_STORAGE_KEY]: '{not json' });
  assert.equal(readConsent(malformed), null);

  const outdated = createStorage({
    [CONSENT_STORAGE_KEY]: JSON.stringify({ version: CONSENT_VERSION + 1, advertising: true })
  });
  assert.equal(readConsent(outdated), null);
});

test('writeConsent stores a versioned advertising choice', () => {
  const storage = createStorage();
  const consent = writeConsent(true, storage);

  assert.equal(consent.version, CONSENT_VERSION);
  assert.equal(consent.necessary, true);
  assert.equal(consent.advertising, true);
  assert.match(consent.timestamp, /^\d{4}-\d{2}-\d{2}T/);
  assert.deepEqual(readConsent(storage), consent);
});

test('writeConsent records an explicit rejection', () => {
  const storage = createStorage();
  const consent = writeConsent(false, storage);

  assert.equal(consent.advertising, false);
  assert.deepEqual(readConsent(storage), consent);
});

test('applyConsent grants every consent signal when advertising is accepted', () => {
  const win = createWindow();
  applyConsent({ advertising: true }, win);

  assert.deepEqual(win.calls[0], [
    'consent',
    'update',
    {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted'
    }
  ]);
  assert.equal(win.events[0].type, 'traknova:consent');
  assert.equal(win.events[0].detail.advertising, true);
});

test('applyConsent denies every consent signal when advertising is rejected', () => {
  const win = createWindow();
  applyConsent({ advertising: false }, win);

  assert.deepEqual(win.calls[0], [
    'consent',
    'update',
    {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied'
    }
  ]);
  assert.equal(win.events[0].detail.advertising, false);
});
