import { useEffect, useState } from "react";
import { fetchHistory } from "@/lib/stockApi";

export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  loading: boolean;
}

export function useQuote(symbol: string): Quote {
  const [q, setQ] = useState<Quote>({ symbol, price: 0, change: 0, changePct: 0, loading: true });

  useEffect(() => {
    let cancelled = false;
    setQ((prev) => ({ ...prev, symbol, loading: true }));
    // Use 5d at 1d interval — small payload, gives us last close + previous close
    fetchHistory(symbol, "1W").then((hist) => {
      if (cancelled) return;
      // Use daily granularity by sampling the last 2 distinct daily closes
      const daily = hist.length >= 2 ? hist : [];
      const last = daily[daily.length - 1]?.close ?? 0;
      const prev = daily[daily.length - 2]?.close ?? last;
      const change = +(last - prev).toFixed(2);
      const changePct = prev ? +(((last - prev) / prev) * 100).toFixed(2) : 0;
      setQ({ symbol, price: last, change, changePct, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  return q;
}
