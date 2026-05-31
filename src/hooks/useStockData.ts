import { useEffect, useState } from "react";
import {
  TimeRange,
  PricePoint,
  detectTrend,
  getSignal,
  macd,
  predictNextDays,
  rsi,
  Trend,
  Prediction,
} from "@/lib/mockData";
import { fetchHistory } from "@/lib/stockApi";

export interface StockData {
  history: PricePoint[];
  last: number;
  change: number;
  changePct: number;
  rsi: number;
  macd: { macd: number; signal: number; histogram: number; label: "Bullish" | "Bearish" | "Neutral" };
  trend: Trend;
  predictions: Prediction[];
  signal: "Buy" | "Sell" | "Hold";
  loading: boolean;
  error: string | null;
}

const empty: StockData = {
  history: [],
  last: 0,
  change: 0,
  changePct: 0,
  rsi: 50,
  macd: { macd: 0, signal: 0, histogram: 0, label: "Neutral" },
  trend: "Sideways",
  predictions: [],
  signal: "Hold",
  loading: true,
  error: null,
};

function compute(history: PricePoint[]): Omit<StockData, "loading" | "error"> {
  const closes = history.map((p) => p.close);
  const last = history[history.length - 1]?.close ?? 0;
  const prev = history[history.length - 2]?.close ?? last;
  const change = +(last - prev).toFixed(2);
  const changePct = prev ? +(((last - prev) / prev) * 100).toFixed(2) : 0;
  const rsiVal = +rsi(closes).toFixed(2);
  const macdVal = macd(closes);
  const trend = detectTrend(closes);
  const predictions = predictNextDays(history, 5);
  const slope = predictions.length ? predictions[predictions.length - 1].price - last : 0;
  const signal = getSignal(rsiVal, trend, slope);
  return { history, last, change, changePct, rsi: rsiVal, macd: macdVal, trend, predictions, signal };
}

export function useStockData(symbol: string, range: TimeRange): StockData {
  const [state, setState] = useState<StockData>(empty);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchHistory(symbol, range)
      .then((history) => {
        if (cancelled) return;
        if (!history.length) {
          setState({ ...empty, loading: false, error: "No data found for this symbol." });
          return;
        }
        setState({ ...compute(history), loading: false, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({ ...empty, loading: false, error: err?.message || "Failed to load data" });
      });
    return () => {
      cancelled = true;
    };
  }, [symbol, range]);

  return state;
}
