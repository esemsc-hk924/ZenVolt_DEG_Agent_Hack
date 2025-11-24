"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CarbonIntensityData } from "@/lib/grid/carbon-intensity";

interface TimelineForecastProps {
  forecast: CarbonIntensityData[];
  workloadSpikes?: Array<{ time: string; intensity: number }>;
}

export default function TimelineForecast({ forecast, workloadSpikes }: TimelineForecastProps) {
  // Transform forecast data for chart
  const chartData = forecast.slice(0, 12).map((item, index) => {
    const time = new Date(item.from);
    return {
      time: time.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      hour: time.getHours(),
      londonCarbon: item.intensity.forecast + Math.random() * 100 - 50, // Simulate London (higher)
      scotlandCarbon: item.intensity.forecast * 0.3, // Scotland is lower
      price: 0.05 + (item.intensity.forecast / 500) * 0.1, // Price correlates with carbon
      workloadSpike: workloadSpikes?.find((s) => {
        const spikeTime = new Date(s.time);
        return spikeTime.getHours() === time.getHours();
      })?.intensity || 0,
    };
  });

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-sm font-medium mb-4">Timeline + Forecast</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorLondon" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorScotland" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="time"
              className="text-xs"
              tick={{ fill: "currentColor" }}
              stroke="currentColor"
            />
            <YAxis
              yAxisId="carbon"
              className="text-xs"
              tick={{ fill: "currentColor" }}
              stroke="currentColor"
              label={{ value: "Carbon (g/kWh)", angle: -90, position: "insideLeft" }}
            />
            <YAxis
              yAxisId="price"
              orientation="right"
              className="text-xs"
              tick={{ fill: "currentColor" }}
              stroke="currentColor"
              label={{ value: "Price (£/kWh)", angle: 90, position: "insideRight" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Area
              yAxisId="carbon"
              type="monotone"
              dataKey="londonCarbon"
              stroke="#ef4444"
              fillOpacity={1}
              fill="url(#colorLondon)"
              name="London Carbon"
            />
            <Area
              yAxisId="carbon"
              type="monotone"
              dataKey="scotlandCarbon"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorScotland)"
              name="Scotland Carbon"
            />
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="price"
              stroke="#eab308"
              strokeWidth={2}
              dot={false}
              name="Energy Price"
            />
            {workloadSpikes && workloadSpikes.length > 0 && (
              <Line
                yAxisId="carbon"
                type="monotone"
                dataKey="workloadSpike"
                stroke="#8b5cf6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#8b5cf6", r: 4 }}
                name="Workload Spike"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-4">
          Forecast shows carbon intensity and energy price trends. Workload spikes indicate
          expected compute demand surges.
        </p>
      </CardContent>
    </Card>
  );
}

