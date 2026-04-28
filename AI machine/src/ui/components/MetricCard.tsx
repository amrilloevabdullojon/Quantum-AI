import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  detail?: string;
  trend?: ReactNode;
  tone?: "default" | "danger" | "success";
}

const toneClassName = {
  default: "text-slate-950",
  danger: "text-crimson",
  success: "text-emeraldStrict"
};

export const MetricCard = ({ label, value, detail, trend, tone = "default" }: MetricCardProps) => (
  <section className="metric-card">
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs font-medium uppercase text-slate-500">{label}</span>
      {trend}
    </div>
    <div className={`mt-3 font-mono text-2xl ${toneClassName[tone]}`}>{value}</div>
    {detail ? <p className="mt-2 text-xs text-slate-500">{detail}</p> : null}
  </section>
);
