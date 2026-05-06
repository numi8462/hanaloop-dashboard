import { ReactNode } from "react";

interface SummaryCardProps {
  label: string;
  value: string;
  unit: string;
  icon: ReactNode;
  iconColor: string;
  iconBg: string;
  percentage?: number;
  scope?: string;
}

export default function SummaryCard({
  label,
  value,
  unit,
  icon,
  iconColor,
  iconBg,
  percentage,
  scope,
}: SummaryCardProps) {
  return (
    <div className="card p-5">
      {/* 상단: 라벨 + 아이콘 */}
      <div className="flex items-start justify-between mb-3 h-12">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          {scope && (
            <span
              className={`text-xs px-1.5 py-1 rounded-2xl font-medium mt-1 inline-flex items-center justify-center ${
                scope === "스코프 2" ? "badge-scope2" : "badge-scope3"
              }`}
            >
              {scope}
            </span>
          )}
        </div>
        <div
          className={`rounded-xl flex items-center justify-center w-10.5 h-10.5 ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>

      {/* 수치 */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        <span className="text-sm font-medium text-slate-400">{unit}</span>
      </div>

      {/* 비율 */}
      {percentage != null && percentage > 0 && (
        <p className="text-xs mt-2 text-slate-400">
          전체의{" "}
          <span className={`font-semibold ${iconColor}`}>{percentage}%</span>
        </p>
      )}
    </div>
  );
}
