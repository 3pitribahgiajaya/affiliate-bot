export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "*";
    const corsOrigin = allowed === "*" || origin === allowed ? (allowed === "*" ? "*" : origin) : "null";
    const headers = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
      "Content-Type": "application/json; charset=utf-8",
      "Vary": "Origin"
    };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ ok: true, service: "BEN AI Affiliate Worker", telegramConfigured: Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) }, { headers });
    }
    if (request.method !== "POST" || url.pathname !== "/api/telegram") {
      return Response.json({ ok: false, error: "Not found" }, { status: 404, headers });
    }
    const auth = request.headers.get("Authorization") || "";
    if (!env.BEN_AI_ADMIN_TOKEN || auth !== `Bearer ${env.BEN_AI_ADMIN_TOKEN}`) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401, headers });
    }
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      return Response.json({ ok: false, error: "Telegram belum dikonfigurasi di Worker secrets" }, { status: 503, headers });
    }
    let body;
    try { body = await request.json(); } catch {
      return Response.json({ ok: false, error: "Body harus JSON" }, { status: 400, headers });
    }
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text || text.length > 4096) {
      return Response.json({ ok: false, error: "Isi text wajib 1-4096 karakter" }, { status: 400, headers });
    }
    const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, disable_web_page_preview: false })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      return Response.json({ ok: false, error: "Telegram menolak pengiriman", details: result.description || "Provider error" }, { status: 502, headers });
    }
    return Response.json({ ok: true, message_id: result.result?.message_id ?? null }, { headers });
  }
};
