export function parseVariantHash(hash, variantIds) {
  if (typeof hash !== 'string') return null;
  const match = /^#variant-(.+)$/.exec(hash);
  if (!match) return null;
  const id = match[1];
  return variantIds.includes(id) ? id : null;
}

export function buildVariantHash(variantId) {
  return `#variant-${variantId}`;
}

export function getInitialVariant(variantIds, defaultId, hash) {
  const fromHash = parseVariantHash(hash, variantIds);
  if (fromHash) return fromHash;
  if (variantIds.includes(defaultId)) return defaultId;
  return variantIds[0] ?? null;
}

export function enhanceVariantSelector(root) {
  const tabs = Array.from(root.querySelectorAll('[data-variant-tab]'));
  const panels = Array.from(root.querySelectorAll('[data-variant-panel]'));
  const ids = tabs.map((tab) => tab.dataset.variantTab);
  if (ids.length === 0) return;

  const defaultId = root.dataset.defaultVariant || ids[0];
  let active = getInitialVariant(ids, defaultId, window.location.hash);

  const select = (id, { updateHash = true } = {}) => {
    if (!ids.includes(id)) return;
    active = id;

    for (const tab of tabs) {
      const isActive = tab.dataset.variantTab === id;
      tab.setAttribute('aria-selected', String(isActive));
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
      tab.classList.toggle('is-active', isActive);
    }

    for (const panel of panels) {
      panel.hidden = panel.dataset.variantPanel !== id;
    }

    if (updateHash) {
      const nextUrl = `${window.location.pathname}${window.location.search}${buildVariantHash(id)}`;
      window.history.replaceState(null, '', nextUrl);
    }
  };

  root.dataset.enhanced = 'true';
  select(active, { updateHash: false });

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.dataset.variantTab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();

      let nextIndex = index;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;

      const next = tabs[nextIndex];
      select(next.dataset.variantTab);
      next.focus();
    });
  });

  root.querySelectorAll('[data-variant-jump]').forEach((button) => {
    button.addEventListener('click', () => select(button.dataset.variantJump));
  });

  window.addEventListener('hashchange', () => {
    const id = parseVariantHash(window.location.hash, ids);
    if (id) select(id, { updateHash: false });
  });

  return active;
}
