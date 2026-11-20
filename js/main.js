/** Cardápio interativo - sem dependências externas. */
(() => {
  'use strict';

  const WHATSAPP_NUMBER = '5521967669976';
  const money = value => new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
  }).format(value);
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const cards = $$('.card[data-category]');
  const drawer = $('#cartDrawer');
  const overlay = $('#overlay');
  const cartItems = $('#cartItems');
  const closeButton = $('[data-close-cart]:not(.overlay)');
  const cart = [];
  let previousFocus;

  function filterProducts(category) {
    $$('.filter-btn').forEach(button => {
      const active = button.dataset.filter === category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    let visible = 0;
    cards.forEach(card => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
      if (!card.hidden) visible++;
    });
    $('#noResults').hidden = visible > 0;
  }

  $$('.filter-btn').forEach(button => {
    button.addEventListener('click', () => filterProducts(button.dataset.filter));
  });

  $$('.gallery').forEach(gallery => {
    const main = $('.main-photo', gallery);
    if (!main) return;
    const thumbs = $$('.thumb', gallery);
    thumbs.forEach((button, index) => {
      button.addEventListener('click', () => {
        main.src = button.dataset.full;
        main.alt = button.dataset.alt || main.alt;
        thumbs.forEach(thumb => {
          const active = thumb === button;
          thumb.classList.toggle('active', active);
          thumb.setAttribute('aria-pressed', String(active));
        });
        const counter = $('.photo-index', gallery);
        if (counter) counter.textContent = `Foto ${index + 1} de ${thumbs.length}`;
      });
    });
  });

  const itemCount = () => cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = () => cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  // Create customer-generated text as text nodes, never as HTML.
  function addText(parent, tag, value, className) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value;
    parent.append(element);
    return element;
  }

  function renderCart() {
    const count = itemCount();
    document.body.classList.toggle('has-items', count > 0);
    $('.cart-float').classList.toggle('is-empty', count === 0);
    $$('[data-cart-count]').forEach(element => { element.textContent = count; });
    $('#cartWord').textContent = count === 1 ? 'item' : 'itens';
    $('#mobileTotal').textContent = money(cartTotal());
    $('#cartTotal').textContent = money(cartTotal());
    cartItems.replaceChildren();

    if (!cart.length) {
      addText(cartItems, 'div', 'Sua sacola está vazia. Selecione seus produtos no cardápio para começar.', 'empty');
      return;
    }

    cart.forEach((item, index) => {
      const article = document.createElement('article');
      article.className = 'cart-item';
      const content = document.createElement('div');
      addText(content, 'h3', item.name);
      if (item.note) addText(content, 'small', `Obs.: ${item.note}`);
      const controls = document.createElement('div');
      controls.className = 'item-controls';
      [['minus', '−', 'Diminuir quantidade'], ['plus', '+', 'Aumentar quantidade']].forEach(([action, label, aria]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.cartChange = action;
        button.dataset.index = index;
        button.setAttribute('aria-label', aria);
        button.textContent = label;
        controls.append(button);
        if (action === 'minus') addText(controls, 'strong', item.qty);
      });
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'remove';
      remove.dataset.cartChange = 'remove';
      remove.dataset.index = index;
      remove.textContent = 'Remover';
      controls.append(remove);
      content.append(controls);
      article.append(content);
      addText(article, 'span', money(item.qty * item.price), 'item-price');
      cartItems.append(article);
    });
  }

  const boundedQty = value => Math.min(99, Math.max(1, Number.parseInt(value, 10) || 1));

  $('#productGrid').addEventListener('click', event => {
    const button = event.target.closest('button');
    const card = button?.closest('.card');
    if (!card) return;
    const quantity = $('.qty-input', card);
    if (button.classList.contains('qty-btn')) {
      quantity.value = boundedQty(boundedQty(quantity.value) + (button.dataset.action === 'plus' ? 1 : -1));
      return;
    }
    if (!button.classList.contains('add-btn')) return;
    const price = Number(card.dataset.price);
    if (!Number.isFinite(price) || price <= 0) return;
    const qty = boundedQty(quantity.value);
    const selection = $('.select', card)?.value.trim() || '';
    const note = $('.note-input', card)?.value.trim().slice(0, 300) || '';
    const name = `${card.dataset.name}${selection ? ' — ' + selection : ''}`;
    const key = [card.dataset.sku, selection, note].join('|');
    const existing = cart.find(item => item.key === key);
    if (existing) existing.qty = Math.min(99, existing.qty + qty);
    else cart.push({key, name, price, qty, note});
    renderCart();
    button.textContent = '✓ Adicionado à sacola';
    window.setTimeout(() => { if (button.isConnected) button.textContent = 'Adicionar à sacola'; }, 900);
  });

  cartItems.addEventListener('click', event => {
    const button = event.target.closest('button[data-cart-change]');
    if (!button) return;
    const index = Number(button.dataset.index);
    const item = cart[index];
    if (!item) return;
    if (button.dataset.cartChange === 'remove') cart.splice(index, 1);
    else if (button.dataset.cartChange === 'plus') item.qty = Math.min(99, item.qty + 1);
    else if (--item.qty <= 0) cart.splice(index, 1);
    renderCart();
  });

  function openCart() {
    previousFocus = document.activeElement;
    drawer.classList.add('open');
    overlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('locked');
    closeButton.focus();
  }
  function closeCart() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('locked');
    previousFocus?.focus();
  }
  $$('[data-cart-open]').forEach(button => button.addEventListener('click', openCart));
  $$('[data-close-cart]').forEach(button => button.addEventListener('click', closeCart));
  document.addEventListener('keydown', event => {
    if (!drawer.classList.contains('open')) return;
    if (event.key === 'Escape') closeCart();
    if (event.key !== 'Tab') return;
    const focusable = $$('button:not([disabled]), a[href], input:not([disabled])', drawer)
      .filter(element => element.getClientRects().length);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  $('#clearCart').addEventListener('click', () => { cart.length = 0; renderCart(); });
  $('#sendWhats').addEventListener('click', () => {
    if (!cart.length) { window.alert('Adicione algum produto à sacola antes de enviar o pedido.'); return; }
    const lines = ['Olá, Delícias da Lya! Gostaria de fazer uma encomenda para o Natal de 2026:', ''];
    cart.forEach(item => {
      lines.push(`• ${item.qty}x ${item.name} — ${money(item.qty * item.price)}`);
      if (item.note) lines.push(`  Observação: ${item.note}`);
    });
    lines.push('', `Total estimado: ${money(cartTotal())}`, 'Entendo que a reserva depende de 50% via Pix.', 'Gostaria de confirmar a disponibilidade e combinar retirada ou entrega em Resende.');
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.location.assign(url);
  });

  filterProducts('all');
  renderCart();
})();
