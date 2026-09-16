# Product Requirements Document (PRD)

## Project Name: LinkedIn Accounts Automated Sales & Crypto Checkout Portal

### 1. Project Overview & Objective

A high-converting, dark-themed, ultra-fast static landing page and checkout portal to sell verified, aged LinkedIn accounts. Users can view pricing packages, select options, complete a crypto (USDT) payment via multiple networks (TRC20, BEP20, ERC20), submit their transaction hash (TXID) along with delivery details (Telegram/Email), and notify the admin instantly via a Telegram Bot.

---

### 2. Target Audience & Scale

* **Daily Visitors:** 100 – 1,000 users
* **Expected Orders:** 10 – 100 orders/day
* **Primary Device:** Mobile-first, fully responsive for tablets and desktops.

---

### 3. Tech Stack Recommendation (Zero Cost & High Performance)

* **Frontend:** HTML5, Tailwind CSS (via CDN), Vanilla JavaScript (for modal, dynamic price calculations, and form submission).
* **Hosting (Frontend):** Vercel or Netlify (Free tier, global CDN, zero downtime for high traffic).
* **Backend / Notification Handler:** Vercel Serverless Functions (Node.js) or direct secure Telegram Bot API call from the frontend (via environment variables/proxy to protect bot tokens).

---

### 4. Core Features & User Flow

#### A. Landing Page (The Poster)

* Displays 6 categories of LinkedIn accounts (US Location Single/Multi/2FA, Global Single/Multi/2FA).
* Each card includes aged duration (1–10+ years), trust badges, connection-wise pricing tables, and a **"Buy Now"** button.
* Direct contact handles (Telegram, WhatsApp, Email) at the bottom footer.

#### B. Checkout Modal (Interactive Popup)

When a user clicks **"Buy Now"** on any card, a popup modal opens automatically carrying the selected product info:

1. **Product Summary:** Selected Category, Connection Range, Base Unit Price.
2. **Quantity Selector:** Increment/Decrement counter (e.g., Quantity: 1, 2, 3...) which dynamically updates the **Total USDT Amount**.
3. **Network Selection Tabs / Radio Buttons:**
* **TRC20** (Tron Network)
* **BEP20** (BNB Smart Chain)
* **ERC20** (Ethereum Network)
*(Displays the corresponding USDT wallet address and an option to copy it with a single click).*


4. **Input Fields:**
* **Transaction ID (TXID) / Hash:** Required text input.
* **Telegram Username:** Required (e.g., `@username`).
* **Email Address:** Required (for delivery/backup).


5. **Action Button:** "Submit Order & Confirm Payment"

#### C. Order Processing & Admin Notification (Telegram Bot)

* Once the user submits the form, data is securely sent to the **Telegram Bot**.
* The Admin receives an instant formatted message on Telegram containing all details.
* A success screen appears on the website telling the user: *"Order Submitted Successfully! We are verifying your transaction and will deliver your account details via Telegram within 10–30 minutes."*

---

### 5. Detailed UI / UX Requirements (Design Guidelines)

* **Color Palette:** Dark luxury theme (Background: `#090d16` to `#0f172a`, Accents: Electric Blue `#3b82f6`, Cyan `#06b6d4`, Success Emerald `#10b981`).
* **Typography:** Plus Jakarta Sans font.
* **Animations:** Smooth modal fade-in/fade-out transitions, hover glow effects on cards, and copy-to-clipboard success tooltips ("Copied!").

---

### 6. Step-by-Step Implementation Roadmap

1. **Phase 1: Frontend UI Setup**
* Integrate the Tailwind CSS design provided earlier.
* Add a hidden Modal container component at the bottom of the HTML file.


2. **Phase 2: JavaScript Modal Logic**
* Write JS functions to capture click events on "Buy Now", extract product name/tier/price, populate the modal fields, and handle quantity multiplier calculations.


3. **Phase 3: Telegram Bot Setup**
* Create a new bot via `@BotFather` on Telegram to get the `BOT_TOKEN`.
* Retrieve your personal or group `CHAT_ID`.


4. **Phase 4: Form Submission & API Integration**
* Implement fetch requests to send the payload to the Telegram API endpoint: `[https://api.telegram.org/bot](https://api.telegram.org/bot)<TOKEN>/sendMessage`.


5. **Phase 5: Deployment**
* Push code to a GitHub repository.
* Link the repository to **Vercel** and point your custom domain.



---

### 7. Future Enhancements (Post-MVP)

* Automated crypto payment verification via blockchain API (e.g., NowPayments or Coinbase Commerce) so orders complete automatically without manual TXID checking.
* Automated account delivery database lookup.