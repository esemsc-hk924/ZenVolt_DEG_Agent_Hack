"use client";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export function IdlingAndEvents({ series }: { series: { tripId: string; idle_minutes: number; event_count: number }[] }) {
  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={series} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tripId" />
          <YAxis yAxisId="left" label={{ value: "Idle (min)", angle: -90, position: "insideLeft" }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: "Events", angle: 90, position: "insideRight" }} />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="idle_minutes" name="Idle (min)" />
          <Line yAxisId="right" type="monotone" dataKey="event_count" name="Events" strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
