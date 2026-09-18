/* ============================================================
   ACCPROVIDER — GLOBAL CONFIGURATION & DATA (config.js)
   ------------------------------------------------------------
   Single place to manage every piece of data on the storefront:
   Telegram bot endpoint, crypto wallets, contact details, bulk
   pricing tiers, aged-account matrices, checkout field and
   add-on definitions.

   Load this file BEFORE functions.js in index.html.
   ============================================================ */


/* ---- Telegram bot configuration ---------------------------------
   Update before going live on Vercel.
   - BOT_TOKEN  : Telegram bot token from @BotFather
   - CHAT_ID    : Telegram chat/group id that receives orders
   - USE_PROXY  : if true, posts to /api/telegram (Vercel
                  serverless function — see api/telegram.js) so
                  the bot token is never exposed to browsers.
   ----------------------------------------------------------------- */
const CONFIG = {
  BOT_TOKEN: '',                // <-- placeholder: '123456:ABC-DEF...'
  CHAT_ID: '',                  // <-- placeholder: '1234567890'
  USE_PROXY: true,             // toggle true to use api/telegram.js
  PROXY_ENDPOINT: '/api/telegram',
  WALLETS: {
    TRC20: 'TUZxPcHP1bfpX9oMtchxazCsvqDHoPtGav',
    BEP20: '0xde8d4c69a8696a1edb1a3d7428f7dd6785f81971',
    ERC20: '0xde8d4c69a8696a1edb1a3d7428f7dd6785f81971'
  },
  CONTACT: {
    telegram: '@alirezak40',
    telegramUrl: 'https://t.me/alirezak40',
    whatsappLabel: '+8801885899780',
    whatsappUrl: 'https://wa.me/8801885899780',
    teamLabel: '@alirezak40',
    teamUrl: 'https://t.me/alirezak40',
    emailLabel: 'alirezak40@gmail.com',
    emailMailto: 'mailto:alirezak40@gmail.com'
  }
};


/* ---- Bulk pricing tier definitions (20%–40% tiered discounts) ----
   Shape: { name, base, tiers: [[minQty, discountPct], ...] }
   The discount applied to a quantity is the HIGHEST tier whose
   minQty is <= the ordered quantity (e.g. qty 7 on badge => 20%).
   Keys are referenced from calculator components in index.html.
   ----------------------------------------------------------------- */
const PRICING = {
  growth50:  { name: '50+ Connections Pack',              base: 10, tiers: [[2, 10],[5, 20], [10, 25]] },
  growth100: { name: '100+ Connections Pack',             base: 20, tiers: [[2, 10],[5, 20], [10, 25]] },
  badge:     { name: 'Official LinkedIn Workplace Badge', base: 30, tiers: [[2, 10], [5, 20], [10, 25]] },
  custom:    { name: 'Custom Resume-Matched LinkedIn Account', base: 30, tiers: [[2, 10],[5, 20], [10, 25]] }
};


/* ---- Aged-account connection-tier labels (Section 1 matrix) ---- */
const ACCOUNT_TIERS = ['0–9', '10–49', '50–99', '100–299', '300–499', '500–999'];


/* ---- Aged-account products (Section 1 connection-wise matrix) ----
   Each product exposes a prices[] array in parallel with the
   ACCOUNT_TIERS indexes above. Customize names, tags, colours and
   prices freely — the grid + checkout adapt automatically.
   ----------------------------------------------------------------- */
/* `available` controls whole-table stock status. Set to false to show
   the table as SOLD OUT (tiers dimmed, buy button disabled). Defaults
   to available when omitted. */
const ACCOUNT_PRODUCTS = [
  { id: 'us-single', available: false, tag: '#1 US Premium',          name: 'US Location — Single Email',               desc: 'US Location. Email access available and only one email connected with the account',            accent: 'text-cyan-400',      badge: 'bg-cyan-950/70 border-cyan-500/30',                 prices: [18, 28, 40, 50, 55, 70] },
  { id: 'us-multi',  available: true, tag: '#2 US Multi Email',      name: 'US Location — Multiple Email',             desc: 'US Location. Email access available but multipe email may be connected with the account',      accent: 'text-blue-400',      badge: 'bg-blue-950/70 border-blue-500/30',                 prices: [15, 25, 35, 45, 52, 65] },
  { id: 'us-2fa',    available: true, tag: '#3 US 2FA/SMS',          name: 'US Location — 2FA/SMS',                    desc: 'US Location. Email access not available and login via 2FA/SMS code',                           accent: 'text-emerald-400',   badge: 'bg-emerald-950/70 border-emerald-500/30',           prices: [12, 20, 28, 38, 45, 60] },
  { id: 'rc-single', available: true, tag: '#4 Random Premium',      name: 'Random Country — Single Email',            desc: 'Random country Location. Email access available and only one email connected with the account',         accent: 'text-sky-400',       badge: 'bg-sky-950/70 border-sky-500/30',          prices: [12, 20, 28, 38, 45, 60] },
  { id: 'rc-multi',  available: true, tag: '#5 Random Multi Email',  name: 'Random Country — Multiple Email',          desc: 'Random country Location. Email access available but multipe email may be connected with the account',   accent: 'text-indigo-400',    badge: 'bg-indigo-950/70 border-indigo-500/30',    prices: [10, 18, 25, 35, 42, 50] },
  { id: 'rc-2fa',    available: true, tag: '#6 Random 2FA/SMS',      name: 'Random Country — 2FA/SMS',                 desc: 'Random country Location. Email access not available and login via 2FA/SMS code',                        accent: 'text-violet-400',    badge: 'bg-violet-950/70 border-violet-500/30',    prices: [8, 15, 20, 30, 35, 40] }
];


/* ---- Extra (target) field configuration per checkout type --------
   Shown as the single free-text field inside the checkout modal.
   `required: true` enforces a value (except Navigator bundles).
   ----------------------------------------------------------------- */
const EXTRA_FIELDS = {
accounts:  { label: 'Profile Notes',                                        placeholder: 'e.g. any delivery preferences or notes',                       required: false },
  navigator: { label: 'LinkedIn Profile URL',                               placeholder: 'https://www.linkedin.com/in/your-profile',                    required: true },
  growth:    { label: 'Target LinkedIn Profile URL',                        placeholder: 'https://www.linkedin.com/in/your-profile',                    required: true },
  badge:     { label: 'Target LinkedIn Profile URL(s)',                     placeholder: 'https://www.linkedin.com/in/username',                        required: true },
  custom:    { label: 'Target Custom Name / Persona Notes',                 placeholder: 'e.g. John Doe, Senior Tech Recruiter (or "Refer to my CV")',  required: true }
};


/* ---- Sales Navigator add-on options (by serviceType) ------------
   `fresh` / `renewal` offer express delivery, `bundle` offers a
   pre-selection service. Keyed by the serviceType passed to
   startCheckout() from the Navigator plan buttons.
   ----------------------------------------------------------------- */
const NAV_ADDONS = {
  fresh:   { label: 'Priority 5-Minute Instant Express Delivery',   price: 5 },
  renewal: { label: 'Priority 5-Minute Instant Express Delivery',   price: 5 },
  bundle:  { label: 'Pre-select Profile URL / Industry & Country',  price: 10 }
}; 