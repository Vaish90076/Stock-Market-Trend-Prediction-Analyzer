import { useEffect, useMemo, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { STOCKS } from "@/lib/mockData";
import { searchSymbols, QuoteSuggestion } from "@/lib/stockApi";

interface Props {
  value: string;
  onSelect: (symbol: string) => void;
}

export function SearchBar({ value, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [remote, setRemote] = useState<QuoteSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Curated list shown when input is empty
  const curated = useMemo<QuoteSuggestion[]>(
    () =>
      Object.values(STOCKS)
        .slice(0, 8)
        .map((s) => ({ symbol: s.symbol, name: s.name, exchange: s.exchange, type: "EQUITY" })),
    []
  );

  // Debounced remote search
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setRemote([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      const results = await searchSymbols(q);
      setRemote(results);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const list: QuoteSuggestion[] = query.trim()
    ? remote.length
      ? remote
      : // Local fallback while remote is loading or empty
        Object.values(STOCKS)
          .filter(
            (s) =>
              s.symbol.toUpperCase().includes(query.toUpperCase()) ||
              s.name.toUpperCase().includes(query.toUpperCase())
          )
          .map((s) => ({ symbol: s.symbol, name: s.name, exchange: s.exchange, type: "EQUITY" }))
    : curated;

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              const first = list[0];
              if (first) {
                onSelect(first.symbol);
                setQuery("");
                setOpen(false);
              } else {
                onSelect(query.trim().toUpperCase());
                setQuery("");
                setOpen(false);
              }
            }
          }}
          placeholder={`Search any stock, ETF or crypto (e.g. ${value})`}
          className="h-10 pl-9 pr-9 bg-secondary/60 border-border/60 focus-visible:ring-primary/40"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>
      {open && list.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[60vh] overflow-y-auto rounded-lg border border-border bg-popover shadow-elegant">
          {list.map((s) => (
            <button
              key={s.symbol}
              onMouseDown={() => {
                onSelect(s.symbol);
                setQuery("");
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent"
            >
              <div className="min-w-0">
                <div className="font-medium text-foreground">{s.symbol}</div>
                <div className="truncate text-xs text-muted-foreground">{s.name}</div>
              </div>
              <span className="ml-2 shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground">
                {s.exchange || s.type}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
