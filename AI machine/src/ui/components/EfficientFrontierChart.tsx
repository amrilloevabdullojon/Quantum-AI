import { CartesianGrid, Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { FrontierPoint } from "../../domain/portfolio/types";

interface EfficientFrontierChartProps {
  data: FrontierPoint[];
  targetVolatilityPct: number;
}

export const EfficientFrontierChart = ({ data, targetVolatilityPct }: EfficientFrontierChartProps) => {
  if (data.length === 0) {
    return (
      <section className="panel">
        <div className="panel-header">
          <h2>Efficient Frontier</h2>
          <span>QUBO Target</span>
        </div>
        <div className="empty-state">No frontier data available.</div>
      </section>
    );
  }

  const target = data.reduce((closest, point) =>
    Math.abs(point.volatilityPct - targetVolatilityPct) < Math.abs(closest.volatilityPct - targetVolatilityPct) ? point : closest
  );

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Efficient Frontier</h2>
        <span>QUBO Target</span>
      </div>
      <div className="h-72">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 16, right: 24, bottom: 8, left: 8 }}>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" />
            <XAxis
              dataKey="volatilityPct"
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickLine={false}
              axisLine={{ stroke: "#CBD5E1" }}
              unit="%"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickLine={false}
              axisLine={{ stroke: "#CBD5E1" }}
              unit="%"
            />
            <Tooltip contentStyle={{ border: "1px solid #E2E8F0", borderRadius: 0, fontSize: 12 }} />
            <Line type="monotone" dataKey="expectedReturnPct" stroke="#1E3A8A" strokeWidth={2} dot={{ r: 3 }} />
            <ReferenceDot
              x={target.volatilityPct}
              y={target.expectedReturnPct}
              r={5}
              fill="#059669"
              stroke="#FFFFFF"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
