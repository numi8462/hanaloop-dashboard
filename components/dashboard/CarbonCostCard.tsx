"use client";

import { useState } from "react";
import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import CarbonCostCardSkeleton from "@/components/dashboard/skeleton/CarbonCostCardSkeleton";

interface CarbonCostCardProps {
  totalCo2e: number;
  isLoading: boolean;
}

const DEFAULT_PRICE_PER_TON = 16000;

export default function CarbonCostCard({
  totalCo2e,
  isLoading,
}: CarbonCostCardProps) {
  const [pricePerTon, setPricePerTon] = useState(DEFAULT_PRICE_PER_TON);

  const totalCost = (totalCo2e / 1000) * pricePerTon;

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
      <div className="flex items-baseline gap-1.5 min-w-0 mb-3">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-100 truncate">
          {totalCost.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}
        </span>
        <span className="text-xs lg:text-sm font-medium text-slate-300 shrink-0">
          원
        </span>
      </div>

      {/* 단가 입력 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 shrink-0">단가</span>
        <Input
          type="number"
          value={pricePerTon}
          onChange={(e) => setPricePerTon(Number(e.target.value))}
          className="w-28 text-right"
        />
        <span className="text-xs text-slate-400 shrink-0">원/tCO₂e</span>
      </div>
    </div>
  );
}
