// Real-time stock data via Yahoo Finance (free, no API key needed)
// Uses a public CORS-friendly proxy because Yahoo's endpoints don't allow browser CORS.
// Falls back to deterministic mock data if the network call fails (offline / rate limited).

import {
  PricePoint,
  TimeRange,
  generatePriceHistory as mockHistory,
} from "./mockData";

// Public, key-less CORS proxy. If it ever rate-limits, the mock fallback kicks in.
const PROXY = "https://corsproxy.io/?url=";
const YF_CHART = "https://query1.finance.yahoo.com/v8/finance/chart/";

interface YFResponse {
  chart: {
    result?: Array<{
      meta: { regularMarketPrice?: number; chartPreviousClose?: number; symbol: string; exchangeName?: string };
      timestamp?: number[];
      indicators: {
        quote: Array<{
          open?: (number | null)[];
          high?: (number | null)[];
          low?: (number | null)[];
          close?: (number | null)[];
          volume?: (number | null)[];
        }>;
      };
    }>;
    error?: { description?: string } | null;
  };
}

const RANGE_MAP: Record<TimeRange, { range: string; interval: string; format: "time" | "day" | "month" }> = {
  "1D": { range: "1d", interval: "5m", format: "time" },
  "1W": { range: "5d", interval: "30m", format: "day" },
  "1M": { range: "1mo", interval: "1d", format: "day" },
  "1Y": { range: "1y", interval: "1d", format: "month" },
};

function fmtDate(d: Date, fmt: "time" | "day" | "month") {
  if (fmt === "time") return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (fmt === "day") return d.toLocaleDateString([], { month: "short", day: "numeric" });
  return d.toLocaleDateString([], { month: "short", year: "2-digit" });
}

const round = (n: number) => Math.round(n * 100) / 100;

// Simple in-memory cache to avoid hammering the proxy
const cache = new Map<string, { ts: number; data: PricePoint[] }>();
const CACHE_MS = 60 * 1000;

export async function fetchHistory(symbol: string, range: TimeRange): Promise<PricePoint[]> {
  const key = `${symbol}|${range}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_MS) return cached.data;

  const cfg = RANGE_MAP[range];
  const yfUrl = `${YF_CHART}${encodeURIComponent(symbol)}?range=${cfg.range}&interval=${cfg.interval}`;
  const url = `${PROXY}${encodeURIComponent(yfUrl)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as YFResponse;
    const result = json.chart?.result?.[0];
    if (!result || !result.timestamp) throw new Error("No data");

    const q = result.indicators.quote[0];
    const points: PricePoint[] = [];
    for (let i = 0; i < result.timestamp.length; i++) {
      const close = q.close?.[i];
      if (close == null) continue;
      const open = q.open?.[i] ?? close;
      const high = q.high?.[i] ?? close;
      const low = q.low?.[i] ?? close;
      const volume = q.volume?.[i] ?? 0;
      const ts = result.timestamp[i] * 1000;
      const d = new Date(ts);
      points.push({
        date: fmtDate(d, cfg.format),
        timestamp: ts,
        price: round(close),
        open: round(open),
        high: round(high),
        low: round(low),
        close: round(close),
        volume,
      });
    }
    if (!points.length) throw new Error("Empty series");
    cache.set(key, { ts: Date.now(), data: points });
    return points;
  } catch (err) {
    console.warn(`[stockApi] Falling back to mock data for ${symbol}:`, err);
    // Fallback so the UI never breaks (offline / rate limit / unknown symbol in mock)
    return mockHistory(symbol, range);
  }
}

// Lightweight quote search via Yahoo's autocomplete endpoint
export interface QuoteSuggestion {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

const searchCache = new Map<string, QuoteSuggestion[]>();

export async function searchSymbols(query: string): Promise<QuoteSuggestion[]> {
  const q = query.trim();
  if (!q) return [];
  const cached = searchCache.get(q.toLowerCase());
  if (cached) return cached;

  const yfUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=8&newsCount=0`;
  const url = `${PROXY}${encodeURIComponent(yfUrl)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const quotes = (json?.quotes ?? []) as Array<{
      symbol?: string;
      shortname?: string;
      longname?: string;
      exchDisp?: string;
      quoteType?: string;
    }>;
    const out: QuoteSuggestion[] = quotes
      .filter((x) => x.symbol && (x.quoteType === "EQUITY" || x.quoteType === "ETF" || x.quoteType === "INDEX"))
      .map((x) => ({
        symbol: x.symbol!,
        name: x.shortname || x.longname || x.symbol!,
        exchange: x.exchDisp || "",
        type: x.quoteType || "EQUITY",
      }));
    searchCache.set(q.toLowerCase(), out);
    return out;
  } catch (err) {
    console.warn("[stockApi] Search failed:", err);
    return [];
  }
}
