"use client";

import { LabelList, Pie, PieChart, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function CreditsDonut({ verified, unverified }: { verified: number; unverified: number; }) {
  const chartConfig = {
    value: {
      label: "Credits",
    },
    verified: {
      label: "Internal Credits (Verified)",
      color: "hsl(142, 71%, 45%)", // emerald-600
    },
    pending: {
      label: "Internal Credits (Pending)",
      color: "hsl(43, 96%, 56%)", // amber-500
    },
  } satisfies ChartConfig;

  const chartData = [
    { 
      name: "verified", 
      label: "Internal Credits (Verified)", 
      value: verified, 
      fill: "var(--color-verified)",
    },
    { 
      name: "pending", 
      label: "Internal Credits (Pending)", 
      value: unverified, 
      fill: "var(--color-pending)",
    },
  ];

  // Sort the data by value in ascending order (smallest to largest) for better visual hierarchy
  const sortedChartData = [...chartData].sort((a, b) => a.value - b.value);

  // Configure the size increase between each pie ring
  const BASE_RADIUS = 50; // Starting radius for the smallest pie
  const SIZE_INCREMENT = 10; // How much to increase radius for each subsequent pie
  const INNER_RADIUS = 30; // Inner radius for donut effect

  // Calculate total for angle calculations
  const total = sortedChartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="h-[280px] w-full relative glass-ios-chart rounded-lg flex flex-col">
      <ChartContainer
        config={chartConfig}
        className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[200px] flex-1"
      >
        <PieChart>
          <ChartTooltip
            content={<ChartTooltipContent nameKey="value" hideLabel />}
          />
          {sortedChartData.map((entry, index) => {
            const itemConfig = chartConfig[entry.name as keyof typeof chartConfig];
            const fillColor = (itemConfig && 'color' in itemConfig ? itemConfig.color : undefined) || entry.fill;
            
            return (
              <Pie
                key={`pie-${index}`}
                data={[entry]}
                innerRadius={INNER_RADIUS}
                outerRadius={BASE_RADIUS + index * SIZE_INCREMENT}
                dataKey="value"
                cornerRadius={4}
                startAngle={
                  // Calculate the percentage of total up to current index
                  (sortedChartData
                    .slice(0, index)
                    .reduce((sum, d) => sum + d.value, 0) /
                    total) *
                  360
                }
                endAngle={
                  // Calculate the percentage of total up to and including current index
                  (sortedChartData
                    .slice(0, index + 1)
                    .reduce((sum, d) => sum + d.value, 0) /
                    total) *
                  360
                }
              >
                <Cell fill={fillColor} />
              </Pie>
            );
          })}
        </PieChart>
      </ChartContainer>
      <div className="absolute bottom-0 left-0 right-0 pb-2 flex items-center justify-center gap-4">
        {chartData.map((item) => {
          const itemConfig = chartConfig[item.name as keyof typeof chartConfig];
          const color = (itemConfig && 'color' in itemConfig ? itemConfig.color : undefined) || item.fill;
          return (
            <div key={item.name} className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: color,
                }}
              />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
