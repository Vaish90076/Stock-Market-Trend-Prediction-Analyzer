import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { STOCKS } from "@/lib/mockData";

interface Props {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
}

export function StockHeader({ symbol, price, change, changePct }: Props) {
  const meta = STOCKS[symbol];
  const positive = change >= 0;
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{symbol}</h1>
          <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {meta?.exchange}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{meta?.name ?? "—"}</p>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="font-mono-tabular text-3xl font-semibold tracking-tight">
          ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
        <span
          className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium font-mono-tabular ${
            positive ? "bg-bullish/10 text-bullish" : "bg-bearish/10 text-bearish"
          }`}
        >
          {positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
          {positive ? "+" : ""}
          {change.toFixed(2)} ({positive ? "+" : ""}
          {changePct.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}
