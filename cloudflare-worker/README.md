# BEN AI — Cloudflare Worker (Telegram starter)

This is a deployable starter, not a live deployment. It does not claim that Telegram, Shopee, or any social account is connected until credentials are configured and a real test succeeds.

## What it does
- `GET /health`: reports service health and whether Telegram secrets exist (never returns secret values).
- `POST /api/telegram`: sends plain text to one configured Telegram chat/channel.
- Requires a private admin bearer token. Secrets stay in Cloudflare Worker environment variables, not in the website.

## Deploy
1. In Cloudflare Dashboard, open **Workers & Pages** → **Create** → **Worker**.
2. Create a Worker named `ben-ai-affiliate`.
3. Replace its starter code with `worker.js` from this folder and deploy.
4. In Worker **Settings → Variables and Secrets**, add these as **Secrets**:
   - `BEN_AI_ADMIN_TOKEN`: generate a long random value; keep it private.
   - `TELEGRAM_BOT_TOKEN`: token from BotFather.
   - `TELEGRAM_CHAT_ID`: destination channel ID (for a public channel, it may be `@channelusername`).
5. Optional variable: `ALLOWED_ORIGIN` = exact GitHub Pages origin, e.g. `https://3pitribahgiajaya.github.io`.
6. Ensure the Telegram bot is an administrator of the destination channel with permission to post.
7. Test `GET https://YOUR-WORKER.workers.dev/health`. A successful health response is not proof of message delivery.
8. Test delivery with:
   ```bash
   curl -X POST "https://YOUR-WORKER.workers.dev/api/telegram" \
     -H "Authorization: Bearer YOUR_BEN_AI_ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"text":"Tes BEN AI — pesan uji Telegram"}'
   ```
   Confirm the message appears in the intended channel and the API returns `{"ok":true,...}`.

## Safety
- Never put bot tokens or admin tokens in `index.html`, GitHub Pages, screenshots, or chat.
- If a token is exposed, revoke/rotate it immediately.
- Do not use this endpoint as an unauthenticated public relay.
- Telegram is the first channel only. Blogger, Meta, TikTok, and Shopee integrations require their own authorization and are not implemented by this starter.
- Shopee Affiliate Open API for Indonesia remains unverified. Until Shopee confirms eligibility and issues official credentials, use official Product Feed/affiliate links and imported performance reports.
