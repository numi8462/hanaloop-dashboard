"use client";

import { Zap, Package, Truck, Leaf } from "lucide-react";
import SummaryCard from "./SummaryCard";
import { CardSkeleton } from "./skeleton/CardSkeleton";
import { formatCo2e } from "@/lib/pcf-calculator";
import { CATEGORY_COLORS } from "@/constants/colors";
import { CategorySummary, EmissionType, MonthlySummary } from "@/types";

interface SummaryCardsProps {
  totalCo2e: number;
  byCategory: CategorySummary[];
  byMonth: MonthlySummary[];
  isLoading: boolean;
}

const CATEGORY_CONFIG = {
  전기: {
    icon: <Zap size={20} />,
    iconColor: `text-[${CATEGORY_COLORS["전기"]}]`,
    iconBg: "bg-[#9f86ff]/10",
  },
  원소재: {
    icon: <Package size={20} />,
    iconColor: `text-[${CATEGORY_COLORS["원소재"]}]`,
    iconBg: "bg-[#2995d9]/10",
  },
  운송: {
    icon: <Truck size={20} />,
    iconColor: `text-[${CATEGORY_COLORS["운송"]}]`,
    iconBg: "bg-[#79cff2]/10",
  },
} as const;

// ─── 월별 데이터에서 특정 카테고리 또는 전체 CO₂e 추출 ────────────────────────
function getMonthlyTotal(month: MonthlySummary, type?: string): number {
  if (type) return month.byType[type as EmissionType] ?? 0;
  return Object.values(month.byType).reduce((s, v) => s + v, 0);
}

export default function SummaryCards({
  totalCo2e,
  byCategory,
  byMonth,
  isLoading,
}: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const sortedMonths = [...byMonth].sort((a, b) =>
    a.yearMonth.localeCompare(b.yearMonth),
  );

  // 데이터 기간
  const firstMonth = sortedMonths[0]?.yearMonth;
  const lastMonthData = sortedMonths[sortedMonths.length - 1]?.yearMonth;
  const period =
    firstMonth && lastMonthData
      ? `${firstMonth.replace("-", "년 ")}월 ~ ${lastMonthData.replace("-", "년 ")}월`
      : null;

  // 전월 대비 증감 계산 함수
  function calcMonthlyChange(type?: string): number | null {
    const last = sortedMonths[sortedMonths.length - 1];
    const prev = sortedMonths[sortedMonths.length - 2];
    if (!last || !prev) return null;
    const lastVal = getMonthlyTotal(last, type);
    const prevVal = getMonthlyTotal(prev, type);
    if (prevVal === 0) return null;
    return ((lastVal - prevVal) / prevVal) * 100;
  }

  // 피크월 계산 함수
  function calcPeakMonth(type?: string): string | null {
    if (sortedMonths.length === 0) return null;
    const peak = sortedMonths.reduce((max, m) =>
      getMonthlyTotal(m, type) > getMonthlyTotal(max, type) ? m : max,
    );
    const [year, month] = peak.yearMonth.split("-");
    return `${year}년 ${parseInt(month)}월`;
  }

  const total = formatCo2e(totalCo2e);

  const cards = [
    {
      label: "총 배출량",
      value: total.value,
      unit: total.unit,
      icon: <Leaf size={20} />,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      monthlyChange: calcMonthlyChange(),
      peakMonth: calcPeakMonth(),
      period,
    },
    ...["전기", "원소재", "운송"].map((type) => {
      const cat = byCategory.find((c) => c.type === type);
      const fmt = formatCo2e(cat?.totalCo2e ?? 0);
      const cfg = CATEGORY_CONFIG[type as keyof typeof CATEGORY_CONFIG];
      return {
        label: type,
        value: fmt.value,
        unit: fmt.unit,
        icon: cfg.icon,
        iconColor: cfg.iconColor,
        iconBg: cfg.iconBg,
        percentage: cat?.percentage ?? 0,
        scope: cat?.scope,
        monthlyChange: calcMonthlyChange(type),
        peakMonth: calcPeakMonth(type),
      };
    }),
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="animate-fade-in-up animate-stagger-1">
          <SummaryCard {...card} />
        </div>
      ))}
    </div>
  );
}
