interface Props {
  showSMA: boolean;
  showEMA: boolean;
  onToggleSMA: () => void;
  onToggleEMA: () => void;
}

export function IndicatorToggles({ showSMA, showEMA, onToggleSMA, onToggleEMA }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleSMA}
        className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
          showSMA ? "border-neutral/40 bg-neutral/10 text-neutral" : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
        }`}
      >
        <span className="h-0.5 w-3 rounded-full bg-neutral" />
        SMA(20)
      </button>
      <button
        onClick={onToggleEMA}
        className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
          showEMA ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
        }`}
      >
        <span className="h-0.5 w-3 rounded-full bg-primary" />
        EMA(12)
      </button>
    </div>
  );
}
