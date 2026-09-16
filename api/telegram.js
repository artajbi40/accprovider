/* =============================================================================
   AccProvider — Telegram Notification Serverless Function
   -----------------------------------------------------------------------------
   Keeps the Telegram bot token server-side so it is never exposed in static
   files. Configure via environment variables:
     TELEGRAM_BOT_TOKEN  — token from @BotFather
     TELEGRAM_CHAT_ID    — numeric ID of the chat/channel/group to notify

   Getting CHAT_ID:
     1. Message your bot once.
     2. Open: https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
     3. The chat id appears under result[0].message.chat.id

   Deploys as-is on Vercel (/api/telegram) and Netlify (functions/telegram).
   ============================================================================= */

const TELEGRAM_API = 'https://api.telegram.org/bot';

function requireCredentials() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken) throw { code: 500, message: 'TELEGRAM_BOT_TOKEN is not configured on the server.' };
  if (!chatId) throw { code: 500, message: 'TELEGRAM_CHAT_ID is not configured on the server.' };
  return { botToken, chatId };
}

async function sendToTelegram(text) {
  const { botToken, chatId } = requireCredentials();
  const res = await fetch(TELEGRAM_API + botToken + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown'
    })
  });
  const json = await res.json();
  if (!json.ok) throw { code: 502, message: json.description || 'Telegram API error.' };
  return json;
}

async function handle(payloadText) {
  if (!payloadText) throw { code: 400, message: 'Missing order payload.' };
  await sendToTelegram(payloadText);
  return { ok: true };
}

/* ------------------------- Vercel (<default export) ------------------------ */
export default async function vercelHandler(req, res) {
  try {
    const body = req.body || {};
    const result = await handle(body.text);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.code || 500).json({ ok: false, error: err.message || 'Unexpected error.' });
  }
}

/* ------------------------ Netlify (named export) --------------------------- */
export const handler = async (event) => {
  try {
    const body = event && event.body ? JSON.parse(event.body || '{}') : {};
    const result = await handle(body.text);
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (err) {
    return { statusCode: err.code || 500, body: JSON.stringify({ ok: false, error: err.message || 'Unexpected error.' }) };
  }
};