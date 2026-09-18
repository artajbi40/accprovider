/* ============================================================
   ACCPROVIDER — APPLICATION LOGIC (functions.js)
   ------------------------------------------------------------
   Pure Vanilla JS containing every behaviour of the SPA:
     • SPA view navigation + mobile menu
     • Aged-account pricing matrix rendering
     • Real-time bulk discount calculators (growth/badge/custom)
     • Universal checkout modal (crypto networks, quantity,
       add-ons, copy wallet, order submission)
     • Telegram order dispatch + contact channels

   Depends on config.js (all data), which MUST be loaded first.
   Load this file at the end of <body> in index.html.
   ============================================================ */


/* ============================================================
   MONEY & PRICING HELPERS
   ============================================================ */
function money(n) { return '$' + Number(n).toFixed(2); }

/* Returns the discount % for a quantity against a tier matrix. */
function getDiscount(tiers, qty) {
  let pct = 0;
  if (!tiers) return pct;
  tiers.forEach(function (t) { if (qty >= t[0]) pct = t[1]; });
  return pct;
}
/* Returns the discounted unit price for a config + quantity. */
function unitPrice(cfg, qty) {
  if (!cfg) return 0;
  return +(cfg.base * (1 - getDiscount(cfg.tiers, qty) / 100)).toFixed(2);
}


/* ============================================================
   SPA NAVIGATION — instant view switching without reloads
   ============================================================ */
const viewOrder = ['accounts', 'navigator', 'growth', 'badge', 'custom'];

function showView(id) {
  viewOrder.forEach(function (v) {
    const el = document.getElementById(v);
    if (el) el.classList.toggle('hidden', v !== id);
  });
  const active = document.getElementById(id);
  if (active) { active.classList.remove('view-enter'); void active.offsetWidth; active.classList.add('view-enter'); }
  document.querySelectorAll('.nav-link').forEach(function (a) {
    const isActive = a.getAttribute('data-view') === id;
    if (a.classList.contains('nav-link-cta')) {
      /* CTA keeps its permanent cyan→blue gradient; only reflect an active ring */
      a.classList.add('bg-gradient-to-r', 'from-cyan-500', 'to-blue-600', 'text-white');
      a.classList.toggle('ring-2', isActive);
      a.classList.toggle('ring-cyan-300', isActive);
    } else if (isActive) {
      a.classList.add('bg-gradient-to-r', 'from-cyan-500', 'to-blue-600', 'text-white');
      a.classList.remove('text-slate-300');
    } else {
      a.classList.remove('bg-gradient-to-r', 'from-cyan-500', 'to-blue-600', 'text-white');
      a.classList.add('text-slate-300');
    }
  });
  closeMobileMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  try { history.replaceState(null, '', '#' + id); } catch (e) { /* no-op */ }
}

/* ---- Mobile menu ---- */
function toggleMobileMenu() { document.getElementById('mobile-menu').classList.toggle('hidden'); }
function closeMobileMenu() { document.getElementById('mobile-menu').classList.add('hidden'); }


/* ============================================================
   SECTION 1 — AGED ACCOUNTS GRID (data from config.js)
   ============================================================ */
const accountSelection = {}; // product id -> selected tier index

function tierRowHtml(product, i, available) {
  const active = accountSelection[product.id] === i;
  const disabled = available === false;
  return '<button type="button" data-product="' + product.id + '" data-tier="' + i + '" ' +
    (disabled ? 'disabled ' : '') + 'class="tier-row w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-left transition ' +
    (disabled ? 'cursor-not-allowed opacity-50 ' : '') +
    (active ? 'border-cyan-500/50 bg-cyan-950/40 text-white' : 'border-slate-800 bg-slate-900/40 ' + (disabled ? 'text-slate-500' : 'text-slate-300 hover:border-slate-600')) + '">' +
    '<span class="flex items-center gap-2 text-[11px] font-semibold">' +
    '<span class="w-2 h-2 rounded-full ' + (active ? 'bg-cyan-400' : 'bg-slate-600') + '"></span>' +
    ACCOUNT_TIERS[i] + ' connections</span>' +
    '<span class="text-xs font-bold text-cyan-400">$' + product.prices[i] + '</span>' +
    '</button>';
}

function renderAccountsGrid() {
  const grid = document.getElementById('accounts-grid');
  ACCOUNT_PRODUCTS.forEach(function (p) { if (accountSelection[p.id] === undefined) accountSelection[p.id] = 0; });

  grid.innerHTML = ACCOUNT_PRODUCTS.map(function (p) {
    const sel = accountSelection[p.id];
    const price = p.prices[sel];
    const tierLabel = ACCOUNT_TIERS[sel] + ' connections';
    const soldOut = p.available === false;
    const stockBadge = soldOut
      ? '<span class="text-[11px] text-rose-400 font-semibold flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Sold Out</span>'
      : '<span class="text-[11px] text-emerald-400 font-semibold flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> In Stock</span>';
    const buyBtn = soldOut
      ? '<button type="button" disabled class="w-full py-3 rounded-xl bg-slate-800/70 text-slate-500 cursor-not-allowed font-bold text-xs tracking-wide transition flex items-center justify-center gap-2"><i class="fa-solid fa-ban"></i><span>Sold Out — Not Available</span></button>'
      : '<button type="button" onclick="buyAccount(\'' + p.id + '\')" class="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs tracking-wide transition flex items-center justify-center gap-2"><i class="fa-solid fa-cart-shopping"></i><span>Buy Now — $' + price + '</span></button>';
    return '' +
      '<article class="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between ' + (soldOut ? 'opacity-80 ' : 'hover:border-cyan-500/50 transition-all duration-300 hover:shadow-glow') + '">' +
        '<div>' +
          '<div class="flex items-center justify-between mb-4">' +
            '<span class="px-3 py-1 rounded-full text-[11px] font-bold border ' + p.badge + ' ' + p.accent + '">' + p.tag + '</span>' +
            stockBadge +
          '</div>' +
          '<h3 class="text-lg font-extrabold text-white leading-snug mb-1">' + p.name + '</h3>' +
          '<p class="text-xs text-slate-400 leading-relaxed mb-4">' + p.desc + '</p>' +
          '<div class="flex flex-wrap gap-1.5 mb-5">' +
            '<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">Aged  1–10+ yrs</span>' +
            '<span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">Full Ownership</span>' +
          '</div>' +
          '<div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pricing Matrix — By Connections</div>' +
          '<div class="space-y-1.5">' + p.prices.map(function (_, i) { return tierRowHtml(p, i, p.available); }).join('') + '</div>' +
        '</div>' +
        '<div class="mt-5 pt-5 border-t border-slate-800/70">' +
          '<div class="flex items-center justify-between mb-3">' +
            '<span class="text-[11px] text-slate-400">Selected: <strong id="sel-' + p.id + '" class="text-white">' + tierLabel + '</strong></span>' +
            '<span class="text-lg font-black text-cyan-400" id="price-' + p.id + '">$' + price + '</span>' +
          '</div>' +
          buyBtn +
        '</div>' +
      '</article>';
  }).join('');

  /* Tier selection (event delegation) */
  grid.querySelectorAll('.tier-row').forEach(function (row) {
    row.addEventListener('click', function () {
      accountSelection[row.getAttribute('data-product')] = parseInt(row.getAttribute('data-tier'), 10);
      renderAccountsGrid();
    });
  });
}

function buyAccount(id) {
  const p = ACCOUNT_PRODUCTS.find(function (x) { return x.id === id; });
  if (!p || p.available === false) return;
  const tier = accountSelection[id];
  startCheckout({
    type: 'accounts',
    name: p.name,
    tier: ACCOUNT_TIERS[tier] + ' connections',
    base: p.prices[tier],
    unitPrice: p.prices[tier],
    qty: 1
  });
}


/* ============================================================
   INTERACTIVE CALCULATORS — GROWTH / BADGE / CUSTOM
   ============================================================ */
const calcState = { growth: { plan: 'growth50', qty: 1 }, badge: { qty: 1 }, custom: { qty: 1 } };

/* ---- Growth service calculator ---- */
function setGrowthPlan(plan) {
  calcState.growth.plan = plan;
  ['growth50', 'growth100'].forEach(function (n) {
    const btn = document.getElementById(n === 'growth50' ? 'calcPlan50Btn' : 'calcPlan100Btn');
    btn.className = n === plan
      ? 'px-4 py-2 rounded-xl text-xs font-bold border transition bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
      : 'px-4 py-2 rounded-xl text-xs font-bold border transition bg-slate-800 text-slate-400 border-slate-700 hover:text-white';
  });
  document.getElementById('growthSlider').value = calcState.growth.qty;
  updateGrowthCalc();
}
function setGrowthQty(v) { calcState.growth.qty = parseInt(v, 10); document.getElementById('growthSlider').value = v; updateGrowthCalc(); }
function adjustGrowthQty(d) {
  const q = Math.min(25, Math.max(1, calcState.growth.qty + d));
  calcState.growth.qty = q; document.getElementById('growthSlider').value = q; updateGrowthCalc();
}
function updateGrowthCalc() {
  const cfg = PRICING[calcState.growth.plan];
  const q = calcState.growth.qty;
  const unit = unitPrice(cfg, q);
  const pct = getDiscount(cfg.tiers, q);
  const final = +(unit * q).toFixed(2);
  const savings = +(cfg.base * q - final).toFixed(2);
  document.getElementById('growthQtyValue').textContent = q;
  document.getElementById('growthBaseTotal').textContent = money(cfg.base * q);
  document.getElementById('growthDiscountRate').textContent = pct + '% (' + (pct ? 'Bulk Tier' : 'None') + ')';
  document.getElementById('growthSavings').textContent = money(savings);
  document.getElementById('growthFinalTotal').textContent = money(final);
  /* threshold badges */
  const badgeDefs = [[0, 1], [1, 2], [2, 5],[3, 10]];
  badgeDefs.forEach(function (bd) {
    const b = document.getElementById('growthBadge' + bd[0]);
    const on = q >= bd[1];
    b.className = 'py-1.5 px-2 rounded-lg border ' + (on ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300 font-semibold' : 'bg-slate-800/40 border-slate-800 text-slate-500');
  });
}

/* ---- Verification badge calculator ---- */
function setBadgeQty(v) { calcState.badge.qty = parseInt(v, 10); document.getElementById('badgeSlider').value = v; updateBadgeCalc(); }
function adjustBadgeQty(d) {
  const q = Math.min(50, Math.max(1, calcState.badge.qty + d));
  calcState.badge.qty = q; document.getElementById('badgeSlider').value = q; updateBadgeCalc();
}
function updateBadgeCalc() {
  const cfg = PRICING.badge;
  const q = calcState.badge.qty;
  const unit = unitPrice(cfg, q);
  const pct = getDiscount(cfg.tiers, q);
  const final = +(unit * q).toFixed(2);
  const savings = +(cfg.base * q - final).toFixed(2);
  document.getElementById('badgeQtyValue').textContent = q + (q === 1 ? ' Badge' : ' Badges');
  document.getElementById('badgeBaseTotal').textContent = money(cfg.base * q);
  document.getElementById('badgeDiscountRate').textContent = pct + '% (' + (pct ? 'Bulk Tier' : 'Standard') + ')';
  document.getElementById('badgeSavings').textContent = money(savings);
  document.getElementById('badgeFinalTotal').textContent = money(final);
  const badgeDefs = [[0, 1], [1, 2], [2, 5], [3, 10]];
  badgeDefs.forEach(function (bd) {
    const b = document.getElementById('badgeBadge' + bd[0]);
    const on = q >= bd[1];
    b.className = 'py-1.5 px-2 rounded-lg border ' + (on ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-500');
  });
}

/* ---- Custom resume-matched accounts calculator ---- */
function setCustomQty(v) { calcState.custom.qty = parseInt(v, 10); document.getElementById('customSlider').value = v; updateCustomCalc(); }
function adjustCustomQty(d) {
  const q = Math.min(50, Math.max(1, calcState.custom.qty + d));
  calcState.custom.qty = q; document.getElementById('customSlider').value = q; updateCustomCalc();
}
function updateCustomCalc() {
  const cfg = PRICING.custom;
  const q = calcState.custom.qty;
  const unit = unitPrice(cfg, q);
  const pct = getDiscount(cfg.tiers, q);
  const final = +(unit * q).toFixed(2);
  const savings = +(cfg.base * q - final).toFixed(2);
  document.getElementById('customQtyValue').textContent = q + (q === 1 ? ' Account' : ' Accounts');
  document.getElementById('customBaseTotal').textContent = money(cfg.base * q);
  document.getElementById('customDiscountRate').textContent = pct + '% (' + (pct ? 'Bulk Tier' : 'Standard') + ')';
  document.getElementById('customSavings').textContent = money(savings);
  document.getElementById('customFinalTotal').textContent = money(final);
  const badgeDefs = [[0, 1], [1, 2], [2, 5], [3, 10]];
  badgeDefs.forEach(function (bd) {
    const b = document.getElementById('customBadge' + bd[0]);
    const on = q >= bd[1];
    b.className = 'py-1.5 px-2 rounded-lg border ' + (on ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-500');
  });
}

/* ---- Calculator → checkout ---- */
function orderFromCalculator(type) {
  const cfg = PRICING[cfgKeyFor(type)];
  startCheckout({ type: type, name: cfg.name, base: cfg.base, pricing: cfgKeyFor(type), qty: calcState[type].qty });
}
function cfgKeyFor(k) {
  if (k === 'growth') return calcState.growth.plan;
  return k;
}


/* ============================================================
   UNIVERSAL CHECKOUT MODAL
   ============================================================ */
const checkout = {
  cart: null,        // product cart snapshot
  network: 'TRC20'  // selected crypto network
};

function startCheckout(opts) {
  checkout.cart = {
    type: opts.type,
    name: opts.name,
    tier: opts.tier || '',
    base: opts.base,
    unitPrice: opts.unitPrice || opts.base,
    pricing: opts.pricing || null,
    qty: opts.qty || 1,
    serviceType: opts.serviceType || null
  };
  checkout.network = 'TRC20';
  renderCheckout();
  openCheckoutModal();
}

function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  /* always start on the form view so a previous success screen never leaks through */
  document.getElementById('checkout-success-view').classList.add('hidden');
  document.getElementById('checkout-form-view').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
  /* reset to form view for next order */
  document.getElementById('checkout-form-view').classList.remove('hidden');
  document.getElementById('checkout-success-view').classList.add('hidden');
}

function modalQty(delta) {
  if (!checkout.cart) return;
  const q = Math.min(100, Math.max(1, checkout.cart.qty + delta));
  checkout.cart.qty = q;
  renderCheckoutPrices();
}

function renderCheckout() {
  const c = checkout.cart;
  document.getElementById('modal-product-title').textContent = c.name;
  document.getElementById('modal-product-sub').textContent = c.tier || 'Secure USDT payment • Instant automated dispatch';

  /* Extra / target field */
  const extraWrap = document.getElementById('modal-extra-wrap');
  const ef = EXTRA_FIELDS[c.type];
  const required = ef.required && !(c.type === 'navigator' && c.serviceType === 'bundle');
  extraWrap.innerHTML = '<label class="block text-xs font-semibold text-slate-300 mb-1" for="modal-extra">' + ef.label + ' <span class="text-rose-400">' + (required ? '*' : '(optional)') + '</span></label>' +
    '<input class="w-full bg-[#060a14] border border-brand-border text-white text-xs rounded-xl px-3 py-2.5 focus:border-cyan-400 focus:ring-0" id="modal-extra" placeholder="' + ef.placeholder + '" type="text">';

  document.getElementById('order-telegram').value = '';
  document.getElementById('order-email').value = '';
  document.getElementById('order-txid').value = '';

  selectNetwork('TRC20');
  renderCheckoutPrices();
}

function renderCheckoutPrices() {
  const c = checkout.cart;
  const cfg = c.pricing ? PRICING[c.pricing] : null;
  const q = c.qty;
  const pct = cfg ? getDiscount(cfg.tiers, q) : 0;
  const unit = cfg ? unitPrice(cfg, q) : c.base;
  const subtotal = +(unit * q).toFixed(2);
  const total = subtotal;
  const savings = cfg ? +(cfg.base * q - subtotal).toFixed(2) : 0;

  document.getElementById('modal-unit-price').textContent = money(unit);
  document.getElementById('modal-qty').textContent = q;
  document.getElementById('modal-total').textContent = money(total);
  document.getElementById('modal-discount-tag').textContent = pct > 0 ? pct + '% BULK OFF' : '0% OFF';
  document.getElementById('modal-savings').textContent = 'Savings: ' + money(savings);
  document.getElementById('modal-savings').style.color = pct > 0 ? '' : '#94a3b8';
}

/* ---- Crypto network selector ---- */
function selectNetwork(network) {
  checkout.network = network;
  document.querySelectorAll('.net-tab').forEach(function (btn) {
    const on = btn.getAttribute('data-network') === network;
    btn.className = on
      ? 'net-tab py-2.5 px-3 rounded-xl border border-cyan-500 bg-cyan-950/40 text-cyan-300 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-cyan-500/30'
      : 'net-tab py-2.5 px-3 rounded-xl border border-brand-border bg-[#070c17] text-slate-300 text-xs font-bold hover:border-cyan-500/40 transition flex items-center justify-center gap-1.5';
  });
  document.getElementById('wallet-address').textContent = CONFIG.WALLETS[network];
  document.getElementById('active-net-label').textContent = network === 'TRC20' ? 'TRON (TRC20)' : network === 'BEP20' ? 'BSC (BEP20)' : 'Etherum (ERC20)';
  document.getElementById('copy-feedback').classList.add('hidden');
}

function copyWalletAddress() {
  const addr = document.getElementById('wallet-address').textContent;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(addr).then(showCopied);
  } else {
    const ta = document.createElement('textarea');
    ta.value = addr; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); showCopied(); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }
}
function showCopied() {
  const fb = document.getElementById('copy-feedback');
  fb.classList.remove('hidden');
  setTimeout(function () { fb.classList.add('hidden'); }, 2000);
}

/* ---- Order submission & Telegram dispatch ---- */
async function submitOrder(e) {
  e.preventDefault();
  const c = checkout.cart;
  if (!c) return;

  const telegram = document.getElementById('order-telegram').value.trim().replace(/^@/, '');
  const email = document.getElementById('order-email').value.trim();
  const txid = document.getElementById('order-txid').value.trim();
  const extra = document.getElementById('modal-extra').value.trim();
  const cfg = c.pricing ? PRICING[c.pricing] : null;
  const pct = cfg ? getDiscount(cfg.tiers, c.qty) : 0;
  const unit = cfg ? unitPrice(cfg, c.qty) : c.base;
  const subtotal = +(unit * c.qty).toFixed(2);
  const total = subtotal;

  const extraRequired = EXTRA_FIELDS[c.type].required && !(c.type === 'navigator' && c.serviceType === 'bundle');
  if (!telegram || !email || !txid || (extraRequired && !extra)) {
    alert('Please fill in all required fields (Telegram, Email, TXID' + (extraRequired ? ' and target info' : '') + ').');
    return;
  }

  const orderId = '#AP-' + Math.floor(1000 + Math.random() * 9000);

  const messageText =
    '🛒 *ACCPROVIDER — NEW ORDER*\n' +
    '──────────────────────\n' +
    '🧾 *Order ID:* `' + orderId + '`\n' +
    '📦 *Product:* ' + c.name + '\n' +
    (c.tier ? '🏷️ *Tier:* ' + c.tier + '\n' : '') +
    '🔢 *Quantity:* ' + c.qty + '\n' +
    '💰 *Unit Price:* $' + unit.toFixed(2) + ' USDT\n' +
    (pct > 0 ? '🏷️ *Discount:* ' + pct + '% OFF (saved $' + (cfg.base * c.qty - subtotal).toFixed(2) + ')\n' : '') +
    '💵 *Total:* $' + total.toFixed(2) + ' USDT\n' +
    '🌐 *Network:* ' + checkout.network + '\n' +
    (extra ? '📌 *Target / Notes:* ' + extra + '\n' : '') +
    '──────────────────────\n' +
    '👤 *Telegram:* @' + telegram + '\n' +
    '📧 *Email:* ' + email + '\n' +
    '🔗 *TXID/Hash:* `' + txid + '`\n' +
    '🕒 *Time:* ' + new Date().toUTCString();

  const btn = document.getElementById('modal-submit-btn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i><span>Submitting…</span>';

  try {
    await dispatchOrder(messageText);

    /* populate success view */
    document.getElementById('success-order-id').textContent = orderId;
    document.getElementById('success-product').textContent = c.name + (pct > 0 ? ' • ' + pct + '% off' : '');
    document.getElementById('success-qty').textContent = c.qty + ' × ' + money(unit);
    document.getElementById('success-total').textContent = money(total) + ' USDT (' + checkout.network + ')';
    const tgMsg = encodeURIComponent('Hello AccProvider Support, I\'ve submitted an order.\n\nOrder: ' + orderId + '\nProduct: ' + c.name + ' (x' + c.qty + ')\nTotal: $' + total.toFixed(2) + ' USDT\nMy TG: @' + telegram);
    document.getElementById('success-tg-link').href = CONFIG.CONTACT.telegramUrl + '?text=' + tgMsg;

    document.getElementById('checkout-form').reset();
    document.getElementById('checkout-form-view').classList.add('hidden');
    document.getElementById('checkout-success-view').classList.remove('hidden');
  } catch (err) {
    console.error('Order dispatch failed:', err);
    alert('Order could not be transmitted to the Telegram bot. Please contact support directly at ' + CONFIG.CONTACT.telegramUrl + ' and share your TXID.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i><span>Submit Order &amp; Confirm Payment</span>';
  }
}

/* Sends the formatted order payload to Telegram.
   Priority 1: Vercel serverless proxy (keeps bot token server-side).
   Priority 2: Direct Bot API call (requires BOT_TOKEN + CHAT_ID).
   Priority 3: Simulated dispatch (demo mode) so the storefront works before configuration. */
function dispatchOrder(messageText) {
  if (CONFIG.USE_PROXY) {
    return fetch(CONFIG.PROXY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: messageText })
    }).then(function (res) {
      if (!res.ok) throw new Error('Proxy endpoint error: ' + res.status);
      return res.json().then(function (json) { if (!json.ok) throw new Error(json.error || 'Dispatch failed'); });
    });
  }
  if (CONFIG.BOT_TOKEN && CONFIG.CHAT_ID) {
    return fetch('https://api.telegram.org/bot' + CONFIG.BOT_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CONFIG.CHAT_ID, text: messageText, parse_mode: 'Markdown' })
    }).then(function (res) {
      if (!res.ok) throw new Error('Telegram API error: ' + res.status);
      return res.json().then(function (json) { if (!json.ok) throw new Error(json.description || 'Telegram rejected sendMessage'); });
    });
  }
  console.log('⚠️ Demo mode — configure CONFIG.BOT_TOKEN / CHAT_ID or api/telegram.js to enable live dispatch.\nOrder payload:\n' + messageText);
  return new Promise(function (resolve) { setTimeout(resolve, 800); });
}


/* ============================================================
   CONTACT CHANNELS (rendered into the global footer)
   ============================================================ */
function contactChannelHtml() {
  const C = CONFIG.CONTACT;
  return '' +
    '<a href="' + C.telegramUrl + '" rel="noopener noreferrer" target="_blank" class="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-3 rounded-2xl flex items-center gap-3 transition-all group">' +
      '<div class="w-8 h-8 rounded-xl bg-cyan-950 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform"><i class="fa-brands fa-telegram"></i></div>' +
      '<div><span class="text-[10px] text-slate-400 uppercase font-semibold block">Telegram</span><span class="text-xs font-bold text-slate-200 group-hover:text-cyan-300">' + C.telegram + '</span></div>' +
    '</a>' +
    '<a href="' + C.whatsappUrl + '" rel="noopener noreferrer" target="_blank" class="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-3 rounded-2xl flex items-center gap-3 transition-all group">' +
      '<div class="w-8 h-8 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform"><i class="fa-brands fa-whatsapp"></i></div>' +
      '<div><span class="text-[10px] text-slate-400 uppercase font-semibold block">WhatsApp</span><span class="text-xs font-bold text-slate-200 group-hover:text-emerald-300">' + C.whatsappLabel + '</span></div>' +
    '</a>' +
    '<a href="' + C.teamUrl + '" rel="noopener noreferrer" target="_blank" class="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-3 rounded-2xl flex items-center gap-3 transition-all group">' +
      '<div class="w-8 h-8 rounded-xl bg-blue-950 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform"><i class="fa-solid fa-users"></i></div>' +
      '<div><span class="text-[10px] text-slate-400 uppercase font-semibold block">Team Channel</span><span class="text-xs font-bold text-slate-200 group-hover:text-blue-300">' + C.teamLabel + '</span></div>' +
    '</a>' +
    '<a href="' + C.emailMailto + '" class="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-3 rounded-2xl flex items-center gap-3 transition-all group">' +
      '<div class="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 group-hover:scale-105 transition-transform"><i class="fa-regular fa-envelope"></i></div>' +
      '<div><span class="text-[10px] text-slate-400 uppercase font-semibold block">Email</span><span class="text-xs font-bold text-slate-200 group-hover:text-cyan-300 truncate max-w-[110px] block">' + C.emailLabel + '</span></div>' +
    '</a>';
}


/* ============================================================
   INITIALIZATION — bindings + first render
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  /* ---- SPA nav + mobile menu bindings ---- */
  document.querySelectorAll('[data-view]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      showView(link.getAttribute('data-view'));
    });
  });
  document.getElementById('menu-toggle').addEventListener('click', toggleMobileMenu);

  /* ---- modal bindings (backdrop click / Escape) ---- */
  document.getElementById('checkout-modal').addEventListener('click', function (e) {
    if (e.target === this) closeCheckoutModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeCheckoutModal();
      closeMobileMenu();
    }
  });

  /* ---- initial render ---- */
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('global-contact-channels').innerHTML = contactChannelHtml();
  renderAccountsGrid();
  updateGrowthCalc();
  setGrowthPlan(calcState.growth.plan);
  updateBadgeCalc();
  updateCustomCalc();
  selectNetwork('TRC20');

  /* deep-link support: open a view based on #hash */
  const initial = (location.hash || '#accounts').replace('#', '');
  showView(viewOrder.indexOf(initial) !== -1 ? initial : 'accounts');
});