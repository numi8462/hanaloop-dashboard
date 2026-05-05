"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MonthlySummary } from "@/types";
import MonthlyTrendChartSkeleton from "./skeleton/MontlyTrendChartSkeleton";
import { CATEGORY_COLORS } from "@/constants/colors";

// ─── 타입 ─────────────────────────────────────────────────────────────────────
interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

interface LegendPayloadItem {
  value: string;
  color: string;
}

interface CustomLegendProps {
  payload?: LegendPayloadItem[];
}

// ─── 커스텀 툴팁 ──────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((sum, p) => sum + (p.value || 0), 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-slate-900 mb-2">{label}</p>
      {payload.map((p) => (
        <div
          key={p.name}
          className="flex items-center justify-between gap-4 mb-0.5"
        >
          <div className="flex items-center gap-1.5">
            <div
              className="rounded-full w-1.5 h-1.5"
              style={{ background: p.color }}
            />
            <span className="text-slate-500">{p.name}</span>
          </div>
          <span className="font-medium text-slate-900">
            {p.value?.toFixed(1)} kg
          </span>
        </div>
      ))}
      <div className="flex justify-between mt-1.5 pt-1.5 border-t border-slate-100">
        <span className="text-slate-400">합계</span>
        <span className="font-semibold text-slate-900">
          {total.toFixed(1)} kgCO₂e
        </span>
      </div>
    </div>
  );
}

// ─── 커스텀 레전드 ────────────────────────────────────────────────────────────
function CustomLegend({ payload }: CustomLegendProps) {
  return (
    <div className="flex justify-center gap-4 mt-1">
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

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
interface MonthlyTrendChartProps {
  byMonth: MonthlySummary[];
  isLoading: boolean;
}

type ChartMode = "stack" | "group";

export default function MonthlyTrendChart({
  byMonth,
  isLoading,
}: MonthlyTrendChartProps) {
  const [mode, setMode] = useState<ChartMode>("stack");
  const [hasLoaded, setHasLoaded] = useState(false);

  if (isLoading) return <MonthlyTrendChartSkeleton />;

  const data = byMonth.map((m) => ({
    name: `${parseInt(m.yearMonth.split("-")[1])}월`,
    전기: parseFloat((m.byType["전기"] || 0).toFixed(2)),
    원소재: parseFloat((m.byType["원소재"] || 0).toFixed(2)),
    운송: parseFloat((m.byType["운송"] || 0).toFixed(2)),
  }));

  function handleModeChange(newMode: ChartMode) {
    setMode(newMode);
    setHasLoaded(true);
  }

  return (
    <div className="card p-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">
          월별 배출량 추이
        </h3>
        <div className="flex items-center gap-2">
          {/* 토글 버튼 */}
          <div className="flex rounded-lg overflow-hidden border border-slate-200 text-xs">
            <button
              onClick={() => handleModeChange("stack")}
              className={`px-3 py-1.5 font-medium transition-colors ${
                mode === "stack"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              누적
            </button>
            <button
              onClick={() => handleModeChange("group")}
              className={`px-3 py-1.5 font-medium transition-colors ${
                mode === "group"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              그룹
            </button>
          </div>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
            kgCO₂e
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            width={45}
          />
          <Tooltip
            content={<CustomTooltip />}
            isAnimationActive={false}
            cursor={{ fill: "#f8fafc" }}
          />
          <Legend content={<CustomLegend />} />

          {mode === "stack" ? (
            <>
              <Bar
                dataKey="전기"
                stackId="a"
                fill={CATEGORY_COLORS["전기"]}
                barSize={30}
                isAnimationActive={!hasLoaded}
              />
              <Bar
                dataKey="원소재"
                stackId="a"
                fill={CATEGORY_COLORS["원소재"]}
                barSize={30}
                isAnimationActive={!hasLoaded}
              />
              <Bar
                dataKey="운송"
                stackId="a"
                fill={CATEGORY_COLORS["운송"]}
                radius={[4, 4, 0, 0]}
                barSize={30}
                isAnimationActive={!hasLoaded}
              />
            </>
          ) : (
            <>
              <Bar
                dataKey="전기"
                fill={CATEGORY_COLORS["전기"]}
                barSize={30}
                isAnimationActive={!hasLoaded}
              />
              <Bar
                dataKey="원소재"
                fill={CATEGORY_COLORS["원소재"]}
                barSize={30}
                isAnimationActive={!hasLoaded}
              />
              <Bar
                dataKey="운송"
                fill={CATEGORY_COLORS["운송"]}
                barSize={30}
                isAnimationActive={!hasLoaded}
              />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
