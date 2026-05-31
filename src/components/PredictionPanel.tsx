import { ArrowDown, ArrowUp, Sparkles } from "lucide-react";
import { Prediction } from "@/lib/mockData";

interface Props {
  predictions: Prediction[];
  currentPrice: number;
  signal: "Buy" | "Sell" | "Hold";
}

const signalStyle = {
  Buy: "bg-bullish text-bullish-foreground",
  Sell: "bg-bearish text-bearish-foreground",
  Hold: "bg-neutral text-neutral-foreground",
};

export function PredictionPanel({ predictions, currentPrice, signal }: Props) {
  if (!predictions.length) return null;
  const last = predictions[predictions.length - 1].price;
  const uptrend = last >= currentPrice;
  const totalChange = ((last - currentPrice) / currentPrice) * 100;

  return (
    <div className="rounded-xl border border-border bg-gradient-card p-5 shadow-elegant">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Prediction Analyzer</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Forecast for the next 5 trading days</p>
        </div>
        <span className={`rounded-md px-3 py-1.5 text-sm font-bold tracking-wide ${signalStyle[signal]}`}>
          {signal.toUpperCase()}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium ${
            uptrend ? "bg-bullish/10 text-bullish" : "bg-bearish/10 text-bearish"
          }`}
        >
          {uptrend ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          Next Trend: {uptrend ? "Uptrend" : "Downtrend"}
        </div>
        <span className="font-mono-tabular text-xs text-muted-foreground">
          Projected change: {totalChange >= 0 ? "+" : ""}
          {totalChange.toFixed(2)}%
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {predictions.map((p) => {
          const up = p.price >= currentPrice;
          return (
            <div key={p.timestamp} className="rounded-lg border border-border/60 bg-secondary/40 p-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{p.date}</div>
              <div className="mt-1 font-mono-tabular text-base font-semibold">${p.price.toFixed(2)}</div>
              <div className={`mt-1 text-[11px] font-medium ${up ? "text-bullish" : "text-bearish"}`}>
                {up ? "▲" : "▼"} {(((p.price - currentPrice) / currentPrice) * 100).toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
