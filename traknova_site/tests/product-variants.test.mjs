import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseVariantHash,
  buildVariantHash,
  getInitialVariant,
  updateVariantHash,
  applyVariantState
} from '../src/scripts/product-variants.mjs';

test('parses a known variant hash', () => {
  assert.equal(parseVariantHash('#variant-rfid', ['standard', 'rfid']), 'rfid');
});

test('rejects an unknown variant hash', () => {
  assert.equal(parseVariantHash('#variant-missing', ['standard', 'rfid']), null);
  assert.equal(parseVariantHash('', ['standard']), null);
});

test('builds a variant hash', () => {
  assert.equal(buildVariantHash('5g'), '#variant-5g');
});

test('prefers hash, then default, then first variant', () => {
  assert.equal(getInitialVariant(['a', 'b'], 'a', '#variant-b'), 'b');
  assert.equal(getInitialVariant(['a', 'b'], 'b', '#variant-missing'), 'b');
  assert.equal(getInitialVariant(['a', 'b'], 'missing', ''), 'a');
});

test('updates the hash and notifies the language switcher', () => {
  const calls = [];
  const events = [];
  const fakeWindow = {
    location: { pathname: '/website/products/y100-series/', search: '' },
    history: { replaceState: (_state, _title, url) => calls.push(url) },
    Event: class {
      constructor(type) {
        this.type = type;
      }
    },
    dispatchEvent: (event) => events.push(event.type)
  };

  updateVariantHash('rfid', fakeWindow);

  assert.equal(calls[0], '/website/products/y100-series/#variant-rfid');
  assert.deepEqual(events, ['hashchange']);
});

test('applies the active variant to tabs, panels, columns and jump buttons', () => {
  const element = (dataset) => {
    const node = { dataset, attrs: {}, hidden: false, classNames: new Set() };
    node.setAttribute = (name, value) => {
      node.attrs[name] = value;
    };
    node.classList = {
      toggle: (name, force) => {
        if (force) node.classNames.add(name);
        else node.classNames.delete(name);
      }
    };
    return node;
  };

  const tabs = [element({ variantTab: 'a' }), element({ variantTab: 'b' })];
  const panels = [element({ variantPanel: 'a' }), element({ variantPanel: 'b' })];
  const columns = [element({ variantColumn: 'a' }), element({ variantColumn: 'b' })];
  const jumps = [element({ variantJump: 'a' }), element({ variantJump: 'b' })];
  const root = {
    querySelectorAll: (selector) => {
      if (selector.includes('data-variant-tab')) return tabs;
      if (selector.includes('data-variant-panel')) return panels;
      if (selector.includes('data-variant-column')) return columns;
      return jumps;
    }
  };

  applyVariantState(root, 'b');

  assert.equal(tabs[0].attrs['aria-selected'], 'false');
  assert.equal(tabs[1].attrs['aria-selected'], 'true');
  assert.equal(panels[0].hidden, true);
  assert.equal(panels[1].hidden, false);
  assert.ok(columns[1].classNames.has('is-active'));
  assert.equal(jumps[1].attrs['aria-pressed'], 'true');
});
