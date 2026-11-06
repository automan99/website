import test from 'node:test';
import assert from 'node:assert/strict';
import { applyHashToLanguageLinks } from '../src/scripts/lang-switcher.mjs';

class FakeLink {
  constructor(href) {
    this.attributes = new Map([['href', href]]);
  }

  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }
}

test('adds the current hash to every language link', () => {
  const links = [new FakeLink('/zh/solutions/'), new FakeLink('/solutions/')];
  applyHashToLanguageLinks(links, '#logistics');
  assert.equal(links[0].getAttribute('href'), '/zh/solutions/#logistics');
  assert.equal(links[1].getAttribute('href'), '/solutions/#logistics');
});

test('replaces the hash when it changes after load', () => {
  const link = new FakeLink('/zh/solutions/');
  applyHashToLanguageLinks([link], '#logistics');
  applyHashToLanguageLinks([link], '#manufacturing');
  assert.equal(link.getAttribute('href'), '/zh/solutions/#manufacturing');
});

test('removes the hash when navigating to a page without one', () => {
  const link = new FakeLink('/zh/solutions/');
  applyHashToLanguageLinks([link], '#logistics');
  applyHashToLanguageLinks([link], '');
  assert.equal(link.getAttribute('href'), '/zh/solutions/');
});
