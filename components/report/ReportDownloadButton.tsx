"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { CategorySummary, MonthlySummary } from "@/types";
import { GoalData } from "@/lib/db/goals";
import { generateExcelReport } from "@/lib/report";

interface ReportDownloadButtonProps {
  totalCo2e: number;
  byCategory: CategorySummary[];
  byMonth: MonthlySummary[];
  goals: GoalData[];
  pricePerTon: number;
  disabled?: boolean;
}

export default function ReportDownloadButton({
  totalCo2e,
  byCategory,
  byMonth,
  goals,
  pricePerTon,
  disabled,
}: ReportDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleDownload() {
    setIsGenerating(true);
    try {
      generateExcelReport({
        totalCo2e,
        byCategory,
        byMonth,
        goals,
        pricePerTon,
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || isGenerating}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#533afd] hover:bg-[#4434d4] disabled:bg-[#a8c3de] disabled:cursor-not-allowed transition-colors"
    >
      <Download size={16} />
      {isGenerating ? "생성 중..." : "Excel 보고서 다운로드"}
    </button>
  );
}
