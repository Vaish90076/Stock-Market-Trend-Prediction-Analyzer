import { Activity, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Trend } from "@/lib/mockData";

interface Props {
  rsi: number;
  macdLabel: "Bullish" | "Bearish" | "Neutral";
  macdValue: number;
  trend: Trend;
}

function rsiColor(v: number) {
  if (v >= 70) return "text-bearish";
  if (v <= 30) return "text-bullish";
  return "text-neutral";
}

function rsiLabel(v: number) {
  if (v >= 70) return "Overbought";
  if (v <= 30) return "Oversold";
  return "Neutral";
}

const trendStyle: Record<Trend, { cls: string; Icon: typeof TrendingUp }> = {
  Bullish: { cls: "bg-bullish/10 text-bullish", Icon: TrendingUp },
  Bearish: { cls: "bg-bearish/10 text-bearish", Icon: TrendingDown },
  Sideways: { cls: "bg-neutral/10 text-neutral", Icon: Minus },
};

const macdStyle = {
  Bullish: "bg-bullish/10 text-bullish",
  Bearish: "bg-bearish/10 text-bearish",
  Neutral: "bg-neutral/10 text-neutral",
};

export function IndicatorsPanel({ rsi, macdLabel, macdValue, trend }: Props) {
  const T = trendStyle[trend];
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {/* RSI */}
      <div className="rounded-xl border border-border bg-gradient-card p-4 shadow-elegant">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">RSI (14)</span>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`font-mono-tabular text-2xl font-semibold ${rsiColor(rsi)}`}>{rsi.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">{rsiLabel(rsi)}</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full ${rsi >= 70 ? "bg-bearish" : rsi <= 30 ? "bg-bullish" : "bg-neutral"}`}
            style={{ width: `${Math.min(100, Math.max(0, rsi))}%` }}
          />
        </div>
      </div>

      {/* MACD */}
      <div className="rounded-xl border border-border bg-gradient-card p-4 shadow-elegant">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">MACD</span>
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${macdStyle[macdLabel]}`}>{macdLabel}</span>
        </div>
        <div className="mt-3">
          <span className="font-mono-tabular text-2xl font-semibold">{macdValue.toFixed(2)}</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Histogram momentum signal</p>
      </div>

      {/* Trend */}
      <div className="rounded-xl border border-border bg-gradient-card p-4 shadow-elegant">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Trend</span>
          <T.Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-semibold ${T.cls}`}>
            <T.Icon className="h-4 w-4" />
            {trend}
          </span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Based on 20-period direction</p>
      </div>
    </div>
  );
}
