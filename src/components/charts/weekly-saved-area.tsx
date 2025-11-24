"use client";

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  CartesianGrid, Line
} from "recharts";

type Pt = {
  week: string;
  purchasedGoodsKg: number;
  transportationKg: number;
  wasteKg: number;
  businessTravelKg: number;
  employeeCommutingKg: number;
  savedKg: number;
  required?: number; // constant line (required weekly to hit 2030)
};

export default function WeeklySavedArea({ data }: { data: Pt[] }) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="gPurchased" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gTransport" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.24} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gWaste" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.24} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gTravel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.24} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gCommuting" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.24} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="week" tickMargin={8} />
          <YAxis tickMargin={8} />
          <Tooltip
            formatter={(v: number, n) =>
              n === "required" ? [`${Math.round(v).toLocaleString()} kg`, "Required (2030 path)"]
                               : [`${Math.round(v).toLocaleString()} kg`, n as string]
            }
          />
          <Legend verticalAlign="top" height={24} />
          <Area type="monotone" dataKey="purchasedGoodsKg" name="Purchased Goods" stroke="#10b981" fill="url(#gPurchased)" />
          <Area type="monotone" dataKey="transportationKg" name="Transportation" stroke="#2563eb" fill="url(#gTransport)" />
          <Area type="monotone" dataKey="wasteKg" name="Waste" stroke="#8b5cf6" fill="url(#gWaste)" />
          <Area type="monotone" dataKey="businessTravelKg" name="Business Travel" stroke="#f59e0b" fill="url(#gTravel)" />
          <Area type="monotone" dataKey="employeeCommutingKg" name="Employee Commuting" stroke="#ec4899" fill="url(#gCommuting)" />
          <Line type="monotone" dataKey="required" name="Required (2030 path)" stroke="#f59e0b" strokeDasharray="5 4" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
