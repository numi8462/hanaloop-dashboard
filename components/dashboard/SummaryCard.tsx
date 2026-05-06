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
      <div className="flex items-start justify-between mb-3 h-12 min-w-0">
        <div className="min-w-0 flex-1 mr-2">
          <p className="text-sm font-semibold text-slate-100 truncate">
            {label}
          </p>
          {scope && (
            <span className="text-xs font-medium inline-flex items-center justify-center text-slate-300">
              {scope}
            </span>
          )}
        </div>
        <div
          className={`rounded-xl flex items-center justify-center w-10 h-10 shrink-0 ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
      </div>

      {/* 수치 */}
      <div className="flex items-baseline gap-1.5 min-w-0">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-100 truncate">
          {value}
        </span>
        <span className="text-xs lg:text-sm font-medium text-slate-300 shrink-0">
          {unit}
        </span>
      </div>

      {/* 비율 */}
      {percentage != null && percentage > 0 && (
        <p className="text-xs mt-2 text-slate-300">
          전체의{" "}
          <span className={`font-semibold ${iconColor}`}>{percentage}%</span>
        </p>
      )}
    </div>
  );
}
