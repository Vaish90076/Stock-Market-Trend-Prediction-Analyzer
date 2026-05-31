import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SearchBar } from "@/components/SearchBar";
import { StockHeader } from "@/components/StockHeader";
import { StockChart } from "@/components/StockChart";
import { TimeRangeTabs } from "@/components/TimeRangeTabs";
import { IndicatorToggles } from "@/components/IndicatorToggles";
import { IndicatorsPanel } from "@/components/IndicatorsPanel";
import { PredictionPanel } from "@/components/PredictionPanel";
import { WatchlistPanel } from "@/components/WatchlistPanel";
import { useStockData } from "@/hooks/useStockData";
import { TimeRange } from "@/lib/mockData";

const Index = () => {
  const [symbol, setSymbol] = useState("AAPL");
  const [range, setRange] = useState<TimeRange>("1M");
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(false);
  const [showForecast, setShowForecast] = useState(true);
  const [watchlist, setWatchlist] = useState<string[]>(["AAPL", "TSLA", "NVDA", "MSFT"]);

  const data = useStockData(symbol, range);

  const addToWatchlist = (s: string) => setWatchlist((w) => (w.includes(s) ? w : [...w, s]));
  const removeFromWatchlist = (s: string) => setWatchlist((w) => w.filter((x) => x !== s));

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full bg-background">
        <div className="pointer-events-none absolute inset-0 bg-gradient-glow" />
        <AppSidebar />
        <div className="relative flex flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md">
            <SidebarTrigger className="-ml-1" />
            <SearchBar value={symbol} onSelect={setSymbol} />
            <div className="ml-auto hidden items-center gap-2 text-xs text-muted-foreground md:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bullish opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-bullish" />
              </span>
              Live market data
            </div>
          </header>

          <main className="relative flex-1 px-4 py-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
              {data.error && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {data.error}
                </div>
              )}
              <StockHeader
                symbol={symbol}
                price={data.last}
                change={data.change}
                changePct={data.changePct}
              />
              {data.loading && (
                <div className="text-xs text-muted-foreground">Loading live market data…</div>
              )}

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* Watchlist — shown first on mobile, on the right on xl+ */}
                <div className="space-y-6 xl:order-2 xl:col-span-1">
                  <WatchlistPanel
                    symbols={watchlist}
                    current={symbol}
                    onSelect={setSymbol}
                    onRemove={removeFromWatchlist}
                    onAdd={addToWatchlist}
                  />
                </div>

                {/* Chart + indicators */}
                <div className="space-y-6 xl:order-1 xl:col-span-2">
                  <div className="rounded-xl border border-border bg-gradient-card p-5 shadow-elegant">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold uppercase tracking-wider">Price Chart</h2>
                        <button
                          onClick={() => setShowForecast((v) => !v)}
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors ${
                            showForecast
                              ? "border-primary/40 bg-primary/10 text-primary"
                              : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Forecast
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <IndicatorToggles
                          showSMA={showSMA}
                          showEMA={showEMA}
                          onToggleSMA={() => setShowSMA((v) => !v)}
                          onToggleEMA={() => setShowEMA((v) => !v)}
                        />
                        <TimeRangeTabs value={range} onChange={setRange} />
                      </div>
                    </div>
                    <StockChart
                      data={data.history}
                      predictions={showForecast ? data.predictions : []}
                      showSMA={showSMA}
                      showEMA={showEMA}
                    />
                  </div>

                  <IndicatorsPanel
                    rsi={data.rsi}
                    macdLabel={data.macd.label}
                    macdValue={data.macd.histogram}
                    trend={data.trend}
                  />

                  <PredictionPanel
                    predictions={data.predictions}
                    currentPrice={data.last}
                    signal={data.signal}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
