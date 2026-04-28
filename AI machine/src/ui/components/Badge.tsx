import type { ReactNode } from "react";

type BadgeTone = "neutral" | "success" | "danger" | "warning" | "navy";

const toneClassName: Record<BadgeTone, string> = {
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  navy: "border-blue-200 bg-blue-50 text-blue-900"
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
}

export const Badge = ({ children, tone = "neutral" }: BadgeProps) => (
  <span className={`inline-flex items-center border px-2 py-1 text-[11px] font-medium uppercase tracking-normal ${toneClassName[tone]}`}>
    {children}
  </span>
);
