interface ProgressBarProps {
  value: number;
  tone?: "navy" | "success" | "danger";
}

const toneClassName = {
  navy: "bg-navy",
  success: "bg-emeraldStrict",
  danger: "bg-crimson"
};

export const ProgressBar = ({ value, tone = "navy" }: ProgressBarProps) => (
  <div className="h-2 w-full overflow-hidden border border-slate-200 bg-slate-100">
    <div className={`h-full ${toneClassName[tone]}`} style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
  </div>
);
