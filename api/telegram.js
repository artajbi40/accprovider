// Vercel Serverless Function — Secure Telegram Order Dispatcher
//
// Deploy this along with index.html so order payloads are forwarded to the
// Telegram Bot API WITHOUT exposing your bot token in the browser.
//
// Fill in your real values below, then set USE_PROXY: true in the CONFIG
// object inside index.html so the storefront posts to /api/telegram.
//
// Run locally:  vercel dev
// Deploy:       vercel --prod

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''; // paste bot token from @BotFather
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';      // paste your admin chat/group id

module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const { text } = req.body || {};

  if (!text) {
    res.status(400).json({ ok: false, error: 'Missing order payload (text)' });
    return;
  }

  if (!BOT_TOKEN || !CHAT_ID) {
    res.status(500).json({ ok: false, error: 'Telegram credentials not configured on the server.' });
    return;
  }

  try {
    const tgResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'Markdown'
      })
    });

    const json = await tgResponse.json();
    if (!json.ok) {
      res.status(500).json({ ok: false, error: json.description || 'Telegram sendMessage failed' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err.message || err) });
  }
};