// src/component/ConverterPage.tsx
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/**
 * Currency converter using the Frankfurter API.
 * No API key, no signup, no rate limit. https://frankfurter.dev
 *
 * Two calls per currency pair:
 *   /v2/rate/USD/THB                     -> { date, base, quote, rate }
 *   /v2/rates?base=USD&quotes=THB&from=..&group=month  -> array of the same
 *
 * Rates are end-of-day central bank reference rates, not live trading
 * prices. On weekends you get the last published weekday rate.
 */

const API = "https://api.frankfurter.dev/v2";

const CURRENCIES = [
  "THB", "USD", "EUR", "GBP", "JPY", "CNY",
  "KRW", "SGD", "AUD", "CAD", "CHF", "HKD",
];

interface RateRecord {
  date: string;
  base: string;
  quote: string;
  rate: number;
}

// One year ago, as YYYY-MM-DD.
function oneYearAgo() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return d.toISOString().slice(0, 10);
}

export function ConverterPage() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("THB");

  const [rate, setRate] = useState<number | null>(null);
  const [asOf, setAsOf] = useState("");
  const [history, setHistory] = useState<RateRecord[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    // Same currency both sides: nothing to fetch.
    if (from === to) {
      setRate(1);
      setHistory([]);
      setAsOf("");
      setStatus("ok");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    Promise.all([
      fetch(`${API}/rate/${from}/${to}`).then((r) => r.json()),
      fetch(`${API}/rates?base=${from}&quotes=${to}&from=${oneYearAgo()}&group=month`).then(
        (r) => r.json()
      ),
    ])
      .then(([latest, series]) => {
        if (cancelled) return;
        if (typeof latest?.rate !== "number") throw new Error("no rate in response");
        setRate(latest.rate);
        setAsOf(latest.date ?? "");
        setHistory(Array.isArray(series) ? series : []);
        setStatus("ok");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [from, to]);

  const parsed = Number(amount);
  const validAmount = amount.trim() !== "" && !Number.isNaN(parsed);
  const result = rate !== null && validAmount ? parsed * rate : null;

  const chartData = history.map((r) => ({ month: r.date.slice(0, 7), rate: r.rate }));

  const selectStyle = {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(20,10,32,0.8)",
    color: "#fff6e0",
    fontFamily: "'Julius Sans One', sans-serif",
    fontSize: "14px",
  };

  return (
    <div
      style={{
        width: "min(620px, 92vw)",
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
          margin: "0 0 28px",
          textAlign: "center",
        }}
      >
        CONVERTER
      </h1>

      {/* Amount + currency pickers */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          style={{ ...selectStyle, flex: "1 1 120px", minWidth: 0 }}
        />

        <select value={from} onChange={(e) => setFrom(e.target.value)} style={selectStyle}>
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <button
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
          title="Swap"
          style={{ ...selectStyle, cursor: "pointer", padding: "10px 14px" }}
        >
          {"<>"}
        </button>

        <select value={to} onChange={(e) => setTo(e.target.value)} style={selectStyle}>
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Result */}
      <div style={{ textAlign: "center", marginBottom: "8px", minHeight: "46px" }}>
        {status === "loading" && <span style={{ opacity: 0.6 }}>Loading...</span>}

        {status === "error" && (
          <span style={{ opacity: 0.75, fontSize: "14px" }}>
            Could not load rates. Check your connection and try again.
          </span>
        )}

        {status === "ok" && !validAmount && (
          <span style={{ opacity: 0.6, fontSize: "14px" }}>Enter a number.</span>
        )}

        {status === "ok" && result !== null && (
          <div style={{ fontSize: "32px", letterSpacing: "0.02em" }}>
            {result.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            <span style={{ fontSize: "18px", opacity: 0.7 }}>{to}</span>
          </div>
        )}
      </div>

      {status === "ok" && rate !== null && from !== to && (
        <div style={{ textAlign: "center", fontSize: "12px", opacity: 0.5, marginBottom: "28px" }}>
          1 {from} = {rate.toFixed(4)} {to}
          {asOf && ` - as of ${asOf}`}
        </div>
      )}

      {/* 12 month trend */}
      {chartData.length > 1 && (
        <>
          <div style={{ fontSize: "12px", letterSpacing: "0.08em", opacity: 0.5, marginBottom: "12px" }}>
            LAST 12 MONTHS
          </div>

          <ResponsiveContainer width="100%" height={170}>
            <LineChart data={chartData} margin={{ top: 5, right: 8, bottom: 0, left: -12 }}>
              <XAxis
                dataKey="month"
                tick={{ fill: "rgba(255,246,224,0.5)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "rgba(255,246,224,0.5)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={52}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(20,10,32,0.95)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "8px",
                  color: "#fff6e0",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#c4b5fd"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}

      <div style={{ fontSize: "11px", opacity: 0.4, marginTop: "20px", textAlign: "center" }}>
        Central bank reference rates via frankfurter.dev. Updated once per working day.
      </div>
    </div>
  );
}
