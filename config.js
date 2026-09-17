/* =============================================================================
   AccProvider — Centralised Data Configuration
   -----------------------------------------------------------------------------
   Edit ALL static content here: product titles, badges, trust badges,
   connection pricing tiers, prices, wallet addresses, contact channels and
   Telegram credentials. The UI (index.html) and logic (script.js) render
   everything from this file — no need to touch UI code to change content.
   ============================================================================= */

/* ------------------------------- Site Info ------------------------------- */
const SITE = {
  brandA: 'Acc',
  brandB: 'Provider',
  domain: 'accprovider.com',

  heroTag: 'Verified & Aged LinkedIn Accounts Service',
  heroHeadlinePre: 'PREMIUM',
  heroHeadlineHighlight: 'LINKEDIN ACCOUNTS',
  heroHeadlinePost: 'FOR SALE',
  heroSubtitle: 'High Quality 1–10+ Years Aged Accounts • High Trust Score • Ready for Outreach, Lead Generation & Marketing',

  managerName: 'AR Tajbi',
  managerRole: 'Sales Manager',
  orderNote: 'Bulk order discounts available • Escrow accepted • Fast 24/7 support',

  // Text shown on the order success screen.
  successMessage: 'We are verifying your transaction and will deliver your account details via Telegram within 10–30 minutes.'
};

/* -------------------------- Contact Channels ----------------------------- */
const CONTACT = {
  telegramUrl: 'https://t.me/alirezak40',
  telegramHandle: '@alirezak40',

  whatsappUrl: 'https://wa.me/8801885899780',
  whatsappNumber: '+8801885899780',

  teamChannelUrl: 'https://t.me/alirezak40',
  teamChannelHandle: '@alirezak40',

  email: 'alirezak40@gmail.com'
};

/* ----------------------------- Telegram Bot ------------------------------ */
/* Orders are POSTed to the serverless handler (api/telegram.js), which keeps
   the bot token on the server (Vercel/Netlify environment variables), so it is
   never exposed in static files.
   Config the handler via env vars:
     Vercel:    https://vercel.com/docs/projects/environment-variables
     Netlify:   https://docs.netlify.com/environment-variables/overview/
   - TELEGRAM_BOT_TOKEN  → from @BotFather
   - TELEGRAM_CHAT_ID    → see api/telegram.js comment
   Set ENABLE_API_CALL to true only once the handler is deployed. */
const TELEGRAM_CONFIG = {
  API_ENDPOINT: '/api/telegram',
  ENABLE_API_CALL: true
};

/* ---------------------- USDT Wallet Addresses ---------------------------- */
const WALLETS = {
  TRC20: 'TUZxPcHP1bfpX9oMtchxazCsvqDHoPtGav',
  BEP20: '0xde8d4c69a8696a1edb1a3d7428f7dd6785f81971',
  ERC20: '0xde8d4c69a8696a1edb1a3d7428f7dd6785f81971'
};

/* ------------------------- Payment Networks ------------------------------ */
const NETWORKS = [
  { id: 'TRC20', label: 'TRC20 (Tron)' },
  { id: 'BEP20', label: 'BEP20 (BSC)' },
  { id: 'ERC20', label: 'ERC20 (ETH)' }
];

/* ------------------------- Connection Tiers ------------------------------ */
const PRICING_TIERS = [
  { key: 't0',   label: '0–9 connections' },
  { key: 't10',  label: '10–49 connections' },
  { key: 't50',  label: '50–99 connections' },
  { key: 't100', label: '100–199 connections' },
  { key: 't200', label: '200–299 connections' },
  { key: 't300', label: '300–499 connections' },
  { key: 't500', label: '500+ connections' }
];

/* --------------------------- Trust Badges -------------------------------- */
const TRUST_BADGES = [
  { icon: 'fa-solid fa-clock-rotate-left', color: 'blue',     title: '1–10+ Years Old',   sub: 'Naturally Aged' },
  { icon: 'fa-solid fa-shield-halved',     color: 'emerald',  title: 'Safe & Guarantee',  sub: 'Replacement Guarantee' },
  { icon: 'fa-solid fa-bolt',              color: 'amber',    title: 'Instant Delivery',  sub: 'Smooth Handover' },
  { icon: 'fa-solid fa-magnifying-glass',  color: 'purple',   title: 'Custom URL Check',  sub: 'Pre-selection Available' }
];

/* --------------------------- URL Check Option ---------------------------- */
const URL_CHECK = {
  perAccountFee: 10,
  cardNote: '+$10/acc to check & select URL prior to order',
  checkboxLabel: 'Add Custom URL Check (+$10/account extra)'
};

/* ---------------------------- Products ----------------------------------- */
/* accent: 'blue' | 'teal' | 'purple'  →  controls badge chip colour.
   badgeIcon: set to a FontAwesome class to render an icon, or null to show
   badgeText as text. prices use the PRICING_TIERS keys above. */
const PRODUCTS = [
  {
    id: 1,
    title: 'US Location - Single Email',
    badge: '#1 US Premium',
    location: 'US Location',
    type: 'Single Email Connected',
    accent: 'blue',
    badgeIcon: null,
    badgeText: 'US',
    accessAvailable: true,
    accessLabel: 'Full Email Access Available',
    age: '1–10+ Years Aged',
    prices: { t0: 15, t10: 25, t50: 40, t100: 50, t200: 55, t300: 60, t500: 70 }
  },
  {
    id: 2,
    title: 'US Location - Multi Email',
    badge: '#2 US Multi',
    location: 'US Location',
    type: 'Multiple Email Connected',
    accent: 'blue',
    badgeIcon: null,
    badgeText: 'US',
    accessAvailable: true,
    accessLabel: 'Full Email Access Available',
    age: '1–10+ Years Aged',
    prices: { t0: 13, t10: 22, t50: 35, t100: 45, t200: 50, t300: 55, t500: 60 }
  },
  {
    id: 3,
    title: 'US Location - 2FA / SMS',
    badge: '#3 US 2FA',
    location: 'US Location',
    type: '2FA / SMS Login',
    accent: 'blue',
    badgeIcon: null,
    badgeText: 'US',
    accessAvailable: false,
    accessLabel: 'Email Access Not Available',
    age: '1–10+ Years Aged',
    prices: { t0: 10, t10: 20, t50: 30, t100: 40, t200: 43, t300: 45, t500: 55 }
  },
  {
    id: 4,
    title: 'Random Country - Single Email',
    badge: '#4 Global Premium',
    location: 'Random Country',
    type: 'Single Email Connected',
    accent: 'teal',
    badgeIcon: 'fa-solid fa-globe',
    badgeText: null,
    accessAvailable: true,
    accessLabel: 'Full Email Access Available',
    age: '1–10+ Years Aged',
    prices: { t0: 13, t10: 22, t50: 35, t100: 40, t200: 45, t300: 50, t500: 60 }
  },
  {
    id: 5,
    title: 'Random Country - Multi Email',
    badge: '#5 Global Multi',
    location: 'Random Country',
    type: 'Multiple Email Connected',
    accent: 'teal',
    badgeIcon: 'fa-solid fa-globe',
    badgeText: null,
    accessAvailable: true,
    accessLabel: 'Full Email Access Available',
    age: '1–10+ Years Aged',
    prices: { t0: 12, t10: 20, t50: 30, t100: 35, t200: 40, t300: 45, t500: 55 }
  },
  {
    id: 6,
    title: 'Random Country - 2FA / SMS',
    badge: '#6 Global 2FA',
    location: 'Random Country',
    type: '2FA / SMS Login',
    accent: 'purple',
    badgeIcon: 'fa-solid fa-key',
    badgeText: null,
    accessAvailable: false,
    accessLabel: 'Email Access Not Available',
    age: '1–10+ Years Aged',
    prices: { t0: 10, t10: 15, t50: 25, t100: 30, t200: 35, t300: 40, t500: 50 }
  }
];