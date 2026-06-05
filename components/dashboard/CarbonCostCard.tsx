"use client";

import { useState } from "react";
import { DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategorySummary, MonthlySummary } from "@/types";
import CarbonCostCardSkeleton from "@/components/dashboard/skeleton/CarbonCostCardSkeleton";

interface CarbonCostCardProps {
  totalCo2e: number;
  byCategory: CategorySummary[];
  byMonth: MonthlySummary[];
  isLoading: boolean;
}

const DEFAULT_PRICE_PER_TON = 16000;

// kgCO₂e → 원 변환
function toCost(kgCo2e: number, pricePerTon: number): number {
  return (kgCo2e / 1000) * pricePerTon;
}

export default function CarbonCostCard({
  totalCo2e,
  byCategory,
  byMonth,
  isLoading,
}: CarbonCostCardProps) {
  const [pricePerTon, setPricePerTon] = useState(DEFAULT_PRICE_PER_TON);
  const [isOpen, setIsOpen] = useState(false);

  const totalCost = toCost(totalCo2e, pricePerTon);

  // ─── 전월 대비 증감 계산 ────────────────────────────────────────────────────
  const sortedMonths = [...byMonth].sort((a, b) =>
    a.yearMonth.localeCompare(b.yearMonth),
  );
  const lastMonth = sortedMonths[sortedMonths.length - 1];
  const prevMonth = sortedMonths[sortedMonths.length - 2];

  const lastMonthCo2e = lastMonth
    ? Object.values(lastMonth.byType).reduce((s, v) => s + v, 0)
    : 0;
  const prevMonthCo2e = prevMonth
    ? Object.values(prevMonth.byType).reduce((s, v) => s + v, 0)
    : 0;

  const monthlyChange =
    prevMonthCo2e > 0
      ? ((lastMonthCo2e - prevMonthCo2e) / prevMonthCo2e) * 100
      : null;

  if (isLoading) return <CarbonCostCardSkeleton />;

  return (
    <div className="card p-5 flex flex-col justify-between h-full">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-3 h-12 min-w-0">
        <div className="min-w-0 flex-1 mr-2">
          <p className="text-sm font-semibold text-slate-100 truncate">
            탄소 비용
          </p>
          <span className="text-xs font-medium text-slate-300">
            K-ETS 배출권 기준
          </span>
        </div>
        <div className="rounded-xl flex items-center justify-center w-10 h-10 shrink-0 bg-emerald-500/20 text-emerald-400">
          <DollarSign size={18} />
        </div>
      </div>

      {/* 예상 비용 */}
      <div className="flex items-baseline gap-1.5 min-w-0 mb-1">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-100 truncate">
          {totalCost.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}
        </span>
        <span className="text-xs lg:text-sm font-medium text-slate-300 shrink-0">
          원
        </span>
      </div>

      {/* 전월 대비 증감 */}
      {monthlyChange !== null && (
        <p className="text-xs mb-3">
          {monthlyChange >= 0 ? (
            <span className="text-red-400">
              전월 대비 ▲ {Math.abs(monthlyChange).toFixed(1)}% 증가
            </span>
          ) : (
            <span className="text-emerald-400">
              전월 대비 ▼ {Math.abs(monthlyChange).toFixed(1)}% 감소
            </span>
          )}
        </p>
      )}

      {/* 단가 입력 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-slate-400 shrink-0">단가</span>
        <Input
          type="number"
          value={pricePerTon}
          onChange={(e) => setPricePerTon(Number(e.target.value))}
          className="w-28 text-right"
        />
        <span className="text-xs text-slate-400 shrink-0">원/tCO₂e</span>
      </div>

      {/* 자세히 보기 토글 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
      >
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {isOpen ? "접기" : "자세히 보기"}
      </button>

      {/* 자세히 보기 패널 */}
      {isOpen && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          {/* 계산 방식 */}
          <p className="text-xs font-medium text-slate-300 mb-2">계산 방식</p>
          <div className="text-xs text-slate-400 bg-slate-800/50 rounded-lg px-3 py-2 mb-3">
            <p>
              총 배출량{" "}
              <span className="text-slate-200">
                {totalCo2e.toLocaleString("ko-KR", {
                  maximumFractionDigits: 2,
                })}{" "}
                kgCO₂e
              </span>
            </p>
            <p>
              = {(totalCo2e / 1000).toFixed(3)} tCO₂e ×{" "}
              {pricePerTon.toLocaleString("ko-KR")}원
            </p>
            <p className="text-emerald-400 font-medium mt-1">
              ={" "}
              {totalCost.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}
              원
            </p>
          </div>

          {/* 카테고리별 비용 */}
          <p className="text-xs font-medium text-slate-300 mb-2">
            카테고리별 비용
          </p>
          <div className="flex flex-col gap-1.5">
            {byCategory.map((cat) => (
              <div
                key={cat.type}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-slate-400">{cat.type}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">
                    {cat.totalCo2e.toLocaleString("ko-KR", {
                      maximumFractionDigits: 1,
                    })}{" "}
                    kg
                  </span>
                  <span className="text-slate-200">
                    {toCost(cat.totalCo2e, pricePerTon).toLocaleString(
                      "ko-KR",
                      { maximumFractionDigits: 0 },
                    )}
                    원
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
