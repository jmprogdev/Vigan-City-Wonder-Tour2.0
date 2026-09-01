const json = (data, status = 200, origin = "*") => new Response(JSON.stringify(data), {
  status,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store"
  }
});

function corsOrigin(request, env) {
  const requestOrigin = request.headers.get("Origin") || "";
  const allowed = String(env.ALLOWED_ORIGIN || "*").trim();
  if (!allowed || allowed === "*") return "*";
  return requestOrigin === allowed ? allowed : "null";
}

function cleanText(value, maxLength) {
  return String(value || "").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

async function summary(env, origin) {
  const [visitorRow, reviewStats, reviewRows] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS count FROM visitors").first(),
    env.DB.prepare("SELECT COUNT(*) AS count, COALESCE(AVG(rating), 0) AS average FROM reviews").first(),
    env.DB.prepare("SELECT id, name, rating, feedback, replace(created_at, ' ', 'T') || 'Z' AS createdAt FROM reviews ORDER BY id DESC LIMIT 50").all()
  ]);

  return json({
    visitors: Number(visitorRow?.count || 0),
    reviewCount: Number(reviewStats?.count || 0),
    averageRating: Number(reviewStats?.average || 0),
    reviews: reviewRows.results || []
  }, 200, origin);
}

export default {
  async fetch(request, env) {
    const origin = corsOrigin(request, env);
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400"
        }
      });
    }
    if (origin === "null") return json({ error: "Origin not allowed." }, 403, origin);

    const url = new URL(request.url);

    try {
      if (request.method === "GET" && url.pathname === "/api/summary") {
        return summary(env, origin);
      }

      if (request.method === "POST" && url.pathname === "/api/visit") {
        const body = await request.json();
        const visitorId = cleanText(body?.visitorId, 120);
        if (!visitorId) return json({ error: "Missing visitor ID." }, 400, origin);

        await env.DB.prepare(`
          INSERT INTO visitors (visitor_id, first_seen, last_seen)
          VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          ON CONFLICT(visitor_id) DO UPDATE SET last_seen = CURRENT_TIMESTAMP
        `).bind(visitorId).run();

        const visitorRow = await env.DB.prepare("SELECT COUNT(*) AS count FROM visitors").first();
        return json({ ok: true, visitors: Number(visitorRow?.count || 0) }, 200, origin);
      }

      if (request.method === "POST" && url.pathname === "/api/reviews") {
        const body = await request.json();
        const visitorId = cleanText(body?.visitorId, 120);
        const name = cleanText(body?.name || "Anonymous visitor", 60) || "Anonymous visitor";
        const feedback = cleanText(body?.feedback, 600);
        const rating = Number(body?.rating);

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
          return json({ error: "Rating must be from 1 to 5." }, 400, origin);
        }
        if (!feedback) return json({ error: "Feedback is required." }, 400, origin);

        if (visitorId) {
          await env.DB.prepare(`
            INSERT INTO visitors (visitor_id, first_seen, last_seen)
            VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT(visitor_id) DO UPDATE SET last_seen = CURRENT_TIMESTAMP
          `).bind(visitorId).run();
        }

        const result = await env.DB.prepare(`
          INSERT INTO reviews (visitor_id, name, rating, feedback, created_at)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).bind(visitorId || null, name, rating, feedback).run();

        return json({ ok: true, id: result.meta?.last_row_id || null }, 201, origin);
      }

      return json({ error: "Not found." }, 404, origin);
    } catch (error) {
      return json({ error: "Server error. Please try again." }, 500, origin);
    }
  }
};
