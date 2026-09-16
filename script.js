/* =============================================================================
   AccProvider — UI Renderer + Checkout Logic
   ============================================================================= */

/* ------------------------- Accent style maps ------------------------------ */
const ACCENT_STYLES = {
  blue:   'bg-blue-600/20 text-cyan-400 border-blue-500/30',
  teal:   'bg-teal-600/20 text-teal-400 border-teal-500/30',
  purple: 'bg-purple-600/20 text-purple-400 border-purple-500/30'
};

/* ------------------------------- Render ----------------------------------- */

function renderHeader() {
  document.getElementById('brand-name').innerHTML =
    SITE.brandA + '<span class="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">' + SITE.brandB + '</span>';
  document.getElementById('domain-name').textContent = SITE.domain;
  document.getElementById('support-link').setAttribute('href', CONTACT.telegramUrl);
  document.getElementById('success-tg-link').setAttribute('href', CONTACT.telegramUrl);
}

function badgeTint(color) {
  const tints = {
    blue:    { iconBox: 'bg-blue-500/10 border-blue-500/20 text-cyan-400' },
    emerald: { iconBox: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
    amber:   { iconBox: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
    purple:  { iconBox: 'bg-purple-500/10 border-purple-500/20 text-purple-400' }
  };
  return tints[color] || tints.blue;
}

function renderHero() {
  document.getElementById('hero-tag').innerHTML =
    '<i class="fa-brands fa-linkedin text-sm"></i><span>' + SITE.heroTag + '</span>';

  document.getElementById('hero-title').innerHTML =
    SITE.heroHeadlinePre + ' <span class="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">' +
    SITE.heroHeadlineHighlight + '</span> ' + SITE.heroHeadlinePost;

  document.getElementById('hero-subtitle').textContent = SITE.heroSubtitle;

  document.getElementById('trust-badges').innerHTML = TRUST_BADGES.map(function (b) {
    return '' +
      '<div class="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm">' +
        '<div class="w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ' + badgeTint(b.color).iconBox + '">' +
          '<i class="' + b.icon + '"></i>' +
        '</div>' +
        '<div class="text-left">' +
          '<div class="text-xs font-bold text-white">' + b.title + '</div>' +
          '<div class="text-[11px] text-slate-400">' + b.sub + '</div>' +
        '</div>' +
      '</div>';
  }).join('');

  document.getElementById('manager-name').textContent = SITE.managerName;
  document.getElementById('manager-role').textContent = SITE.managerRole;
  document.getElementById('order-note').textContent = SITE.orderNote;
  document.getElementById('success-message').textContent = SITE.successMessage;
  document.getElementById('url-check-label').textContent = URL_CHECK.checkboxLabel;
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = PRODUCTS.map(function (p) {
    const tagInner = p.badgeIcon
      ? '<i class="' + p.badgeIcon + '"></i>'
      : p.badgeText;

    const accessBullet = p.accessAvailable
      ? '<div class="flex items-center gap-2 text-emerald-400 font-medium"><i class="fa-solid fa-circle-check text-[10px]"></i><span>' + p.accessLabel + '</span></div>'
      : '<div class="flex items-center gap-2 text-rose-400 font-medium"><i class="fa-solid fa-circle-xmark text-[10px]"></i><span>' + p.accessLabel + '</span></div>';

    const options = PRICING_TIERS.map(function (tier, idx) {
      return '' +
        '<label class="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 cursor-pointer border border-transparent has-[:checked]:border-cyan-500/60 has-[:checked]:bg-cyan-950/20 transition-all text-xs">' +
          '<span class="flex items-center gap-2">' +
            '<input type="radio" name="plan-' + p.id + '" value="' + p.prices[tier.key] + '" data-tier-key="' + tier.key + '" class="accent-cyan-400" ' + (idx === 0 ? 'checked' : '') + '>' +
            '<span>' + tier.label + '</span>' +
          '</span>' +
          '<span class="font-bold text-cyan-400">$' + p.prices[tier.key] + '</span>' +
        '</label>';
    }).join('');

    return '' +
      '<div class="product-card bg-[#0b1220] border border-slate-800/90 hover:border-cyan-500/50 rounded-2xl p-6 transition duration-300 flex flex-col justify-between relative group hover:shadow-glow" data-id="' + p.id + '">' +
        '<div>' +
          '<div class="flex items-start justify-between mb-4">' +
            '<div class="flex items-center gap-3">' +
              '<span class="px-2.5 py-1 text-xs font-bold rounded-lg ' + ACCENT_STYLES[p.accent] + '">' + tagInner + '</span>' +
              '<div>' +
                '<h3 class="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">' + p.location + '</h3>' +
                '<p class="text-xs text-slate-400">' + p.type + '</p>' +
              '</div>' +
            '</div>' +
            '<span class="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">' + p.badge + '</span>' +
          '</div>' +

          '<div class="space-y-1.5 text-xs mb-5">' +
            accessBullet +
            '<div class="flex items-center gap-2 text-cyan-400 font-medium"><i class="fa-regular fa-clock text-[10px]"></i><span>' + p.age + '</span></div>' +
          '</div>' +

          '<div class="grid grid-cols-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase py-2 border-y border-slate-800/80 mb-2">' +
            '<span>Connections</span><span class="text-right">Price</span>' +
          '</div>' +

          '<div class="space-y-1.5">' + options + '</div>' +

          '<div class="mt-3 p-2 rounded-lg bg-amber-950/30 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">' +
            '<i class="fa-solid fa-circle-info text-xs shrink-0"></i><span>' + URL_CHECK.cardNote + '</span>' +
          '</div>' +
        '</div>' +

        '<button type="button" class="buy-now-btn mt-5 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 active:scale-[0.99] transition-all">' +
          '<i class="fa-solid fa-cart-shopping text-xs"></i><span>Buy Now</span>' +
        '</button>' +
      '</div>';
  }).join('');
}

function renderContacts() {
  const channels = [
    { icon: 'fa-brands fa-telegram', color: 'text-cyan-400',   hover: 'hover:border-cyan-400/60',  label: 'Telegram',     value: CONTACT.telegramHandle, href: CONTACT.telegramUrl },
    { icon: 'fa-brands fa-whatsapp', color: 'text-emerald-400', hover: 'hover:border-emerald-400/60', label: 'WhatsApp',     value: CONTACT.whatsappNumber, href: CONTACT.whatsappUrl },
    { icon: 'fa-solid fa-users',     color: 'text-blue-400',    hover: 'hover:border-blue-400/60',  label: 'Team Channel', value: CONTACT.teamChannelHandle, href: CONTACT.teamChannelUrl },
    { icon: 'fa-solid fa-envelope',  color: 'text-amber-400',   hover: 'hover:border-amber-400/60', label: 'Email',        value: CONTACT.email, href: 'mailto:' + CONTACT.email }
  ];

  document.getElementById('contact-channels').innerHTML = channels.map(function (c) {
    return '' +
      '<a href="' + c.href + '" target="_blank" rel="noopener" class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 ' + c.hover + ' hover:bg-slate-800 transition text-xs font-medium text-slate-200">' +
        '<i class="' + c.icon + ' ' + c.color + ' text-base"></i>' +
        '<div>' +
          '<div class="text-[10px] text-slate-400 uppercase leading-none">' + c.label + '</div>' +
          '<div class="font-bold text-white">' + c.value + '</div>' +
        '</div>' +
      '</a>';
  }).join('');
}

/* --------------------------- Modal interaction ---------------------------- */

const modal = document.getElementById('checkout-modal');
const modalBox = document.getElementById('modal-box');
const modalCloseBtn = document.getElementById('modal-close');
const checkoutFormView = document.getElementById('checkout-form-view');
const checkoutSuccessView = document.getElementById('checkout-success-view');

const modalItemTitle = document.getElementById('modal-item-title');
const modalItemBadge = document.getElementById('modal-item-badge');
const modalItemTier = document.getElementById('modal-item-tier');
const modalUnitPrice = document.getElementById('modal-unit-price');
const qtyDisplay = document.getElementById('qty-display');
const totalPriceDisplay = document.getElementById('total-price-display');

const qtyMinusBtn = document.getElementById('qty-minus');
const qtyPlusBtn = document.getElementById('qty-plus');
const urlCheckInput = document.getElementById('input-url-check');

const networkSelector = document.getElementById('network-selector');
const walletAddressEl = document.getElementById('wallet-address');
const activeNetworkName = document.getElementById('active-network-name');
const copyBtn = document.getElementById('copy-btn');
const copyTooltip = document.getElementById('copy-tooltip');

const orderForm = document.getElementById('order-form');
const submitOrderBtn = document.getElementById('submit-order-btn');
const successCloseBtn = document.getElementById('success-close-btn');

let currentOrder = {
  product: null,
  tierKey: null,
  quantity: 1,
  network: NETWORKS[0].id,
  hasUrlCheck: false
};

function unitPrice() {
  const extra = currentOrder.hasUrlCheck ? URL_CHECK.perAccountFee : 0;
  return currentOrder.product.prices[currentOrder.tierKey] + extra;
}

function calculateTotal() {
  return unitPrice() * currentOrder.quantity;
}

function normalizeHandle(value) {
  return value.trim().replace(/^@/, '');
}

function updatePriceUI() {
  qtyDisplay.textContent = currentOrder.quantity;
  const extraText = currentOrder.hasUrlCheck ? ' (+$' + URL_CHECK.perAccountFee + ' URL Check)' : '';
  modalUnitPrice.textContent = '$' + unitPrice() + '.00' + extraText;
  totalPriceDisplay.textContent = '$' + calculateTotal();
}

function renderNetworkSelector() {
  networkSelector.innerHTML = NETWORKS.map(function (net, idx) {
    const active = idx === 0
      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-400'
      : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700';
    return '<button type="button" data-network="' + net.id + '" class="network-btn py-2 px-3 rounded-xl text-xs font-bold border transition text-center ' + active + '">' + net.label + '</button>';
  }).join('');
}

function selectNetwork(id) {
  currentOrder.network = id;
  activeNetworkName.textContent = id;
  walletAddressEl.textContent = WALLETS[id] || WALLETS[NETWORKS[0].id];

  document.querySelectorAll('.network-btn').forEach(function (btn) {
    const isActive = btn.dataset.network === id;
    btn.className = 'network-btn py-2 px-3 rounded-xl text-xs font-bold border transition text-center ' +
      (isActive ? 'border-cyan-500 bg-cyan-950/40 text-cyan-400' : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700');
  });
}

function openModal(cardEl) {
  const product = PRODUCTS.find(function (p) { return String(p.id) === cardEl.dataset.id; });
  if (!product) return;

  const checkedRadio = cardEl.querySelector('input[type="radio"]:checked');

  currentOrder.product = product;
  currentOrder.tierKey = checkedRadio ? checkedRadio.dataset.tierKey : PRICING_TIERS[0].key;
  currentOrder.quantity = 1;
  currentOrder.hasUrlCheck = false;
  urlCheckInput.checked = false;
  orderForm.reset();

  modalItemTitle.textContent = product.title;
  modalItemBadge.textContent = product.badge;
  modalItemTier.textContent = PRICING_TIERS.find(function (t) { return t.key === currentOrder.tierKey; }).label;
  updatePriceUI();

  checkoutFormView.classList.remove('hidden');
  checkoutSuccessView.classList.add('hidden');

  modal.classList.remove('opacity-0', 'pointer-events-none');
  modalBox.classList.remove('scale-95');
  modalBox.classList.add('scale-100');
  document.body.classList.add('overflow-hidden');
}

function closeModal() {
  modal.classList.add('opacity-0', 'pointer-events-none');
  modalBox.classList.remove('scale-100');
  modalBox.classList.add('scale-95');
  document.body.classList.remove('overflow-hidden');
}

/* ----------------------------- Event wiring ------------------------------- */

document.addEventListener('click', function (e) {
  const btn = e.target.closest('.buy-now-btn');
  if (btn) {
    const card = btn.closest('.product-card');
    if (card) openModal(card);
  }
});

modalCloseBtn.addEventListener('click', closeModal);
successCloseBtn.addEventListener('click', closeModal);
modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

qtyMinusBtn.addEventListener('click', function () {
  if (currentOrder.quantity > 1) {
    currentOrder.quantity--;
    updatePriceUI();
  }
});

qtyPlusBtn.addEventListener('click', function () {
  currentOrder.quantity++;
  updatePriceUI();
});

urlCheckInput.addEventListener('change', function (e) {
  currentOrder.hasUrlCheck = e.target.checked;
  updatePriceUI();
});

networkSelector.addEventListener('click', function (e) {
  const btn = e.target.closest('.network-btn');
  if (btn) selectNetwork(btn.dataset.network);
});

copyBtn.addEventListener('click', function () {
  const address = walletAddressEl.textContent.trim();
  const done = function () {
    copyTooltip.classList.remove('opacity-0');
    setTimeout(function () { copyTooltip.classList.add('opacity-0'); }, 2000);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(address).then(done).catch(fallbackCopy);
  } else {
    fallbackCopy();
  }

  function fallbackCopy() {
    const ta = document.createElement('textarea');
    ta.value = address;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (err) { console.error('Copy failed', err); }
    document.body.removeChild(ta);
  }
});

/* ----------------------- Telegram order dispatch -------------------------- */

function buildMessage(orderId) {
  const p = currentOrder.product;
  const price = calculateTotal();
  const tg = normalizeHandle(document.getElementById('input-telegram').value);
  const txid = document.getElementById('input-txid').value.trim();
  const email = document.getElementById('input-email').value.trim();

  return '' +
    '🛒 *NEW LINKEDIN ORDER RECEIVED*\n' +
    '─────────────────────\n' +
    '🆔 *Order ID:* `' + orderId + '`\n' +
    '📦 *Package:* ' + p.title + ' (' + p.badge + ')\n' +
    '🔗 *Connections Tier:* ' + PRICING_TIERS.find(function (t) { return t.key === currentOrder.tierKey; }).label + '\n' +
    '🔢 *Quantity:* ' + currentOrder.quantity + ' account(s)\n' +
    '🔍 *Custom URL Check:* ' + (currentOrder.hasUrlCheck ? 'YES (+$' + URL_CHECK.perAccountFee + '/acc)' : 'NO') + '\n' +
    '💰 *Total Price:* $' + price + ' USDT\n' +
    '🌐 *Payment Network:* ' + currentOrder.network + '\n' +
    '─────────────────────\n' +
    '👤 *Client Telegram:* @' + tg + '\n' +
    '📧 *Delivery Email:* ' + email + '\n' +
    '📄 *TXID/Hash:* `' + txid + '`\n' +
    '─────────────────────\n' +
    '⚡ *Timestamp:* ' + new Date().toUTCString();
}

async function dispatchToTelegram(messageText) {
  if (TELEGRAM_CONFIG.ENABLE_API_CALL) {
    const res = await fetch(TELEGRAM_CONFIG.API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: messageText })
    });
    if (!res.ok) throw new Error('Dispatch endpoint error: ' + res.status);
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || 'Dispatch failed');
  } else {
    await new Promise(function (r) { setTimeout(r, 800); });
    console.log('Telegram Order Payload prepared:\n', messageText);
  }
}

orderForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const txid = document.getElementById('input-txid').value.trim();
  const tgUser = document.getElementById('input-telegram').value.trim();
  const email = document.getElementById('input-email').value.trim();

  if (!txid || !tgUser || !email) {
    alert('Please fill in all required fields.');
    return;
  }
  if (txid.length < 32 || txid.length > 96) {
    alert('Please enter a valid Transaction Hash (TXID).');
    return;
  }
  if (!/^@?[\w\d_]{3,32}$/.test(tgUser)) {
    alert('Please enter a valid Telegram username.');
    return;
  }
  if (!/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  const orderId = '#LK-' + Math.floor(10000 + Math.random() * 90000);
  const messageText = buildMessage(orderId);

  submitOrderBtn.disabled = true;
  submitOrderBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xs"></i> Submitting Order...';

  try {
    await dispatchToTelegram(messageText);

    document.getElementById('success-order-id').textContent = orderId;
    document.getElementById('success-package').textContent =
      currentOrder.product.title + ' (' + PRICING_TIERS.find(function (t) { return t.key === currentOrder.tierKey; }).label + ')';
    document.getElementById('success-total').textContent =
      currentOrder.quantity + ' Acc • $' + calculateTotal() + ' USDT (' + currentOrder.network + ')';
    document.getElementById('success-tg').textContent = '@' + normalizeHandle(tgUser);

    orderForm.reset();
    checkoutFormView.classList.add('hidden');
    checkoutSuccessView.classList.remove('hidden');
  } catch (err) {
    console.error('Telegram dispatch error:', err);
    alert('Order could not be sent to the Telegram bot. Please contact support directly and share your TXID.');
  } finally {
    submitOrderBtn.disabled = false;
    submitOrderBtn.innerHTML = '<i class="fa-solid fa-paper-plane text-xs"></i> <span>Submit Order & Confirm Payment</span>';
  }
});

/* ------------------------------- Init ------------------------------------- */

renderHeader();
renderHero();
renderProducts();
renderContacts();
renderNetworkSelector();
selectNetwork(NETWORKS[0].id);