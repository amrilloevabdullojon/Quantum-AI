import { ShieldAlert } from "lucide-react";

interface RiskGaugeProps {
  currentScore: number;
  optimizedScore: number;
}

export const RiskGauge = ({ currentScore, optimizedScore }: RiskGaugeProps) => {
  const circumference = 2 * Math.PI * 42;
  const currentOffset = circumference - (currentScore / 100) * circumference;
  const optimizedOffset = circumference - (optimizedScore / 100) * circumference;

  return (
    <section className="metric-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase text-slate-500">Risk Score</span>
        <ShieldAlert size={18} strokeWidth={1.5} className="text-crimson" />
      </div>
      <div className="mt-5 flex items-center gap-5">
        <svg viewBox="0 0 100 100" className="h-32 w-32 shrink-0" aria-label="Risk Score Gauge">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#E2E8F0" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#B91C1C"
            strokeLinecap="butt"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={currentOffset}
            transform="rotate(-90 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r="31"
            fill="none"
            stroke="#059669"
            strokeLinecap="butt"
            strokeWidth="5"
            strokeDasharray={2 * Math.PI * 31}
            strokeDashoffset={optimizedOffset * (31 / 42)}
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="48" textAnchor="middle" className="fill-slate-950 font-mono text-[18px]">
            {currentScore}
          </text>
          <text x="50" y="62" textAnchor="middle" className="fill-slate-500 text-[8px]">
            /100
          </text>
        </svg>
        <div className="min-w-0">
          <div className="font-mono text-sm text-slate-950">Current: {currentScore}/100</div>
          <div className="mt-2 font-mono text-sm text-emeraldStrict">QAOA target: {optimizedScore}/100</div>
          <p className="mt-3 text-xs leading-5 text-slate-500">Projected score after applying QAOA target weights.</p>
        </div>
      </div>
    </section>
  );
};
