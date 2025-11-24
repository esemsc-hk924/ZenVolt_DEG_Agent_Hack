"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from "recharts";

type Row = { 
  month: string; 
  purchasedGoodsKg: number; 
  transportationKg: number; 
  wasteKg: number; 
  businessTravelKg: number; 
  employeeCommutingKg: number; 
};

const COLORS = [
  { fill: "url(#colorPurchased)", stroke: "#10b981" },
  { fill: "url(#colorTransport)", stroke: "#2563eb" },
  { fill: "url(#colorWaste)", stroke: "#8b5cf6" },
  { fill: "url(#colorTravel)", stroke: "#f59e0b" },
  { fill: "url(#colorCommute)", stroke: "#ec4899" },
];

export default function MonthlyStacked({ data }: { data: Row[] }) {
  return (
    <div className="h-[300px] w-full glass-ios-chart rounded-lg">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 12, left: 12 }}>
          <defs>
            <linearGradient id="colorPurchased" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="colorTransport" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="colorTravel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="colorCommute" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#ec4899" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
          <XAxis 
            dataKey="month" 
            tickMargin={10}
            className="text-xs text-muted-foreground"
            tick={{ fill: 'currentColor' }}
          />
          <YAxis 
            tickMargin={10}
            className="text-xs text-muted-foreground"
            tick={{ fill: 'currentColor' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            formatter={(v: number) => [`${Math.round(v).toLocaleString()} kg`, ""]} 
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{ paddingBottom: '8px' }}
            iconType="square"
          />
          <Bar dataKey="purchasedGoodsKg" name="Purchased Goods" stackId="a" fill={COLORS[0].fill} radius={[0, 0, 0, 0]} />
          <Bar dataKey="transportationKg" name="Transportation" stackId="a" fill={COLORS[1].fill} radius={[0, 0, 0, 0]} />
          <Bar dataKey="wasteKg" name="Waste" stackId="a" fill={COLORS[2].fill} radius={[0, 0, 0, 0]} />
          <Bar dataKey="businessTravelKg" name="Business Travel" stackId="a" fill={COLORS[3].fill} radius={[0, 0, 0, 0]} />
          <Bar dataKey="employeeCommutingKg" name="Employee Commuting" stackId="a" fill={COLORS[4].fill} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
