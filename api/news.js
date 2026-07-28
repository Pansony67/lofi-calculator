// api/news.js
//
// Runs on Vercel as a serverless function. The Finnhub API key lives in
// process.env here, on the server, so it never reaches the browser.
// Never import this file from anything inside src/.
//
// Local dev does not run this file. vite.config.ts proxies /api/news
// straight to Finnhub instead, so both environments behave the same.

const CATEGORIES = ["general", "forex", "crypto", "merger"];

export default async function handler(req, res) {
  const send = (status, body) => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(body));
  };

  const token = process.env.FINNHUB_API_KEY;
  if (!token) {
    return send(500, { error: "FINNHUB_API_KEY is not set" });
  }

  // Only allow the four categories Finnhub supports. Anything else and
  // we fall back to general rather than passing user input through.
  let category = "general";
  try {
    const requested = new URL(req.url, "http://localhost").searchParams.get("category");
    if (requested && CATEGORIES.includes(requested)) {
      category = requested;
    }
  } catch {
    // keep the default
  }

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/news?category=${category}&token=${token}`
    );

    if (!response.ok) {
      return send(response.status, { error: "Finnhub rejected the request" });
    }

    const data = await response.json();

    // Trim the payload down to what the page actually renders.
    const items = (Array.isArray(data) ? data : []).slice(0, 30).map((n) => ({
      id: n.id,
      headline: n.headline,
      summary: n.summary,
      source: n.source,
      url: n.url,
      image: n.image,
      datetime: n.datetime,
    }));

    // Cache at the edge for 5 minutes so repeat visits do not burn quota.
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return send(200, items);
  } catch {
    return send(502, { error: "Could not reach Finnhub" });
  }
}
