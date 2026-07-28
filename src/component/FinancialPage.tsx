// src/component/FinancialPage.tsx
import { useEffect, useState } from "react";

/**
 * Financial news feed.
 *
 * This page never sees the Finnhub API key. It calls /api/news, which is
 * handled by api/news.js on Vercel and by a dev proxy in vite.config.ts
 * locally. Both attach the key server-side.
 */

const TABS = [
  { id: "general", label: "MARKETS" },
  { id: "forex", label: "FOREX" },
  { id: "crypto", label: "CRYPTO" },
  { id: "merger", label: "M&A" },
];

interface NewsItem {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  datetime: number;
}

// Finnhub returns Unix seconds.
function timeAgo(unixSeconds: number) {
  const minutes = Math.floor((Date.now() / 1000 - unixSeconds) / 60);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function FinancialPage() {
  const [category, setCategory] = useState("general");
  const [items, setItems] = useState<NewsItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    fetch(`/api/news?category=${category}`)
      .then((r) => {
        if (!r.ok) throw new Error("bad response");
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        setItems(Array.isArray(data) ? data.slice(0, 30) : []);
        setStatus("ok");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  return (
    <div
      style={{
        width: "min(680px, 92vw)",
        borderRadius: "20px",
        background: "rgba(20,10,32,0.6)",
        border: "1px solid rgba(255,255,255,0.15)",
        padding: "36px 28px",
        fontFamily: "'Julius Sans One', sans-serif",
        color: "#fff6e0",
      }}
    >
      <h1
        style={{
          fontSize: "26px",
          letterSpacing: "0.1em",
          margin: "0 0 24px",
          textAlign: "center",
        }}
      >
        FINANCIAL NEWS
      </h1>

      {/* Category filter */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "28px",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategory(tab.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "999px",
              fontSize: "12px",
              letterSpacing: "0.05em",
              cursor: "pointer",
              fontFamily: "inherit",
              color: category === tab.id ? "#1a1020" : "#fff6e0",
              background: category === tab.id ? "#c4b5fd" : "rgba(255,255,255,0.08)",
              border:
                category === tab.id
                  ? "1px solid #c4b5fd"
                  : "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {status === "loading" && (
        <div style={{ textAlign: "center", opacity: 0.6, padding: "30px 0" }}>Loading...</div>
      )}

      {status === "error" && (
        <div style={{ textAlign: "center", opacity: 0.75, padding: "30px 0", fontSize: "14px" }}>
          Could not load the news feed. Check that FINNHUB_API_KEY is set.
        </div>
      )}

      {status === "ok" && items.length === 0 && (
        <div style={{ textAlign: "center", opacity: 0.6, padding: "30px 0", fontSize: "14px" }}>
          No stories in this category right now.
        </div>
      )}

      {status === "ok" &&
        items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              padding: "18px 0",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ fontSize: "11px", opacity: 0.5, marginBottom: "6px" }}>
              {item.source} - {timeAgo(item.datetime)}
            </div>

            <div style={{ fontSize: "15px", lineHeight: 1.5, marginBottom: "6px" }}>
              {item.headline}
            </div>

            {item.summary && (
              <div style={{ fontSize: "13px", lineHeight: 1.6, opacity: 0.6 }}>
                {item.summary.length > 180
                  ? `${item.summary.slice(0, 180)}...`
                  : item.summary}
              </div>
            )}
          </a>
        ))}

      <div style={{ fontSize: "11px", opacity: 0.4, marginTop: "24px", textAlign: "center" }}>
        News data from finnhub.io
      </div>
    </div>
  );
}
