"use client";

import { Zap, Package, Truck, Leaf } from "lucide-react";
import SummaryCard from "./SummaryCard";
import { CardSkeleton } from "./skeleton/CardSkeleton";
import { formatCo2e } from "@/lib/pcf-calculator";

interface CategorySummary {
  type: string;
  totalCo2e: number;
  scope: string;
  percentage: number;
}

interface SummaryCardsProps {
  totalCo2e: number;
  byCategory: CategorySummary[];
  isLoading: boolean;
}

const CATEGORY_CONFIG = {
  전기: {
    icon: <Zap size={20} />,
    iconColor: "text-[#08428C]",
    iconBg: "bg-[#e8f0f9]",
  },
  원소재: {
    icon: <Package size={20} />,
    iconColor: "text-[#2995D9]",
    iconBg: "bg-[#edf6fd]",
  },
  운송: {
    icon: <Truck size={20} />,
    iconColor: "text-[#79CFF2]",
    iconBg: "bg-[#f0faff]",
  },
} as const;

export default function SummaryCards({
  totalCo2e,
  byCategory,
  isLoading,
}: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const total = formatCo2e(totalCo2e);

  const cards = [
    {
      label: "총 배출량",
      value: total.value,
      unit: total.unit,
      icon: <Leaf size={20} />,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
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
      };
    }),
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`animate-fade-in-up animate-stagger-1`}
        >
          <SummaryCard {...card} />
        </div>
      ))}
    </div>
  );
}
