"use client";

import { useId } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Point = { date: string; savedKg: number };

export default function EmissionsArea({
  data,
  height = 256,
}: {
  data: Point[];
  height?: number;
}) {
  const id = useId();
  const gradientId = `areaGradient-${id}`;
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className="w-full text-emerald-600 dark:text-emerald-400" style={{ height }}>
      {hasData ? (
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.35} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="savedKg"
              stroke="currentColor"
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full w-full grid place-items-center text-sm text-muted-foreground">
          No emissions data yet.
        </div>
      )}
    </div>
  );
}
