import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { PortfolioAsset } from "../../domain/portfolio/types";
import { formatCurrencyPrecise, formatNeutralPct } from "../formatters";

const colors = ["#1E3A8A", "#0F766E", "#B91C1C", "#92400E", "#4B5563", "#059669"];

interface AllocationChartProps {
  assets: PortfolioAsset[];
}

export const AllocationChart = ({ assets }: AllocationChartProps) => {
  const data = assets.map((asset) => ({
    name: asset.symbol,
    value: asset.currentWeightPct,
    notional: asset.amount * asset.priceUsd
  }));

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Asset Allocation</h2>
        <span>Current Weights</span>
      </div>
      <div className="h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={72} outerRadius={104} stroke="#FFFFFF" strokeWidth={2}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [
                `${formatNeutralPct(Number(value))} / ${formatCurrencyPrecise(props.payload.notional)}`,
                name
              ]}
              contentStyle={{ border: "1px solid #E2E8F0", borderRadius: 0, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {assets.map((asset, index) => (
          <div key={asset.symbol} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5" style={{ backgroundColor: colors[index % colors.length] }} />
            <span className="font-mono text-slate-700">{asset.symbol}</span>
            <span className="ml-auto font-mono text-slate-500">{asset.currentWeightPct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </section>
  );
};
