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
  monthlyChange?: number | null;
  peakMonth?: string | null;
  period?: string | null;
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
  monthlyChange,
  peakMonth,
  period,
}: SummaryCardProps) {
  return (
    <div className="card p-5">
      {/* 상단: 라벨 + 아이콘 */}
      <div className="flex items-start justify-between mb-3 h-12 min-w-0">
        <div className="min-w-0 flex-1 mr-2">
          <p className="text-sm font-medium text-[#64748d] truncate">{label}</p>
          {scope && (
            <span className="text-xs inline-flex items-center justify-center text-[#94a3b8]">
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
        <span className="tnum text-2xl lg:text-3xl font-semibold tracking-tight text-[#0d253d] truncate" style={{ letterSpacing: "-0.64px" }}>
          {value}
        </span>
        <span className="text-xs lg:text-sm font-medium text-[#64748d] shrink-0">
          {unit}
        </span>
      </div>

      {/* 비율 */}
      {percentage != null && percentage > 0 && (
        <p className="text-xs mt-2 text-[#64748d]">
          전체의{" "}
          <span className={`font-semibold ${iconColor}`}>{percentage}%</span>
        </p>
      )}

      {/* 전월 대비 증감 */}
      {monthlyChange !== null && monthlyChange !== undefined && (
        <p className="text-xs mt-1">
          {monthlyChange >= 0 ? (
            <span className="text-red-500">
              전월 대비 ▲ {Math.abs(monthlyChange).toFixed(1)}% 증가
            </span>
          ) : (
            <span className="text-emerald-600">
              전월 대비 ▼ {Math.abs(monthlyChange).toFixed(1)}% 감소
            </span>
          )}
        </p>
      )}

      {/* 피크월 */}
      {peakMonth && (
        <p className="text-xs mt-1 text-[#94a3b8]">
          피크: <span className="text-[#64748d]">{peakMonth}</span>
        </p>
      )}

      {/* 데이터 기간 */}
      {period && <p className="text-xs mt-1 text-[#94a3b8]">{period}</p>}
    </div>
  );
}
