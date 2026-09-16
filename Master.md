Act as an expert Full-Stack Frontend Developer. I have an existing PRD (Product Requirements Document) in root directory PRD.md and an UI desing at idea/index.html. 

I want you to complete the full project code following these exact modular requirements:

1. MODULAR DATA CONFIG (JSON or JS Object):
- Extract all static content (product titles, categories, trust badges, connection ranges, and pricing tiers) into a separate configuration file or a clean JavaScript object at the top (e.g., `config.js` or `productsData`). 
- This will allow me to easily change prices, package names, and wallet addresses at any time without touching the core UI code.

2. UI & DESIGN:
- Use the existing dark luxury aesthetic (Slate dark background #090d16 to #0f172a, Plus Jakarta Sans font, Tailwind CSS). UI design in idea/index.html follow this UI design
- Responsive layout with product cards, pricing tables, and trust badges.

3. INTERACTIVE CHECKOUT MODAL & DYNAMIC PRICING:
- Clicking "Buy Now" on any product card opens a sleek popup modal.
- The modal dynamically pulls the correct product details, calculates the total price based on a Quantity selector (increment/decrement), and shows crypto payment options (TRC20, BEP20, ERC20) with my USDT wallet address and a 1-click copy button.
- Input fields for: Transaction ID (TXID) / Hash, Telegram Username, and Email Address.

4. TELEGRAM BOT INTEGRATION:
- Implement Vanilla JS fetch() logic on form submission to securely push the complete order payload (Product info, quantity, total price, network, TXID, telegram handle, and email) directly to a Telegram Bot API.
- Show a success alert upon successful dispatch.

Please provide the complete, clean, production-ready code split properly (e.g., index.html and config.js/script.js) so I can easily host it on Vercel or Netlify.