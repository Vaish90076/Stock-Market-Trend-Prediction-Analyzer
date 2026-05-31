// Mock stock data + simple indicator calculations

export interface StockMeta {
  symbol: string;
  name: string;
  exchange: string;
  basePrice: number;
  volatility: number;
  trend: number; // -1..1
}

export const STOCKS: Record<string, StockMeta> = {
  // US — Tech
  AAPL: { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", basePrice: 189.4, volatility: 0.012, trend: 0.0006 },
  MSFT: { symbol: "MSFT", name: "Microsoft Corp.", exchange: "NASDAQ", basePrice: 421.3, volatility: 0.011, trend: 0.0008 },
  GOOGL: { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ", basePrice: 168.2, volatility: 0.014, trend: 0.0005 },
  AMZN: { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ", basePrice: 184.7, volatility: 0.015, trend: 0.0004 },
  META: { symbol: "META", name: "Meta Platforms Inc.", exchange: "NASDAQ", basePrice: 498.1, volatility: 0.018, trend: 0.0007 },
  NVDA: { symbol: "NVDA", name: "NVIDIA Corp.", exchange: "NASDAQ", basePrice: 875.6, volatility: 0.025, trend: 0.0012 },
  TSLA: { symbol: "TSLA", name: "Tesla, Inc.", exchange: "NASDAQ", basePrice: 245.8, volatility: 0.028, trend: -0.0004 },
  NFLX: { symbol: "NFLX", name: "Netflix, Inc.", exchange: "NASDAQ", basePrice: 612.4, volatility: 0.018, trend: 0.0006 },
  AMD: { symbol: "AMD", name: "Advanced Micro Devices", exchange: "NASDAQ", basePrice: 158.2, volatility: 0.024, trend: 0.0005 },
  INTC: { symbol: "INTC", name: "Intel Corp.", exchange: "NASDAQ", basePrice: 31.5, volatility: 0.022, trend: -0.0003 },
  ORCL: { symbol: "ORCL", name: "Oracle Corp.", exchange: "NYSE", basePrice: 142.8, volatility: 0.013, trend: 0.0006 },
  CRM: { symbol: "CRM", name: "Salesforce, Inc.", exchange: "NYSE", basePrice: 268.4, volatility: 0.016, trend: 0.0004 },
  ADBE: { symbol: "ADBE", name: "Adobe Inc.", exchange: "NASDAQ", basePrice: 489.7, volatility: 0.015, trend: 0.0003 },
  // US — Finance / Industrial / Consumer
  JPM: { symbol: "JPM", name: "JPMorgan Chase & Co.", exchange: "NYSE", basePrice: 198.6, volatility: 0.012, trend: 0.0004 },
  BAC: { symbol: "BAC", name: "Bank of America", exchange: "NYSE", basePrice: 38.9, volatility: 0.014, trend: 0.0003 },
  V: { symbol: "V", name: "Visa Inc.", exchange: "NYSE", basePrice: 278.5, volatility: 0.010, trend: 0.0005 },
  MA: { symbol: "MA", name: "Mastercard Inc.", exchange: "NYSE", basePrice: 462.1, volatility: 0.011, trend: 0.0005 },
  WMT: { symbol: "WMT", name: "Walmart Inc.", exchange: "NYSE", basePrice: 68.3, volatility: 0.009, trend: 0.0004 },
  DIS: { symbol: "DIS", name: "Walt Disney Co.", exchange: "NYSE", basePrice: 102.4, volatility: 0.014, trend: 0.0001 },
  KO: { symbol: "KO", name: "Coca-Cola Co.", exchange: "NYSE", basePrice: 65.2, volatility: 0.008, trend: 0.0002 },
  PEP: { symbol: "PEP", name: "PepsiCo, Inc.", exchange: "NASDAQ", basePrice: 168.9, volatility: 0.009, trend: 0.0002 },
  NKE: { symbol: "NKE", name: "Nike, Inc.", exchange: "NYSE", basePrice: 78.5, volatility: 0.015, trend: -0.0002 },
  BA: { symbol: "BA", name: "Boeing Co.", exchange: "NYSE", basePrice: 178.3, volatility: 0.020, trend: -0.0003 },
  // ETFs / Index
  SPY: { symbol: "SPY", name: "SPDR S&P 500 ETF", exchange: "NYSEARCA", basePrice: 542.8, volatility: 0.008, trend: 0.0004 },
  QQQ: { symbol: "QQQ", name: "Invesco QQQ Trust", exchange: "NASDAQ", basePrice: 478.6, volatility: 0.010, trend: 0.0005 },
  // Crypto
  "BTC-USD": { symbol: "BTC-USD", name: "Bitcoin USD", exchange: "CCC", basePrice: 67200, volatility: 0.030, trend: 0.0008 },
  "ETH-USD": { symbol: "ETH-USD", name: "Ethereum USD", exchange: "CCC", basePrice: 3450, volatility: 0.034, trend: 0.0006 },
  // India — NSE
  "RELIANCE.NS": { symbol: "RELIANCE.NS", name: "Reliance Industries", exchange: "NSE", basePrice: 2890, volatility: 0.013, trend: 0.0003 },
  "TCS.NS": { symbol: "TCS.NS", name: "Tata Consultancy Services", exchange: "NSE", basePrice: 3950, volatility: 0.011, trend: 0.0002 },
  "INFY.NS": { symbol: "INFY.NS", name: "Infosys Ltd.", exchange: "NSE", basePrice: 1480, volatility: 0.014, trend: -0.0001 },
  "HDFCBANK.NS": { symbol: "HDFCBANK.NS", name: "HDFC Bank Ltd.", exchange: "NSE", basePrice: 1650, volatility: 0.012, trend: 0.0003 },
  "ICICIBANK.NS": { symbol: "ICICIBANK.NS", name: "ICICI Bank Ltd.", exchange: "NSE", basePrice: 1180, volatility: 0.013, trend: 0.0004 },
  "TATAMOTORS.NS": { symbol: "TATAMOTORS.NS", name: "Tata Motors Ltd.", exchange: "NSE", basePrice: 985, volatility: 0.020, trend: 0.0006 },
  "WIPRO.NS": { symbol: "WIPRO.NS", name: "Wipro Ltd.", exchange: "NSE", basePrice: 525, volatility: 0.015, trend: 0.0001 },
};

export interface PricePoint {
  date: string;
  timestamp: number;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Seeded random for stable mock data per symbol
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function hashSeed(symbol: string): number {
  let h = 2166136261;
  for (let i = 0; i < symbol.length; i++) {
    h ^= symbol.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

export type TimeRange = "1D" | "1W" | "1M" | "1Y";

const RANGE_CONFIG: Record<TimeRange, { points: number; stepMs: number; format: "time" | "day" | "month" }> = {
  "1D": { points: 78, stepMs: 5 * 60 * 1000, format: "time" },
  "1W": { points: 7 * 8, stepMs: 60 * 60 * 1000, format: "day" },
  "1M": { points: 30, stepMs: 24 * 60 * 60 * 1000, format: "day" },
  "1Y": { points: 252, stepMs: 24 * 60 * 60 * 1000, format: "month" },
};

export function generatePriceHistory(symbol: string, range: TimeRange): PricePoint[] {
  const meta = STOCKS[symbol];
  if (!meta) return [];
  const cfg = RANGE_CONFIG[range];
  const rand = seededRandom(hashSeed(symbol) + cfg.points);
  const now = Date.now();
  const points: PricePoint[] = [];
  let price = meta.basePrice * (1 - meta.trend * cfg.points * 0.5);

  for (let i = 0; i < cfg.points; i++) {
    const ts = now - (cfg.points - i) * cfg.stepMs;
    const noise = (rand() - 0.5) * 2 * meta.volatility;
    price = price * (1 + meta.trend + noise);
    const open = price * (1 + (rand() - 0.5) * meta.volatility * 0.3);
    const close = price;
    const high = Math.max(open, close) * (1 + rand() * meta.volatility * 0.4);
    const low = Math.min(open, close) * (1 - rand() * meta.volatility * 0.4);
    const d = new Date(ts);
    points.push({
      date: formatDate(d, cfg.format),
      timestamp: ts,
      price: round(close),
      open: round(open),
      high: round(high),
      low: round(low),
      close: round(close),
      volume: Math.floor(rand() * 5_000_000 + 1_000_000),
    });
  }
  return points;
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

function formatDate(d: Date, fmt: "time" | "day" | "month") {
  if (fmt === "time") return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (fmt === "day") return d.toLocaleDateString([], { month: "short", day: "numeric" });
  return d.toLocaleDateString([], { month: "short", year: "2-digit" });
}

// --- Indicators ---

export function sma(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    out.push(i >= period - 1 ? sum / period : null);
  }
  return out;
}

export function ema(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = [];
  const k = 2 / (period + 1);
  let prev: number | null = null;
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      out.push(null);
      continue;
    }
    if (prev === null) {
      const seed = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
      prev = seed;
      out.push(seed);
      continue;
    }
    prev = values[i] * k + prev * (1 - k);
    out.push(prev);
  }
  return out;
}

export function rsi(values: number[], period = 14): number {
  if (values.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = values.length - period; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

export function macd(values: number[]): { macd: number; signal: number; histogram: number; label: "Bullish" | "Bearish" | "Neutral" } {
  const ema12 = ema(values, 12);
  const ema26 = ema(values, 26);
  const macdLine: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const a = ema12[i];
    const b = ema26[i];
    if (a !== null && b !== null) macdLine.push(a - b);
  }
  const signalArr = ema(macdLine, 9).filter((v): v is number => v !== null);
  const m = macdLine[macdLine.length - 1] ?? 0;
  const s = signalArr[signalArr.length - 1] ?? 0;
  const h = m - s;
  const label = h > 0.05 ? "Bullish" : h < -0.05 ? "Bearish" : "Neutral";
  return { macd: round(m), signal: round(s), histogram: round(h), label };
}

export type Trend = "Bullish" | "Bearish" | "Sideways";

export function detectTrend(values: number[]): Trend {
  if (values.length < 20) return "Sideways";
  const recent = values.slice(-20);
  const first = recent[0];
  const last = recent[recent.length - 1];
  const change = (last - first) / first;
  if (change > 0.02) return "Bullish";
  if (change < -0.02) return "Bearish";
  return "Sideways";
}

// --- Prediction (simple linear regression on last N points) ---

export interface Prediction {
  date: string;
  price: number;
  timestamp: number;
}

export function predictNextDays(history: PricePoint[], days = 5): Prediction[] {
  const n = Math.min(20, history.length);
  const recent = history.slice(-n);
  const xs = recent.map((_, i) => i);
  const ys = recent.map((p) => p.close);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - meanX) * (ys[i] - meanY);
    den += (xs[i] - meanX) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;
  const lastTs = history[history.length - 1].timestamp;
  const dayMs = 24 * 60 * 60 * 1000;
  const out: Prediction[] = [];
  for (let i = 1; i <= days; i++) {
    const x = n - 1 + i;
    const price = round(intercept + slope * x);
    const d = new Date(lastTs + i * dayMs);
    out.push({ date: d.toLocaleDateString([], { month: "short", day: "numeric" }), price, timestamp: lastTs + i * dayMs });
  }
  return out;
}

export function getSignal(rsiVal: number, trend: Trend, predictionSlope: number): "Buy" | "Sell" | "Hold" {
  if (rsiVal < 35 && predictionSlope >= 0) return "Buy";
  if (rsiVal > 70 && predictionSlope <= 0) return "Sell";
  if (trend === "Bullish" && predictionSlope > 0) return "Buy";
  if (trend === "Bearish" && predictionSlope < 0) return "Sell";
  return "Hold";
}

export function getQuote(symbol: string): { price: number; change: number; changePct: number } {
  const hist = generatePriceHistory(symbol, "1M");
  if (hist.length < 2) return { price: 0, change: 0, changePct: 0 };
  const last = hist[hist.length - 1].close;
  const prev = hist[hist.length - 2].close;
  const change = round(last - prev);
  const changePct = round((change / prev) * 100);
  return { price: last, change, changePct };
}
