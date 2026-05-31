import { TimeRange } from "@/lib/mockData";

const RANGES: TimeRange[] = ["1D", "1W", "1M", "1Y"];

interface Props {
  value: TimeRange;
  onChange: (v: TimeRange) => void;
}

export function TimeRangeTabs({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-secondary/50 p-1">
      {RANGES.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`min-w-[44px] rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            value === r ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
