import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PricePoint, Prediction, ema, sma } from "@/lib/mockData";

interface Props {
  data: PricePoint[];
  predictions?: Prediction[];
  showSMA: boolean;
  showEMA: boolean;
}

export function StockChart({ data, predictions = [], showSMA, showEMA }: Props) {
  const chartData = useMemo(() => {
    const closes = data.map((d) => d.close);
    const smaVals = sma(closes, 20);
    const emaVals = ema(closes, 12);
    const base = data.map((d, i) => ({
      date: d.date,
      price: d.close,
      sma: smaVals[i],
      ema: emaVals[i],
      prediction: null as number | null,
    }));
    if (predictions.length && base.length) {
      // Bridge: last actual point becomes start of prediction line
      base[base.length - 1].prediction = base[base.length - 1].price;
      predictions.forEach((p) => {
        base.push({
          date: p.date,
          price: null as unknown as number,
          sma: null,
          ema: null,
          prediction: p.price,
        });
      });
    }
    return base;
  }, [data, predictions]);

  const positive = data.length >= 2 && data[data.length - 1].close >= data[0].close;
  const stroke = positive ? "hsl(var(--bullish))" : "hsl(var(--bearish))";
  const fillId = positive ? "fillBullish" : "fillBearish";

  return (
    <ResponsiveContainer width="100%" height={380}>
      <ComposedChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="fillBullish" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--bullish))" stopOpacity={0.4} />
            <stop offset="100%" stopColor="hsl(var(--bullish))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fillBearish" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--bearish))" stopOpacity={0.4} />
            <stop offset="100%" stopColor="hsl(var(--bearish))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="hsl(var(--chart-grid))" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: "hsl(var(--chart-axis))", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          minTickGap={32}
        />
        <YAxis
          tick={{ fill: "hsl(var(--chart-axis))", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          domain={["auto", "auto"]}
          tickFormatter={(v) => `$${Number(v).toFixed(0)}`}
          width={56}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "hsl(var(--muted-foreground))" }}
          formatter={(v: number | null, name) => [v === null ? "—" : `$${Number(v).toFixed(2)}`, name]}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke={stroke}
          strokeWidth={2}
          fill={`url(#${fillId})`}
          name="Price"
          isAnimationActive={false}
          connectNulls={false}
        />
        {showSMA && (
          <Line
            type="monotone"
            dataKey="sma"
            stroke="hsl(var(--neutral))"
            strokeWidth={1.5}
            dot={false}
            name="SMA(20)"
            isAnimationActive={false}
            connectNulls
          />
        )}
        {showEMA && (
          <Line
            type="monotone"
            dataKey="ema"
            stroke="hsl(217 91% 65%)"
            strokeWidth={1.5}
            dot={false}
            name="EMA(12)"
            isAnimationActive={false}
            connectNulls
          />
        )}
        {predictions.length > 0 && (
          <Line
            type="monotone"
            dataKey="prediction"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, fill: "hsl(var(--primary))" }}
            name="Forecast"
            isAnimationActive={false}
            connectNulls
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
