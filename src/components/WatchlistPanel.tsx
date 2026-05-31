import { Plus, Star, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STOCKS } from "@/lib/mockData";
import { useQuote } from "@/hooks/useQuote";

interface Props {
  symbols: string[];
  current: string;
  onSelect: (s: string) => void;
  onRemove: (s: string) => void;
  onAdd: (s: string) => void;
}

function WatchlistRow({
  sym,
  active,
  onSelect,
  onRemove,
}: {
  sym: string;
  active: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const meta = STOCKS[sym];
  const q = useQuote(sym);
  const positive = q.change >= 0;
  return (
    <div
      className={`group flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-accent/40 ${
        active ? "bg-accent/30" : ""
      }`}
    >
      <button onClick={onSelect} className="flex flex-1 items-center justify-between text-left">
        <div className="min-w-0">
          <div className="text-sm font-semibold">{sym}</div>
          <div className="line-clamp-1 text-[11px] text-muted-foreground">{meta?.name ?? sym}</div>
        </div>
        <div className="text-right">
          {q.loading ? (
            <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin text-muted-foreground" />
          ) : (
            <>
              <div className="font-mono-tabular text-sm font-medium">
                ${q.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`font-mono-tabular text-[11px] ${positive ? "text-bullish" : "text-bearish"}`}>
                {positive ? "+" : ""}
                {q.changePct.toFixed(2)}%
              </div>
            </>
          )}
        </div>
      </button>
      <button
        onClick={onRemove}
        className="rounded-md p-1 text-muted-foreground opacity-0 transition hover:bg-secondary hover:text-foreground group-hover:opacity-100"
        aria-label={`Remove ${sym}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function WatchlistPanel({ symbols, current, onSelect, onRemove, onAdd }: Props) {
  const inWatchlist = symbols.includes(current);
  return (
    <div className="rounded-xl border border-border bg-gradient-card shadow-elegant">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">Watchlist</h3>
        </div>
        {!inWatchlist && current && (
          <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => onAdd(current)}>
            <Plus className="h-3.5 w-3.5" />
            Add {current}
          </Button>
        )}
      </div>
      <div className="divide-y divide-border">
        {symbols.length === 0 && (
          <div className="px-4 py-8 text-center text-xs text-muted-foreground">
            No stocks yet. Add one to start tracking.
          </div>
        )}
        {symbols.map((sym) => (
          <WatchlistRow
            key={sym}
            sym={sym}
            active={sym === current}
            onSelect={() => onSelect(sym)}
            onRemove={() => onRemove(sym)}
          />
        ))}
      </div>
    </div>
  );
}
