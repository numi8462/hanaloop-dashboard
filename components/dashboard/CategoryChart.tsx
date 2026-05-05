"use client";

import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CategorySummary } from "@/types";
import CategoryChartSkeleton from "./CategoryChartSkeleton";
import { COLORS } from "@/constants/chart";

// ─── 툴팁 타입 ────────────────────────────────────────────────────────────────
interface TooltipPayloadItem {
  payload: CategorySummary & { name: string; value: number };
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

interface LegendPayloadItem {
  value: string;
  color: string;
}

interface CustomLegendProps {
  payload?: LegendPayloadItem[];
}

// ─── 커스텀 툴팁 ──────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-md text-sm">
      <p className="font-semibold text-slate-900 mb-1">{data.type}</p>
      <p className="text-slate-500">
        {data.totalCo2e.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}{" "}
        kgCO₂e
      </p>
      <p className="text-slate-400">{data.percentage}%</p>
    </div>
  );
}

// ─── 커스텀 레전드 ────────────────────────────────────────────────────────────
function CustomLegend({ payload }: CustomLegendProps) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {payload?.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <div
            className="rounded-full w-2 h-2"
            style={{ background: entry.color }}
          />
          <span className="text-xs text-slate-500">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

interface CategoryChartProps {
  byCategory: CategorySummary[];
  isLoading: boolean;
}

export default function CategoryChart({
  byCategory,
  isLoading,
}: CategoryChartProps) {
  if (isLoading) return <CategoryChartSkeleton />;

  const data = byCategory.map((cat) => ({
    ...cat,
    name: cat.type,
    value: cat.totalCo2e,
    fill: COLORS[cat.type] ?? "#94a3b8",
  }));

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">
        카테고리별 배출 비율
      </h3>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="90%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={110}
            paddingAngle={1}
            dataKey="value"
            animationDuration={700}
            stroke="none"
          />
          <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
